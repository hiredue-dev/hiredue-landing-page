"use client";

import { Briefcase, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { Eyebrow, Reveal, RevealGroup, RevealItem } from "@/components/site/ui/Primitives";
import { ats } from "@/lib/content";
import { spring } from "@/lib/motion";

/**
 * Lets the user choose how to start: a generic ATS compatibility scan, or a
 * job-description match (available after sign-in). Purely presentational —
 * selecting a mode only updates workflow state; it never triggers a scan.
 */
const MODES = [
  {
    id: "generic",
    icon: FileText,
    contentKey: "generic",
    requiresAuth: false,
  },
  {
    id: "match",
    icon: Briefcase,
    contentKey: "match",
    requiresAuth: true,
  },
];

export function AtsInputMode({ value = "generic", onChange }) {
  return (
    <section id="input-mode" className="mt-[120px] md:mt-[160px]">
      <Reveal className="flex flex-col items-start gap-2.5">
        <Eyebrow>{ats.inputMode.eyebrow}</Eyebrow>
        <h2 className="t-h2">{ats.inputMode.title}</h2>
      </Reveal>

      <RevealGroup step={0.08} className="mt-10 grid gap-5 md:grid-cols-2">
        {MODES.map((option) => {
          const Icon = option.icon;
          const copy = ats.inputMode[option.contentKey];
          const active = value === option.id;
          return (
            <RevealItem key={option.id}>
              <button
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => onChange && onChange(option.id)}
                className="relative flex h-full w-full cursor-pointer items-start gap-4 overflow-hidden rounded-[20px] border p-6 text-left transition-colors duration-300"
                style={{
                  borderColor: active ? "var(--color-brand)" : "var(--color-line)",
                  background: active
                    ? "linear-gradient(180deg,#fff_0%,#fff_100%)"
                    : "#fff",
                }}
              >
                {/* soft brand wash that fades in on the active card */}
                <motion.span
                  aria-hidden
                  initial={false}
                  animate={{ opacity: active ? 1 : 0 }}
                  transition={spring(0.5)}
                  className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(64,106,228,0.08)_0%,rgba(255,255,255,0)_100%)]"
                />
                {active ? (
                  <motion.span
                    layoutId="ats-mode-underline"
                    aria-hidden
                    transition={spring(0.5)}
                    className="absolute inset-x-0 bottom-0 h-[3px] origin-left"
                    style={{ background: "var(--color-brand)" }}
                  />
                ) : null}
                <span
                  className="grid size-11 shrink-0 place-items-center rounded-[12px] text-brand"
                  style={{ background: active ? "rgba(64,106,228,0.12)" : "rgba(64,106,228,0.1)" }}
                >
                  <Icon aria-hidden className="size-5" />
                </span>
                <span className="relative flex flex-col">
                  <span className="t-h5">{copy.title}</span>
                  <span className="mt-1 text-[14px] leading-[1.5] text-dim">
                    {copy.text}
                  </span>
                  <span className="mt-2 inline-flex w-fit items-center gap-1.5">
                    {option.requiresAuth ? (
                      <span className="rounded-full bg-surface px-2.5 py-1 text-[12px] font-medium text-dim">
                        {ats.inputMode.upgradeNote}
                      </span>
                    ) : null}
                  </span>
                </span>
              </button>
            </RevealItem>
          );
        })}
      </RevealGroup>
      <Reveal>
        <p className="mt-4 text-[13px] text-dim">{ats.inputMode.note}</p>
      </Reveal>
    </section>
  );
}

export default AtsInputMode;