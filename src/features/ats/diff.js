/*
 * Which words of a rewritten line changed. Ported from the desktop app
 * (electron/resumeOptimization/domain/diff.cjs): the same tokens and the same
 * "cosmetic" rule, so a change the app would refuse is refused here too.
 */

// Words, the whitespace between them, and sentence punctuation as its own
// token. Punctuation inside a word ("Node.js", ".NET", "C++") stays part of it.
const tokens = (text) =>
  String(text ?? "")
    .split(/(\s+|[.,;:!?)](?=\s|$)|(?:^|(?<=\s))[(])/)
    .filter((t) => t !== undefined && t !== "");

// Longest common subsequence of two sequences, walked in reading order. On a
// tie `preferDel` puts the removal first, the way git prints a replaced line.
function lcsWalk(x, y, preferDel = false) {
  const lcs = Array.from({ length: x.length + 1 }, () => new Array(y.length + 1).fill(0));
  for (let i = x.length - 1; i >= 0; i -= 1) {
    for (let j = y.length - 1; j >= 0; j -= 1) {
      lcs[i][j] = x[i] === y[j] ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
    }
  }
  const steps = [];
  let i = 0;
  let j = 0;
  while (i < x.length || j < y.length) {
    if (i < x.length && j < y.length && x[i] === y[j]) {
      steps.push({ op: "same", i, j });
      i += 1;
      j += 1;
    } else if (j < y.length && (i >= x.length || (preferDel ? lcs[i][j + 1] > lcs[i + 1][j] : lcs[i][j + 1] >= lcs[i + 1][j]))) {
      steps.push({ op: "add", j });
      j += 1;
    } else {
      steps.push({ op: "del", i });
      i += 1;
    }
  }
  return steps;
}

/**
 * Longest common subsequence over tokens, as one line in reading order:
 * kept + added gives the new line, kept + removed the old one.
 * @returns {{text: string, op: "same"|"del"|"add"}[]}
 */
export function wordDiff(a, b) {
  const x = tokens(a);
  const y = tokens(b);
  return inlineRuns(lcsWalk(x, y).map((s) => ({ text: s.op === "add" ? y[s.j] : x[s.i], op: s.op })));
}

// Consecutive tokens with the same operation join, and a space between two
// additions (or two removals) joins them, so "payments service" is one span.
function inlineRuns(parts) {
  const bridged = parts.map((part, i) => {
    if (part.op !== "same" || part.text.trim()) return part;
    const prev = parts[i - 1]?.op;
    const next = parts[i + 1]?.op;
    return prev && prev !== "same" && prev === next ? { ...part, op: prev } : part;
  });
  const merged = [];
  for (const part of bridged) {
    const last = merged[merged.length - 1];
    if (last && last.op === part.op) last.text += part.text;
    else merged.push({ ...part });
  }
  // A replaced word reads removed-then-added, the way a diff is read.
  for (let k = 0; k + 1 < merged.length; k += 1) {
    if (merged[k].op === "add" && merged[k + 1].op === "del") [merged[k], merged[k + 1]] = [merged[k + 1], merged[k]];
  }
  return merged;
}

const words = (text) =>
  String(text ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s]|\.(?=\s|$)/g, " ")
    .split(/\s+/)
    .filter(Boolean);

/** True when two lines differ only in punctuation, case or spacing. */
export function isCosmetic(a, b) {
  return words(a).join(" ") === words(b).join(" ");
}

// Above this many token pairs a block is shown line by line, without word marks.
const MAX_WORD_PAIRS = 60_000;

/**
 * One side of a word diff, cut back into its lines. Every token is kept
 * (no bridging), so the side's text is exactly the lines it came from; a space
 * is marked only when the words on both sides of it are.
 */
function sideLines(parts, keep) {
  const segs = parts.filter((p) => p.op === "same" || p.op === keep).map((p) => ({ text: p.text, changed: p.op === keep }));
  segs.forEach((seg, k) => {
    if (seg.changed && !seg.text.trim()) seg.changed = Boolean(segs[k - 1]?.changed && segs[k + 1]?.changed && !seg.text.includes("\n"));
  });
  const lines = [[]];
  for (const seg of segs) {
    seg.text.split("\n").forEach((piece, n) => {
      if (n > 0) lines.push([]);
      if (!piece) return;
      const line = lines[lines.length - 1];
      const last = line[line.length - 1];
      if (last && last.changed === seg.changed) last.text += piece;
      else line.push({ text: piece, changed: seg.changed });
    });
  }
  return lines;
}

// The removed and added lines of one change block, with the words that differ marked.
function markBlock(dels, adds) {
  const whole = (text) => [{ text, changed: false }];
  if (!dels.length || !adds.length) return { dels: dels.map(whole), adds: adds.map(whole) };
  const x = tokens(dels.join("\n"));
  const y = tokens(adds.join("\n"));
  if (x.length * y.length > MAX_WORD_PAIRS) return { dels: dels.map(whole), adds: adds.map(whole) };
  const parts = lcsWalk(x, y).map((s) => ({ text: s.op === "add" ? y[s.j] : x[s.i], op: s.op }));
  return { dels: sideLines(parts, "del"), adds: sideLines(parts, "add") };
}

/**
 * A git-style diff of two whole resumes: every line with its old and new line
 * number, the words that changed marked inside changed lines.
 * @returns {{
 *   lines: {op: "same"|"del"|"add", oldNo: number|null, newNo: number|null, newAt: number, parts: {text: string, changed: boolean}[], block: number|null}[],
 *   added: number,
 *   removed: number,
 * }}
 * `newAt` is the 0-based line of the new text the line sits at (for a removed
 * line, the one after it); `block` groups a run of removed + added lines.
 */
export function resumeDiff(before, after) {
  const a = String(before ?? "").split("\n");
  const b = String(after ?? "").split("\n");
  const steps = lcsWalk(a, b, true);

  const lines = [];
  let block = -1;
  for (let k = 0; k < steps.length; ) {
    if (steps[k].op === "same") {
      const { i, j } = steps[k];
      lines.push({ op: "same", oldNo: i + 1, newNo: j + 1, newAt: j, parts: [{ text: a[i], changed: false }], block: null });
      k += 1;
      continue;
    }
    // A run of changes: removals first, then additions, words marked between them.
    const run = [];
    while (k < steps.length && steps[k].op !== "same") {
      run.push(steps[k]);
      k += 1;
    }
    const dels = run.filter((s) => s.op === "del");
    const adds = run.filter((s) => s.op === "add");
    // Runs sit between kept lines, so the line before (if any) is a kept one.
    const at = adds[0]?.j ?? lines[lines.length - 1]?.newNo ?? 0;
    const marked = markBlock(
      dels.map((s) => a[s.i]),
      adds.map((s) => b[s.j]),
    );
    block += 1;
    dels.forEach((s, n) => lines.push({ op: "del", oldNo: s.i + 1, newNo: null, newAt: at, parts: marked.dels[n], block }));
    adds.forEach((s, n) => lines.push({ op: "add", oldNo: null, newNo: s.j + 1, newAt: s.j, parts: marked.adds[n], block }));
  }

  return {
    lines,
    added: lines.filter((l) => l.op === "add").length,
    removed: lines.filter((l) => l.op === "del").length,
  };
}
