import Link from "next/link";
import type { Metadata } from "next";
import { getCtx, type LocaleParams } from "@/lib/ctx";
import { LocaleNotices, Notice, PageHead } from "@/components/Parts";
import { href } from "@/lib/paths";

export const metadata: Metadata = { title: "Campaigns and Resources" };

export default async function Page({ params }: LocaleParams) {
  const { locale, dict } = await getCtx(params);
  return (
    <>
      <PageHead
        locale={locale}
        dict={dict}
        title={dict.nav.resources}
        lead="Materials to help you spread accurate information."
      />
      <div className="container section prose">
        <LocaleNotices locale={locale} dict={dict} />
        <Notice kind="info">
          <p>
            <strong>No downloadable materials are published yet.</strong> We will add posters, guides and
            social cards after they are written, checked by a clinician and tested for accessibility. We
            do not accept or display donations, and we do not list fundraising totals.
          </p>
        </Notice>
        <h2>What you can do now</h2>
        <ul>
          <li>
            Share a page from this site, such as{" "}
            <Link href={href(locale, "signs-and-symptoms")}>signs and symptoms</Link> or{" "}
            <Link href={href(locale, "myths-vs-facts")}>myths versus facts</Link>.
          </li>
          <li>
            Use the <Link href={href(locale, "quiz")}>quiz</Link> with a school, workplace or community group.
          </li>
          <li>
            Download official awareness materials from the organisations on the{" "}
            <Link href={href(locale, "support")}>support page</Link>.
          </li>
        </ul>
        <h2>If you want to donate</h2>
        <p>
          This site does not take donations. If you wish to give, please do so directly with a
          registered charity or hospital of your choice, and check that it is genuine before you give.
        </p>
      </div>
    </>
  );
}
