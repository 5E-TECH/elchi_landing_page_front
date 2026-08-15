import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { IMAGE_SLOTS } from "@/config/site";

/**
 * Dizayndagi rasm sloti.
 *
 * Foto `config/site.ts` dagi IMAGE_SLOTS ga yozilgan bo'lsa — `next/image`.
 * Bo'lmasa neytral brend bloki chiqadi: publikda u shunchaki jim sirt bo'lib
 * ko'rinadi (sayt tugallanmagandek tuyulmasin), dev rejimida esa qaysi surat
 * kerakligi yozib turadi — jamoa nimani suratga olishni bilsin.
 */
export default async function Slot({
  id,
  className = "",
  priority = false,
  sizes = "100vw",
}: {
  id: keyof typeof IMAGE_SLOTS;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  const src = IMAGE_SLOTS[id];
  const t = await getTranslations("slots");
  const label = t(id);

  if (src) {
    return (
      <Image
        src={src}
        alt={label}
        fill
        sizes={sizes}
        priority={priority}
        className={`object-cover ${className}`}
      />
    );
  }

  return (
    <div
      role="presentation"
      className={`flex h-full w-full items-center justify-center bg-navy/6 ${className}`}
    >
      {process.env.NODE_ENV === "development" ? (
        <span className="max-w-[26ch] px-4 text-center text-[12px] leading-snug font-semibold text-navy/45">
          {label}
        </span>
      ) : null}
    </div>
  );
}
