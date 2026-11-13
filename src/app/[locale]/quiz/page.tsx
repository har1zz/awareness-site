import type { Metadata } from "next";
import { getCtx, type LocaleParams } from "@/lib/ctx";
import { Disclaimer, LocaleNotices, PageHead } from "@/components/Parts";
import { Quiz } from "@/components/Quiz";
import { quiz } from "@/content/quiz";

export const metadata: Metadata = {
  title: "Awareness Quiz",
  description: "A 30-question breast cancer awareness quiz with explanations.",
};

export default async function Page({ params }: LocaleParams) {
  const { locale, dict } = await getCtx(params);
  return (
    <>
      <PageHead
        locale={locale}
        dict={dict}
        title={dict.nav.quiz}
        lead="Test what you know. Questions and answer choices are shuffled every time, and every answer has an explanation."
      />
      <div className="container section">
        <LocaleNotices locale={locale} dict={dict} medical />
        <Quiz questions={quiz} dict={dict} />
        <Disclaimer dict={dict} locale={locale} />
      </div>
    </>
  );
}
