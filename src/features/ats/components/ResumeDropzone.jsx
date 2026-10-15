"use client";

import { useEffect, useId, useRef, useState } from "react";
import { FileUp, Loader2, ShieldCheck } from "lucide-react";
import clsx from "clsx";
import { FormError } from "@/features/jobs/components/AccountFlow.jsx";
import { primaryButton } from "@/features/jobs/components/ui.jsx";
import { ACCEPT } from "../extract.js";

/**
 * Drag a file onto it or use the button. The whole area is the drop target;
 * the button is the keyboard and screen-reader path.
 */
export function ResumeDropzone({ parsing, error, onFile, privacyNote, autoFocus = false }) {
  const inputRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    if (autoFocus) buttonRef.current?.focus();
  }, [autoFocus]);
  const hintId = useId();
  const [dragging, setDragging] = useState(false);

  const take = (files) => {
    const file = files?.[0];
    if (file) onFile(file);
  };

  return (
    <div className="flex flex-col gap-4">
      <div
        onDragEnter={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setDragging(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          if (!parsing) take(event.dataTransfer.files);
        }}
        className={clsx(
          "flex flex-col items-center gap-5 rounded-[20px] border-[1.5px] border-dashed px-6 py-12 text-center transition-colors duration-200 sm:py-16",
          dragging ? "border-brand bg-ice" : "border-line bg-white",
        )}
      >
        <span className="grid size-14 place-items-center rounded-full bg-ice text-brand">
          {parsing ? <Loader2 size={24} className="animate-spin" aria-hidden /> : <FileUp size={24} aria-hidden />}
        </span>
        <div className="flex flex-col gap-1.5" aria-live="polite">
          <p className="t-h5">{parsing ? "Reading your resume…" : dragging ? "Drop it here" : "Drop your resume here"}</p>
          <p id={hintId} className="t-body">
            PDF or DOCX, up to 5 MB.
          </p>
        </div>
        <button
          ref={buttonRef}
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={parsing}
          aria-describedby={hintId}
          className={clsx(primaryButton, "h-12 px-7 text-[15px]")}
        >
          {parsing ? "Scoring…" : "Choose a file"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          className="sr-only"
          tabIndex={-1}
          aria-hidden
          onChange={(event) => {
            take(event.target.files);
            // The same file picked twice (after an error) should still fire.
            event.target.value = "";
          }}
        />
        <p className="flex items-center gap-1.5 text-[13px] font-medium text-dim">
          <ShieldCheck size={15} className="shrink-0 text-success" aria-hidden />
          {privacyNote}
        </p>
      </div>
      <div role="alert">{error && <FormError>{error.message}</FormError>}</div>
    </div>
  );
}
