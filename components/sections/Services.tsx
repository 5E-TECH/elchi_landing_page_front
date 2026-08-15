import { getTranslations } from "next-intl/server";

import Card from "@/components/ui/Card";
import Container from "@/components/ui/Container";
import Kicker from "@/components/ui/Kicker";
import { Link } from "@/i18n/navigation";

const ITEMS = ["delivery", "pickup", "returns"] as const;

/** Bosh sahifadagi uchta asosiy xizmat. */
export default async function Services() {
  const t = await getTranslations("services");

  return (
    <Container className="pt-22">
      <Kicker>{t("kicker")}</Kicker>
      <h2 className="mt-4 mb-10 max-w-[24ch] text-[32px] md:text-[42px]">
        {t("title")}
      </h2>

      <div className="grid gap-5 md:grid-cols-3">
        {ITEMS.map((item, index) => (
          <Card key={item}>
            <p
              aria-hidden="true"
              className="grid size-10 place-items-center rounded-[12px] bg-navy/8 text-[15px] font-extrabold text-navy"
            >
              {String(index + 1).padStart(2, "0")}
            </p>
            <h3 className="mt-5 mb-2.5 text-[22px]">{t(`${item}.title`)}</h3>
            <p className="text-[14.5px] leading-[1.62] font-medium text-ink/62">
              {t(`${item}.body`)}
            </p>
          </Card>
        ))}
      </div>

      <p className="mt-[22px]">
        <Link
          href="/xizmatlar"
          className="text-[14.5px] font-bold text-navy hover:underline"
        >
          {t("all")} →
        </Link>
      </p>
    </Container>
  );
}
