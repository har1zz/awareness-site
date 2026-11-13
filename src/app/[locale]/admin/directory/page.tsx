import type { Metadata } from "next";
import Link from "next/link";
import { getCtx, type LocaleParams } from "@/lib/ctx";
import { AdminShell } from "@/components/AdminShell";
import { requireAdmin } from "@/lib/session";
import { getSupabase } from "@/lib/supabase";
import { href } from "@/lib/paths";
import { fmtDate } from "@/lib/status";
import { deleteDirectory } from "@/app/actions/admin";

export const metadata: Metadata = { title: "Admin: directory", robots: { index: false, follow: false } };
type SP = Promise<{ [k: string]: string | string[] | undefined }>;

export default async function Page({ params, searchParams }: LocaleParams & { searchParams: SP }) {
  const { locale, dict } = await getCtx(params);
  await requireAdmin(locale, `/${locale}/admin/directory`);
  const sp = await searchParams;
  const sb = await getSupabase();
  const { data } = await sb.from("directory_entries").select("id,name,country,city,status,last_verified").order("country").order("name").limit(300);
  return (
    <AdminShell locale={locale} dict={dict} title="Directory" current="admin/directory" sp={sp} trail={[{ label: "Directory" }]}>
      <p>
        <Link className="btn" href={href(locale, "admin/directory/new")}>Add an entry</Link>
      </p>
      <p className="hint">Only add services you have checked yourself on their official page. Do not list individuals.</p>
      {(data ?? []).length === 0 ? <p>No entries yet.</p> : (
        <div className="table-wrap">
          <table>
            <caption className="sr-only">Directory entries</caption>
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Place</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(data ?? []).map((e) => (
                <tr key={e.id}>
                  <th scope="row">{e.name}</th>
                  <td>{[e.city, e.country].filter(Boolean).join(", ")}</td>
                  <td>{e.status}{e.last_verified ? ` (${fmtDate(e.last_verified)})` : ""}</td>
                  <td>
                    <Link href={href(locale, `admin/directory/${e.id}`)}>Edit<span className="sr-only"> {e.name}</span></Link>
                    <form action={deleteDirectory} style={{ display: "inline", marginInlineStart: "1rem" }}>
                      <input type="hidden" name="locale" value={locale} />
                      <input type="hidden" name="id" value={e.id} />
                      <button className="btn secondary" type="submit">Delete<span className="sr-only"> {e.name}</span></button>
                    </form>
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
