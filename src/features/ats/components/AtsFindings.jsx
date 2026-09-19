"use client";

import { CircleAlert, CircleCheck, TriangleAlert } from "lucide-react";
import { ats } from "@/lib/content";
import { getAdvisories } from "../domain/report.js";

/**
 * AtsFindings — the compact "What needs attention" surface of the analysis
 * rail. It renders ONLY the real backend `advisories` (via getAdvisories) as a
 * tight list of scannable rows beside the actual resume. Advisory entries may
 * arrive as strings or objects; both are normalized defensively.
 *
 * Severity is read from the backend's own value and mapped to HireDue's
 * restrained status colours:
 *   - critical -> red dot/icon (blocking / problem)
 *   - warning  -> amber icon (needs attention)
 *   - info     -> neutral brand (a tip / observation)
 *
 * These rows sit BESIDE the resume, but the list never draws precise highlights
 * onto the document — the current API provides no annotation coordinates for
 * that. Colour is never the only signal: each row keeps its text label.
 */
const SEVERITY = {
  critical: { icon: CircleAlert, dot: "bg-red-500", color: "text-red-600" },
  warning: { icon: TriangleAlert, dot: "bg-amber-500", color: "text-amber-600" },
  info: { icon: CircleCheck, dot: "bg-brand", color: "text-brand" },
};

const DEFAULT_SEVERITY = SEVERITY.info;

function severityKey(severity) {
  return severity === "critical" || severity === "warning" ? severity : "info";
}

function severityLabel(severity) {
  const key = severity === "critical" || severity === "warning" ? severity : "info";
  return ats.advisories.severityLabels[key] || ats.advisories.severityLabels.info;
}

/** Normalize a single advisory into a stable { id, severity, title, detail }. */
function toFinding(advisory, index) {
  if (advisory == null) return null;
  const str = (value) => (typeof value === "string" ? value.trim() : "");
  let severity = "info";
  let title = "";
  let detail = "";
  if (typeof advisory === "string") {
    title = advisory.trim();
  } else if (typeof advisory === "object") {
    severity = typeof advisory.severity === "string"
      ? advisory.severity.toLowerCase()
      : "info";
    title = str(
      advisory.title || advisory.detail || advisory.message || advisory.label || "",
    );
    detail = str(advisory.detail || advisory.message || "");
  }
  if (!title && !detail) return null;
  const key = severityKey(severity);
  const style = SEVERITY[key] || DEFAULT_SEVERITY;
  return {
    id: `${index}-${key}`,
    key,
    title: title || detail,
    detail,
    Icon: style.icon,
    dot: style.dot,
    color: style.color,
    label: severityLabel(severity),
  };
}

const MAX_FINDINGS = 6;

export function AtsFindings({ report = null }) {
  const findings = getAdvisories(report)
    .slice(0, MAX_FINDINGS)
    .map(toFinding)
    .filter(Boolean);

  return (
    <section aria-labelledby="ats-findings" className="flex flex-col">
      <div className="flex items-center justify-between gap-3">
        <h2
          id="ats-findings"
          className="text-[13px] leading-none font-semibold tracking-[0.02em] text-ink"
        >
          {ats.dashboard.needsAttention.title}
        </h2>
        {findings.length > 0 ? (
          <span className="inline-flex items-center rounded-full bg-surface px-2.5 py-1 text-[11px] font-semibold text-dim tabular-nums">
            {findings.length}
          </span>
        ) : null}
      </div>

      {findings.length === 0 ? (
        <p className="mt-3 text-[13px] leading-[1.55] text-dim">
          {ats.dashboard.needsAttention.empty}
        </p>
      ) : (
        <ul className="mt-2 flex flex-col">
          {findings.map((finding) => {
            const Icon = finding.Icon;
            return (
              <li
                key={finding.id}
                className="flex items-start gap-3 border-t border-line py-3"
              >
                <Icon aria-hidden className={`mt-0.5 size-4 shrink-0 ${finding.color}`} />
                <div className="flex min-w-0 flex-col gap-1">
                  <p className="text-[14px] leading-[1.45] font-medium text-ink">
                    {finding.title}
                  </p>
                  {finding.detail ? (
                    <p className="text-[13px] leading-[1.5] text-dim">
                      {finding.detail}
                    </p>
                  ) : null}
                  <span className="inline-flex items-center gap-1.5 pt-0.5 text-[11px] font-medium text-dim">
                    <span aria-hidden className={`size-1.5 rounded-full ${finding.dot}`} />
                    {finding.label}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export default AtsFindings;