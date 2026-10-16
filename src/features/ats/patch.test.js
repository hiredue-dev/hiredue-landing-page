import { describe, expect, it } from "vitest";
import { STRONG_RESUME } from "./__fixtures__/resumes.js";
import { coverage, mentions } from "./coverage.js";
import { isCosmetic, resumeDiff, wordDiff } from "./diff.js";
import { applyOps } from "./patch.js";

describe("coverage (ported from the desktop app)", () => {
  it("matches whole words, symbols included", () => {
    expect(mentions("Built with C++ and Node.js", "C++")).toBe(true);
    expect(mentions("Built with React.js", "React")).toBe(true);
    expect(mentions("Worked at Google", "Go")).toBe(false);
    expect(mentions("Deployed on AWS.", "AWS")).toBe(true);
  });

  it("counts a joined keyword only when every part is there", () => {
    const result = coverage(["React & Node.js", "CI/CD", "Kubernetes", "react & node.js"], "React, Node.js, CI/CD");
    expect(result).toMatchObject({ covered: 2, total: 3, percent: 67 });
  });
});

describe("diff (ported from the desktop app)", () => {
  it("marks added words in reading order", () => {
    expect(wordDiff("Built the API.", "Built the payments API on AWS.")).toEqual([
      { text: "Built the ", op: "same" },
      { text: "payments ", op: "add" },
      { text: "API", op: "same" },
      { text: " on AWS", op: "add" },
      { text: ".", op: "same" },
    ]);
  });

  it("calls punctuation and casing edits cosmetic", () => {
    expect(isCosmetic("built the API", "Built the API.")).toBe(true);
    expect(isCosmetic("Built the API", "Built the REST API")).toBe(false);
  });
});

describe("resumeDiff", () => {
  const filler = Array.from({ length: 10 }, (_, k) => `line ${k + 1}`);
  const before = ["NAME", "EXPERIENCE", "• Led the rebuild of the dashboard in React,", "cutting load time by 45%.", ...filler, "SKILLS", "React, Node"].join("\n");
  const after = ["NAME", "EXPERIENCE", "• Led the rebuild of the merchant dashboard in React, cutting load time by 45%.", ...filler, "SKILLS", "React, Node, AWS"].join("\n");
  const added = (line) => line.parts.filter((p) => p.changed).map((p) => p.text);

  it("puts removed lines before added ones, numbered on both sides", () => {
    const { lines, added: plus, removed } = resumeDiff(before, after);
    expect([plus, removed]).toEqual([2, 3]);
    expect(lines.slice(2, 5).map((l) => [l.op, l.oldNo, l.newNo])).toEqual([
      ["del", 3, null],
      ["del", 4, null],
      ["add", null, 3],
    ]);
  });

  it("marks only the words that changed, even across a re-joined line wrap", () => {
    const { lines } = resumeDiff(before, after);
    expect(added(lines[4])).toEqual(["merchant"]);
    expect(lines.slice(2, 4).flatMap(added)).toEqual([]);
    expect(added(lines.find((l) => l.op === "add" && l.newNo === 15))).toEqual([", AWS"]);
  });

  it("has no changed lines when nothing changed", () => {
    expect(resumeDiff(before, before).lines.every((l) => l.op === "same")).toBe(true);
  });
});

describe("applyOps", () => {
  const rewrite = (id, after) => ({ op: "rewrite", id, after, reason: "test" });
  const MENTORED = "experience.0.2";
  const LIBRARY = "experience.0.1";

  it("applies a real rewrite and records it with its diff and section", () => {
    const result = applyOps(STRONG_RESUME, [rewrite(MENTORED, "Mentored 5 engineers on GraphQL, TypeScript and testing practices through code reviews and pairing.")]);
    expect(result.refused).toEqual([]);
    expect(result.resume.experience[0].bullets[2]).toBe("Mentored 5 engineers on GraphQL, TypeScript and testing practices through code reviews and pairing.");
    expect(result.changes[0]).toMatchObject({ kind: "reworded", section: "Experience", where: "Senior Frontend Engineer | Razorpay" });
    expect(result.changes[0].diff.some((p) => p.op === "add")).toBe(true);
    // The input is never modified.
    expect(STRONG_RESUME.experience[0].bullets[2]).toBe("Mentored 5 engineers through code reviews and pairing on GraphQL and testing practices.");
  });

  it("refuses edits it can't verify or that change facts", () => {
    const result = applyOps(STRONG_RESUME, [
      rewrite("experience.9.0", "Something else entirely."),
      { op: "rewrite", id: "name", after: "Priya S. Sharma" },
      rewrite(LIBRARY, "built a shared component library adopted by 12 product teams, reducing UI bugs by 30%"),
      rewrite(LIBRARY, "Built a shared component library adopted by 15 product teams, reducing UI bugs by 30%."),
      rewrite("experience.1.0", "Developed checkout flows in React and Redux serving 2 million daily users, raising conversion 20%."),
      rewrite(MENTORED, "Mentored 5 engineers in GraphQL through code reviews."),
      rewrite(MENTORED, "Coached 5 engineers in GraphQL through code reviews."),
    ]);
    expect(result.refused.map((r) => r.reason)).toEqual([
      "not a line that can be changed",
      "not a line that can be changed",
      "only punctuation or casing changed",
      "it changes or adds a number",
      "it changes or adds a number",
      "that line was already changed",
    ]);
    expect(result.changes).toHaveLength(1);
  });

  it("adds skills the job or the resume names, and only those", () => {
    const result = applyOps(
      STRONG_RESUME,
      [
        { op: "add_skill", skill: "Kubernetes", reason: "job" },
        { op: "add_skill", skill: "Rust", reason: "invented" },
        { op: "add_skill", skill: "react", reason: "duplicate" },
        { op: "add_skill", skill: "Lighthouse", reason: "from a bullet" },
        { op: "add_skill", skill: "Highly scalable distributed cloud applications", reason: "phrase" },
      ],
      { jobText: "We run everything on Kubernetes." },
    );
    expect(result.changes.map((c) => c.after)).toEqual(["Kubernetes", "Lighthouse"]);
    expect(result.refused.map((r) => r.op.skill)).toEqual(["Rust", "react", "Highly scalable distributed cloud applications"]);
    expect(result.resume.skills[0].items.slice(-2)).toEqual(["Kubernetes", "Lighthouse"]);
  });

  it("puts an added skill in the group the model names, else an Additional group", () => {
    const resume = { ...STRONG_RESUME, skills: [{ group: "Languages", items: ["TypeScript"] }, { group: "Testing", items: ["Jest"] }] };
    const result = applyOps(resume, [
      { op: "add_skill", skill: "Playwright", group: "testing" },
      { op: "add_skill", skill: "Redux", group: "State" },
    ]);
    expect(result.resume.skills).toEqual([
      { group: "Languages", items: ["TypeScript"] },
      { group: "Testing", items: ["Jest", "Playwright"] },
      { group: "Additional", items: ["Redux"] },
    ]);
  });

  it("starts a skills list when the resume has none", () => {
    const result = applyOps({ ...STRONG_RESUME, skills: [] }, [{ op: "add_skill", skill: "Redux" }]);
    expect(result.resume.skills).toEqual([{ group: "", items: ["Redux"] }]);
  });
});
