import { hasLocale } from "next-intl";
import { NextResponse, type NextRequest } from "next/server";

import { routing } from "@/i18n/routing";

/**
 * Ildiz (`/`) uchun til tanlash va yo'naltirish.
 *
 * Ilgari buni `proxy.ts` (next-intl middleware) bajarardi, lekin Next 16'da
 * proxy majburan Node.js runtime'da ishlaydi va uni Edge'ga o'tkazib
 * bo'lmaydi — `runtime` eksporti Proxy faylida xato beradi. Cloudflare
 * Workers adapteri (`@opennextjs/cloudflare`) esa hozircha faqat Edge
 * middleware'ni qo'llaydi, shuning uchun proxy o'rniga shu route handler
 * ishlatiladi.
 *
 * Route handler tanlandi, `page.tsx` emas: ildizda sahifa bo'lsa unga
 * `app/layout.tsx` kerak bo'lardi, u esa `app/[locale]/layout.tsx` dagi
 * `<html>` bilan ustma-ust tushardi.
 */

/** Brauzer yuborgan `Accept-Language` dan saytda bor tilni tanlaydi. */
function fromAcceptLanguage(header: string | null) {
  if (!header) return routing.defaultLocale;

  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const quality = params
        .map((param) => param.trim())
        .find((param) => param.startsWith("q="));

      return {
        tag: tag.trim().toLowerCase(),
        // q ko'rsatilmagan bo'lsa standart 1 (RFC 9110).
        q: quality ? Number.parseFloat(quality.slice(2)) : 1,
      };
    })
    .filter(({ tag, q }) => tag.length > 0 && Number.isFinite(q))
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    // `ru-RU` ham, `ru` ham bir xil qabul qilinadi.
    const base = tag.split("-")[0];
    if (hasLocale(routing.locales, base)) return base;
  }

  return routing.defaultLocale;
}

export async function GET(request: NextRequest) {
  // Foydalanuvchi tilni qo'lda tanlagan bo'lsa (LocaleSwitcher cookie yozadi),
  // brauzer sozlamasidan ustun turadi.
  const chosen = request.cookies.get("NEXT_LOCALE")?.value;
  const locale = hasLocale(routing.locales, chosen)
    ? chosen
    : fromAcceptLanguage(request.headers.get("accept-language"));

  return NextResponse.redirect(new URL(`/${locale}`, request.url), {
    status: 307,
    // Javob har foydalanuvchida farq qiladi — CDN uni ushlab qolmasin.
    headers: { "Cache-Control": "no-store" },
  });
}
