// Tests the database security rules against a real Postgres engine (PGlite),
// with a stand-in for Supabase's auth schema. No network or Supabase account needed.
//   npm run test:db
import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";

const db = new PGlite();
let pass = 0, failed = 0;
const ok = (cond, name, extra = "") => {
  if (cond) pass++;
  else { failed++; console.log(`FAIL  ${name} ${extra}`); }
};

// ---- stand-in for Supabase: roles + auth schema ----
await db.exec(`
  create role anon nologin; create role authenticated nologin;
  create schema auth;
  create table auth.users (id uuid primary key default gen_random_uuid(), email text unique);
  create function auth.uid() returns uuid language sql stable as $$
    select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
  grant usage on schema auth to anon, authenticated;
`);
await db.exec(readFileSync(process.env.MIGRATION ?? new URL("../supabase/migrations/0001_init.sql", import.meta.url), "utf8"));

// run SQL as a role / user, each in its own transaction
async function run(role, uid, sql, params = []) {
  await db.exec("begin");
  try {
    await db.exec(`set local role ${role}`);
    await db.query(`select set_config('request.jwt.claim.sub', $1, true)`, [uid ?? ""]);
    const r = await db.query(sql, params);
    await db.exec("commit");
    return { ok: true, rows: r.rows };
  } catch (e) {
    await db.exec("rollback");
    return { ok: false, error: e.message };
  }
}
const sys = async (sql, p = []) => (await db.query(sql, p)).rows;
const A = (uid) => (sql, p) => run("authenticated", uid, sql, p);
const anon = (sql, p) => run("anon", null, sql, p);

// ---- users ----
const mk = async (email) => (await sys(`insert into auth.users(email) values ($1) returning id`, [email]))[0].id;
const admin = await mk("admin@x"), doc = await mk("doc@x"), doc2 = await mk("doc2@x"),
      pend = await mk("pend@x"), user = await mk("user@x");
await sys(`update public.profiles set role='admin' where id=$1`, [admin]);
ok((await sys(`select count(*)::int n from public.profiles`))[0].n === 5, "profile auto-created for each user");

const asAdmin = A(admin), asDoc = A(doc), asDoc2 = A(doc2), asPend = A(pend), asUser = A(user);

const appSql = `insert into public.contributor_applications
  (user_id, full_name, specialty, country, licence_body, licence_number, bio, consent_public, consent_accuracy)
  values ($1,'Dr Test','Oncology','Pakistan','PMDC','12345-P','I am a breast surgeon with ten years of experience.',true,true)`;

// ================= profiles / roles =================
ok(!(await asUser(`update public.profiles set role='admin' where id=$1`, [user])).ok, "user cannot make self admin");
ok(!(await asUser(`insert into public.profiles(id, role) values (gen_random_uuid(),'admin')`)).ok, "user cannot insert profile");
ok(!(await anon(`select * from public.profiles`)).ok, "anon cannot read profiles");
ok((await asUser(`select * from public.profiles`)).rows.length === 1, "user sees only own profile");
ok((await asAdmin(`select * from public.profiles`)).rows.length === 5, "admin sees all profiles");

// ================= feature flags =================
ok((await anon(`select key, value from public.site_settings`)).rows.length === 4, "anon can read flags");
ok((await anon(`select key,value from public.site_settings`)).rows.every((r) => r.value === false), "all flags start OFF");
ok(!(await asUser(`update public.site_settings set value=true where key='stories_open'`)).ok ||
   (await anon(`select value from public.site_settings where key='stories_open'`)).rows[0].value === false,
   "user cannot flip a flag");
ok(!(await anon(`update public.site_settings set value=true`)).ok, "anon cannot update flags");

// ================= applications =================
ok(!(await asDoc(appSql, [doc])).ok, "application refused while contributors_open is OFF");
await asAdmin(`update public.site_settings set value=true where key='contributors_open'`);
ok((await asDoc(appSql, [doc])).ok, "application accepted when open");
ok(!(await asUser(appSql.replace("$1", "'" + doc2 + "'"), [])).ok, "cannot apply on behalf of someone else");
ok((await asDoc2(appSql, [doc2])).ok, "second applicant ok");
ok((await asPend(appSql, [pend])).ok, "third applicant ok");
ok(!(await asDoc(`update public.contributor_applications set status='verified' where user_id=$1`, [doc])).ok, "applicant cannot self-verify");
ok(!(await asDoc(`update public.contributor_applications set admin_note='hi' where user_id=$1`, [doc])).ok ||
   (await sys(`select admin_note from public.contributor_applications where user_id=$1`, [doc]))[0].admin_note === null,
   "applicant cannot write admin note");
ok((await asDoc2(`select * from public.contributor_applications`)).rows.length === 1, "applicant sees only own application");
ok(!(await anon(`select * from public.contributor_applications`)).ok, "anon cannot read applications");
ok((await asAdmin(`select licence_number from public.contributor_applications`)).rows.length === 3, "admin sees all applications");
ok((await anon(`select * from public.contributor_public`)).rows.length === 0, "nobody public before verification");

ok((await asAdmin(`update public.contributor_applications set status='verified' where user_id=$1`, [doc])).ok, "admin verifies doc");
ok((await asAdmin(`update public.contributor_applications set status='verified' where user_id=$1`, [doc2])).ok, "admin verifies doc2");
ok((await asAdmin(`update public.contributor_applications set status='more_info', admin_note='send number' where user_id=$1`, [pend])).ok, "admin asks pend for more info");
ok((await asPend(`update public.contributor_applications set bio='Updated bio with more details here', status='pending' where user_id=$1`, [pend])).ok, "applicant can resubmit after more_info");
const pub = await anon(`select * from public.contributor_public`);
ok(pub.rows.length === 2 && !("licence_number" in pub.rows[0]), "public view shows only verified, without licence data");
ok(!(await anon(`select licence_number from public.contributor_public`)).ok, "licence_number not reachable via view");

// ================= videos: submit =================
const vSql = (status = "pending", extra = "") => `insert into public.videos
  (contributor_id, title, description, topic, language, audience, provider, video_ref, transcript, attribution,
   consent_ownership, consent_patient_privacy, status ${extra ? "," + extra.split("=")[0] : ""})
  values ($1,'Understanding screening','A short video about what screening is and is not.','screening','en','public',
  'youtube','dQw4w9WgXcQ', '${"Transcript text. ".repeat(10)}','Dr Test, Oncologist',true,true,'${status}'
  ${extra ? "," + extra.split("=")[1] : ""}) returning id, updated_at::text as seen`;
ok(!(await asDoc(vSql(), [doc])).ok, "video refused while videos_open is OFF");
await asAdmin(`update public.site_settings set value=true where key='videos_open'`);
ok(!(await asPend(vSql(), [pend])).ok, "unverified applicant cannot submit video");
ok(!(await asUser(vSql(), [user])).ok, "user without application cannot submit video");
ok(!(await asDoc(vSql(), [user])).ok, "cannot submit video as another user");
ok(!(await asDoc(vSql("approved"), [doc])).ok, "contributor cannot insert an already-approved video");
ok(!(await asDoc(vSql("pending", "published_at=now()"), [doc])).ok, "contributor cannot pre-set published_at");
const bad = await asDoc(`insert into public.videos (contributor_id,title,description,topic,language,audience,provider,video_ref,transcript,attribution,consent_ownership,consent_patient_privacy)
  values ($1,'Bad embed here','A short video about what screening is and is not.','screening','en','public','youtube','"><script>', '${"x".repeat(120)}','Dr',true,true)`, [doc]);
ok(!bad.ok, "malformed video id rejected by DB");
ok(!(await asDoc(`insert into public.videos (contributor_id,title,description,topic,language,audience,provider,video_ref,transcript,attribution,consent_ownership,consent_patient_privacy)
  values ($1,'No consent here','A short video about what screening is and is not.','screening','en','public','youtube','dQw4w9WgXcQ','${"x".repeat(120)}','Dr',false,true)`, [doc])).ok, "ownership consent required");
const v1 = await asDoc(vSql(), [doc]);
ok(v1.ok, "verified contributor can submit video when open");
const vid = v1.rows[0].id;

// ================= videos: visibility =================
ok((await anon(`select id from public.videos`)).rows.length === 0, "PENDING video invisible to public");
ok((await anon(`select id from public.videos where id=$1`, [vid])).rows.length === 0, "PENDING video not reachable by id");
ok((await asDoc2(`select id from public.videos`)).rows.length === 0, "other contributor cannot see pending video");
ok((await asUser(`select id from public.videos`)).rows.length === 0, "random user cannot see pending video");
ok((await asDoc(`select id from public.videos`)).rows.length === 1, "owner sees own pending video");
ok((await asAdmin(`select id from public.videos`)).rows.length === 1, "admin sees pending video");

// ================= videos: contributor cannot publish =================
ok(!(await asDoc(`update public.videos set status='approved' where id=$1`, [vid])).ok, "contributor cannot approve own video");
ok(!(await asDoc(`update public.videos set status='approved', published_at=now() where id=$1`, [vid])).ok, "contributor cannot approve + backdate");
ok(!(await asDoc(`select public.review_video($1,'approved',null,now())`, [vid])).ok, "contributor cannot call review_video");
ok(!(await asDoc2(`update public.videos set title='Hijacked title' where id=$1`, [vid])).ok ||
   (await sys(`select title from public.videos where id=$1`, [vid]))[0].title !== "Hijacked title", "other contributor cannot edit my video");
ok(!(await asUser(`select public.review_video($1,'approved',null,now())`, [vid])).ok, "plain user cannot call review_video");
ok(!(await anon(`select public.review_video($1,'approved',null,now())`, [vid])).ok, "anon cannot call review_video");
ok(!(await asDoc(`insert into public.video_reviews(video_id, admin_id, decision) values ($1,$2,'approved')`, [vid, doc])).ok, "contributor cannot forge a review");
ok(!(await anon(`select * from public.video_reviews`)).ok, "anon cannot read reviews");

// owner can edit while pending
ok((await asDoc(`update public.videos set description='A short video about what screening is and is not, edited.' where id=$1`, [vid])).ok, "owner may edit while pending");
const seenNow = (await sys(`select updated_at::text s from public.videos where id=$1`, [vid]))[0].s;

// ================= admin review =================
ok(!(await asAdmin(`select public.review_video($1,'approved',null,$2::timestamptz)`, [vid, "2000-01-01T00:00:00Z"])).ok, "stale approval refused (video changed since viewed)");
ok(!(await asAdmin(`select public.review_video($1,'rejected','',$2::timestamptz)`, [vid, seenNow])).ok, "reject needs a reason");
ok(!(await asAdmin(`select public.review_video($1,'changes_requested',null,$2::timestamptz)`, [vid, seenNow])).ok, "changes_requested needs a message");
ok((await asAdmin(`select public.review_video($1,'changes_requested','Please add references.',$2::timestamptz)`, [vid, seenNow])).ok, "admin requests changes");
ok((await anon(`select id from public.videos`)).rows.length === 0, "changes_requested video still private");
ok((await asDoc(`select message from public.video_reviews where video_id=$1`, [vid])).rows[0]?.message === "Please add references.", "owner can read feedback");
ok((await asDoc2(`select * from public.video_reviews`)).rows.length === 0, "other contributor cannot read feedback");
ok(!(await asDoc(`update public.videos set status='pending' where id=$1`, [vid])).ok, "cannot resubmit without making changes");
ok((await asDoc(`update public.videos set status='pending', reference_links='https://www.who.int/news-room/fact-sheets/detail/breast-cancer' where id=$1`, [vid])).ok, "revised video returns to the review queue");
ok((await sys(`select status from public.videos where id=$1`, [vid]))[0].status === "pending", "status is pending again");
ok((await anon(`select id from public.videos`)).rows.length === 0, "still not public after resubmission");

let seen = (await sys(`select updated_at::text s from public.videos where id=$1`, [vid]))[0].s;
ok((await asAdmin(`select public.review_video($1,'approved',null,$2::timestamptz)`, [vid, seen])).ok, "admin approves");
const pubV = await anon(`select id, title, transcript from public.videos`);
ok(pubV.rows.length === 1, "approved video is public");
ok((await sys(`select published_at is not null p from public.videos where id=$1`, [vid]))[0].p, "published_at set on approval");
ok(!(await anon(`update public.videos set title='x'`)).ok, "anon cannot update videos");
ok(!(await anon(`insert into public.videos(contributor_id) values (gen_random_uuid())`)).ok, "anon cannot insert videos");
ok(!(await anon(`delete from public.videos`)).ok, "anon cannot delete videos");
ok(!(await asDoc(`update public.videos set title='Edited after approval' where id=$1`, [vid])).ok, "contributor cannot edit an approved video");
ok(!(await asDoc(`update public.videos set status='pending' where id=$1`, [vid])).ok, "contributor cannot un-approve to pending");

// unpublish
seen = (await sys(`select updated_at::text s from public.videos where id=$1`, [vid]))[0].s;
ok(!(await asAdmin(`select public.review_video($1,'unpublished',null,$2::timestamptz)`, [vid, seen])).ok, "unpublish needs a reason");
ok((await asAdmin(`select public.review_video($1,'unpublished','Outdated guidance',$2::timestamptz)`, [vid, seen])).ok, "admin unpublishes");
ok((await anon(`select id from public.videos`)).rows.length === 0, "unpublished video leaves public listing");
seen = (await sys(`select updated_at::text s from public.videos where id=$1`, [vid]))[0].s;
ok((await asAdmin(`select public.review_video($1,'approved',null,$2::timestamptz)`, [vid, seen])).ok, "admin can re-approve");

// withdraw
ok((await asDoc(`update public.videos set status='withdrawn' where id=$1`, [vid])).ok, "contributor can withdraw");
ok((await anon(`select id from public.videos`)).rows.length === 0, "withdrawn video not public");
ok(!(await asDoc(`update public.videos set status='approved' where id=$1`, [vid])).ok, "withdrawn cannot be re-approved by owner");

// reject path
const v2 = await asDoc2(vSql(), [doc2]);
ok(v2.ok, "doc2 submits");
ok((await asAdmin(`select public.review_video($1,'rejected','Not suitable.',$2::timestamptz)`, [v2.rows[0].id, v2.rows[0].seen])).ok, "admin rejects");
ok((await anon(`select id from public.videos`)).rows.length === 0, "rejected video stays private");
ok(!(await asAdmin(`select public.review_video($1,'approved',null,$2::timestamptz)`, [v2.rows[0].id, (await sys(`select updated_at::text s from public.videos where id=$1`, [v2.rows[0].id]))[0].s])).ok, "rejected cannot jump to approved");

// pending cap: a contributor can have at most 5 videos waiting
let accepted = 0;
for (let i = 0; i < 8; i++) if ((await asDoc(vSql(), [doc])).ok) accepted++;
ok(accepted === 5, "pending cap holds at 5", `accepted=${accepted}`);

// suspend takes down public videos
const v3 = await asDoc2(vSql(), [doc2]);
await asAdmin(`select public.review_video($1,'approved',null,$2::timestamptz)`, [v3.rows[0].id, v3.rows[0].seen]);
ok((await anon(`select id from public.videos`)).rows.length === 1, "doc2 video public");
ok((await asAdmin(`update public.contributor_applications set status='suspended', admin_note='Policy breach' where user_id=$1`, [doc2])).ok, "admin suspends doc2");
ok((await anon(`select id from public.videos`)).rows.length === 0, "suspension unpublishes their videos immediately");
ok(!(await asDoc2(vSql(), [doc2])).ok, "suspended contributor cannot submit");
ok((await anon(`select * from public.contributor_public`)).rows.length === 1, "suspended contributor no longer public");

// ================= stories =================
const storySql = (extra = "") => `insert into public.stories (category,title,body,is_anonymous,language,consent_publish,consent_real ${extra ? "," + extra.split("=")[0] : ""})
  values ('survivor','My story','${"I want to share my experience so others feel less alone. ".repeat(3)}',true,'en',true,true ${extra ? "," + extra.split("=")[1] : ""})`;
ok(!(await anon(storySql())).ok, "story refused while stories_open is OFF");
await asAdmin(`update public.site_settings set value=true where key='stories_open'`);
ok((await anon(storySql())).ok, "anonymous story accepted when open");
ok(!(await anon(storySql("status='approved'"))).ok, "anon cannot self-approve story");
ok(!(await anon(`insert into public.stories (category,title,body,is_anonymous,language,consent_publish,consent_real) values ('survivor','No consent','${"x".repeat(120)}',true,'en',false,true)`)).ok, "story needs publish consent");
ok(!(await anon(`insert into public.stories (category,title,body,is_anonymous,display_name,language,consent_publish,consent_real) values ('survivor','Anon with name','${"x".repeat(120)}',true,'Ali','en',true,true)`)).ok, "anonymous story cannot carry a name");
ok((await anon(`select id from public.stories`)).rows.length === 0, "pending story invisible to public");
const sid = (await asAdmin(`select id from public.stories`)).rows[0].id;
ok(!(await anon(`update public.stories set status='approved'`)).ok, "anon cannot approve story");
ok(!(await asUser(`update public.stories set status='approved' where id=$1`, [sid])).ok ||
   (await anon(`select id from public.stories`)).rows.length === 0, "normal user cannot approve story");
ok((await asAdmin(`update public.stories set status='approved' where id=$1`, [sid])).ok, "admin approves story");
ok((await anon(`select id from public.stories`)).rows.length === 1, "approved story public");
let n = 0; for (let i = 0; i < 8; i++) if ((await anon(storySql())).ok) n++;
ok(n <= 4, "story flood throttled", `accepted=${n}`);

// ================= messages =================
const msg = `insert into public.messages(topic, message, consent) values ('feedback','The page on screening has a typo.',true)`;
ok(!(await anon(msg)).ok, "message refused while contact_open is OFF");
await asAdmin(`update public.site_settings set value=true where key='contact_open'`);
ok((await anon(msg)).ok, "anonymous message accepted when open");
ok(!(await anon(`insert into public.messages(topic,message,consent,email) values ('other','Something long enough here','true','not-an-email')`)).ok, "bad email rejected");
ok(!(await anon(`select * from public.messages`)).ok, "anon cannot read messages");
ok((await asUser(`select * from public.messages`)).rows.length === 0, "user cannot read messages");
ok((await asAdmin(`select * from public.messages`)).rows.length >= 1, "admin reads messages");

// ================= directory =================
const dir = (st, extra = "") => `insert into public.directory_entries(name,country,status ${extra ? ",last_verified,source_url" : ""}) values ('Test Hospital','Pakistan','${st}' ${extra ? ",current_date,'https://example.org'" : ""})`;
ok(!(await asUser(dir("unverified"))).ok, "user cannot add directory entry");
ok(!(await anon(dir("unverified"))).ok, "anon cannot add directory entry");
ok(!(await asAdmin(dir("verified"))).ok, "verified entry needs date and source");
ok((await asAdmin(dir("verified", "x"))).ok, "admin adds verified entry");
ok((await asAdmin(dir("unverified"))).ok, "admin adds unverified entry");
ok((await asAdmin(dir("suspended"))).ok, "admin adds suspended entry");
ok((await anon(`select status from public.directory_entries`)).rows.length === 2, "public sees verified+unverified, not suspended");
ok(!(await anon(`delete from public.directory_entries`)).ok, "anon cannot delete directory");
ok(!(await asAdmin(`insert into public.directory_entries(name,country,website) values ('Bad Link Hospital','PK','javascript:alert(1)')`)).ok, "non-https website rejected");

// ================= audit =================
const audit = await asAdmin(`select action from public.audit_log`);
const acts = new Set(audit.rows.map((r) => r.action));
for (const a of ["video.approved", "video.rejected", "video.changes_requested", "video.unpublished", "application.verified", "application.suspended", "story.approved", "setting.changed", "directory.created"])
  ok(acts.has(a), `audit has ${a}`);
ok(!(await asUser(`select * from public.audit_log`)).ok || (await asUser(`select * from public.audit_log`)).rows.length === 0, "user cannot read audit log");
ok(!(await anon(`select * from public.audit_log`)).ok, "anon cannot read audit log");
ok(!(await asAdmin(`insert into public.audit_log(action,target_type) values ('fake','x')`)).ok, "even admin cannot forge audit rows");
ok(!(await asAdmin(`delete from public.audit_log`)).ok, "even admin cannot delete audit rows");
ok(!(await asAdmin(`update public.audit_log set action='x'`)).ok, "even admin cannot edit audit rows");

// ================= account deletion =================
ok((await asDoc(`select public.delete_my_account()`)).ok, "contributor can delete own account");
ok((await sys(`select count(*)::int n from public.videos where contributor_id=$1`, [doc]))[0].n === 0, "their videos are deleted too");
ok((await sys(`select count(*)::int n from public.contributor_applications where user_id=$1`, [doc]))[0].n === 0, "their application is deleted too");
ok(!(await asAdmin(`select public.delete_my_account()`)).ok, "admin cannot delete self from website");
ok(!(await anon(`select public.delete_my_account()`)).ok, "anon cannot call delete_my_account");

console.log(failed ? `\n${failed} FAILED, ${pass} passed` : `\nAll ${pass} database checks passed.`);
process.exit(failed ? 1 : 0);
