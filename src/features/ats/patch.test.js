import { describe, expect, it } from "vitest";
import { STRONG } from "./__fixtures__/resumes.js";
import { coverage, mentions } from "./coverage.js";
import { isCosmetic, resumeDiff, wordDiff } from "./diff.js";
import { applyOps, findQuote } from "./patch.js";

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

describe("findQuote", () => {
  it("finds a bullet the PDF wrapped over two lines", () => {
    const at = findQuote(STRONG, "• Led the rebuild of the merchant dashboard in React and TypeScript, cutting load time by 45% for 300,000 merchants.");
    expect(at).not.toBeNull();
    expect(STRONG.slice(at.start, at.end)).toContain("300,000\nmerchants.");
  });
});

describe("applyOps", () => {
  const rewrite = (before, after) => ({ op: "rewrite_line", before, after, reason: "test" });

  it("applies a real rewrite and records it with its diff and section", () => {
    const result = applyOps(STRONG, [
      rewrite(
        "Mentored 5 engineers through code reviews and pairing on GraphQL and testing practices.",
        "Mentored 5 engineers on GraphQL, TypeScript and testing practices through code reviews and pairing.",
      ),
    ]);
    expect(result.refused).toEqual([]);
    expect(result.text).toContain("Mentored 5 engineers on GraphQL, TypeScript");
    expect(result.changes[0]).toMatchObject({ kind: "reworded", section: "Experience" });
    expect(result.changes[0].diff.some((p) => p.op === "add")).toBe(true);
  });

  it("refuses edits it can't verify or that change facts", () => {
    const result = applyOps(STRONG, [
      rewrite("A line that is not on the resume.", "Something else entirely."),
      rewrite("Built a shared component library adopted by 12 product teams, reducing UI bugs by 30%.", "built a shared component library adopted by 12 product teams, reducing UI bugs by 30%"),
      rewrite("Built a shared component library adopted by 12 product teams, reducing UI bugs by 30%.", "Built a shared component library adopted by 15 product teams, reducing UI bugs by 30%."),
      rewrite("Developed checkout flows in React and Redux serving 2 million daily users.", "Developed checkout flows in React and Redux serving 2 million daily users, raising conversion 20%."),
    ]);
    expect(result.text).toBe(STRONG);
    expect(result.refused.map((r) => r.reason)).toEqual([
      "the quoted line is not on the resume",
      "only punctuation or casing changed",
      "it changes or adds a number",
      "it changes or adds a number",
    ]);
  });

  it("adds skills the job or the resume names, and only those", () => {
    const result = applyOps(
      STRONG,
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
    expect(result.text.trimEnd().endsWith("Performance Optimization, Kubernetes, Lighthouse")).toBe(true);
  });

  it("starts a Skills section when the resume has none", () => {
    const result = applyOps("EXPERIENCE\n• Built dashboards in Grafana for the ops team.", [{ op: "add_skill", skill: "Grafana" }]);
    expect(result.text.endsWith("SKILLS\nGrafana\n")).toBe(true);
  });
});
