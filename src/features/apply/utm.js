/*
 * The tracking a company put on its job link, and the visitor's wish to apply,
 * kept across the sign-in round trip.
 *
 * Companies share links like
 *   https://hiredue.com/apply/<id>?utm_source=linkedin&utm_medium=job_post&utm_campaign=<code>&utm_content=<linkcode>
 * and see in their dashboard which post brought each applicant. Google sign-in
 * leaves the site and comes back through /cognito-callback, and the visitor
 * may wander to /jobs and back before applying, so what the link said is kept
 * in sessionStorage (this tab only, gone when it closes) keyed by job id, the
 * same way the job board keeps its pending action (features/jobs/funnel.js).
 */

export const UTM_KEY_PREFIX = "hd_apply_utm:";
export const INTENT_KEY = "hd_apply_intent";
export const UTM_TTL_MS = 24 * 60 * 60 * 1000;
export const INTENT_TTL_MS = 30 * 60 * 1000;

const FIELDS = ["source", "medium", "campaign", "content"];
// What the backend stores per field; longer values are cut rather than dropped.
const MAX_LEN = 200;

const storage = () => {
  try {
    return typeof window === "undefined" ? null : window.sessionStorage;
  } catch {
    return null; // storage blocked: the link's own query string still carries the UTM through Google sign-in
  }
};

/**
 * The UTM fields in a query string, as the API's `utm` object
 * ({ source, medium, campaign, content }, any may be missing), or null when it has none.
 */
export function parseUtm(search) {
  let params;
  try {
    params = new URLSearchParams(search ?? "");
  } catch {
    return null;
  }
  const utm = {};
  for (const field of FIELDS) {
    const value = (params.get(`utm_${field}`) ?? "").trim().slice(0, MAX_LEN);
    if (value) utm[field] = value;
  }
  return Object.keys(utm).length ? utm : null;
}

const keyFor = (jobId) => `${UTM_KEY_PREFIX}${jobId}`;

export function saveUtm(jobId, utm, now = Date.now()) {
  const store = storage();
  if (!store || !jobId || !utm) return false;
  try {
    store.setItem(keyFor(jobId), JSON.stringify({ v: 1, utm, savedAt: now }));
    return true;
  } catch {
    return false;
  }
}

/** The kept UTM for this job, or null when there is none or it is stale/unreadable (then it is removed). */
export function loadUtm(jobId, now = Date.now()) {
  const store = storage();
  if (!store || !jobId) return null;
  const raw = store.getItem(keyFor(jobId));
  if (!raw) return null;
  try {
    const saved = JSON.parse(raw);
    const age = now - saved?.savedAt;
    if (saved?.v === 1 && age >= 0 && age <= UTM_TTL_MS && saved.utm && typeof saved.utm === "object") {
      const utm = {};
      for (const field of FIELDS) {
        if (typeof saved.utm[field] === "string" && saved.utm[field]) utm[field] = saved.utm[field];
      }
      if (Object.keys(utm).length) return utm;
    }
  } catch {
    // fall through
  }
  store.removeItem(keyFor(jobId));
  return null;
}

export function clearUtm(jobId) {
  if (jobId) storage()?.removeItem(keyFor(jobId));
}

/**
 * Called on page load. A link that carries UTM is the freshest word on where
 * the visitor came from, so it replaces what was kept; a bare URL (the visitor
 * came back from /jobs, or the query was lost on the way) falls back to it.
 * @returns {{source?: string, medium?: string, campaign?: string, content?: string} | null}
 */
export function captureUtm(jobId, search, now = Date.now()) {
  const fromUrl = parseUtm(search);
  if (fromUrl) {
    saveUtm(jobId, fromUrl, now);
    return fromUrl;
  }
  return loadUtm(jobId, now);
}

/** A signed-out visitor pressed Apply; remembered so the form opens when they come back signed in. */
export function saveApplyIntent(jobId, now = Date.now()) {
  const store = storage();
  if (!store || !jobId) return false;
  try {
    store.setItem(INTENT_KEY, JSON.stringify({ v: 1, jobId: String(jobId), savedAt: now }));
    return true;
  } catch {
    return false;
  }
}

/** True (and the intent is used up) when a fresh Apply intent for this job is waiting. */
export function takeApplyIntent(jobId, now = Date.now()) {
  const store = storage();
  const raw = store?.getItem(INTENT_KEY);
  if (!raw) return false;
  store.removeItem(INTENT_KEY);
  try {
    const saved = JSON.parse(raw);
    const age = now - saved?.savedAt;
    return saved?.v === 1 && saved.jobId === String(jobId) && age >= 0 && age <= INTENT_TTL_MS;
  } catch {
    return false;
  }
}

export function clearApplyIntent() {
  storage()?.removeItem(INTENT_KEY);
}
