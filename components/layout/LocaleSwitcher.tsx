"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useTransition } from "react";

import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

/**
 * UZ / RU / EN pill'lari. Til almashganda foydalanuvchi turgan sahifada
 * qoladi — `usePathname` locale prefiksisiz yo'lni beradi, router esa uni
 * yangi til bilan qayta yig'adi.
 */
export default function LocaleSwitcher({
  className = "",
}: {
  className?: string;
}) {
  const t = useTranslations("nav");
  const active = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Ko'rilayotgan tilni cookie'ga yozib boramiz — `app/route.ts` ildizga
  // kelganda shu qiymatni brauzer tilidan ustun qo'yadi. Ilgari buni next-intl
  // middleware qilardi va u ham aynan ochilgan sahifa tilini yozardi.
  useEffect(() => {
    document.cookie = `NEXT_LOCALE=${active}; path=/; max-age=31536000; samesite=lax`;
  }, [active]);

  function select(locale: string) {
    if (locale === active) return;
    startTransition(() => {
      // `pathname` locale prefiksisiz keladi, router uni yangi til bilan
      // qayta yig'adi — foydalanuvchi o'sha sahifada qoladi.
      router.replace(pathname, {
        locale: locale as (typeof routing.locales)[number],
      });
    });
  }

  return (
    <div
      className={`flex gap-0.5 rounded-pill bg-navy/7 p-[3px] ${className}`}
      role="group"
      aria-label={t("language")}
    >
      {routing.locales.map((locale) => {
        const isActive = locale === active;
        return (
          <button
            key={locale}
            type="button"
            onClick={() => select(locale)}
            disabled={isPending}
            aria-current={isActive ? "true" : undefined}
            className={`cursor-pointer rounded-pill px-3 py-1.5 text-xs font-bold uppercase transition-colors ${
              isActive
                ? "bg-navy text-bg"
                : "text-ink/55 hover:text-navy"
            }`}
          >
            {locale}
          </button>
        );
      })}
    </div>
  );
}
