import Link from "next/link";
import type { Metadata } from "next";
import { getCtx, type LocaleParams } from "@/lib/ctx";
import { LocaleNotices, Notice, PageHead } from "@/components/Parts";
import { ActionForm, CheckField, TextField } from "@/components/forms";
import { signUp } from "@/app/actions/auth";
import { supabaseConfigured } from "@/lib/supabase";
import { href } from "@/lib/paths";

export const metadata: Metadata = { title: "Create an account", robots: { index: false } };

export default async function Page({ params }: LocaleParams) {
  const { locale, dict } = await getCtx(params);
  return (
    <>
      <PageHead locale={locale} dict={dict} title="Create an account" />
      <div className="container section">
        <LocaleNotices locale={locale} dict={dict} />
        {!supabaseConfigured ? (
          <Notice kind="warn">
            <p>Accounts are not switched on for this site yet.</p>
          </Notice>
        ) : (
          <div className="panel">
            <p>
              An account lets a healthcare professional apply to share educational videos. Creating an
              account does not give any special access: the administrator must verify and approve you first.
              We only collect your email address and a password.
            </p>
            <ActionForm action={signUp} locale={locale} submitLabel="Create account" honeypot>
              <TextField name="email" label="Email address" type="email" required autoComplete="email" />
              <TextField
                name="password"
                label="Password"
                type="password"
                required
                minLength={10}
                maxLength={128}
                autoComplete="new-password"
                hint="At least 10 characters. A few random words make a strong password."
              />
              <CheckField name="agree">
                I have read the <Link href={href(locale, "privacy")}>Privacy Policy</Link> and the{" "}
                <Link href={href(locale, "terms")}>Terms and Conditions</Link>.
              </CheckField>
            </ActionForm>
            <p>
              Already have an account? <Link href={href(locale, "login")}>Sign in</Link>
            </p>
          </div>
        )}
      </div>
    </>
  );
}
