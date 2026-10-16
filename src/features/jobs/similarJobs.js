/*
 * How the return screen finds a few roles like the one just applied to, using
 * the job board's own search. The board ANDs every word in `q`, so the full
 * title of a specific posting usually finds only that posting; the searches
 * widen until a handful come back, newest first.
 */

/** Words that say nothing about the role itself; dropping them keeps the search about the job. */
const FILLER = /\b(senior|junior|lead|staff|principal|intern|trainee|associate|sr|jr|i{1,3}|iv|v|\d+)\b/gi;

export const SIMILAR_COUNT = 3;

/**
 * The searches to try, in order, each with the words it will show over the strip.
 * @param {string} title the applied job's title
 * @returns {Array<{q: string, postedWithin: string, label: string}>}
 */
export function similarSearches(title) {
  const full = (title || "").trim();
  const core = full.replace(FILLER, " ").replace(/[^\p{L}\p{N} ]+/gu, " ").replace(/\s+/g, " ").trim();
  const short = core.split(" ").slice(0, 2).join(" ");
  const searches = [
    { q: full, postedWithin: "1", label: "Posted in the last 24 hours, like this one" },
    { q: core, postedWithin: "7", label: "Posted this week, like this one" },
    { q: short, postedWithin: "7", label: "Posted this week, like this one" },
    { q: short, postedWithin: "", label: "Roles like this one" },
  ];
  // Drop empty and repeated searches, keeping the first label for a query.
  const seen = new Set();
  return searches.filter((s) => {
    const key = `${s.q}|${s.postedWithin}`;
    if (!s.q || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
