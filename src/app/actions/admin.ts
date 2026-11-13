"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { getSupabase } from "@/lib/supabase";
import { getIsAdmin } from "@/lib/session";
import { localeOf, optional, validate, type FormState } from "@/lib/form";
import { serviceTypes } from "@/lib/options";

const UUID = /^[0-9a-f-]{36}$/;

/** Every admin action starts here. The database ALSO refuses non-admins (row-level security). */
async function admin(fd: FormData) {
  const locale = localeOf(fd);
  if (!(await getIsAdmin())) redirect(`/${locale}/login?e=not_allowed`);
  return { locale, sb: await getSupabase() };
}
const idOf = (fd: FormData, key = "id") => {
  const v = String(fd.get(key) ?? "");
  return UUID.test(v) ? v : null;
};

// ---------- videos ----------
export async function reviewVideo(fd: FormData) {
  const { locale, sb } = await admin(fd);
  const id = idOf(fd);
  const decision = String(fd.get("decision") ?? "");
  const message = String(fd.get("message") ?? "").trim().slice(0, 2000);
  const seen = String(fd.get("seen") ?? "");
  if (!id || !["approved", "rejected", "changes_requested", "unpublished"].includes(decision) || Number.isNaN(Date.parse(seen))) {
    redirect(`/${locale}/admin/videos?e=failed`);
  }
  const back = `/${locale}/admin/videos/${id}`;
  if (decision !== "approved" && !message) redirect(`${back}?e=need_message`);
  const { error } = await sb.rpc("review_video", {
    p_video: id,
    p_decision: decision,
    p_message: message || null,
    p_seen: seen,
  });
  if (error) redirect(`${back}?e=${/changed or was not found|not allowed/.test(error.message) ? "changed" : "failed"}`);
  redirect(`${back}?m=decided`);
}

// ---------- contributors ----------
export async function reviewApplication(fd: FormData) {
  const { locale, sb } = await admin(fd);
  const id = idOf(fd);
  const decision = String(fd.get("decision") ?? "");
  const note = String(fd.get("note") ?? "").trim().slice(0, 1000);
  if (!id || !["verified", "more_info", "rejected", "suspended"].includes(decision)) {
    redirect(`/${locale}/admin/contributors?e=failed`);
  }
  const back = `/${locale}/admin/contributors/${id}`;
  if (decision !== "verified" && !note) redirect(`${back}?e=need_message`);
  const { data, error } = await sb
    .from("contributor_applications")
    .update({ status: decision, admin_note: note || null })
    .eq("user_id", id)
    .select("user_id");
  if (error || !data?.length) redirect(`${back}?e=failed`);
  redirect(`${back}?m=decided`);
}

// ---------- stories ----------
export async function reviewStory(fd: FormData) {
  const { locale, sb } = await admin(fd);
  const id = idOf(fd);
  const decision = String(fd.get("decision") ?? "");
  if (!id || !["approved", "rejected", "pending"].includes(decision)) redirect(`/${locale}/admin/stories?e=failed`);
  const { data, error } = await sb.from("stories").update({ status: decision }).eq("id", id).select("id");
  redirect(`/${locale}/admin/stories?${error || !data?.length ? "e=failed" : "m=decided"}`);
}

export async function deleteStory(fd: FormData) {
  const { locale, sb } = await admin(fd);
  const id = idOf(fd);
  if (!id) redirect(`/${locale}/admin/stories?e=failed`);
  const { error } = await sb.from("stories").delete().eq("id", id);
  redirect(`/${locale}/admin/stories?${error ? "e=failed" : "m=deleted"}`);
}

// ---------- messages ----------
export async function messageAction(fd: FormData) {
  const { locale, sb } = await admin(fd);
  const id = idOf(fd);
  const op = String(fd.get("op") ?? "");
  if (!id) redirect(`/${locale}/admin/messages?e=failed`);
  const res =
    op === "delete"
      ? await sb.from("messages").delete().eq("id", id)
      : await sb.from("messages").update({ handled: op === "handled" }).eq("id", id);
  redirect(`/${locale}/admin/messages?${res.error ? "e=failed" : "m=saved"}`);
}

// ---------- feature switches ----------
export async function toggleSetting(fd: FormData) {
  const { locale, sb } = await admin(fd);
  const key = String(fd.get("key") ?? "");
  const value = String(fd.get("value") ?? "") === "true";
  if (!["contributors_open", "videos_open", "stories_open", "contact_open"].includes(key)) {
    redirect(`/${locale}/admin/settings?e=failed`);
  }
  const { data, error } = await sb
    .from("site_settings")
    .update({ value, updated_at: new Date().toISOString() })
    .eq("key", key)
    .select("key");
  redirect(`/${locale}/admin/settings?${error || !data?.length ? "e=failed" : "m=saved"}`);
}

// ---------- directory ----------
const text = (min: number, max: number, what: string) =>
  z.string().trim().min(min, `${what}: at least ${min} characters.`).max(max, `${what}: at most ${max} characters.`);
const https = (what: string) =>
  optional(300).refine((s) => s === "" || /^https:\/\/\S+$/.test(s), { message: `${what} must start with https://` });

const dirSchema = z
  .object({
    name: text(3, 160, "Name"),
    country: text(2, 80, "Country"),
    city: optional(80),
    region: optional(80),
    languages: optional(200),
    website: https("Website"),
    source_url: https("Source link"),
    phone: optional(60),
    address: optional(300),
    about: optional(600),
    last_verified: z.string().trim().refine((s) => s === "" || /^\d{4}-\d{2}-\d{2}$/.test(s), { message: "Use a date." }),
    status: z.enum(["verified", "unverified", "suspended"], { message: "Choose a status." }),
  })
  .superRefine((d, ctx) => {
    if (d.status === "verified") {
      if (!d.last_verified) ctx.addIssue({ code: "custom", path: ["last_verified"], message: "A verified entry needs the date you checked it." });
      if (!d.source_url) ctx.addIssue({ code: "custom", path: ["source_url"], message: "A verified entry needs the source link where you checked it." });
    }
  });

export async function saveDirectory(_prev: FormState, fd: FormData): Promise<FormState> {
  const { locale, sb } = await admin(fd);
  const id = idOf(fd);
  const v = validate(dirSchema, fd);
  if (!v.ok) return v.state;
  const d = v.data;
  const service_types = serviceTypes.filter((t) => v.raw[`st_${t}`] === "on");
  const languages = [
    ...new Set(
      d.languages
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean),
    ),
  ].slice(0, 10);
  const row = {
    name: d.name,
    country: d.country,
    city: d.city || null,
    region: d.region || null,
    service_types,
    languages,
    website: d.website || null,
    phone: d.phone || null,
    address: d.address || null,
    about: d.about || null,
    source_url: d.source_url || null,
    last_verified: d.last_verified || null,
    status: d.status,
  };
  const res = id
    ? await sb.from("directory_entries").update(row).eq("id", id).select("id")
    : await sb.from("directory_entries").insert(row).select("id");
  if (res.error || !res.data?.length) return { error: "Could not save the entry. Check the fields and try again.", values: v.raw };
  redirect(`/${locale}/admin/directory?m=saved`);
}

export async function deleteDirectory(fd: FormData) {
  const { locale, sb } = await admin(fd);
  const id = idOf(fd);
  if (!id) redirect(`/${locale}/admin/directory?e=failed`);
  const { error } = await sb.from("directory_entries").delete().eq("id", id);
  redirect(`/${locale}/admin/directory?${error ? "e=failed" : "m=deleted"}`);
}
