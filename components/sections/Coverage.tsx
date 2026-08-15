import { getTranslations } from "next-intl/server";

import ZoneTable from "@/components/sections/ZoneTable";
import Container from "@/components/ui/Container";
import Kicker from "@/components/ui/Kicker";
import Slot from "@/components/ui/Slot";

export default async function Coverage() {
  const t = await getTranslations("coverage");

  return (
    <Container className="pt-22">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div>
          <Kicker>{t("kicker")}</Kicker>
          <h2 className="mt-4 mb-3.5 text-[30px] md:text-[40px]">
            {t("title")}
          </h2>
          <p className="mb-6 text-[15.5px] leading-[1.65] font-medium text-ink/60">
            {t("subtitle")}
          </p>
          <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-navy/6">
            <Slot id="coverage" sizes="(min-width: 1024px) 33vw, 100vw" />
          </div>
        </div>

        <ZoneTable />
      </div>
    </Container>
  );
}
