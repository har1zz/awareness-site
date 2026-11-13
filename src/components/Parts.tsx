import Link from "next/link";
import type { ReactNode } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Block } from "@/content/types";
import { getSources } from "@/content/sources";
import { href } from "@/lib/paths";
import { site } from "@/config/site";

export function Notice({
  kind,
  children,
  role,
}: {
  kind: "info" | "warn" | "urgent" | "ok";
  children: ReactNode;
  role?: "note" | "alert" | "status";
}) {
  return (
    <div className={`notice ${kind}`} role={role ?? "note"}>
      {children}
    </div>
  );
}

export function Breadcrumbs({
  locale,
  dict,
  trail,
}: {
  locale: Locale;
  dict: Dictionary;
  trail: { label: string; path?: string }[];
}) {
  return (
    <nav className="breadcrumbs" aria-label={dict.breadcrumbs}>
      <ol>
        <li>
          <Link href={href(locale)}>{dict.home}</Link>
        </li>
        {trail.map((t, i) => (
          <li key={i}>
            {t.path ? (
              <Link href={href(locale, t.path)}>{t.label}</Link>
            ) : (
              <span aria-current="page">{t.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PageHead({
  locale,
  dict,
  title,
  lead,
  trail,
}: {
  locale: Locale;
  dict: Dictionary;
  title: string;
  lead?: string;
  trail?: { label: string; path?: string }[];
}) {
  return (
    <div className="page-head">
      <div className="container">
        <Breadcrumbs
          locale={locale}
          dict={dict}
          trail={[...(trail ?? []), { label: title }]}
        />
        <h1>{title}</h1>
        {lead ? <p className="lead">{lead}</p> : null}
      </div>
    </div>
  );
}

/** Shown on translated pages whose body text is English only. */
export function LocaleNotices({
  locale,
  dict,
  medical = false,
}: {
  locale: Locale;
  dict: Dictionary;
  medical?: boolean;
}) {
  return (
    <>
      {locale !== "en" ? (
        <Notice kind="warn">
          <p lang={locale}>{dict.englishOnlyNotice}</p>
          <p lang={locale}>{dict.machineTranslationNotice}</p>
        </Notice>
      ) : null}
      {medical && !site.clinicalReview.completed ? (
        <Notice kind="info">
          <p lang={locale}>{dict.clinicalReviewPending}</p>
        </Notice>
      ) : null}
    </>
  );
}

export function Disclaimer({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  return (
    <Notice kind="warn">
      <p lang={locale}>
        <strong>{dict.disclaimer}</strong>
      </p>
    </Notice>
  );
}

export function SourceList({ ids, dict }: { ids: string[]; dict: Dictionary }) {
  const list = getSources(ids);
  if (list.length === 0) return null;
  return (
    <section aria-labelledby="sources-h">
      <h2 id="sources-h">{dict.sourcesHeading}</h2>
      <ul className="sources-list">
        {list.map((s) => (
          <li key={s.id}>
            {s.org}:{" "}
            <a href={s.url} rel="noopener noreferrer" target="_blank">
              {s.title}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        switch (b.type) {
          case "p":
            return <p key={i}>{b.text}</p>;
          case "h3":
            return <h3 key={i}>{b.text}</h3>;
          case "ul":
            return (
              <ul key={i}>
                {b.items.map((t, j) => (
                  <li key={j}>{t}</li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={i}>
                {b.items.map((t, j) => (
                  <li key={j}>{t}</li>
                ))}
              </ol>
            );
          case "notice":
            return (
              <Notice key={i} kind={b.kind}>
                <p>{b.text}</p>
              </Notice>
            );
          case "expander":
            return (
              <details key={i} className="expander">
                <summary>{b.summary}</summary>
                <div className="expander-body">
                  <ul>
                    {b.items.map((t, j) => (
                      <li key={j}>{t}</li>
                    ))}
                  </ul>
                </div>
              </details>
            );
        }
      })}
    </>
  );
}
