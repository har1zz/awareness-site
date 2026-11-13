import { notFound } from "next/navigation";
import { hasLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export type LocaleParams = { params: Promise<{ locale: string }> };

export async function getCtx(params: LocaleParams["params"]) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  return { locale: locale as Locale, dict: getDictionary(locale as Locale) };
}

export const localeStaticParams = () => locales.map((locale) => ({ locale }));
