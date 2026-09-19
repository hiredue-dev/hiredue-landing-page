"use client";

import {
  Eyebrow,
  Reveal,
  RevealGroup,
  RevealItem,
} from "@/components/site/ui/Primitives";
import { ats } from "@/lib/content";

/**
 * The "From upload to improvement" journey strip. Connects the /ats entry
 * experience (upload) to the dashboard (analysis + results) and on to the
 * guided next step (improve + re-scan). Rendered as a single HireDue surface
 * panel — lightweight, not a heavy dashboard panel.
 *
 * Honesty guardrail: only upload, analysis and results are live product flows
 * today. "Improve Resume" is framed as acting on the report's recommendations
 * and re-scanning — never as a fabricated one-click rewrite endpoint.
 */
export function AtsJourney() {
  const { journey } = ats;
  return (
    <section className="border-t border-line pt-[80px] md:pt-[110px]">
      <div className="rounded-[28px] bg-surface px-6 py-12 md:px-12 md:py-16">
        <Reveal className="mx-auto max-w-[680px] text-center">
          <Eyebrow>{journey.eyebrow}</Eyebrow>
          <h2 className="t-h3 mt-4 max-w-[26ch]">{journey.title}</h2>
          <p className="t-body-lg mt-3 text-dim">{journey.description}</p>
        </Reveal>

        <RevealGroup
          step={0.08}
          className="mx-auto mt-10 grid max-w-[1040px] gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {journey.steps.map((step) => (
            <RevealItem
              key={step.number}
              className="flex flex-col rounded-[18px] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
            >
              <span className="font-display text-[16px] leading-[1.2] font-semibold text-brand">
                {step.number}
              </span>
              <h3 className="mt-3 text-[16px] leading-[1.3] font-semibold text-ink">
                {step.title}
              </h3>
              <p className="mt-1.5 text-[14px] leading-[1.5] text-dim">
                {step.text}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.1}>
          <p className="mx-auto mt-8 max-w-[680px] text-center text-[13px] leading-[1.5] text-dim">
            {journey.note}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

export default AtsJourney;
