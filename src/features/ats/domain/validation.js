/**
 * Supported resume file extensions (case-insensitive), as product-specified.
 * These mirror the requirements (C7): PDF, DOCX and TXT.
 */
export const ACCEPTED_RESUME_EXTENSIONS = [".pdf", ".docx", ".txt"];

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