"use client";

import { motion } from "framer-motion";
import { ats } from "@/lib/content";
import { getKeyMetrics, getScoreTier } from "../domain/report.js";
import { spring } from "@/lib/motion";

/**
 * AtsScoreSummary — the single dominant-but-compact "how did it score?" unit
 * at the top of the analysis rail.
 *
 * It presents the REAL headline score (report.finalScore, already normalized)
 * followed by the four supporting key metrics (Quality / Parse health /
 * Completeness / Content strength) as tight label + bar rows. The headline ring
 * is the visual anchor; the metric rows exist to *support* it, not compete with
 * it. Nothing here invents a second score, an improvement number, or a
 * recruiter/job-match figure — only `getKeyMetrics()` data is rendered, and a
 * metric the backend didn't return shows a dash rather than a fabricated value.
 *
 * Colours follow the site's tier semantics (red < 50, amber 50–74, green ≥ 75)
 * but the number is always shown as text too, so colour is never the only
 * signal.
 */
const TIER = {
  low: { color: "#e5484d", text: "text-red-600", label: ats.dashboard.summary.verdicts.low },
  mid: { color: "#d97706", text: "text-amber-600", label: ats.dashboard.summary.verdicts.mid },
  high: { color: "#16a34a", text: "text-green-600", label: ats.dashboard.summary.verdicts.high },
};

const METRIC_BAR_TIER = {
  low: "bg-red-500",
  mid: "bg-amber-500",
  high: "bg-green-600",
};

const METRIC_TEXT = {
  low: "text-red-600",
  mid: "text-amber-600",
  high: "text-green-600",
};

export function AtsScoreSummary({ score = 0, capped = false, report = null }) {
  const tier = getScoreTier(score);
  const style = TIER[tier] || TIER.mid;
  const summary =
    ats.dashboard.summary[tier] ?? ats.dashboard.summary.mid;

  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.max(0, Math.min(score, 100)) / 100);

  const metrics = getKeyMetrics(report);

  return (
    <section aria-labelledby="ats-score-summary" className="flex flex-col">
      {/* Headline score */}
      <div className="flex items-center gap-4">
        <div
          role="img"
          aria-label={`${ats.dashboard.scoreLabel} ${score} out of 100`}
          className="relative shrink-0"
        >
          <svg width="104" height="104" viewBox="0 0 104 104" className="rotate-[-90deg]">
            <circle
              cx="52"
              cy="52"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="9"
              className="text-line"
            />
            <motion.circle
              cx="52"
              cy="52"
              r={radius}
              fill="none"
              stroke={style.color}
              strokeWidth="9"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={spring(0.9, 0.2)}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`font-display text-[32px] leading-none font-bold ${style.text}`}>
              {score}
            </span>
            <span className="mt-0.5 text-[10px] font-medium tracking-wide text-dim">
              {ats.dashboard.scoreLabel}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <p className={`font-display text-[19px] leading-tight font-bold ${style.text}`}>
            {style.label}
          </p>
          <p className="text-[13px] leading-[1.5] text-dim">{summary}</p>
        </div>
      </div>

      {capped ? (
        <p
          role="status"
          className="mt-4 flex items-start gap-2 rounded-[12px] border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-[12px] leading-[1.5] text-amber-800"
        >
          <span className="mt-0.5 font-semibold">{ats.dashboard.cappedTag}:</span>
          <span>{ats.dashboard.cappedNote}</span>
        </p>
      ) : null}

      {/* Supporting key metrics — compact label + bar rows */}
      <div className="mt-5 flex flex-col">
        <p className="text-[11px] font-semibold tracking-[0.14em] text-dim uppercase">
          {ats.dashboard.metrics.eyebrow}
        </p>
        {metrics.length === 0 ? (
          <p className="mt-3 text-[13px] leading-[1.5] text-dim">
            {ats.dashboard.metrics.noData}
          </p>
        ) : (
          <ul className="mt-2 flex flex-col">
            {metrics.map((metric) => {
              const hasScore = typeof metric.score === "number";
              const metaTier = hasScore ? getScoreTier(metric.score) : null;
              return (
                <li
                  key={metric.id}
                  className="flex items-center gap-3 border-t border-line py-2.5 first:border-t-0"
                >
                  <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-ink">
                    {metric.label}
                  </span>
                  <div className="h-1.5 w-[92px] shrink-0 overflow-hidden rounded-full bg-surface">
                    {hasScore ? (
                      <motion.div
                        aria-hidden
                        className={`h-full origin-left rounded-full ${METRIC_BAR_TIER[metaTier]}`}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${metric.score}%` }}
                        viewport={{ once: true }}
                        transition={spring(0.8, 0.1)}
                      />
                    ) : null}
                  </div>
                  <span
                    className={`w-12 shrink-0 text-right text-[15px] leading-none font-bold tabular-nums ${
                      hasScore ? METRIC_TEXT[metaTier] : "text-dim"
                    }`}
                  >
                    {hasScore ? metric.score : "—"}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}

export default AtsScoreSummary;