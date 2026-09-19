"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Download, ExternalLink, FileText, Minus, Plus, RotateCcw } from "lucide-react";
import { ats } from "@/lib/content";

/**
 * The "Your Resume" panel of the ATS dashboard.
 *
 * It shows the REAL uploaded document — restored from the same-session preview
 * boundary (the exact bytes captured during upload, PDF · DOCX · TXT) and
 * rendered in a fixed panel with its own internal scroll + optional zoom (PDF
 * and plain-text TXT render inline; DOCX/other types offer open/download). The
 * panel is clearly labelled so the user links the analysis on the left to this
 * exact file.
 *
 * Honesty rules (per product direction):
 *   - If a real preview source (Blob) is available, it is rendered. We never
 *     invent a sample resume / illustration.
 *   - If no source is available (backend returns no readable resume URL, and
 *     the local File couldn't be kept), we render a clear, factual
 *     "preview not available" state that still names the exact analyzed file.
 *   - Exact annotation highlights are ONLY drawn when the backend supplies real
 *     coordinates ({ page, start, end }). The current API does not, so today no
 *     highlights are applied and the document stays a faithful, unmarked preview.
 */
export function AtsResumePreview({ preview, fileName, annotations = [] }) {
  // A real Browser Blob/File is required to build an object URL. After the auth
  // round-trip the preview is reconstructed from the base64 preview boundary
  // (see resultStorage.getPreviewSource), so `preview.blob` is either a genuine
  // Blob rebuilt at read time, a `null`/no-bytes marker, or (defensively) a
  // non-Blob value that must never reach `URL.createObjectURL`. We test with
  // `instanceof Blob` — never truthiness — so a serialized stub `{}` can't blow
  // up `createObjectURL` with "Overload resolution failed".
  const hasBlob = Boolean(
    preview && preview.hasBytes && preview.blob instanceof Blob,
  );
  const label = preview?.name || fileName || "Your resume";

  // The panel is designed for the approved PDF · DOCX · TXT requirement. PDF and
  // plain-text TXT render inline in most browsers; DOCX (and anything else) can
  // only be opened/downloaded, so we show a clean state rather than a broken
  // `<object>`. The type comes from the persisted real `file.type`.
  const mimeType = preview?.type || (hasBlob ? preview.blob.type : "");
  const isPdf = hasBlob && (mimeType === "application/pdf" || /\.pdf$/i.test(label));
  const isText = hasBlob && (mimeType === "text/plain" || /\.txt$/i.test(label));
  const canRenderInline = hasBlob && (isPdf || isText);
  // Object-URL `type` fed to an inline renderer (PDF → application/pdf;
  // TXT → text/plain).
  const inlineObjectType = isText ? "text/plain" : "application/pdf";

  const [url, setUrl] = useState(null);
  const [state, setState] = useState("loading"); // 'loading' | 'ready' | 'error'
  const [scale, setScale] = useState(1);
  const iframeRef = useRef(null);

  // Rebuild a blob URL from the persisted bytes. Revoked on cleanup so repeated
  // tabs / remounts don't leak object URLs.
  useEffect(() => {
    let objectUrl = null;
    if (hasBlob && preview.blob instanceof Blob) {
      objectUrl = URL.createObjectURL(preview.blob);
      setUrl(objectUrl);
      setState("loading");
    } else {
      setUrl(null);
      setState("error");
    }
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [hasBlob, preview]);

  const zoom = (factor) =>
    setScale((s) => Math.min(2.5, Math.max(0.6, Math.round(s * factor * 100) / 100)));

  const zoomControls = useMemo(
    () => (
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => zoom(0.85)}
          aria-label={ats.dashboard.resumePreview.zoomOutLabel}
          className="grid size-8 place-items-center rounded-full text-dim transition-colors hover:bg-surface hover:text-ink"
        >
          <Minus aria-hidden className="size-4" />
        </button>
        <span className="min-w-[44px] text-center text-[12px] font-medium tabular-nums text-dim">
          {Math.round(scale * 100)}%
        </span>
        <button
          type="button"
          onClick={() => zoom(1.15)}
          aria-label={ats.dashboard.resumePreview.zoomInLabel}
          className="grid size-8 place-items-center rounded-full text-dim transition-colors hover:bg-surface hover:text-ink"
        >
          <Plus aria-hidden className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => setScale(1)}
          aria-label={ats.dashboard.resumePreview.zoomResetLabel}
          className="grid size-8 place-items-center rounded-full text-dim transition-colors hover:bg-surface hover:text-ink"
        >
          <RotateCcw aria-hidden className="size-4" />
        </button>
      </div>
    ),
    [scale],
  );

  // Preserve the file's real extension so a downloaded DOCX is still a DOCX
  // (never forced to .pdf). Only append an extension when the label has none.
  const downloadName = /\.\w+$/i.test(label) ? label : `${label}.pdf`;

  return (
    <section
      aria-labelledby="ats-resume-preview"
      data-annotations={annotations.length}
      className="flex h-full min-h-[70vh] flex-col rounded-[18px] border border-line bg-white shadow-[0_1px_4px_rgba(15,23,42,0.06)] lg:min-h-0"
    >
      {/* Panel header — clearly labels the reference document */}
      <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-surface text-brand">
            <FileText aria-hidden className="size-4.5" />
          </span>
          <div className="min-w-0">
            <h2 id="ats-resume-preview" className="truncate text-[15px] leading-none font-semibold text-ink">
              {ats.dashboard.resumePreview.title}
            </h2>
            {label ? (
              <p className="mt-1 truncate text-[12px] leading-none text-dim" title={label}>
                {label}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {canRenderInline && url ? zoomControls : null}
          <a
            href={url || "#"}
            download={downloadName}
            aria-disabled={!hasBlob}
            onClick={!hasBlob ? (e) => e.preventDefault() : undefined}
            className={`grid size-8 place-items-center rounded-full transition-colors ${
              hasBlob
                ? "text-dim hover:bg-surface hover:text-ink"
                : "pointer-events-none text-line"
            }`}
            aria-label={ats.dashboard.resumePreview.downloadLabel}
          >
            <Download aria-hidden className="size-4" />
          </a>
          {hasBlob ? (
            <a
              href={url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="grid size-8 place-items-center rounded-full text-dim transition-colors hover:bg-surface hover:text-ink"
              aria-label={ats.dashboard.resumePreview.openLabel}
            >
              <ExternalLink aria-hidden className="size-4" />
            </a>
          ) : null}
        </div>
      </div>

      {/* Panel body — the actual document preview, with internal scroll */}
      <div className="flex-1 overflow-hidden bg-[linear-gradient(180deg,#f3f6f9_0%,#eef2f6_100%)] p-4 md:p-5">
        {/* Inline-renderable (PDF or plain-text TXT) */}
        {hasBlob && url && canRenderInline ? (
          <div className="relative h-full">
            {state === "loading" ? (
              <div className="flex h-full flex-col items-center justify-center gap-3 text-dim">
                <div
                  aria-hidden
                  className="size-8 animate-spin rounded-full border-4 border-line border-t-brand"
                />
                <p className="text-[14px]">{ats.dashboard.resumePreview.loading}</p>
              </div>
            ) : null}
            <div className="h-full overflow-auto">
              {/* Fit-to-width sheet scaled by zoom. Width is 100% of the viewer so
                  at default zoom (scale 1) the PDF page spans the full panel width
                  with no horizontal scroll. Zooming in (scale > 1) grows the sheet
                  beyond the container, which is when horizontal scrolling is
                  intentionally available; transformed bounds are included in the
                  scroll container's overflow, so the edges stay reachable. The
                  A4-ish aspect-ratio keeps the page proportional and vertical
                  scrolling handles tall documents. On browsers without an inline
                  PDF/text viewer the native fallback lets the user still open the
                  real uploaded file. */}
              <div
                className="flex justify-center"
                style={{
                  width: "100%",
                  transform: `scale(${scale})`,
                  transformOrigin: "top center",
                }}
              >
                <div
                  className="w-full overflow-hidden rounded-[8px] bg-white"
                  style={{
                    border: "1px solid #dde5ed",
                    aspectRatio: isText ? undefined : "1 / 1.414",
                    // Plain-text TXT needs a bounded height to render/scroll.
                    minHeight: isText ? "50vh" : undefined,
                  }}
                >
                  <object
                    ref={iframeRef}
                    data={url}
                    type={inlineObjectType}
                    className="block h-full w-full"
                    onLoad={() => setState("ready")}
                    onError={() => setState("error")}
                  >
                    {/* Fallback for browsers without an inline viewer */}
                    <div className="flex h-full w-full flex-col items-center justify-center gap-4 rounded-[8px] bg-white p-8 text-center">
                      <FileText aria-hidden className="size-10 text-brand" />
                      <p className="max-w-[320px] text-[14px] text-dim">
                        Your resume couldn&apos;t be rendered inline here. Open it below to see the
                        exact file that was analyzed.
                      </p>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[14px] font-semibold text-white"
                      >
                        <ExternalLink aria-hidden className="size-4" /> Open resume
                      </a>
                    </div>
                  </object>
                </div>
              </div>
            </div>
          </div>
        ) : hasBlob && url ? (
          /* A real file exists (e.g. DOCX) but can't be drawn inline — honest
             state with download/open actions, never a broken renderer. */
          <div className="flex h-full flex-col items-center justify-center gap-4 rounded-[16px] border border-dashed border-line bg-white/70 p-8 text-center">
            <span className="grid size-12 place-items-center rounded-full bg-surface text-brand">
              <FileText aria-hidden className="size-5" />
            </span>
            <div className="flex flex-col items-center gap-1">
              <h3 className="text-[15px] leading-none font-semibold text-ink">
                {ats.dashboard.resumePreview.inlineUnavailableTitle}
              </h3>
              <p className="max-w-[440px] text-[14px] leading-[1.6] text-dim">
                {ats.dashboard.resumePreview.inlineUnavailable}
              </p>
            </div>
            {label ? (
              <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-[13px] font-medium text-ink">
                <FileText aria-hidden className="size-4 text-brand" />
                <span className="truncate">{label}</span>
              </span>
            ) : null}
            <div className="flex items-center gap-3">
              <a
                href={url}
                download={downloadName}
                className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[14px] font-semibold text-white"
              >
                <Download aria-hidden className="size-4" /> {ats.dashboard.resumePreview.downloadLabel}
              </a>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-5 py-2.5 text-[14px] font-semibold text-ink"
              >
                <ExternalLink aria-hidden className="size-4" /> {ats.dashboard.resumePreview.openLabel}
              </a>
            </div>
          </div>
        ) : (
          /* No real preview source — honest state, never a fake document */
          <div className="flex h-full flex-col items-center justify-center gap-4 rounded-[16px] border border-dashed border-line bg-white/70 p-8 text-center">
            <span className="grid size-12 place-items-center rounded-full bg-surface text-dim">
              <FileText aria-hidden className="size-5" />
            </span>
            <div className="flex flex-col items-center gap-1">
              <h3 className="text-[15px] leading-none font-semibold text-ink">
                {ats.dashboard.resumePreview.unavailableTitle}
              </h3>
              <p className="max-w-[420px] text-[14px] leading-[1.6] text-dim">
                {ats.dashboard.resumePreview.unavailable}
              </p>
              <p className="mt-2 max-w-[420px] text-[13px] leading-[1.6] text-dim">
                {ats.dashboard.resumePreview.unavailableHint}
              </p>
            </div>
            {label ? (
              <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-[13px] font-medium text-ink">
                <FileText aria-hidden className="size-4 text-brand" />
                <span className="truncate">{label}</span>
              </span>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}

export default AtsResumePreview;