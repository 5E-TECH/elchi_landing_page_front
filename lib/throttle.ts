/**
 * Ariza formasi uchun oddiy tezlik chegarasi — siljiydigan oyna.
 *
 * ⚠️ Diqqat: hisoblagich xotirada saqlanadi, ya'ni Cloudflare Workers'da har
 * isolate uchun alohida bo'ladi va isolate o'lganda yo'qoladi. Bu jiddiy himoya
 * emas, faqat qo'pol spamni sekinlashtiradi — botlarga qarshi asosiy to'siq
 * honeypot. Chinakam kafolat kerak bo'lsa Cloudflare Rate Limiting binding yoki
 * KV kerak; o'shanda faqat shu ikki funksiya ichi almashadi, chaqiruv joylari
 * o'zgarmaydi.
 *
 * Oyna ichida bitta emas, `MAX_PER_WINDOW` ta arizaga ruxsat beriladi:
 * O'zbekistonda mobil operatorlar CGNAT ishlatadi, ya'ni o'nlab mijoz bitta
 * tashqi IP ortida bo'lishi mumkin. Bitta ariza chegarasi ularni bir-biriga
 * bog'lab qo'yardi.
 */

export const WINDOW_MS = 60_000;
export const MAX_PER_WINDOW = 3;

/** Kalitlar soni shundan oshsa eskilari tozalanadi — xotira cheksiz o'smasin. */
const MAX_KEYS = 500;

const RECENT = new Map<string, number[]>();

function fresh(hits: number[] | undefined, now: number) {
  return (hits ?? []).filter((at) => now - at < WINDOW_MS);
}

/** Faqat o'qiydi — hech narsa yozmaydi. */
export function isThrottled(key: string, now = Date.now()) {
  return fresh(RECENT.get(key), now).length >= MAX_PER_WINDOW;
}

/**
 * Faqat ariza HAQIQATAN yetkazilgandan keyin chaqiriladi. Urinish paytida
 * belgilansa, Telegram xato bergan holatda foydalanuvchi qayta yuborolmay
 * qolardi — va bu jimgina yo'qolgan ariza degani.
 */
export function markSent(key: string, now = Date.now()) {
  if (RECENT.size > MAX_KEYS) {
    for (const [k, hits] of RECENT) {
      if (fresh(hits, now).length === 0) RECENT.delete(k);
    }
  }

  RECENT.set(key, [...fresh(RECENT.get(key), now), now]);
}

/** Faqat testlar uchun. */
export function resetThrottle() {
  RECENT.clear();
}
