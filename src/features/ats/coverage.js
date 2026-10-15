/*
 * How much of a job's keyword list a resume names, counted the way a
 * keyword-matching ATS reads it: whole words, symbols included. Ported from
 * the desktop app (electron/resumeOptimization/domain/coverage.cjs) so a job
 * match reads the same on the web as it does in HireDue; the only difference
 * is that the web works on the resume's plain text, not its structured record.
 */

const WORD_CHAR = /[a-z0-9+#.]/;

/**
 * A whole-word match that treats symbols as part of the word, so "C++" and
 * "Node.js" count and "Go" inside "Google" does not.
 */
export function mentions(text, term) {
  const haystack = String(text ?? "").toLowerCase();
  const needle = String(term ?? "").trim().toLowerCase();
  if (!needle) return false;
  for (let at = haystack.indexOf(needle); at >= 0; at = haystack.indexOf(needle, at + 1)) {
    const before = haystack[at - 1];
    // "React" on a job and "React.js" / "ReactJS" on a resume are the same framework.
    const end = at + needle.length + ((haystack.slice(at + needle.length).match(/^\.?js(?![a-z0-9+#])/) || [""])[0].length);
    // A trailing full stop ends the sentence: "AWS." matches, ".NET" still needs its dot.
    const after = haystack[end] === "." && !WORD_CHAR.test(haystack[end + 1] ?? "") ? " " : haystack[end];
    if (!(before && WORD_CHAR.test(before)) && !(after && WORD_CHAR.test(after))) return true;
  }
  return false;
}

/**
 * @param {string[]} keywords  the job's keywords, from the gap analysis
 * @param {string} text        the resume's text
 * @returns {{covered: number, total: number, percent: number, keywords: {term: string, covered: boolean}[]}}
 */
export function coverage(keywords, text) {
  const seen = new Set();
  const terms = keywords
    .map((term) => String(term ?? "").trim())
    .filter((term) => term && !seen.has(term.toLowerCase()) && seen.add(term.toLowerCase()));
  // "React & Node.js" is two skills, covered when both are. Only a spaced
  // separator splits, so "CI/CD" stays one term.
  const parts = (term) =>
    term
      .split(/\s+(?:&|\/|and)\s+|,\s*/i)
      .map((part) => part.trim())
      .filter(Boolean);
  const result = terms.map((term) => ({ term, covered: parts(term).every((part) => mentions(text, part)) }));
  const covered = result.filter((k) => k.covered).length;
  return {
    covered,
    total: result.length,
    percent: result.length ? Math.round((covered / result.length) * 100) : 0,
    keywords: result,
  };
}
