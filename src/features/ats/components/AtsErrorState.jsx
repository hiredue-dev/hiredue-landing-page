"use client";

import { ats } from "@/lib/content";

/**
 * Predictable error state. It receives a *copy key* (never a raw backend error),
 * maps it to friendly copy, and offers a reset action. Technical/backend errors
 * stay isolated in the service/hook layer and are never surfaced verbatim here.
 */
export function AtsErrorState({ errorKey = "uploadFailed", onReset }) {
  const message = ats.errorStates[errorKey] || ats.errorStates.uploadFailed;

  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-6 rounded-[24px] border border-line bg-white p-10 text-center shadow-[0_1px_3px_rgba(0,0,0,0.04)] md:p-14"
    >
      <div className="flex flex-col items-center gap-3">
        <h3 className="t-h4">Something went wrong</h3>
        <p className="t-body max-w-[440px] text-dim">{message}</p>
      </div>
      {onReset ? (
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center justify-center rounded-full bg-ink px-8 py-3 text-[16px] font-semibold leading-[1.3] text-white transition-opacity duration-200 hover:opacity-90"
        >
          {ats.resetCta}
        </button>
      ) : null}
    </div>
  );
}

export default AtsErrorState;
