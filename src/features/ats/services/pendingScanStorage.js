/**
 * Cross-navigation persistence for a pending ATS scan.
 *
 * When a visitor uploads a resume (anonymous) but hasn't authenticated yet, the
 * ATS workflow holds a *pending* scan in local React state inside `useAtsScan`
 * (`status = AWAITING_AUTH` plus the `uploadId` returned by the pre-signed
 * upload initialisation).
 *
 * The Sign Up / Log In actions hand off to the existing `/signup|/login?redirect=/ats`
 * routes. That client-side navigation UNMOUNTS the ATS workflow component — and
 * with it, all of the hook's `useState` values. When the user is redirected back
 * to `/ats`, the hook remounts from scratch, so it can't know a scan was pending.
 *
 * This module bridges that gap using `sessionStorage`: the minimal context needed
 * to resume the upload → process flow is written here before the auth round-trip
 * and restored on remount. It deliberately stores ONLY identifiers/inputs already
 * held by the frontend flow — `uploadId` (the backend token for the final
 * process call) and the source filename for a friendly label. It never stores the
 * resume bytes, and it never invents a new backend mechanism.
 *
 * `sessionStorage` (not `localStorage`) is used so a pending scan is scoped to the
 * current tab and cleared when the session/browser is closed — no stale pending
 * scan "leaks" into a future visit.
 */

const KEY = "hd_pending_ats_scan";

const isBrowser = () => typeof window !== "undefined";

/**
 * Draft shape persisted:
 *   { uploadId: string, fileName?: string }
 *
 * @typedef {{ uploadId?: string|null, fileName?: string }} PendingScanDraft
 */

/** Persist a pending-scan draft across navigation. */
export function savePendingScan(draft) {
  if (!isBrowser()) return;
  if (!draft || draft.uploadId == null) return;
  try {
    sessionStorage.setItem(KEY, JSON.stringify(draft));
  } catch {
    // Storage can be unavailable (private mode, quota). ATS flow still works;
    // we just lose the cross-navigation resume in that edge case.
  }
}

/** Retrieve a persisted pending-scan draft, or null when none is stored. */
export function getPendingScan() {
  if (!isBrowser()) return null;
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.uploadId == null) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

/** Remove any persisted pending-scan draft (e.g. after it completes/resets). */
export function clearPendingScan() {
  if (!isBrowser()) return;
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    // ignore storage errors
  }
}