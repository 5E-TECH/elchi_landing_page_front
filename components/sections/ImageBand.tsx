import { getTranslations } from "next-intl/server";

import Container from "@/components/ui/Container";
import Slot from "@/components/ui/Slot";

const FRAME = "relative overflow-hidden rounded-panel bg-navy/6";

/** Hero ostidagi to'rt suratli lenta. */
export default async function ImageBand() {
  const t = await getTranslations("band");

  return (
    <Container className="pt-10">
      <div className="grid gap-3 md:h-[340px] md:grid-cols-[2fr_1fr_1fr]">
        <div className={`${FRAME} h-52 md:h-auto`}>
          <Slot id="band-1" sizes="(min-width: 768px) 50vw, 100vw" />
        </div>
        <div className={`${FRAME} h-52 md:h-auto`}>
          <Slot id="band-2" sizes="(min-width: 768px) 25vw, 100vw" />
        </div>
        <div className="grid grid-rows-2 gap-3">
          <div className={`${FRAME} h-40 md:h-auto`}>
            <Slot id="band-3" sizes="(min-width: 768px) 25vw, 100vw" />
          </div>
          <div className={`${FRAME} h-40 md:h-auto`}>
            <Slot id="band-4" sizes="(min-width: 768px) 25vw, 100vw" />
          </div>
        </div>
      </div>
      <p className="mt-3 text-[12.5px] font-semibold text-ink/45">
        {t("caption")}
      </p>
    </Container>
  );
}
