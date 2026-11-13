import type { Metadata } from "next";
import Link from "next/link";
import { getCtx, type LocaleParams } from "@/lib/ctx";
import { AdminShell } from "@/components/AdminShell";
import { requireAdmin } from "@/lib/session";
import { getSupabase } from "@/lib/supabase";
import { href } from "@/lib/paths";
import { fmtDateTime, videoStatus } from "@/lib/status";

export const metadata: Metadata = { title: "Admin: videos", robots: { index: false, follow: false } };
type SP = Promise<{ [k: string]: string | string[] | undefined }>;
const FILTERS = ["pending", "changes_requested", "approved", "rejected", "unpublished", "withdrawn"];

export default async function Page({ params, searchParams }: LocaleParams & { searchParams: SP }) {
  const { locale, dict } = await getCtx(params);
  await requireAdmin(locale, `/${locale}/admin/videos`);
  const sp = await searchParams;
  const f = typeof sp.status === "string" && FILTERS.includes(sp.status) ? sp.status : "pending";
  const sb = await getSupabase();
  const { data } = await sb
    .from("videos")
    .select("id,title,status,provider,created_at,updated_at,contributor_id")
    .eq("status", f)
    .order("created_at", { ascending: true })
    .limit(200);
  const rows = data ?? [];
  const ids = [...new Set(rows.map((r) => r.contributor_id))];
  const { data: apps } = ids.length
    ? await sb.from("contributor_applications").select("user_id,full_name,status").in("user_id", ids)
    : { data: [] };
  const name = new Map((apps ?? []).map((a) => [a.user_id, `${a.full_name} (${a.status})`]));
  return (
    <AdminShell locale={locale} dict={dict} title="Videos" current="admin/videos" sp={sp} trail={[{ label: "Videos" }]}>
      <ul className="admin-nav" aria-label="Filter by status">
        {FILTERS.map((s) => (
          <li key={s}>
            <Link href={`${href(locale, "admin/videos")}?status=${s}`} aria-current={f === s ? "true" : undefined}>
              {videoStatus[s].label}
            </Link>
          </li>
        ))}
      </ul>
      {rows.length === 0 ? (
        <p>No videos with this status.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <caption className="sr-only">Videos: {videoStatus[f].label}</caption>
            <thead>
              <tr>
                <th scope="col">Title</th>
                <th scope="col">Contributor</th>
                <th scope="col">Submitted</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((v) => (
                <tr key={v.id}>
                  <th scope="row">
                    <Link href={href(locale, `admin/videos/${v.id}`)}>
                      {v.title}
                      <span className="sr-only"> (open for review)</span>
                    </Link>
                  </th>
                  <td>{name.get(v.contributor_id) ?? "Unknown"}</td>
                  <td>{fmtDateTime(v.created_at)}</td>
                  <td>
                    <span className={`status-pill ${videoStatus[v.status]?.tone}`}>{videoStatus[v.status]?.label}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
