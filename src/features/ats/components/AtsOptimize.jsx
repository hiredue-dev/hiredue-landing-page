"use client";

import {
  Eyebrow,
  Reveal,
  RevealGroup,
  RevealItem,
} from "@/components/site/ui/Primitives";
import { ats } from "@/lib/content";

/**
 * "Optimize Your Resume" — a two-column split (HireDue's `FeatureAbout` rhythm):
 * copy on one side, an honest checklist of levers on the other. It explains that
 * improvement is guided by the report's recommendations — identifying missing
 * skills, tightening keywords, fixing formatting, strengthening structure and
 * re-scanning — and NEVER implies an automatic rewrite. Every string lives in
 * `content.js` (`ats.optimize.items`); nothing here fabricates a before/after
 * transformation or a per-resume result.
 */
export function AtsOptimize() {
  const { items } = ats.optimize;
  return (
    <section className="border-t border-line pt-[80px] md:pt-[110px]">
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
        {/* Copy — what "optimizing" means and the honest boundary */}
        <Reveal className="flex flex-col items-start gap-4">
          <Eyebrow>{ats.optimize.eyebrow}</Eyebrow>
          <h2 className="t-h3 max-w-[22ch]">{ats.optimize.title}</h2>
          <p className="t-body-lg text-dim">{ats.optimize.description}</p>
          <Reveal delay={0.05}>
            <p className="border-l-2 border-brand/30 pl-4 text-[13px] leading-[1.5] text-dim">
              {ats.optimize.note}
            </p>
          </Reveal>
        </Reveal>

        {/* Actions — the honest checklist of levers, not a preview */}
        <RevealGroup step={0.06} className="grid gap-2.5 sm:grid-cols-2">
          {items.map((item) => (
            <RevealItem
              key={item.title}
              className="flex items-start gap-3 rounded-[16px] border border-line bg-surface/40 p-4"
            >
              <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-[8px] bg-white text-[15px] text-ink ring-1 ring-line">
                {item.icon}
              </span>
              <div className="min-w-0">
                <p className="text-[14px] leading-[1.3] font-semibold text-ink">
                  {item.title}
                </p>
                <p className="mt-1 text-[13px] leading-[1.5] text-dim">
                  {item.text}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

export default AtsOptimize;
