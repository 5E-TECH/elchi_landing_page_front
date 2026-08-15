import type { MetadataRoute } from "next";

import { SITE_URL } from "@/config/site";
import { routing } from "@/i18n/routing";

/** Saytdagi barcha sahifalar — har biri uch tilda. */
const PAGES = ["", "/xizmatlar", "/tariflar", "/hamkorlik"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return routing.locales.flatMap((locale) =>
    PAGES.map((page) => ({
      url: `${SITE_URL}/${locale}${page}`,
      changeFrequency: "monthly" as const,
      priority: page === "" ? 1 : 0.8,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [l, `${SITE_URL}/${l}${page}`]),
        ),
      },
    })),
  );
}
