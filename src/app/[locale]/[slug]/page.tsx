import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getPage, pages } from "@/content/pages";
import { href } from "@/lib/paths";
import {
  Blocks,
  Disclaimer,
  LocaleNotices,
  Notice,
  PageHead,
  SourceList,
} from "@/components/Parts";
import { site } from "@/config/site";

export function generateStaticParams() {
  return locales.flatMap((locale) => pages.map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const page = getPage(slug);
  if (!page || !hasLocale(locale)) return {};
  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: `/${locale}/${slug}`,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}/${slug}`])),
    },
  };
}

export default async function ContentPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!hasLocale(locale)) notFound();
  const page = getPage(slug);
  if (!page) notFound();
  const dict = getDictionary(locale);

  const related = page.related
    .map((s) => pages.find((p) => p.slug === s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <>
      <PageHead locale={locale} dict={dict} title={page.title} lead={page.lead} />
      <div className="container layout-two">
        <article className="prose">
          <LocaleNotices locale={locale} dict={dict} medical />
          {page.urgentBanner ? (
            <Notice kind="warn">
              <p>
                <strong>
                  If you notice a new or concerning breast change, do not wait. See a healthcare
                  professional.
                </strong>{" "}
                <Link href={href(locale, "what-should-i-do-next")}>
                  {dict.nav.tool}
                </Link>
              </p>
            </Notice>
          ) : null}
          {page.sections.map((s) => (
            <section key={s.heading}>
              <h2>{s.heading}</h2>
              <Blocks blocks={s.blocks} />
            </section>
          ))}
          <Disclaimer dict={dict} locale={locale} />
          <SourceList ids={page.sources} dict={dict} />
          <p className="hint">
            {dict.lastDrafted}: {site.contentDraftedOn}.{" "}
            {site.clinicalReview.completed
              ? `Clinically reviewed by ${site.clinicalReview.reviewerName} on ${site.clinicalReview.reviewDate}.`
              : "Not yet clinically reviewed."}
          </p>
        </article>
        <aside className="aside-box" aria-label={dict.relatedHeading}>
          <div className="card">
            <h2 style={{ fontSize: "1.1rem", marginTop: 0 }}>{dict.relatedHeading}</h2>
            <ul>
              {related.map((r) => (
                <li key={r.slug}>
                  <Link href={href(locale, r.slug)}>{r.title}</Link>
                </li>
              ))}
              <li>
                <Link href={href(locale, "support")}>{dict.nav.support}</Link>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </>
  );
}
