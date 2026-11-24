import { describe, expect, it } from "vitest";
import { parseInline, parseMarkdown, safeHref } from "./markdown.js";

describe("parseMarkdown", () => {
  it("reads headings, paragraphs, lists and rules", () => {
    const blocks = parseMarkdown("## What you'll do\nBuild things.\nShip them.\n\n- React\n- TypeScript\n\n1. One\n2. Two\n\n---");
    expect(blocks.map((b) => b.type)).toEqual(["heading", "paragraph", "list", "list", "rule"]);
    expect(blocks[0].level).toBe(2);
    expect(blocks[1].lines).toHaveLength(2);
    expect(blocks[2]).toMatchObject({ ordered: false });
    expect(blocks[2].items).toHaveLength(2);
    expect(blocks[3]).toMatchObject({ ordered: true, start: 1 });
  });

  it("starts a list right after a paragraph line and joins indented continuations", () => {
    const blocks = parseMarkdown("Requirements:\n* 4+ years\n  of React\n• Good English");
    expect(blocks.map((b) => b.type)).toEqual(["paragraph", "list"]);
    expect(blocks[1].items[0]).toEqual([{ type: "text", value: "4+ years of React" }]);
    expect(blocks[1].items).toHaveLength(2);
  });

  it("handles empty input", () => {
    expect(parseMarkdown("")).toEqual([]);
    expect(parseMarkdown(null)).toEqual([]);
  });
});

describe("parseInline", () => {
  it("reads bold, italic, code and links", () => {
    expect(parseInline("a **b** _c_ `d` [e](https://x.com)")).toEqual([
      { type: "text", value: "a " },
      { type: "strong", children: [{ type: "text", value: "b" }] },
      { type: "text", value: " " },
      { type: "em", children: [{ type: "text", value: "c" }] },
      { type: "text", value: " " },
      { type: "code", value: "d" },
      { type: "text", value: " " },
      { type: "link", href: "https://x.com", children: [{ type: "text", value: "e" }] },
    ]);
  });

  it("leaves snake_case words alone", () => {
    expect(parseInline("use snake_case_names")).toEqual([{ type: "text", value: "use snake_case_names" }]);
  });

  it("drops unsafe links to plain text", () => {
    expect(parseInline("[click](javascript:alert(1))")).toEqual([
      { type: "text", value: "click" },
      { type: "text", value: ")" },
    ]);
    expect(parseInline("[x](/relative)")).toEqual([{ type: "text", value: "x" }]);
  });

  it("allows only http(s) and mailto hrefs", () => {
    expect(safeHref("https://a.com")).toBe("https://a.com");
    expect(safeHref("mailto:hr@a.com")).toBe("mailto:hr@a.com");
    expect(safeHref("javascript:alert(1)")).toBeNull();
    expect(safeHref("data:text/html,x")).toBeNull();
  });
});
