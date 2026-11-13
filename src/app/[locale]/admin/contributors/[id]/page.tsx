import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCtx } from "@/lib/ctx";
import { AdminShell } from "@/components/AdminShell";
import { requireAdmin } from "@/lib/session";
import { getSupabase } from "@/lib/supabase";
import { href } from "@/lib/paths";
import { applicationStatus, fmtDateTime, videoStatus } from "@/lib/status";
import { reviewApplication } from "@/app/actions/admin";

export const metadata: Metadata = { title: "Admin: contributor", robots: { index: false, follow: false } };
type SP = Promise<{ [k: string]: string | string[] | undefined }>;

export default async function Page({ params, searchParams }: { params: Promise<{ locale: string; id: string }>; searchParams: SP }) {
  const { id } = await params;
  const { locale, dict } = await getCtx(params);
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();
  await requireAdmin(locale, `/${locale}/admin/contributors/${id}`);
  const sp = await searchParams;
  const sb = await getSupabase();
  const { data: a } = await sb.from("contributor_applications").select("*").eq("user_id", id).maybeSingle();
  if (!a) notFound();
  const { data: vids } = await sb.from("videos").select("id,title,status").eq("contributor_id", id).order("created_at", { ascending: false });
  const st = applicationStatus[a.status];
  const actions: [string, string, string][] = [];
  if (a.status !== "verified") actions.push(["verified", "Verify as healthcare professional", ""]);
  if (a.status === "pending") actions.push(["more_info", "Ask for more information", "secondary"]);
  if (a.status === "pending" || a.status === "more_info") actions.push(["rejected", "Do not approve", "secondary"]);
  if (a.status === "verified") actions.push(["suspended", "Suspend (hides their videos)", "secondary"]);
  return (
    <AdminShell locale={locale} dict={dict} title={a.full_name} current="admin/contributors" sp={sp} trail={[{ label: "Contributors", path: "admin/contributors" }]}>
      <p>
        Status: <span className={`status-pill ${st?.tone}`}>{st?.label}</span> · Applied {fmtDateTime(a.created_at)} · Updated{" "}
        {fmtDateTime(a.updated_at)}
      </p>
      <h2>Application</h2>
      <dl>
        <dt>Specialty</dt><dd>{a.specialty}</dd>
        <dt>Country</dt><dd>{a.country}</dd>
        <dt>Registration body</dt><dd>{a.licence_body}</dd>
        <dt>Registration number</dt><dd>{a.licence_number}</dd>
        <dt>Workplace</dt><dd>{a.workplace || "Not given"}</dd>
        <dt>Biography</dt><dd style={{ whiteSpace: "pre-wrap" }}>{a.bio}</dd>
        <dt>Your last message to them</dt><dd>{a.admin_note || "None"}</dd>
      </dl>
      <p className="hint">
        Verify the name and number on the official register of the named body yourself. Only then press Verify. Never copy the
        number anywhere public.
      </p>
      {actions.length > 0 ? (
        <form action={reviewApplication} className="panel">
          <h2>Your decision</h2>
          <input type="hidden" name="locale" value={locale} />
          <input type="hidden" name="id" value={a.user_id} />
          <div className="field">
            <label htmlFor="note">Message to the applicant</label>
            <p className="hint">Required unless you verify. They will see it on their account page.</p>
            <textarea id="note" name="note" rows={4} maxLength={1000} />
          </div>
          <div className="btn-row">
            {actions.map(([d, label, cls]) => (
              <button key={d} type="submit" name="decision" value={d} className={`btn ${cls}`}>
                {label}
              </button>
            ))}
          </div>
        </form>
      ) : null}
      <h2>Their videos</h2>
      {(vids ?? []).length === 0 ? (
        <p>None yet.</p>
      ) : (
        <ul>
          {(vids ?? []).map((v) => (
            <li key={v.id}>
              <Link href={href(locale, `admin/videos/${v.id}`)}>{v.title}</Link> — {videoStatus[v.status]?.label}
            </li>
          ))}
        </ul>
      )}
    </AdminShell>
  );
}
