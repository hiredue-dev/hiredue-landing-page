"use client";

import { ats } from "@/lib/content";

/**
 * Predictable error state. It receives a *copy key* (never a raw backend error),
 * maps it to friendly copy, and offers a reset action. Technical/backend errors
 * stay isolated in the service/hook layer and are never surfaced verbatim here.
 */
export function AtsErrorState({ errorKey = "uploadFailed", onReset }) {
  const message =
    ats.errorStates[errorKey] || ats.errorStates.uploadFailed;

  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-6 rounded-[24px] bg-surface p-10 text-center md:p-14"
    >
      <div className="flex flex-col items-center gap-3">
        <h3 className="t-h4">Something went wrong</h3>
        <p className="t-body max-w-[440px] text-dim">{message}</p>
      </div>
      {onReset ? (
        <button
          type="button"
          onClick={onReset}
          className="rounded-full bg-[linear-gradient(110deg,#323232_0%,#000_100%)] px-8 py-3 text-[16px] font-semibold text-white transition-opacity hover:opacity-90"
        >
          {ats.resetCta}
        </button>
      ) : null}
    </div>
  );
}

export default AtsErrorState;