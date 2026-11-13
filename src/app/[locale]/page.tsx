import Link from "next/link";
import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { href } from "@/lib/paths";
import { Ribbon } from "@/components/Ribbon";
import { Disclaimer, LocaleNotices, Notice } from "@/components/Parts";
import { myths } from "@/content/myths";
import { site } from "@/config/site";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const n = dict.nav;

  const topics: [string, string, string][] = [
    ["about-breast-cancer", n.about, "What breast cancer is, the main types, and how stage and grade are described."],
    ["signs-and-symptoms", n.signs, "Breast changes that should be checked, and why not to wait."],
    ["risk-factors-and-prevention", n.risk, "Which risk factors can and cannot be changed, and what may lower risk."],
    ["breast-health-guide", n.guide, "Get to know what is normal for you and how to describe a change."],
    ["screening-and-diagnosis", n.screening, "Screening versus diagnosis, common tests, benefits and limits."],
    ["treatment-and-recovery", n.treatment, "An overview of treatment, side effects and follow-up care."],
  ];
  const firstMyth = myths[0];

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <h1>{dict.hero.title}</h1>
            <p className="lead">{dict.hero.text}</p>
            <div className="btn-row">
              <Link className="btn" href={href(locale, "about-breast-cancer")}>
                {dict.hero.cta1}
              </Link>
              <Link className="btn secondary" href={href(locale, "signs-and-symptoms")}>
                {dict.hero.cta2}
              </Link>
              <Link className="btn secondary" href={href(locale, "support")}>
                {dict.hero.cta3}
              </Link>
            </div>
          </div>
          <div>
            <Ribbon size={150} />
          </div>
        </div>
      </section>

      <div className="container">
        <LocaleNotices locale={locale} dict={dict} medical />
        <Disclaimer dict={dict} locale={locale} />
      </div>

      <section className="section">
        <div className="container">
          <h2 style={{ marginTop: 0 }}>{n.learn}</h2>
          <div className="card-grid">
            {topics.map(([slug, title, text]) => (
              <article className="card" key={slug}>
                <h3>{title}</h3>
                <p>{text}</p>
                <Link className="card-link" href={href(locale, slug)}>
                  {title}
                  <span className="sr-only">: read more</span>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <h2 style={{ marginTop: 0 }}>Why awareness and timely assessment matter</h2>
          <p className="prose">
            The World Health Organization reports that breast cancer is the most common cancer in
            women in most countries. Finding breast cancer at an earlier stage generally gives more
            treatment options. Knowing the possible warning signs and seeking assessment promptly
            for a new change are two of the most useful things anyone can do.
          </p>
          <Notice kind="info">
            <p>
              Source: WHO breast cancer fact sheet, dated 3 July 2026 (estimates from the IARC Global
              Cancer Observatory). Figures are estimates and are updated by WHO over time.
            </p>
          </Notice>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 style={{ marginTop: 0 }}>Try these tools</h2>
          <div className="card-grid">
            <article className="card">
              <h3>{n.tool}</h3>
              <p>
                Choose your concern and see educational next steps. It never diagnoses and nothing you choose is stored.
              </p>
              <Link className="card-link" href={href(locale, "what-should-i-do-next")}>
                {dict.tool.start}: {n.tool}
              </Link>
            </article>
            <article className="card">
              <h3>{n.quiz}</h3>
              <p>30 questions at three difficulty levels, with an explanation for every answer.</p>
              <Link className="card-link" href={href(locale, "quiz")}>
                {dict.quiz.start}
              </Link>
            </article>
            <article className="card">
              <h3>{n.myths}</h3>
              <p>
                <strong>Myth:</strong> {firstMyth.myth}
              </p>
              <Link className="card-link" href={href(locale, "myths-vs-facts")}>
                See the fact
                <span className="sr-only"> about: {firstMyth.myth}</span>
              </Link>
            </article>
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <h2 style={{ marginTop: 0 }}>Doctors, stories and community</h2>
          <p className="prose">
            We plan to feature educational videos from verified healthcare professionals and
            permissioned personal stories. Neither is open yet, and nothing will be published until
            it has been reviewed. We will not display made-up testimonials, view counts or
            fundraising totals.
          </p>
          <div className="btn-row">
            <Link className="btn secondary" href={href(locale, "videos")}>
              {n.videos}
            </Link>
            <Link className="btn secondary" href={href(locale, "contribute")}>
              {n.contribute}
            </Link>
            <Link className="btn secondary" href={href(locale, "stories")}>
              {n.stories}
            </Link>
          </div>
          <p className="hint">
            Run by {site.operator.legalName}, {site.operator.country}.
          </p>
        </div>
      </section>
    </>
  );
}
