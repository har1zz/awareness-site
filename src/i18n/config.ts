export const locales = ["en", "ur", "ar"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const localeMeta: Record<
  Locale,
  { name: string; nativeName: string; dir: "ltr" | "rtl"; hreflang: string }
> = {
  en: { name: "English", nativeName: "English", dir: "ltr", hreflang: "en" },
  ur: { name: "Urdu", nativeName: "اردو", dir: "rtl", hreflang: "ur" },
  ar: { name: "Arabic", nativeName: "العربية", dir: "rtl", hreflang: "ar" },
};

export function hasLocale(v: string): v is Locale {
  return (locales as readonly string[]).includes(v);
}

/**
 * Pick a locale from an Accept-Language header. No cookie is set: the
 * language lives in the URL, so we never need to store a preference.
 */
export function pickLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return defaultLocale;
  const wanted = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { tag: tag.toLowerCase().split("-")[0], q: q ? parseFloat(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);
  for (const w of wanted) {
    if (hasLocale(w.tag)) return w.tag;
  }
  return defaultLocale;
}
