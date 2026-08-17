"use client";

import { useActionState } from "react";
import { useLocale, useTranslations } from "next-intl";

import { submitLead, type LeadState } from "@/app/actions/lead";
import { Button } from "@/components/ui/Button";

const initialLeadState: LeadState = { status: "idle" };

const LABEL = "mb-[7px] block text-[12.5px] font-bold text-bg/60";
const FIELD =
  "w-full rounded-[12px] border-[1.5px] border-bg/22 bg-bg/6 px-3.5 py-3 text-[14.5px] font-semibold text-bg placeholder:font-medium placeholder:text-bg/35";

export default function LeadForm() {
  const t = useTranslations("contact");
  const tf = useTranslations("form");
  const locale = useLocale();
  const [state, action, pending] = useActionState(submitLead, initialLeadState);

  if (state.status === "success") {
    return (
      <p
        role="status"
        className="rounded-panel border border-bg/25 bg-bg/10 p-5 text-[15px] leading-[1.6] font-semibold"
      >
        {state.message}
      </p>
    );
  }

  return (
    <form action={action} noValidate>
      <input type="hidden" name="locale" value={locale} />

      {/* Honeypot — ekranda ko'rinmaydi, faqat botlar to'ldiradi.
          Ekrandan tashqariga chiqarish (left:-9999px) sahifani kengaytirib
          yuboradi, shuning uchun nol o'lchamli va kesilgan konteyner. */}
      <div
        aria-hidden="true"
        className="absolute size-0 overflow-hidden opacity-0"
      >
        <label>
          Company
          <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={LABEL} htmlFor="lead-name">
            {t("name")}
          </label>
          <input
            id="lead-name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Aziz Karimov"
            aria-invalid={state.errors?.name ? true : undefined}
            aria-describedby={state.errors?.name ? "lead-name-error" : undefined}
            className={FIELD}
          />
          {state.errors?.name ? (
            <p id="lead-name-error" className="mt-1.5 text-xs font-semibold text-bg/80">
              {state.errors.name}
            </p>
          ) : null}
        </div>

        <div>
          <label className={LABEL} htmlFor="lead-phone">
            {t("phone")}
          </label>
          <input
            id="lead-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+998 90 123 45 67"
            aria-invalid={state.errors?.phone ? true : undefined}
            aria-describedby={
              state.errors?.phone ? "lead-phone-error" : undefined
            }
            className={FIELD}
          />
          {state.errors?.phone ? (
            <p id="lead-phone-error" className="mt-1.5 text-xs font-semibold text-bg/80">
              {state.errors.phone}
            </p>
          ) : null}
        </div>

        <div>
          <label className={LABEL} htmlFor="lead-shop">
            {t("shop")}
          </label>
          <input
            id="lead-shop"
            name="shop"
            type="text"
            placeholder="instagram.com/mydokon"
            className={FIELD}
          />
        </div>

        <div>
          <label className={LABEL} htmlFor="lead-volume">
            {t("volume")}
          </label>
          <input
            id="lead-volume"
            name="volume"
            type="number"
            inputMode="numeric"
            min="0"
            placeholder="120"
            className={FIELD}
          />
        </div>

        <div className="sm:col-span-2">
          <label className={LABEL} htmlFor="lead-message">
            {t("message")}
          </label>
          <textarea
            id="lead-message"
            name="message"
            rows={4}
            placeholder={t("messagePlaceholder")}
            className={`${FIELD} min-h-[92px] resize-y`}
          />
        </div>
      </div>

      {state.status === "error" && state.message ? (
        <p role="alert" className="mt-4 text-sm font-semibold text-bg/85">
          {state.message}
        </p>
      ) : null}

      <Button
        type="submit"
        variant="onNavy"
        size="lg"
        disabled={pending}
        className="mt-5"
      >
        {pending ? tf("sending") : t("submit")}
      </Button>
    </form>
  );
}
