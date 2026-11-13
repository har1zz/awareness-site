-- =====================================================================
-- Awareness site: database schema, security rules, and moderation logic.
-- Run ONCE in Supabase: Dashboard -> SQL Editor -> New query -> paste -> Run.
-- Safe on an empty project. It is tested in scripts/test-db.mjs.
--
-- Security model (summary):
--  * Every table has Row Level Security (RLS) ON. The browser never talks to
--    the database directly; the server does, but RLS still applies.
--  * Public (anon) can read ONLY approved videos/stories, verified-contributor
--    public profiles, directory entries and feature flags.
--  * Only users with profiles.role = 'admin' can approve/reject/publish.
--  * Triggers stop contributors changing status, approval fields, or other
--    people's data even if they call the API by hand.
-- =====================================================================

-- ---------- profiles (role lives here; set to 'admin' only via SQL) ----------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

create function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id) values (new.id) on conflict do nothing;
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

create policy "profiles: read own or admin" on public.profiles
  for select to authenticated using (id = auth.uid() or public.is_admin());
-- No insert/update/delete policies or grants: roles can only be changed with SQL.

-- ---------- feature flags (two-step launch) ----------
create table public.site_settings (
  key text primary key check (key in ('contributors_open', 'videos_open', 'stories_open', 'contact_open')),
  value boolean not null default false,
  updated_at timestamptz not null default now()
);
insert into public.site_settings (key, value) values
  ('contributors_open', false), ('videos_open', false), ('stories_open', false), ('contact_open', false);
alter table public.site_settings enable row level security;

create function public.setting_on(k text) returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((select value from public.site_settings where key = k), false);
$$;

create policy "settings: anyone can read" on public.site_settings
  for select to anon, authenticated using (true);
create policy "settings: admin can change" on public.site_settings
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------- healthcare professional applications ----------
create table public.contributor_applications (
  user_id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null check (char_length(full_name) between 2 and 120),
  specialty text not null check (char_length(specialty) between 2 and 120),
  country text not null check (char_length(country) between 2 and 80),
  licence_body text not null check (char_length(licence_body) between 2 and 160),
  licence_number text not null check (char_length(licence_number) between 2 and 80),
  workplace text check (char_length(workplace) <= 160),
  bio text not null check (char_length(bio) between 20 and 1000),
  consent_public boolean not null check (consent_public),
  consent_accuracy boolean not null check (consent_accuracy),
  status text not null default 'pending'
    check (status in ('pending', 'more_info', 'verified', 'rejected', 'suspended')),
  admin_note text check (char_length(admin_note) <= 1000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.contributor_applications enable row level security;

create function public.is_verified_contributor() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.contributor_applications
                 where user_id = auth.uid() and status = 'verified');
$$;

create policy "applications: read own or admin" on public.contributor_applications
  for select to authenticated using (user_id = auth.uid() or public.is_admin());
create policy "applications: apply when open" on public.contributor_applications
  for insert to authenticated
  with check (user_id = auth.uid() and status = 'pending' and admin_note is null
              and public.setting_on('contributors_open'));
create policy "applications: owner edits while pending" on public.contributor_applications
  for update to authenticated
  using (user_id = auth.uid() and status in ('pending', 'more_info'))
  with check (user_id = auth.uid());
create policy "applications: admin updates" on public.contributor_applications
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "applications: admin deletes" on public.contributor_applications
  for delete to authenticated using (public.is_admin());

create function public.applications_guard() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  new.user_id := old.user_id;
  new.created_at := old.created_at;
  new.updated_at := now();
  if auth.uid() is not null and not public.is_admin() then
    new.admin_note := old.admin_note;
    if new.status is distinct from old.status then
      if not (old.status in ('pending', 'more_info') and new.status = 'pending') then
        raise exception 'You cannot change the review status.' using errcode = '42501';
      end if;
    end if;
  end if;
  return new;
end $$;
create trigger applications_guard before update on public.contributor_applications
  for each row execute function public.applications_guard();

-- Public, safe-columns-only view of VERIFIED contributors (never exposes licence data).
create view public.contributor_public with (security_invoker = false) as
  select user_id, full_name, specialty, country, workplace, bio
  from public.contributor_applications
  where status = 'verified' and consent_public;

-- ---------- videos (external links only; nothing public until approved) ----------
create table public.videos (
  id uuid primary key default gen_random_uuid(),
  contributor_id uuid not null references auth.users (id) on delete cascade,
  title text not null check (char_length(title) between 5 and 140),
  description text not null check (char_length(description) between 20 and 1000),
  topic text not null check (topic in
    ('understanding', 'symptoms', 'risk', 'screening', 'treatment', 'living', 'support', 'other')),
  language text not null check (language in ('en', 'ur', 'ar', 'other')),
  audience text not null check (audience in ('public', 'patients', 'caregivers', 'professionals')),
  provider text not null check (provider in ('youtube', 'vimeo')),
  video_ref text not null,
  video_hash text,
  transcript text not null check (char_length(transcript) between 100 and 20000),
  reference_links text check (char_length(reference_links) <= 2000),
  attribution text not null check (char_length(attribution) between 2 and 200),
  consent_ownership boolean not null check (consent_ownership),
  consent_patient_privacy boolean not null check (consent_patient_privacy),
  status text not null default 'pending'
    check (status in ('pending', 'changes_requested', 'approved', 'rejected', 'unpublished', 'withdrawn')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz,
  constraint video_ref_format check (
    (provider = 'youtube' and video_ref ~ '^[A-Za-z0-9_-]{11}$')
    or (provider = 'vimeo' and video_ref ~ '^[0-9]{5,12}$')),
  constraint video_hash_format check (
    video_hash is null or (provider = 'vimeo' and video_hash ~ '^[a-f0-9]{6,20}$'))
);
create index videos_status_idx on public.videos (status, published_at desc);
alter table public.videos enable row level security;

create policy "videos: anyone sees approved" on public.videos
  for select to anon, authenticated using (status = 'approved');
create policy "videos: owner or admin sees all" on public.videos
  for select to authenticated using (contributor_id = auth.uid() or public.is_admin());
create policy "videos: verified contributor submits when open" on public.videos
  for insert to authenticated
  with check (contributor_id = auth.uid() and status = 'pending' and published_at is null
              and public.setting_on('videos_open') and public.is_verified_contributor());
create policy "videos: owner updates own" on public.videos
  for update to authenticated using (contributor_id = auth.uid()) with check (contributor_id = auth.uid());
create policy "videos: admin updates" on public.videos
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "videos: admin deletes" on public.videos
  for delete to authenticated using (public.is_admin());

create function public.videos_guard() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  is_adm boolean := public.is_admin();
  privileged boolean := (auth.uid() is null);   -- SQL editor / service role only
  content_changed boolean;
begin
  if tg_op = 'INSERT' then
    if not (is_adm or privileged) then
      if (select count(*) from public.videos
          where contributor_id = new.contributor_id and status = 'pending') >= 5 then
        raise exception 'You already have 5 videos waiting for review.';
      end if;
    end if;
    return new;
  end if;

  new.id := old.id;
  new.contributor_id := old.contributor_id;
  new.created_at := old.created_at;
  new.updated_at := now();

  if is_adm or privileged then
    if new.status is distinct from old.status and not privileged then
      if not (
        (old.status = 'pending' and new.status in ('approved', 'rejected', 'changes_requested'))
        or (old.status = 'changes_requested' and new.status = 'rejected')
        or (old.status = 'approved' and new.status = 'unpublished')
        or (old.status = 'unpublished' and new.status = 'approved')
      ) then
        raise exception 'That status change is not allowed (% -> %).', old.status, new.status;
      end if;
    end if;
    if new.status = 'approved' and old.status is distinct from 'approved' then
      new.published_at := now();
    end if;
    return new;
  end if;

  -- ----- the contributor (owner) -----
  new.published_at := old.published_at;
  content_changed := (new.title, new.description, new.topic, new.language, new.audience,
                      new.provider, new.video_ref, new.video_hash, new.transcript,
                      new.reference_links, new.attribution, new.consent_ownership,
                      new.consent_patient_privacy)
                     is distinct from
                     (old.title, old.description, old.topic, old.language, old.audience,
                      old.provider, old.video_ref, old.video_hash, old.transcript,
                      old.reference_links, old.attribution, old.consent_ownership,
                      old.consent_patient_privacy);

  if new.status is distinct from old.status then
    if new.status = 'withdrawn' and old.status in ('pending', 'changes_requested', 'approved') then
      if content_changed then raise exception 'Withdraw without editing.'; end if;
    elsif new.status = 'pending' and old.status = 'changes_requested' then
      if not content_changed then
        raise exception 'Please make the requested changes before resubmitting.';
      end if;
      if not public.is_verified_contributor() then
        raise exception 'Your contributor access is not active.' using errcode = '42501';
      end if;
    else
      raise exception 'You cannot change the review status.' using errcode = '42501';
    end if;
  elsif content_changed then
    if old.status <> 'pending' then
      raise exception 'This video can no longer be edited.' using errcode = '42501';
    end if;
    if not public.is_verified_contributor() then
      raise exception 'Your contributor access is not active.' using errcode = '42501';
    end if;
  end if;
  return new;
end $$;
create trigger videos_guard before insert or update on public.videos
  for each row execute function public.videos_guard();

-- ---------- moderation history (decision + feedback) ----------
create table public.video_reviews (
  id uuid primary key default gen_random_uuid(),
  video_id uuid not null references public.videos (id) on delete cascade,
  admin_id uuid references auth.users (id) on delete set null,
  decision text not null check (decision in ('approved', 'rejected', 'changes_requested', 'unpublished')),
  message text check (char_length(message) <= 2000),
  created_at timestamptz not null default now()
);
alter table public.video_reviews enable row level security;
create policy "reviews: admin or video owner reads" on public.video_reviews
  for select to authenticated using (
    public.is_admin()
    or exists (select 1 from public.videos v where v.id = video_id and v.contributor_id = auth.uid()));
create policy "reviews: admin writes" on public.video_reviews
  for insert to authenticated with check (public.is_admin() and admin_id = auth.uid());

-- One atomic, admin-only call to decide on a video. SECURITY INVOKER, so RLS and
-- the guard trigger still apply. p_seen is the updated_at the admin was looking at:
-- if the contributor edited the video meanwhile, the decision is refused.
create function public.review_video(p_video uuid, p_decision text, p_message text, p_seen timestamptz)
returns void language plpgsql as $$
begin
  if not public.is_admin() then
    raise exception 'Only an administrator can do this.' using errcode = '42501';
  end if;
  if p_decision not in ('approved', 'rejected', 'changes_requested', 'unpublished') then
    raise exception 'Unknown decision.';
  end if;
  if p_decision <> 'approved' and coalesce(btrim(p_message), '') = '' then
    raise exception 'A message is required for this decision.';
  end if;
  update public.videos set status = p_decision where id = p_video and updated_at = p_seen;
  if not found then
    raise exception 'The video changed or was not found. Reload and review it again.';
  end if;
  insert into public.video_reviews (video_id, admin_id, decision, message)
  values (p_video, auth.uid(), p_decision, nullif(btrim(p_message), ''));
end $$;

-- ---------- stories (moderated; no account needed to submit) ----------
create table public.stories (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('patient', 'survivor', 'caregiver', 'supporter')),
  title text not null check (char_length(title) between 3 and 140),
  body text not null check (char_length(body) between 100 and 6000),
  display_name text check (char_length(display_name) <= 60),
  is_anonymous boolean not null default true,
  content_warning text check (char_length(content_warning) <= 200),
  language text not null check (language in ('en', 'ur', 'ar', 'other')),
  consent_publish boolean not null check (consent_publish),
  consent_real boolean not null check (consent_real),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  published_at timestamptz,
  constraint story_name_rule check (
    (is_anonymous and display_name is null) or (not is_anonymous and display_name is not null))
);
alter table public.stories enable row level security;
create policy "stories: anyone sees approved" on public.stories
  for select to anon, authenticated using (status = 'approved');
create policy "stories: admin sees all" on public.stories
  for select to authenticated using (public.is_admin());
create policy "stories: anyone submits when open" on public.stories
  for insert to anon, authenticated
  with check (status = 'pending' and published_at is null and public.setting_on('stories_open'));
create policy "stories: admin updates" on public.stories
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "stories: admin deletes" on public.stories
  for delete to authenticated using (public.is_admin());

-- Flood protection for anonymous inserts: at most N rows per minute site-wide.
create function public.throttle() returns trigger
language plpgsql security definer set search_path = public as $$
declare n int;
begin
  execute format('select count(*) from public.%I where created_at > now() - interval ''1 minute''', tg_table_name)
    into n;
  if n >= tg_argv[0]::int then
    raise exception 'Too many submissions right now. Please try again in a few minutes.';
  end if;
  return new;
end $$;
create trigger stories_throttle before insert on public.stories
  for each row execute function public.throttle('5');

create function public.stories_guard() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  new.id := old.id;
  new.created_at := old.created_at;
  if new.status = 'approved' and old.status is distinct from 'approved' then
    new.published_at := now();
  end if;
  return new;
end $$;
create trigger stories_guard before update on public.stories
  for each row execute function public.stories_guard();

-- ---------- contact messages (optional anonymous) ----------
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  topic text not null check (topic in ('correction', 'accessibility', 'privacy', 'feedback', 'other')),
  name text check (char_length(name) <= 80),
  email text check (email is null or (char_length(email) <= 200 and email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$')),
  message text not null check (char_length(message) between 10 and 2000),
  consent boolean not null check (consent),
  handled boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.messages enable row level security;
create policy "messages: anyone sends when open" on public.messages
  for insert to anon, authenticated
  with check (handled = false and public.setting_on('contact_open'));
create policy "messages: admin reads" on public.messages
  for select to authenticated using (public.is_admin());
create policy "messages: admin updates" on public.messages
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "messages: admin deletes" on public.messages
  for delete to authenticated using (public.is_admin());
create trigger messages_throttle before insert on public.messages
  for each row execute function public.throttle('5');

-- ---------- support directory (admin managed) ----------
create table public.directory_entries (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 3 and 160),
  country text not null check (char_length(country) between 2 and 80),
  city text check (char_length(city) <= 80),
  region text check (char_length(region) <= 80),
  service_types text[] not null default '{}'
    check (service_types <@ array['screening', 'diagnosis', 'treatment', 'support', 'information', 'counselling', 'other']::text[]),
  languages text[] not null default '{}',
  website text check (website is null or website ~ '^https://'),
  phone text check (char_length(phone) <= 60),
  address text check (char_length(address) <= 300),
  about text check (char_length(about) <= 600),
  source_url text check (source_url is null or source_url ~ '^https://'),
  last_verified date,
  status text not null default 'unverified' check (status in ('verified', 'unverified', 'suspended')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint verified_needs_proof check (
    status <> 'verified' or (last_verified is not null and source_url is not null))
);
alter table public.directory_entries enable row level security;
create policy "directory: anyone sees listed" on public.directory_entries
  for select to anon, authenticated using (status in ('verified', 'unverified'));
create policy "directory: admin sees all" on public.directory_entries
  for select to authenticated using (public.is_admin());
create policy "directory: admin inserts" on public.directory_entries
  for insert to authenticated with check (public.is_admin());
create policy "directory: admin updates" on public.directory_entries
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "directory: admin deletes" on public.directory_entries
  for delete to authenticated using (public.is_admin());
create function public.touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at := now(); return new; end $$;
create trigger directory_touch before update on public.directory_entries
  for each row execute function public.touch_updated_at();

-- ---------- audit log (written only by triggers; readable only by admins) ----------
create table public.audit_log (
  id uuid primary key default gen_random_uuid(),
  actor uuid,
  action text not null,
  target_type text not null,
  target_id text,
  detail jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index audit_log_created_idx on public.audit_log (created_at desc);
alter table public.audit_log enable row level security;
create policy "audit: admin reads" on public.audit_log
  for select to authenticated using (public.is_admin());

create function public.audit_change() returns trigger
language plpgsql security definer set search_path = public as $$
declare a text; tid text; d jsonb := '{}'::jsonb;
begin
  if tg_table_name = 'videos' then
    a := 'video.' || new.status; tid := new.id::text;
    d := jsonb_build_object('from', old.status, 'to', new.status, 'title', new.title);
  elsif tg_table_name = 'contributor_applications' then
    if tg_op = 'INSERT' then
      a := 'application.submitted'; tid := new.user_id::text;
    else
      a := 'application.' || new.status; tid := new.user_id::text;
      d := jsonb_build_object('from', old.status, 'to', new.status, 'note', new.admin_note);
    end if;
  elsif tg_table_name = 'stories' then
    a := 'story.' || new.status; tid := new.id::text;
    d := jsonb_build_object('from', old.status, 'to', new.status);
  elsif tg_table_name = 'directory_entries' then
    if tg_op = 'DELETE' then
      a := 'directory.deleted'; tid := old.id::text; d := jsonb_build_object('name', old.name);
    elsif tg_op = 'INSERT' then
      a := 'directory.created'; tid := new.id::text;
      d := jsonb_build_object('name', new.name, 'status', new.status);
    else
      a := 'directory.updated'; tid := new.id::text;
      d := jsonb_build_object('name', new.name, 'status', new.status);
    end if;
  elsif tg_table_name = 'site_settings' then
    a := 'setting.changed'; tid := new.key; d := jsonb_build_object('value', new.value);
  elsif tg_table_name = 'profiles' then
    a := 'role.changed'; tid := new.id::text;
    d := jsonb_build_object('from', old.role, 'to', new.role);
  elsif tg_table_name = 'messages' then
    a := 'message.deleted'; tid := old.id::text;
  end if;
  insert into public.audit_log (actor, action, target_type, target_id, detail)
  values (auth.uid(), a, tg_table_name, tid, d);
  if tg_op = 'DELETE' then return old; end if;
  return new;
end $$;

create trigger audit_videos after update on public.videos
  for each row when (old.status is distinct from new.status) execute function public.audit_change();
create trigger audit_applications_ins after insert on public.contributor_applications
  for each row execute function public.audit_change();
create trigger audit_applications_upd after update on public.contributor_applications
  for each row when (old.status is distinct from new.status) execute function public.audit_change();
create trigger audit_stories after update on public.stories
  for each row when (old.status is distinct from new.status) execute function public.audit_change();
create trigger audit_directory after insert or update or delete on public.directory_entries
  for each row execute function public.audit_change();
create trigger audit_settings after update on public.site_settings
  for each row when (old.value is distinct from new.value) execute function public.audit_change();
create trigger audit_profiles after update on public.profiles
  for each row when (old.role is distinct from new.role) execute function public.audit_change();
create trigger audit_messages after delete on public.messages
  for each row execute function public.audit_change();

-- Suspending a contributor immediately takes their public videos down.
create function public.on_contributor_suspended() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.video_reviews (video_id, admin_id, decision, message)
    select id, auth.uid(), 'unpublished', 'Contributor suspended' from public.videos
    where contributor_id = new.user_id and status = 'approved';
  update public.videos set status = 'unpublished'
    where contributor_id = new.user_id and status = 'approved';
  return new;
end $$;
create trigger contributor_suspended after update on public.contributor_applications
  for each row when (new.status = 'suspended' and old.status is distinct from 'suspended')
  execute function public.on_contributor_suspended();

-- ---------- let people delete their own account and data ----------
create function public.delete_my_account() returns void
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'Not signed in.'; end if;
  if public.is_admin() then
    raise exception 'Administrator accounts cannot be deleted from the website.';
  end if;
  delete from auth.users where id = auth.uid();   -- cascades to profile, application, videos
end $$;

-- ---------- permissions: start from nothing, grant only what is needed ----------
revoke all on all tables in schema public from anon, authenticated;
revoke all on all functions in schema public from public, anon, authenticated;
alter default privileges in schema public revoke all on tables from anon, authenticated;
alter default privileges in schema public revoke all on functions from public, anon, authenticated;

grant usage on schema public to anon, authenticated;

grant execute on function public.setting_on(text) to anon, authenticated;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.is_verified_contributor() to authenticated;
grant execute on function public.review_video(uuid, text, text, timestamptz) to authenticated;
grant execute on function public.delete_my_account() to authenticated;

grant select on public.site_settings to anon, authenticated;
grant update (value, updated_at) on public.site_settings to authenticated;

grant select on public.profiles to authenticated;

grant select, insert, update, delete on public.contributor_applications to authenticated;
grant select on public.contributor_public to anon, authenticated;

grant select on public.videos to anon;
grant select, insert, update, delete on public.videos to authenticated;
grant select, insert on public.video_reviews to authenticated;

grant select, insert on public.stories to anon;
grant select, insert, update, delete on public.stories to authenticated;

grant insert on public.messages to anon;
grant select, insert, update, delete on public.messages to authenticated;

grant select on public.directory_entries to anon;
grant select, insert, update, delete on public.directory_entries to authenticated;

grant select on public.audit_log to authenticated;
