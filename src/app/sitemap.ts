import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { pages } from "@/content/pages";
import { staticRoutes } from "@/lib/paths";
import { site } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", ...pages.map((p) => p.slug), ...staticRoutes];
  return locales.flatMap((l) =>
    paths.map((p) => ({
      url: `${site.url}/${l}${p ? `/${p}` : ""}`,
      alternates: {
        languages: Object.fromEntries(
          locales.map((x) => [x, `${site.url}/${x}${p ? `/${p}` : ""}`]),
        ),
      },
    })),
  );
}
