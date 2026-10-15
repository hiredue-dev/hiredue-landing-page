"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CircleAlert, Info, TriangleAlert } from "lucide-react";
import clsx from "clsx";
import { spring } from "@/lib/motion";
import { scoreBand } from "../scoring.js";

const TONE_TEXT = {
  success: "text-success",
  brand: "text-brand",
  warning: "text-[#c2410c]",
  danger: "text-danger",
};
const TONE_STROKE = {
  success: "var(--color-success)",
  brand: "var(--color-brand)",
  warning: "#ea580c",
  danger: "var(--color-danger)",
};

/** The overall score as a ring that fills to its value. */
export function ScoreRing({ score, size = 132, label = "ATS score" }) {
  const reduce = useReducedMotion();
  const band = scoreBand(score);
  const stroke = 10;
  const r = (size - stroke) / 2;
  const length = 2 * Math.PI * r;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }} role="img" aria-label={`${label}: ${score} out of 100, ${band.label}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-surface)" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={TONE_STROKE[band.tone]}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={length}
          initial={{ strokeDashoffset: reduce ? length * (1 - score / 100) : length }}
          animate={{ strokeDashoffset: length * (1 - score / 100) }}
          transition={spring(1.2, 0.1)}
        />
      </svg>
      <div aria-hidden className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-[40px] leading-none font-semibold text-ink">{score}</span>
        <span className={clsx("mt-1 text-[13px] font-semibold", TONE_TEXT[band.tone])}>{band.label}</span>
      </div>
    </div>
  );
}

export function CategoryBars({ categories, compareTo }) {
  return (
    <ul className="flex flex-col gap-3.5">
      {categories.map((category) => {
        const prev = compareTo?.find((c) => c.id === category.id);
        const delta = prev ? category.score - prev.score : 0;
        return (
          <li key={category.id} className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between gap-3 text-[14px] font-semibold text-ink">
              <span>{category.label}</span>
              <span className="tabular-nums text-dim">
                {delta > 0 && <span className="mr-1.5 text-success">+{delta}</span>}
                {category.score}/{category.max}
              </span>
            </div>
            <div
              className="h-2 overflow-hidden rounded-full bg-surface"
              role="meter"
              aria-label={category.label}
              aria-valuemin={0}
              aria-valuemax={category.max}
              aria-valuenow={category.score}
            >
              <motion.div
                className="h-full rounded-full bg-[linear-gradient(110deg,#3b82f6_0%,#406ae4_100%)]"
                initial={{ width: prev ? `${(prev.score / category.max) * 100}%` : 0 }}
                animate={{ width: `${(category.score / category.max) * 100}%` }}
                transition={spring(0.9, 0.15)}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

const SEVERITY = {
  high: { icon: CircleAlert, className: "text-danger", label: "High impact" },
  medium: { icon: TriangleAlert, className: "text-[#c2410c]", label: "Medium impact" },
  low: { icon: Info, className: "text-brand", label: "Low impact" },
};

export function IssueList({ issues, limit = 5 }) {
  if (!issues.length) {
    return <p className="t-body">No issues found. This resume covers everything the checker looks for.</p>;
  }
  return (
    <ul className="flex flex-col gap-3">
      {issues.slice(0, limit).map((issue) => {
        const { icon: Icon, className, label } = SEVERITY[issue.severity];
        return (
          <li key={issue.id} className="flex gap-3 rounded-[14px] border border-line bg-white p-4">
            <Icon size={18} className={clsx("mt-0.5 shrink-0", className)} aria-label={label} />
            <div className="flex flex-col gap-1">
              <p className="text-[15px] leading-[1.3] font-semibold text-ink">{issue.title}</p>
              <p className="t-body-sm">{issue.detail}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/** "62 → 78" with the gain. */
export function ScoreDelta({ label, before, after, suffix = "", detail }) {
  const gain = after - before;
  return (
    <div className="flex flex-col gap-2 rounded-[18px] bg-surface p-5">
      <p className="text-[14px] font-semibold text-dim">{label}</p>
      <p className="flex items-center gap-3 font-display text-[34px] leading-none font-semibold text-ink" aria-label={`${label}: ${before}${suffix} before, ${after}${suffix} after`}>
        <span className="text-dim/70">
          {before}
          {suffix}
        </span>
        <ArrowRight size={22} className="text-dim" aria-hidden />
        <span>
          {after}
          {suffix}
        </span>
        {gain !== 0 && (
          <span className={clsx("ml-1 rounded-full px-2.5 py-1 font-sans text-[13px] font-semibold", gain > 0 ? "bg-success-10 text-success" : "bg-danger-05 text-danger")}>
            {gain > 0 ? "+" : ""}
            {gain}
            {suffix}
          </span>
        )}
      </p>
      {detail && <p className="t-body-sm">{detail}</p>}
    </div>
  );
}
