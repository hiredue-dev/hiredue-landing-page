import { Hero } from "@/components/site/sections/Hero";
import { Clients } from "@/components/site/sections/Clients";
import { Comparison } from "@/components/site/sections/Comparison";
import { Features } from "@/components/site/sections/Features";
import { Overview } from "@/components/site/sections/Overview";
import { Steps } from "@/components/site/sections/Steps";
import { Security } from "@/components/site/sections/Security";
import { UseCases } from "@/components/site/sections/UseCases";
import { Integrations } from "@/components/site/sections/Integrations";
import { Stats } from "@/components/site/sections/Stats";
import { Testimonials } from "@/components/site/sections/Testimonials";
import { Pricing } from "@/components/site/sections/Pricing";
import { Faq } from "@/components/site/sections/Faq";

export default function Home() {
  return (
    <>
      <Hero />
      <Clients />
      <Comparison />
      <Features />
      <Overview />
      <Steps />
      <Security />
      <UseCases />
      <Integrations />
      <Stats />
      <Testimonials />
      <Pricing />
      <Faq />
    </>
  );
}
