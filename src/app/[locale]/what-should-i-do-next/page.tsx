import type { Metadata } from "next";
import { getCtx, type LocaleParams } from "@/lib/ctx";
import { Disclaimer, LocaleNotices, Notice, PageHead } from "@/components/Parts";
import { NextSteps } from "@/components/NextSteps";

export const metadata: Metadata = {
  title: "What Should I Do Next?",
  description: "An educational tool that suggests sensible next steps for a breast health concern. It does not diagnose.",
};

export default async function Page({ params }: LocaleParams) {
  const { locale, dict } = await getCtx(params);
  return (
    <>
      <PageHead
        locale={locale}
        dict={dict}
        title={dict.nav.tool}
        lead="Answer a couple of questions to see educational next steps."
      />
      <div className="container section">
        <LocaleNotices locale={locale} dict={dict} medical />
        <Notice kind="warn">
          <p>
            <strong>What this tool is not.</strong> It cannot diagnose, cannot tell you that you
            are fine or free of cancer, and does not estimate your risk. It gives general
            educational suggestions only. Only a healthcare professional who examines you can
            assess a breast change.
          </p>
        </Notice>
        <Notice kind="urgent">
          <p>{dict.emergency}</p>
        </Notice>
        <NextSteps locale={locale} dict={dict} />
        <Disclaimer dict={dict} locale={locale} />
      </div>
    </>
  );
}
