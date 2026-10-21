import { describe, expect, it } from "vitest";
import { STRONG, WEAK } from "./__fixtures__/resumes.js";
import { CATEGORIES, scoreBand, scoreResume } from "./scoring.js";
import { readResume, skillItems } from "./resumeText.js";

describe("readResume", () => {
  it("finds standard sections and joins wrapped bullets", () => {
    const { sections, bullets } = readResume(STRONG);
    expect(Object.keys(sections)).toEqual(["summary", "experience", "projects", "education", "skills"]);
    expect(bullets[0].text).toBe(
      "Led the rebuild of the merchant dashboard in React and TypeScript, cutting load time by 45% for 300,000 merchants.",
    );
    expect(bullets).toHaveLength(13);
  });

  it("reads descriptive lines as bullets when the resume has no bullet markers", () => {
    const { bullets } = readResume("EXPERIENCE\nAcme\nBuilt the billing service that processes every invoice for the company.\n2020 – 2022");
    expect(bullets.map((b) => b.text)).toEqual(["Built the billing service that processes every invoice for the company."]);
  });

  it("splits a skills section into items, dropping category labels", () => {
    expect(skillItems("Languages: Python, Go | SQL\nCloud: AWS • Docker")).toEqual(["Python", "Go", "SQL", "AWS", "Docker"]);
  });
});

describe("scoreResume", () => {
  it("is deterministic", () => {
    expect(scoreResume(STRONG)).toEqual(scoreResume(STRONG));
  });

  it("scores a complete, quantified resume highly", () => {
    const score = scoreResume(STRONG);
    expect(score.overall).toBeGreaterThanOrEqual(85);
    expect(score.issues.filter((i) => i.severity === "high")).toEqual([]);
  });

  it("scores a thin resume low and explains why, worst first", () => {
    const score = scoreResume(WEAK);
    expect(score.overall).toBeLessThan(30);
    const ids = score.issues.map((i) => i.id);
    expect(ids).toEqual(expect.arrayContaining(["no-email", "no-skills", "no-education", "first-person", "too-short"]));
    for (let k = 1; k < score.issues.length; k += 1) {
      expect(score.issues[k - 1].lost).toBeGreaterThanOrEqual(score.issues[k].lost);
    }
  });

  it("keeps every category within its maximum, adding up to the overall", () => {
    for (const text of [STRONG, WEAK, ""]) {
      const score = scoreResume(text);
      expect(score.categories.map((c) => c.id)).toEqual(CATEGORIES.map((c) => c.id));
      for (const c of score.categories) {
        expect(c.score).toBeGreaterThanOrEqual(0);
        expect(c.score).toBeLessThanOrEqual(c.max);
      }
      expect(Math.abs(score.categories.reduce((s, c) => s + c.score, 0) - score.overall)).toBeLessThanOrEqual(2);
    }
  });

  it("rewards rewriting a duty into an action-led result", () => {
    const before = STRONG.replace("• Built a shared component library", "• Responsible for a shared component library");
    expect(scoreResume(STRONG).overall).toBeGreaterThan(scoreResume(before).overall);
  });
});

describe("scoreBand", () => {
  it.each([
    [92, "Strong"],
    [65, "Good"],
    [45, "Needs work"],
    [10, "Weak"],
  ])("%i is %s", (score, label) => {
    expect(scoreBand(score).label).toBe(label);
  });
});
