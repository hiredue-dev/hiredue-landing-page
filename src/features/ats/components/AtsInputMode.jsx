"use client";

import { Briefcase, FileText } from "lucide-react";
import { Reveal } from "@/components/site/ui/Primitives";
import { ats } from "@/lib/content";

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
      <Reveal className="w-full">
        <h2 className="t-h2">{ats.inputMode.title}</h2>
      </Reveal>

      <Reveal className="mt-10 grid gap-5 md:grid-cols-2">
        {MODES.map((option) => {
          const Icon = option.icon;
          const copy = ats.inputMode[option.contentKey];
          const active = value === option.id;
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange && onChange(option.id)}
              className={[
                "flex cursor-pointer items-start gap-4 rounded-[20px] border p-6 text-left transition-colors",
                active
                  ? "border-brand bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
                  : "border-line bg-white hover:border-brand/40",
              ].join(" ")}
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-[12px] bg-brand/10 text-brand">
                <Icon aria-hidden className="size-5" />
              </span>
              <span className="flex flex-col">
                <span className="t-h5">{copy.title}</span>
                <span className="mt-1 text-[14px] leading-[1.5] text-dim">
                  {copy.text}
                </span>
              </span>
            </button>
          );
        })}
      </Reveal>
      <Reveal>
        <p className="mt-4 text-[13px] text-dim">{ats.inputMode.note}</p>
      </Reveal>
    </section>
  );
}

export default AtsInputMode;