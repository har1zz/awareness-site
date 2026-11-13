import type { Metadata } from "next";
import { getCtx, type LocaleParams } from "@/lib/ctx";
import { LegalPage, OperatorBlock } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Terms and Conditions" };

export default async function Page({ params }: LocaleParams) {
  const { locale, dict } = await getCtx(params);
  return (
    <LegalPage
      locale={locale}
      dict={dict}
      title={dict.footer.terms}
      lead="The rules for using this website. By using it, you agree to them."
    >
      <h2>1. Who runs this site</h2>
      <OperatorBlock />

      <h2>2. Educational use only</h2>
      <p>
        The site provides general educational information about breast cancer. It is not medical advice and
        does not create a doctor-patient relationship. It cannot diagnose, treat or rule out any condition.
        Always seek advice from a qualified healthcare professional about your own situation, and do not
        delay or ignore medical advice because of something you read here. See the{" "}
        <a href={`/${locale}/medical-disclaimer`}>Medical Disclaimer</a>.
      </p>

      <h2>3. Emergencies</h2>
      <p>{dict.emergency}</p>

      <h2>4. Accuracy</h2>
      <p>
        We try to keep information accurate and cite its sources, but medical knowledge and national
        guidance change, and mistakes happen. We do not guarantee that the site is complete, current or
        suitable for your circumstances. If you find an error, please tell us.
      </p>

      <h2>5. Acceptable use</h2>
      <p>You agree not to: attack, overload or probe the site for vulnerabilities; use it unlawfully; copy it in a way that misrepresents it or removes the medical disclaimers or source credits; or present its content as personal medical advice.</p>

      <h2>6. Content and copyright</h2>
      <p>
        The original text, design and code of this site belong to the operator unless stated otherwise. You
        may link to the site and share individual pages with attribution for personal, educational and
        non-commercial awareness purposes. Third-party names, logos and publications mentioned remain the
        property of their owners. See <a href={`/${locale}/credits`}>Image and Content Credits</a>.
      </p>

      <h2>7. Links to other sites</h2>
      <p>
        We link to organisations such as the WHO, NCI, ACS and NHS. We do not control those sites and are
        not responsible for their content. Listing an organisation is not an endorsement of its services.
      </p>

      <h2>8. Accounts, videos, stories and messages</h2>
      <p>
        Healthcare professionals may apply for an account to contribute videos. You must give accurate details
        and may only describe yourself as a healthcare professional if you are one. The administrator may refuse,
        suspend or remove any account, video or story at any time, and nothing is published without the
        administrator&apos;s approval. Approval is not a medical endorsement and does not make the operator
        responsible for the opinions in the content.
      </p>
      <p>When you submit a video, story or message you confirm that:</p>
      <ul>
        <li>you own it or have the right to share it, and it does not infringe anyone else&apos;s rights;</li>
        <li>it is truthful, is not advertising, does not promote products, treatments or services for payment, and does not give advice that could harm anyone;</li>
        <li>it does not show or identify any patient or other person without their written consent;</li>
        <li>you allow us to display it on this site, free of charge, until you withdraw it. You keep your rights in it.</li>
      </ul>
      <p>
        Do not submit anything unlawful, abusive, discriminatory, or intended to mislead. You can withdraw a
        video, or delete your account, at any time.
      </p>

      <h2>9. No payments</h2>
      <p>
        The site does not sell anything or accept donations. See{" "}
        <a href={`/${locale}/payments-and-refunds`}>Payments and Refunds</a>.
      </p>

      <h2>10. Limit of liability</h2>
      <p>
        The site is provided &quot;as is&quot;. To the fullest extent the law allows, the operator is not
        liable for loss or damage arising from your use of, or reliance on, the site. Nothing in these terms
        excludes liability that cannot be excluded by law, and nothing affects any rights you have as a
        consumer under the law where you live.
      </p>

      <h2>11. Changes and availability</h2>
      <p>
        We may change the site or these terms at any time. The date at the top shows the latest update. We
        do not promise the site will always be available.
      </p>

      <h2>12. Governing law</h2>
      <p>
        These terms are governed by the laws of Pakistan. Disputes are subject to the courts of Pakistan,
        without limiting any mandatory rights you have under the law of the country where you live.
      </p>
    </LegalPage>
  );
}
