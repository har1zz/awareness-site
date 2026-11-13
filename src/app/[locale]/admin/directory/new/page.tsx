import type { Metadata } from "next";
import { getCtx, type LocaleParams } from "@/lib/ctx";
import { AdminShell } from "@/components/AdminShell";
import { DirectoryForm } from "@/components/DirectoryForm";
import { requireAdmin } from "@/lib/session";

export const metadata: Metadata = { title: "Admin: add directory entry", robots: { index: false, follow: false } };

export default async function Page({ params }: LocaleParams) {
  const { locale, dict } = await getCtx(params);
  await requireAdmin(locale, `/${locale}/admin/directory/new`);
  return (
    <AdminShell locale={locale} dict={dict} title="Add directory entry" current="admin/directory" trail={[{ label: "Directory", path: "admin/directory" }]}>
      <DirectoryForm locale={locale} />
    </AdminShell>
  );
}
