import { describe, expect, it } from "vitest";

import {
  formatDays,
  formatMoney,
  formatWeight,
  isCityRoute,
  quote,
  resolveTariff,
} from "./pricing";

const BASE = {
  from: "tsh",
  to: "sam",
  delivery: "center",
  weight: 1.2,
  length: 30,
  width: 22,
  height: 15,
  express: false,
  pickup: false,
} as const;

describe("resolveTariff", () => {
  it("Toshkent shahri ichida — har doim shahar tarifi", () => {
    // Shahar ichida tanlov yo'q: kuryer mijoz manziligacha yetkazadi.
    expect(resolveTariff("tsh", "tsh", "center")).toBe("city");
    expect(resolveTariff("tsh", "tsh", "address")).toBe("city");
    expect(isCityRoute("tsh", "tsh")).toBe(true);
  });

  it("Toshkent viloyati 'boshqa viloyat' hisoblanadi", () => {
    // Chirchiq/Nurafshon shahar tarifiga kirmaydi — 08.10.2026 qarori.
    expect(isCityRoute("tsh", "tshv")).toBe(false);
    expect(resolveTariff("tsh", "tshv", "center")).toBe("center");
    expect(resolveTariff("tsh", "tshv", "address")).toBe("address");
  });

  it("shahar tashqarisida narxni yetkazish turi belgilaydi", () => {
    expect(resolveTariff("tsh", "sam", "center")).toBe("center");
    expect(resolveTariff("tsh", "sam", "address")).toBe("address");
    // Teskari yo'nalishda ham xuddi shunday — masofa narxga ta'sir qilmaydi.
    expect(resolveTariff("qqr", "tsh", "address")).toBe("address");
    expect(resolveTariff("sur", "far", "center")).toBe("center");
  });
});

describe("quote", () => {
  it("viloyat markazigacha standart holat", () => {
    const q = quote(BASE);

    expect(q.tariff).toBe("center");
    expect(q.volumetric).toBeCloseTo(1.98, 5);
    expect(q.billable).toBe(2);
    expect(q.base).toBe(40_000);
    expect(q.perExtraKg).toBe(4_000);
    expect(q.extra).toBe(4_000);
    expect(q.total).toBe(44_000);
    expect(q.days).toEqual([1, 2]);
  });

  it("manzilgacha tarifi 60 000 dan va har kg uchun 5 000", () => {
    const q = quote({ ...BASE, delivery: "address" });

    expect(q.tariff).toBe("address");
    expect(q.base).toBe(60_000);
    expect(q.perExtraKg).toBe(5_000);
    expect(q.extra).toBe(5_000);
    expect(q.total).toBe(65_000);
  });

  it("Toshkent shahri 35 000 dan, har qo'shimcha kg 4 000", () => {
    const q = quote({
      ...BASE,
      from: "tsh",
      to: "tsh",
      weight: 3,
      length: 10,
      width: 10,
      height: 10,
    });

    expect(q.tariff).toBe("city");
    expect(q.base).toBe(35_000);
    // 1 kg bazada, qolgan 2 kg × 4 000
    expect(q.perExtraKg).toBe(4_000);
    expect(q.extra).toBe(8_000);
    expect(q.total).toBe(43_000);
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
    expect(q.total).toBe(35_000);
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
    // subtotal 44 000 -> express ustamasi 44 000 * 0.4 = 17 600
    expect(q.expressFee).toBeCloseTo(17_600, 5);
    expect(q.total).toBe(61_500); // 61 600 -> 500 gacha yaxlitlanadi
  });

  it("pickup haqi qo'shiladi", () => {
    const q = quote({ ...BASE, pickup: true });
    expect(q.pickupFee).toBe(8_000);
    expect(q.total).toBe(52_000);
  });

  it("yakuniy summa har doim 500 ga karrali", () => {
    for (const weight of [0.3, 1.7, 2.4, 5.5, 12.9]) {
      for (const express of [false, true]) {
        for (const delivery of ["center", "address"] as const) {
          const total = quote({
            ...BASE,
            weight,
            express,
            delivery,
            pickup: true,
          }).total;
          expect(total % 500).toBe(0);
        }
      }
    }
  });

  it("manzilgacha narxi markazgacha narxidan har doim qimmat", () => {
    for (const weight of [0.5, 1, 4.2, 11]) {
      const center = quote({ ...BASE, weight, delivery: "center" }).total;
      const address = quote({ ...BASE, weight, delivery: "address" }).total;
      expect(address).toBeGreaterThan(center);
    }
  });
});

describe("formatlash", () => {
  it("pulni bo'sh joy bilan guruhlaydi va valyutani qo'shadi", () => {
    expect(formatMoney(44_000, "so'm")).toBe("44 000 so'm");
    expect(formatMoney(8_000, "сум")).toBe("8 000 сум");
    expect(formatMoney(1_234_500, "UZS")).toBe("1 234 500 UZS");
  });

  it("pul matnida ko'rinmas probel qolmaydi", () => {
    expect(formatMoney(44_000, "so'm")).not.toMatch(/[  ]/);
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
