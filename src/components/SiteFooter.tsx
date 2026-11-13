import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { href } from "@/lib/paths";
import { site } from "@/config/site";

export function SiteFooter({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const f = dict.footer;
  const n = dict.nav;
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <section>
            <h2>{site.name}</h2>
            <p>{site.tagline}</p>
            <p>
              {f.operator}: {site.operator.legalName}, {site.operator.country}
            </p>
            <p>
              <a href={`mailto:${site.operator.contactEmail}`}>
                {site.operator.contactEmail}
              </a>
            </p>
          </section>
          <section>
            <h2>{dict.nav.learn}</h2>
            <ul>
              <li><Link href={href(locale, "about-breast-cancer")}>{n.about}</Link></li>
              <li><Link href={href(locale, "signs-and-symptoms")}>{n.signs}</Link></li>
              <li><Link href={href(locale, "screening-and-diagnosis")}>{n.screening}</Link></li>
              <li><Link href={href(locale, "faq")}>{n.faq}</Link></li>
              <li><Link href={href(locale, "sources")}>{n.sources}</Link></li>
            </ul>
          </section>
          <section>
            <h2>{f.legal}</h2>
            <ul>
              <li><Link href={href(locale, "privacy")}>{f.privacy}</Link></li>
              <li><Link href={href(locale, "terms")}>{f.terms}</Link></li>
              <li><Link href={href(locale, "cookies")}>{f.cookies}</Link></li>
              <li><Link href={href(locale, "payments-and-refunds")}>{f.payments}</Link></li>
              <li><Link href={href(locale, "medical-disclaimer")}>{f.medicalDisclaimer}</Link></li>
              <li><Link href={href(locale, "accessibility")}>{f.accessibility}</Link></li>
              <li><Link href={href(locale, "credits")}>{f.credits}</Link></li>
            </ul>
          </section>
        </div>
        <div className="footer-disclaimer">
          <p>{dict.disclaimer}</p>
          <p>{f.noTracking}</p>
        </div>
      </div>
    </footer>
  );
}
