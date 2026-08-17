import { defineCloudflareConfig } from "@opennextjs/cloudflare";

/**
 * Cloudflare Workers adapteri.
 *
 * Incremental cache (R2) sozlanmagan — loyihada ISR yo'q: barcha sahifalar
 * `generateStaticParams` orqali build vaqtida prerender bo'ladi. Kelajakda
 * `revalidate` ishlatilsa, bu yerga R2 cache qo'shish kerak bo'ladi:
 * https://opennext.js.org/cloudflare/caching
 */
export default defineCloudflareConfig();
