"use client";

import { Eyebrow, Reveal } from "@/components/site/ui/Primitives";
import { careerPage } from "@/lib/content";

const { hero } = careerPage;

export function CareerHero() {
  return (
    <section className="relative pt-[140px] pb-[60px] min-[810px]:pt-[170px] min-[1200px]:pt-[194px]">
      <div className="mx-auto w-full max-w-[860px] px-[30px]">
        <div className="flex flex-col items-center gap-[50px]">
          <Reveal className="flex flex-col items-center gap-2.5">
            <Eyebrow>{hero.eyebrow}</Eyebrow>
            <h1 className="t-h2 text-center">{hero.title}</h1>
            <p className="t-body-lg max-w-[560px] text-center">{hero.description}</p>
          </Reveal>

          <Reveal
            y={30}
            delay={0.1}
            className="w-full rounded-[24px] bg-surface p-8 text-center sm:p-10"
          >
            <p className="t-h5 text-ink">&ldquo;{hero.quote.text}&rdquo;</p>
            <p className="mt-4 t-body-sm">
              <span className="font-semibold text-ink">{hero.quote.author}</span> ·{" "}
              {hero.quote.role}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
