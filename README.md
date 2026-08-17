# Elchi Pochta — landing page

Onlayn do'konlar uchun yetkazib berish xizmatining marketing sayti.
To'rt sahifa, uch til (uz / ru / en), ishlaydigan narx kalkulyatori.

Sayt to'liq statik generatsiya qilinadi (12 sahifa = 4 × 3 til), shuning uchun
SEO va yuklanish tezligi yaxshi.

## Stack

| | |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack) |
| Til | TypeScript |
| Uslub | Tailwind CSS 4 (`@theme` tokenlari `app/globals.css` da) |
| i18n | next-intl 4 — `/uz`, `/ru`, `/en` |
| Testlar | Vitest (`lib/pricing.test.ts`) |
| Deploy | Cloudflare Workers (`@opennextjs/cloudflare`) |
| Node | 22 (`.node-version`) — wrangler 22 dan pastini qo'llamaydi |

## Ishga tushirish

```bash
npm install
cp .env.example .env.local     # qiymatlarni to'ldiring
npm run dev                    # http://localhost:3000/uz
```

| Buyruq | Nima qiladi |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Production build (12 sahifa SSG) |
| `npm start` | Build'ni ishga tushirish |
| `npm test` | Kalkulyator testlari |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run preview` | Build + lokal **Workers** muhiti (`workerd`) — deploydan oldingi haqiqiy sinov |
| `npm run deploy` | Build + Cloudflare'ga qo'lda deploy |

## Muhit o'zgaruvchilari

`.env.example` ga qarang. Ariza formasi ishlashi uchun ikkitasi shart:

- `TELEGRAM_BOT_TOKEN` — @BotFather bergan token
- `TELEGRAM_LEAD_CHAT_ID` — menejerlar guruhi id'si (guruh uchun manfiy son)

Ular bo'lmasa forma xato qaytaradi va konsolga sabab yoziladi.

Uch joyda uch xil beriladi:

| Qayerda | Qanday |
| --- | --- |
| `npm run dev` | `.env.local` |
| `npm run preview` (Workers muhiti) | `.dev.vars` |
| Production | `npx wrangler secret put TELEGRAM_BOT_TOKEN` |

Sirlar repoga hech qachon yozilmaydi — uchala fayl ham `.gitignore` da.

## Branchlar va deploy

```
shodiyor ──┐
dilshodbek ─┼──> dev ──> main ──> production (avtomatik)
   ...   ──┘
```

- **`main`** — productionda turgan kod. Bu yerga merge bo'lishi bilan
  Cloudflare o'zi build qilib `elchipochta.uz` ga chiqaradi. To'g'ridan-to'g'ri
  push qilinmaydi.
- **`dev`** — yig'ish branchi. Har kimning ishi avval shu yerda birlashadi va
  tekshiriladi.
- **Shaxsiy branchlar** (`shodiyor`, ...) — kundalik ish shu yerda.

`main` dan boshqa branchga push qilinganda Cloudflare **preview versiya**
yaratadi (`wrangler versions upload`) — u productionga tegmaydi, alohida
URL beradi, ya'ni merge qilishdan oldin ko'rib olsa bo'ladi.

Merge qilishdan oldin lokal tekshiruv:

```bash
npm run typecheck && npm run lint && npm test && npm run preview
```

`npm run preview` muhim — `next dev` Node muhitida ishlaydi, production esa
`workerd` da. Farq faqat shu buyruqda ko'rinadi.

## Tuzilma

```
app/
  [locale]/          layout + 4 sahifa (page, xizmatlar, tariflar, hamkorlik)
  actions/lead.ts    ariza formasi -> Telegram (server action)
  sitemap.ts         12 URL + hreflang
  robots.ts
  globals.css        dizayn tokenlari
components/
  layout/            Header, Footer, LocaleSwitcher
  sections/          Hero, Calculator, Coverage, Faq, ...
  ui/                Button, Card, Kicker, Slot, Container
config/site.ts       ⚠️ narx, kontakt, statistika — bitta joyda
config/nav.ts        menyu havolalari
i18n/                next-intl sozlamalari
lib/pricing.ts       kalkulyator (sof funksiya + testlar)
messages/            uz.json / ru.json / en.json
app/route.ts         ildiz `/` uchun til aniqlash va yo'naltirish
design/              dizayn manbasi — README.md ni o'qing
wrangler.jsonc       Cloudflare Worker sozlamalari
open-next.config.ts  Next -> Workers adapteri
public/_headers      statik fayllar uchun cache qoidalari
```

## ⚠️ Ishga tushirishdan oldin

Saytda hozir **dizayndan olingan placeholder ma'lumotlar** turibdi. Public
qilishdan oldin `config/site.ts` dagi har bir `TODO(real)` tekshirilsin:

- **Tariflar** — 4 zona narxi (15 000 / 20 000 / 27 000 / 34 000 so'm), pickup
  8 000 so'm, express ×1,4
- **Kontaktlar** — telefon, Telegram, manzil, ish vaqti
- **Statistika** — "98% o'z vaqtida" va "24/7" o'lchanmagan
- **Domen** — `NEXT_PUBLIC_SITE_URL` (sitemap va hreflang shunga bog'liq)

Shuningdek **17 ta rasm sloti bo'sh** (`IMAGE_SLOTS`). Foto yo'q bo'lsa
neytral blok chiqadi; dev rejimida qaysi surat kerakligi yozib turadi.
Foto tayyor bo'lgach `public/` ga qo'yib, `config/site.ts` da yo'lini yozing.

## Narx kalkulyatori

Formula dizayndan aynan ko'chirilgan (`lib/pricing.ts`):

```
zona     = max(jo'natuvchi zonasi, qabul qiluvchi zonasi)
hajmli   = uzunlik × kenglik × balandlik ÷ 5000
hisobiy  = max(haqiqiy, hajmli), 0.1 kg gacha yuqoriga
ustama   = ceil(hisobiy − 1) × zona ustamasi
jami     = (asosiy + ustama + express + pickup), 500 so'mgacha yaxlitlanadi
```

Nazorat qiymati: Toshkent → Samarqand, 1.2 kg, 30×22×15 sm, oddiy, pickupsiz
→ **3-zona, 31 000 so'm, 1–2 kun**. `npm test` shuni tekshiradi.
Narx o'zgarsa `config/site.ts` tahrirlanadi, formula emas.

## Tarjimalar

`messages/uz.json` — manba. `ru.json` va `en.json` dizaynerning lug'atidan
(`design/i18n.js`) chiqarilgan, ular qo'lda tarjima qilinmagan.

Yangi satr qo'shsangiz uchala faylga ham qo'shing — uchtasi bir xil kalit
tuzilmasiga ega bo'lishi shart.
