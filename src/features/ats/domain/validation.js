/**
 * Supported resume file extensions (case-insensitive).
 *
 * The approved product requirement is PDF · DOCX · TXT, so this upload path is
 * designed for all three. The current ATS backend snapshot is still PDF-only
 * (docs/ats-api-contract.md §9), so we keep the backend boundary a single,
 * easy-to-update pin — `resumeMimeType()` — rather than hardcoding formats
 * across the UI. That way accepting DOCX/TXT on the backend becomes a one-line
 * change (see `atsService.js` → `uploadPdfToS3`).
 */
export const ACCEPTED_RESUME_EXTENSIONS = [".pdf", ".docx", ".txt"];

/**
 * MIME type sent on the pre-signed S3 PUT for each accepted extension.
 *
 * This is the ONLY place that maps a staged resume to its S3 `Content-Type`.
 * The backend currently presigns for `application/pdf`; when the backend is
 * corrected to accept DOCX/TXT, this map is already what the PUT uses, so the
 * UI remains correct with no further copy/validation churn.
 */
export const RESUME_MIME_BY_EXTENSION = {
  ".pdf": "application/pdf",
  ".docx":
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".txt": "text/plain",
};

/**
 * Resolve the S3 `Content-Type` for a staged resume file based on its
 * extension. Falls back to `application/pdf` for anything unexpected so the
 * PUT never sends an empty/omitted type.
 *
 * @param {File|undefined|null} file
 * @returns {string}
 */
export function resumeMimeType(file) {
  const name = (file?.name || "").toLowerCase();
  const dot = name.lastIndexOf(".");
  const ext = dot >= 0 ? name.slice(dot) : "";
  return RESUME_MIME_BY_EXTENSION[ext] || "application/pdf";
}

/** Default max upload size in bytes (10 MB), matching content copy. */
export const DEFAULT_RESUME_MAX_SIZE_BYTES = 10 * 1024 * 1024;

/**
 * Validate a candidate resume file before it is handed to the service layer.
 * Pure function — no I/O, no React, no network. It only inspects the local file
 * so the component/hook can give immediate, predictable feedback.
 *
 * @param {File|undefined|null} file
 * @param {{maxSizeBytes?: number, extensions?: string[]}} [options]
 * @returns {{ ok: true, file: File } | { ok: false, code: string }}
 *   `code` is a machine-readable key mapped to user-facing copy by the caller.
 */
export function validateResumeFile(file, options = {}) {
  const maxSizeBytes = options.maxSizeBytes ?? DEFAULT_RESUME_MAX_SIZE_BYTES;
  const extensions = options.extensions ?? ACCEPTED_RESUME_EXTENSIONS;

  if (!file) {
    return { ok: false, code: "noFile" };
  }

  if (file.size > maxSizeBytes) {
    return { ok: false, code: "fileTooLarge" };
  }

  const name = file.name.toLowerCase();
  const isAccepted = extensions.some((ext) => name.endsWith(ext));

  if (!isAccepted) {
    return { ok: false, code: "unsupportedFile" };
  }

  return { ok: true, file };
}