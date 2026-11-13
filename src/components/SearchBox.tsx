"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { href } from "@/lib/paths";

export type SearchEntry = { title: string; path: string; text: string; type: string };

/** Runs entirely in the browser over a small static index. Nothing is logged or sent. */
export function SearchBox({
  index,
  locale,
  dict,
}: {
  index: SearchEntry[];
  locale: Locale;
  dict: Dictionary;
}) {
  const initial = useSearchParams().get("q") ?? "";
  const [q, setQ] = useState(initial);
  const terms = q.toLowerCase().split(/\s+/).filter((t) => t.length > 1);

  const results = useMemo(() => {
    if (terms.length === 0) return [];
    return index
      .map((e) => {
        const title = e.title.toLowerCase();
        const text = e.text.toLowerCase();
        let score = 0;
        for (const t of terms) {
          if (title.includes(t)) score += 5;
          if (text.includes(t)) score += 1;
        }
        const all = terms.every((t) => title.includes(t) || text.includes(t));
        return { e, score: all ? score : 0 };
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, index]);

  return (
    <div>
      <div className="field" style={{ maxWidth: 560 }}>
        <label htmlFor="site-search">{dict.nav.search}</label>
        <input
          id="site-search"
          type="search"
          value={q}
          placeholder={dict.search.placeholder}
          onChange={(e) => setQ(e.target.value)}
          autoComplete="off"
        />
      </div>
      <div aria-live="polite">
        {terms.length > 0 ? (
          results.length === 0 ? (
            <p>{dict.search.noResults}</p>
          ) : (
            <>
              <p>
                {results.length} {dict.search.results}
              </p>
              <ul>
                {results.map(({ e }) => (
                  <li key={e.path}>
                    <Link href={href(locale, e.path)}>{e.title}</Link>{" "}
                    <span className="tag">{e.type}</span>
                  </li>
                ))}
              </ul>
            </>
          )
        ) : null}
      </div>
    </div>
  );
}
