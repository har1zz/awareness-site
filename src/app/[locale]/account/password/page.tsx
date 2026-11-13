import type { Metadata } from "next";
import { getCtx, type LocaleParams } from "@/lib/ctx";
import { LocaleNotices, PageHead } from "@/components/Parts";
import { ActionForm, TextField } from "@/components/forms";
import { updatePassword } from "@/app/actions/auth";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = { title: "Change password", robots: { index: false } };

export default async function Page({ params }: LocaleParams) {
  const { locale, dict } = await getCtx(params);
  await requireUser(locale, `/${locale}/account/password`);
  return (
    <>
      <PageHead locale={locale} dict={dict} title="Change password" trail={[{ label: "Account", path: "account" }]} />
      <div className="container section">
        <LocaleNotices locale={locale} dict={dict} />
        <div className="panel">
          <ActionForm action={updatePassword} locale={locale} submitLabel="Change password">
            <TextField name="password" label="New password" type="password" required minLength={10} maxLength={128} autoComplete="new-password" hint="At least 10 characters." />
            <TextField name="confirm" label="Repeat the new password" type="password" required autoComplete="new-password" />
          </ActionForm>
        </div>
      </div>
    </>
  );
}
