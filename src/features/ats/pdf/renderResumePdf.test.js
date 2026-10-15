// @vitest-environment node
import { PDFDocument, StandardFonts } from "pdf-lib";
import { describe, expect, it } from "vitest";
import { STRONG } from "../__fixtures__/resumes.js";
import { normalize, pageText } from "../extract.js";
import { scoreResume } from "../scoring.js";
import { resumeBlocks } from "./layout.js";
import { encodable, renderResumePdf, wrap } from "./renderResumePdf.js";

describe("resumeBlocks", () => {
  const blocks = resumeBlocks(STRONG);
  const of = (type) => blocks.filter((b) => b.type === type).map((b) => b.text);

  it("reads the header, headings, roles, dates and bullets", () => {
    expect(blocks[0]).toEqual({ type: "name", text: "Priya Sharma" });
    expect(of("contact")).toHaveLength(2);
    expect(of("heading")).toEqual(["SUMMARY", "EXPERIENCE", "PROJECTS", "EDUCATION", "SKILLS"]);
    expect(of("title")).toEqual(["Razorpay — Senior Frontend Engineer", "Flipkart — Frontend Engineer", "Freshworks — Software Engineer", "B.Tech, Computer Science — IIT Delhi"]);
    expect(of("meta")).toContain("Jan 2022 – Present");
    expect(of("bullet")).toHaveLength(13);
  });

  it("joins a bullet the source PDF wrapped", () => {
    expect(of("bullet")[0]).toBe("Led the rebuild of the merchant dashboard in React and TypeScript, cutting load time by 45% for 300,000 merchants.");
  });

  it("joins a wrapped summary but keeps skills lines apart", () => {
    const text = "Jo\nSUMMARY\nBuilds payment systems for\nmerchants across India.\nSKILLS\nLanguages: Go, Java\nCloud: AWS, GCP";
    expect(resumeBlocks(text).filter((b) => b.type === "line").map((b) => b.text)).toEqual([
      "Builds payment systems for merchants across India.",
      "Languages: Go, Java",
      "Cloud: AWS, GCP",
    ]);
  });
});

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
    const one = await PDFDocument.load(await renderResumePdf(STRONG));
    expect(one.getPageCount()).toBe(1);
    expect(one.getTitle()).toBe("Priya Sharma - Resume");
    const long = STRONG.replace("PROJECTS", `${"• Built a thing that mattered to many people every day.\n".repeat(60)}PROJECTS`);
    expect((await PDFDocument.load(await renderResumePdf(long))).getPageCount()).toBeGreaterThan(1);
  });

  it("reads back as the same resume: an ATS parsing the PDF gets the same score", async () => {
    const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
    const doc = await pdfjs.getDocument({ data: await renderResumePdf(STRONG) }).promise;
    const pages = [];
    for (let n = 1; n <= doc.numPages; n += 1) pages.push(pageText((await (await doc.getPage(n)).getTextContent()).items));
    const back = normalize(pages.join("\n\n"));
    expect(scoreResume(back).overall).toBe(scoreResume(STRONG).overall);
    expect(scoreResume(back).stats).toMatchObject({ bullets: 13, skills: 12 });
  });
});
