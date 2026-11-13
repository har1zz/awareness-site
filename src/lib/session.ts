import "server-only";
import { cache } from "react";
import { notFound, redirect } from "next/navigation";
import { getSupabase, supabaseConfigured } from "./supabase";
import type { Locale } from "@/i18n/config";

export const getUser = cache(async () => {
  if (!supabaseConfigured) return null;
  const sb = await getSupabase();
  const { data } = await sb.auth.getUser(); // verifies the token with Supabase
  return data.user ?? null;
});

export const getIsAdmin = cache(async () => {
  const user = await getUser();
  if (!user) return false;
  const sb = await getSupabase();
  const { data } = await sb.from("profiles").select("role").eq("id", user.id).maybeSingle();
  return data?.role === "admin";
});

/** Only allow redirects to our own language paths, never to other sites. */
export function safeNext(next: string | null | undefined, locale: Locale): string {
  if (next && /^\/(en|ur|ar)\/[A-Za-z0-9/_-]*$/.test(next)) return next;
  return `/${locale}/account`;
}

export async function requireUser(locale: Locale, here: string) {
  const user = await getUser();
  if (!user) redirect(`/${locale}/login?next=${encodeURIComponent(here)}`);
  return user;
}

/** Admin pages answer 404 to everyone else, so they are not even discoverable. */
export async function requireAdmin(locale: Locale, here: string) {
  const user = await requireUser(locale, here);
  if (!(await getIsAdmin())) notFound();
  return user;
}
