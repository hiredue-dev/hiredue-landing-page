"use client";

import { motion } from "framer-motion";
import { spring } from "@/lib/motion";
import { ats } from "@/lib/content";
import { getScoreTier } from "../domain/report.js";

/**
 * Presents a backend-computed score as an animated 0–100 ring. It never
 * computes, interprets or recalculates the score — it only *presents* the value
 * the backend returned, using the guaranteed colour semantics (red < 50,
 * amber 50–74, green ≥ 75). The number is also rendered as text for
 * non-visual accessibility.
 */
const TIER_STYLES = {
  low: {
    color: "#e5484d",
    border: "border-red-500",
    text: "text-red-600",
  },
  mid: {
    color: "#d97706",
    border: "border-amber-500",
    text: "text-amber-600",
  },
  high: {
    color: "#16a34a",
    border: "border-green-600",
    text: "text-green-600",
  },
};

function verdictLabel(verdict, tier) {
  if (verdict) return verdict;
  if (tier === "low") return ats.score.verdicts.low;
  if (tier === "mid") return ats.score.verdicts.mid;
  return ats.score.verdicts.high;
}

export function AtsScoreMeter({ score = 0, verdict = "", scoringVersion = "" }) {
  const tier = getScoreTier(score);
  const style = TIER_STYLES[tier];
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.max(0, Math.min(score, 100)) / 100);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative" role="img" aria-label={`ATS score ${score} out of 100`}>
        <svg
          width="220"
          height="220"
          viewBox="0 0 200 200"
          className="rotate-[-90deg]"
        >
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="12"
            className="text-line"
          />
          <motion.circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke={style.color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            whileInView={{ strokeDashoffset: offset }}
            viewport={{ once: true }}
            transition={spring(0.8, 0.2)}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-display text-[56px] leading-none font-bold ${style.text}`}>
            {score}
          </span>
          <span className="text-[12px] font-medium tracking-wide text-dim">
            / 100
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-1 text-center">
        <p className={`t-h5 ${style.text}`}>{verdictLabel(verdict, tier)}</p>
        {scoringVersion ? (
          <p className="text-[13px] text-dim">
            {ats.score.scoringVersionLabel}: {scoringVersion}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export default AtsScoreMeter;