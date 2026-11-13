import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCtx } from "@/lib/ctx";
import { AdminShell } from "@/components/AdminShell";
import { DirectoryForm } from "@/components/DirectoryForm";
import { requireAdmin } from "@/lib/session";
import { getSupabase } from "@/lib/supabase";

export const metadata: Metadata = { title: "Admin: edit directory entry", robots: { index: false, follow: false } };

export default async function Page({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { id } = await params;
  const { locale, dict } = await getCtx(params);
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();
  await requireAdmin(locale, `/${locale}/admin/directory/${id}`);
  const sb = await getSupabase();
  const { data } = await sb.from("directory_entries").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  return (
    <AdminShell locale={locale} dict={dict} title={data.name} current="admin/directory" trail={[{ label: "Directory", path: "admin/directory" }]}>
      <DirectoryForm locale={locale} row={data} />
    </AdminShell>
  );
}
