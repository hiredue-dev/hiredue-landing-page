"use client";

import { motion } from "framer-motion";
import { Eyebrow, Reveal, RevealGroup, RevealItem } from "@/components/site/ui/Primitives";
import { ats } from "@/lib/content";
import { getCategoryScores } from "../domain/report.js";
import { spring } from "@/lib/motion";

/**
 * Presents backend category sub-scores and their "why" lines (UX-11). It
 * consumes only category scores via a small domain selector — it neither
 * computes nor re-interprets them, and renders them readably without charts.
 */
export function AtsBreakdown({ report = null }) {
  const categories = getCategoryScores(report);

  return (
    <section className="mt-[120px] md:mt-[160px]">
      <Reveal className="flex flex-col items-start gap-3">
        <Eyebrow>{ats.breakdown.eyebrow}</Eyebrow>
        <h2 className="t-h2">{ats.breakdown.title}</h2>
      </Reveal>

      {categories.length === 0 ? (
        <Reveal>
          <p className="t-body mt-6 text-dim">{ats.breakdown.noData}</p>
        </Reveal>
      ) : (
        <RevealGroup step={0.08} className="mt-10 grid gap-5 md:grid-cols-2">
          {categories.map((category) => {
            const score = Math.round(category.score ?? 0);
            return (
              <RevealItem
                key={category.id ?? category.label}
                className="rounded-[20px] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="t-h5">{category.label}</h3>
                  <span className="font-display text-[28px] font-bold text-ink">
                    {score}
                  </span>
                </div>
                <div
                  aria-hidden
                  className="mt-3 h-2 w-full overflow-hidden rounded-full bg-surface"
                >
                  <motion.div
                    className="h-full origin-left rounded-full bg-brand"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${score}%` }}
                    viewport={{ once: true }}
                    transition={spring(0.8, 0.1)}
                  />
                </div>
                {category.detail ? (
                  <p className="mt-3 text-[14px] leading-[1.5] text-dim">
                    {category.detail}
                  </p>
                ) : null}
              </RevealItem>
            );
          })}
        </RevealGroup>
      )}
    </section>
  );
}

export default AtsBreakdown;