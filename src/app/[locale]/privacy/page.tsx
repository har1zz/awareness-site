import type { Metadata } from "next";
import { getCtx, type LocaleParams } from "@/lib/ctx";
import { LegalPage, OperatorBlock } from "@/components/LegalPage";
import { site } from "@/config/site";

export const metadata: Metadata = { title: "Privacy Policy" };

export default async function Page({ params }: LocaleParams) {
  const { locale, dict } = await getCtx(params);
  return (
    <LegalPage
      locale={locale}
      dict={dict}
      title={dict.footer.privacy}
      lead="We collect as little information as possible. This page explains exactly what, and why."
    >
      <h2>Who we are</h2>
      <OperatorBlock />
      <p>
        We are the person responsible for deciding how information about visitors is used (the
        &quot;controller&quot;, in data protection terms).
      </p>

      <h2>The short version</h2>
      <ul>
        <li>You can read everything on this site without an account, without cookies and without giving us any information.</li>
        <li>An account is only needed by healthcare professionals who want to contribute videos. Stories and the contact form can be used without an account.</li>
        <li>We do not use advertising, analytics or tracking cookies. Videos from YouTube or Vimeo load only after you press a button.</li>
        <li>Quiz answers, the &quot;What Should I Do Next?&quot; choices and the search box stay in your browser and are never sent to us.</li>
        <li>We do not sell personal data. We do not ask for identity documents.</li>
      </ul>

      <h2>What we do collect</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th scope="col">Information</th>
              <th scope="col">Why</th>
              <th scope="col">Legal basis</th>
              <th scope="col">Kept for</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Technical server logs: IP address, date and time, page requested, browser type. Our hosting provider ({site.hosting.provider}, {site.hosting.region}) creates these automatically when you visit.</th>
              <td>To deliver the site, keep it secure, and diagnose faults and abuse.</td>
              <td>Our legitimate interest in running a secure website.</td>
              <td>As set by the hosting provider (typically days to a few weeks). We do not use them to identify or profile visitors.</td>
            </tr>
            <tr>
              <th scope="row">Contact form or email: your message, and your name and email address only if you give them.</th>
              <td>To reply, deal with corrections, accessibility or privacy requests.</td>
              <td>Your request, and our legitimate interest in running the site.</td>
              <td>Until dealt with, then deleted, and in any case no more than 12 months unless the law requires longer.</td>
            </tr>
            <tr>
              <th scope="row">Story submission: the story, category, language, optional display name, optional content warning, and your two confirmations.</th>
              <td>To review and, if approved, publish your story.</td>
              <td>Your consent, given by ticking the boxes.</td>
              <td>Rejected stories are deleted. Published stories stay until you ask us to remove them. Because stories can be anonymous we may not be able to find yours, so please keep a copy of its title.</td>
            </tr>
            <tr>
              <th scope="row">Account: email address and password (stored only as a secure hash by our authentication provider).</th>
              <td>To let you sign in and manage your submissions.</td>
              <td>Your request to create an account.</td>
              <td>Until you delete your account (Account page).</td>
            </tr>
            <tr>
              <th scope="row">Healthcare professional application: full name, specialty, country, registration body and number, optional workplace, biography, and your confirmations.</th>
              <td>To check that you are a qualified professional, and to credit you on approved videos.</td>
              <td>Your consent and our legitimate interest in publishing only verified information.</td>
              <td>Until you delete your account. Registration details are never shown publicly. Name, specialty, country, workplace (if given) and biography appear publicly only beside your approved videos.</td>
            </tr>
            <tr>
              <th scope="row">Video submission: link, title, description, transcript, references and credit line.</th>
              <td>To review and publish the video.</td>
              <td>Your consent.</td>
              <td>Until you withdraw the video or delete your account.</td>
            </tr>
            <tr>
              <th scope="row">Security records: when a submission is reviewed or a setting is changed, the administrator&apos;s action is logged.</th>
              <td>Accountability and abuse prevention.</td>
              <td>Our legitimate interest.</td>
              <td>12 months.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Please do not send us health details, medical records, patient information or identity documents in a
        story, message or video. We do not need them. Video submissions must not show or identify any patient.
      </p>

      <h2>What stays on your device</h2>
      <p>
        Quiz answers and results, next-step tool choices, search words and the name you may type on a
        certificate exist only in your browser&apos;s memory while the page is open. They are not
        transmitted to us or anyone else and disappear when you close or refresh the page.
        See our <a href={`/${locale}/cookies`}>Cookie Policy</a> for the sign-in cookie.
      </p>

      <h2>Videos from YouTube and Vimeo</h2>
      <p>
        Approved videos are hosted by YouTube (we use its privacy-enhanced mode) or Vimeo, not by us. Nothing is
        requested from them until you press &quot;Load video&quot;. After that, that company receives your IP
        address and may set cookies under its own policy. You can instead open the video on its own site.
      </p>

      <h2>Sharing your information</h2>
      <p>
        We share information only with our service providers, who process it for us: our hosting provider
        ({site.hosting.provider}, {site.hosting.region}) and our database and sign-in provider ({site.database.provider},
        {" "}{site.database.region}). Authorities may receive information where the law requires it. Providers
        operate in other countries, so your information may be processed outside Pakistan and outside your own
        country. Links to other websites (for example WHO or NHS) are governed by their own privacy policies.
      </p>

      <h2>Your rights</h2>
      <p>
        Pakistan does not currently have a general data protection law in force; a bill has been drafted
        but at the time of writing it has not been enacted. We nevertheless aim to follow widely accepted
        principles, and if you are in the European Economic Area, the United Kingdom or another place with
        data protection law, you may have the right to ask us to: tell you what we hold about you; correct
        it; delete it; restrict or object to our use of it; and complain to your local data protection
        authority. You can delete your account and the data linked to it yourself on the Account page. For anything else, email {site.operator.privacyEmail}. We will answer as soon
        as we reasonably can.
      </p>

      <h2>Security</h2>
      <p>
        The site is served over HTTPS and sends security headers that block third-party scripts. Our database
        uses row-level access rules so the public can only read what has been approved, and every video is
        reviewed by the administrator before it is public. No system is perfectly secure. If we become aware of a breach that puts your rights at
        risk, we will take reasonable steps to tell those affected.
      </p>

      <h2>Children</h2>
      <p>
        The site is general health education and is not directed at children under 13. We do not
        knowingly collect personal information from children.
      </p>

      <h2>Changes</h2>
      <p>
        If we add anything new that collects personal data (for example analytics), we will update this
        policy and, where the law requires, ask for your consent before it starts.
      </p>
    </LegalPage>
  );
}
