"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal } from "@/components/site/ui/Primitives";
import { ats } from "@/lib/content";
import { spring } from "@/lib/motion";
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
 * Smoothly swaps between workflow phases with the same critically-damped
 * rise the rest of the landing page uses. Pure presentation — the *which* is
 * still decided by the hook's state below.
 */
function Phase({ children, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={spring(0.5)}
      className={className}
    >
      {children}
    </motion.div>
  );
}

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
        <AnimatePresence mode="wait" initial={false}>
          {isIdle || isUploading ? (
            <Phase key="upload">
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
            </Phase>
          ) : null}

          {isAwaitingAuth ? (
            <Phase key="auth">
              <AtsAuthGate />
            </Phase>
          ) : null}

          {isScanning ? (
            <Phase key="scanning">
              <AtsLoadingState />
            </Phase>
          ) : null}

          {hasError ? (
            <Phase key="error">
              <AtsErrorState errorKey={errorKey} onReset={reset} />
            </Phase>
          ) : null}

          {hasResult && report ? (
            <Phase key="result">
              <ResultBody report={report} history={history} onSelect={loadHistory} />
            </Phase>
          ) : null}
        </AnimatePresence>
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