"use client";

import { ArrowButton } from "@/components/site/ui/Button";
import { Eyebrow, Reveal } from "@/components/site/ui/Primitives";
import { ats } from "@/lib/content";

/**
 * Landing hero for the /ats page. Pure presentation — copy comes from
 * `ats.hero`, and the CTA scrolls to the upload workflow (anchor `#scan`).
 * The CTA is the site's native ArrowButton so it animates exactly like the
 * rest of the landing page.
 */
export function AtsLandingHero() {
  const { hero } = ats;
  return (
    <Reveal className="flex flex-col items-center text-center">
      <Eyebrow>{hero.eyebrow}</Eyebrow>
      <h1 className="t-h1 mt-4 max-w-[18ch]">{hero.title}</h1>
      <p className="t-body mt-5 max-w-[660px] text-dim">{hero.description}</p>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-5">
        <ArrowButton label={hero.cta.label} href={hero.cta.href} tone="primary" />
      </div>
    </Reveal>
  );
}

export default AtsLandingHero;