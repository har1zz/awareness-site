import type { Metadata } from "next";
import { getCtx, type LocaleParams } from "@/lib/ctx";
import { LegalPage } from "@/components/LegalPage";
import { Disclaimer } from "@/components/Parts";
import { site } from "@/config/site";

export const metadata: Metadata = { title: "Medical Disclaimer" };

export default async function Page({ params }: LocaleParams) {
  const { locale, dict } = await getCtx(params);
  return (
    <LegalPage locale={locale} dict={dict} title={dict.footer.medicalDisclaimer}>
      <Disclaimer dict={dict} locale={locale} />
      <h2>What this means</h2>
      <ul>
        <li>The content is general information. It is not tailored to you.</li>
        <li>The quiz and the &quot;What Should I Do Next?&quot; tool are learning aids. They do not diagnose, estimate risk, or tell you that you are healthy.</li>
        <li>No information here should be used to start, stop or change any treatment.</li>
        <li>Screening guidance differs between countries. Ask a healthcare professional what applies to you.</li>
        <li>{dict.emergency}</li>
      </ul>
      <h2>Review status</h2>
      <p>
        {site.clinicalReview.completed
          ? `Content was reviewed by ${site.clinicalReview.reviewerName} (${site.clinicalReview.reviewerCredential}) on ${site.clinicalReview.reviewDate}.`
          : "Content is drafted from public guidance by WHO, NCI, ACS and NHS and has not yet been reviewed by a qualified clinician. Each page says so until a review is done."}
      </p>
      <h2>Translations</h2>
      <p>
        Interface text in Urdu and Arabic is machine-assisted and has not been reviewed by a medical
        translator. Medical page text is currently English only.
      </p>
    </LegalPage>
  );
}
