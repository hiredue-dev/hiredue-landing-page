/**
 * Report-shape guards and selectors for the deterministic ATS report returned by
 * the backend. The backend is the sole authority for the numerical score; this
 * module only *reads* a received report to present it safely. Everything here is
 * a pure function so it can be unit-tested independently.
 *
 * Expected shape (stable contract, see implementation plan §4.4 / POC §8):
 *
 *   ATSReport
 *   ├── scoringVersion (string)
 *   ├── finalScore     (number 0-100)
 *   ├── verdict        (string)
 *   ├── categoryScores (array of { id, label, score, earned, points, detail })
 *   ├── ruleBreakdown  (array of { id, category, earned, points, detail })
 *   ├── keywords       (array of { keyword, matched, category })
 *   ├── suggestions    (array of { title, detail })
 *   └── inputFingerprint (string)
 *
 * The exact field names may evolve against the real backend; any change is
 * contained here and in the service layer, not spread through components.
 */

const isNonEmptyArray = (value) => Array.isArray(value) && value.length > 0;

/** A report is structurally usable if it exposes the essentials. */
export function isValidReport(report) {
  if (!report || typeof report !== "object") return false;
  if (report.scoringVersion == null) return false;
  if (typeof report.finalScore !== "number") return false;
  if (Number.isNaN(report.finalScore)) return false;
  return true;
}

/** The scoring version that produced the report, if present. */
export function getScoringVersion(report) {
  if (!report || report.scoringVersion == null) return null;
  return String(report.scoringVersion);
}

/** Read a 0-100 score, clamped so presentation never sees out-of-range data. */
export function getFinalScore(report) {
  if (!report || typeof report.finalScore !== "number") return 0;
  return Math.min(100, Math.max(0, Math.round(report.finalScore)));
}

export function getVerdict(report) {
  if (!report || !report.verdict) return "";
  return report.verdict;
}

/** Read category sub-scores, returning an empty array when absent. */
export function getCategoryScores(report) {
  if (!isNonEmptyArray(report?.categoryScores)) return [];
  return report.categoryScores;
}

/** Read rule-level explanations, empty when absent. */
export function getRuleBreakdown(report) {
  if (!isNonEmptyArray(report?.ruleBreakdown)) return [];
  return report.ruleBreakdown;
}

/** Read keyword entries (matched/missing), empty when absent. */
export function getKeywords(report) {
  if (!isNonEmptyArray(report?.keywords)) return [];
  return report.keywords;
}

/** Read suggestions, empty when absent. */
export function getSuggestions(report) {
  if (!isNonEmptyArray(report?.suggestions)) return [];
  return report.suggestions;
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