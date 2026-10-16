"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import { resumeDiff } from "../diff.js";
import { SECTION_LABELS, readResume } from "../resumeText.js";

// Enough to see what kind of changes were made; the rest is one click away.
const FIRST_SHOWN = 4;

const ROW = {
  del: { row: "bg-danger-05", mark: "rounded-[3px] bg-danger/15 text-ink no-underline", sign: "−", label: "Removed: ", text: "text-dim" },
  add: { row: "bg-success-10", mark: "rounded-[3px] bg-success/25 text-ink no-underline", sign: "+", label: "Added: ", text: "text-ink" },
};

/** One removed or added line, with the words that changed marked. */
function DiffLine({ line }) {
  const style = ROW[line.op];
  const Mark = line.op === "del" ? "del" : "ins";
  return (
    <p className={clsx("flex gap-2.5 px-3 py-1.5 text-[14px] leading-[1.55]", style.row, style.text)}>
      <span className="w-2 shrink-0 select-none font-semibold text-dim/70" aria-hidden>
        {style.sign}
      </span>
      <span className="min-w-0 break-words">
        <span className="sr-only">{style.label}</span>
        {line.parts.map((part, k) =>
          part.changed ? (
            <Mark key={k} className={style.mark}>
              {part.text}
            </Mark>
          ) : (
            <span key={k}>{part.text}</span>
          ),
        )}
      </span>
    </p>
  );
}

function sectionAt(sections, lineIndex) {
  const hit = Object.entries(sections).find(([, s]) => lineIndex >= s.start - 1 && lineIndex < s.end);
  return hit ? SECTION_LABELS[hit[0]] : "Resume";
}

/**
 * The original resume against the new one, kept simple: only the lines that
 * changed, the old line in red above the new one in green, with the changed
 * words marked, grouped by where they sit on the resume.
 */
export function ResumeDiff({ before, after, changes = [] }) {
  const [showAll, setShowAll] = useState(false);

  const blocks = useMemo(() => {
    const { lines } = resumeDiff(before, after);
    const { sections } = readResume(after);
    const byId = new Map();
    for (const line of lines) {
      if (line.op === "same" || !line.parts.some((p) => p.text.trim())) continue;
      if (!byId.has(line.block)) byId.set(line.block, { id: line.block, section: sectionAt(sections, line.newAt), lines: [] });
      byId.get(line.block).lines.push(line);
    }
    const list = [...byId.values()];
    // Each rewrite's reason goes with the change that carries its new line.
    const used = new Set();
    for (const change of changes) {
      if (change.kind !== "reworded" || !change.reason) continue;
      const block = list.find(
        (b) => !used.has(b.id) && b.lines.some((l) => l.op === "add" && l.parts.map((p) => p.text).join("").includes(change.after)),
      );
      if (!block) continue;
      used.add(block.id);
      block.reason = change.reason;
    }
    return list;
  }, [before, after, changes]);

  if (!blocks.length) return null;
  const shown = showAll ? blocks : blocks.slice(0, FIRST_SHOWN);
  const hidden = blocks.length - shown.length;

  return (
    <section className="flex flex-col gap-2.5" aria-label="Changes to your resume" data-clarity-mask="True">
      <h4 className="text-[15px] font-semibold text-ink">
        What changed ({blocks.length})
      </h4>
      <ul className="flex flex-col gap-3">
        {shown.map((block) => (
          <li key={block.id} className="overflow-hidden rounded-[14px] border border-line bg-white">
            <p className="px-3 pt-2.5 pb-1.5 text-[12px] font-semibold tracking-[0.04em] text-dim uppercase">{block.section}</p>
            <div className="flex flex-col">
              {block.lines.map((line, k) => (
                <DiffLine key={k} line={line} />
              ))}
            </div>
            {block.reason && <p className="t-body-sm px-3 py-2.5">Why: {block.reason}</p>}
          </li>
        ))}
      </ul>
      {hidden > 0 && (
        <button type="button" onClick={() => setShowAll(true)} className="self-start text-[14px] font-semibold text-brand hover:underline">
          Show {hidden} more change{hidden === 1 ? "" : "s"}
        </button>
      )}
    </section>
  );
}
