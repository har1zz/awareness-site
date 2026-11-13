import type { Metadata } from "next";
import { getCtx, type LocaleParams } from "@/lib/ctx";
import { LocaleNotices, Notice, PageHead } from "@/components/Parts";
import { sources } from "@/content/sources";
import { site } from "@/config/site";

export const metadata: Metadata = { title: "Medical Sources and References" };

export default async function Page({ params }: LocaleParams) {
  const { locale, dict } = await getCtx(params);
  return (
    <>
      <PageHead locale={locale} dict={dict} title={dict.nav.sources} />
      <div className="container section prose">
        <LocaleNotices locale={locale} dict={dict} />
        <p>
          Our content is drafted from public guidance by these organisations. Where numbers appear,
          they are cited with their source and date.
        </p>
        <Notice kind="warn">
          <p>
            <strong>Editorial status:</strong>{" "}
            {site.clinicalReview.completed
              ? `Reviewed by ${site.clinicalReview.reviewerName} (${site.clinicalReview.reviewerCredential}) on ${site.clinicalReview.reviewDate}.`
              : "The content has not yet been reviewed by a qualified clinician. Guidance changes, so always check with a healthcare professional and the original source."}
          </p>
        </Notice>
        <ul className="sources-list">
          {Object.values(sources).map((s) => (
            <li key={s.id}>
              {s.org}:{" "}
              <a href={s.url} target="_blank" rel="noopener noreferrer">
                {s.title}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
              {s.note ? <span className="hint"> ({s.note})</span> : null}
            </li>
          ))}
        </ul>
        <h2>Corrections</h2>
        <p>If you think something is wrong or out of date, please tell us through the contact page.</p>
      </div>
    </>
  );
}
