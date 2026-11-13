import { Suspense } from "react";
import type { Metadata } from "next";
import { getCtx, type LocaleParams } from "@/lib/ctx";
import { PageHead, LocaleNotices } from "@/components/Parts";
import { SearchBox, type SearchEntry } from "@/components/SearchBox";
import { pages } from "@/content/pages";
import { myths } from "@/content/myths";
import { faq } from "@/content/faq";

export const metadata: Metadata = { title: "Search" };

function buildIndex(): SearchEntry[] {
  const idx: SearchEntry[] = [];
  for (const p of pages) {
    idx.push({
      title: p.title,
      path: p.slug,
      type: "Article",
      text: [
        p.description,
        p.lead,
        ...p.sections.flatMap((s) => [
          s.heading,
          ...s.blocks.flatMap((b) =>
            b.type === "p" || b.type === "h3" || b.type === "notice"
              ? [b.text]
              : b.type === "ul" || b.type === "ol" || b.type === "expander"
                ? b.items
                : [],
          ),
        ]),
      ].join(" "),
    });
  }
  idx.push({
    title: "Myths vs. Facts",
    path: "myths-vs-facts",
    type: "Myths",
    text: myths.map((m) => `${m.myth} ${m.fact}`).join(" "),
  });
  idx.push({
    title: "Frequently Asked Questions",
    path: "faq",
    type: "FAQ",
    text: faq.map((f) => `${f.q} ${f.a}`).join(" "),
  });
  idx.push({ title: "Awareness Quiz", path: "quiz", type: "Tool", text: "quiz test knowledge questions" });
  idx.push({
    title: "What Should I Do Next?",
    path: "what-should-i-do-next",
    type: "Tool",
    text: "next steps lump change nipple discharge pain concern what to do",
  });
  idx.push({
    title: "Get Help and Find Support",
    path: "support",
    type: "Support",
    text: "help support hospital clinic find care organisations",
  });
  return idx;
}

export default async function Page({ params }: LocaleParams) {
  const { locale, dict } = await getCtx(params);
  return (
    <>
      <PageHead locale={locale} dict={dict} title={dict.nav.search} />
      <div className="container section">
        <LocaleNotices locale={locale} dict={dict} />
        <Suspense fallback={null}>
          <SearchBox index={buildIndex()} locale={locale} dict={dict} />
        </Suspense>
      </div>
    </>
  );
}
