import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Manrope, Outfit } from "next/font/google";

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { routing } from "@/i18n/routing";
import { SITE_NAME, SITE_URL } from "@/config/site";

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
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(routing.locales.map((l) => [l, `/${l}`])),
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale,
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

  return (
    <html
      lang={locale}
      className={`${outfit.variable} ${manrope.variable} h-full`}
    >
      <body className="flex min-h-full flex-col">
        <NextIntlClientProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
