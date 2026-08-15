import { getTranslations } from "next-intl/server";

import TrackCard from "@/components/sections/TrackCard";
import { ButtonLink } from "@/components/ui/Button";
import Slot from "@/components/ui/Slot";
import { CALC_HREF, CTA_HREF } from "@/config/nav";
import { STATS } from "@/config/site";

export default async function Hero() {
  const t = await getTranslations("hero");
  const ts = await getTranslations("stats");

  return (
    <section className="relative isolate overflow-hidden rounded-b-block bg-navy text-bg">
      {/* Foto fon — hali yo'q, shu sababli navy sirt bo'lib ko'rinadi. */}
      <div className="absolute inset-0 z-0 opacity-50">
        <Slot id="hero-bg" priority sizes="100vw" />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(100deg,#1F2853_0%,rgba(31,40,83,0.93)_42%,rgba(31,40,83,0.62)_100%)]"
      />

      <div className="relative z-20">
        <div className="container-page grid gap-12 pt-14 md:pt-[78px] lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:gap-16">
          <div className="min-w-0">
            <p className="inline-flex items-center gap-2 rounded-pill bg-bg/12 px-3.5 py-[7px] text-[12.5px] font-bold tracking-[0.02em]">
              {t("badge")}
            </p>
            <h1 className="mt-[22px] mb-5 max-w-[17ch] text-[38px] sm:text-[48px] lg:text-[60px]">
              {t("title")}
            </h1>
            <p className="max-w-[52ch] text-base leading-[1.62] font-medium text-bg/76 md:text-[17.5px]">
              {t("subtitle")}
            </p>
            <div className="mt-[34px] flex flex-wrap gap-3">
              <ButtonLink href={CALC_HREF} variant="onNavy" size="lg">
                {t("ctaCalc")}
              </ButtonLink>
              <ButtonLink href={CTA_HREF} variant="outlineNavy" size="lg">
                {t("ctaPartner")}
              </ButtonLink>
            </div>
            <p className="tnum mt-[26px] text-[13.5px] font-medium text-bg/55">
              {t("note")}
            </p>
          </div>

          <TrackCard />
        </div>

        <div className="container-page pt-16 pb-14">
          <div className="grid gap-px overflow-hidden rounded-[18px] bg-bg/14 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((stat) => (
              <div
                key={stat.id}
                className="bg-navy/72 px-6 py-[26px] backdrop-blur-[8px]"
              >
                <p className="tnum text-[38px] font-extrabold tracking-[-0.03em]">
                  {stat.value}
                </p>
                <p className="mt-1.5 text-[12.5px] font-semibold text-bg/60">
                  {ts(stat.id)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
