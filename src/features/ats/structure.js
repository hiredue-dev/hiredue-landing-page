/*
 * The resume as a fixed structure: header, summary, roles, projects, schooling,
 * skills and the rest, each in its own field. Text extracted from a PDF has
 * lost which line is a job title, a date, a location or a wrapped bullet, and
 * guessing that back from the lines produced resumes with every line centred
 * or merged. So one model call sorts the text into this shape (see
 * structurePrompt), `toResume` checks every field against the source, and
 * edits, the PDF and the plain text are all made from the structure.
 *
 * Shape (every field present; "" or [] when the resume doesn't have it):
 *   name, headline,
 *   contact: {email, phone, location, links: string[]},
 *   summary,
 *   experience: {title, company, location, dates, tech, bullets: string[]}[],
 *   projects: {name, link, tech, dates, bullets: string[]}[],
 *   education: {school, degree, location, dates, details: string[]}[],
 *   skills: {group, items: string[]}[],
 *   certifications: string[], achievements: string[],
 *   other: {heading, items: string[]}[]
 */

import { AtsError } from "./errors.js";
import { BULLET_START, headingSection } from "./resumeText.js";

// Share of the source's words the structure must carry; below it, the model dropped content.
export const MIN_COVERAGE = 0.85;
// Share of a field's words that must be on the source; a fixed typo passes, a rewrite doesn't.
const MIN_FIELD_MATCH = 0.85;

export const EMPTY_RESUME = {
  name: "",
  headline: "",
  contact: { email: "", phone: "", location: "", links: [] },
  summary: "",
  experience: [],
  projects: [],
  education: [],
  skills: [],
  certifications: [],
  achievements: [],
  other: [],
};

const list = (value) => (Array.isArray(value) ? value : []);

// Icon fonts put their glyphs in the private use area; they're never text.
const clean = (value) =>
  typeof value === "string"
    ? value
        .replace(/[-]/g, "")
        .replace(/\s+/g, " ")
        .trim()
    : "";

const tokens = (text) =>
  String(text ?? "")
    .toLowerCase()
    .normalize("NFKD")
    .match(/[\p{L}\p{N}]+/gu) ?? [];

/** A field is the source's own words: every number on it, and nearly every word. */
function sourceCheck(source) {
  const seen = new Set(tokens(source));
  return (text) => {
    const words = tokens(text);
    if (!words.length) return false;
    if (words.some((w) => /\d/.test(w) && !seen.has(w))) return false;
    return words.filter((w) => seen.has(w)).length / words.length >= MIN_FIELD_MATCH;
  };
}

/**
 * The model's answer → a resume in the fixed shape, keeping only fields whose
 * words are on the source. Throws AtsError("unstructured") when what's left
 * is missing much of the resume.
 * @param {unknown} raw  the model's JSON
 * @param {string} source  the resume's extracted text
 */
export function toResume(raw, source) {
  const r = raw && typeof raw === "object" ? raw : {};
  const ok = sourceCheck(source);
  const keep = (value) => {
    const text = clean(value);
    return text && ok(text) ? text : "";
  };
  const keepLine = (value) => keep(clean(value).replace(BULLET_START, ""));
  const keepAll = (values, fn = keepLine) => list(values).map(fn).filter(Boolean);
  const contact = r.contact && typeof r.contact === "object" ? r.contact : {};

  const resume = {
    name: keep(r.name),
    headline: keep(r.headline),
    contact: {
      email: keep(contact.email),
      phone: keep(contact.phone),
      location: keep(contact.location),
      links: keepAll(contact.links, keep),
    },
    summary: keep(r.summary),
    experience: list(r.experience)
      .map((e) => ({
        title: keep(e?.title),
        company: keep(e?.company),
        location: keep(e?.location),
        dates: keep(e?.dates),
        tech: keep(e?.tech),
        bullets: keepAll(e?.bullets),
      }))
      .filter((e) => e.title || e.company || e.bullets.length),
    projects: list(r.projects)
      .map((p) => ({ name: keep(p?.name), link: keep(p?.link), tech: keep(p?.tech), dates: keep(p?.dates), bullets: keepAll(p?.bullets) }))
      .filter((p) => p.name || p.bullets.length),
    education: list(r.education)
      .map((e) => ({ school: keep(e?.school), degree: keep(e?.degree), location: keep(e?.location), dates: keep(e?.dates), details: keepAll(e?.details) }))
      .filter((e) => e.school || e.degree),
    skills: list(r.skills)
      .map((s) => ({ group: keep(s?.group), items: keepAll(s?.items, keep) }))
      .filter((s) => s.items.length),
    certifications: keepAll(r.certifications),
    achievements: keepAll(r.achievements),
    other: list(r.other)
      .map((o) => ({ heading: keep(o?.heading), items: keepAll(o?.items) }))
      .filter((o) => o.heading && o.items.length),
  };

  if (!resume.experience.length && !resume.projects.length && !resume.education.length) throw new AtsError("unstructured");
  if (coverageOf(resume, source) < MIN_COVERAGE) throw new AtsError("unstructured");
  return resume;
}

/** Share of the source's distinct words (headings aside) that the structure carries. */
export function coverageOf(resume, source) {
  const body = String(source ?? "")
    .split("\n")
    .filter((line) => !headingSection(line))
    .join(" ");
  const want = new Set(tokens(body).filter((w) => w.length > 1));
  if (!want.size) return 0;
  const have = new Set(tokens(resumeToText(resume)));
  return [...want].filter((w) => have.has(w)).length / want.size;
}

const SECTIONS = [
  ["summary", "SUMMARY"],
  ["skills", "SKILLS"],
  ["experience", "EXPERIENCE"],
  ["projects", "PROJECTS"],
  ["education", "EDUCATION"],
  ["certifications", "CERTIFICATIONS"],
  ["achievements", "ACHIEVEMENTS"],
];

const joined = (...parts) => parts.filter(Boolean).join(" | ");

/**
 * The resume in reading order, as typed blocks: the one layout both the PDF
 * and the plain text are made from. Sections always come in the same order,
 * under the same standard headings an ATS looks for.
 * @returns {{type: "name"|"headline"|"contact"|"heading"|"entry"|"sub"|"meta"|"bullet"|"line", text: string, right?: string}[]}
 */
export function resumeBlocks(resume) {
  const r = { ...EMPTY_RESUME, ...resume };
  const c = { ...EMPTY_RESUME.contact, ...r.contact };
  const blocks = [];
  const push = (type, text, extra) => text && blocks.push({ type, text, ...extra });

  push("name", r.name);
  push("headline", r.headline);
  push("contact", joined(c.email, c.phone, c.location, ...c.links));

  const body = {
    summary: () => push("line", r.summary),
    skills: () => r.skills.forEach((s) => push("line", s.group ? `${s.group}: ${s.items.join(", ")}` : s.items.join(", "))),
    experience: () =>
      r.experience.forEach((e) => {
        push("entry", e.title || e.company, { right: e.dates });
        push("sub", joined(e.title ? e.company : "", e.location));
        push("meta", e.tech && `Tech: ${e.tech}`);
        e.bullets.forEach((b) => push("bullet", b));
      }),
    projects: () =>
      r.projects.forEach((p) => {
        push("entry", p.name, { right: p.dates });
        push("sub", p.link);
        push("meta", p.tech && `Tech: ${p.tech}`);
        p.bullets.forEach((b) => push("bullet", b));
      }),
    education: () =>
      r.education.forEach((e) => {
        push("entry", e.school || e.degree, { right: e.dates });
        push("sub", joined(e.school ? e.degree : "", e.location));
        e.details.forEach((d) => push("bullet", d));
      }),
    certifications: () => r.certifications.forEach((x) => push("bullet", x)),
    achievements: () => r.achievements.forEach((x) => push("bullet", x)),
  };

  const has = {
    summary: Boolean(r.summary),
    skills: r.skills.length > 0,
    experience: r.experience.length > 0,
    projects: r.projects.length > 0,
    education: r.education.length > 0,
    certifications: r.certifications.length > 0,
    achievements: r.achievements.length > 0,
  };
  for (const [id, heading] of SECTIONS) {
    if (!has[id]) continue;
    push("heading", heading);
    body[id]();
  }
  for (const section of r.other) {
    push("heading", section.heading.toUpperCase());
    section.items.forEach((x) => push("bullet", x));
  }
  return blocks;
}

/** The resume as plain text, one block per line: what is scored, diffed and copied. */
export function resumeToText(resume) {
  const lines = [];
  for (const block of resumeBlocks(resume)) {
    if (block.type === "heading" && lines.length) lines.push("");
    if (block.type === "bullet") lines.push(`• ${block.text}`);
    else if (block.type === "entry" && block.right) lines.push(`${block.text} | ${block.right}`);
    else lines.push(block.text);
  }
  return `${lines.join("\n")}\n`;
}

/**
 * The lines an edit may change, each with a stable id: the summary, and every
 * bullet of a role, a project or an achievement. Names, titles, employers,
 * dates, schooling and contact details have no id, so they can't be touched.
 * `set` writes the new text into `resume` in place.
 * @returns {{id: string, section: string, where: string, text: string, set: (text: string) => void}[]}
 */
export function editableLines(resume) {
  const out = [];
  if (resume.summary) out.push({ id: "summary", section: "Summary", where: "", text: resume.summary, set: (t) => (resume.summary = t) });
  resume.experience.forEach((e, i) =>
    e.bullets.forEach((text, j) =>
      out.push({ id: `experience.${i}.${j}`, section: "Experience", where: joined(e.title, e.company), text, set: (t) => (e.bullets[j] = t) }),
    ),
  );
  resume.projects.forEach((p, i) =>
    p.bullets.forEach((text, j) => out.push({ id: `projects.${i}.${j}`, section: "Projects", where: p.name, text, set: (t) => (p.bullets[j] = t) })),
  );
  resume.achievements.forEach((text, j) =>
    out.push({ id: `achievements.${j}`, section: "Achievements", where: "", text, set: (t) => (resume.achievements[j] = t) }),
  );
  return out;
}

/** What the model sees when editing: the structure, with an id on every line it may change. */
export function promptView(resume) {
  const lines = (texts, prefix) => texts.map((text, j) => ({ id: `${prefix}.${j}`, text }));
  return {
    headline: resume.headline,
    summary: resume.summary ? { id: "summary", text: resume.summary } : null,
    experience: resume.experience.map((e, i) => ({ title: e.title, company: e.company, dates: e.dates, tech: e.tech, bullets: lines(e.bullets, `experience.${i}`) })),
    projects: resume.projects.map((p, i) => ({ name: p.name, tech: p.tech, bullets: lines(p.bullets, `projects.${i}`) })),
    education: resume.education.map(({ school, degree, dates }) => ({ school, degree, dates })),
    skills: resume.skills,
    certifications: resume.certifications,
    achievements: lines(resume.achievements, "achievements"),
    other: resume.other,
  };
}
