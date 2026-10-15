/*
 * Applies a model's suggested edits to the resume text and refuses the ones the
 * candidate couldn't stand behind, following the desktop app's rules
 * (electron/resumeOptimization/domain/patch.cjs): the quoted line must really
 * be on the resume, a rewrite must change words (not just punctuation), no
 * number may be changed or invented, and an added skill must be named by the
 * job or by the candidate's own record.
 *
 * Ops:
 *   {op: "rewrite_line", before, after, reason}
 *   {op: "add_skill", skill, reason}
 */

import { mentions } from "./coverage.js";
import { isCosmetic, wordDiff } from "./diff.js";
import { BULLET_START, SECTION_LABELS, readResume, wordCount } from "./resumeText.js";

export const MAX_ADDED_SKILLS = 25;
export const MAX_SKILL_WORDS = 4;

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const numbers = (text) => String(text).match(/\d+(?:[.,]\d+)*/g) ?? [];

/**
 * Where `quote` sits in `text`, ignoring how whitespace and line wraps differ
 * (a PDF wraps a bullet over lines; the model quotes it as one).
 * @returns {{start: number, end: number} | null}
 */
export function findQuote(text, quote) {
  const words = String(quote ?? "")
    .replace(BULLET_START, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!words.length) return null;
  const match = new RegExp(words.map(escape).join("\\s+")).exec(text);
  return match ? { start: match.index, end: match.index + match[0].length } : null;
}

/**
 * @param {string} text
 * @param {object[]} ops
 * @param {{jobText?: string}} [context]  the job, when tailoring; skills it names may be added
 * @returns {{text: string, applied: object[], refused: {op: object, reason: string}[], changes: object[]}}
 */
export function applyOps(text, ops, { jobText = "" } = {}) {
  const original = String(text ?? "");
  let current = original;
  const applied = [];
  const refused = [];
  const changes = [];
  const refuse = (op, reason) => refused.push({ op, reason });

  for (const op of Array.isArray(ops) ? ops : []) {
    if (op?.op !== "rewrite_line") continue;
    const before = String(op.before ?? "").trim();
    const after = String(op.after ?? "").replace(BULLET_START, "").replace(/\s+/g, " ").trim();
    if (!before || !after) {
      refuse(op, "empty line");
      continue;
    }
    const at = findQuote(current, before);
    if (!at) {
      refuse(op, "the quoted line is not on the resume");
      continue;
    }
    const found = current.slice(at.start, at.end);
    if (isCosmetic(found, after)) {
      refuse(op, "only punctuation or casing changed");
      continue;
    }
    const was = numbers(found);
    const now = numbers(after);
    if (was.some((n) => !now.includes(n)) || now.some((n) => !was.includes(n))) {
      refuse(op, "it changes or adds a number");
      continue;
    }
    if (wordCount(after) > Math.ceil(wordCount(found) * 1.5) + 6) {
      refuse(op, "the rewrite is much longer than the original");
      continue;
    }
    const section = sectionOf(current, at.start);
    current = current.slice(0, at.start) + after + current.slice(at.end);
    applied.push(op);
    changes.push({
      kind: "reworded",
      section,
      before: found.replace(/\s+/g, " "),
      after,
      reason: String(op.reason ?? ""),
      diff: wordDiff(found.replace(/\s+/g, " "), after),
    });
  }

  // Skills go in last, all at once, so the rewrites above quote the original section.
  const skillsText = readResume(current).sections.skills?.text ?? "";
  const record = original;
  const added = [];
  for (const op of Array.isArray(ops) ? ops : []) {
    if (op?.op !== "add_skill") continue;
    const skill = String(op.skill ?? "").replace(/\s+/g, " ").trim();
    if (!skill) continue;
    if (wordCount(skill) > MAX_SKILL_WORDS) refuse(op, "not a skill name");
    else if (mentions(skillsText, skill) || added.some((s) => s.toLowerCase() === skill.toLowerCase())) refuse(op, "already listed");
    else if (!mentions(jobText, skill) && !mentions(record, skill)) refuse(op, "named by neither the job nor your resume");
    else if (added.length >= MAX_ADDED_SKILLS) refuse(op, "too many skills added");
    else {
      added.push(skill);
      applied.push(op);
      changes.push({ kind: "added", section: SECTION_LABELS.skills, before: "", after: skill, reason: String(op.reason ?? "") });
    }
  }
  if (added.length) current = addSkills(current, added);

  return { text: current, applied, refused, changes };
}

function sectionOf(text, offset) {
  const lineIndex = text.slice(0, offset).split("\n").length - 1;
  const { sections } = readResume(text);
  const hit = Object.entries(sections).find(([, s]) => lineIndex >= s.start && lineIndex < s.end);
  return hit ? SECTION_LABELS[hit[0]] : "Resume";
}

// Onto the end of the skills section's last line, or a new Skills section when
// the resume has none.
function addSkills(text, skills) {
  const { lines, sections } = readResume(text);
  const section = sections.skills;
  if (!section) return `${text.trimEnd()}\n\nSKILLS\n${skills.join(", ")}\n`;
  let last = section.end - 1;
  while (last >= section.start && !lines[last].trim()) last -= 1;
  if (last < section.start) {
    lines.splice(section.start, 0, skills.join(", "));
  } else {
    const line = lines[last].trimEnd();
    lines[last] = `${line}${/[,:]$/.test(line) ? " " : ", "}${skills.join(", ")}`;
  }
  return lines.join("\n");
}
