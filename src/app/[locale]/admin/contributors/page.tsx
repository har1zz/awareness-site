import type { Metadata } from "next";
import Link from "next/link";
import { getCtx, type LocaleParams } from "@/lib/ctx";
import { AdminShell } from "@/components/AdminShell";
import { requireAdmin } from "@/lib/session";
import { getSupabase } from "@/lib/supabase";
import { href } from "@/lib/paths";
import { applicationStatus, fmtDateTime } from "@/lib/status";

export const metadata: Metadata = { title: "Admin: contributors", robots: { index: false, follow: false } };
type SP = Promise<{ [k: string]: string | string[] | undefined }>;
const FILTERS = ["pending", "more_info", "verified", "rejected", "suspended"];

export default async function Page({ params, searchParams }: LocaleParams & { searchParams: SP }) {
  const { locale, dict } = await getCtx(params);
  await requireAdmin(locale, `/${locale}/admin/contributors`);
  const sp = await searchParams;
  const f = typeof sp.status === "string" && FILTERS.includes(sp.status) ? sp.status : "pending";
  const sb = await getSupabase();
  const { data } = await sb
    .from("contributor_applications")
    .select("user_id,full_name,specialty,country,licence_body,status,created_at")
    .eq("status", f)
    .order("created_at", { ascending: true })
    .limit(200);
  const rows = data ?? [];
  return (
    <AdminShell locale={locale} dict={dict} title="Contributors" current="admin/contributors" sp={sp} trail={[{ label: "Contributors" }]}>
      <ul className="admin-nav" aria-label="Filter by status">
        {FILTERS.map((s) => (
          <li key={s}>
            <Link href={`${href(locale, "admin/contributors")}?status=${s}`} aria-current={f === s ? "true" : undefined}>
              {applicationStatus[s].label}
            </Link>
          </li>
        ))}
      </ul>
      {rows.length === 0 ? (
        <p>No applications with this status.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <caption className="sr-only">Applications: {applicationStatus[f].label}</caption>
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Specialty</th>
                <th scope="col">Country</th>
                <th scope="col">Registration body</th>
                <th scope="col">Applied</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((a) => (
                <tr key={a.user_id}>
                  <th scope="row">
                    <Link href={href(locale, `admin/contributors/${a.user_id}`)}>
                      {a.full_name}
                      <span className="sr-only"> (open application)</span>
                    </Link>
                  </th>
                  <td>{a.specialty}</td>
                  <td>{a.country}</td>
                  <td>{a.licence_body}</td>
                  <td>{fmtDateTime(a.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
