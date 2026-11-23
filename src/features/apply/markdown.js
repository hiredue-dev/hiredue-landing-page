/*
 * A small Markdown reader for job descriptions written in the campus
 * dashboard: headings, paragraphs, bullet and numbered lists, rules, bold,
 * italic, inline code and links. It returns a tree that Markdown.jsx turns
 * into React elements, so nothing the company typed is ever injected as HTML
 * and no Markdown library ships to the page. Anything it does not understand
 * is shown as plain text.
 */

const HEADING = /^(#{1,6})\s+(.*?)\s*#*\s*$/;
const BULLET = /^\s*[-*+•]\s+(.*)$/;
const ORDERED = /^\s*(\d{1,3})[.)]\s+(.*)$/;
const RULE = /^\s*([-*_])(\s*\1){2,}\s*$/;
const QUOTE = /^\s*>\s?(.*)$/;

/** Only links that go somewhere safe. */
export function safeHref(url) {
  const text = String(url ?? "").trim();
  return /^(https?:\/\/|mailto:)/i.test(text) ? text : null;
}

/**
 * @returns {Array<
 *   {type: "heading", level: number, children: object[]} |
 *   {type: "paragraph", lines: object[][]} |
 *   {type: "list", ordered: boolean, start: number, items: object[][]} |
 *   {type: "rule"}
 * >}
 */
export function parseMarkdown(source) {
  const lines = String(source ?? "").replace(/\r\n?/g, "\n").split("\n");
  const blocks = [];
  let paragraph = null;
  let list = null;

  const flush = () => {
    if (paragraph) blocks.push({ type: "paragraph", lines: paragraph.map(parseInline) });
    if (list) blocks.push({ type: "list", ordered: list.ordered, start: list.start, items: list.items.map(parseInline) });
    paragraph = null;
    list = null;
  };

  for (const raw of lines) {
    const line = raw.replace(/\t/g, "    ");
    if (!line.trim()) {
      flush();
      continue;
    }
    if (RULE.test(line)) {
      flush();
      blocks.push({ type: "rule" });
      continue;
    }
    const heading = line.match(HEADING);
    if (heading) {
      flush();
      blocks.push({ type: "heading", level: heading[1].length, children: parseInline(heading[2]) });
      continue;
    }
    const bullet = line.match(BULLET);
    const ordered = !bullet && line.match(ORDERED);
    if (bullet || ordered) {
      const isOrdered = !!ordered;
      if (paragraph || (list && list.ordered !== isOrdered)) flush();
      if (!list) list = { ordered: isOrdered, start: isOrdered ? Number(ordered[1]) : 1, items: [] };
      list.items.push(bullet ? bullet[1] : ordered[2]);
      continue;
    }
    // An indented line right after a list item continues that item.
    if (list && /^\s{2,}\S/.test(line)) {
      list.items[list.items.length - 1] += ` ${line.trim()}`;
      continue;
    }
    if (list) flush();
    const quote = line.match(QUOTE);
    (paragraph ??= []).push((quote ? quote[1] : line).trim());
  }
  flush();
  return blocks;
}

// Order matters: code first (its content is literal), then links, then emphasis.
// No lookbehind: Safari before 16.4 fails to parse the whole module on one.
const INLINE = [
  { type: "code", re: /`([^`]+)`/ },
  { type: "link", re: /\[([^\]]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/ },
  { type: "strong", re: /\*\*(?=\S)([\s\S]*?\S)\*\*|__(?=\S)([\s\S]*?\S)__/ },
  { type: "em", re: /\*(?=\S)([^*]*?\S)\*|\b_(?=\S)([^_]*?\S)_\b/ },
];

/** "a **b** [c](https://x)" → [{type:"text",value:"a "},{type:"strong",children:[…]},…] */
export function parseInline(text) {
  const source = String(text ?? "");
  if (!source) return [];
  let best = null;
  for (const rule of INLINE) {
    const match = rule.re.exec(source);
    if (match && (best === null || match.index < best.match.index)) best = { rule, match };
  }
  if (!best) return [{ type: "text", value: source }];

  const { rule, match } = best;
  const before = source.slice(0, match.index);
  const after = source.slice(match.index + match[0].length);
  let node;
  if (rule.type === "code") node = { type: "code", value: match[1] };
  else if (rule.type === "link") {
    const href = safeHref(match[2]);
    node = href ? { type: "link", href, children: parseInline(match[1]) } : { type: "text", value: match[1] };
  } else node = { type: rule.type, children: parseInline(match[1] ?? match[2]) };

  return [...(before ? [{ type: "text", value: before }] : []), node, ...parseInline(after)];
}
