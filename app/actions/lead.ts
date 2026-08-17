"use server";

import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";

import { routing } from "@/i18n/routing";
import { isThrottled, markSent } from "@/lib/throttle";

/** Foydalanuvchi kiritgan qiymatlar — xatoda formaga qaytariladi. */
export type LeadValues = {
  name: string;
  phone: string;
  shop: string;
  volume: string;
  message: string;
};

export type LeadState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<"name" | "phone", string>>;
  /** Xato bo'lganda forma qayta to'ldirilishi uchun. */
  values?: LeadValues;
};

/** Telegram HTML rejimida foydalanuvchi matni teg bo'lib ketmasin. */
function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function clean(value: FormDataEntryValue | null, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function submitLead(
  _prev: LeadState,
  formData: FormData,
): Promise<LeadState> {
  const rawLocale = clean(formData.get("locale"), 5);
  const locale = routing.locales.includes(
    rawLocale as (typeof routing.locales)[number],
  )
    ? rawLocale
    : routing.defaultLocale;
  const t = await getTranslations({ locale, namespace: "form" });

  // Honeypot: odam ko'rmaydigan maydon to'ldirilgan bo'lsa — bot.
  // Muvaffaqiyat deb javob beramiz, bot qayta urinmasin.
  if (clean(formData.get("company"), 100)) {
    return { status: "success", message: t("success") };
  }

  const name = clean(formData.get("name"), 100);
  const phone = clean(formData.get("phone"), 30);
  const shop = clean(formData.get("shop"), 200);
  const volume = clean(formData.get("volume"), 20);
  const message = clean(formData.get("message"), 1000);

  const values: LeadValues = { name, phone, shop, volume, message };

  const errors: LeadState["errors"] = {};
  if (!name) errors.name = t("requiredName");
  if (!phone) errors.phone = t("requiredPhone");
  else if ((phone.match(/\d/g) ?? []).length < 9)
    errors.phone = t("invalidPhone");

  if (Object.keys(errors).length) {
    return { status: "error", errors, values };
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_LEAD_CHAT_ID;
  if (!token || !chatId) {
    console.error(
      "[lead] TELEGRAM_BOT_TOKEN yoki TELEGRAM_LEAD_CHAT_ID o'rnatilmagan — ariza yuborilmadi.",
    );
    return { status: "error", message: t("error"), values };
  }

  const headerList = await headers();
  // Cloudflare `cf-connecting-ip` ni har so'rovga o'zi yozadi va mijoz uni
  // almashtira olmaydi. `x-forwarded-for` esa mijoz qo'lida: Cloudflare kelgan
  // qiymatni saqlab, oxiriga haqiqiy IP qo'shadi — ya'ni birinchi element
  // so'rov muallifi yozgan matn bo'ladi va chegarani osongina aylanib o'tadi.
  const ip = headerList.get("cf-connecting-ip")?.trim() || null;

  // IP aniqlanmasa (lokal preview) chegara qo'llanmaydi. Hammani bitta
  // "unknown" kalitiga tiqish butun sayt trafigini bir-biriga bog'lab qo'yardi.
  if (ip && isThrottled(ip)) {
    console.warn("[lead] chegaradan oshdi:", ip);
    return { status: "error", message: t("throttled"), values };
  }

  const lines = [
    "<b>Yangi ariza — elchipochta.uz</b>",
    "",
    `<b>Ism:</b> ${escapeHtml(name)}`,
    `<b>Telefon:</b> ${escapeHtml(phone)}`,
    shop ? `<b>Do'kon:</b> ${escapeHtml(shop)}` : null,
    volume ? `<b>Oyiga jo'natma:</b> ${escapeHtml(volume)}` : null,
    message ? `<b>Xabar:</b> ${escapeHtml(message)}` : null,
    "",
    `<i>Sayt tili: ${locale}</i>`,
  ].filter(Boolean);

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: lines.join("\n"),
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
        // Telegram javob bermay qolsa forma muzlab qolmasin.
        signal: AbortSignal.timeout(10_000),
      },
    );

    if (!response.ok) {
      console.error(
        "[lead] Telegram javobi:",
        response.status,
        await response.text(),
      );
      return { status: "error", message: t("error"), values };
    }
  } catch (error) {
    console.error("[lead] Telegramga yuborib bo'lmadi:", error);
    return { status: "error", message: t("error"), values };
  }

  // Belgi aynan shu yerda — yetkazilgani tasdiqlangandan keyin qo'yiladi.
  if (ip) markSent(ip);

  return { status: "success", message: t("success") };
}
