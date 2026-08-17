"use client";

import { useActionState, useEffect, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";

import { submitLead, type LeadState } from "@/app/actions/lead";
import { Button } from "@/components/ui/Button";

const initialLeadState: LeadState = { status: "idle" };

const LABEL = "mb-[7px] block text-[12.5px] font-bold text-bg/60";
const FIELD =
  "w-full rounded-[12px] border-[1.5px] border-bg/22 bg-bg/6 px-3.5 py-3 text-[14.5px] font-semibold text-bg placeholder:font-medium placeholder:text-bg/35";
const ERROR = "mt-1.5 text-xs font-semibold text-bg/80";

export default function LeadForm() {
  const t = useTranslations("contact");
  const tf = useTranslations("form");
  const locale = useLocale();
  const [state, action, pending] = useActionState(submitLead, initialLeadState);

  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const successRef = useRef<HTMLParagraphElement>(null);

  /**
   * Yuborilgandan keyin fokusni javobga ko'chiramiz. Busiz fokus `<body>` da
   * qolib ketadi (submit tugmasi qayta render bo'ladi), skrinrider esa na
   * xatoni, na tasdiqni e'lon qiladi — foydalanuvchi nima bo'lganini bilmaydi.
   */
  useEffect(() => {
    if (state.status === "success") {
      successRef.current?.focus();
      successRef.current?.scrollIntoView({
        block: "center",
        behavior: "smooth",
      });
      return;
    }

    if (state.status !== "error") return;
    if (state.errors?.name) nameRef.current?.focus();
    else if (state.errors?.phone) phoneRef.current?.focus();
  }, [state]);

  if (state.status === "success") {
    return (
      <p
        ref={successRef}
        tabIndex={-1}
        className="rounded-panel border border-bg/25 bg-bg/10 p-5 text-[15px] leading-[1.6] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bg"
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

      <p className="mb-3 text-[12px] font-medium text-bg/45">
        {t("requiredHint")}
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={LABEL} htmlFor="lead-name">
            {t("name")} <span aria-hidden="true">*</span>
          </label>
          <input
            ref={nameRef}
            id="lead-name"
            name="name"
            type="text"
            required
            aria-required="true"
            autoComplete="name"
            placeholder={t("namePlaceholder")}
            defaultValue={state.values?.name ?? ""}
            aria-invalid={state.errors?.name ? true : undefined}
            aria-describedby={
              state.errors?.name ? "lead-name-error" : undefined
            }
            className={FIELD}
          />
          {state.errors?.name ? (
            <p id="lead-name-error" className={ERROR}>
              {state.errors.name}
            </p>
          ) : null}
        </div>

        <div>
          <label className={LABEL} htmlFor="lead-phone">
            {t("phone")} <span aria-hidden="true">*</span>
          </label>
          <input
            ref={phoneRef}
            id="lead-phone"
            name="phone"
            type="tel"
            required
            aria-required="true"
            autoComplete="tel"
            placeholder={t("phonePlaceholder")}
            defaultValue={state.values?.phone ?? ""}
            aria-invalid={state.errors?.phone ? true : undefined}
            aria-describedby={
              state.errors?.phone ? "lead-phone-error" : undefined
            }
            className={FIELD}
          />
          {state.errors?.phone ? (
            <p id="lead-phone-error" className={ERROR}>
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
            placeholder={t("shopPlaceholder")}
            defaultValue={state.values?.shop ?? ""}
            className={FIELD}
          />
        </div>

        <div>
          <label className={LABEL} htmlFor="lead-volume">
            {t("volume")}
          </label>
          {/* Matn maydoni, `number` emas: yorliq taxminiy son so'raydi va
              odamlar "100-150" deb yozadi. `number` da bunday qiymat brauzer
              tomonidan bo'sh satrga aylanadi va javob jimgina yo'qoladi. */}
          <input
            id="lead-volume"
            name="volume"
            type="text"
            inputMode="numeric"
            placeholder={t("volumePlaceholder")}
            defaultValue={state.values?.volume ?? ""}
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
            defaultValue={state.values?.message ?? ""}
            className={`${FIELD} min-h-[92px] resize-y`}
          />
        </div>
      </div>

      {/* Doim mount bo'lib turadi: live region kontenti bilan birga DOM'ga
          kirsa, skrinriderlar uni e'lon qilmaydi. */}
      <div role="alert" aria-live="assertive">
        {state.status === "error" && state.message ? (
          <p className="mt-4 text-sm font-semibold text-bg/85">
            {state.message}
          </p>
        ) : null}
      </div>

      {/* `disabled` emas, `aria-disabled`: disabled tugma fokusni yo'qotadi va
          brauzer uni `<body>` ga tashlaydi — javob e'lon qilinmay qoladi. */}
      <Button
        type="submit"
        variant="onNavy"
        size="lg"
        aria-disabled={pending}
        onClick={(event) => {
          if (pending) event.preventDefault();
        }}
        className="mt-5 aria-disabled:cursor-not-allowed aria-disabled:opacity-60"
      >
        {pending ? tf("sending") : t("submit")}
      </Button>
    </form>
  );
}
