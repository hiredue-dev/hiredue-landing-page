/*
 * Resume file → plain text, in the browser. PDF via pdf.js, DOCX via mammoth;
 * both are imported on first use so neither weighs on the landing page.
 */

import { AtsError } from "./errors.js";
import { loadPdfjs } from "./pdf/pdfjs.js";

export const MAX_FILE_BYTES = 5 * 1024 * 1024;
export const MAX_PDF_PAGES = 10;
// Below this many letters the file is almost certainly a scan or an image.
const MIN_TEXT_CHARS = 200;

const TYPES = {
  pdf: { mime: ["application/pdf"], ext: ".pdf" },
  docx: { mime: ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"], ext: ".docx" },
};

export const ACCEPT = [...TYPES.pdf.mime, TYPES.pdf.ext, ...TYPES.docx.mime, TYPES.docx.ext].join(",");

/** "pdf" | "docx" | null. Browsers report DOCX inconsistently, so the extension counts too. */
export function fileKind(file) {
  const name = String(file?.name ?? "").toLowerCase();
  for (const [kind, { mime, ext }] of Object.entries(TYPES)) {
    if (mime.includes(file?.type) || name.endsWith(ext)) return kind;
  }
  return null;
}

/** Throws AtsError("unsupported" | "too_large" | "empty_file") for a file we won't read. */
export function validateFile(file) {
  if (!file) throw new AtsError("unsupported");
  if (!fileKind(file)) throw new AtsError(String(file.name).toLowerCase().endsWith(".doc") ? "legacy_doc" : "unsupported");
  if (file.size > MAX_FILE_BYTES) throw new AtsError("too_large");
  if (file.size === 0) throw new AtsError("empty_file");
}

/** @returns {Promise<string>} the resume's text, lines kept */
export async function extractText(file) {
  validateFile(file);
  let raw;
  try {
    raw = fileKind(file) === "pdf" ? await pdfText(file) : await docxText(file);
  } catch (err) {
    if (err instanceof AtsError) throw err;
    throw new AtsError("parse_failed", { cause: err });
  }
  const text = normalize(raw);
  if (text.replace(/\s/g, "").length < MIN_TEXT_CHARS) throw new AtsError("no_text");
  return text;
}

export function normalize(text) {
  return String(text ?? "")
    .replace(/\r\n?/g, "\n")
    .replace(/[   ]/g, " ")
    .replace(/[​﻿]/g, "")
    .split("\n")
    .map((line) => line.replace(/[ \t]+/g, " ").trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function pdfText(file) {
  const pdfjs = await loadPdfjs();
  const doc = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
  if (doc.numPages > MAX_PDF_PAGES) throw new AtsError("too_many_pages");
  const pages = [];
  for (let n = 1; n <= doc.numPages; n += 1) {
    const page = await doc.getPage(n);
    const content = await page.getTextContent();
    pages.push(pageText(content.items));
  }
  await doc.destroy();
  return pages.join("\n\n");
}

// pdf.js returns positioned runs of text. A new line starts where the run says
// so, or where the baseline moves.
export function pageText(items) {
  let out = "";
  let lastY = null;
  let lastEnd = null;
  for (const item of items) {
    if (typeof item.str !== "string") continue;
    const x = item.transform?.[4];
    const y = item.transform?.[5];
    const atLineStart = !out || out.endsWith("\n");
    if (!atLineStart && lastY !== null && y !== undefined && Math.abs(y - lastY) > 2) {
      out += "\n";
    } else if (!atLineStart && !out.endsWith(" ") && item.str && !item.str.startsWith(" ")) {
      // Runs on one line usually carry their own spaces; add one where there's a visible gap.
      if (lastEnd !== null && x !== undefined && x - lastEnd > 1) out += " ";
    }
    out += item.str;
    if (item.hasEOL) out += "\n";
    if (y !== undefined) lastY = y;
    lastEnd = x !== undefined ? x + (item.width ?? 0) : null;
  }
  return out;
}

async function docxText(file) {
  const mammoth = await import("mammoth");
  const { value } = await (mammoth.default ?? mammoth).extractRawText({ arrayBuffer: await file.arrayBuffer() });
  return value;
}
