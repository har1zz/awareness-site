import type { ReactNode } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { LocaleNotices, PageHead } from "./Parts";
import { site } from "@/config/site";

export function LegalPage({
  locale,
  dict,
  title,
  lead,
  children,
}: {
  locale: Locale;
  dict: Dictionary;
  title: string;
  lead?: string;
  children: ReactNode;
}) {
  return (
    <>
      <PageHead locale={locale} dict={dict} title={title} lead={lead} />
      <div className="container section prose">
        <LocaleNotices locale={locale} dict={dict} />
        <p className="hint">Last updated: {site.legalLastUpdated}</p>
        {children}
      </div>
    </>
  );
}

export function OperatorBlock() {
  const o = site.operator;
  return (
    <ul>
      <li>
        <strong>Operator:</strong> {o.legalName}, {o.status}, based in {o.country}.
      </li>
      <li>
        <strong>Address:</strong> {o.postalAddress}
      </li>
      <li>
        <strong>Email:</strong> {o.contactEmail}
      </li>
    </ul>
  );
}
