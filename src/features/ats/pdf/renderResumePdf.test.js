// @vitest-environment node
import { PDFDocument, StandardFonts } from "pdf-lib";
import { describe, expect, it } from "vitest";
import { STRONG_RESUME } from "../__fixtures__/resumes.js";
import { normalize, pageText } from "../extract.js";
import { scoreResume } from "../scoring.js";
import { resumeToText } from "../structure.js";
import { encodable, renderResumePdf, wrap } from "./renderResumePdf.js";

describe("renderResumePdf", () => {
  it("swaps characters the standard font can't draw", async () => {
    const font = await (await PDFDocument.create()).embedFont(StandardFonts.Helvetica);
    expect(encodable("₹ 40 LPA · Zürich ✓ — “ok”", font)).toBe("INR  40 LPA · Zürich  — “ok”");
  });

  it("wraps to the width, breaking a word only when it must", async () => {
    const font = await (await PDFDocument.create()).embedFont(StandardFonts.Helvetica);
    const lines = wrap(`short words here ${"x".repeat(200)}`, font, 10, 200);
    expect(lines[0]).toBe("short words here");
    expect(lines.every((l) => font.widthOfTextAtSize(l, 10) <= 200)).toBe(true);
  });

  it("makes a titled PDF, adding pages as the resume grows", async () => {
    const one = await PDFDocument.load(await renderResumePdf(STRONG_RESUME));
    expect(one.getPageCount()).toBe(1);
    expect(one.getTitle()).toBe("Priya Sharma - Resume");
    const long = structuredClone(STRONG_RESUME);
    long.projects[0].bullets.push(...Array(60).fill("Built a thing that mattered to many people every day."));
    expect((await PDFDocument.load(await renderResumePdf(long))).getPageCount()).toBeGreaterThan(1);
  });

  it("reads back as the same resume: an ATS parsing the PDF gets the same score", async () => {
    const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
    const doc = await pdfjs.getDocument({ data: await renderResumePdf(STRONG_RESUME) }).promise;
    const pages = [];
    for (let n = 1; n <= doc.numPages; n += 1) pages.push(pageText((await (await doc.getPage(n)).getTextContent()).items));
    const back = normalize(pages.join("\n\n"));
    expect(scoreResume(back).overall).toBe(scoreResume(resumeToText(STRONG_RESUME)).overall);
    // Each role reads as title and dates on one line, then the company.
    expect(back).toMatch(/Senior Frontend Engineer Jan 2022 – Present\n+Razorpay\n/);
    expect(scoreResume(back).stats).toMatchObject({ bullets: 13, skills: 12 });
  });
});
