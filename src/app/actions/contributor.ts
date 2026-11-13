"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { getSupabase } from "@/lib/supabase";
import { getUser } from "@/lib/session";
import { dbMessage, localeOf, optional, tick, validate, type FormState } from "@/lib/form";
import { parseVideoUrl } from "@/lib/video";
import { audiences, languages, topics, values } from "@/lib/options";

const text = (min: number, max: number, what: string) =>
  z.string().trim().min(min, `${what}: at least ${min} characters.`).max(max, `${what}: at most ${max} characters.`);

const applicationSchema = z.object({
  full_name: text(2, 120, "Full name"),
  specialty: text(2, 120, "Specialty"),
  country: text(2, 80, "Country"),
  licence_body: text(2, 160, "Registration body"),
  licence_number: text(2, 80, "Registration number"),
  workplace: optional(160),
  bio: text(20, 1000, "Short biography"),
  consent_public: tick("Please confirm that your details may be shown with approved videos."),
  consent_accuracy: tick("Please confirm that the information is accurate."),
});

export async function applyContributor(_prev: FormState, fd: FormData): Promise<FormState> {
  const locale = localeOf(fd);
  const user = await getUser();
  if (!user) redirect(`/${locale}/login?next=${encodeURIComponent(`/${locale}/account/apply`)}`);
  const v = validate(applicationSchema, fd);
  if (!v.ok) return v.state;
  const d = v.data;
  const row = {
    full_name: d.full_name,
    specialty: d.specialty,
    country: d.country,
    licence_body: d.licence_body,
    licence_number: d.licence_number,
    workplace: d.workplace || null,
    bio: d.bio,
    consent_public: true,
    consent_accuracy: true,
  };
  const sb = await getSupabase();
  const { data: existing } = await sb
    .from("contributor_applications")
    .select("status")
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    if (!["pending", "more_info"].includes(existing.status)) {
      return { error: "Your application can no longer be edited." };
    }
    const { data, error } = await sb
      .from("contributor_applications")
      .update({ ...row, status: "pending" })
      .eq("user_id", user.id)
      .select("user_id");
    if (error || !data?.length) return { error: dbMessage(error), values: v.raw };
    redirect(`/${locale}/account?m=application_updated`);
  }
  const { error } = await sb.from("contributor_applications").insert({ ...row, user_id: user.id });
  if (error) return { error: dbMessage(error), values: v.raw };
  redirect(`/${locale}/account?m=application_sent`);
}

const videoSchema = z.object({
  title: text(5, 140, "Title"),
  description: text(20, 1000, "Description"),
  topic: z.enum(values(topics), { message: "Choose a topic." }),
  language: z.enum(values(languages), { message: "Choose the language of the video." }),
  audience: z.enum(values(audiences), { message: "Choose the audience." }),
  video_url: z.string().trim().max(300),
  transcript: text(100, 20000, "Transcript"),
  reference_links: optional(2000),
  attribution: text(2, 200, "Attribution"),
  consent_ownership: tick("Please confirm you own or have the right to share this video."),
  consent_patient_privacy: tick("Please confirm the video does not identify patients without written permission."),
});

function videoRow(d: z.infer<typeof videoSchema>, parsed: NonNullable<ReturnType<typeof parseVideoUrl>>) {
  return {
    title: d.title,
    description: d.description,
    topic: d.topic,
    language: d.language,
    audience: d.audience,
    provider: parsed.provider,
    video_ref: parsed.ref,
    video_hash: parsed.hash,
    transcript: d.transcript,
    reference_links: d.reference_links || null,
    attribution: d.attribution,
    consent_ownership: true,
    consent_patient_privacy: true,
  };
}

const linkError = (raw: Record<string, string>): FormState => ({
  error: "Please fix the highlighted fields and try again.",
  fieldErrors: {
    video_url:
      "Paste a public https link to a YouTube or Vimeo video (for example https://www.youtube.com/watch?v=…). Unlisted links are fine.",
  },
  values: raw,
});

export async function submitVideo(_prev: FormState, fd: FormData): Promise<FormState> {
  const locale = localeOf(fd);
  const user = await getUser();
  if (!user) redirect(`/${locale}/login?next=${encodeURIComponent(`/${locale}/account/videos/new`)}`);
  const v = validate(videoSchema, fd);
  if (!v.ok) return v.state;
  const parsed = parseVideoUrl(v.data.video_url);
  if (!parsed) return linkError(v.raw);
  const sb = await getSupabase();
  const { error } = await sb
    .from("videos")
    .insert({ ...videoRow(v.data, parsed), contributor_id: user.id });
  if (error) return { error: dbMessage(error), values: v.raw };
  redirect(`/${locale}/account?m=video_submitted`);
}

export async function updateVideo(_prev: FormState, fd: FormData): Promise<FormState> {
  const locale = localeOf(fd);
  const user = await getUser();
  const id = String(fd.get("id") ?? "");
  if (!user || !/^[0-9a-f-]{36}$/.test(id)) redirect(`/${locale}/login?e=not_allowed`);
  const v = validate(videoSchema, fd);
  if (!v.ok) return v.state;
  const parsed = parseVideoUrl(v.data.video_url);
  if (!parsed) return linkError(v.raw);
  const sb = await getSupabase();
  const { data: current } = await sb
    .from("videos")
    .select("status")
    .eq("id", id)
    .eq("contributor_id", user.id)
    .maybeSingle();
  if (!current || !["pending", "changes_requested"].includes(current.status)) {
    return { error: "This video can no longer be edited." };
  }
  // A revised video that had changes requested goes back into the review queue.
  const patch =
    current.status === "changes_requested"
      ? { ...videoRow(v.data, parsed), status: "pending" }
      : videoRow(v.data, parsed);
  const { data, error } = await sb
    .from("videos")
    .update(patch)
    .eq("id", id)
    .eq("contributor_id", user.id)
    .select("id");
  if (error || !data?.length) return { error: dbMessage(error), values: v.raw };
  redirect(`/${locale}/account?m=video_updated`);
}

export async function withdrawVideo(fd: FormData) {
  const locale = localeOf(fd);
  const user = await getUser();
  const id = String(fd.get("id") ?? "");
  if (!user || !/^[0-9a-f-]{36}$/.test(id)) redirect(`/${locale}/login?e=not_allowed`);
  const sb = await getSupabase();
  const { data } = await sb
    .from("videos")
    .update({ status: "withdrawn" })
    .eq("id", id)
    .eq("contributor_id", user.id)
    .select("id");
  redirect(`/${locale}/account?${data?.length ? "m=video_withdrawn" : "e=not_allowed"}`);
}
