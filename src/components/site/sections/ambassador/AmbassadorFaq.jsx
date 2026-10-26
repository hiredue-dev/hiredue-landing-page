"use client";

import { FaqAccordion } from "@/components/site/ui/FaqAccordion";
import { Reveal } from "@/components/site/ui/Primitives";
import { ambassadorPage } from "@/lib/content";

const { faq } = ambassadorPage;

export function AmbassadorFaq() {
  return (
    <section
      id="ambassador-faqs"
      className="relative pb-[100px] min-[810px]:pb-[160px] min-[1200px]:pb-[200px]"
    >
      <div className="container-page">
        <div className="flex flex-col gap-[50px] lg:flex-row lg:gap-[70px]">
          <Reveal className="flex flex-col gap-2.5 lg:w-[380px] lg:shrink-0">
            <h2 className="t-h2">{faq.title}</h2>
            <p className="t-body-lg">{faq.description}</p>
          </Reveal>

          <Reveal delay={0.1} className="flex flex-1 flex-col gap-5">
            <FaqAccordion items={faq.items} answerClassName="max-w-[620px]" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
