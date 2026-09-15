"use client";

import { Reveal } from "@/components/site/ui/Primitives";
import { ats } from "@/lib/content";

/**
 * Accessible loading state for the scan phase. Uses a live region so assistive
 * tech is notified, and conveys "what is happening" rather than a bare spinner.
 */
export function AtsLoadingState() {
  return (
    <Reveal
      aria-live="polite"
      role="status"
      className="rounded-[24px] bg-surface p-10 md:p-14"
    >
      <div className="flex flex-col items-center gap-6 text-center">
        <div
          aria-hidden
          className="size-12 animate-spin rounded-full border-4 border-line border-t-brand"
        />
        <div className="flex flex-col items-center gap-2">
          <h3 className="t-h4">{ats.loading.title}</h3>
          <p className="t-body max-w-[440px] text-dim">
            {ats.loading.description}
          </p>
        </div>
        <ol className="flex flex-col gap-3 text-left">
          {ats.loading.steps.map((step) => (
            <li key={step} className="flex items-center gap-3 t-body text-dim">
              <span className="grid size-5 shrink-0 place-items-center rounded-full bg-white text-[11px] font-semibold text-ink">
                ✓
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>
    </Reveal>
  );
}

export default AtsLoadingState;