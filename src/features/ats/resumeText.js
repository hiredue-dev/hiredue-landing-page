/*
 * Reads structure out of a resume's plain text: which sections it has, where
 * they are, and which lines are bullets. Text extracted from a PDF wraps a long
 * bullet over several lines, so a line that continues the one before it is
 * joined back on.
 */

export const SECTION_LABELS = {
  summary: "Summary",
  experience: "Experience",
  education: "Education",
  skills: "Skills",
  projects: "Projects",
  certifications: "Certifications",
  achievements: "Achievements",
};

const SECTION_HEADINGS = {
  summary: ["summary", "professional summary", "career summary", "profile", "professional profile", "about me", "about", "objective", "career objective"],
  experience: ["experience", "work experience", "professional experience", "employment", "employment history", "work history", "internships", "internship", "relevant experience"],
  education: ["education", "academic background", "academics", "education and training", "qualifications", "academic qualifications"],
  skills: ["skills", "technical skills", "key skills", "core skills", "core competencies", "competencies", "technologies", "tech stack", "tools", "skills and tools", "skills & tools", "technical proficiency"],
  projects: ["projects", "personal projects", "key projects", "academic projects", "side projects", "selected projects"],
  certifications: ["certifications", "certification", "certificates", "licenses", "licenses and certifications", "courses"],
  achievements: ["achievements", "awards", "honors", "honours", "accomplishments", "awards and achievements"],
};

const HEADING_TO_SECTION = new Map(
  Object.entries(SECTION_HEADINGS).flatMap(([id, names]) => names.map((name) => [name, id])),
);

export const BULLET_START = /^\s*[•●▪◦■□➢➤►‣∙·*\-–—]\s*/;

/** "Technical Skills:" or "TECHNICAL SKILLS" → "skills"; anything else → null. */
export function headingSection(line) {
  const key = line
    .trim()
    .replace(/[:|]+$/, "")
    .replace(/\s+/g, " ")
    .toLowerCase();
  if (!key || key.length > 40) return null;
  return HEADING_TO_SECTION.get(key) ?? null;
}

/**
 * @returns {{
 *   lines: string[],
 *   sections: Record<string, {start: number, end: number, text: string}>,
 *   bullets: {text: string, section: string|null}[],
 * }}
 * `start`/`end` are line indexes (heading line excluded, end exclusive).
 */
export function readResume(text) {
  const lines = String(text ?? "").split("\n");
  const marks = [];
  lines.forEach((line, index) => {
    const id = headingSection(line);
    // The first heading wins: "Skills" inside a project line is not a section.
    if (id && !marks.some((mark) => mark.id === id)) marks.push({ id, index });
  });

  const sections = {};
  marks.forEach((mark, k) => {
    const start = mark.index + 1;
    const end = k + 1 < marks.length ? marks[k + 1].index : lines.length;
    sections[mark.id] = { start, end, text: lines.slice(start, end).join("\n").trim() };
  });

  const sectionAt = (index) => {
    let current = null;
    for (const mark of marks) if (mark.index < index) current = mark.id;
    return current;
  };

  return { lines, sections, bullets: readBullets(lines, sectionAt) };
}

// Bullets are the lines that describe work: in experience and projects (or
// anywhere, when the resume has no recognisable sections). A resume without
// bullet characters still has its descriptive lines counted.
function readBullets(lines, sectionAt) {
  const hasMarkers = lines.some((line) => BULLET_START.test(line) && line.replace(BULLET_START, "").trim().length > 0);
  const bullets = [];
  let open = null;

  lines.forEach((raw, index) => {
    const section = sectionAt(index);
    const inWork = section === null || section === "experience" || section === "projects";
    const line = raw.trim();
    if (!line || headingSection(line)) {
      open = null;
      return;
    }
    if (!inWork) {
      open = null;
      return;
    }
    const isMarked = BULLET_START.test(raw);
    const body = line.replace(BULLET_START, "").trim();
    if (hasMarkers) {
      if (isMarked && body) {
        open = { text: body, section };
        bullets.push(open);
      } else if (open && continues(open.text, body)) {
        open.text = `${open.text} ${body}`;
      } else {
        open = null;
      }
      return;
    }
    // No markers: a long descriptive line is a bullet; a short one is a title or a date line.
    if (wordCount(body) >= 8) {
      if (open && continues(open.text, body)) open.text = `${open.text} ${body}`;
      else {
        open = { text: body, section };
        bullets.push(open);
      }
    } else {
      open = null;
    }
  });
  return bullets;
}

// A wrapped line carries on mid-sentence: the bullet so far doesn't end a
// sentence, or the new line starts in lower case.
export function continues(sofar, next) {
  if (!next) return false;
  return !/[.!?]$/.test(sofar) || /^[a-z(&,]/.test(next);
}

export function wordCount(text) {
  return String(text ?? "").split(/\s+/).filter(Boolean).length;
}

/** The skills section split into items: "React, Node.js | AWS • Docker" → 4. */
export function skillItems(skillsText) {
  return String(skillsText ?? "")
    .split(/[,;|•●▪\n]|\s{2,}|\s[–—-]\s/)
    .map((item) => item.replace(/^[^:]{1,30}:\s*/, "").trim())
    .filter((item) => item && item.length <= 40 && wordCount(item) <= 4);
}
