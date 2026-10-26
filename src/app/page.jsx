import { Hero } from "@/components/site/sections/Hero";
import { Clients } from "@/components/site/sections/Clients";
import { Features } from "@/components/site/sections/Features";
import { Overview } from "@/components/site/sections/Overview";
import { Steps } from "@/components/site/sections/Steps";
import { Security } from "@/components/site/sections/Security";
// change_v 1 : Use Cases section ("Who HireDue is built for") hidden, import commented out
// import { UseCases } from "@/components/site/sections/UseCases";
import { Integrations } from "@/components/site/sections/Integrations";
import { Stats } from "@/components/site/sections/Stats";
import { Testimonials } from "@/components/site/sections/Testimonials";
import { Pricing } from "@/components/site/sections/Pricing";
import { Faq } from "@/components/site/sections/Faq";
import { JsonLd } from "@/components/site/seo/JsonLd";
import { APP_VERSION } from "@/features/jobs/downloads.js";
import { getPublicPlans } from "@/features/subscription/services/subscriptionService";
import { faq } from "@/lib/content";
import { client } from "@/lib/sanity/client";
import { FAQ_QUERY, TESTIMONIALS_QUERY } from "@/lib/sanity/queries";
import {
  createPageMetadata,
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  getHomeJsonLd,
} from "@/lib/seo";

export const metadata = createPageMetadata({
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  path: "/",
  absoluteTitle: true,
});

export default async function Home() {
  const [faqItems, testimonialItems, plans] = await Promise.all([
    client.fetch(FAQ_QUERY, {}, { next: { revalidate: 60 } }),
    client.fetch(TESTIMONIALS_QUERY, {}, { next: { revalidate: 60 } }),
    getPublicPlans(),
  ]);
  const faqList = faqItems?.length ? faqItems : faq.items;

  return (
    <>
      <JsonLd data={getHomeJsonLd({ faq: faqList, plans, version: APP_VERSION })} />
      <Hero />
      <Clients />
      <Features />
      <Overview />
      <Steps />
      {/* proof straight after "how it works", before security and pricing */}
      <Testimonials
        items={testimonialItems?.length ? testimonialItems : undefined}
      />
      <Security />
      {/* change_v 1 : Use Cases section ("Who HireDue is built for") hidden */}
      {/* <UseCases /> */}
      <Integrations />
      <Stats />
      <Pricing initialPlans={plans} />
      <Faq items={faqList} />
    </>
  );
}
