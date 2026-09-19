"use client";

import { Lock } from "lucide-react";
import { ArrowButton, SlideButton } from "@/components/site/ui/Button";
import { Eyebrow, Reveal } from "@/components/site/ui/Primitives";
import { ats } from "@/lib/content";

/**
 * The authentication boundary — non-negotiable. When a visitor has an uploaded,
 * pending resume but is NOT authenticated, this is the ONLY thing shown for the
 * scan stage. It deliberately renders NO real score, preview, verdict, category
 * scores, keyword analysis or suggestions.
 *
 * Instead it shows a *locked, blurred* representation of the ATS result — a
 * score ring and report cards drawn purely as blurred silhouettes so the layout
 * reads "your result is here" without leaking any meaningful number or analysis.
 *
 * Two direct actions — Sign Up and Log In — hand off to the existing /signup
 * and /login routes with `redirect=/ats`, reusing the existing auth system (no
 * second auth implementation). The pending upload is preserved across that
 * round-trip by the workflow hook. No intermediate "authenticate" screen.
 */
const SIGNUP_HREF = "/signup?redirect=%2Fats";
const LOGIN_HREF = "/login?redirect=%2Fats";

/** A blurred stand-in for the score ring — no real number is ever rendered. */
function LockedScoreRing() {
  return (
    <div className="relative mx-auto size-[220px]" aria-hidden>
      <svg
        width="220"
        height="220"
        viewBox="0 0 200 200"
        className="rotate-[-90deg]"
      >
        <circle
          cx="100"
          cy="100"
          r={90}
          fill="none"
          stroke="currentColor"
          strokeWidth="12"
          className="text-line"
        />
        <circle
          cx="100"
          cy="100"
          r={90}
          fill="none"
          stroke="currentColor"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={2 * Math.PI * 90}
          strokeDashoffset={2 * Math.PI * 90 * 0.32}
          className="text-brand/50 blur-[3px]"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-[56px] leading-none font-bold text-ink/50 blur-[6px] select-none">
          ···
        </span>
        <span className="text-[12px] font-medium tracking-wide text-dim blur-[2px] select-none">
          / 100
        </span>
      </div>
    </div>
  );
}

/** A single blurred report card (category/breakdown row, no real content). */
function LockedReportCard() {
  return (
    <div className="rounded-[16px] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between gap-4">
        <span className="h-4 w-24 rounded bg-surface blur-[3px]" />
        <span className="h-5 w-10 rounded bg-surface blur-[3px]" />
      </div>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-surface">
        <div className="h-full w-3/5 rounded-full bg-brand/40 blur-[3px]" />
      </div>
    </div>
  );
}

/** Blurred keyword pills (no real keywords). */
function LockedKeywords() {
  return (
    <div className="flex flex-wrap gap-3">
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className="inline-flex h-8 w-24 rounded-full bg-white/80 blur-[4px]"
        />
      ))}
    </div>
  );
}

export function AtsAuthGate() {
  return (
    <Reveal className="rounded-[24px] border border-line bg-white p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)] md:p-12">
      {/* ---- Locked, blurred result representation ---- */}
      <div className="relative overflow-hidden rounded-[20px] bg-surface/60 p-8 md:p-10">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-[20px] bg-[rgba(237,241,244,0.18)]"
        >
          <span className="grid size-14 place-items-center rounded-full bg-white text-ink shadow-[0_8px_16px_rgba(29,29,29,0.12)] ring-1 ring-line">
            <Lock className="size-6" />
          </span>
        </div>

        <div className="flex flex-col gap-6 select-none">
          <LockedScoreRing />
          <div className="grid gap-4 md:grid-cols-2">
            <LockedReportCard />
            <LockedReportCard />
          </div>
          <LockedKeywords />
        </div>
      </div>

      {/* ---- Clear messaging + direct actions (not blurred) ---- */}
      <div className="mt-10 flex flex-col items-center gap-6 text-center">
        <Eyebrow>{ats.auth.eyebrow}</Eyebrow>
        <div className="flex flex-col items-center gap-3">
          <h3 className="t-h3">{ats.auth.title}</h3>
          <p className="t-body max-w-[560px] text-dim">
            {ats.auth.description}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-5">
          <ArrowButton
            label={ats.auth.signupLabel}
            href={SIGNUP_HREF}
            tone="dark"
          />
          <SlideButton
            label={ats.auth.loginLabel}
            href={LOGIN_HREF}
            tone="white"
          />
        </div>

        <p className="text-[13px] font-medium tracking-wide text-dim">
          {ats.auth.lockedNote}
        </p>
      </div>
    </Reveal>
  );
}

export default AtsAuthGate;
