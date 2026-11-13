import type { Metadata } from "next";
import { getCtx, type LocaleParams } from "@/lib/ctx";
import { AdminShell } from "@/components/AdminShell";
import { requireAdmin } from "@/lib/session";
import { getSupabase } from "@/lib/supabase";
import { fmtDateTime } from "@/lib/status";

export const metadata: Metadata = { title: "Admin: audit log", robots: { index: false, follow: false } };
type SP = Promise<{ [k: string]: string | string[] | undefined }>;

export default async function Page({ params, searchParams }: LocaleParams & { searchParams: SP }) {
  const { locale, dict } = await getCtx(params);
  await requireAdmin(locale, `/${locale}/admin/audit`);
  const sp = await searchParams;
  const sb = await getSupabase();
  const { data } = await sb.from("audit_log").select("id,action,target_type,target_id,detail,created_at").order("created_at", { ascending: false }).limit(200);
  return (
    <AdminShell locale={locale} dict={dict} title="Audit log" current="admin/audit" sp={sp} trail={[{ label: "Audit log" }]}>
      <p className="hint">Written automatically by the database. It cannot be edited from the website. Showing the latest 200 entries.</p>
      <div className="table-wrap">
        <table>
          <caption className="sr-only">Recent actions</caption>
          <thead>
            <tr>
              <th scope="col">When</th>
              <th scope="col">Action</th>
              <th scope="col">Item</th>
              <th scope="col">Detail</th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((r) => (
              <tr key={r.id}>
                <td>{fmtDateTime(r.created_at)}</td>
                <th scope="row">{r.action}</th>
                <td>{r.target_type}{r.target_id ? ` ${String(r.target_id).slice(0, 8)}…` : ""}</td>
                <td><code>{JSON.stringify(r.detail)}</code></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
