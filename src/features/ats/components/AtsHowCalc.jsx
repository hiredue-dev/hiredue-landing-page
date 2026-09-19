"use client";

import {
  Eyebrow,
  Reveal,
  RevealGroup,
  RevealItem,
} from "@/components/site/ui/Primitives";
import { ats } from "@/lib/content";

/**
 * Explains how the (generic, explainable) ATS score is computed — a compact
 * methodology panel, deliberately styled as a single clean surface block rather
 * than a row of large cards, so it doesn't visually compete with the hero or the
 * journey panel. As everywhere else, the strings are copy living in `content.js`
 * (`ats.howCalc`), not a score computation — it takes no report data and performs
 * no analysis, and the scoring-version note keeps the boundary honest.
 */
export function AtsHowCalc() {
  const { howCalc } = ats;
  return (
    <section className="border-t border-line pt-[80px] md:pt-[110px]">
      <div className="rounded-[28px] border border-line bg-white p-7 shadow-[0_1px_3px_rgba(0,0,0,0.04)] md:p-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-12">
          {/* Left: the guarantee + honest methodology note */}
          <Reveal className="flex flex-col items-start gap-3">
            <Eyebrow>{howCalc.eyebrow}</Eyebrow>
            <h2 className="t-h3">{howCalc.title}</h2>
            <p className="t-body-lg text-dim">{howCalc.description}</p>
            <Reveal delay={0.05}>
              <p className="border-l-2 border-brand/30 pl-4 text-[13px] leading-[1.5] text-dim">
                {howCalc.disclaimer}
              </p>
            </Reveal>
          </Reveal>

          {/* Right: the weighted categories, compact and editorial */}
          <Reveal delay={0.08}>
            <p className="font-display text-[15px] leading-[1.3] font-semibold text-ink">
              {howCalc.categoriesTitle}
            </p>
            <RevealGroup
              step={0.05}
              className="mt-4 grid gap-2.5 sm:grid-cols-2"
            >
              {howCalc.categories.map((category) => (
                <RevealItem
                  key={category.title}
                  className="flex items-start gap-3 rounded-[14px] bg-surface/50 p-3.5"
                >
                  <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-[8px] bg-white text-[14px] text-ink ring-1 ring-line">
                    {category.icon}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[13px] leading-[1.3] font-semibold text-ink">
                      {category.title}
                    </p>
                    <p className="mt-0.5 text-[12px] leading-[1.45] text-dim">
                      {category.description}
                    </p>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export default AtsHowCalc;
