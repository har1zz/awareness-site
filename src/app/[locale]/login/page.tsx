import Link from "next/link";
import type { Metadata } from "next";
import { getCtx, type LocaleParams } from "@/lib/ctx";
import { LocaleNotices, Notice, PageHead } from "@/components/Parts";
import { Flash } from "@/components/Flash";
import { ActionForm, TextField } from "@/components/forms";
import { signIn } from "@/app/actions/auth";
import { supabaseConfigured } from "@/lib/supabase";
import { safeNext } from "@/lib/session";
import { href } from "@/lib/paths";

export const metadata: Metadata = { title: "Sign in", robots: { index: false } };

export default async function Page({
  params,
  searchParams,
}: LocaleParams & { searchParams: Promise<{ [k: string]: string | string[] | undefined }> }) {
  const { locale, dict } = await getCtx(params);
  const sp = await searchParams;
  const next = safeNext(typeof sp.next === "string" ? sp.next : null, locale);
  return (
    <>
      <PageHead locale={locale} dict={dict} title="Sign in" />
      <div className="container section">
        <LocaleNotices locale={locale} dict={dict} />
        <Flash code={sp.m} />
        <Flash code={sp.e} />
        {!supabaseConfigured ? (
          <Notice kind="warn">
            <p>Accounts are not switched on for this site yet.</p>
          </Notice>
        ) : (
          <div className="panel">
            <p>
              Accounts are only for healthcare professionals who wish to contribute, and for the site
              administrator. You do not need an account to read anything on this site.
            </p>
            <ActionForm action={signIn} locale={locale} submitLabel="Sign in">
              <input type="hidden" name="next" value={next} />
              <TextField name="email" label="Email address" type="email" required autoComplete="email" />
              <TextField name="password" label="Password" type="password" required autoComplete="current-password" />
            </ActionForm>
            <p>
              <Link href={href(locale, "forgot-password")}>Forgot your password?</Link>
            </p>
            <p>
              New here? <Link href={href(locale, "signup")}>Create an account</Link>
            </p>
          </div>
        )}
      </div>
    </>
  );
}
