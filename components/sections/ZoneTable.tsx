import { getTranslations } from "next-intl/server";

import { ZONE_RATES, type ZoneId } from "@/config/site";
import { formatDays, formatNumber } from "@/lib/pricing";

const ZONES: ZoneId[] = [1, 2, 3, 4];

const ROW =
  "grid grid-cols-[0.7fr_2fr] gap-3 px-5 py-5 md:grid-cols-[0.7fr_2fr_1fr_1fr_0.8fr] md:px-[22px]";

/**
 * Zona tariflari jadvali — bosh sahifadagi "Qamrov" va "Tariflar" sahifasida
 * bir xil ko'rinadi, shuning uchun bitta komponent. Narxlar `config/site.ts`
 * dan, muddat esa o'sha yerdagi `days` dan hisoblanadi.
 */
export default async function ZoneTable() {
  const t = await getTranslations("coverage");
  const u = await getTranslations("units");

  return (
    <div className="overflow-hidden rounded-panel border border-navy/10 bg-white">
      <div
        className={`${ROW} bg-navy/5 !py-4 text-[11.5px] font-extrabold tracking-[0.06em] text-ink/50 uppercase`}
      >
        <div>{t("zone")}</div>
        <div>{t("regions")}</div>
        <div className="hidden text-right md:block">{t("upTo1kg")}</div>
        <div className="hidden text-right md:block">{t("perExtraKg")}</div>
        <div className="hidden text-right md:block">{t("term")}</div>
      </div>

      {ZONES.map((zone) => {
        const rate = ZONE_RATES[zone];
        const days = formatDays(rate.days, {
          day: u("day"),
          days: u("days"),
        });

        return (
          <div
            key={zone}
            className={`${ROW} tnum items-center border-t border-navy/8 text-sm font-semibold`}
          >
            <div className="font-extrabold text-navy">{t(`zone${zone}`)}</div>
            <div className="leading-[1.5] font-medium text-ink/65">
              {t(`zone${zone}Regions`)}
            </div>

            {/* Keng ekranda ustunlar, mobilda esa yorliqli qatorlar. */}
            <div className="col-span-2 flex justify-between gap-3 text-ink/65 md:col-span-1 md:block md:text-right md:text-ink">
              <span className="text-[12px] font-medium md:hidden">
                {t("upTo1kg")}
              </span>
              <span>{formatNumber(rate.base)}</span>
            </div>
            <div className="col-span-2 flex justify-between gap-3 text-ink/65 md:col-span-1 md:block md:text-right md:text-ink">
              <span className="text-[12px] font-medium md:hidden">
                {t("perExtraKg")}
              </span>
              <span>{formatNumber(rate.extra)}</span>
            </div>
            <div className="col-span-2 flex justify-between gap-3 text-ink/65 md:col-span-1 md:block md:text-right md:whitespace-nowrap md:text-ink">
              <span className="text-[12px] font-medium md:hidden">
                {t("term")}
              </span>
              <span>{days}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
