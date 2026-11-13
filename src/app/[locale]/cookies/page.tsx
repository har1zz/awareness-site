import type { Metadata } from "next";
import { getCtx, type LocaleParams } from "@/lib/ctx";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Cookie Policy" };

export default async function Page({ params }: LocaleParams) {
  const { locale, dict } = await getCtx(params);
  return (
    <LegalPage
      locale={locale}
      dict={dict}
      title={dict.footer.cookies}
      lead="Reading this site sets no cookies. A sign-in cookie is used only if you sign in."
    >
      <h2>What we use</h2>
      <p>
        Reading this site sets no cookies and uses no localStorage, sessionStorage or IndexedDB. Your chosen
        language is kept in the web address (for example <code>/en/</code> or <code>/ur/</code>).
      </p>
      <p>
        <strong>Only if you sign in</strong> (healthcare professionals and the administrator), our authentication
        provider sets a small sign-in cookie. It keeps you signed in and is needed for the service you asked for.
        It is not used for tracking or advertising, it is protected from scripts (<code>HttpOnly</code>) and it is
        removed when you sign out. Because it is strictly necessary, no consent banner is required for it.
      </p>
      <h2>What we do not use</h2>
      <ul>
        <li>No analytics cookies or analytics scripts.</li>
        <li>No advertising, retargeting or social-media tracking pixels.</li>
        <li>No maps or share buttons from other companies.</li>
        <li>No web fonts loaded from other companies. The site uses fonts already on your device.</li>
      </ul>
      <h2>Videos</h2>
      <p>
        Some pages show a video hosted by YouTube (privacy-enhanced mode) or Vimeo. Nothing is loaded from them
        until you press &quot;Load video&quot;. After that, they may set their own cookies, which we do not control.
        If you do not want that, do not press the button; use the link to watch on their site instead, or skip it.
      </p>
      <p>
        Our security settings (a Content-Security-Policy) tell your browser to refuse to load content from
        any website other than those two video hosts.
      </p>
      <h2>Why there is no cookie banner</h2>
      <p>
        Consent banners are needed when a site stores or reads information on your device for
        non-essential purposes. We do not, and the video hosts only act after you press a button, so you make
        that choice at the moment it matters. If this ever changes we will update this page and ask for your
        choice first.
      </p>
      <h2>Links to other websites</h2>
      <p>
        When you click a link to another site (such as the WHO or the NHS), that site may set its own
        cookies. We do not control them. Please read their cookie policies.
      </p>
    </LegalPage>
  );
}
