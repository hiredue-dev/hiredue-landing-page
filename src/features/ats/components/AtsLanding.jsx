"use client";

import { useState } from "react";
import { AtsLandingHero } from "./AtsLandingHero.jsx";
import { AtsInputMode } from "./AtsInputMode.jsx";
import { AtsCheckerWorkflow } from "./AtsCheckerWorkflow.jsx";
import { AtsHowCalc } from "./AtsHowCalc.jsx";

/**
 * Composes the whole /ats landing experience. This is a client component (it
 * hosts the interactive scan workflow), but the page keeps SEO metadata as a
 * server-only `metadata` export.
 */
export function AtsLanding() {
  const [mode, setMode] = useState("generic");

  return (
    // Same full-page backdrop as the Sign In/Sign Up experience so the ATS
    // checker reads as part of the HireDue platform: a soft blue-to-white
    // vertical gradient with two blurred brand glows in the corners.
    <section className="relative isolate min-h-screen overflow-hidden bg-[linear-gradient(180deg,rgba(226,245,255,0.92)_0%,rgba(237,241,244,0.74)_48%,#fff_100%)]">
      <span
        aria-hidden
        className="pointer-events-none absolute -z-10 h-[520px] w-[520px] left-[-190px] top-8 rounded-full bg-[rgba(82,144,244,0.16)] blur"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -z-10 h-[420px] w-[420px] right-[-150px] bottom-5 rounded-full bg-[rgba(64,106,228,0.12)] blur"
      />

      <div className="container-page flex flex-col items-center pt-24 md:pt-28">
        <AtsLandingHero />
      </div>

      <div className="container-page">
        <AtsInputMode value={mode} onChange={setMode} />
        <AtsCheckerWorkflow initialMode={mode} />
        <AtsHowCalc />
      </div>
    </section>
  );
}

export default AtsLanding;