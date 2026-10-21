/*
 * Applies a model's suggested edits to the structured resume (structure.js)
 * and refuses the ones the candidate couldn't stand behind, following the
 * desktop app's rules (electron/resumeOptimization/domain/patch.cjs): the line
 * must be one an edit may change, a rewrite must change words (not just
 * punctuation), no number may be changed or invented, and an added skill must
 * be named by the job or by the candidate's own record.
 *
 * Ops:
 *   {op: "rewrite", id, after, reason}   id from editableLines()
 *   {op: "add_skill", skill, group?, reason}
 */

import { mentions } from "./coverage.js";
import { isCosmetic, wordDiff } from "./diff.js";
import { BULLET_START, wordCount } from "./resumeText.js";
import { editableLines, resumeToText } from "./structure.js";

export const MAX_ADDED_SKILLS = 25;
export const MAX_SKILL_WORDS = 4;
const EXTRA_GROUP = "Additional";

const numbers = (text) => String(text).match(/\d+(?:[.,]\d+)*/g) ?? [];

/**
 * @param {object} resume  a structured resume; it is not modified
 * @param {object[]} ops
 * @param {{jobText?: string}} [context]  the job, when tailoring; skills it names may be added
 * @returns {{resume: object, applied: object[], refused: {op: object, reason: string}[], changes: object[]}}
 */
export function applyOps(resume, ops, { jobText = "" } = {}) {
  const next = structuredClone(resume);
  const lines = new Map(editableLines(next).map((line) => [line.id, line]));
  const done = new Set();
  const applied = [];
  const refused = [];
  const changes = [];
  const refuse = (op, reason) => refused.push({ op, reason });
  const all = Array.isArray(ops) ? ops : [];

  for (const op of all) {
    if (op?.op !== "rewrite") continue;
    const line = lines.get(String(op.id ?? ""));
    const after = String(op.after ?? "").replace(BULLET_START, "").replace(/\s+/g, " ").trim();
    if (!line) {
      refuse(op, "not a line that can be changed");
      continue;
    }
    if (done.has(line.id)) {
      refuse(op, "that line was already changed");
      continue;
    }
    if (!after) {
      refuse(op, "empty line");
      continue;
    }
    if (isCosmetic(line.text, after)) {
      refuse(op, "only punctuation or casing changed");
      continue;
    }
    const was = numbers(line.text);
    const now = numbers(after);
    if (was.some((n) => !now.includes(n)) || now.some((n) => !was.includes(n))) {
      refuse(op, "it changes or adds a number");
      continue;
    }
    if (wordCount(after) > Math.ceil(wordCount(line.text) * 1.5) + 6) {
      refuse(op, "the rewrite is much longer than the original");
      continue;
    }
    line.set(after);
    done.add(line.id);
    applied.push(op);
    changes.push({
      kind: "reworded",
      section: line.section,
      where: line.where,
      before: line.text,
      after,
      reason: String(op.reason ?? ""),
      diff: wordDiff(line.text, after),
    });
  }

  const listed = next.skills.flatMap((s) => s.items).join("\n");
  const record = resumeToText(resume);
  const added = [];
  for (const op of all) {
    if (op?.op !== "add_skill") continue;
    const skill = String(op.skill ?? "").replace(/\s+/g, " ").trim();
    if (!skill) continue;
    if (wordCount(skill) > MAX_SKILL_WORDS) refuse(op, "not a skill name");
    else if (mentions(listed, skill) || added.some((s) => s.toLowerCase() === skill.toLowerCase())) refuse(op, "already listed");
    else if (!mentions(jobText, skill) && !mentions(record, skill)) refuse(op, "named by neither the job nor your resume");
    else if (added.length >= MAX_ADDED_SKILLS) refuse(op, "too many skills added");
    else {
      added.push(skill);
      addSkill(next, skill, String(op.group ?? ""));
      applied.push(op);
      changes.push({ kind: "added", section: "Skills", where: "", before: "", after: skill, reason: String(op.reason ?? "") });
    }
  }

  return { resume: next, applied, refused, changes };
}

// Into the group the model named when the resume has it, else the one
// ungrouped list, else an "Additional" group at the end.
function addSkill(resume, skill, group) {
  const named = group.trim().toLowerCase();
  const target =
    (named && resume.skills.find((s) => s.group.toLowerCase() === named)) ||
    (resume.skills.length === 1 && !resume.skills[0].group ? resume.skills[0] : null) ||
    resume.skills.find((s) => s.group === EXTRA_GROUP);
  if (target) target.items.push(skill);
  else resume.skills.push({ group: resume.skills.length ? EXTRA_GROUP : "", items: [skill] });
}
