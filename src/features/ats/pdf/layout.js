/*
 * The resume's plain text → blocks to typeset: the header (name, then contact
 * lines), section headings, role/school lines, date lines, bullets and plain
 * lines. Text extracted from a PDF wraps every visual line, so wrapped bullets
 * and summary sentences are joined back into one block before re-wrapping.
 */

import { BULLET_START, continues, headingSection, wordCount } from "../resumeText.js";

const DATED = /\b(?:19|20)\d{2}\b|\bpresent\b/i;
const ENTRY_SECTIONS = new Set(["experience", "projects", "education", "certifications"]);
const PROSE_SECTIONS = new Set(["summary", "achievements"]);

/**
 * @returns {{type: "name"|"contact"|"heading"|"title"|"meta"|"bullet"|"line", text: string}[]}
 */
export function resumeBlocks(text) {
  const blocks = [];
  let section = null;
  let inBody = false;
  let open = null; // a bullet or prose line that wrapped lines may join

  for (const raw of String(text ?? "").split("\n")) {
    const line = raw.trim();
    if (!line) {
      open = null;
      continue;
    }

    const heading = headingSection(line);
    if (heading) {
      section = heading;
      inBody = true;
      open = null;
      blocks.push({ type: "heading", text: line.replace(/[:|]+$/, "").trim() });
      continue;
    }

    if (!inBody) {
      blocks.push({ type: blocks.length ? "contact" : "name", text: line });
      continue;
    }

    const body = line.replace(BULLET_START, "").trim();
    if (BULLET_START.test(raw) && body) {
      open = { type: "bullet", text: body };
      blocks.push(open);
      continue;
    }
    if (open && continues(open.text, line)) {
      open.text = `${open.text} ${line}`;
      continue;
    }

    const short = wordCount(line) <= 12;
    if (short && DATED.test(line)) {
      open = null;
      blocks.push({ type: "meta", text: line });
    } else if (short && ENTRY_SECTIONS.has(section)) {
      open = null;
      blocks.push({ type: "title", text: line });
    } else {
      // Prose (a summary paragraph) re-joins its wrapped lines; a skills line stays a line.
      const block = { type: "line", text: line };
      blocks.push(block);
      open = PROSE_SECTIONS.has(section) ? block : null;
    }
  }
  return blocks;
}
