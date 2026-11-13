import type { Metadata } from "next";
import { getCtx, type LocaleParams } from "@/lib/ctx";
import { AdminShell } from "@/components/AdminShell";
import { requireAdmin } from "@/lib/session";
import { getSupabase } from "@/lib/supabase";
import { fmtDateTime } from "@/lib/status";
import { toggleSetting } from "@/app/actions/admin";

export const metadata: Metadata = { title: "Admin: launch switches", robots: { index: false, follow: false } };
type SP = Promise<{ [k: string]: string | string[] | undefined }>;

const labels: Record<string, [string, string]> = {
  contributors_open: ["Healthcare professional applications", "Anyone can create an account and apply."],
  videos_open: ["Video submissions", "Verified professionals can submit videos (still need your approval to be public)."],
  stories_open: ["Story submissions", "Visitors can send stories (still need your approval to be public)."],
  contact_open: ["Contact form", "Visitors can send you messages."],
};

export default async function Page({ params, searchParams }: LocaleParams & { searchParams: SP }) {
  const { locale, dict } = await getCtx(params);
  await requireAdmin(locale, `/${locale}/admin/settings`);
  const sp = await searchParams;
  const sb = await getSupabase();
  const { data } = await sb.from("site_settings").select("key,value,updated_at").order("key");
  return (
    <AdminShell locale={locale} dict={dict} title="Launch switches" current="admin/settings" sp={sp} trail={[{ label: "Launch switches" }]}>
      <p>
        These start switched <strong>off</strong>. Turn one on only after the clinical review and the legal review described in
        the launch checklist, and after your Privacy Policy details are filled in.
      </p>
      <div className="table-wrap">
        <table>
          <caption className="sr-only">Feature switches</caption>
          <thead>
            <tr>
              <th scope="col">Feature</th>
              <th scope="col">State</th>
              <th scope="col">Change</th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((s) => {
              const [name, desc] = labels[s.key] ?? [s.key, ""];
              return (
                <tr key={s.key}>
                  <th scope="row">
                    {name}
                    <br />
                    <span className="hint">{desc}</span>
                  </th>
                  <td>
                    {s.value ? <span className="status-pill good">On</span> : <span className="status-pill neutral">Off</span>}
                    <br />
                    <span className="hint">Changed {fmtDateTime(s.updated_at)}</span>
                  </td>
                  <td>
                    <form action={toggleSetting}>
                      <input type="hidden" name="locale" value={locale} />
                      <input type="hidden" name="key" value={s.key} />
                      <input type="hidden" name="value" value={s.value ? "false" : "true"} />
                      <button className={`btn ${s.value ? "secondary" : ""}`} type="submit">
                        {s.value ? "Turn off" : "Turn on"}
                        <span className="sr-only"> {name}</span>
                      </button>
                    </form>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
