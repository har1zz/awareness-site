import type { Metadata } from "next";
import Link from "next/link";
import { getCtx, type LocaleParams } from "@/lib/ctx";
import { LocaleNotices, Notice, PageHead } from "@/components/Parts";
import { ActionForm, CheckField, TextArea, TextField } from "@/components/forms";
import { applyContributor } from "@/app/actions/contributor";
import { getSupabase } from "@/lib/supabase";
import { requireUser } from "@/lib/session";
import { getFlags } from "@/lib/flags";
import { href } from "@/lib/paths";

export const metadata: Metadata = { title: "Apply as a healthcare professional", robots: { index: false } };

export default async function Page({ params }: LocaleParams) {
  const { locale, dict } = await getCtx(params);
  const user = await requireUser(locale, `/${locale}/account/apply`);
  const sb = await getSupabase();
  const [{ data: app }, flags] = await Promise.all([
    sb.from("contributor_applications").select("*").eq("user_id", user.id).maybeSingle(),
    getFlags(),
  ]);
  const editable = app ? ["pending", "more_info"].includes(app.status) : flags.contributors_open;

  return (
    <>
      <PageHead locale={locale} dict={dict} title="Apply as a healthcare professional" trail={[{ label: "Account", path: "account" }]} />
      <div className="container section">
        <LocaleNotices locale={locale} dict={dict} />
        {!editable ? (
          <Notice kind="warn">
            <p>
              {app ? "Your application can no longer be edited." : "Applications are not open yet."}{" "}
              <Link href={href(locale, "account")}>Back to your account</Link>
            </p>
          </Notice>
        ) : (
          <div className="panel">
            <Notice kind="info">
              <p>
                <strong>How we use this information.</strong> The administrator uses it only to check that you
                are a registered professional, by looking you up on the official register. We do not ask for
                ID documents. Your registration number is never shown publicly. If you are approved, your
                name, specialty, country, workplace and short biography appear next to your approved videos.
              </p>
            </Notice>
            <ActionForm action={applyContributor} locale={locale} submitLabel={app ? "Save and resubmit" : "Send application"}>
              <TextField name="full_name" label="Full name" required maxLength={120} autoComplete="name" defaultValue={app?.full_name} />
              <TextField name="specialty" label="Profession and specialty" required maxLength={120} defaultValue={app?.specialty} hint="For example: Consultant breast surgeon." />
              <TextField name="country" label="Country where you are registered" required maxLength={80} defaultValue={app?.country} />
              <TextField name="licence_body" label="Registration body" required maxLength={160} defaultValue={app?.licence_body} hint="For example: Pakistan Medical and Dental Council, or the General Medical Council." />
              <TextField name="licence_number" label="Registration number" required maxLength={80} defaultValue={app?.licence_number} hint="Used only so the administrator can verify you. Never published." />
              <TextField name="workplace" label="Hospital or workplace" maxLength={160} defaultValue={app?.workplace ?? ""} />
              <TextArea name="bio" label="Short biography" required rows={5} minLength={20} maxLength={1000} defaultValue={app?.bio} hint="Two or three sentences about your experience. This is shown publicly if you are approved." />
              <CheckField name="consent_public">
                I agree that my name, specialty, country, workplace and biography may be shown publicly next to my approved videos.
              </CheckField>
              <CheckField name="consent_accuracy">I confirm that the information I have given is true and that I hold the registration I have stated.</CheckField>
            </ActionForm>
          </div>
        )}
      </div>
    </>
  );
}
