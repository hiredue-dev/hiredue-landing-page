"use client";

import { FaqAccordion } from "@/components/site/ui/FaqAccordion";
import { Reveal } from "@/components/site/ui/Primitives";
import { contactPage } from "@/lib/content";

const { faq } = contactPage;

export function ContactFaq() {
  return (
    <section className="relative pb-[100px] min-[810px]:pb-[160px] min-[1200px]:pb-[200px]">
      <div className="container-page">
        <div className="mx-auto flex max-w-[800px] flex-col gap-[50px]">
          <Reveal>
            <h2 className="t-h2 text-center">{faq.title}</h2>
          </Reveal>

          <Reveal delay={0.1} className="flex flex-col gap-5">
            <FaqAccordion items={faq.items} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
