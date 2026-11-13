"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useId, useState } from "react";
import { Ribbon } from "./Ribbon";
import { locales, localeMeta, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { href } from "@/lib/paths";

type Props = { locale: Locale; dict: Dictionary; siteName: string };

export function SiteHeader({ locale, dict, siteName }: Props) {
  const [open, setOpen] = useState(false);
  const navId = useId();
  const pathname = usePathname();
  const n = dict.nav;
  const rest = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, "");

  const groups: { title: string; items: [string, string][] }[] = [
    {
      title: n.learn,
      items: [
        ["about-breast-cancer", n.about],
        ["signs-and-symptoms", n.signs],
        ["risk-factors-and-prevention", n.risk],
        ["breast-health-guide", n.guide],
        ["screening-and-diagnosis", n.screening],
        ["treatment-and-recovery", n.treatment],
        ["living-with-breast-cancer", "Living with Breast Cancer"],
      ],
    },
    {
      title: n.interact,
      items: [
        ["myths-vs-facts", n.myths],
        ["quiz", n.quiz],
        ["what-should-i-do-next", n.tool],
        ["appointment-preparation", "Appointment Checklist"],
        ["faq", n.faq],
      ],
    },
    {
      title: n.community,
      items: [
        ["support", n.support],
        ["stories", n.stories],
        ["videos", n.videos],
        ["contribute", n.contribute],
        ["resources", n.resources],
      ],
    },
    {
      title: n.more,
      items: [
        ["sources", n.sources],
        ["contact", n.contact],
        ["account", n.account],
        ["search", n.search],
      ],
    },
  ];

  return (
    <header className="site-header">
      <div className="container header-bar">
        <Link href={href(locale)} className="brand">
          <Ribbon size={26} />
          <span>{siteName}</span>
        </Link>
        <span className="header-spacer" />
        <nav className="lang-switch" aria-label={dict.language}>
          {locales.map((l) =>
            l === locale ? (
              <span key={l} aria-current="true" lang={l}>
                {localeMeta[l].nativeName}
              </span>
            ) : (
              <Link
                key={l}
                href={`/${l}${rest}`}
                lang={l}
                hrefLang={l}
                aria-label={`${localeMeta[l].name} (${localeMeta[l].nativeName})`}
              >
                {localeMeta[l].nativeName}
              </Link>
            ),
          )}
        </nav>
        <button
          type="button"
          className="menu-button"
          aria-expanded={open}
          aria-controls={navId}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? dict.closeMenu : dict.menu}
        </button>
      </div>
      <nav
        id={navId}
        className="main-nav"
        aria-label={dict.menu}
        hidden={!open}
        onKeyDown={(e) => {
          if (e.key === "Escape") setOpen(false);
        }}
      >
        <div className="container">
          <div className="nav-groups">
            {groups.map((g) => (
              <section key={g.title}>
                <h2>{g.title}</h2>
                <ul>
                  {g.items.map(([slug, label]) => {
                    const target = href(locale, slug);
                    return (
                      <li key={slug}>
                        <Link
                          href={target}
                          aria-current={pathname === target ? "page" : undefined}
                          onClick={() => setOpen(false)}
                        >
                          {label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}
