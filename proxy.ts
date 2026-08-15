import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

/**
 * Next 16'da bu fayl `middleware.ts` emas, `proxy.ts` deb ataladi
 * (`node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md`).
 * next-intl'ning modul yo'li o'zgarmagan — faqat fayl nomi va eksport shakli.
 *
 * Vazifasi: prefikssiz so'rovni (`/tariflar`) foydalanuvchi tiliga qarab
 * `/uz/tariflar` ga yo'naltirish va joriy locale'ni sahifalarga uzatish.
 */
export default createMiddleware(routing);

export const config = {
  // API, Next ichki yo'llari va nuqtali fayllar (rasm, favicon) chetlab o'tiladi.
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
