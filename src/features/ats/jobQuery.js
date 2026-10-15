/*
 * Turns a resume into a search on the existing job board: the board's own
 * role facets the resume mentions, then the skills it lists, as keyword chips.
 * The board ORs chips and ranks by best match, so a handful of specific terms
 * finds the closest listings. No new search: the result is a /jobs query.
 */

import { joinKeywords, MAX_KEYWORD_LENGTH } from "@/features/jobs/filters.js";
import { mentions } from "./coverage.js";
import { readResume, skillItems } from "./resumeText.js";

export const MAX_ROLE_TERMS = 2;
export const MAX_TERMS = 6;

/**
 * @param {string} text  the resume
 * @param {{name: string}[]} [roles]  the board's role facets (GET job-board/filters)
 * @returns {string[]} keyword chips, most telling first
 */
export function resumeKeywords(text, roles = []) {
  const { sections, bullets } = readResume(text);
  // Roles named in the work history count first, then anywhere on the resume.
  const where = [sections.experience?.text, sections.summary?.text, text].filter(Boolean);
  const roleTerms = [];
  for (const scope of where) {
    for (const role of roles) {
      const name = String(role?.name ?? "").trim();
      if (name && !roleTerms.includes(name) && mentions(scope, name)) roleTerms.push(name);
      if (roleTerms.length >= MAX_ROLE_TERMS) break;
    }
    if (roleTerms.length >= MAX_ROLE_TERMS) break;
  }

  // Skills the work itself shows come before ones only listed.
  const work = bullets.map((b) => b.text).join("\n");
  const skills = skillItems(sections.skills?.text)
    .filter((skill) => skill.length <= MAX_KEYWORD_LENGTH)
    .map((skill, index) => ({ skill, index, used: mentions(work, skill) }))
    .sort((a, b) => Number(b.used) - Number(a.used) || a.index - b.index)
    .map((s) => s.skill);

  const terms = [];
  for (const term of [...roleTerms, ...skills]) {
    const clean = term.replace(/"/g, "").trim();
    if (clean && !terms.some((t) => t.toLowerCase() === clean.toLowerCase())) terms.push(clean);
    if (terms.length >= MAX_TERMS) break;
  }
  return terms;
}

/** Chips → the `q` the board's API and URL take. */
export function keywordsToQuery(terms) {
  return joinKeywords(terms);
}
