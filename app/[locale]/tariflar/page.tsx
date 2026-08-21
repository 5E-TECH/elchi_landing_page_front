import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import ZoneTable from "@/components/sections/ZoneTable";
import { ButtonLink } from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Kicker from "@/components/ui/Kicker";
import { CALC_HREF } from "@/config/nav";
import { EXTRAS } from "@/config/site";
import { formatMoney } from "@/lib/pricing";
import { localizedAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/tariflar">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const page = await getTranslations({ locale, namespace: "pricingPage" });
  return {
    title: { absolute: t("pricingTitle") },
    description: page("subtitle"),
    alternates: localizedAlternates(locale, "tariflar"),
    openGraph: {
      title: t("pricingTitle"),
      description: page("subtitle"),
      url: `/${locale}/tariflar`,
    },
  };
}

export default async function PricingPage({
  params,
}: PageProps<"/[locale]/tariflar">) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("pricingPage");
  const u = await getTranslations("units");

  // Pickup narxi config'dan — pul qiymati bitta joyda tursin.
  // Qolgan uchtasi nisbat (×1,4 / 50% / 1%) bo'lgani uchun matn ichida qoladi;
  // `config/site.ts` dagi EXTRAS o'zgarsa, bu satrlar ham yangilansin.
  const rows: [string, string][] = [
    [t("pickup"), formatMoney(EXTRAS.pickupFee, u("currency"))],
    [t("express"), t("expressValue")],
    [t("return"), t("returnValue")],
    [t("insurance"), t("insuranceValue")],
    [t("packaging"), t("packagingValue")],
  ];

  return (
    <Container className="pt-14 md:pt-18">
      <Kicker>{t("kicker")}</Kicker>
      <h1 className="mt-4.5 mb-4.5 text-[34px] md:text-[54px]">{t("title")}</h1>
      <p className="mb-10 max-w-[60ch] text-[17px] leading-[1.62] font-medium text-ink/60">
        {t("subtitle")}
      </p>

      <div className="mb-14">
        <ZoneTable />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
        <div className="rounded-panel border border-navy/10 bg-white p-6 md:p-[30px]">
          <h2 className="mb-5 text-[22px] md:text-[25px]">
            {t("extrasTitle")}
          </h2>
          <dl className="tnum grid text-[14.5px] font-semibold">
            {rows.map(([label, value]) => (
              <div
                key={label}
                className="flex justify-between gap-4 border-b border-navy/8 py-3.5 last:border-0"
              >
                <dt className="font-medium text-ink/70">{label}</dt>
                <dd
                  className={label === t("packaging") ? "text-navy" : undefined}
                >
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="rounded-panel bg-navy p-6 text-bg md:p-[30px]">
          <Kicker tone="light">{t("partnerKicker")}</Kicker>
          <p className="mt-4 mb-6 text-[15px] leading-[1.65] font-medium text-bg/72">
            {t("partnerText")}
          </p>
          <ButtonLink href={CALC_HREF} variant="onNavy">
            {t("partnerCta")}
          </ButtonLink>
        </div>
      </div>
    </Container>
  );
}
