import path from "node:path";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

// `i18n/routing.ts` dan import qilib bo'lmaydi — next.config next-intl
// plagini yuklanishidan oldin baholanadi.
const defaultLocale = "uz";

const nextConfig: NextConfig = {
  // Turbopack workspace ildizini yuqoriga qarab o'zi topadi va uy katalogidagi
  // package-lock.json ga yetib boradi. Ildizni shu loyihaga qadab qo'yamiz.
  turbopack: {
    root: path.resolve(import.meta.dirname),
  },
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },

  /**
   * Prefikssiz sahifa yo'llari (qo'lda terilgan yoki eski havolalar).
   * Ildiz `/` ni `app/route.ts` til aniqlash bilan yo'naltiradi; bu yerdagilar
   * esa standart tilga tushadi — Accept-Language o'qib bo'lmaydi, chunki
   * `redirects()` statik jadval.
   */
  async redirects() {
    return ["/xizmatlar", "/tariflar", "/hamkorlik"].map((path) => ({
      source: path,
      destination: `/${defaultLocale}${path}`,
      permanent: false,
    }));
  },
};

export default withNextIntl(nextConfig);

/**
 * `next dev` da ham Cloudflare bindinglari (IMAGES, sirlar) ko'rinsin —
 * aks holda faqat `opennextjs-cloudflare preview` da ishlaydi va farq
 * deploydan keyin bilinadi.
 */
initOpenNextCloudflareForDev();
