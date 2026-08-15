import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { NAV_LINKS } from "@/config/nav";
import { SITE_NAME } from "@/config/site";
import { Link } from "@/i18n/navigation";

export default async function Footer() {
  const t = await getTranslations();
  // Build vaqtidagi yil — sayt har yili qayta deploy bo'ladi.
  const year = new Date().getFullYear();

  return (
    <footer className="mt-22 bg-ink text-bg">
      <div className="container-page flex flex-wrap items-end justify-between gap-10 py-12">
        <div>
          <Image
            src="/brand/elchi-lockup-white.png"
            alt={SITE_NAME}
            width={1028}
            height={340}
            className="h-[34px] w-auto"
          />
          <p className="mt-4 text-[13.5px] font-medium text-bg/50">
            {t("footer.tagline")}
          </p>
        </div>

        <nav className="flex flex-wrap gap-7 text-sm font-semibold">
          {NAV_LINKS.filter(({ href }) => href !== "/").map(({ href, key }) => (
            <Link
              key={href}
              href={href}
              className="text-bg/80 transition-colors hover:text-bg"
            >
              {t(`nav.${key}`)}
            </Link>
          ))}
        </nav>

        <p className="text-[12.5px] font-medium text-bg/40">
          © {year} {SITE_NAME}. {t("footer.rights")}
        </p>
      </div>
    </footer>
  );
}
