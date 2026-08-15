"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import { ButtonLink } from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Kicker from "@/components/ui/Kicker";
import { CTA_HREF } from "@/config/nav";
import { REGION_IDS, type RegionId } from "@/config/site";
import {
  formatDays,
  formatMoney,
  formatWeight,
  quote,
} from "@/lib/pricing";

const FIELD =
  "w-full rounded-[12px] border-[1.5px] border-navy/16 bg-white px-3.5 py-3 text-[14.5px] font-semibold text-ink";
const LABEL = "mb-[7px] block text-[12.5px] font-bold text-ink/55";

/** Bo'sh yoki noto'g'ri kiritilgan qiymat hisobni buzmasin. */
function toNumber(raw: string, min: number) {
  const value = Number.parseFloat(raw.replace(",", "."));
  return Number.isFinite(value) && value >= min ? value : min;
}

export default function Calculator() {
  const t = useTranslations("calc");
  const tr = useTranslations("regions");
  const u = useTranslations("units");
  const tn = useTranslations("nav");

  // Maydonlar matn sifatida saqlanadi — foydalanuvchi "0.5" yozayotganda
  // oraliq "0" qiymati darhol minimalga o'zgarib ketmasin.
  const [from, setFrom] = useState<RegionId>("tsh");
  const [to, setTo] = useState<RegionId>("sam");
  const [weight, setWeight] = useState("1.2");
  const [length, setLength] = useState("30");
  const [width, setWidth] = useState("22");
  const [height, setHeight] = useState("15");
  const [express, setExpress] = useState(false);
  const [pickup, setPickup] = useState(false);

  const q = useMemo(
    () =>
      quote({
        from,
        to,
        weight: toNumber(weight, 0.1),
        length: toNumber(length, 1),
        width: toNumber(width, 1),
        height: toNumber(height, 1),
        express,
        pickup,
      }),
    [from, to, weight, length, width, height, express, pickup],
  );

  const currency = u("currency");
  const none = u("none");
  const money = (value: number) =>
    value ? formatMoney(value, currency) : none;

  return (
    <Container className="scroll-mt-24 pt-22">
      <section id="kalkulyator">
        <Kicker>{t("kicker")}</Kicker>
        <h2 className="mt-4 mb-3 text-[32px] md:text-[42px]">{t("title")}</h2>
        <p className="mb-9 max-w-[54ch] text-[16.5px] font-medium text-ink/60">
          {t("subtitle")}
        </p>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          {/* ── Kirish maydonlari ── */}
          <div className="grid gap-5 rounded-panel border border-navy/10 bg-white p-6 sm:grid-cols-2 md:p-[30px]">
            <div>
              <label className={LABEL} htmlFor="calc-from">
                {t("from")}
              </label>
              <select
                id="calc-from"
                className={FIELD}
                value={from}
                onChange={(e) => setFrom(e.target.value as RegionId)}
              >
                {REGION_IDS.map((id) => (
                  <option key={id} value={id}>
                    {tr(id)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={LABEL} htmlFor="calc-to">
                {t("to")}
              </label>
              <select
                id="calc-to"
                className={FIELD}
                value={to}
                onChange={(e) => setTo(e.target.value as RegionId)}
              >
                {REGION_IDS.map((id) => (
                  <option key={id} value={id}>
                    {tr(id)}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className={LABEL} htmlFor="calc-weight">
                {t("weight")}
              </label>
              <input
                id="calc-weight"
                type="number"
                inputMode="decimal"
                min="0.1"
                step="0.1"
                className={FIELD}
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                onBlur={() => setWeight(String(toNumber(weight, 0.1)))}
              />
            </div>

            <div>
              <label className={LABEL} htmlFor="calc-length">
                {t("length")}
              </label>
              <input
                id="calc-length"
                type="number"
                inputMode="numeric"
                min="1"
                step="1"
                className={FIELD}
                value={length}
                onChange={(e) => setLength(e.target.value)}
                onBlur={() => setLength(String(toNumber(length, 1)))}
              />
            </div>

            <div>
              <label className={LABEL} htmlFor="calc-width">
                {t("width")}
              </label>
              <input
                id="calc-width"
                type="number"
                inputMode="numeric"
                min="1"
                step="1"
                className={FIELD}
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                onBlur={() => setWidth(String(toNumber(width, 1)))}
              />
            </div>

            <div className="sm:col-span-2">
              <label className={LABEL} htmlFor="calc-height">
                {t("height")}
              </label>
              <input
                id="calc-height"
                type="number"
                inputMode="numeric"
                min="1"
                step="1"
                className={FIELD}
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                onBlur={() => setHeight(String(toNumber(height, 1)))}
              />
            </div>

            <fieldset className="sm:col-span-2">
              <legend className={LABEL}>{t("type")}</legend>
              <div className="flex gap-[3px] rounded-pill bg-navy/7 p-1">
                {[
                  { value: false, label: t("standard") },
                  { value: true, label: t("express") },
                ].map(({ value, label }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setExpress(value)}
                    aria-pressed={express === value}
                    className={`flex-1 cursor-pointer rounded-pill p-2.5 text-sm font-bold transition-colors ${
                      express === value
                        ? "bg-navy text-bg"
                        : "text-ink/55 hover:text-navy"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </fieldset>

            <label className="flex cursor-pointer items-center gap-[11px] text-[14.5px] font-semibold sm:col-span-2">
              <input
                type="checkbox"
                checked={pickup}
                onChange={(e) => setPickup(e.target.checked)}
              />
              {t("pickupOption")}
            </label>

            <p className="text-[12.5px] leading-[1.6] font-medium text-ink/45 sm:col-span-2">
              {t("note")}
            </p>
          </div>

          {/* ── Hisob-kitob ── */}
          <div className="rounded-panel bg-navy p-6 text-bg md:p-[30px]">
            <Kicker tone="light">{t("summary")}</Kicker>
            <p
              className="tnum mt-3.5 mb-1 text-[38px] font-extrabold tracking-[-0.03em] md:text-[44px]"
              aria-live="polite"
            >
              {formatMoney(q.total, currency)}
            </p>
            <p className="text-[13.5px] font-semibold text-bg/60">
              {tr(from)} → {tr(to)} · {q.zone}
              {u("zoneSuffix")}
            </p>

            <Divider />
            <Rows
              rows={[
                [t("actual"), formatWeight(toNumber(weight, 0.1), u("kg"))],
                [t("volumetric"), formatWeight(q.volumetric, u("kg"))],
                [t("billable"), formatWeight(q.billable, u("kg")), true],
              ]}
            />

            <Divider />
            <Rows
              rows={[
                [t("base"), formatMoney(q.base, currency)],
                [t("extraWeight"), money(q.extra)],
                [t("expressFee"), money(q.expressFee)],
                [t("pickupFee"), money(q.pickupFee)],
              ]}
            />

            <Divider />
            <div className="tnum flex justify-between gap-3 text-base font-extrabold">
              <span>{t("total")}</span>
              <span>{formatMoney(q.total, currency)}</span>
            </div>
            <div className="mt-2.5 flex justify-between gap-3 text-[13.5px] font-semibold text-bg/60">
              <span>{t("days")}</span>
              <span>{formatDays(q.days, { day: u("day"), days: u("days") })}</span>
            </div>

            <ButtonLink
              href={CTA_HREF}
              variant="onNavy"
              className="mt-6 w-full py-3.5 text-[15px]"
            >
              {tn("cta")}
            </ButtonLink>
          </div>
        </div>
      </section>
    </Container>
  );
}

function Divider() {
  return <div aria-hidden="true" className="my-5 h-px bg-bg/16" />;
}

function Rows({ rows }: { rows: [string, string, boolean?][] }) {
  return (
    <dl className="tnum grid gap-2.5 text-[13.5px] font-semibold">
      {rows.map(([label, value, strong]) => (
        <div key={label} className="flex justify-between gap-3">
          <dt className="text-bg/60">{label}</dt>
          <dd className={strong ? "text-white" : undefined}>{value}</dd>
        </div>
      ))}
    </dl>
  );
}
