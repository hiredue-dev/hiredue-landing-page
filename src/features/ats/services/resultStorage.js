/**
 * Cross-route persistence for a COMPLETED ATS scan result.
 *
 * The ATS result lives in `useAtsScan` as client-side React state. Phase 1 of
 * the redesign splits the experience into two routes: `/ats` (upload/entry)
 * and `/ats/dashboard` (results). Navigating between them UNMOUNTS the workflow
 * component and its hook state, so a freshly processed report would be lost the
 * moment we `router` to the dashboard.
 *
 * This module bridges that gap with `sessionStorage` — it stores the ACTUAL
 * normalised report returned by the backend (/api/ats/process), so the
 * dashboard can render the real result after the navigation. It never
 * fabricates data: only the real, already-normalised report is written here,
 * and it is cleared on a fresh upload and on "New Scan".
 *
 * It is intentionally distinct from `pendingScanStorage.js`:
 *   - pendingScanStorage    -> the anonymous { uploadId, fileName } draft kept
 *                              through the auth round-trip (AWAITING_AUTH).
 *   - previewSourceStorage  -> the uploaded File bytes (same-session preview).
 *   - resultStorage         -> the final, processed result shown on the dashboard.
 *
 * `sessionStorage` (not `localStorage`) scopes the result to the current tab and
 * clears it when the session/browser closes — a completed result never "leaks"
 * into a future visit, and a completed scan is never re-treated as pending.
 */

import { getPreviewSource, clearPreviewSource } from "./previewSourceStorage.js";

const KEY = "hd_ats_result";

const isBrowser = () => typeof window !== "undefined";

/**
 * Persist a completed, normalised ATS report (and the uploaded resume filename
 * captured during the upload flow) across the /ats -> /ats/dashboard
 * navigation. The backend process response does NOT include the filename, so we
 * carry it here from the frontend upload step. Returns the stored value (or
 * null when storage is unavailable).
 *
 * The uploaded resume's same-session preview is intentionally NOT stored here:
 * live Browser `Blob`/`File` values cannot survive `JSON.stringify` (a Blob
 * serialises to `{}`, breaking `URL.createObjectURL` on the dashboard). The
 * preview bytes are persisted separately by `previewSourceStorage` (as base64)
 * and rebuilt into a real Blob by `getPreviewSource()` when `getResult()` reads
 * it back — see `getResult` below. If preview bytes aren't available, the
 * dashboard still works and simply shows an honest "preview not available"
 * state (never a fake document).
 */
export function saveResult(report, fileName) {
  if (!isBrowser()) return null;
  if (!report || typeof report !== "object") return null;

  try {
    const payload = {
      report,
      fileName:
        typeof fileName === "string" && fileName.trim() ? fileName : null,
    };
    sessionStorage.setItem(KEY, JSON.stringify(payload));
    return payload;
  } catch {
    // Storage unavailable (private mode, quota). The dashboard will show its
    // clean empty state rather than a broken result in that edge case.
    return null;
  }
}

/**
 * Retrieve a previously saved completed result as `{ report, fileName, preview }`,
 * or null when none is stored. Tolerates the pre-Phase-2 shape where the whole
 * payload WAS the report (no fileName) so a report is never lost.
 *
 * `preview` is always rebuilt fresh from `previewSourceStorage.getPreviewSource()`
 * (which decodes the persisted base64 bytes back into a real Browser `Blob`).
 * We never trust a `preview` value read back from the serialized result JSON —
 * a Blob stored there would have been destroyed by `JSON.stringify`. If no
 * preview bytes are available this returns `null` / a no-bytes marker and the
 * dashboard shows its honest "preview not available" state.
 */
export function getResult() {
  if (!isBrowser()) return null;
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;

    // Rebuild the same-session preview from the preview-storage boundary (the
    // actual resume bytes) into a real Blob. Best-effort: null when none exist.
    const preview =
      typeof getPreviewSource === "function" ? getPreviewSource() : null;

    // Phase 2 payload: { report, fileName }.
    if (parsed.report && typeof parsed.report === "object") {
      return {
        report: parsed.report,
        fileName:
          typeof parsed.fileName === "string" && parsed.fileName.trim()
            ? parsed.fileName
            : null,
        // Real, freshly-rebuilt preview Blob (never a serialized stub).
        preview,
      };
    }

    // Legacy shape: the whole stored object was the report itself.
    return { report: parsed, fileName: null, preview: null };
  } catch {
    return null;
  }
}

/** Remove any saved completed report (and any persisted preview source). */
export function clearResult() {
  if (!isBrowser()) return;
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    // ignore storage errors
  }
  try {
    clearPreviewSource();
  } catch {
    // ignore storage errors
  }
}
