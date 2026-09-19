"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal } from "@/components/site/ui/Primitives";
import { ats } from "@/lib/content";
import { spring } from "@/lib/motion";
import { useAtsScan } from "../hooks/useAtsScan.js";
import { AtsUploadCard } from "./AtsUploadCard.jsx";
import { AtsAuthGate } from "./AtsAuthGate.jsx";
import { AtsLoadingState } from "./AtsLoadingState.jsx";
import { AtsErrorState } from "./AtsErrorState.jsx";

/**
 * The /ats upload-to-dashboard workflow. Pure presentation — the *which* phase
 * is decided by the hook's state below.
 *
 * The journey is:
 *   upload PDF -> S3 -> auth gate -> process -> RESULT
 * and, the moment a result is ready, the workflow forwards to /ats/dashboard
 * (the results experience). /ats itself never renders the result inline, and it
 * never restores a previously completed result — completed scans are forwarded
 * once and cleared so /ats always shows a fresh upload experience.
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

export function AtsCheckerWorkflow({ className }) {
  const {
    isIdle,
    isUploading,
    isAwaitingAuth,
    isScanning,
    hasResult,
    hasError,
    errorKey,
    upload,
    reset,
  } = useAtsScan();

  const router = useRouter();

  // Field once a result is ready: forward to the dashboard. Completed results
  // are saved by the hook (resultStorage) so the dashboard can render them after
  // the /ats -> /ats/dashboard navigation. The ref keeps StrictMode/side-effect
  // re-runs from scheduling duplicate navigations.
  const forwardedRef = useRef(false);
  useEffect(() => {
    if (!hasResult) {
      forwardedRef.current = false;
      return;
    }
    if (forwardedRef.current) return;
    forwardedRef.current = true;
    router.replace("/ats/dashboard");
  }, [hasResult, router]);

  return (
    <section id="scan" className={className ?? "mt-[120px] md:mt-[160px]"}>
      <AnimatePresence mode="wait" initial={false}>
        {isIdle || isUploading ? (
          <Phase key="upload">
            <AtsUploadCard
              disabled={isUploading}
              onSubmit={({ file, jobDescription }) =>
                upload(file, jobDescription)
              }
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

        {hasResult ? (
          <Phase key="redirect">
            <Reveal
              aria-live="polite"
              role="status"
              className="flex flex-col items-center gap-6 rounded-[24px] border border-line bg-white p-10 text-center md:p-14 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
            >
              <div
                aria-hidden
                className="size-12 animate-spin rounded-full border-4 border-line border-t-brand"
              />
              <h3 className="t-h4">{ats.loading.title}</h3>
              <p className="t-body max-w-[440px] text-dim">
                {ats.dashboard.opening}
              </p>
            </Reveal>
          </Phase>
        ) : null}
      </AnimatePresence>
    </section>
  );
}

export default AtsCheckerWorkflow;
