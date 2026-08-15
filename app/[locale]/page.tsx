import { setRequestLocale } from "next-intl/server";

import Calculator from "@/components/sections/Calculator";
import Coverage from "@/components/sections/Coverage";
import Faq from "@/components/sections/Faq";
import Hero from "@/components/sections/Hero";
import HowItWorks from "@/components/sections/HowItWorks";
import ImageBand from "@/components/sections/ImageBand";
import Services from "@/components/sections/Services";
import WhyElchi from "@/components/sections/WhyElchi";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <ImageBand />
      <Services />
      <Calculator />
      <HowItWorks />
      <Coverage />
      <WhyElchi />
      <Faq />
    </>
  );
}
