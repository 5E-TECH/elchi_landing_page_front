import { describe, expect, it } from "vitest";

import { formatDays, formatMoney, formatWeight, quote } from "./pricing";

const BASE = {
  from: "tsh",
  to: "sam",
  weight: 1.2,
  length: 30,
  width: 22,
  height: 15,
  express: false,
  pickup: false,
} as const;

describe("quote", () => {
  it("dizayndagi standart holatni aynan takrorlaydi", () => {
    // Bu qiymatlar "Elchi Pochta v2" maketi ochilganda ko'rinadigan sonlar.
    // Mos kelmasa — formula dizayndan chetlashgan.
    const q = quote(BASE);

    expect(q.zone).toBe(3);
    expect(q.volumetric).toBeCloseTo(1.98, 5);
    expect(q.billable).toBe(2);
    expect(q.base).toBe(27_000);
    expect(q.extra).toBe(4_000);
    expect(q.total).toBe(31_000);
    expect(q.days).toEqual([1, 2]);
  });

  it("zonani ikki uchning kattarog'i bo'yicha oladi", () => {
    // Toshkent (1-zona) -> Qoraqalpog'iston (4-zona) => 4-zona
    expect(quote({ ...BASE, from: "tsh", to: "qqr" }).zone).toBe(4);
    // Teskari yo'nalish ham xuddi shunday
    expect(quote({ ...BASE, from: "qqr", to: "tsh" }).zone).toBe(4);
    // Ikkalasi ham 1-zona bo'lgandagina 1-zona
    expect(quote({ ...BASE, from: "tsh", to: "tsh" }).zone).toBe(1);
  });

  it("hajmli vazn haqiqiy vazndan katta bo'lsa, o'sha hisoblanadi", () => {
    // 60x40x30 = 72000/5000 = 14.4 kg hajmli, haqiqiy atigi 2 kg
    const q = quote({
      ...BASE,
      weight: 2,
      length: 60,
      width: 40,
      height: 30,
    });
    expect(q.volumetric).toBeCloseTo(14.4, 5);
    expect(q.billable).toBe(14.4);
    // 1 kg asosiy narxda, qolgan 13.4 -> yuqoriga 14 kg
    expect(q.extra).toBe(14 * 4_000);
  });

  it("haqiqiy vazn kattaroq bo'lsa, hajmli vazn e'tiborga olinmaydi", () => {
    const q = quote({ ...BASE, weight: 9, length: 10, width: 10, height: 10 });
    expect(q.volumetric).toBeCloseTo(0.2, 5);
    expect(q.billable).toBe(9);
  });

  it("1 kg gacha jo'natmada ustama yo'q", () => {
    const q = quote({
      ...BASE,
      from: "tsh",
      to: "tsh",
      weight: 0.4,
      length: 10,
      width: 10,
      height: 10,
    });
    expect(q.billable).toBe(0.4);
    expect(q.extra).toBe(0);
    expect(q.total).toBe(15_000);
  });

  it("aniq 1.0 kg da suzuvchi nuqta xatosi qo'shimcha kg qo'shmaydi", () => {
    const q = quote({
      ...BASE,
      from: "tsh",
      to: "tsh",
      weight: 1,
      length: 10,
      width: 10,
      height: 10,
    });
    expect(q.billable).toBe(1);
    expect(q.extra).toBe(0);
  });

  it("eng kichik hisoblanadigan vazn — 0.1 kg", () => {
    const q = quote({
      ...BASE,
      weight: 0.01,
      length: 1,
      width: 1,
      height: 1,
    });
    expect(q.billable).toBe(0.1);
  });

  it("tezkor yetkazish asosiy summaga 1.4 koeffitsient qo'llaydi", () => {
    const q = quote({ ...BASE, express: true });
    // subtotal 31 000 -> express ustamasi 31 000 * 0.4 = 12 400
    expect(q.expressFee).toBeCloseTo(12_400, 5);
    expect(q.total).toBe(43_500); // 43 400 -> 500 gacha yaxlitlanadi
  });

  it("pickup haqi qo'shiladi", () => {
    const q = quote({ ...BASE, pickup: true });
    expect(q.pickupFee).toBe(8_000);
    expect(q.total).toBe(39_000);
  });

  it("yakuniy summa har doim 500 ga karrali", () => {
    for (const weight of [0.3, 1.7, 2.4, 5.5, 12.9]) {
      for (const express of [false, true]) {
        const total = quote({ ...BASE, weight, express, pickup: true }).total;
        expect(total % 500).toBe(0);
      }
    }
  });
});

describe("formatlash", () => {
  it("pulni bo'sh joy bilan guruhlaydi va valyutani qo'shadi", () => {
    expect(formatMoney(31_000, "so'm")).toBe("31 000 so'm");
    expect(formatMoney(8_000, "сум")).toBe("8 000 сум");
    expect(formatMoney(1_234_500, "UZS")).toBe("1 234 500 UZS");
  });

  it("pul matnida ko'rinmas probel qolmaydi", () => {
    expect(formatMoney(31_000, "so'm")).not.toMatch(/[  ]/);
  });

  it("vaznni bir kasr bilan yozadi", () => {
    expect(formatWeight(2, "kg")).toBe("2.0 kg");
    expect(formatWeight(1.98, "кг")).toBe("2.0 кг");
  });

  it("muddatni oraliq yoki bitta kun sifatida yozadi", () => {
    const uz = { day: "kun", days: "kun" };
    const en = { day: "day", days: "days" };
    expect(formatDays([1, 2], uz)).toBe("1–2 kun");
    expect(formatDays([1, 1], uz)).toBe("1 kun");
    expect(formatDays([1, 1], en)).toBe("1 day");
    expect(formatDays([2, 3], en)).toBe("2–3 days");
  });
});
