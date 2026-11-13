import type { Metadata } from "next";
import { getCtx, type LocaleParams } from "@/lib/ctx";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Image and Content Credits" };

export default async function Page({ params }: LocaleParams) {
  const { locale, dict } = await getCtx(params);
  return (
    <LegalPage locale={locale} dict={dict} title={dict.footer.credits}>
      <h2>Images</h2>
      <ul>
        <li>This site uses no photographs, stock images, or third-party illustrations.</li>
        <li>The awareness ribbon graphic is a simple original drawing made for this site. It is not any charity&apos;s logo.</li>
      </ul>
      <h2>Text</h2>
      <p>
        Educational text is written in our own words from public guidance by the World Health Organization,
        the U.S. National Cancer Institute, the American Cancer Society and the UK NHS, who are listed on the{" "}
        <a href={`/${locale}/sources`}>sources page</a>. We have not copied their text. We are not
        affiliated with or endorsed by any of them.
      </p>
      <h2>Fonts and code</h2>
      <p>
        The site uses fonts already installed on your device. It is built with open-source software
        (Next.js and React, MIT licence).
      </p>
      <h2>Rule for new material</h2>
      <p>
        Before adding any image, video, font or text from elsewhere, we confirm we have the right to use
        it and record the source and licence on this page.
      </p>
    </LegalPage>
  );
}
