import type { Metadata } from "next";
import { getCtx, type LocaleParams } from "@/lib/ctx";
import { LocaleNotices, Notice, PageHead } from "@/components/Parts";
import { ActionForm, TextField } from "@/components/forms";
import { forgotPassword } from "@/app/actions/auth";
import { supabaseConfigured } from "@/lib/supabase";

export const metadata: Metadata = { title: "Reset your password", robots: { index: false } };

export default async function Page({ params }: LocaleParams) {
  const { locale, dict } = await getCtx(params);
  return (
    <>
      <PageHead locale={locale} dict={dict} title="Reset your password" />
      <div className="container section">
        <LocaleNotices locale={locale} dict={dict} />
        {!supabaseConfigured ? (
          <Notice kind="warn">
            <p>Accounts are not switched on for this site yet.</p>
          </Notice>
        ) : (
          <div className="panel">
            <ActionForm action={forgotPassword} locale={locale} submitLabel="Send reset link">
              <TextField name="email" label="Email address" type="email" required autoComplete="email" />
            </ActionForm>
          </div>
        )}
      </div>
    </>
  );
}
