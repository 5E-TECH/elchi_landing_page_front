import type { Metadata } from "next";

import { routing } from "@/i18n/routing";

/** Canonical va hreflang havolalarini barcha sahifalarda bir xil yaratadi. */
export function localizedAlternates(
  locale: string,
  pathname = "",
): NonNullable<Metadata["alternates"]> {
  const suffix = pathname ? `/${pathname}` : "";

  return {
    canonical: `/${locale}${suffix}`,
    languages: {
      ...Object.fromEntries(
        routing.locales.map((language) => [
          language,
          `/${language}${suffix}`,
        ]),
      ),
      "x-default": `/${routing.defaultLocale}${suffix}`,
    },
  };
}

