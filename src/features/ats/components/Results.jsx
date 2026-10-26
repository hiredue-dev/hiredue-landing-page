"use client";

import { useEffect, useState } from "react";
import { BadgeCheck, Check, Copy, Download, Loader2 } from "lucide-react";
import clsx from "clsx";
import { FormError } from "@/features/jobs/components/AccountFlow.jsx";
import { primaryButton, secondaryButton } from "@/features/jobs/components/ui.jsx";
import { EVENTS, trackEvent } from "@/lib/analytics";
import { downloadPdf, pdfFileName, useResumePdf } from "../hooks/useResumePdf.js";
import { PdfViewer } from "./PdfViewer.jsx";
import { ResumeDiff } from "./ResumeDiff.jsx";

/** Stage checklist while a run is in progress. */
export function Progress({ stages, current }) {
  const at = stages.findIndex((s) => s.id === current);
  return (
    <ol className="flex flex-col gap-3 rounded-[18px] bg-surface p-5" aria-live="polite" aria-busy="true">
      {stages.map((stage, index) => {
        const done = index < at;
        const active = index === at;
        return (
          <li key={stage.id} className={clsx("flex items-center gap-3 text-[15px] font-medium", done || active ? "text-ink" : "text-dim")}>
            <span className="grid size-6 shrink-0 place-items-center">
              {done ? (
                <Check size={18} className="text-success" aria-hidden />
              ) : active ? (
                <Loader2 size={18} className="animate-spin text-brand" aria-hidden />
              ) : (
                <span className="size-2 rounded-full bg-grey/60" aria-hidden />
              )}
            </span>
            {stage.label}
            {active && <span className="sr-only">(in progress)</span>}
          </li>
        );
      })}
      <li className="t-body-sm pl-9">This usually takes 20–60 seconds.</li>
    </ol>
  );
}

export function RunError({ error, onRetry }) {
  return (
    <div role="alert" className="flex flex-col items-start gap-3">
      <FormError>{error.message}</FormError>
      {error.retry && (
        <button type="button" onClick={onRetry} className={secondaryButton}>
          Try again
        </button>
      )}
    </div>
  );
}

/** What changed: the skills added, then each changed line, old against new. */
export function ChangeList({ original, text, changes, refusedCount = 0, droppedCount = 0 }) {
  const skills = changes.filter((c) => c.kind === "added");
  return (
    <div className="flex flex-col gap-5">
      {skills.length > 0 && (
        <div className="flex flex-col gap-2.5">
          <h4 className="text-[15px] font-semibold text-ink">Skills added ({skills.length})</h4>
          <ul className="flex flex-wrap gap-2">
            {skills.map((change) => (
              <li key={change.after} title={change.reason} className="rounded-full bg-success-10 px-3 py-1.5 text-[13px] font-semibold text-success">
                + {change.after}
              </li>
            ))}
          </ul>
        </div>
      )}
      <ResumeDiff before={original} after={text} changes={changes} />
      {refusedCount > 0 && (
        <p className="t-body-sm">
          {refusedCount} suggestion{refusedCount === 1 ? " was" : "s were"} left out because {refusedCount === 1 ? "it" : "they"} would have changed a fact, a number, or added a claim your resume doesn&apos;t back.
        </p>
      )}
      {droppedCount > 0 && (
        <p className="t-body-sm">
          {droppedCount} more change{droppedCount === 1 ? " was" : "s were"} left out because {droppedCount === 1 ? "it" : "they"} would have lowered your ATS score.
        </p>
      )}
    </div>
  );
}

/**
 * The rewritten resume as a PDF: previewed in the page, downloaded as the
 * same file. Copying the text stays for pasting into application forms.
 */
export function ResumePreview({ resume, text, fileName, suffix, label, action, downloadLabel = "Download PDF", onDownload, viewerClassName }) {
  const pdf = useResumePdf(resume);
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);

  useEffect(() => {
    if (!copied) return undefined;
    const id = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(id);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyFailed(false);
      setCopied(true);
    } catch {
      setCopyFailed(true);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => {
            trackEvent(EVENTS.resumePdfDownloaded, { action });
            downloadPdf(pdf.bytes, pdfFileName(fileName, suffix));
            // Same click, so a window the caller opens still counts as asked for by the visitor.
            onDownload?.();
          }}
          disabled={pdf.status !== "ready"}
          className={clsx(primaryButton, "h-11 px-6")}
        >
          {pdf.status === "rendering" ? <Loader2 size={16} className="animate-spin" aria-hidden /> : <Download size={16} aria-hidden />}
          {downloadLabel}
        </button>
        <button type="button" onClick={copy} className={clsx(secondaryButton, "h-11")}>
          {copied ? <Check size={16} className="text-success" aria-hidden /> : <Copy size={16} aria-hidden />}
          {copied ? "Copied" : "Copy text"}
        </button>
      </div>
      <p className="sr-only" aria-live="polite">
        {copied ? "Resume text copied to clipboard" : ""}
      </p>
      {copyFailed && <p className="text-[13px] text-danger">Your browser blocked copying. Use Download PDF instead.</p>}
      {pdf.status === "error" ? (
        <FormError>We couldn&apos;t build the PDF. Copy the text instead, or run it again.</FormError>
      ) : (
        <PdfViewer bytes={pdf.bytes} label={label} frameClassName={viewerClassName} />
      )}
    </div>
  );
}

/**
 * Optimizing or tailoring found nothing that would raise the score: say so,
 * and show the visitor's own resume. The uploaded PDF when we still have it,
 * else (a DOCX, or a page reloaded by sign-in) the same content typeset.
 */
export function UnchangedResult({ title, detail, result, bytes, fileName, action }) {
  return (
    <div className="flex flex-col gap-6">
      <div role="status" className="flex gap-3 rounded-[18px] bg-success-10 p-5">
        <BadgeCheck size={22} className="mt-0.5 shrink-0 text-success" aria-hidden />
        <div className="flex flex-col gap-1">
          <p className="text-[15px] font-semibold text-ink">{title}</p>
          <p className="t-body-sm">{detail}</p>
        </div>
      </div>
      {bytes ? (
        <div className="flex flex-col gap-4">
          <button
            type="button"
            onClick={() => {
              trackEvent(EVENTS.resumePdfDownloaded, { action, unchanged: true });
              downloadPdf(bytes, fileName || "resume.pdf");
            }}
            className={clsx(primaryButton, "h-11 self-start px-6")}
          >
            <Download size={16} aria-hidden />
            Download your resume
          </button>
          <PdfViewer bytes={bytes} label={fileName || "Your resume"} />
        </div>
      ) : (
        <ResumePreview resume={result.resume} text={result.text} fileName={fileName} suffix="original" label="Your resume" action={action} />
      )}
    </div>
  );
}
