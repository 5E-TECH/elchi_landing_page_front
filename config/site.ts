/**
 * Saytning yagona ma'lumot manbai.
 *
 * ⚠️ MUHIM: quyidagi barcha raqam va kontaktlar DIZAYN PLACEHOLDER'lari.
 * Ular hali biznes tomonidan tasdiqlanmagan. Sayt public bo'lishidan oldin
 * `TODO(real)` belgili har bir qiymat real ma'lumot bilan almashtirilishi shart —
 * narxlar va telefon raqami noto'g'ri chiqsa, bu mijozga yetadigan xato.
 */

/** TODO(real): yakuniy domen. Sitemap, hreflang va OG shu qiymatga bog'liq. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://elchipochta.uz";

export const SITE_NAME = "Elchi Pochta";

/** TODO(real): kontaktlar biznesdan tasdiqlansin. */
export const CONTACTS = {
  phone: "+998 71 200 00 90",
  phoneHref: "tel:+998712000090",
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
export type ZoneId = 1 | 2 | 3 | 4;

/** Har bir hudud qaysi zonaga tegishli. */
export const REGION_ZONE: Record<RegionId, ZoneId> = {
  tsh: 1,
  tshv: 2,
  sam: 3,
  buh: 3,
  nav: 3,
  jiz: 3,
  sir: 3,
  far: 3,
  and: 3,
  nam: 3,
  qas: 3,
  sur: 4,
  xor: 4,
  qqr: 4,
};

/**
 * Zona tariflari — narx so'mda, `days` yetkazish muddati (min–max kun).
 * TODO(real): to'rt zonaning ham `base` va `extra` narxi tasdiqlansin.
 */
export const ZONE_RATES: Record<
  ZoneId,
  { base: number; extra: number; days: [number, number] }
> = {
  1: { base: 15_000, extra: 2_500, days: [1, 1] },
  2: { base: 20_000, extra: 3_000, days: [1, 1] },
  3: { base: 27_000, extra: 4_000, days: [1, 2] },
  4: { base: 34_000, extra: 5_000, days: [2, 3] },
};

/** Qaysi hududlar qaysi zonada — tarif jadvalining qatorlari. */
export const ZONE_REGIONS: Record<ZoneId, RegionId[]> = {
  1: ["tsh"],
  2: ["tshv"],
  3: ["sam", "buh", "nav", "jiz", "sir", "far", "and", "nam", "qas"],
  4: ["sur", "xor", "qqr"],
};

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
 * TODO(real): 17 ta foto suratga olinsin.
 */
export const IMAGE_SLOTS: Record<string, string | null> = {
  "hero-bg": null,
  "band-1": null,
  "band-2": null,
  "band-3": null,
  "band-4": null,
  "step-1": null,
  "step-2": null,
  "step-3": null,
  "step-4": null,
  coverage: null,
  team: null,
  "svc-01": null,
  "svc-02": null,
  "svc-03": null,
  "svc-04": null,
  "svc-05": null,
  "svc-06": null,
};
