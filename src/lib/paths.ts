import type { Locale } from "@/i18n/config";

export function href(locale: Locale, path = ""): string {
  const p = path.replace(/^\/+/, "");
  return p ? `/${locale}/${p}` : `/${locale}`;
}

/** All top-level routes, used by the sitemap and navigation. */
export const staticRoutes = [
  "myths-vs-facts",
  "quiz",
  "what-should-i-do-next",
  "support",
  "stories",
  "videos",
  "contribute",
  "resources",
  "faq",
  "sources",
  "contact",
  "search",
  "privacy",
  "terms",
  "cookies",
  "payments-and-refunds",
  "medical-disclaimer",
  "accessibility",
  "credits",
] as const;
