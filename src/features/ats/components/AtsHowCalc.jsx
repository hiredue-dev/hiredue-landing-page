"use client";

import { Eyebrow, Reveal, RevealGroup, RevealItem } from "@/components/site/ui/Primitives";
import { ats } from "@/lib/content";

/**
 * Explains what a generic ATS score checks. As with every other string on the
 * ATS surface, this is copy living in `content.js` (`ats.howCalc.categories`),
 * not a score computation — it takes no report data and performs no analysis.
 * It discloses the methodology so the score is explainable (UX-3).
 */
const CATEGORIES = ats.howCalc.categories;

export function AtsHowCalc() {
  return (
    <section className="mt-[120px] md:mt-[160px]">
      <Reveal className="flex flex-col items-start gap-3">
        <Eyebrow>{ats.howCalc.eyebrow}</Eyebrow>
        <h2 className="t-h2">{ats.howCalc.title}</h2>
        <p className="t-body mt-2 max-w-[680px] text-dim">
          {ats.howCalc.description}
        </p>
      </Reveal>

      <RevealGroup step={0.08} className="mt-10 grid gap-5 md:grid-cols-3">
        {CATEGORIES.map((category) => (
          <RevealItem
            key={category.title}
            className="rounded-[20px] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
          >
            <span className="grid size-11 place-items-center rounded-[12px] bg-brand/10 text-lg text-brand">
              {category.icon}
            </span>
            <h3 className="t-h5 mt-4">{category.title}</h3>
            <p className="mt-2 text-[15px] leading-[1.6] text-dim">
              {category.description}
            </p>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}

export default AtsHowCalc;