import { getTranslations } from "next-intl/server";

import Container from "@/components/ui/Container";
import Kicker from "@/components/ui/Kicker";
import Slot from "@/components/ui/Slot";

const POINTS = ["know", "price", "responsibility", "telegram"] as const;

export default async function WhyElchi() {
  const t = await getTranslations("why");

  return (
    <Container className="pt-22">
      <div className="rounded-block bg-navy px-6 py-12 text-bg md:px-12 md:py-14">
        <Kicker tone="light">{t("kicker")}</Kicker>
        <h2 className="mt-4 mb-10 text-[30px] md:text-[40px]">{t("title")}</h2>

        <div className="relative mb-10 h-[220px] overflow-hidden rounded-panel bg-bg/8 md:h-[300px]">
          <Slot id="team" sizes="(min-width: 768px) 1240px, 100vw" />
        </div>

        <div className="grid gap-9 md:grid-cols-2 md:gap-x-12">
          {POINTS.map((point) => (
            <div key={point} className="border-t border-bg/20 pt-5">
              <h3 className="mb-2.5 text-[21px]">{t(`${point}.title`)}</h3>
              <p className="text-[14.5px] leading-[1.65] font-medium text-bg/68">
                {t(`${point}.body`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
