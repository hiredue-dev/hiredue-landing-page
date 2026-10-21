/*
 * Which way a visitor goes from a job: install the desktop app, or apply on
 * the web. The app only has Mac and Windows builds, so phones, tablets, Linux
 * and ChromeOS cannot take the install path and see a single Apply button.
 *
 * Also carries the button a signed-out visitor pressed across the Google
 * sign-in round trip. Google leaves the site and returns through
 * /cognito-callback, so the choice lives in sessionStorage (this tab only,
 * gone when it closes) the way the ATS checker keeps its pending action.
 */

export const INTENT_KEY = "hd_job_intent";
export const INTENT_TTL_MS = 30 * 60 * 1000;
export const INTENTS = ["install", "apply"];

/**
 * @param {string} userAgent
 * @param {number} [touchPoints] navigator.maxTouchPoints: iPadOS 13+ calls itself a Mac, and the touch count is what gives it away.
 */
export function canInstall(userAgent, touchPoints = 0) {
  const ua = userAgent || "";
  if (/iPhone|iPad|iPod|Android|Mobile|CrOS/i.test(ua)) return false;
  if (/Macintosh/i.test(ua)) return touchPoints <= 1;
  return /Windows NT/i.test(ua);
}

const storage = () => {
  try {
    return typeof window === "undefined" ? null : window.sessionStorage;
  } catch {
    return null; // storage blocked (privacy mode): the in-dialog sign-up still works, only the Google round trip loses the choice
  }
};

/** @param {{intent: "install"|"apply", jobId: string}} choice */
export function saveIntent({ intent, jobId }, now = Date.now()) {
  const store = storage();
  if (!store || !INTENTS.includes(intent) || !jobId) return false;
  try {
    store.setItem(INTENT_KEY, JSON.stringify({ v: 1, intent, jobId: String(jobId), savedAt: now }));
    return true;
  } catch {
    return false;
  }
}

/** The saved choice, or null when there is none, it is stale or unreadable (and then it is removed). */
export function loadIntent(now = Date.now()) {
  const store = storage();
  const raw = store?.getItem(INTENT_KEY);
  if (!raw) return null;
  try {
    const saved = JSON.parse(raw);
    const fresh = saved?.v === 1 && now - saved.savedAt >= 0 && now - saved.savedAt <= INTENT_TTL_MS;
    if (fresh && INTENTS.includes(saved.intent) && typeof saved.jobId === "string" && saved.jobId) {
      return { intent: saved.intent, jobId: saved.jobId };
    }
  } catch {
    // fall through
  }
  store.removeItem(INTENT_KEY);
  return null;
}

export function clearIntent() {
  storage()?.removeItem(INTENT_KEY);
}
