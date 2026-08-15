import { getTranslations } from "next-intl/server";

import Container from "@/components/ui/Container";
import Kicker from "@/components/ui/Kicker";

const QUESTIONS = [1, 2, 3, 4, 5] as const;

export default async function Faq() {
  const t = await getTranslations("faq");

  return (
    <Container className="pt-22">
      <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
        <div>
          <Kicker>{t("kicker")}</Kicker>
          <h2 className="mt-4 text-[28px] md:text-[38px]">{t("title")}</h2>
        </div>

        <div className="rounded-panel border border-navy/10 bg-white px-6 py-2">
          {QUESTIONS.map((n) => (
            <details
              key={n}
              className="border-b border-navy/8 py-5 last:border-0"
            >
              <summary className="flex justify-between gap-5 text-base font-bold tracking-[-0.01em] md:text-[17.5px]">
                {t(`q${n}`)}
                <span
                  data-sign
                  aria-hidden="true"
                  className="font-extrabold text-navy"
                />
              </summary>
              <p className="mt-3 max-w-[62ch] text-[14.5px] leading-[1.65] font-medium text-ink/62">
                {t(`a${n}`)}
              </p>
            </details>
          ))}
        </div>
      </div>
    </Container>
  );
}
