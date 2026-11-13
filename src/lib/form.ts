import { z } from "zod";
import { hasLocale, defaultLocale, type Locale } from "@/i18n/config";

export type FormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
  values?: Record<string, string>;
};

export function localeOf(fd: FormData): Locale {
  const l = String(fd.get("locale") ?? "");
  return hasLocale(l) ? l : defaultLocale;
}

/** FormData -> plain object. Checkboxes are present ("on") only when ticked. */
export function toObject(fd: FormData): Record<string, string> {
  const o: Record<string, string> = {};
  for (const [k, v] of fd.entries()) {
    if (typeof v === "string" && !k.startsWith("$ACTION")) o[k] = v;
  }
  return o;
}

/** Values safe to send back into the form (never passwords). */
export function echo(o: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(o)) {
    if (/password|token/i.test(k)) continue;
    out[k] = v.slice(0, 20000);
  }
  return out;
}

export function validate<T extends z.ZodType>(
  schema: T,
  fd: FormData,
): { ok: true; data: z.infer<T>; raw: Record<string, string> } | { ok: false; state: FormState } {
  const raw = toObject(fd);
  const res = schema.safeParse(raw);
  if (res.success) return { ok: true, data: res.data, raw };
  const fieldErrors: Record<string, string> = {};
  for (const issue of res.error.issues) {
    const k = String(issue.path[0] ?? "form");
    if (!fieldErrors[k]) fieldErrors[k] = issue.message;
  }
  return {
    ok: false,
    state: {
      error: "Please fix the highlighted fields and try again.",
      fieldErrors,
      values: echo(raw),
    },
  };
}

/** Bot trap: real people never fill the hidden field. Pretend success to bots. */
export function isBot(fd: FormData): boolean {
  return String(fd.get("website_url") ?? "") !== "";
}

export const tick = (msg: string) => z.literal("on", { message: msg });
export const optional = (max: number) =>
  z.string().trim().max(max, `Please keep this under ${max} characters.`);

export function dbMessage(err: { message?: string } | null | undefined): string {
  const m = err?.message ?? "";
  // Messages we wrote ourselves in the database triggers are safe to show.
  const known = [
    "Too many submissions",
    "You already have 5 videos",
    "Please make the requested changes",
    "This video can no longer be edited",
    "Your contributor access is not active",
    "The video changed or was not found",
    "A message is required",
    "That status change is not allowed",
  ];
  const hit = known.find((k) => m.includes(k));
  if (hit) return m;
  if (/row-level security|permission denied|42501/i.test(m)) {
    return "This is not available right now. It may be closed, or your account may not have access.";
  }
  if (/violates check constraint|invalid input/i.test(m)) {
    return "Some of the information is not in an accepted format. Please check and try again.";
  }
  return "Something went wrong. Please try again in a moment.";
}
