"use client";

import { Eyebrow, Reveal } from "@/components/site/ui/Primitives";
import { ArrowButton } from "@/components/site/ui/Button";
import { atsHome } from "@/lib/content";

/**
 * Homepage teaser for the ATS Score Checker. A short section that clearly
 * states the deterministic guarantee and links to the full checker at /ats.
 * Presentational only — the interactive workflow lives on the /ats page.
 */
export function AtsChecker() {
  return (
    <section className="relative pt-[100px] min-[810px]:pt-[160px] min-[1200px]:pt-[200px]">
      <div className="container-page">
        <Reveal className="flex flex-col items-center gap-[30px] text-center min-[810px]:gap-8 min-[1200px]:gap-[40px]">
          <Eyebrow>{atsHome.eyebrow}</Eyebrow>
          <h2 className="t-h2 max-w-[15ch]">{atsHome.title}</h2>
          <p className="t-body max-w-[680px] text-dim">{atsHome.description}</p>

          <ul className="flex flex-wrap items-center justify-center gap-3">
            {atsHome.benefits.map((benefit) => (
              <li
                key={benefit}
                className="rounded-full border border-line bg-white px-4 py-2 text-[14px] font-medium text-ink"
              >
                {benefit}
              </li>
            ))}
          </ul>

          <ArrowButton
            label={atsHome.cta.label}
            href={atsHome.cta.href}
            tone="dark"
          />
        </Reveal>
      </div>
    </section>
  );
}

export default AtsChecker;