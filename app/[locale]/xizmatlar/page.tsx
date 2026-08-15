import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ButtonLink } from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Kicker from "@/components/ui/Kicker";
import Slot from "@/components/ui/Slot";
import { CTA_HREF } from "@/config/nav";

const SERVICES = [
  { key: "s1", slot: "svc-01" },
  { key: "s2", slot: "svc-02" },
  { key: "s3", slot: "svc-03" },
  { key: "s4", slot: "svc-04" },
  { key: "s5", slot: "svc-05" },
  { key: "s6", slot: "svc-06" },
] as const;

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/xizmatlar">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("servicesTitle"),
    alternates: { canonical: `/${locale}/xizmatlar` },
  };
}

export default async function ServicesPage({
  params,
}: PageProps<"/[locale]/xizmatlar">) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("servicesPage");
  const tn = await getTranslations("nav");

  return (
    <Container className="pt-14 md:pt-18">
      <Kicker>{t("kicker")}</Kicker>
      <h1 className="mt-4.5 mb-4.5 max-w-[26ch] text-[34px] md:text-[54px]">
        {t("title")}
      </h1>
      <p className="mb-11 max-w-[58ch] text-[17px] leading-[1.62] font-medium text-ink/60">
        {t("subtitle")}
      </p>

      <div className="grid gap-5 md:grid-cols-2">
        {SERVICES.map(({ key, slot }, index) => (
          <article
            key={key}
            className="rounded-card border border-navy/10 bg-white p-6 md:p-[30px]"
          >
            <div className="relative mb-5 aspect-[16/9] overflow-hidden rounded-[12px] bg-navy/6">
              <Slot id={slot} sizes="(min-width: 768px) 50vw, 100vw" />
            </div>
            <p
              aria-hidden="true"
              className="text-xs font-extrabold tracking-[0.08em] text-navy"
            >
              {String(index + 1).padStart(2, "0")}
            </p>
            <h2 className="mt-3 mb-2.5 text-[22px] md:text-[25px]">
              {t(`${key}.title`)}
            </h2>
            <p className="text-[15px] leading-[1.65] font-medium text-ink/62">
              {t(`${key}.body`)}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <ButtonLink href="/tariflar" size="lg">
          {tn("pricing")}
        </ButtonLink>
        <ButtonLink href={CTA_HREF} variant="outline" size="lg">
          {tn("cta")}
        </ButtonLink>
      </div>
    </Container>
  );
}
