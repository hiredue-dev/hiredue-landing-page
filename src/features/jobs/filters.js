/*
 * Filters live in the URL, not component state. That makes a filtered view
 * shareable, and it is what carries the visitor back to the same jobs — and
 * the job they clicked Apply on (`?apply=<id>`) — after sign-up.
 */

export const POSTED_WITHIN_OPTIONS = [
  { value: "", label: "Any time" },
  { value: "1", label: "Last 24 hours" },
  { value: "3", label: "Last 3 days" },
  { value: "7", label: "Last 7 days" },
  { value: "14", label: "Last 14 days" },
  { value: "30", label: "Last 30 days" },
];

export const EMPTY_FILTERS = {
  // Which tab: "jobs" (portal/ATS listings) or "posts" (LinkedIn hiring posts).
  source: "jobs",
  q: "",
  location: "",
  platforms: [],
  roles: [],
  experience: [],
  easyApply: false,
  postedWithin: "",
  // Only applies with keywords: the API ranks by best match unless told "recent".
  sort: "relevance",
};

const list = (value) => (value ?? "").split(",").filter(Boolean);

export function readFilters(searchParams) {
  return {
    source: searchParams.get("source") === "posts" ? "posts" : "jobs",
    q: searchParams.get("q") ?? "",
    location: searchParams.get("location") ?? "",
    platforms: list(searchParams.get("platform")),
    roles: list(searchParams.get("role")),
    experience: list(searchParams.get("experience")),
    easyApply: searchParams.get("easyApply") === "1",
    postedWithin: searchParams.get("postedWithin") ?? "",
    sort: searchParams.get("sort") === "recent" ? "recent" : "relevance",
  };
}

/** Filter values → URL params. Empty values map to null so they get removed. */
export function filtersToParams(filters) {
  return {
    source: filters.source === "posts" ? "posts" : null,
    q: filters.q.trim() || null,
    location: filters.location.trim() || null,
    platform: filters.platforms.length ? filters.platforms.join(",") : null,
    role: filters.roles.length ? filters.roles.join(",") : null,
    experience: filters.experience.length ? filters.experience.join(",") : null,
    easyApply: filters.easyApply ? "1" : null,
    postedWithin: filters.postedWithin || null,
    // Best match is the default with keywords, so only "recent" needs saying.
    sort: filters.sort === "recent" && filters.q.trim() ? "recent" : null,
  };
}

/** Stable query string for the API; also the key that triggers a reload. */
export function filtersToQuery(filters) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filtersToParams(filters))) {
    if (value) params.set(key, value);
  }
  return params.toString();
}

/** The tab isn't a filter: switching tabs shouldn't light up "Reset filters". */
export function hasActiveFilters(filters) {
  return filtersToQuery({ ...filters, source: "jobs" }) !== "";
}

/*
 * The search bar holds keywords as chips. The API takes one `q` in Postgres
 * websearch syntax, where "a b or c" means (a AND b) OR c — so each chip keeps
 * its words together and the chips are OR'd. Parsing splits on the same " or ".
 */
export const MAX_KEYWORDS = 8;
export const MAX_KEYWORD_LENGTH = 40;

export function parseKeywords(q) {
  return q
    .split(/\s+or\s+/i)
    .map((keyword) => keyword.replace(/"/g, "").trim())
    .filter(Boolean);
}

export function joinKeywords(keywords) {
  return keywords
    .map((keyword) => keyword.replace(/"/g, "").trim())
    .filter(Boolean)
    .join(" or ");
}
