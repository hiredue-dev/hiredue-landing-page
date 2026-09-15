"use client";

import { ChevronRight, History } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/ui/Primitives";
import { ats } from "@/lib/content";

/**
 * Lightweight, subscription-gated list of the user's past scans. It consumes
 * the normalized `history` array the workflow hook provides and renders it as
 * simple links to be scanned later — no graph, no re-scoring.
 */
export function AtsHistoryBar({ history = [], onSelect }) {
  if (!history || history.length === 0) return null;

  return (
    <Reveal className="rounded-[20px] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="flex items-center gap-2">
        <span className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-brand/10 text-brand">
          <History aria-hidden className="size-4" />
        </span>
        <h3 className="font-display text-[18px] font-semibold text-ink">
          {ats.history.title}
        </h3>
      </div>

      <RevealGroup step={0.06} className="mt-4 flex flex-col gap-3">
        {history.map((entry) => {
          // Guard: only render entries that carry an id to navigate to.
          const entryId = entry?.id ?? entry?.reportId;
          if (!entryId) return null;
          const dateLabel = entry?.scannedAt
            ? new Date(entry.scannedAt).toLocaleDateString()
            : "Previous scan";
          return (
            <RevealItem key={entryId} y={12}>
              <button
                type="button"
                onClick={() => onSelect && onSelect(entryId)}
                className="group flex w-full cursor-pointer items-center justify-between gap-4 rounded-[12px] bg-surface px-4 py-3 text-left transition-colors duration-300 hover:bg-brand/10"
              >
                <span className="min-w-0">
                  <span className="block truncate text-[14px] font-medium text-ink">
                    {entry?.fileLabel || "Resume scan"}
                  </span>
                  <span className="block text-[12px] text-dim">
                    {dateLabel}
                  </span>
                </span>
                <ChevronRight
                  aria-hidden
                  className="size-4 shrink-0 text-dim transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-brand"
                />
              </button>
            </RevealItem>
          );
        })}
      </RevealGroup>
    </Reveal>
  );
}

export default AtsHistoryBar;