"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { getSupabase, supabaseConfigured } from "@/lib/supabase";
import { getUser, safeNext } from "@/lib/session";
import { isBot, localeOf, tick, validate, type FormState } from "@/lib/form";
import { site } from "@/config/site";

const email = z.string().trim().toLowerCase().max(200).pipe(z.email({ message: "Enter a valid email address." }));
const newPassword = z
  .string()
  .min(10, "Use at least 10 characters.")
  .max(128, "Use at most 128 characters.");

const notConfigured: FormState = {
  error: "Accounts are not switched on for this site yet.",
};

export async function signUp(_prev: FormState, fd: FormData): Promise<FormState> {
  const locale = localeOf(fd);
  if (!supabaseConfigured) return notConfigured;
  const v = validate(
    z.object({
      email,
      password: newPassword,
      agree: tick("Please confirm you have read the Privacy Policy and Terms."),
    }),
    fd,
  );
  if (!v.ok) return v.state;
  if (isBot(fd)) redirect(`/${locale}/login?m=check_email`);

  const sb = await getSupabase();
  const { error } = await sb.auth.signUp({
    email: v.data.email,
    password: v.data.password,
    options: { emailRedirectTo: `${site.url}/auth/callback?next=/${locale}/account` },
  });
  if (error && /password|weak/i.test(error.message)) {
    return { error: "Please choose a stronger password.", fieldErrors: { password: "Choose a stronger password." }, values: { email: v.data.email } };
  }
  // Same message whether or not the address already has an account (prevents guessing who is registered).
  redirect(`/${locale}/login?m=check_email`);
}

export async function signIn(_prev: FormState, fd: FormData): Promise<FormState> {
  const locale = localeOf(fd);
  if (!supabaseConfigured) return notConfigured;
  const v = validate(
    z.object({ email, password: z.string().min(1, "Enter your password.").max(128) }),
    fd,
  );
  if (!v.ok) return v.state;
  const sb = await getSupabase();
  const { error } = await sb.auth.signInWithPassword({
    email: v.data.email,
    password: v.data.password,
  });
  if (error) {
    return {
      error: "That email and password did not match, or the email has not been confirmed yet.",
      values: { email: v.data.email },
    };
  }
  redirect(safeNext(String(fd.get("next") ?? ""), locale));
}

export async function signOut(fd: FormData) {
  const locale = localeOf(fd);
  if (supabaseConfigured) {
    const sb = await getSupabase();
    await sb.auth.signOut();
  }
  redirect(`/${locale}/login?m=signed_out`);
}

export async function forgotPassword(_prev: FormState, fd: FormData): Promise<FormState> {
  const locale = localeOf(fd);
  if (!supabaseConfigured) return notConfigured;
  const v = validate(z.object({ email }), fd);
  if (!v.ok) return v.state;
  const sb = await getSupabase();
  await sb.auth.resetPasswordForEmail(v.data.email, {
    redirectTo: `${site.url}/auth/callback?next=/${locale}/account/password`,
  });
  redirect(`/${locale}/login?m=reset_sent`);
}

export async function updatePassword(_prev: FormState, fd: FormData): Promise<FormState> {
  const locale = localeOf(fd);
  if (!supabaseConfigured) return notConfigured;
  const user = await getUser();
  if (!user) redirect(`/${locale}/login?e=not_allowed`);
  const v = validate(
    z
      .object({ password: newPassword, confirm: z.string() })
      .refine((d) => d.password === d.confirm, { message: "The two passwords do not match.", path: ["confirm"] }),
    fd,
  );
  if (!v.ok) return v.state;
  const sb = await getSupabase();
  const { error } = await sb.auth.updateUser({ password: v.data.password });
  if (error) return { error: "We could not change the password. Please choose a different one." };
  redirect(`/${locale}/account?m=password_updated`);
}

export async function deleteAccount(_prev: FormState, fd: FormData): Promise<FormState> {
  const locale = localeOf(fd);
  if (!supabaseConfigured) return notConfigured;
  const user = await getUser();
  if (!user) redirect(`/${locale}/login?e=not_allowed`);
  const v = validate(
    z.object({
      confirm: z.string().refine((s) => s.trim().toUpperCase() === "DELETE", { message: "Type DELETE to confirm." }),
    }),
    fd,
  );
  if (!v.ok) return v.state;
  const sb = await getSupabase();
  const { error } = await sb.rpc("delete_my_account");
  if (error) {
    return {
      error: /Administrator/.test(error.message)
        ? "Administrator accounts cannot be deleted from the website."
        : "We could not delete the account. Please try again or contact us.",
    };
  }
  await sb.auth.signOut();
  redirect(`/${locale}/login?m=account_deleted`);
}
