"use client";

import { History } from "lucide-react";
import { Reveal } from "@/components/site/ui/Primitives";
import { ats } from "@/lib/content";

/**
 * Lightweight, subscription-gated list of the user's past scans. It consumes
 * the normalized `history` array the workflow hook provides and renders it as
 * simple links to be scanned later — no graph, no re-scoring.
 */
export function AtsHistoryBar({ history = [], onSelect }) {
  if (!history || history.length === 0) return null;

  return (
    <Reveal className="rounded-[20px] bg-white p-6">
      <div className="flex items-center gap-2">
        <History aria-hidden className="size-4 text-brand" />
        <h3 className="font-display text-[18px] font-semibold text-ink">
          {ats.history.title}
        </h3>
      </div>

      <ul className="mt-4 flex flex-col gap-3">
        {history.map((entry) => {
          // Guard: only render entries that carry an id to navigate to.
          const entryId = entry?.id ?? entry?.reportId;
          if (!entryId) return null;
          const dateLabel = entry?.scannedAt
            ? new Date(entry.scannedAt).toLocaleDateString()
            : "Previous scan";
          return (
            <li key={entryId}>
              <button
                type="button"
                onClick={() => onSelect && onSelect(entryId)}
                className="flex w-full cursor-pointer items-center justify-between gap-4 rounded-[12px] bg-surface px-4 py-3 text-left transition-colors hover:bg-line/50"
              >
                <span className="truncate text-[14px] font-medium text-ink">
                  {entry?.fileLabel || "Resume scan"}
                </span>
                <span className="shrink-0 text-[12px] text-dim">
                  {dateLabel}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </Reveal>
  );
}

export default AtsHistoryBar;