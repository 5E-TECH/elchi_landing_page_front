import {
  EXTRAS,
  REGION_ZONE,
  VOLUMETRIC_DIVISOR,
  ZONE_RATES,
  type RegionId,
  type ZoneId,
} from "@/config/site";

export type Quote = {
  zone: ZoneId;
  /** Zona tarifi — jadvalda ko'rsatish uchun */
  base: number;
  perExtraKg: number;
  days: [number, number];
  /** Hajmli vazn, kg */
  volumetric: number;
  /** Hisob-kitobga olinadigan vazn, kg */
  billable: number;
  /** 1 kg dan ortiq vazn uchun ustama, so'm */
  extra: number;
  expressFee: number;
  pickupFee: number;
  total: number;
};

export type QuoteInput = {
  from: RegionId;
  to: RegionId;
  /** kg */
  weight: number;
  /** sm */
  length: number;
  width: number;
  height: number;
  express: boolean;
  pickup: boolean;
};

/**
 * Yetkazib berish narxi.
 *
 * Formula "Elchi Pochta v2" dizaynidagi kalkulyatordan aynan olingan —
 * sayt ko'rsatgan narx dizaynerning maketidagi narx bilan bir xil bo'lishi shart.
 * O'zgartirishdan oldin `lib/pricing.test.ts` dagi testlarni ko'ring.
 */
export function quote(input: QuoteInput): Quote {
  // Yo'nalish narxini ikki uchining kattaroq zonasi belgilaydi.
  const zone = Math.max(
    REGION_ZONE[input.from],
    REGION_ZONE[input.to],
  ) as ZoneId;
  const rate = ZONE_RATES[zone];

  const volumetric =
    (input.length * input.width * input.height) / VOLUMETRIC_DIVISOR;

  // Haqiqiy va hajmli vazndan kattasi olinadi, 0.1 kg gacha yuqoriga yaxlitlanadi.
  const billable = Math.max(
    Math.ceil(Math.max(input.weight, volumetric) * 10) / 10,
    0.1,
  );

  // Birinchi kilogramm asosiy narxga kiradi, qolgani har kg uchun hisoblanadi.
  // EPS — suzuvchi nuqta chiqindisi (2.0000000000000004 kabi) bir kilogrammni
  // ortiqcha hisoblab yubormasligi uchun; to'g'ri qiymatlarga ta'sir qilmaydi.
  const EPS = 1e-9;
  const extraKg = Math.max(0, Math.ceil(billable - 1 - EPS));
  const extra = extraKg * rate.extra;

  const subtotal = rate.base + extra;
  const expressFee = input.express
    ? subtotal * (EXTRAS.expressMultiplier - 1)
    : 0;
  const pickupFee = input.pickup ? EXTRAS.pickupFee : 0;

  // Yakuniy summa 500 so'mgacha yaxlitlanadi.
  const total = Math.round((subtotal + expressFee + pickupFee) / 500) * 500;

  return {
    zone,
    base: rate.base,
    perExtraKg: rate.extra,
    days: rate.days,
    volumetric,
    billable,
    extra,
    expressFee,
    pickupFee,
    total,
  };
}

export function formatNumber(value: number): string {
  // ru-RU guruhlash belgisi ICU versiyasiga qarab U+00A0 yoki U+202F
  // bo'ladi — ikkalasi ham oddiy probelga almashtiriladi, aks holda nusxa
  // olingan matnda ko'rinmas belgilar qolib ketadi.
  return value.toLocaleString("ru-RU").replace(/[\u00a0\u202f]/g, " ");
}

/**
 * Pul formati. Dizayn barcha tillar uchun `ru-RU` guruhlashini (bo'sh joy)
 * ishlatadi, faqat valyuta so'zi tilga qarab o'zgaradi.
 */
export function formatMoney(value: number, currency: string): string {
  return `${formatNumber(Math.round(value))} ${currency}`;
}

/** Vazn: bir kasrli, dizayndagidek. */
export function formatWeight(kg: number, unit: string): string {
  return `${kg.toFixed(1)} ${unit}`;
}

/** Muddat: "1 kun" / "1–2 kun". Ingliz tilida birlik/ko'plik farqlanadi. */
export function formatDays(
  [min, max]: [number, number],
  words: { day: string; days: string },
): string {
  const range = min === max ? String(min) : `${min}–${max}`;
  const word = min === max && min === 1 ? words.day : words.days;
  return `${range} ${word}`;
}
