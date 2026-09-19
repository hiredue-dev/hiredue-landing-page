"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Check } from "lucide-react";
import { ats } from "@/lib/content";
import { getWorkingItems } from "../domain/report.js";

/**
 * AtsWhatWorking — compact "What's working" panel in the analysis rail.
 *
 * It renders ONLY the engine's own observations, taken verbatim from
 * `completeness.items` and `contentStrength.items` via the getWorkingItems
 * selector. Nothing is invented, re-scored or re-labelled here. If the engine
 * returned no items, a clean factual empty state is shown instead of fabricated
 * positive findings.
 *
 * The list is intentionally dense (tight green-check rows) and collapses to a
 * few visible items with a "Show more" toggle so it stays a secondary support
 * section rather than consuming a large chunk of the workspace.
 */
const DEFAULT_VISIBLE = 4;

export function AtsWhatWorking({ report = null }) {
  const items = getWorkingItems(report);
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? items : items.slice(0, DEFAULT_VISIBLE);
  const hasMore = items.length > DEFAULT_VISIBLE;

  return (
    <section aria-labelledby="ats-whats-working" className="flex flex-col">
      <div className="flex items-center justify-between gap-3">
        <h2
          id="ats-whats-working"
          className="text-[13px] leading-none font-semibold tracking-[0.02em] text-ink"
        >
          {ats.dashboard.whatsWorking.title}
        </h2>
        {items.length > 0 ? (
          <span className="inline-flex items-center rounded-full bg-green-600/10 px-2.5 py-1 text-[11px] font-semibold text-green-700 tabular-nums">
            {items.length}
          </span>
        ) : null}
      </div>

      {items.length === 0 ? (
        <p className="mt-3 text-[13px] leading-[1.55] text-dim">
          {ats.dashboard.whatsWorking.empty}
        </p>
      ) : (
        <ul className="mt-2 flex flex-col">
          {visible.map((item, index) => (
            <li
              key={`${index}-${item}`}
              className="flex items-start gap-2.5 border-t border-line py-2.5 first:border-t-0"
            >
              <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-green-600/10 text-green-600">
                <Check aria-hidden className="size-3" strokeWidth={3} />
              </span>
              <p className="min-w-0 flex-1 pt-0.5 text-[13.5px] leading-[1.5] text-ink">
                {item}
              </p>
            </li>
          ))}
        </ul>
      )}

      {hasMore ? (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="mt-2 inline-flex w-fit cursor-pointer items-center gap-1.5 rounded-full border border-line bg-white px-3.5 py-1.5 text-[12px] font-semibold text-ink transition-colors hover:bg-surface"
        >
          {expanded ? ats.dashboard.whatsWorking.showLess : ats.dashboard.whatsWorking.showMore}
          {expanded ? (
            <ChevronUp aria-hidden className="size-3.5" />
          ) : (
            <ChevronDown aria-hidden className="size-3.5" />
          )}
        </button>
      ) : null}
    </section>
  );
}

export default AtsWhatWorking;
