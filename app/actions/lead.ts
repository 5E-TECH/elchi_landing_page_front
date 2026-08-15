"use server";

import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";

import { routing } from "@/i18n/routing";

export type LeadState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<"name" | "phone", string>>;
};

export const initialLeadState: LeadState = { status: "idle" };

/**
 * Oddiy tezlik chegarasi. Diqqat: xotirada saqlanadi, ya'ni serverless muhitda
 * har instansiya uchun alohida bo'ladi va sovuq startda tozalanadi. Bu jiddiy
 * himoya emas — spam kuchaysa Telegram o'rniga backend endpoint va haqiqiy
 * rate-limit (Redis/Upstash) kerak bo'ladi.
 */
const RECENT = new Map<string, number>();
const THROTTLE_MS = 30_000;

function tooSoon(key: string) {
  const now = Date.now();
  const previous = RECENT.get(key);

  // Xotira cheksiz o'smasin.
  if (RECENT.size > 500) {
    for (const [k, at] of RECENT) {
      if (now - at > THROTTLE_MS) RECENT.delete(k);
    }
  }

  if (previous && now - previous < THROTTLE_MS) return true;
  RECENT.set(key, now);
  return false;
}

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

  const errors: LeadState["errors"] = {};
  if (!name) errors.name = t("requiredName");
  if (!phone) errors.phone = t("requiredPhone");
  else if ((phone.match(/\d/g) ?? []).length < 9)
    errors.phone = t("invalidPhone");

  if (Object.keys(errors).length) {
    return { status: "error", errors };
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_LEAD_CHAT_ID;
  if (!token || !chatId) {
    console.error(
      "[lead] TELEGRAM_BOT_TOKEN yoki TELEGRAM_LEAD_CHAT_ID o'rnatilmagan — ariza yuborilmadi.",
    );
    return { status: "error", message: t("error") };
  }

  const headerList = await headers();
  const ip =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (tooSoon(ip)) {
    // Foydalanuvchiga muvaffaqiyat ko'rsatiladi — u allaqachon yuborgan.
    return { status: "success", message: t("success") };
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
      console.error("[lead] Telegram javobi:", response.status, await response.text());
      return { status: "error", message: t("error") };
    }
  } catch (error) {
    console.error("[lead] Telegramga yuborib bo'lmadi:", error);
    return { status: "error", message: t("error") };
  }

  return { status: "success", message: t("success") };
}
