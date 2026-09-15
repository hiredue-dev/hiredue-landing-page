"use client";

import { useState } from "react";
import { Reveal } from "@/components/site/ui/Primitives";
import { ats } from "@/lib/content";
import { useAtsScan } from "../hooks/useAtsScan.js";
import { AtsUploadCard } from "./AtsUploadCard.jsx";
import { AtsAuthGate } from "./AtsAuthGate.jsx";
import { AtsLoadingState } from "./AtsLoadingState.jsx";
import { AtsScoreMeter } from "./AtsScoreMeter.jsx";
import { AtsBreakdown } from "./AtsBreakdown.jsx";
import { AtsKeywordReport } from "./AtsKeywordReport.jsx";
import { AtsSuggestions } from "./AtsSuggestions.jsx";
import { AtsHistoryBar } from "./AtsHistoryBar.jsx";
import { AtsErrorState } from "./AtsErrorState.jsx";

/**
 * The stateful workflow host: it owns the scan state machine and routes each
 * phase to the matching presentation component. It is the only place that
 * knows the full sequence — children remain single-purpose:
 *
 *   idle                            → AtsUploadCard
 *   uploading                       → AtsLoadingState
 *   awaitingAuth                    → AtsAuthGate   (the lock, non-negotiable)
 *   scanning                        → AtsLoadingState
 *   result                          → score + report sections
 *   error                           → AtsErrorState (reset = back to idle)
 *
 * The score/report, suggestions, keywords, breakdown and history are only
 * mounted after a valid, authenticated result exists.
 */
export function AtsCheckerWorkflow({ initialMode = "generic" }) {
  const [mode, setMode] = useState(initialMode);
  const {
    isIdle,
    isUploading,
    isAwaitingAuth,
    isScanning,
    hasResult,
    hasError,
    report,
    history,
    errorKey,
    upload,
    reset,
    loadHistory,
  } = useAtsScan({ mode });

  return (
    <section id="scan" className="mt-[120px] md:mt-[160px]">
      <div className="rounded-[24px] bg-surface p-6 md:p-8">
        {isIdle || isUploading ? (
          <>
            <AtsUploadCard
              disabled={isUploading}
              onSelect={(file) => {
                if (upload(file)) return true;
                return false;
              }}
            />
            {isUploading ? (
              <div className="mt-6">
                <AtsLoadingState />
              </div>
            ) : null}
          </>
        ) : null}

        {isAwaitingAuth ? <AtsAuthGate /> : null}

        {isScanning ? <AtsLoadingState /> : null}

        {hasError ? (
          <AtsErrorState errorKey={errorKey} onReset={reset} />
        ) : null}

        {hasResult && report ? (
          <ResultBody report={report} history={history} onSelect={loadHistory} />
        ) : null}
      </div>
    </section>
  );
}

/** Renders the full authenticated result (score, report sections, history). */
function ResultBody({ report, history, onSelect }) {
  return (
    <div className="flex flex-col gap-10">
      <Reveal className="rounded-[24px] bg-white p-10 md:p-14">
        <AtsScoreMeter
          score={report.finalScore}
          verdict={report.verdict}
          scoringVersion={report.scoringVersion}
        />
      </Reveal>

      <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col">
          <AtsBreakdown report={report} />
          <AtsKeywordReport report={report} />
          <AtsSuggestions report={report} />

          <Reveal className="mt-[120px] md:mt-[160px]">
            <p className="t-body max-w-[680px] text-dim">
              {ats.genericDisclaimer}
            </p>
          </Reveal>
        </div>
        <aside className="flex flex-col gap-6 lg:mt-[160px]">
          <AtsHistoryBar history={history} onSelect={onSelect} />
        </aside>
      </div>
    </div>
  );
}

export default AtsCheckerWorkflow;