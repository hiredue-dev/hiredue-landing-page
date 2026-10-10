/**
 * Remembers which campus ambassador's link brought a visitor here, so the
 * signup can be credited to them.
 *
 * Ambassador links look like
 *   https://hiredue.com/?utm_source=amb_K7Q2XM9P&utm_medium=linkedin&utm_campaign=campus_2026&utm_content=R4TD8WQ2HN
 * and are made on the ambassador dashboard. Other UTM traffic is left to GA.
 *
 * Kept in localStorage, not React state, so it survives moving between pages,
 * a refresh, and the Google sign-in round trip through Cognito.
 *
 * First click wins: once a visitor has an unexpired ambassador link stored, a
 * second ambassador's link does not replace it. It lasts 30 days, and is sent
 * once with POST /user (see userService) and then cleared.
 *
 * This only carries what the URL said. The backend checks the format again,
 * and the ambassador dashboard decides whether the link is one it issued.
 */

export const STORAGE_KEY = "hd_attribution";
export const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

const VALUE = /^[A-Za-z0-9_.-]{1,64}$/;
const SOURCE = /^amb_[A-Z0-9]{8}$/;
const CONTENT = /^[A-Z0-9]{10}$/;

function safeStorage() {
  try {
    return typeof window !== "undefined" ? window.localStorage : null;
  } catch {
    // Blocked storage (some privacy modes) throws on access. Attribution is then simply not kept.
    return null;
  }
}

/** The ambassador link in a query string, or null when there is none or it is malformed. */
export function parseAttribution(search) {
  let params;
  try {
    params = new URLSearchParams(search);
  } catch {
    return null;
  }
  const source = params.get("utm_source") ?? "";
  const content = params.get("utm_content") ?? "";
  if (!SOURCE.test(source) || !CONTENT.test(content)) return null;

  const optional = (key) => {
    const value = (params.get(key) ?? "").trim().toLowerCase();
    return VALUE.test(value) ? value : null;
  };
  return {
    utm_source: source,
    utm_medium: optional("utm_medium"),
    utm_campaign: optional("utm_campaign"),
    utm_content: content,
  };
}

/** The stored link, if one is there and still within 30 days. An expired or unreadable one is removed. */
export function readAttribution({
  storage = safeStorage(),
  now = Date.now(),
} = {}) {
  if (!storage) return null;
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const stored = JSON.parse(raw);
    const fresh =
      typeof stored?.capturedAt === "number" &&
      now - stored.capturedAt < MAX_AGE_MS;
    const valid =
      stored?.utm &&
      parseAttribution(new URLSearchParams(stored.utm).toString());
    if (!fresh || !valid) {
      storage.removeItem(STORAGE_KEY);
      return null;
    }
    return valid;
  } catch {
    try {
      storage.removeItem(STORAGE_KEY);
    } catch {
      // Nothing more to do.
    }
    return null;
  }
}

/** Stores the link in `search` unless an unexpired one is already stored. Returns what is stored afterwards. */
export function captureAttribution(
  search,
  { storage = safeStorage(), now = Date.now() } = {},
) {
  const existing = readAttribution({ storage, now });
  if (existing) return existing;

  const found = parseAttribution(search);
  if (!found || !storage) return null;
  try {
    const utm = Object.fromEntries(
      Object.entries(found).filter(([, v]) => v !== null),
    );
    storage.setItem(STORAGE_KEY, JSON.stringify({ utm, capturedAt: now }));
  } catch {
    return null;
  }
  return found;
}

export function clearAttribution({ storage = safeStorage() } = {}) {
  try {
    storage?.removeItem(STORAGE_KEY);
  } catch {
    // Storage went away; nothing to clear.
  }
}
