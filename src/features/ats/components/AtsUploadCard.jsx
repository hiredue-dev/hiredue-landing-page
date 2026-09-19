"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { FileText, Upload, X, AlertCircle } from "lucide-react";
import { Reveal } from "@/components/site/ui/Primitives";
import { ats } from "@/lib/content";
import {
  ACCEPTED_RESUME_EXTENSIONS,
  DEFAULT_RESUME_MAX_SIZE_BYTES,
  validateResumeFile,
} from "../domain/validation.js";

/**
 * Multi-file scan request form:
 *  1. Resume(s) — required. Drag-and-drop / picker stages MULTIPLE files (the
 *     approved product requirement is PDF · DOCX · TXT — validated against
 *     `validateResumeFile`). Each staged file shows its name, type, size and
 *     readiness state, and can be removed individually. Invalid, oversized and
 *     duplicate files are kept in the list with a clear inline badge instead of
 *     silently dropped.
 *  2. Optional Job Description — a textarea below the file list. Never set as
 *     required; a scan runs fine without it. Capture only — the current backend
 *     process call does not yet accept a JD, so it is threaded upward for a
 *     future JD-aware step without changing the API contract today.
 *  3. ONE primary CTA — "Scan My Resume" — enabled when at least one valid
 *     staged resume is present (there is no per-file "scan this one" action).
 *     Because the backend processes one resume per upload, the CTA scans the
 *     first valid staged file; the rest of the listed files stage the workflow
 *     for sequential scanning without competing actions.
 */

const INPUT_ACCEPT = ACCEPTED_RESUME_EXTENSIONS.join(",");
const MAX_SIZE = DEFAULT_RESUME_MAX_SIZE_BYTES;

/** Readable file size — "412 KB", "1.4 MB". */
function formatSize(bytes) {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Uppercased extension including the dot, e.g. ".PDF". */
function formatExt(filename) {
  const dot = filename.lastIndexOf(".");
  return dot >= 0 ? filename.slice(dot).toUpperCase() : "FILE";
}

let nextId = 1;

/** Validate a staged file and return a stable entry shape. */
function classifyFile(file) {
  const validation = validateResumeFile(file, { maxSizeBytes: MAX_SIZE });
  if (validation.ok) return { state: "ready", errorCode: null };
  return { state: "invalid", errorCode: validation.code };
}

export function AtsUploadCard({ onSubmit, disabled = false }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [items, setItems] = useState([]);
  const [jobDescription, setJobDescription] = useState("");
  const [submitHint, setSubmitHint] = useState(null);
  const readyItems = useMemo(
    () => items.filter((item) => item.state === "ready"),
    [items],
  );

  // The backend scans ONE resume per upload; the single CTA scans the first
  // valid staged file. All valid files keep the primary action enabled.
  const scanFile = readyItems[0]?.file ?? null;

  /** True when at least one valid resume is staged and scanning is possible. */
  const canScan = readyItems.length > 0 && !disabled;

  const addFiles = useCallback(
    (fileList) => {
      if (!fileList || fileList.length === 0 || disabled) return;
      const incoming = Array.from(fileList);

      setItems((current) => {
        const additions = incoming.map((file) => {
          const classified = classifyFile(file);
          // Exact-duplicate guard against already-staged files (name + size).
          const isDuplicate = current.some(
            (item) =>
              item.file.name === file.name && item.file.size === file.size,
          );
          return {
            id: nextId++,
            file,
            state: isDuplicate ? "duplicate" : classified.state,
            errorCode: isDuplicate ? "duplicateFile" : classified.errorCode,
          };
        });
        return [...current, ...additions];
      });
    },
    [disabled],
  );

  const handleDrop = useCallback(
    (event) => {
      event.preventDefault();
      setDragOver(false);
      addFiles(event.dataTransfer?.files);
    },
    [addFiles],
  );

  const handleRemove = useCallback((id) => {
    setItems((current) => current.filter((item) => item.id !== id));
    setSubmitHint(null);
  }, []);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      if (!onSubmit) return;
      if (!canScan) {
        // Defensive: the CTA is disabled without at least one valid resume, but
        // a staged list can still contain only invalid files — give feedback.
        setSubmitHint(ats.errorStates.noFile);
        return;
      }
      // The backend processes one resume per upload; scan the first valid staged
      // file. The optional Job Description travels with it (capture only — not
      // sent to the current process endpoint).
      onSubmit({ file: scanFile, jobDescription });
    },
    [canScan, onSubmit, scanFile, jobDescription],
  );

  /** Friendly copy for a rejected entry, or null when it is ready. */
  const errorCopyFor = (item) => {
    if (item.state === "ready") return null;
    if (item.state === "duplicate") return ats.errorStates.duplicateFile;
    return ats.errorStates[item.errorCode] || ats.errorStates.unsupportedFile;
  };

  const emptyState = items.length === 0;
  const fileCountLabel =
    items.length === 1 ? "1 file" : `${items.length} files`;
return (
    <Reveal
      className="rounded-[24px] border border-line bg-white p-7 shadow-[0_1px_3px_rgba(0,0,0,0.04)] md:p-9"
    >
      <form className="flex flex-col gap-7" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1.5">
          <p className="text-[13px] font-semibold tracking-wide text-brand uppercase">
            {ats.upload.eyebrow}
          </p>
          <h3 className="t-h5">{ats.upload.title}</h3>
          <p className="t-body text-dim">{ats.upload.description}</p>
        </div>

        {/* ---- Resume(s) (required) ---- */}
        <div className="flex flex-col gap-4">
          <span className="t-body font-semibold text-ink">
            {ats.upload.fileLabel}
            {readyItems.length > 0 ? (
              <span className="ml-2 rounded-full bg-brand/[0.08] px-2.5 py-0.5 text-[12px] font-semibold text-brand">
                {fileCountLabel}
              </span>
            ) : (
              <span className="ml-1.5 text-[13px] font-medium text-dim">
                {ats.upload.required}
              </span>
            )}
          </span>

          {/* ---- Dropzone ---- */}
          <div
            role="button"
            tabIndex={0}
            aria-label={ats.upload.pickerLabel}
            onClick={() => !disabled && inputRef.current?.click()}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                if (!disabled) inputRef.current?.click();
              }
            }}
            onDragOver={(event) => {
              event.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            aria-disabled={disabled}
            className={[
              "flex flex-col items-center justify-center gap-3.5 rounded-[16px] border-2 border-dashed p-8 text-center transition-colors",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand",
              "cursor-pointer",
              dragOver
                ? "border-brand bg-brand/[0.04]"
                : "border-line bg-surface/50 hover:border-brand/40 hover:bg-surface/80",
            ].join(" ")}
          >
            <span className="grid size-12 place-items-center rounded-full bg-white text-brand shadow-[0_1px_3px_rgba(0,0,0,0.04)] ring-1 ring-line">
              <Upload aria-hidden className="size-5" />
            </span>
            <span className="text-[16px] font-semibold text-ink">
              {ats.upload.dragText}
            </span>
            <span className="text-[14px] text-dim">{ats.upload.browseLabel}</span>
            <span className="mt-1 inline-flex min-h-[44px] items-center justify-center rounded-full bg-ink px-6 text-[15px] font-semibold whitespace-nowrap text-white shadow-[0_8px_16px_-8px_rgba(29,29,29,0.5)]">
              {ats.upload.browseFiles}
            </span>
            <span className="text-[12px] tracking-wide text-dim">
              {ats.upload.formats.join(" · ")} · {ats.upload.sizeNote} ·{" "}
              {ats.upload.formsAllowed}
            </span>
          </div>

          <input
            ref={inputRef}
            type="file"
            multiple
            className="sr-only"
            accept={INPUT_ACCEPT}
            aria-hidden
            tabIndex={-1}
            onChange={(event) => {
              addFiles(event.target.files);
              event.target.value = "";
            }}
          />
{/* ---- Staged file list ---- */}
          {emptyState ? (
            <div className="flex flex-col items-center gap-1.5 rounded-[12px] bg-surface/50 px-4 py-6 text-center">
              <FileText aria-hidden className="size-5 text-dim" />
              <p className="text-[14px] font-semibold text-ink">
                {ats.upload.emptyTitle}
              </p>
              <p className="text-[13px] text-dim">{ats.upload.emptyText}</p>
            </div>
          ) : (
            <ul className="flex flex-col gap-2.5" aria-label="Selected files">
              {items.map((item) => {
                const rejected = item.state !== "ready";
                const errorCopy = errorCopyFor(item);
                return (
                  <li
                    key={item.id}
                    className="rounded-[12px] border border-line bg-surface/60 p-3.5 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={[
                          "grid size-9 shrink-0 place-items-center rounded-[8px]",
                          rejected ? "bg-white text-red-500" : "bg-white text-brand",
                        ].join(" ")}
                      >
                        {rejected ? (
                          <AlertCircle aria-hidden className="size-4" />
                        ) : (
                          <FileText aria-hidden className="size-4" />
                        )}
                      </span>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[15px] font-semibold text-ink">
                          {item.file.name}
                        </p>
                        <p className="text-[12px] text-dim">
                          {formatExt(item.file.name)} · {formatSize(item.file.size)}
                        </p>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        {item.state !== "ready" ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/[0.08] px-3 py-1.5 text-[12px] font-semibold text-red-600">
                            <AlertCircle aria-hidden className="size-3.5" />
                            {item.state === "duplicate"
                              ? ats.upload.duplicateChip
                              : ats.upload.invalidChip}
                          </span>
                        ) : null}

                        <button
                          type="button"
                          onClick={() => handleRemove(item.id)}
                          aria-label={`${ats.upload.removeLabel}: ${item.file.name}`}
                          className="grid size-8 cursor-pointer place-items-center rounded-full text-dim transition-colors hover:bg-white hover:text-ink"
                        >
                          <X aria-hidden className="size-4" />
                        </button>
                      </div>
                    </div>

                    {errorCopy ? (
                      <p
                        role="alert"
                        className="mt-2 text-[12px] leading-[1.45] text-red-600"
                      >
                        {errorCopy}
                      </p>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          )}

          {submitHint ? (
            <p role="alert" className="t-body text-red-600">
              {submitHint}
            </p>
          ) : null}
        </div>

        {/* ---- Optional Job Description (never required) ---- */}
        <div className="flex flex-col gap-4">
          <div className="flex items-baseline gap-2">
            <span className="t-body font-semibold text-ink">
              {ats.upload.jdTitle}
            </span>
            <span className="rounded-full bg-surface px-2.5 py-0.5 text-[12px] font-semibold text-brand">
              {ats.upload.jdOptional}
            </span>
          </div>
          <p className="text-[14px] leading-[1.5] text-dim">
            {ats.upload.jdDescription}
          </p>
          <textarea
            rows={4}
            value={jobDescription}
            onChange={(event) => setJobDescription(event.target.value)}
            disabled={disabled}
            placeholder={ats.upload.jdPlaceholder}
            aria-label={ats.upload.jdTitle}
            className="w-full resize-y rounded-[12px] border border-line bg-white p-4 text-[14px] leading-[1.6] text-ink outline-none transition-colors placeholder:text-dim/70 focus:border-brand focus:ring-2 focus:ring-brand/15 disabled:cursor-not-allowed disabled:opacity-60"
          />
          <p className="text-[12px] leading-[1.5] text-dim">
            {ats.upload.jdHint}
          </p>
        </div>

        {/* ---- Scan CTA ---- */}
        <div className="flex flex-col items-start gap-3">
          <button
            type="submit"
            disabled={!canScan}
            className="inline-flex items-center justify-center rounded-full bg-ink px-9 py-3.5 text-[16px] font-semibold leading-[1.3] text-white shadow-[inset_4px_4px_8px_0_rgba(255,255,255,0.25),inset_-4px_-4px_8px_0_rgba(255,255,255,0.25),0_8px_16px_0_rgba(29,29,29,0.4)] transition-opacity duration-200 hover:opacity-90 disabled:cursor-not-allowed disabled:shadow-none disabled:opacity-40"
          >
            {disabled ? ats.upload.scanningCta : ats.upload.scanCta}
          </button>
          <p className="text-[13px] leading-[1.5] text-dim">
            {ats.upload.scanHelper}
          </p>
        </div>
      </form>
    </Reveal>
  );
}

export default AtsUploadCard;