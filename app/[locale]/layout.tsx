import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Manrope, Outfit } from "next/font/google";

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { routing } from "@/i18n/routing";
import { SITE_NAME, SITE_URL } from "@/config/site";
import { localizedAlternates } from "@/lib/seo";

import "../globals.css";

/**
 * Dizayn Outfit shriftida chizilgan, lekin Outfit'da kirill subseti YO'Q —
 * ru versiyasi tizim shriftiga tushib, dizayndan chetlashardi. Shuning uchun
 * kirill uchun Manrope qo'shildi: brauzer Outfit'da topilmagan harflarni
 * avtomatik shundan oladi, lotin matn esa aynan Outfit bo'lib qolaveradi.
 */
const outfit = Outfit({
  subsets: ["latin", "latin-ext"],
  variable: "--font-outfit-latin",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["cyrillic", "cyrillic-ext", "latin"],
  variable: "--font-outfit-cyrillic",
  display: "swap",
});

const OG_LOCALES: Record<string, string> = {
  uz: "uz_UZ",
  ru: "ru_RU",
  en: "en_US",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};

  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: t("title"),
      template: `%s — ${SITE_NAME}`,
    },
    description: t("description"),
    applicationName: SITE_NAME,
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    category: "delivery service",
    alternates: localizedAlternates(locale),
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    verification: process.env.GOOGLE_SITE_VERIFICATION
      ? { google: process.env.GOOGLE_SITE_VERIFICATION }
      : undefined,
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: OG_LOCALES[locale],
      alternateLocale: routing.locales
        .filter((language) => language !== locale)
        .map((language) => OG_LOCALES[language]),
      url: `/${locale}`,
      title: t("title"),
      description: t("description"),
      images: [{ url: "/og.png", width: 1200, height: 630, alt: SITE_NAME }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: ["/og.png"],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  // Sahifalar statik generatsiya bo'lishi uchun locale so'rov kontekstiga
  // qo'lda o'rnatiladi — busiz next-intl route'ni dinamik deb hisoblaydi.
  setRequestLocale(locale);

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        alternateName: "ELCHI POCHTA",
        url: SITE_URL,
        logo: `${SITE_URL}/brand/elchi-lockup.png`,
        image: `${SITE_URL}/og.png`,
        sameAs: ["https://t.me/elchipochta"],
        areaServed: {
          "@type": "Country",
          name: "Uzbekistan",
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        alternateName: "ELCHI POCHTA",
        publisher: { "@id": `${SITE_URL}/#organization` },
        inLanguage: ["uz", "ru", "en"],
      },
    ],
  };

  return (
    <html
      lang={locale}
      className={`${outfit.variable} ${manrope.variable} h-full`}
    >
      <body className="flex min-h-full flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />
        <NextIntlClientProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
