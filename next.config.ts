import path from "node:path";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

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
};

export default withNextIntl(nextConfig);
