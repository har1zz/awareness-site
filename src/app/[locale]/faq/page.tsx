import type { Metadata } from "next";
import { getCtx, type LocaleParams } from "@/lib/ctx";
import { Disclaimer, LocaleNotices, PageHead } from "@/components/Parts";
import { faq } from "@/content/faq";
import { getSources } from "@/content/sources";

export const metadata: Metadata = { title: "Frequently Asked Questions" };

export default async function Page({ params }: LocaleParams) {
  const { locale, dict } = await getCtx(params);
  return (
    <>
      <PageHead locale={locale} dict={dict} title={dict.nav.faq} />
      <div className="container section prose">
        <LocaleNotices locale={locale} dict={dict} medical />
        {faq.map((f) => (
          <details className="expander" key={f.q}>
            <summary>{f.q}</summary>
            <div className="expander-body">
              <p>{f.a}</p>
              {f.sources.length > 0 ? (
                <p className="hint">
                  Sources:{" "}
                  {getSources(f.sources).map((s, i) => (
                    <span key={s.id}>
                      {i > 0 ? "; " : ""}
                      <a href={s.url} target="_blank" rel="noopener noreferrer">
                        {s.org}
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    </span>
                  ))}
                </p>
              ) : null}
            </div>
          </details>
        ))}
        <Disclaimer dict={dict} locale={locale} />
      </div>
    </>
  );
}
