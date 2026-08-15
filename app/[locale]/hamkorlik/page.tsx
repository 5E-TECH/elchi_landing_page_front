import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import LeadForm from "@/components/sections/LeadForm";
import Container from "@/components/ui/Container";
import Kicker from "@/components/ui/Kicker";
import { CONTACTS } from "@/config/site";

const STEPS = ["p1", "p2", "p3", "p4"] as const;

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/hamkorlik">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("partnersTitle"),
    alternates: { canonical: `/${locale}/hamkorlik` },
  };
}

export default async function PartnersPage({
  params,
}: PageProps<"/[locale]/hamkorlik">) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("partnersPage");
  const tc = await getTranslations("contact");

  return (
    <Container className="pt-14 md:pt-18">
      <Kicker>{t("kicker")}</Kicker>
      <h1 className="mt-4.5 mb-4.5 text-[34px] md:text-[54px]">{t("title")}</h1>
      <p className="mb-12 max-w-[56ch] text-[17px] leading-[1.62] font-medium text-ink/60">
        {t("subtitle")}
      </p>

      <ol className="mb-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step, index) => (
          <li
            key={step}
            className="rounded-card border border-navy/10 bg-white p-[26px]"
          >
            <p
              aria-hidden="true"
              className="grid size-10 place-items-center rounded-pill bg-navy text-base font-extrabold text-bg"
            >
              {index + 1}
            </p>
            <h2 className="mt-4 mb-2 text-[19px]">{t(`${step}.title`)}</h2>
            <p className="text-sm leading-[1.6] font-medium text-ink/60">
              {t(`${step}.body`)}
            </p>
          </li>
        ))}
      </ol>

      <section
        id="aloqa"
        className="scroll-mt-24 rounded-block bg-navy p-6 text-bg md:p-12"
      >
        <div className="grid gap-14 lg:grid-cols-[1fr_0.75fr] lg:items-start">
          <div>
            <Kicker tone="light">{tc("kicker")}</Kicker>
            <h2 className="mt-4 mb-3.5 text-[28px] md:text-[36px]">
              {tc("title")}
            </h2>
            <p className="mb-[30px] max-w-[52ch] text-[15.5px] leading-[1.65] font-medium text-bg/70">
              {tc("subtitle")}
            </p>
            <LeadForm />
          </div>

          <dl className="grid gap-6 lg:border-l lg:border-bg/18 lg:pl-10">
            <ContactItem label={tc("phone")}>
              <a
                href={CONTACTS.phoneHref}
                className="tnum text-[22px] font-extrabold tracking-[-0.02em] hover:underline"
              >
                {CONTACTS.phone}
              </a>
            </ContactItem>

            <ContactItem label={tc("telegram")}>
              <a
                href={CONTACTS.telegramHref}
                target="_blank"
                rel="noreferrer"
                className="text-[22px] font-extrabold tracking-[-0.02em] hover:underline"
              >
                {CONTACTS.telegram}
              </a>
            </ContactItem>

            <ContactItem label={tc("address")}>
              <span className="text-[14.5px] leading-[1.55] font-medium text-bg/80">
                {tc("addressValue")}
              </span>
            </ContactItem>

            <ContactItem label={tc("hours")}>
              <span className="text-[14.5px] leading-[1.55] font-medium text-bg/80">
                {tc("hoursValue")}
              </span>
            </ContactItem>
          </dl>
        </div>
      </section>
    </Container>
  );
}

function ContactItem({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="mb-[7px] text-[11.5px] font-extrabold tracking-[0.08em] text-bg/50 uppercase">
        {label}
      </dt>
      <dd>{children}</dd>
    </div>
  );
}
