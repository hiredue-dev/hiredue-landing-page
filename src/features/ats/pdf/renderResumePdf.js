/*
 * Typesets a resume as a PDF in the browser: one column, standard Helvetica,
 * real text (not an image), headings in plain words. That is the layout ATS
 * parsers read most reliably, and the same shape as the desktop app's
 * "ATS single column" template. Imported on demand, with pdf-lib.
 */

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { resumeBlocks } from "./layout.js";

const PAGE = { width: 612, height: 792 }; // US Letter, as the desktop app's template
const MARGIN = { x: 54, top: 50, bottom: 50 };
const INK = rgb(0.11, 0.11, 0.11);
const DIM = rgb(0.3, 0.35, 0.37);
const RULE = rgb(0.75, 0.78, 0.8);

const STYLE = {
  name: { size: 20, bold: true, color: INK, align: "center", before: 0, after: 4 },
  contact: { size: 9.5, bold: false, color: DIM, align: "center", before: 0, after: 1 },
  heading: { size: 11, bold: true, color: INK, before: 12, after: 6 },
  title: { size: 10.5, bold: true, color: INK, before: 6, after: 1 },
  meta: { size: 9.5, bold: false, color: DIM, before: 0, after: 2 },
  bullet: { size: 10, bold: false, color: INK, before: 0, after: 2, indent: 14 },
  line: { size: 10, bold: false, color: INK, before: 0, after: 3 },
};
const LEADING = 1.32;

// Characters the standard fonts can't draw, spelled the way a reader (and an ATS) would.
const REPLACE = { "₹": "INR ", "−": "-", "→": "->", "←": "<-", "≥": ">=", "≤": "<=", "✓": "", "✔": "", "★": "*", "­": "" };

/** Text the font can encode: replacements above, then accents kept where WinAnsi has them, else stripped. */
export function encodable(text, font) {
  const supported = new Set(font.getCharacterSet());
  let out = "";
  for (const ch of String(text)) {
    const swapped = REPLACE[ch] ?? ch;
    for (const c of swapped) {
      if (supported.has(c.codePointAt(0))) out += c;
      else out += [...c.normalize("NFKD")].filter((d) => supported.has(d.codePointAt(0))).join("");
    }
  }
  return out;
}

/** Greedy word wrap; a word longer than the line is broken where it must be. */
export function wrap(text, font, size, width) {
  const lines = [];
  let current = "";
  for (const word of text.split(/\s+/).filter(Boolean)) {
    const candidate = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) <= width) {
      current = candidate;
      continue;
    }
    if (current) lines.push(current);
    let rest = word;
    while (font.widthOfTextAtSize(rest, size) > width) {
      let cut = rest.length - 1;
      while (cut > 1 && font.widthOfTextAtSize(rest.slice(0, cut), size) > width) cut -= 1;
      lines.push(rest.slice(0, cut));
      rest = rest.slice(cut);
    }
    current = rest;
  }
  if (current) lines.push(current);
  return lines;
}

/**
 * @param {string} text  the resume's plain text
 * @param {{title?: string}} [options]
 * @returns {Promise<Uint8Array>} the PDF file
 */
export async function renderResumePdf(text, { title } = {}) {
  const doc = await PDFDocument.create();
  const regular = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const blocks = resumeBlocks(text);
  const contentWidth = PAGE.width - 2 * MARGIN.x;

  let page = doc.addPage([PAGE.width, PAGE.height]);
  let y = PAGE.height - MARGIN.top;
  const room = (needed) => {
    if (y - needed >= MARGIN.bottom) return;
    page = doc.addPage([PAGE.width, PAGE.height]);
    y = PAGE.height - MARGIN.top;
  };

  blocks.forEach((block, index) => {
    const style = STYLE[block.type];
    const font = style.bold ? bold : regular;
    const lead = style.size * LEADING;
    const raw = block.type === "heading" ? block.text.toUpperCase() : block.text;
    const indent = style.indent ?? 0;
    const lines = wrap(encodable(raw, font), font, style.size, contentWidth - indent);
    if (!lines.length) return;

    if (index > 0) y -= style.before;
    // A heading never sits alone at the foot of a page; it brings its first line along.
    room(lead * Math.min(lines.length, 2) + (block.type === "heading" ? 24 : 0));

    lines.forEach((line, k) => {
      if (k > 0) room(lead);
      y -= style.size;
      const width = font.widthOfTextAtSize(line, style.size);
      const x = style.align === "center" ? (PAGE.width - width) / 2 : MARGIN.x + indent;
      if (block.type === "bullet" && k === 0) {
        page.drawText("•", { x: MARGIN.x + 3, y, size: style.size, font: regular, color: style.color });
      }
      page.drawText(line, { x, y, size: style.size, font, color: style.color });
      y -= lead - style.size;
    });

    if (block.type === "heading") {
      page.drawLine({ start: { x: MARGIN.x, y: y - 1 }, end: { x: PAGE.width - MARGIN.x, y: y - 1 }, thickness: 0.6, color: RULE });
      y -= 4;
    }
    y -= style.after;
  });

  const name = blocks.find((b) => b.type === "name")?.text;
  doc.setTitle(title || (name ? `${encodable(name, regular)} - Resume` : "Resume"));
  doc.setCreator("HireDue ATS Resume Checker");
  doc.setProducer("HireDue");
  return doc.save();
}
