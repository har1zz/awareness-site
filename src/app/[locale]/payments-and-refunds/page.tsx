import type { Metadata } from "next";
import { getCtx, type LocaleParams } from "@/lib/ctx";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Payments and Refunds" };

export default async function Page({ params }: LocaleParams) {
  const { locale, dict } = await getCtx(params);
  return (
    <LegalPage
      locale={locale}
      dict={dict}
      title={dict.footer.payments}
      lead="This site is free and does not take payments, so there is nothing to refund."
    >
      <h2>No sales, no donations</h2>
      <p>
        This website does not sell products or services, does not charge fees, and does not accept
        donations or other payments. It has no shopping cart, checkout or payment form, and we never ask
        for card or bank details.
      </p>
      <h2>Refunds</h2>
      <p>
        Because nothing is sold, a refund policy does not apply. If you are ever asked to pay money by
        someone claiming to represent this site, it is not us. Please report it through the contact page.
      </p>
      <h2>Giving to charity</h2>
      <p>
        If you want to support breast cancer causes, give directly to a registered charity or hospital of
        your choice, and check that it is genuine first. We do not receive any part of such gifts.
      </p>
      <h2>If this changes</h2>
      <p>
        If we ever accept payments or donations, we will publish a full refund and payment policy, the
        identity of the payment provider, and the details required by law before the first payment is taken.
      </p>
    </LegalPage>
  );
}
