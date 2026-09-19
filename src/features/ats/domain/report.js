/**
 * Report-shape guards, normalization and selectors for the ATS result returned
 * by the backend. The backend is the sole authority for the numerical score;
 * this module only *reads* a received result to present it safely. Everything
 * here is a pure function so it can be unit-tested independently.
 *
 * FINAL BACKEND SHAPE (docs/ats-api-contract.md — the real API is the source of
 * truth, and nothing here invents fields it does not send):
 *
 *   { headline, quality, cappedByParseHealth, parseHealth,
 *     completeness: { score, items[] }, contentStrength: { score, items[] },
 *     advisories[] }
 *
 * There is NO finalScore/verdict/categoryScores/keywords/jdMatch in the backend
 * response. `normalizeAtsResult` (below) maps the real fields onto the shape the
 * presentation components consume WITHOUT inventing data: it re-labels the true
 * headline score, surfaces the true completeness/content-score as categories,
 * and lists the true advisories as recommendations. `quality`/`parseHealth` are
 * preserved as-is so any component may read them directly.
 *
 * Presentation-consumed shape after normalization:
 *
 *   { finalScore, verdict, quality, parseHealth, cappedByParseHealth,
 *     categoryScores: { id, label, score, detail }[], advisories[] }
 */

const isNonEmptyArray = (value) => Array.isArray(value) && value.length > 0;

/** A result is structurally usable if it exposes the headline score as a number. */
export function isValidReport(report) {
  if (!report || typeof report !== "object") return false;
  if (typeof report.finalScore !== "number") return false;
  if (Number.isNaN(report.finalScore)) return false;
  return true;
}

/** Read the real backend `advisories` list, empty when absent. */
export function getAdvisories(report) {
  if (!isNonEmptyArray(report?.advisories)) return [];
  return report.advisories;
}

/**
 * The four key analysis metrics — Quality, Parse health, Completeness and
 * Content strength — as a stable `{ id, label, score }[]`. `score` is a number
 * or `null` when the backend did not return it, so presentation can degrade
 * gracefully (show a dash) instead of faking a value. All values trace to real
 * backend fields via the already-normalised report.
 */
export function getKeyMetrics(report) {
  if (!report || typeof report !== "object") return [];

  const byId = new Map(
    (Array.isArray(report.categoryScores) ? report.categoryScores : []).map(
      (category) => [category?.id, category?.score],
    ),
  );

  const completeness = toScore(byId.get("completeness"));
  const contentStrength = toScore(byId.get("contentStrength"));

  return [
    { id: "quality", label: "Quality", score: getQualityScore(report) },
    { id: "parseHealth", label: "Parse health", score: getParseHealth(report) },
    { id: "completeness", label: "Completeness", score: completeness },
    {
      id: "contentStrength",
      label: "Content strength",
      score: contentStrength,
    },
  ];
}

/**
 * The engine's own observations, preserved verbatim from `completeness.items`
 * and `contentStrength.items` (de-duplicated). Rendered as-is — never invented,
 * re-scored or relabelled. Returns an empty array when the backend sent none so
 * the caller can show a clean, factual empty state.
 */
export function getWorkingItems(report) {
  if (!report || !Array.isArray(report.workingItems)) return [];
  return report.workingItems.filter(
    (item) => typeof item === "string" && item.trim(),
  );
}

/**
 * Read the quality score (clamped to 0–100), or null when the backend did not
 * send it. Preserved verbatim from the real `quality` field.
 */
export function getQualityScore(report) {
  const value = toScore(report?.quality);
  return value == null ? null : value;
}

/**
 * Read the parse-health score (clamped to 0–100), or null when the backend did
 * not send it. Preserved verbatim from the real `parseHealth` field.
 */
export function getParseHealth(report) {
  const value = toScore(report?.parseHealth);
  return value == null ? null : value;
}

/**
 * Deterministic colour tier for a score, matching the guaranteed UI semantics
 * (UX-4): red < 50, amber 50-74, green >= 75. This maps a *displayed* backend
 * score to a colour; it never computes or recalculates the score itself.
 */
export function getScoreTier(score) {
  if (score < 50) return "low";
  if (score < 75) return "mid";
  return "high";
}

/* ------------------------------------------------------------------ *
 * Normalization of the FINAL backend response shape.
 *
 * The real /api/ats/process returns a flat structure (headline, quality,
 * completeness, contentStrength, advisories). We do NOT invent fields — every
 * output below traces to a real backend field:
 *
 *   finalScore     <- headline (the ATS headline score)
 *   quality        <- quality (kept verbatim)
 *   parseHealth    <- parseHealth (kept verbatim)
 *   cappedByParseHealth <- cappedByParseHealth (kept verbatim)
 *   categoryScores <- completeness.score + contentStrength.score (the two real
 *                     sub-dimensions the API reports)
 *   advisories     <- advisories (kept verbatim, rendered as recommendations)
 *
 * `verdict` is intentionally left empty so the dashboard's score unit
 * (AtsScoreSummary) shows the tier copy (red/amber/green) derived solely from
 * the real headline value.
 * ------------------------------------------------------------------ */

function toScore(value) {
  return typeof value === "number" && !Number.isNaN(value)
    ? Math.min(100, Math.max(0, Math.round(value)))
    : null;
}

/** Flatten an unknown `items` array into one readable paragraph string. */
function stringifyItems(items) {
  return itemsToStrings(items).join(" ");
}

/**
 * Convert an unknown `items` array into a list of clean, de-duplicated strings.
 * Used to surface the engine's per-category observations verbatim (never
 * invented or re-labelled on the client). Handles null, strings, objects and
 * primitives defensively.
 */
function itemsToStrings(items) {
  if (!Array.isArray(items) || items.length === 0) return [];
  const lines = items.map((item) => {
    if (item == null) return "";
    if (typeof item === "string") return item.trim();
    if (typeof item === "object") {
      const raw =
        item.detail ?? item.title ?? item.name ?? item.label ?? item.message;
      if (typeof raw === "string" && raw.trim()) return raw.trim();
      try {
        return JSON.stringify(item);
      } catch {
        return "";
      }
    }
    const s = String(item).trim();
    return s || "";
  });
  return [...new Set(lines.filter(Boolean))];
}

const CATEGORY_LABELS = {
  completeness: "Completeness",
  contentStrength: "Content strength",
};

/**
 * Convert the flat backend result into the shape the presentation components
 * consume. Returns null when the payload is unusable (no valid headline score),
 * so the caller can degrade to an error state instead of rendering a broken UI.
 */
export function normalizeAtsResult(raw) {
  if (!raw || typeof raw !== "object") return null;

  const finalScore = toScore(raw.headline);
  if (finalScore == null) return null;

  const quality = toScore(raw.quality);
  const parseHealth = toScore(raw.parseHealth);

  const categoryScores = [];
  const workingItems = [];
  for (const key of ["completeness", "contentStrength"]) {
    const block = raw[key];
    if (block && typeof block === "object") {
      const score = toScore(block.score);
      // Preserve the engine's per-category observations verbatim for the
      // "What's Working" surface. itemsToStrings de-dupes and flattens item
      // shapes; nothing here is invented or re-labelled.
      workingItems.push(...itemsToStrings(block.items));
      if (score != null) {
        categoryScores.push({
          id: key,
          label: CATEGORY_LABELS[key] || key,
          score,
          detail: stringifyItems(block.items),
        });
      }
    }
  }

  return {
    finalScore,
    quality,
    parseHealth,
    cappedByParseHealth: Boolean(raw.cappedByParseHealth),
    // Leave empty so the score meter derives the colour tier copy from the real
    // headline value. Never synthesise a verdict string.
    verdict: "",
    categoryScores,
    workingItems: [...new Set(workingItems)],
    advisories: Array.isArray(raw.advisories) ? raw.advisories : [],
    // PASSTHROUGH ONLY — annotations come verbatim from the backend when present
    // (future-ready). The current API never sends them, so this stays empty and
    // NO precise highlights are drawn. Nothing here computes coordinates.
    annotations: Array.isArray(raw.annotations) ? raw.annotations : [],
  };
}
