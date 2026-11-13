import type { Metadata } from "next";
import { getCtx, type LocaleParams } from "@/lib/ctx";
import { LegalPage } from "@/components/LegalPage";
import { site } from "@/config/site";

export const metadata: Metadata = { title: "Accessibility Statement" };

export default async function Page({ params }: LocaleParams) {
  const { locale, dict } = await getCtx(params);
  return (
    <LegalPage
      locale={locale}
      dict={dict}
      title={dict.footer.accessibility}
      lead="We want everyone to be able to use this site."
    >
      <h2>Our aim</h2>
      <p>
        We aim to meet the Web Content Accessibility Guidelines (WCAG) 2.2 at level AA. We have not had a
        formal external audit, so we cannot claim full conformance.
      </p>
      <h2>What we have done</h2>
      <ul>
        <li>A skip link, headings in order, labelled regions and a keyboard-operable menu.</li>
        <li>Visible focus outlines and touch targets of at least 44 pixels.</li>
        <li>Text and background colours checked against the 4.5:1 contrast ratio with an automated script.</li>
        <li>Forms (quiz, tool, search) with real labels; the quiz and tool can be completed with a keyboard only, and focus moves to each new question or result.</li>
        <li>Decorative images are hidden from screen readers. The site uses no photographs and no video.</li>
        <li>Links that open a new tab say so for screen-reader users.</li>
        <li>Animation is disabled for people who ask their device to reduce motion.</li>
        <li>Right-to-left layout for Urdu and Arabic, and language set on every page.</li>
      </ul>
      <h2>Known limitations</h2>
      <ul>
        <li>We have not yet tested with a range of screen readers by real users. Automated checks do not find every problem.</li>
        <li>Urdu and Arabic interface text is machine-assisted and unreviewed. Medical content is English only for now.</li>
      </ul>
      <h2>Tell us about a problem</h2>
      <p>
        If you cannot use part of the site, or need information in another format, email{" "}
        {site.operator.contactEmail}. Tell us the page and what went wrong. We will try to fix it or give
        you the information another way.
      </p>
    </LegalPage>
  );
}
