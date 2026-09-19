"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowButton } from "@/components/site/ui/Button";
import { Eyebrow, Reveal } from "@/components/site/ui/Primitives";
import { PageGround } from "@/components/site/ui/PageGround";
import { ats } from "@/lib/content";
import { isValidReport } from "../domain/report.js";
import { getResult, clearResult } from "../services/resultStorage.js";
import { clearPendingScan } from "../services/pendingScanStorage.js";
import { clearPreviewSource } from "../services/previewSourceStorage.js";
import { AtsScoreSummary } from "./AtsScoreSummary.jsx";
import { AtsFindings } from "./AtsFindings.jsx";
import { AtsWhatWorking } from "./AtsWhatWorking.jsx";
import { AtsResumePreview } from "./AtsResumePreview.jsx";

/**
 * /ats/dashboard — the ATS results experience: a professional two-column
 * "Resume Analysis Workspace":
 *   Header -> compact eyebrow + title + uploaded resume filename (left),
 *             "New Scan" action (right)
 *   Left   -> AtsScoreSummary (headline score + compact key metrics:
 *             Quality / Parse health / Completeness / Content strength),
 *             AtsFindings (What needs attention — real advisories),
 *             AtsWhatWorking (real backend working items). Each sits in a
 *             lightweight surface panel; no heavy marketing-style card rail.
 *   Right  -> the ACTUAL uploaded resume rendered as a document preview (sticky),
 *             clearly labelled "Your Resume"
 * Only real backend data is shown (score, quality, parseHealth, completeness,
 * contentStrength, advisories). No fake metrics, annotations or history. Exact
 * highlights are only drawn from real annotation coordinates — the API does not
 * send them, so none are drawn today.
 */
export function AtsDashboard() {
  const router = useRouter();
  const [result, setResult] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setResult(getResult());
    setHydrated(true);
  }, []);

  const handleNewScan = () => {
    // A new scan starts completely fresh: clear the completed result, any
    // stale pending-scan context and the persisted preview source so a
    // previous run never becomes the active scan.
    clearResult();
    clearPendingScan();
    clearPreviewSource();
    router.push("/ats");
  };

  // Still hydrating — avoid flashing the empty state before the storage read.
  if (!hydrated) {
    return (
      <section className="relative isolate min-h-screen overflow-hidden bg-white">
        {/* Shared HireDue page ground — soft brand wash + corner bloom. */}
        <PageGround />
        <div className="container-page flex min-h-[60vh] items-center justify-center pt-24 md:pt-28">
          <div
            className="size-10 animate-spin rounded-full border-4 border-line border-t-brand"
            aria-hidden
          />
        </div>
      </section>
    );
  }

  const report = result?.report ?? null;
  const fileName = result?.fileName ?? null;
  const preview = result?.preview ?? null;

  // No persisted, usable result -> clean empty state. Never fake data.
  if (!report || !isValidReport(report)) {
    return (
      <section className="relative isolate min-h-screen overflow-hidden bg-white">
        {/* Shared HireDue page ground — soft brand wash + corner bloom. */}
        <PageGround />
        <div className="container-page flex flex-col items-center pt-24 md:pt-28">
          <Reveal className="flex flex-col items-center rounded-[24px] bg-surface p-10 text-center md:p-14">
            <Eyebrow>{ats.dashboard.empty.eyebrow}</Eyebrow>
            <h1 className="t-h3 mt-4 max-w-[20ch]">
              {ats.dashboard.empty.title}
            </h1>
            <p className="t-body mt-4 max-w-[520px] text-dim">
              {ats.dashboard.empty.description}
            </p>
            <div className="mt-8">
              <ArrowButton
                label={ats.dashboard.empty.cta}
                href="/ats"
                tone="primary"
              />
            </div>
          </Reveal>
        </div>
      </section>
    );
  }

  return (
    <AtsDashboardBody
      report={report}
      fileName={fileName}
      preview={preview}
      onNewScan={handleNewScan}
    />
  );
}
/** The fully-loaded dashboard workspace (only reached with a valid report). */
function AtsDashboardBody({ report, fileName, preview, onNewScan }) {
  const score = report.finalScore;
  const capped = Boolean(report.cappedByParseHealth);
  // Future-ready annotation passthrough — always empty today; see report.js.
  const annotations = Array.isArray(report.annotations) ? report.annotations : [];

  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-white">
      {/* Shared HireDue page ground — soft brand wash + corner bloom. */}
      <PageGround />
      {/* Workspace atmosphere — subtle blurred brand shapes depth without
          tinting the status colours. HireDue stays primarily neutral. */}
      <span
        aria-hidden
        className="pointer-events-none absolute -z-10 h-[480px] w-[480px] left-[-200px] top-10 rounded-full bg-[rgba(82,144,244,0.10)] blur"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -z-10 h-[420px] w-[420px] right-[-180px] top-40 rounded-full bg-[rgba(64,106,228,0.08)] blur"
      />

      <div className="container-page pt-24 pb-16 md:pt-28 md:pb-20">
        {/* Header bar — analysis identity (left) + primary action (right).
            Compact: eyebrow label + filename below, action inline. */}
        <div className="flex flex-col gap-4 pb-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-baseline gap-3">
              <span className="hidden text-[11px] font-semibold tracking-[0.14em] text-brand uppercase sm:inline">
                {ats.dashboard.eyebrow}
              </span>
            </div>
            {fileName ? (
              <p className="text-[13px] text-dim">
                <span className="font-medium">{ats.dashboard.fileNameLabel}:</span>{" "}
                <span className="font-semibold text-ink">{fileName}</span>
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onNewScan}
            className="inline-flex w-fit cursor-pointer items-center justify-center rounded-full bg-ink px-5 py-2.5 text-[14px] font-semibold leading-none text-white transition-opacity duration-200 hover:opacity-90 sm:shrink-0"
          >
            {ats.dashboard.primaryCta}
          </button>
        </div>

        {/* Two-column workspace — left report rail + right sticky resume */}
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:gap-9">
          {/* LEFT — compact report: score -> attention -> working */}
          <Reveal
            as="div"
            className="flex min-w-0 flex-col gap-6 lg:gap-7"
          >
            <AtsScoreSummary score={score} capped={capped} report={report} />

            <div className="rounded-2xl border border-line bg-surface/40 p-5 md:p-6">
              <AtsFindings report={report} />
            </div>

            <div className="rounded-2xl border border-line bg-surface/40 p-5 md:p-6">
              <AtsWhatWorking report={report} />
            </div>
          </Reveal>

          {/* RIGHT — the actual uploaded resume (sticky, scrolls internally) */}
          <Reveal
            as="div"
            delay={0.08}
            className="min-w-0 lg:sticky lg:top-28 lg:h-[calc(100vh-7rem)]"
          >
            <AtsResumePreview
              preview={preview}
              fileName={fileName}
              annotations={annotations}
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export default AtsDashboard;
