import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCtx } from "@/lib/ctx";
import { LocaleNotices, Notice, PageHead } from "@/components/Parts";
import { ActionForm } from "@/components/forms";
import { VideoFields } from "@/components/VideoFields";
import { updateVideo, withdrawVideo } from "@/app/actions/contributor";
import { getSupabase } from "@/lib/supabase";
import { requireUser } from "@/lib/session";
import { fmtDate, videoStatus } from "@/lib/status";
import { watchUrl } from "@/lib/video";

export const metadata: Metadata = { title: "Your video", robots: { index: false } };

export default async function Page({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { id } = await params;
  const { locale, dict } = await getCtx(params);
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();
  const user = await requireUser(locale, `/${locale}/account/videos/${id}`);
  const sb = await getSupabase();
  const { data: v } = await sb.from("videos").select("*").eq("id", id).eq("contributor_id", user.id).maybeSingle();
  if (!v) notFound();
  const { data: reviews } = await sb
    .from("video_reviews")
    .select("id,decision,message,created_at")
    .eq("video_id", id)
    .order("created_at", { ascending: false });
  const st = videoStatus[v.status];
  const editable = ["pending", "changes_requested"].includes(v.status);
  const canWithdraw = ["pending", "changes_requested", "approved"].includes(v.status);

  return (
    <>
      <PageHead locale={locale} dict={dict} title={v.title} trail={[{ label: "Account", path: "account" }]} />
      <div className="container section">
        <LocaleNotices locale={locale} dict={dict} />
        <p>
          Status: <span className={`status-pill ${st?.tone}`}>{st?.label}</span>
        </p>
        {v.status === "changes_requested" ? (
          <Notice kind="warn">
            <p>The administrator asked for changes. Edit the video below and resubmit it to return it to the review queue.</p>
          </Notice>
        ) : null}
        {reviews && reviews.length > 0 ? (
          <>
            <h2>Feedback from the administrator</h2>
            <ul>
              {reviews.map((r) => (
                <li key={r.id}>
                  <strong>{fmtDate(r.created_at)} — {videoStatus[r.decision]?.label ?? r.decision}.</strong>{" "}
                  {r.message ?? ""}
                </li>
              ))}
            </ul>
          </>
        ) : null}
        {editable ? (
          <div className="panel">
            <ActionForm
              action={updateVideo}
              locale={locale}
              submitLabel={v.status === "changes_requested" ? "Save and resubmit for review" : "Save changes"}
            >
              <input type="hidden" name="id" value={v.id} />
              <VideoFields
                d={{
                  title: v.title,
                  description: v.description,
                  topic: v.topic,
                  language: v.language,
                  audience: v.audience,
                  video_url: watchUrl(v.provider, v.video_ref, v.video_hash),
                  transcript: v.transcript,
                  reference_links: v.reference_links ?? "",
                  attribution: v.attribution,
                }}
              />
            </ActionForm>
          </div>
        ) : (
          <p>This video can no longer be edited.</p>
        )}
        {canWithdraw ? (
          <form action={withdrawVideo} style={{ marginTop: "1.5rem" }}>
            <input type="hidden" name="locale" value={locale} />
            <input type="hidden" name="id" value={v.id} />
            <button type="submit" className="btn secondary">
              Withdraw this video
            </button>
            <p className="hint">Withdrawing removes it from the review queue or from the public site.</p>
          </form>
        ) : null}
      </div>
    </>
  );
}
