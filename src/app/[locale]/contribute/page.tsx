import Link from "next/link";
import type { Metadata } from "next";
import { getCtx, type LocaleParams } from "@/lib/ctx";
import { LocaleNotices, Notice, PageHead } from "@/components/Parts";
import { getFlags } from "@/lib/flags";
import { href } from "@/lib/paths";

export const metadata: Metadata = { title: "Contribute as a Healthcare Professional" };
export const dynamic = "force-dynamic";

export default async function Page({ params }: LocaleParams) {
  const { locale, dict } = await getCtx(params);
  const flags = await getFlags();
  return (
    <>
      <PageHead
        locale={locale}
        dict={dict}
        title="Share Your Knowledge. Help Raise Awareness."
        lead="We invite doctors and qualified healthcare professionals to contribute educational videos."
        trail={[]}
      />
      <div className="container section prose">
        <LocaleNotices locale={locale} dict={dict} />
        <h2>How it works</h2>
        <ol>
          <li>Create an account and apply with your profession, country and professional registration details.</li>
          <li>The site administrator verifies your registration on the official register. You are only called a verified healthcare professional once they have done so.</li>
          <li>Once verified, you submit a video as a YouTube or Vimeo link, with a transcript, references and a confirmation that no patient is identifiable.</li>
          <li>
            <strong>Every video stays private until the administrator reviews and explicitly approves it.</strong>{" "}
            They can approve it, reject it, or ask you for changes. A revised video returns to the review queue.
          </li>
          <li>You can see the status and the feedback in your account, withdraw a video at any time, and delete your account and data whenever you wish.</li>
        </ol>
        <h2>What we ask for, and why</h2>
        <p>
          Name, specialty, country, registration body and number, optional workplace, and a short biography.
          The registration details are used only to verify you and are never shown publicly. We do not ask for
          ID documents. See the <Link href={href(locale, "privacy")}>Privacy Policy</Link>.
        </p>
        {flags.contributors_open ? (
          <div className="btn-row">
            <Link className="btn" href={href(locale, "account/apply")}>
              Apply as a healthcare professional
            </Link>
            <Link className="btn secondary" href={href(locale, "login")}>
              Sign in
            </Link>
          </div>
        ) : (
          <Notice kind="info">
            <p>
              <strong>Applications are not open yet.</strong> Please check back soon.
            </p>
          </Notice>
        )}
      </div>
    </>
  );
}
