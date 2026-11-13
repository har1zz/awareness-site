import type { Metadata } from "next";
import { getCtx, type LocaleParams } from "@/lib/ctx";
import { AdminShell } from "@/components/AdminShell";
import { requireAdmin } from "@/lib/session";
import { getSupabase } from "@/lib/supabase";
import { fmtDateTime } from "@/lib/status";
import { messageAction } from "@/app/actions/admin";

export const metadata: Metadata = { title: "Admin: messages", robots: { index: false, follow: false } };
type SP = Promise<{ [k: string]: string | string[] | undefined }>;

export default async function Page({ params, searchParams }: LocaleParams & { searchParams: SP }) {
  const { locale, dict } = await getCtx(params);
  await requireAdmin(locale, `/${locale}/admin/messages`);
  const sp = await searchParams;
  const sb = await getSupabase();
  const { data } = await sb.from("messages").select("*").order("handled").order("created_at", { ascending: false }).limit(100);
  const rows = data ?? [];
  return (
    <AdminShell locale={locale} dict={dict} title="Messages" current="admin/messages" sp={sp} trail={[{ label: "Messages" }]}>
      <p className="hint">
        Delete messages once dealt with. Do not keep personal data longer than needed (see the Privacy Policy).
      </p>
      {rows.length === 0 ? <p>No messages.</p> : null}
      {rows.map((m) => (
        <article className="card" key={m.id}>
          <h2 className="h3">
            {m.topic} {m.handled ? <span className="status-pill good">Handled</span> : <span className="status-pill pending">New</span>}
          </h2>
          <p className="hint">
            {fmtDateTime(m.created_at)} · {m.name || "No name"} · {m.email ? <a href={`mailto:${m.email}`}>{m.email}</a> : "No email given"}
          </p>
          <p style={{ whiteSpace: "pre-wrap" }}>{m.message}</p>
          <div className="btn-row">
            {[m.handled ? ["unhandled", "Mark as new"] : ["handled", "Mark as handled"], ["delete", "Delete permanently"]].map(([op, label]) => (
              <form action={messageAction} key={op}>
                <input type="hidden" name="locale" value={locale} />
                <input type="hidden" name="id" value={m.id} />
                <button className="btn secondary" name="op" value={op} type="submit">
                  {label}
                  <span className="sr-only"> (message from {fmtDateTime(m.created_at)})</span>
                </button>
              </form>
            ))}
          </div>
        </article>
      ))}
    </AdminShell>
  );
}
