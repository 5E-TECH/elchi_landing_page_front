import { getTranslations } from "next-intl/server";

import Container from "@/components/ui/Container";
import Kicker from "@/components/ui/Kicker";
import Slot from "@/components/ui/Slot";

const STEPS = [
  { key: "one", slot: "step-1" },
  { key: "two", slot: "step-2" },
  { key: "three", slot: "step-3" },
  { key: "four", slot: "step-4" },
] as const;

export default async function HowItWorks() {
  const t = await getTranslations("how");

  return (
    <Container className="pt-22">
      <Kicker>{t("kicker")}</Kicker>
      <h2 className="mt-4 mb-10 text-[32px] md:text-[42px]">{t("title")}</h2>

      <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map(({ key, slot }, index) => (
          <li key={key}>
            <div className="relative mb-[18px] aspect-[4/3] overflow-hidden rounded-card bg-navy/6">
              <Slot id={slot} sizes="(min-width: 1024px) 25vw, 100vw" />
            </div>
            <p
              aria-hidden="true"
              className="grid size-11 place-items-center rounded-pill bg-navy text-[17px] font-extrabold text-bg"
            >
              {index + 1}
            </p>
            <h3 className="mt-[18px] mb-2 text-[19px]">{t(`${key}.title`)}</h3>
            <p className="text-sm leading-[1.6] font-medium text-ink/60">
              {t(`${key}.body`)}
            </p>
          </li>
        ))}
      </ol>
    </Container>
  );
}
