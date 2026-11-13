import Link from "next/link";
import type { ReactNode } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { PageHead } from "./Parts";
import { Flash } from "./Flash";
import { href } from "@/lib/paths";

const items: [string, string][] = [
  ["admin", "Overview"],
  ["admin/videos", "Videos"],
  ["admin/contributors", "Contributors"],
  ["admin/stories", "Stories"],
  ["admin/messages", "Messages"],
  ["admin/directory", "Directory"],
  ["admin/settings", "Launch switches"],
  ["admin/audit", "Audit log"],
];

export function AdminShell({
  locale,
  dict,
  title,
  current,
  sp,
  trail,
  children,
}: {
  locale: Locale;
  dict: Dictionary;
  title: string;
  current: string;
  sp?: { [k: string]: string | string[] | undefined };
  trail?: { label: string; path?: string }[];
  children: ReactNode;
}) {
  return (
    <>
      <PageHead locale={locale} dict={dict} title={title} trail={[{ label: "Admin", path: "admin" }, ...(trail ?? [])]} />
      <div className="container section">
        <nav aria-label="Admin sections">
          <ul className="admin-nav">
            {items.map(([path, label]) => (
              <li key={path}>
                <Link href={href(locale, path)} aria-current={current === path ? "page" : undefined}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <Flash code={sp?.m} />
        <Flash code={sp?.e} />
        {children}
      </div>
    </>
  );
}
