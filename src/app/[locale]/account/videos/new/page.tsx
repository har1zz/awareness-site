import type { Metadata } from "next";
import Link from "next/link";
import { getCtx, type LocaleParams } from "@/lib/ctx";
import { LocaleNotices, Notice, PageHead } from "@/components/Parts";
import { ActionForm } from "@/components/forms";
import { VideoFields } from "@/components/VideoFields";
import { submitVideo } from "@/app/actions/contributor";
import { getSupabase } from "@/lib/supabase";
import { requireUser } from "@/lib/session";
import { getFlags } from "@/lib/flags";
import { href } from "@/lib/paths";

export const metadata: Metadata = { title: "Submit a video", robots: { index: false } };

export default async function Page({ params }: LocaleParams) {
  const { locale, dict } = await getCtx(params);
  const user = await requireUser(locale, `/${locale}/account/videos/new`);
  const sb = await getSupabase();
  const [{ data: app }, flags] = await Promise.all([
    sb.from("contributor_applications").select("status").eq("user_id", user.id).maybeSingle(),
    getFlags(),
  ]);
  const allowed = app?.status === "verified" && flags.videos_open;
  return (
    <>
      <PageHead locale={locale} dict={dict} title="Submit a video" trail={[{ label: "Account", path: "account" }]} />
      <div className="container section">
        <LocaleNotices locale={locale} dict={dict} />
        {!allowed ? (
          <Notice kind="warn">
            <p>
              {app?.status === "verified"
                ? "Video submissions are not open yet."
                : "Only verified healthcare professionals can submit videos."}{" "}
              <Link href={href(locale, "account")}>Back to your account</Link>
            </p>
          </Notice>
        ) : (
          <div className="panel">
            <Notice kind="info">
              <p>
                <strong>Nothing is published automatically.</strong> Your video stays private until the site
                administrator has reviewed it and explicitly approved it. They may approve, reject, or ask you for
                changes.
              </p>
            </Notice>
            <ActionForm action={submitVideo} locale={locale} submitLabel="Submit for review">
              <VideoFields />
            </ActionForm>
          </div>
        )}
      </div>
    </>
  );
}
