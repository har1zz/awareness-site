import type { Metadata } from "next";
import Link from "next/link";
import { getCtx, type LocaleParams } from "@/lib/ctx";
import { AdminShell } from "@/components/AdminShell";
import { requireAdmin } from "@/lib/session";
import { getSupabase } from "@/lib/supabase";
import { href } from "@/lib/paths";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };
type SP = Promise<{ [k: string]: string | string[] | undefined }>;

export default async function Page({ params, searchParams }: LocaleParams & { searchParams: SP }) {
  const { locale, dict } = await getCtx(params);
  await requireAdmin(locale, `/${locale}/admin`);
  const sp = await searchParams;
  const sb = await getSupabase();
  const count = async (table: string, col: string, val: string | boolean) => {
    const { count: c } = await sb.from(table).select("*", { count: "exact", head: true }).eq(col, val);
    return c ?? 0;
  };
  const [videos, apps, stories, msgs] = await Promise.all([
    count("videos", "status", "pending"),
    count("contributor_applications", "status", "pending"),
    count("stories", "status", "pending"),
    count("messages", "handled", false),
  ]);
  const cards: [string, number, string][] = [
    ["Videos waiting for review", videos, "admin/videos"],
    ["Contributor applications to verify", apps, "admin/contributors"],
    ["Stories waiting for review", stories, "admin/stories"],
    ["Unhandled messages", msgs, "admin/messages"],
  ];
  return (
    <AdminShell locale={locale} dict={dict} title="Admin overview" current="admin" sp={sp}>
      <div className="card-grid">
        {cards.map(([label, n, path]) => (
          <article className="card" key={path}>
            <p className="stat">{n}</p>
            <h2 className="h3">
              <Link href={href(locale, path)}>{label}</Link>
            </h2>
          </article>
        ))}
      </div>
      <p>
        Nothing becomes public without your decision. Check the <Link href={href(locale, "admin/settings")}>launch switches</Link>{" "}
        before opening sign-ups, video submissions, stories or the contact form.
      </p>
    </AdminShell>
  );
}
