/*
 * Job board items for jobs companies post on HireDue carry
 * `hiredueApplyPath: "/apply/<id>"` (backend docs/company-jobs.md §6). Their
 * Apply goes to that page instead of the external-link dialog.
 */

/** The board item's HireDue apply page, or null for an ordinary listing (or anything that isn't a same-site /apply/ path). */
export function hiredueApplyPath(job) {
  const path = job?.hiredueApplyPath;
  if (typeof path !== "string") return null;
  return /^\/apply\/[A-Za-z0-9_-]+\/?(\?[^#\s]*)?$/.test(path) ? path : null;
}

/** "/apply/<id>" for a company job id. */
export const applyPathFor = (id) => `/apply/${encodeURIComponent(id)}`;
