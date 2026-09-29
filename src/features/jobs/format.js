const PLATFORM_LABELS = {
  linkedin: "LinkedIn",
  linkedin_post: "LinkedIn post",
  indeed: "Indeed",
  naukri: "Naukri",
  instahyre: "Instahyre",
  foundit: "Foundit",
  wellfound: "Wellfound",
  monster: "Monster",
  hiredue: "HireDue jobs",
};

/*
 * Job portals shown under their own name. Everything else is an ATS HireDue
 * crawls itself (Greenhouse, Workday, Lever, …) and is shown as "HireDue jobs".
 * Must match AGGREGATOR_PLATFORMS in the backend's jobBoard.action.ts.
 */
export const AGGREGATORS = ["linkedin", "naukri", "instahyre", "foundit", "wellfound", "indeed", "monster"];

/** A job's source as the page groups it: an aggregator's name, "linkedin_post", or "hiredue". */
export function sourceOf(platformName) {
  if (platformName === "linkedin_post" || AGGREGATORS.includes(platformName)) return platformName;
  return "hiredue";
}

/**
 * Per-platform counts → per-source counts, with every ATS summed into one
 * "hiredue" entry. The backend already groups this way; doing it here too keeps
 * the page right against an older backend that still lists each ATS.
 */
export function groupSources(platforms = []) {
  const totals = new Map();
  for (const { name, count } of platforms) {
    const source = sourceOf(name);
    totals.set(source, (totals.get(source) ?? 0) + count);
  }
  return [...totals].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
}

export function platformLabel(name) {
  if (!name) return "";
  return PLATFORM_LABELS[name] ?? PLATFORM_LABELS[sourceOf(name)];
}

const DAY = 24 * 60 * 60 * 1000;

/** "Today", "3 days ago", "2 weeks ago" … */
export function timeAgo(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  const days = Math.floor((Date.now() - date.getTime()) / DAY);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) {
    const weeks = Math.floor(days / 7);
    return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
  }
  const months = Math.floor(days / 30);
  return months <= 1 ? "1 month ago" : `${months} months ago`;
}

/** Postings from an ATS carry a real publish date; portal scrapes only have when we saw them. */
export function postedLabel(job) {
  return timeAgo(job.postedAt ?? job.lastSeenAt);
}

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

/** "24 Mar 2026" — the posting date when the ATS gave one, otherwise when it was last seen. */
export function postedDate(job) {
  const date = new Date(job.postedAt ?? job.lastSeenAt);
  return Number.isNaN(date.getTime()) ? null : dateFormat.format(date);
}

/** Experience buckets from the API (job_board.experience_level), in ladder order. */
export const EXPERIENCE_LEVELS = [
  { value: "fresher", label: "Fresher", range: "0–1 yrs" },
  { value: "junior", label: "Junior", range: "1–3 yrs" },
  { value: "mid", label: "Mid-level", range: "3–6 yrs" },
  { value: "senior", label: "Senior", range: "6–10 yrs" },
  { value: "lead", label: "Lead & above", range: "10+ yrs" },
];

/**
 * "2–4 yrs" / "5+ yrs" when the posting states it, otherwise the bucket name
 * (read from the title, or from the experience of the users who found the job).
 */
export function experienceLabel(job) {
  const min = job.experienceMinYears;
  const max = job.experienceMaxYears;
  if (min != null && max != null) return min === max ? `${min} yrs` : `${min}–${max} yrs`;
  if (min != null) return `${min}+ yrs`;
  return EXPERIENCE_LEVELS.find((level) => level.value === job.experienceLevel)?.label ?? null;
}

const ACRONYMS = new Set(["ai", "ml", "ui", "ux", "qa", "hr", "it", "bi", "sde", "sdet", "seo", "sql", "aws", "gcp", "erp", "sap", "crm", "vp", "ceo", "cto", "cfo", "pm"]);

const SPECIAL_CASE = { devops: "DevOps", fullstack: "FullStack", javascript: "JavaScript", nodejs: "Node.js", ios: "iOS" };

/** Roles arrive normalised ("sr. data analyst"); show them as titles ("Sr. Data Analyst"). */
export function roleLabel(role) {
  return role
    .split(" ")
    .map((word) => {
      const bare = word.replace(/\W/g, "");
      if (SPECIAL_CASE[bare]) return SPECIAL_CASE[bare];
      if (ACRONYMS.has(bare)) return word.toUpperCase();
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

export function workModeOf(job) {
  const text = `${job.location ?? ""} ${job.jobTitle ?? ""}`;
  if (/\bhybrid\b/i.test(text)) return "Hybrid";
  if (/\b(remote|work from home|wfh|anywhere)\b/i.test(text)) return "Remote";
  return job.location ? "On-site" : null;
}
