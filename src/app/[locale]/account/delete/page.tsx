import type { Metadata } from "next";
import { getCtx, type LocaleParams } from "@/lib/ctx";
import { LocaleNotices, Notice, PageHead } from "@/components/Parts";
import { ActionForm, TextField } from "@/components/forms";
import { deleteAccount } from "@/app/actions/auth";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = { title: "Delete your account", robots: { index: false } };

export default async function Page({ params }: LocaleParams) {
  const { locale, dict } = await getCtx(params);
  await requireUser(locale, `/${locale}/account/delete`);
  return (
    <>
      <PageHead locale={locale} dict={dict} title="Delete your account" trail={[{ label: "Account", path: "account" }]} />
      <div className="container section">
        <LocaleNotices locale={locale} dict={dict} />
        <Notice kind="urgent">
          <p>
            <strong>This cannot be undone.</strong> Your account, your contributor application and every
            video you submitted will be permanently deleted, and any published video will disappear from the site.
          </p>
        </Notice>
        <div className="panel">
          <ActionForm action={deleteAccount} locale={locale} submitLabel="Permanently delete my account">
            <TextField name="confirm" label="Type DELETE to confirm" required autoComplete="off" />
          </ActionForm>
        </div>
      </div>
    </>
  );
}
