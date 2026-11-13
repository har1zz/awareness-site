import type { Metadata } from "next";
import { getCtx, type LocaleParams } from "@/lib/ctx";
import { Disclaimer, LocaleNotices, PageHead } from "@/components/Parts";
import { MythCards } from "@/components/MythCards";
import { myths } from "@/content/myths";

export const metadata: Metadata = {
  title: "Myths vs. Facts",
  description: "Common breast cancer myths and what the evidence says.",
};

export default async function Page({ params }: LocaleParams) {
  const { locale, dict } = await getCtx(params);
  return (
    <>
      <PageHead
        locale={locale}
        dict={dict}
        title={dict.nav.myths}
        lead="Select a card to reveal the fact. Every fact lists its source."
      />
      <div className="container section">
        <LocaleNotices locale={locale} dict={dict} medical />
        <MythCards myths={myths} />
        <Disclaimer dict={dict} locale={locale} />
      </div>
    </>
  );
}
