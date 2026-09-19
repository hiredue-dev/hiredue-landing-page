"use client";

import {
  Eyebrow,
  Reveal,
  RevealGroup,
  RevealItem,
} from "@/components/site/ui/Primitives";
import { ats } from "@/lib/content";

/**
 * "What the analysis checks" — a light, editorial product-explanation of the
 * areas a resume screening generally evaluates (structure, skills, content,
 * experience, formatting, keywords). Purely presentational.
 *
 * IMPORTANT: presented as a compact, consistent checklist, NOT as six large
 * dashboard-style metric cards — and an honest note makes explicit that these
 * are general concepts an ATS analysis considers, not six separate live scores
 * unless the backend returns them.
 */
export function AtsWhatAtsChecks() {
  const { whatChecks } = ats;
  return (
    <section className="border-t border-line pt-[80px] md:pt-[110px]">
      <Reveal className="max-w-[720px]">
        <Eyebrow>{whatChecks.eyebrow}</Eyebrow>
        <h2 className="t-h3 mt-4 max-w-[24ch]">{whatChecks.title}</h2>
        <p className="t-body-lg mt-3 max-w-[620px] text-dim">
          {whatChecks.description}
        </p>
      </Reveal>

      <RevealGroup
        step={0.07}
        className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
      >
        {whatChecks.items.map((item) => (
          <RevealItem
            key={item.title}
            className="flex items-start gap-4 rounded-[16px] border border-line bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-[10px] bg-surface text-[17px] text-ink">
              {item.icon}
            </span>
            <div className="min-w-0">
              <h3 className="t-body font-semibold text-ink">{item.title}</h3>
              <p className="mt-1 text-[14px] leading-[1.5] text-dim">
                {item.text}
              </p>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>

      <Reveal delay={0.1}>
        <p className="mt-6 max-w-[720px] border-l-2 border-brand/30 pl-4 text-[13px] leading-[1.5] text-dim">
          {whatChecks.note}
        </p>
      </Reveal>
    </section>
  );
}

export default AtsWhatAtsChecks;
