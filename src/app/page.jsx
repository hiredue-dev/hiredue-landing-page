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
import { client } from "@/lib/sanity/client";
import { FAQ_QUERY, TESTIMONIALS_QUERY } from "@/lib/sanity/queries";
import {
  createPageMetadata,
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
} from "@/lib/seo";

export const metadata = createPageMetadata({
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  path: "/",
  absoluteTitle: true,
});

export default async function Home() {
  const [faqItems, testimonialItems] = await Promise.all([
    client.fetch(FAQ_QUERY, {}, { next: { revalidate: 60 } }),
    client.fetch(TESTIMONIALS_QUERY, {}, { next: { revalidate: 60 } }),
  ]);

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
      <Testimonials
        items={testimonialItems?.length ? testimonialItems : undefined}
      />
      <Pricing />
      <Faq items={faqItems?.length ? faqItems : undefined} />
    </>
  );
}
