/*
 * Prompts for optimising and tailoring a resume. Adapted from the desktop app
 * (electron/resumeOptimization/adapters/optimizer.adapter.cjs) with the same
 * rules — keep every fact and number, never invent, quote lines exactly —
 * but over the resume's plain text rather than the app's structured record,
 * so each edit quotes the line it changes and patch.js can verify it.
 */

import { MAX_ADDED_SKILLS, MAX_SKILL_WORDS } from "./patch.js";

const REWRITE_OP =
  '  {"op":"rewrite_line","before":"<the line exactly as it is on the resume>","after":"<the rewritten line>","reason":"<what it now shows>"}';

const lineRules = [
  "  - Quote each line you change exactly, character for character, in before (without its bullet symbol). One op per changed line. Do not list lines you leave alone.",
  "  - A rewritten line keeps every fact, number and name it had and grows by at most a quarter. Never merge two lines, split one, or drop details.",
  "  - Never change a number, employer, title or date, and never invent an achievement or a metric. If a bullet has no number, do not add one.",
  "  - Punctuation or casing edits are refused; every rewrite must change what the line says.",
  "  - Only rewrite descriptive lines (bullets, summary). Never touch the name, contact details, headings, dates, or education lines.",
];

const resumeBlock = (text) => ["THE CANDIDATE'S RESUME (plain text extracted from their file):", text];
const jobBlock = (job) => ["THE JOB:", JSON.stringify(job)];

/** Whole-resume optimisation, no job: stronger bullets, record-backed skills. */
export function optimizePrompt(text, issues) {
  return [
    "TASK: ATS optimisation",
    "You are improving this resume so an applicant tracking system parses it well and a recruiter sees impact at a glance. There is no particular job; improve how the candidate's own work reads.",
    "",
    ...resumeBlock(text),
    "",
    "WHAT AN AUTOMATED CHECK FLAGGED (fix what you can by rewording; ignore what needs new facts):",
    JSON.stringify(issues.map(({ title, detail }) => ({ title, detail }))),
    "",
    "Allowed ops:",
    REWRITE_OP,
    `  {"op":"add_skill","skill":"<a tool or practice the resume's own bullets or projects name>","reason":"<where the resume shows it>"}`,
    "",
    "Rules:",
    "  - Rewrite every bullet that is weak: lead with a strong past-tense action verb, replace duty phrasing (\"responsible for\", \"worked on\", \"helped with\") with what was delivered, drop first-person pronouns, and tighten bullets over 35 words.",
    ...lineRules,
    `  - add_skill only for tools, languages and practices the resume's own text names in its bullets or projects but its skills section does not list; at most ${MAX_ADDED_SKILLS}, each at most ${MAX_SKILL_WORDS} words. Never a skill the resume doesn't mention.`,
    "",
    'Answer with JSON only: {"ops":[...]}',
  ].join("\n");
}

export function analysisPrompt(text, job) {
  return [
    "TASK: gap analysis",
    "You are screening a resume the way an applicant tracking system and a recruiter would for this one job. Find what the resume is missing, not how to reword it.",
    "",
    ...resumeBlock(text),
    "",
    ...jobBlock(job),
    "",
    "Go through the whole job description, section by section: the summary, responsibilities, requirements, nice-to-haves, and any tools or stack named in passing. List every skill, tool, technology, practice and domain term it asks for that an ATS would scan for, most important first, at most 30. Each is one concrete term of one to three words that could appear on a resume (\"Kubernetes\", \"System Design\", \"Agile\"), never a phrase or a description of the role, and never two skills joined by & or /. For each:",
    '  "term": as the job writes it',
    '  "importance": "required" or "preferred"',
    '  "evidence": where the resume shows the work even if it does not name the term, such as "Acme bullet 2", else null',
    "",
    'Answer with JSON only: {"keywords":[{"term":"...","importance":"required","evidence":null}]}',
  ].join("\n");
}

export function missedKeywordsPrompt(job, found) {
  return [
    "TASK: missed keywords",
    "An earlier pass listed keywords from this job for an applicant tracking system. Read the job description again, every line, and find what that list missed.",
    "",
    ...jobBlock(job),
    "",
    "KEYWORDS ALREADY FOUND:",
    JSON.stringify(found),
    "",
    "List every further skill, tool, technology, practice or domain term the job names or clearly asks for that is not in the list above, in any spelling. Same form: one concrete term of one to three words. If the list already has them all, answer an empty list.",
    "",
    'Answer with JSON only: {"keywords":[{"term":"...","importance":"required"}]}',
  ].join("\n");
}

export function skillsPrompt(text, job, analysis) {
  return [
    "TASK: skills section",
    "You are making this resume's skills section show the job's keywords, so an ATS matching them finds them. The resume is a partial summary of what the candidate knows; do not hold back a job keyword because the resume does not prove it, unless it is clearly outside their field.",
    "",
    ...resumeBlock(text),
    "",
    ...jobBlock(job),
    "",
    "THE GAP ANALYSIS:",
    JSON.stringify(analysis),
    "",
    "Allowed op:",
    '  {"op":"add_skill","skill":"<as the job or the resume spells it>","reason":"<the job keyword or the resume line that backs it>"}',
    "",
    "Rules:",
    `  - Add up to ${MAX_ADDED_SKILLS} skills, most important first: every job keyword the skills section does not list, unless it is clearly outside the candidate's field. Spell each exactly as the job spells it.`,
    "  - A skill must be named by the job or by the resume. Never invent one.",
    `  - A skill is a named tool, language, framework, platform or practice of at most ${MAX_SKILL_WORDS} words. Never an adjective or a phrase.`,
    "  - Never add a skill the skills section already lists, in any spelling.",
    "",
    'Answer with JSON only: {"ops":[...]}',
  ].join("\n");
}

export function bulletsPrompt(text, job, analysis) {
  return [
    "TASK: resume bullets",
    "You are rewriting this resume's bullets so the job's keywords and language appear wherever the candidate's work supports them. The resume keeps every section and every bullet; this is optimisation for this job, not a summary.",
    "",
    ...resumeBlock(text),
    "",
    ...jobBlock(job),
    "",
    "THE GAP ANALYSIS (what the job asks for, and where the resume shows each missing keyword):",
    JSON.stringify(analysis),
    "",
    "Allowed op:",
    REWRITE_OP,
    "",
    "Rules:",
    "  - Go through every bullet and rewrite each one where a job keyword the work plausibly involved can be worked in, or where the job's terminology describes the same work better. Use the analysis's evidence to know which bullet fits which keyword. In the two most recent roles most bullets should change.",
    "  - Every rewrite must earn its place: it works in a job keyword the line did not have, or reframes it in the job's terms. No one-word swaps.",
    ...lineRules,
    "",
    'Answer with JSON only: {"ops":[...]}',
  ].join("\n");
}
