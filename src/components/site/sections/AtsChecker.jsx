"use client";

import { Eyebrow, Reveal } from "@/components/site/ui/Primitives";
import { ArrowButton } from "@/components/site/ui/Button";
import { atsHome } from "@/lib/content";

/**
 * Homepage teaser for the ATS Score Checker. A short section that clearly
 * states the deterministic guarantee and links to the full checker at /ats.
 * Framed in the site's `surface` panel language so it reads as a first-class
 * section, not a floating standalone card. Presentational only — the
 * interactive workflow lives on the /ats page.
 */
export function AtsChecker() {
  return (
    <section id="ats-score" className="relative pt-[100px] min-[810px]:pt-[160px] min-[1200px]:pt-[200px]">
      <div className="container-page">
        <Reveal className="relative overflow-hidden rounded-[30px] bg-surface px-6 py-14 text-center md:px-10 md:py-20 min-[1200px]:py-24">
          {/* soft brand wash in the corner, same family as the site's panels */}
          <span
            aria-hidden
            className="pointer-events-none absolute -top-24 -right-10 -z-10 size-[300px] rounded-full bg-[radial-gradient(circle,rgba(64,106,228,0.08)_0%,rgba(255,255,255,0)_70%)]"
          />
          <div className="mx-auto flex max-w-[680px] flex-col items-center gap-[30px] text-center min-[810px]:gap-8 min-[1200px]:gap-10">
            <Eyebrow>{atsHome.eyebrow}</Eyebrow>
            <h2 className="t-h2 max-w-[15ch]">{atsHome.title}</h2>
            <p className="t-body-lg max-w-[680px] text-dim">
              {atsHome.description}
            </p>

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
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default AtsChecker;