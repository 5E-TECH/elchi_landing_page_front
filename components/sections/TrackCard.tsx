"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/Button";

/**
 * Jo'natmani kuzatish kartasi.
 *
 * ⚠️ Hozircha NAMUNA ma'lumot ko'rsatadi — Elchi backendida anonim
 * foydalanuvchi uchun ochiq endpoint yo'q (`getTracking` Bearer token va rol
 * talab qiladi, `/partner/*` esa X-Api-Key so'raydi). Public
 * `GET /track/:code` chiqqach, `steps` shu yerda API javobi bilan
 * almashtiriladi; qolgan qismi o'zgarmaydi.
 */
export default function TrackCard() {
  const t = useTranslations("track");
  const tr = useTranslations("regions");
  const [code, setCode] = useState("EP-482913");
  const [shown, setShown] = useState(true);

  const steps = [
    { label: t("collected"), place: tr("tsh"), time: "09:42", done: true },
    { label: t("sorting"), place: tr("tsh"), time: "14:10", done: true },
    { label: t("transit"), place: tr("sam"), time: t("expectedToday"), done: false },
  ];

  return (
    <div className="min-w-0 rounded-panel bg-bg p-7 text-ink shadow-[0_24px_60px_rgba(6,6,12,0.28)]">
      <p className="text-[19px] font-extrabold tracking-[-0.02em]">
        {t("title")}
      </p>
      <p className="mt-2 text-[13.5px] leading-[1.55] font-medium text-ink/55">
        {t("subtitle")}
      </p>

      <form
        className="mt-[18px] flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          setShown(true);
        }}
      >
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="EP-000000"
          aria-label={t("title")}
          className="w-full min-w-0 flex-1 rounded-pill border-[1.5px] border-navy/16 bg-white px-[18px] py-3 text-[14.5px] font-semibold tracking-[0.04em]"
        />
        <Button type="submit">{t("button")}</Button>
      </form>

      {shown ? (
        <div className="mt-[22px] grid gap-4 border-t border-navy/10 pt-5">
          {steps.map((step) => (
            <div key={step.label} className="flex items-start gap-3.5">
              <span
                aria-hidden="true"
                className={`mt-1 size-2.5 flex-none rounded-pill ${
                  step.done
                    ? "bg-navy"
                    : "border-[2.5px] border-navy bg-bg"
                }`}
              />
              <div>
                <p className="text-sm font-bold">{step.label}</p>
                <p className="flex gap-1.5 text-[12.5px] font-medium text-ink/50">
                  <span>{step.place}</span>
                  <span aria-hidden="true">·</span>
                  <span>{step.time}</span>
                </p>
              </div>
            </div>
          ))}
          <p className="text-[11.5px] font-semibold text-ink/40">
            {t("sample")}
          </p>
        </div>
      ) : null}
    </div>
  );
}
