# Dizayn manbasi

Bu papka — **ma'lumot uchun**, ilova build'iga kirmaydi. Sayt shu fayllardan
ko'chirilgan, shuning uchun tortishuvli holatda hakam shu yerdagi fayl.

| Fayl | Nima |
| --- | --- |
| `elchi-pochta-v2.dc.html` | Yakuniy dizayn (v2). To'rt sahifa, kalkulyator logikasi skript ichida. |
| `i18n.js` | Dizaynerning uz→ru/en lug'ati va hudud nomlari. `messages/*.json` shundan chiqarilgan. |

## Dizayndan koddagi joyi

| Dizaynda | Kodda |
| --- | --- |
| `#1F2853`, `#f4f8ff`, `#06060C`, radiuslar | `app/globals.css` (`@theme`) |
| `ZONE`, `RATE`, pickup/express qiymatlari | `config/site.ts` |
| `calc()` funksiyasi | `lib/pricing.ts` (+ `lib/pricing.test.ts`) |
| `dict` va `cityNames` | `messages/uz.json`, `ru.json`, `en.json` |
| `image-slot` elementlari | `config/site.ts` → `IMAGE_SLOTS`, `components/ui/Slot.tsx` |
| `sc-if` sahifalari | `app/[locale]/` ostidagi route'lar |

## Dizayndan ataylab chetlashilgan joylar

1. **Shrift.** Dizayn Outfit'da, lekin Outfit'da kirill glifi yo'q — ru versiya
   tizim shriftiga tushib ketardi. Kirill uchun Manrope qo'shildi
   (`app/[locale]/layout.tsx`); lotin matn Outfit bo'lib qoladi.
2. **Mobil ko'rinish.** Dizayn faqat 1240px desktop uchun chizilgan. Sarlavhaga
   burger menyu, jadvalga mobil qatorlar, gridlarga breakpoint'lar qo'shildi.
3. **Kuzatish bloki.** Dizayndagidek namuna ma'lumot ko'rsatadi — backendda
   anonim foydalanuvchi uchun ochiq endpoint hali yo'q.
4. **Kalkulyator maydonlari.** Dizayn prototipi har bosishda qiymatni minimalga
   qaytarib yuborardi (`0.5` yozib bo'lmasdi). Bu yerda qiymat maydondan
   chiqilganda tekshiriladi. Hisob-kitob formulasi o'zgarmagan.
