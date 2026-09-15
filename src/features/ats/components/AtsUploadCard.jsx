"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { Eyebrow, Reveal } from "@/components/site/ui/Primitives";
import { ats } from "@/lib/content";
import { ACCEPTED_RESUME_EXTENSIONS } from "../domain/validation.js";

/**
 * Handles the *presentation and interaction* of selecting a resume file:
 * drag-and-drop, file picker, validation affordance, accessibility and a
 * selected-file summary. It never performs the upload or any scoring — the
 * actual upload is delegated upward to the workflow hook via `onSelect`.
 */

const INPUT_ACCEPT = ACCEPTED_RESUME_EXTENSIONS.join(",");

function formatSize(bytes) {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function AtsUploadCard({ onSelect, disabled = false }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [selected, setSelected] = useState(null);
  const [localError, setLocalError] = useState(null);

  const handleFiles = useCallback(
    (fileList) => {
      const candidate = fileList && fileList[0];
      if (!candidate || disabled) return;

      // Validation lives in the domain layer; the card only surfaces the result.
      const accepted = onSelect(candidate);
      if (accepted === false) {
        setLocalError(ats.errorStates.unsupportedFile);
        return;
      }
      setSelected(candidate);
      setLocalError(null);
    },
    [onSelect, disabled],
  );

  const handleDrop = useCallback(
    (event) => {
      event.preventDefault();
      setDragOver(false);
      handleFiles(event.dataTransfer?.files);
    },
    [handleFiles],
  );

  const handleRemove = useCallback(() => {
    setSelected(null);
    setLocalError(null);
    if (inputRef.current) inputRef.current.value = "";
  }, []);

  return (
    <Reveal id="scan" className="rounded-[24px] bg-surface p-10 md:p-12">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Eyebrow>Upload</Eyebrow>
          <h3 className="t-h4">{ats.upload.title}</h3>
          <p className="t-body text-dim">{ats.upload.description}</p>
        </div>

        <div
          role="button"
          tabIndex={0}
          aria-label={ats.upload.pickerLabel}
          onClick={() => !disabled && inputRef.current?.click()}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              inputRef.current?.click();
            }
          }}
          onDragOver={(event) => {
            event.preventDefault();
            if (!disabled) setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={[
            "flex min-h-[220px] cursor-pointer flex-col items-center justify-center gap-4 rounded-[16px] border-2 border-dashed p-8 text-center transition-colors",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand",
            dragOver
              ? "border-brand bg-white"
              : "border-line bg-white/60 hover:border-brand/50",
          ].join(" ")}
        >
          <span className="grid size-12 place-items-center rounded-full bg-white text-brand">
            <Upload aria-hidden className="size-6" />
          </span>
          <span className="t-body font-semibold">{ats.upload.dragText}</span>
          <span className="text-[13px] text-dim">{ats.upload.browseLabel}</span>
          <span className="text-[12px] tracking-wide text-dim">
            {ats.upload.formats.join(" · ")} · {ats.upload.description}
          </span>
        </div>

        <input
          ref={inputRef}
          type="file"
          className="sr-only"
          accept={INPUT_ACCEPT}
          aria-hidden
          tabIndex={-1}
          onChange={(event) => handleFiles(event.target.files)}
        />

        {localError ? (
          <p role="alert" className="t-body text-red-600">
            {localError}
          </p>
        ) : null}

        {selected ? (
          <div className="flex items-center justify-between gap-4 rounded-[12px] bg-white p-4">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-[8px] bg-surface text-ink">
                <Upload aria-hidden className="size-4" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-[15px] font-semibold text-ink">
                  {selected.name}
                </p>
                <p className="text-[12px] text-dim">
                  {formatSize(selected.size)}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              aria-label={ats.upload.removeLabel}
              className="grid size-8 shrink-0 cursor-pointer place-items-center rounded-full text-dim transition-colors hover:bg-surface hover:text-ink"
            >
              <X aria-hidden className="size-4" />
            </button>
          </div>
        ) : null}
      </div>
    </Reveal>
  );
}

export default AtsUploadCard;