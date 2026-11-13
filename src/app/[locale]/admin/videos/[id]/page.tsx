import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCtx } from "@/lib/ctx";
import { AdminShell } from "@/components/AdminShell";
import { VideoEmbed } from "@/components/VideoEmbed";
import { requireAdmin } from "@/lib/session";
import { getSupabase } from "@/lib/supabase";
import { href } from "@/lib/paths";
import { embedUrl, watchUrl } from "@/lib/video";
import { applicationStatus, fmtDateTime, videoStatus } from "@/lib/status";
import { reviewVideo } from "@/app/actions/admin";

export const metadata: Metadata = { title: "Admin: review video", robots: { index: false, follow: false } };
type SP = Promise<{ [k: string]: string | string[] | undefined }>;

export default async function Page({ params, searchParams }: { params: Promise<{ locale: string; id: string }>; searchParams: SP }) {
  const { id } = await params;
  const { locale, dict } = await getCtx(params);
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();
  await requireAdmin(locale, `/${locale}/admin/videos/${id}`);
  const sp = await searchParams;
  const sb = await getSupabase();
  const { data: v } = await sb.from("videos").select("*").eq("id", id).maybeSingle();
  if (!v) notFound();
  const [{ data: app }, { data: reviews }] = await Promise.all([
    sb.from("contributor_applications").select("*").eq("user_id", v.contributor_id).maybeSingle(),
    sb.from("video_reviews").select("id,decision,message,created_at").eq("video_id", id).order("created_at", { ascending: false }),
  ]);
  const st = videoStatus[v.status];
  const provider = v.provider === "vimeo" ? "Vimeo" : "YouTube";
  const decisions: [string, string, string][] = [];
  if (v.status === "pending") {
    decisions.push(["approved", "Approve and publish", ""], ["changes_requested", "Ask for changes", "secondary"], ["rejected", "Reject", "secondary"]);
  } else if (v.status === "changes_requested") {
    decisions.push(["rejected", "Reject", "secondary"]);
  } else if (v.status === "approved") {
    decisions.push(["unpublished", "Unpublish", "secondary"]);
  }
  return (
    <AdminShell
      locale={locale}
      dict={dict}
      title={v.title}
      current="admin/videos"
      sp={sp}
      trail={[{ label: "Videos", path: "admin/videos" }]}
    >
      <p>
        Status: <span className={`status-pill ${st?.tone}`}>{st?.label}</span> · Submitted {fmtDateTime(v.created_at)} · Last
        changed {fmtDateTime(v.updated_at)}
      </p>
      <h2>Contributor</h2>
      {app ? (
        <div className="panel">
          <p>
            <strong>{app.full_name}</strong> — {app.specialty}, {app.country}{" "}
            <span className={`status-pill ${applicationStatus[app.status]?.tone}`}>{applicationStatus[app.status]?.label}</span>
          </p>
          <p>
            Registration: {app.licence_body}, number {app.licence_number}. Check it on the official register before approving.
          </p>
          <p>
            <Link href={href(locale, `admin/contributors/${app.user_id}`)}>Open contributor</Link>
          </p>
        </div>
      ) : (
        <p>No application found for this contributor.</p>
      )}
      <h2>Video</h2>
      <p className="hint">
        Private preview. It loads from {provider} only after you press the button. Public visitors can only see it after approval.
      </p>
      {embedUrl(v.provider, v.video_ref, v.video_hash) ? (
        <VideoEmbed
          src={embedUrl(v.provider, v.video_ref, v.video_hash) as string}
          title={v.title}
          watchUrl={watchUrl(v.provider, v.video_ref, v.video_hash)}
          providerName={provider}
        />
      ) : (
        <p>The video link could not be built. Reject it.</p>
      )}
      <h2>Details</h2>
      <dl>
        <dt>Description</dt>
        <dd>{v.description}</dd>
        <dt>Topic / language / audience</dt>
        <dd>{v.topic} / {v.language} / {v.audience}</dd>
        <dt>Credit shown publicly</dt>
        <dd>{v.attribution}</dd>
        <dt>References</dt>
        <dd style={{ whiteSpace: "pre-wrap" }}>{v.reference_links || "None given"}</dd>
        <dt>Confirmed by contributor</dt>
        <dd>They own or may share the video; no patient is identifiable.</dd>
      </dl>
      <h3>Transcript</h3>
      <p style={{ whiteSpace: "pre-wrap" }}>{v.transcript}</p>

      {decisions.length > 0 ? (
        <form action={reviewVideo} className="panel">
          <h2>Your decision</h2>
          <input type="hidden" name="locale" value={locale} />
          <input type="hidden" name="id" value={v.id} />
          <input type="hidden" name="seen" value={v.updated_at} />
          <div className="field">
            <label htmlFor="message">Message to the contributor</label>
            <p className="hint">Required unless you approve. They will see this. Be specific and kind.</p>
            <textarea id="message" name="message" rows={5} maxLength={2000} />
          </div>
          <div className="btn-row">
            {decisions.map(([d, label, cls]) => (
              <button key={d} type="submit" name="decision" value={d} className={`btn ${cls}`}>
                {label}
              </button>
            ))}
          </div>
        </form>
      ) : (
        <p>No decision is available for a video with this status.</p>
      )}

      <h2>Decision history</h2>
      {(reviews ?? []).length === 0 ? (
        <p>No decisions yet.</p>
      ) : (
        <ul>
          {(reviews ?? []).map((r) => (
            <li key={r.id}>
              {fmtDateTime(r.created_at)} — <strong>{r.decision}</strong>
              {r.message ? `: ${r.message}` : ""}
            </li>
          ))}
        </ul>
      )}
    </AdminShell>
  );
}
