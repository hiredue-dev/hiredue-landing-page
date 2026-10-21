/*
 * How long a visitor was away on an employer's application page, measured
 * from the click that opened it to the moment our tab is visible again.
 *
 * Kept in sessionStorage: it belongs to this tab, and it dies with the tab,
 * which is the rule "a closed tab stops the clock" with no code for it. A
 * second click replaces the first; only the latest job is ever reported.
 */

export const TIMER_KEY = "hd_apply_timer";
// Under this the person bounced, hit a dead link or only looked; there is no application to talk about.
export const FLOOR_MS = 90 * 1000;
// Above this the exact seconds stop meaning much, so the time is rounded to five minutes.
export const CAP_MS = 35 * 60 * 1000;
// Above this the tab was almost certainly left open, so the number is no longer about the application.
export const CEILING_MS = 3 * 60 * 60 * 1000;

const storage = () => {
  try {
    return typeof window === "undefined" ? null : window.sessionStorage;
  } catch {
    return null;
  }
};

export function startApplyTimer(jobId, now = Date.now()) {
  const store = storage();
  if (!store || !jobId) return false;
  try {
    store.setItem(TIMER_KEY, JSON.stringify({ v: 1, jobId: String(jobId), startedAt: now }));
    return true;
  } catch {
    return false;
  }
}

/** The running timer as {jobId, elapsedMs}, or null when none was started or it is unreadable (and then it is removed). */
export function readApplyTimer(now = Date.now()) {
  const store = storage();
  const raw = store?.getItem(TIMER_KEY);
  if (!raw) return null;
  try {
    const saved = JSON.parse(raw);
    if (saved?.v === 1 && typeof saved.jobId === "string" && saved.jobId && Number.isFinite(saved.startedAt) && now >= saved.startedAt) {
      return { jobId: saved.jobId, elapsedMs: now - saved.startedAt };
    }
  } catch {
    // fall through
  }
  store.removeItem(TIMER_KEY);
  return null;
}

export function clearApplyTimer() {
  storage()?.removeItem(TIMER_KEY);
}

/** What the return screen may say: nothing, the measured time to the second, a rounded time, or the ceiling phrase. */
export function timerVerdict(elapsedMs) {
  if (elapsedMs < FLOOR_MS) return "quiet";
  if (elapsedMs > CEILING_MS) return "capped";
  if (elapsedMs > CAP_MS) return "rounded";
  return "measured";
}

/**
 * The words for the heading. Measured: "8 min 37 s". Rounded: "about 50 minutes" or
 * "about 1 hour 15 minutes", to the nearest five minutes. Capped: "over 3 hours".
 * Every value is the real elapsed time; nothing here is made up.
 */
export function describeElapsed(elapsedMs) {
  const verdict = timerVerdict(elapsedMs);
  if (verdict === "capped") return "over 3 hours";
  if (verdict === "rounded") {
    const minutes = Math.round(elapsedMs / 300_000) * 5;
    const hours = Math.floor(minutes / 60);
    const rest = minutes % 60;
    if (hours === 0) return `about ${minutes} minutes`;
    const h = `${hours} hour${hours === 1 ? "" : "s"}`;
    return rest ? `about ${h} ${rest} minutes` : `about ${h}`;
  }
  return formatElapsed(elapsedMs);
}

/** "8 min 37 s"; whole minutes read as "12 min". For the measured band. */
export function formatElapsed(elapsedMs) {
  const total = Math.round(elapsedMs / 1000);
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  if (minutes === 0) return `${seconds} s`;
  return seconds ? `${minutes} min ${seconds} s` : `${minutes} min`;
}
