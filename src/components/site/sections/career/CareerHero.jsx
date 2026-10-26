"use client";

import { Reveal } from "@/components/site/ui/Primitives";
import { PageHero } from "@/components/site/ui/PageHero";
import { careerPage } from "@/lib/content";

const { hero } = careerPage;

export function CareerHero() {
  return (
    <PageHero eyebrow={hero.eyebrow} title={hero.title} description={hero.description} className="pb-[60px]">
      <Reveal y={30} delay={0.1} className="w-full rounded-[24px] bg-surface p-8 text-center sm:p-10">
        <p className="t-h5 text-ink">&ldquo;{hero.quote.text}&rdquo;</p>
        <p className="mt-4 t-body-sm">
          <span className="font-semibold text-ink">{hero.quote.author}</span> · {hero.quote.role}
        </p>
      </Reveal>
    </PageHero>
  );
}
