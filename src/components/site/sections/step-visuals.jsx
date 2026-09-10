"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { Mark } from "@/components/site/ui/Mark";
import { marks } from "@/lib/assets";
import { spring } from "@/lib/motion";

/** Ticks a counter 0..(loop-1) forever, `stepMs` apart. */
function useTicker(loop, stepMs) {
  const [t, setT] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setT((v) => (v + 1) % loop), stepMs);
    return () => clearInterval(id);
  }, [loop, stepMs]);
  return t;
}

/* ------------------------------------------------------------------ */
/* Step 1 — Download & Install                                          */
/* ------------------------------------------------------------------ */

const DL_LOOP = 36;
const DL_DOWNLOADING_END = 12;
const DL_INSTALLING_END = 20;

export function DownloadVisual() {
  const t = useTicker(DL_LOOP, 220);
  const phase = t < DL_DOWNLOADING_END ? "download" : t < DL_INSTALLING_END ? "install" : "done";
  const pct = phase === "download" ? Math.round((t / DL_DOWNLOADING_END) * 100) : 100;

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        <motion.div
          animate={{ y: phase === "done" ? 0 : [0, -4, 0] }}
          transition={{ duration: 1.6, repeat: phase === "done" ? 0 : Infinity, ease: "easeInOut" }}
          className="grid size-20 place-items-center rounded-[22px] bg-[linear-gradient(135deg,#323232_0%,#000_100%)] btn-emboss"
        >
          <AnimatePresence mode="wait">
            {phase === "done" ? (
              <motion.svg
                key="check"
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={spring(0.5)}
                viewBox="0 0 24 24"
                aria-hidden
                className="size-8"
              >
                <path
                  d="M5 13l4.5 4.5L19 8"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </motion.svg>
            ) : (
              <motion.svg
                key="arrow"
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.4, opacity: 0 }}
                transition={spring(0.4)}
                viewBox="0 0 24 24"
                aria-hidden
                className="size-8"
              >
                <path
                  d="M12 3v12m0 0l-4.5-4.5M12 15l4.5-4.5M4 18v1a2 2 0 002 2h12a2 2 0 002-2v-1"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </motion.svg>
            )}
          </AnimatePresence>
        </motion.div>
        {phase === "download" && (
          <motion.span
            aria-hidden
            initial={{ y: -28, opacity: 0 }}
            animate={{ y: 8, opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1.1, repeat: Infinity }}
            className="absolute inset-x-0 top-0 mx-auto block size-2 rounded-full bg-brand"
          />
        )}
      </div>

      <div className="flex w-[240px] flex-col items-center gap-2.5">
        <span className="text-[15px] leading-none font-semibold text-ink">
          {phase === "download" && "Downloading HireDue…"}
          {phase === "install" && "Installing…"}
          {phase === "done" && "Ready to go"}
        </span>
        <span className="relative h-2 w-full overflow-hidden rounded-full bg-line">
          {phase === "install" ? (
            <motion.span
              className="absolute inset-y-0 w-1/3 rounded-full bg-brand"
              animate={{ left: ["-33%", "100%"] }}
              transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
            />
          ) : (
            <motion.span
              className={clsx(
                "block h-full rounded-full",
                phase === "done" ? "bg-success" : "bg-brand",
              )}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.2, ease: "linear" }}
            />
          )}
        </span>
        <span className="text-[12px] leading-none font-medium text-dim">
          {phase === "download" && `${pct}%`}
          {phase === "install" && "Almost there…"}
          {phase === "done" && "HireDue is installed"}
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Step 2 — Connect Everything                                          */
/* ------------------------------------------------------------------ */

const CN_LOOP = 30;

const required = [
  { name: "Gmail", icon: marks.gmail, color: "#ea4335", tint: "rgba(234,67,53,0.10)", at: 5 },
  { name: "LinkedIn", icon: marks.linkedin, color: "#0a66c2", tint: "rgba(10,102,194,0.10)", at: 8 },
];

const optional = [
  { name: "Wellfound", icon: marks.wellfound, color: "#000000", at: 11 },
  { name: "naukri", icon: undefined, color: "#4d585f", at: 13 },
  { name: "Indeed", icon: marks.indeed, color: "#003a9b", at: 15 },
];

export function ConnectVisual() {
  const t = useTicker(CN_LOOP, 260);
  const resumeDone = t >= 3;

  return (
    <div className="flex w-[280px] flex-col gap-3.5">
      <div className="flex items-center gap-2.5 rounded-[12px] bg-white px-3.5 py-2.5 shadow-[0_4px_14px_rgba(29,29,29,0.06)]">
        <span className="grid size-8 shrink-0 place-items-center rounded-[8px] bg-surface">
          <svg viewBox="0 0 24 24" aria-hidden className="size-4">
            <path
              d="M7 3h7l4 4v14a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1z"
              fill="none"
              stroke="#4d585f"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <path d="M14 3v4h4" fill="none" stroke="#4d585f" strokeWidth="1.6" strokeLinejoin="round" />
          </svg>
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] leading-[1.2] font-semibold text-ink">
            resume.pdf
          </span>
          <span className="mt-1 block h-[3px] w-full overflow-hidden rounded-full bg-line">
            <motion.span
              className="block h-full rounded-full bg-brand"
              animate={{ width: resumeDone ? "100%" : "35%" }}
              transition={{ duration: 0.6 }}
            />
          </span>
        </span>
        <AnimatePresence>
          {resumeDone && (
            <motion.span
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={spring(0.4)}
              className="grid size-5 shrink-0 place-items-center rounded-full bg-success-10"
            >
              <svg viewBox="0 0 24 24" aria-hidden className="size-3">
                <path
                  d="M5 13l4.5 4.5L19 8"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-col gap-2">
        {required.map((acc) => (
          <div
            key={acc.name}
            className="flex items-center gap-2.5 rounded-[12px] bg-white px-3.5 py-2.5 shadow-[0_4px_14px_rgba(29,29,29,0.06)]"
          >
            <span
              className="grid size-8 shrink-0 place-items-center rounded-[8px]"
              style={{ backgroundColor: acc.tint }}
            >
              <Mark src={acc.icon} color={acc.color} className="size-[15px]" />
            </span>
            <span className="flex-1 text-[13px] leading-none font-semibold text-ink">
              {acc.name}
            </span>
            <AnimatePresence mode="wait">
              <motion.span
                key={t >= acc.at ? "on" : "off"}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={spring(0.3)}
                className={clsx(
                  "rounded-full px-2.5 py-1 text-[11px] leading-none font-semibold",
                  t >= acc.at ? "bg-success-10 text-success" : "bg-surface text-dim",
                )}
              >
                {t >= acc.at ? "Connected" : "Connecting…"}
              </motion.span>
            </AnimatePresence>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {optional.map((opt) => (
          <motion.span
            key={opt.name}
            animate={{
              opacity: t >= opt.at ? 1 : 0.45,
              scale: t === opt.at ? 1.06 : 1,
            }}
            transition={spring(0.4)}
            className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 shadow-[0_2px_8px_rgba(29,29,29,0.05)]"
          >
            {opt.icon ? (
              <Mark src={opt.icon} color={opt.color} className="size-[12px]" />
            ) : (
              <span className="text-[11px] leading-none font-bold text-ink">{opt.name}</span>
            )}
            {opt.icon && (
              <span className="text-[11px] leading-none font-semibold text-ink">{opt.name}</span>
            )}
            {t >= opt.at && <span className="size-1.5 rounded-full bg-success" />}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Step 3 — Set Your Preferences                                        */
/* ------------------------------------------------------------------ */

const PF_LOOP = 34;
const fields = [
  { label: "Expected salary", value: "₹28,00,000", at: 3 },
  { label: "Preferred location", value: "Bengaluru · Remote", at: 8 },
  { label: "Job title", value: "Senior Frontend Engineer", at: 13 },
];

export function PreferencesVisual() {
  const t = useTicker(PF_LOOP, 240);
  const allSaved = t >= 18;

  return (
    <div className="flex w-[300px] flex-col gap-2.5">
      {fields.map((f) => {
        const on = t >= f.at;
        return (
          <div
            key={f.label}
            className="flex items-center gap-3 rounded-[12px] bg-white px-4 py-3 shadow-[0_4px_14px_rgba(29,29,29,0.06)]"
          >
            <span className="min-w-0 flex-1">
              <span className="block text-[11px] leading-none font-medium text-dim">
                {f.label}
              </span>
              <span className="mt-1.5 block h-[15px] overflow-hidden">
                <AnimatePresence>
                  {on && (
                    <motion.span
                      initial={{ y: 14, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={spring(0.4)}
                      className="block truncate text-[14px] leading-none font-semibold text-ink"
                    >
                      {f.value}
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
            </span>
            <AnimatePresence>
              {on && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={spring(0.4)}
                  className="grid size-5 shrink-0 place-items-center rounded-full bg-success-10"
                >
                  <svg viewBox="0 0 24 24" aria-hidden className="size-3">
                    <path
                      d="M5 13l4.5 4.5L19 8"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        );
      })}

      <AnimatePresence>
        {allSaved && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={spring(0.4)}
            className="flex items-center justify-center gap-1.5 rounded-full bg-success-10 px-3 py-2"
          >
            <span className="size-1.5 rounded-full bg-success" />
            <span className="text-[12px] leading-none font-semibold text-success">
              Preferences saved
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Step 4 — Let It Run                                                   */
/* ------------------------------------------------------------------ */

const RUN_LOOP = 9999;
const runLog = [
  "Applied · Backend Engineer",
  "Emailed recruiter at Acme",
  "Applied · Data Analyst",
  "LinkedIn note sent",
];

export function RunVisual() {
  const t = useTicker(RUN_LOOP, 900);
  const applied = 128 + t;
  const line = runLog[t % runLog.length];

  return (
    <div className="flex flex-col items-center gap-5">
      {/* laptop, drawn in CSS: a screen with the agent's status, propped on a base */}
      <div className="flex flex-col items-center">
        <div className="flex h-[190px] w-[280px] flex-col justify-between rounded-t-[16px] rounded-b-[4px] border-[7px] border-[#1d1d1d] bg-black p-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <motion.span
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.4, repeat: Infinity }}
                className="size-[7px] rounded-full bg-success"
              />
              <span className="text-[11px] leading-none font-semibold tracking-wide text-white">
                AGENT ACTIVE
              </span>
            </span>
            <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[9px] leading-none font-semibold text-grey">
              24/7
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="font-display text-[30px] leading-none font-semibold text-white">
              {applied}
            </span>
            <span className="text-[11px] leading-none font-medium text-grey">applications sent</span>
          </div>

          <div className="h-[16px] overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={line}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={spring(0.4)}
                className="truncate text-[11px] leading-[16px] font-medium text-grey"
              >
                {line}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
        <span className="h-[8px] w-[310px] rounded-b-[6px] bg-[#1d1d1d]" />
        <span className="h-[3px] w-[130px] rounded-b-[4px] bg-[#0d0d0d]" />
      </div>

      <div className="flex items-center gap-2 rounded-full bg-white px-3.5 py-2 shadow-[0_4px_14px_rgba(29,29,29,0.06)]">
        <span className="relative">
          <svg viewBox="0 0 24 24" aria-hidden className="size-4">
            <path
              d="M6 9h11a1 1 0 011 1 4 4 0 01-4 4H9a4 4 0 01-4-4V9z"
              fill="none"
              stroke="#4d585f"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <path d="M17 10h1.5a2 2 0 010 4H17" fill="none" stroke="#4d585f" strokeWidth="1.6" />
            <path d="M5 20h11" stroke="#4d585f" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          {[0, 1].map((i) => (
            <motion.span
              key={i}
              aria-hidden
              animate={{ y: [-2, -10], opacity: [0, 0.6, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.6, ease: "easeOut" }}
              className="absolute -top-1 left-1/2 h-2 w-px -translate-x-1/2 bg-grey"
            />
          ))}
        </span>
        <span className="text-[12px] leading-none font-medium text-dim">
          You: grabbing a coffee ☕
        </span>
      </div>
    </div>
  );
}
