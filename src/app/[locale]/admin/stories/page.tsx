import type { Metadata } from "next";
import Link from "next/link";
import { getCtx, type LocaleParams } from "@/lib/ctx";
import { AdminShell } from "@/components/AdminShell";
import { requireAdmin } from "@/lib/session";
import { getSupabase } from "@/lib/supabase";
import { href } from "@/lib/paths";
import { fmtDateTime, storyStatus } from "@/lib/status";
import { deleteStory, reviewStory } from "@/app/actions/admin";

export const metadata: Metadata = { title: "Admin: stories", robots: { index: false, follow: false } };
type SP = Promise<{ [k: string]: string | string[] | undefined }>;
const FILTERS = ["pending", "approved", "rejected"];

export default async function Page({ params, searchParams }: LocaleParams & { searchParams: SP }) {
  const { locale, dict } = await getCtx(params);
  await requireAdmin(locale, `/${locale}/admin/stories`);
  const sp = await searchParams;
  const f = typeof sp.status === "string" && FILTERS.includes(sp.status) ? sp.status : "pending";
  const sb = await getSupabase();
  const { data } = await sb.from("stories").select("*").eq("status", f).order("created_at", { ascending: true }).limit(100);
  const rows = data ?? [];
  return (
    <AdminShell locale={locale} dict={dict} title="Stories" current="admin/stories" sp={sp} trail={[{ label: "Stories" }]}>
      <ul className="admin-nav" aria-label="Filter by status">
        {FILTERS.map((s) => (
          <li key={s}>
            <Link href={`${href(locale, "admin/stories")}?status=${s}`} aria-current={f === s ? "true" : undefined}>
              {storyStatus[s].label}
            </Link>
          </li>
        ))}
      </ul>
      <p className="hint">
        Before approving, check for: medical advice or cures, named third parties, identifying details, hate or promotion of
        products, and anything that looks untrue. Reject if unsure.
      </p>
      {rows.length === 0 ? <p>No stories with this status.</p> : null}
      {rows.map((s) => (
        <article className="card" key={s.id}>
          <h2 className="h3">{s.title}</h2>
          <p className="hint">
            {s.category} · {s.language} · {s.is_anonymous ? "Anonymous" : `Shown as: ${s.display_name}`} · {fmtDateTime(s.created_at)}
          </p>
          {s.content_warning ? <p><strong>Content warning:</strong> {s.content_warning}</p> : null}
          <p style={{ whiteSpace: "pre-wrap" }}>{s.body}</p>
          <div className="btn-row">
            {f !== "approved" ? (
              <form action={reviewStory}>
                <input type="hidden" name="locale" value={locale} />
                <input type="hidden" name="id" value={s.id} />
                <button className="btn" name="decision" value="approved" type="submit">
                  Publish<span className="sr-only"> story: {s.title}</span>
                </button>
              </form>
            ) : null}
            {f !== "rejected" ? (
              <form action={reviewStory}>
                <input type="hidden" name="locale" value={locale} />
                <input type="hidden" name="id" value={s.id} />
                <button className="btn secondary" name="decision" value="rejected" type="submit">
                  {f === "approved" ? "Unpublish" : "Reject"}
                  <span className="sr-only"> story: {s.title}</span>
                </button>
              </form>
            ) : null}
            <form action={deleteStory}>
              <input type="hidden" name="locale" value={locale} />
              <input type="hidden" name="id" value={s.id} />
              <button className="btn secondary" type="submit">
                Delete permanently<span className="sr-only"> story: {s.title}</span>
              </button>
            </form>
          </div>
        </article>
      ))}
    </AdminShell>
  );
}
