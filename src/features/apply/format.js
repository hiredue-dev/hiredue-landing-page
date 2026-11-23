/* Display labels for a company job's fields (GET /api/ats/jobs/:id). */

const WORK_MODES = { onsite: "On-site", hybrid: "Hybrid", remote: "Remote" };
const EMPLOYMENT_TYPES = {
  full_time: "Full-time",
  part_time: "Part-time",
  contract: "Contract",
  internship: "Internship",
};

export const workModeLabel = (mode) => WORK_MODES[mode] ?? null;
export const employmentTypeLabel = (type) => EMPLOYMENT_TYPES[type] ?? null;

const years = (n) => `${n} ${n === 1 ? "yr" : "yrs"}`;

/** 4–7 → "4–7 yrs"; 4–null → "4+ yrs"; null–2 → "Up to 2 yrs"; 0–0 → "Fresher". */
export function experienceRangeLabel(min, max) {
  const lo = Number.isInteger(min) ? min : null;
  const hi = Number.isInteger(max) ? max : null;
  if (lo == null && hi == null) return null;
  if (lo === 0 && hi === 0) return "Fresher";
  if (lo != null && hi != null) return lo === hi ? years(lo) : `${lo}–${years(hi)}`;
  if (lo != null) return `${lo}+ yrs`;
  return `Up to ${years(hi)}`;
}

/** The chips under the title, in reading order, blanks dropped. */
export function jobChips(job) {
  if (!job) return [];
  return [
    { key: "location", label: job.location || null },
    { key: "workMode", label: workModeLabel(job.workMode) },
    { key: "employmentType", label: employmentTypeLabel(job.employmentType) },
    { key: "experience", label: experienceRangeLabel(job.experienceMinYears, job.experienceMaxYears) },
    { key: "compensation", label: job.compensation || null },
  ].filter((chip) => chip.label);
}

/** "https://www.acme.com/careers" → "acme.com"; null when it isn't a web URL. */
export function websiteHost(url) {
  try {
    const parsed = new URL(url);
    if (!/^https?:$/.test(parsed.protocol)) return null;
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

/** "<role> at <company>", the page's title. */
export function jobTitleLine(job) {
  if (!job?.title) return "Apply";
  return job.company?.name ? `${job.title} at ${job.company.name}` : job.title;
}
