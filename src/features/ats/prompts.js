/*
 * Prompts for structuring, optimising and tailoring a resume. The editing
 * prompts are adapted from the desktop app
 * (electron/resumeOptimization/adapters/optimizer.adapter.cjs) with the same
 * rules — keep every fact and number, never invent — over the structured
 * resume (structure.js): every line the model may change carries an id, and
 * each edit names the id it changes, so patch.js can verify it.
 */

import { MAX_ADDED_SKILLS, MAX_SKILL_WORDS } from "./patch.js";
import { promptView } from "./structure.js";

const SHAPE = {
  name: "",
  headline: "",
  contact: { email: "", phone: "", location: "", links: [""] },
  summary: "",
  experience: [{ title: "", company: "", location: "", dates: "", tech: "", bullets: [""] }],
  projects: [{ name: "", link: "", tech: "", dates: "", bullets: [""] }],
  education: [{ school: "", degree: "", location: "", dates: "", details: [""] }],
  skills: [{ group: "", items: [""] }],
  certifications: [""],
  achievements: [""],
  other: [{ heading: "", items: [""] }],
};

/** Plain text → the fixed structure (structure.js checks the answer against the text). */
export function structurePrompt(text) {
  return [
    "TASK: structure",
    "You are an exact resume parser. The text below was extracted from a resume file, so its layout is lost: wrapped lines are split, columns are interleaved, and icons came out as stray symbols. Sort it into the fixed structure below. You are not an editor.",
    "",
    "THE RESUME TEXT:",
    text,
    "",
    "Rules:",
    "  - Copy every value exactly as the resume writes it: the same words, spelling, capitalisation, numbers and dates. Never reword, shorten, correct, translate, summarise or invent.",
    "  - Every piece of content goes somewhere. Nothing is dropped except layout debris: icon glyphs and stray symbols around contact details (such as #, §, ï, |, •), bullet symbols, section headings themselves, and page numbers.",
    "  - A bullet the file wrapped over several lines is one bullet: join its lines with single spaces. Never merge two bullets or split one.",
    "  - Lines under a role or project that describe the work are its bullets, with or without a bullet symbol.",
    '  - Split a role\'s header lines into their fields: title (the job title as written, e.g. "Engineering Intern : Job Application Automation"), company, location, dates, and tech (a tech stack listed on the header, as one string). A role with several positions at one company is one entry per position.',
    '  - dates is one string as written, e.g. "Jun 2024 – Aug 2025".',
    "  - A project's URL goes in link, its stack in tech, never in name.",
    '  - skills keeps the resume\'s own groups: "Languages: Python, Go" → {"group":"Languages","items":["Python","Go"]}. Ungrouped skills are one group with "group":"". One skill per item.',
    "  - headline is the line of job titles or a tagline under the name, if any. summary is the profile paragraph, if any.",
    '  - A section the structure has no field for (Publications, Languages, Volunteering, Interests, Open Source …) goes in other, under its heading as written.',
    '  - A field the resume doesn\'t have is "" or []. Never fill one with a guess.',
    "",
    "Answer with JSON only, in exactly this shape (lists may hold any number of items):",
    JSON.stringify(SHAPE),
  ].join("\n");
}

const REWRITE_OP = '  {"op":"rewrite","id":"<the id of the line>","after":"<the rewritten line>","reason":"<what it now shows>"}';

const lineRules = [
  "  - Name each line you change by its id. One op per changed line. Do not list lines you leave alone. Only lines with an id can change.",
  "  - A rewritten line keeps every fact, number and name it had and grows by at most a quarter. It stays one line: never merge two lines, split one, or drop details.",
  "  - Never change a number, and never invent an achievement or a metric. If a bullet has no number, do not add one.",
  "  - Punctuation or casing edits are refused; every rewrite must change what the line says.",
];

const resumeBlock = (resume) => ["THE CANDIDATE'S RESUME (structured; lines you may change have an id):", JSON.stringify(promptView(resume))];
const jobBlock = (job) => ["THE JOB:", JSON.stringify(job)];

/** Whole-resume optimisation, no job: stronger bullets, record-backed skills. */
export function optimizePrompt(resume, issues) {
  return [
    "TASK: ATS optimisation",
    "You are improving this resume so an applicant tracking system parses it well and a recruiter sees impact at a glance. There is no particular job; improve how the candidate's own work reads.",
    "",
    ...resumeBlock(resume),
    "",
    "WHAT AN AUTOMATED CHECK FLAGGED (fix what you can by rewording; ignore what needs new facts):",
    JSON.stringify(issues.map(({ title, detail }) => ({ title, detail }))),
    "",
    "Allowed ops:",
    REWRITE_OP,
    `  {"op":"add_skill","skill":"<a tool or practice the resume's own bullets or projects name>","group":"<the existing skills group it belongs in, or empty>","reason":"<where the resume shows it>"}`,
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
    "THE CANDIDATE'S RESUME (plain text extracted from their file):",
    text,
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

export function skillsPrompt(resume, job, analysis) {
  return [
    "TASK: skills section",
    "You are making this resume's skills section show the job's keywords, so an ATS matching them finds them. The resume is a partial summary of what the candidate knows; do not hold back a job keyword because the resume does not prove it, unless it is clearly outside their field.",
    "",
    ...resumeBlock(resume),
    "",
    ...jobBlock(job),
    "",
    "THE GAP ANALYSIS:",
    JSON.stringify(analysis),
    "",
    "Allowed op:",
    '  {"op":"add_skill","skill":"<as the job or the resume spells it>","group":"<the existing skills group it belongs in, or empty>","reason":"<the job keyword or the resume line that backs it>"}',
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

export function bulletsPrompt(resume, job, analysis) {
  return [
    "TASK: resume bullets",
    "You are rewriting this resume's bullets so the job's keywords and language appear wherever the candidate's work supports them. The resume keeps every section and every bullet; this is optimisation for this job, not a summary.",
    "",
    ...resumeBlock(resume),
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
