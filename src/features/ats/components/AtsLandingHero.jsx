"use client";

import Link from "next/link";
import { Eyebrow, Reveal } from "@/components/site/ui/Primitives";
import { ats } from "@/lib/content";

/**
 * Landing hero for the /ats page. Pure presentation — copy comes from
 * `ats.hero`, and the CTA scrolls to the upload workflow (anchor `#scan`).
 */
export function AtsLandingHero() {
  const { hero } = ats;
  return (
    <Reveal className="flex flex-col items-center text-center">
      <Eyebrow>{hero.eyebrow}</Eyebrow>
      <h1 className="t-h1 mt-4 max-w-[18ch]">{hero.title}</h1>
      <p className="t-body mt-5 max-w-[660px] text-dim">{hero.description}</p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link
          href={hero.cta.href}
          className="rounded-full bg-[linear-gradient(110deg,#323232_0%,#000_100%)] px-8 py-3 text-[16px] font-semibold text-white transition-opacity hover:opacity-90"
        >
          {hero.cta.label}
        </Link>
      </div>
    </Reveal>
  );
}

export default AtsLandingHero;