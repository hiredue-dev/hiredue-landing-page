"use client";

import { FileText } from "lucide-react";
import { Eyebrow, Reveal } from "@/components/site/ui/Primitives";
import { ats } from "@/lib/content";

/**
 * First-viewport copy for /ats — the "why this exists" half of the hero.
 * Deliberately lean: eyebrow → one dominant H1 → a single supporting sentence,
 * the formats / 10 MB chip, and three compact trust chips. The primary action
 * (upload + "Scan My Resume") is the workflow card immediately below, so the
 * reader reaches the interaction without wading through copy.
 *
 * Purely presentational — copy lives in `ats.hero` and `ats.upload`.
 */
export function AtsLandingHero() {
  const { hero } = ats;
  return (
    <Reveal className="flex flex-col items-start">
      <Eyebrow className="uppercase tracking-[0.18em]">{hero.eyebrow}</Eyebrow>
      <h1 className="t-h2-feature mt-4 max-w-[16ch]">{hero.title}</h1>
      <p className="t-body-lg mt-4 max-w-[520px] text-dim">
        {hero.description}
      </p>

      {/* Format / size guidance — the "what can I upload?" answer */}
      <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-[14px] font-medium text-dim">
        <FileText aria-hidden className="size-4 text-brand" />
        {ats.upload.formats.join(", ")} · {ats.upload.sizeNote} · {ats.upload.formsAllowed}
      </p>

      {/* Compact trust row — three short guarantees, kept minimal so the
          upload interaction stays the clear focus of this viewport. */}
      <ul className="mt-6 flex flex-wrap gap-2.5">
        {hero.points.map((point) => (
          <li
            key={point.title}
            className="inline-flex items-center gap-2 rounded-full bg-surface px-3.5 py-2 text-[13px] font-medium text-ink"
          >
            <span
              aria-hidden
              className="size-1.5 shrink-0 rounded-full bg-brand"
            />
            {point.title}
          </li>
        ))}
      </ul>
    </Reveal>
  );
}

export default AtsLandingHero;
