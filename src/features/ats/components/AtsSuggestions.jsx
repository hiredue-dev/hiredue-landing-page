"use client";

import { Sparkles } from "lucide-react";
import { Eyebrow, Reveal, RevealGroup, RevealItem } from "@/components/site/ui/Primitives";
import { ats } from "@/lib/content";
import { getSuggestions } from "../domain/report.js";

/**
 * Presents actionable, backend-authored suggestions (not marketing copy). It
 * only renders what the engine returned; suggestions are bounded to a safe
 * count to keep the presentation predictable.
 */

const MAX_SUGGESTIONS = 6;

export function AtsSuggestions({ report = null }) {
  const suggestions = getSuggestions(report).slice(0, MAX_SUGGESTIONS);

  return (
    <section className="mt-[120px] md:mt-[160px]">
      <Reveal className="flex flex-col items-start gap-3">
        <Eyebrow>{ats.suggestions.eyebrow}</Eyebrow>
        <h2 className="t-h2">{ats.suggestions.title}</h2>
      </Reveal>

      {suggestions.length === 0 ? (
        <Reveal>
          <p className="t-body mt-6 text-dim">{ats.suggestions.noData}</p>
        </Reveal>
      ) : (
        <RevealGroup step={0.07} className="mt-10 grid gap-5 md:grid-cols-3">
          {suggestions.map((suggestion, index) => (
            <RevealItem
              key={index}
              className="rounded-[20px] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
            >
              <span className="grid size-11 place-items-center rounded-[12px] bg-brand/10 text-brand">
                <Sparkles aria-hidden className="size-5" />
              </span>
              <h3 className="t-h5 mt-4">{suggestion.title}</h3>
              <p className="mt-2 text-[15px] leading-[1.6] text-dim">
                {suggestion.detail}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>
      )}
    </section>
  );
}

export default AtsSuggestions;