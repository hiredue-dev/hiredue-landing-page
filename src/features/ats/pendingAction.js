/*
 * Carries an anonymous visitor's resume and the action they clicked across the
 * sign-in. Email log-in and sign-up happen in a dialog, so the page stays put;
 * Google sign-in leaves the site and comes back through /cognito-callback, so
 * the state lives in sessionStorage (this tab only, gone when it closes, the
 * same place the Google flow keeps its own PKCE state).
 *
 * The file itself isn't kept, only its extracted text: the score is
 * recomputed from it, and it's what optimise and tailor send.
 */

export const PENDING_KEY = "hd_ats_pending";
export const PENDING_TTL_MS = 30 * 60 * 1000;
export const ACTIONS = ["optimize", "tailor"];

/** Where sign-in returns to: the checker page, flagged to resume. */
export const RETURN_PATH = "/ats-checker?ats=resume";

const storage = () => {
  try {
    return typeof window === "undefined" ? null : window.sessionStorage;
  } catch {
    return null; // storage blocked (privacy mode): the dialog path still works
  }
};

/**
 * @param {{action: "optimize"|"tailor", fileName: string, text: string, job?: {title: string, company: string, description: string}}} pending
 * @returns {boolean} whether it was saved
 */
export function savePending({ action, fileName, text, job }, now = Date.now()) {
  const store = storage();
  if (!store || !ACTIONS.includes(action) || !text) return false;
  try {
    store.setItem(PENDING_KEY, JSON.stringify({ v: 1, action, fileName: fileName ?? "", text, job: job ?? null, savedAt: now }));
    return true;
  } catch {
    return false; // quota
  }
}

/** The saved action, or null when there's none, it's stale or it's unreadable (and then it's removed). */
export function loadPending(now = Date.now()) {
  const store = storage();
  const raw = store?.getItem(PENDING_KEY);
  if (!raw) return null;
  try {
    const pending = JSON.parse(raw);
    const fresh = pending?.v === 1 && now - pending.savedAt >= 0 && now - pending.savedAt <= PENDING_TTL_MS;
    if (fresh && ACTIONS.includes(pending.action) && typeof pending.text === "string" && pending.text) {
      return {
        action: pending.action,
        fileName: String(pending.fileName ?? ""),
        text: pending.text,
        job: sanitizeJob(pending.job),
      };
    }
  } catch {
    // fall through
  }
  store.removeItem(PENDING_KEY);
  return null;
}

export function clearPending() {
  storage()?.removeItem(PENDING_KEY);
}

/** True on the page load sign-in returned to. */
export function isReturnFromAuth(search) {
  return new URLSearchParams(search).get("ats") === "resume";
}

function sanitizeJob(job) {
  if (!job || typeof job !== "object") return null;
  return {
    title: String(job.title ?? ""),
    company: String(job.company ?? ""),
    description: String(job.description ?? ""),
  };
}
