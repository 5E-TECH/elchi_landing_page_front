"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";

import LocaleSwitcher from "@/components/layout/LocaleSwitcher";
import { ButtonLink } from "@/components/ui/Button";
import { CTA_HREF, NAV_LINKS } from "@/config/nav";
import { Link, usePathname } from "@/i18n/navigation";

export default function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-navy/10 bg-bg/92 backdrop-blur-[10px]">
      <div className="container-page flex items-center gap-9 py-4">
        <Link
          href="/"
          className="mr-auto flex items-center"
          aria-label="Elchi Pochta"
        >
          <Image
            src="/brand/elchi-lockup-trim.png"
            alt="Elchi Pochta"
            width={1028}
            height={340}
            priority
            className="h-[30px] w-auto"
          />
        </Link>

        <nav className="hidden items-center gap-[30px] text-[14.5px] font-semibold lg:flex">
          {NAV_LINKS.map(({ href, key }) => (
            <Link
              key={href}
              href={href}
              aria-current={pathname === href ? "page" : undefined}
              className={
                pathname === href
                  ? "text-ink"
                  : "text-navy transition-colors hover:text-ink"
              }
            >
              {t(key)}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <LocaleSwitcher />
          <ButtonLink href={CTA_HREF}>{t("cta")}</ButtonLink>
        </div>

        {/* Mobil boshqaruv — dizayn 1240px desktop uchun chizilgan,
            kichik ekran uchun burger qo'shildi. */}
        <div className="flex items-center gap-3 lg:hidden">
          <LocaleSwitcher />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobil-menyu"
            aria-label={open ? t("closeMenu") : t("openMenu")}
            className="flex size-10 cursor-pointer items-center justify-center rounded-pill bg-navy/7 text-navy"
          >
            <BurgerIcon open={open} />
          </button>
        </div>
      </div>

      {open ? (
        <div id="mobil-menyu" className="border-t border-navy/10 lg:hidden">
          <nav className="container-page flex flex-col py-2">
            {NAV_LINKS.map(({ href, key }) => (
              <Link
                key={href}
                href={href}
                aria-current={pathname === href ? "page" : undefined}
                onClick={() => setOpen(false)}
                className={`border-b border-navy/8 py-3.5 text-base font-semibold last:border-0 ${
                  pathname === href ? "text-ink" : "text-navy"
                }`}
              >
                {t(key)}
              </Link>
            ))}
            <ButtonLink
              href={CTA_HREF}
              size="lg"
              className="my-4"
              onClick={() => setOpen(false)}
            >
              {t("cta")}
            </ButtonLink>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

function BurgerIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      {open ? (
        <>
          <path d="M4 4l10 10" />
          <path d="M14 4L4 14" />
        </>
      ) : (
        <>
          <path d="M2.5 5h13" />
          <path d="M2.5 9h13" />
          <path d="M2.5 13h13" />
        </>
      )}
    </svg>
  );
}
