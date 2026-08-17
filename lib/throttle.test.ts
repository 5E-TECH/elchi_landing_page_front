import { beforeEach, describe, expect, it } from "vitest";

import {
  MAX_PER_WINDOW,
  WINDOW_MS,
  isThrottled,
  markSent,
  resetThrottle,
} from "./throttle";

const T0 = 1_700_000_000_000;

beforeEach(() => resetThrottle());

describe("isThrottled", () => {
  it("yangi kalit cheklanmaydi", () => {
    expect(isThrottled("1.2.3.4", T0)).toBe(false);
  });

  it("oyna ichida MAX_PER_WINDOW tagacha ruxsat beradi", () => {
    for (let i = 0; i < MAX_PER_WINDOW; i++) {
      expect(isThrottled("1.2.3.4", T0 + i)).toBe(false);
      markSent("1.2.3.4", T0 + i);
    }
    expect(isThrottled("1.2.3.4", T0 + MAX_PER_WINDOW)).toBe(true);
  });

  it("oyna o'tgach yana ochiladi", () => {
    for (let i = 0; i < MAX_PER_WINDOW; i++) markSent("1.2.3.4", T0 + i);
    expect(isThrottled("1.2.3.4", T0 + WINDOW_MS - 1)).toBe(true);
    expect(isThrottled("1.2.3.4", T0 + WINDOW_MS + 1)).toBe(false);
  });

  it("kalitlar bir-biriga aralashmaydi", () => {
    for (let i = 0; i < MAX_PER_WINDOW; i++) markSent("1.2.3.4", T0 + i);
    expect(isThrottled("1.2.3.4", T0)).toBe(true);
    expect(isThrottled("5.6.7.8", T0)).toBe(false);
  });
});

describe("markSent", () => {
  /**
   * Eng muhim xossa: chegara faqat MUVAFFAQIYATLI yuborishdan keyin
   * belgilanadi. Ilgari u urinish paytida qo'yilardi va Telegram xato
   * bergan holatda foydalanuvchi qayta yuborolmay qolardi — ariza jimgina
   * yo'qolardi.
   */
  it("chaqirilmasa hech narsa hisoblanmaydi", () => {
    for (let i = 0; i < 50; i++) {
      expect(isThrottled("1.2.3.4", T0 + i)).toBe(false);
    }
  });

  it("siljiydigan oyna — eski urinishlar hisobdan chiqadi", () => {
    markSent("1.2.3.4", T0);
    markSent("1.2.3.4", T0 + WINDOW_MS / 2);
    markSent("1.2.3.4", T0 + WINDOW_MS - 1);
    expect(isThrottled("1.2.3.4", T0 + WINDOW_MS - 1)).toBe(true);

    // Birinchisi oynadan chiqdi -> yana joy bor.
    expect(isThrottled("1.2.3.4", T0 + WINDOW_MS + 1)).toBe(false);
  });

  it("kalitlar ko'payib ketsa eskilari tozalanadi", () => {
    for (let i = 0; i < 600; i++) markSent(`ip-${i}`, T0);
    // Oyna o'tgach yangi yozuv tozalashni ishga tushiradi.
    markSent("yangi", T0 + WINDOW_MS + 1);
    expect(isThrottled("ip-0", T0 + WINDOW_MS + 1)).toBe(false);
    expect(isThrottled("yangi", T0 + WINDOW_MS + 1)).toBe(false);
  });
});
