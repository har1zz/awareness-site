import type { Metadata } from "next";
import { getCtx, type LocaleParams } from "@/lib/ctx";
import { LocaleNotices, Notice, PageHead } from "@/components/Parts";
import { Flash } from "@/components/Flash";
import { ActionForm, CheckField, SelectField, TextArea, TextField } from "@/components/forms";
import { submitMessage } from "@/app/actions/public";
import { getFlags } from "@/lib/flags";
import { site, isPlaceholder } from "@/config/site";

export const metadata: Metadata = { title: "Contact Us" };
export const dynamic = "force-dynamic";

export default async function Page({
  params,
  searchParams,
}: LocaleParams & { searchParams: Promise<{ [k: string]: string | string[] | undefined }> }) {
  const { locale, dict } = await getCtx(params);
  const sp = await searchParams;
  const flags = await getFlags();
  const email = site.operator.contactEmail;
  return (
    <>
      <PageHead locale={locale} dict={dict} title={dict.nav.contact} />
      <div className="container section prose">
        <LocaleNotices locale={locale} dict={dict} />
        <Flash code={sp.m} />
        <Notice kind="urgent">
          <p>
            <strong>This is not an emergency or clinical service.</strong> We cannot give personal medical
            advice, diagnose, or review test results. {dict.emergency}
          </p>
        </Notice>
        <p>
          You can contact us about corrections, accessibility problems, privacy requests or general feedback
          about the site. We cannot promise a reply time.
        </p>
        {!isPlaceholder(email) ? (
          <p>
            Email: <a href={`mailto:${email}`}>{email}</a>
          </p>
        ) : null}
        <p>Postal address: {site.operator.postalAddress}</p>

        {flags.contact_open ? (
          <>
            <h2>Send a message</h2>
            <div className="panel">
              <p>
                Your name and email are optional. If you leave your email empty we cannot reply, but we will
                still read your message. Please do not include medical details.
              </p>
              <ActionForm action={submitMessage} locale={locale} submitLabel="Send message" honeypot>
                <SelectField
                  name="topic"
                  label="What is it about?"
                  required
                  options={[
                    { value: "correction", label: "A correction to the information" },
                    { value: "accessibility", label: "An accessibility problem" },
                    { value: "privacy", label: "A privacy or data request" },
                    { value: "feedback", label: "General feedback" },
                    { value: "other", label: "Something else" },
                  ]}
                />
                <TextField name="name" label="Your name" maxLength={80} autoComplete="name" />
                <TextField name="email" label="Your email" type="email" maxLength={200} autoComplete="email" hint="Only if you would like a reply." />
                <TextArea name="message" label="Your message" required rows={6} minLength={10} maxLength={2000} />
                <CheckField name="consent">
                  I agree that you may read and store this message (and my email, if I gave one) to respond and to
                  improve the site. Messages are kept for up to 12 months.
                </CheckField>
              </ActionForm>
            </div>
          </>
        ) : null}
      </div>
    </>
  );
}
