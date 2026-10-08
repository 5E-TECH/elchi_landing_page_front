/**
 * Saytning yagona ma'lumot manbai.
 *
 * ⚠️ MUHIM: `TODO(real)` belgili qiymatlar hali biznes tomonidan
 * tasdiqlanmagan DIZAYN PLACEHOLDER'lari — ular noto'g'ri chiqsa, bu
 * mijozga yetadigan xato. Belgisi yo'q qiymatlar tasdiqlangan.
 */

/** TODO(real): yakuniy domen. Sitemap, hreflang va OG shu qiymatga bog'liq. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://elchipochta.uz";

export const SITE_NAME = "Elchi Pochta";

/** Telefon 08.10.2026 da tasdiqlangan. TODO(real): manzil va ish vaqti. */
export const CONTACTS = {
  phone: "+998 70 015 15 52",
  phoneHref: "tel:+998700151552",
  telegram: "@elchipochta",
  telegramHref: "https://t.me/elchipochta",
  addressKey: "contact.addressValue",
  hoursKey: "contact.hoursValue",
} as const;

/**
 * Bosh sahifadagi 4 ta ko'rsatkich.
 * TODO(real): `regions` dan boshqasi o'lchanmagan — 98% va 24/7 tasdiqlansin.
 */
export const STATS = [
  { id: "regions", value: "14" },
  { id: "delivery", value: "1–3" },
  { id: "onTime", value: "98%" },
  { id: "support", value: "24/7" },
] as const;

/** Hudud kodlari — tarjimalari `messages/*.json` dagi `regions` bo'limida. */
export const REGION_IDS = [
  "tsh",
  "tshv",
  "sam",
  "buh",
  "nav",
  "jiz",
  "sir",
  "far",
  "and",
  "nam",
  "qas",
  "sur",
  "xor",
  "qqr",
] as const;

export type RegionId = (typeof REGION_IDS)[number];

/**
 * Narxni GEOGRAFIK ZONA emas, YETKAZISH YO'NALISHI belgilaydi:
 *  - `city`    — Toshkent shahri bo'ylab, mijoz manziligacha
 *  - `center`  — boshqa viloyat yoki shahar markazigacha
 *  - `address` — boshqa viloyatda mijoz manziligacha
 */
export const TARIFF_IDS = ["city", "center", "address"] as const;
export type TariffId = (typeof TARIFF_IDS)[number];

/**
 * Toshkent shahri tashqarisidagi yetkazish turi — kalkulyatorda tanlanadi.
 * `TariffId` ning qism to'plami: shahar ichida tanlov bo'lmaydi.
 */
export const DELIVERY_IDS = ["center", "address"] as const;
export type DeliveryId = (typeof DELIVERY_IDS)[number];

/**
 * Tariflar — `base` 1 kg gacha jo'natma narxi (so'm), `extra` har qo'shimcha
 * kg uchun ustama, `days` yetkazish muddati (min–max kun).
 *
 * `base` va `extra` 08.10.2026 da biznes tomonidan tasdiqlangan.
 * TODO(real): `days` qiymatlari tasdiqlanmagan — eski zona jadvalidan olingan.
 */
export const TARIFFS: Record<
  TariffId,
  { base: number; extra: number; days: [number, number] }
> = {
  city: { base: 35_000, extra: 4_000, days: [1, 1] },
  center: { base: 40_000, extra: 4_000, days: [1, 2] },
  address: { base: 60_000, extra: 5_000, days: [2, 3] },
};

/**
 * Toshkent shahri tarifi faqat yo'nalishning IKKI uchi ham shu hududda
 * bo'lganda qo'llanadi — Toshkent viloyati "boshqa viloyat" hisoblanadi.
 */
export const CITY_REGION: RegionId = "tsh";

/**
 * Qo'shimcha xizmatlar.
 * TODO(real): pickup narxi va express koeffitsienti tasdiqlansin.
 */
export const EXTRAS = {
  /** Kuryer manzildan olib ketishi, so'm */
  pickupFee: 8_000,
  /** Tezkor yetkazish — asosiy narxga ko'paytiruvchi */
  expressMultiplier: 1.4,
  /** Qaytarish — asosiy narxdan ulush */
  returnShare: 0.5,
  /** Qo'shimcha sug'urta — tovar qiymatidan ulush */
  insuranceShare: 0.01,
} as const;

/** Hajmli vazn bo'luvchisi (L×W×H ÷ bu son). Sohada standart — 5000. */
export const VOLUMETRIC_DIVISOR = 5_000;

/**
 * Dizayndagi rasm slotlari. Foto tayyor bo'lgach `src` ga `public/` ichidagi
 * yo'lni yozish kifoya — `null` bo'lsa `<Slot>` placeholder ko'rsatadi.
 * Rasmlar `public/images/elchi/` ichida saqlanadi.
 */
export const IMAGE_SLOTS: Record<string, string | null> = {
  "hero-bg": "/images/elchi/hero-bg-v2-branded.webp",
  "band-1": "/images/elchi/band-1-branded.webp",
  "band-2": "/images/elchi/band-2-branded-v2.png",
  "band-3": "/images/elchi/band-3-branded.webp",
  "band-4": "/images/elchi/band-4-branded.webp",
  "step-1": "/images/elchi/step-1-branded.webp",
  "step-2": "/images/elchi/step-2-branded.webp",
  "step-3": "/images/elchi/step-3-branded.webp",
  "step-4": "/images/elchi/step-4-branded.webp",
  coverage: "/images/elchi/coverage-branded.webp",
  team: "/images/elchi/team-branded.webp",
  "svc-01": "/images/elchi/svc-01-branded.webp",
  "svc-02": "/images/elchi/svc-02-branded.webp",
  "svc-03": "/images/elchi/svc-03-branded.webp",
  "svc-04": "/images/elchi/svc-04-branded.webp",
  "svc-05": "/images/elchi/svc-05-branded.webp",
  "svc-06": "/images/elchi/svc-06-branded.webp",
};
