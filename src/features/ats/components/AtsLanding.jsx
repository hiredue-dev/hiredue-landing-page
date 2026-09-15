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
    <>
      <div className="container-page flex flex-col items-center pt-24 md:pt-28">
        <AtsLandingHero />
      </div>

      <div className="container-page">
        <AtsInputMode value={mode} onChange={setMode} />
        <AtsCheckerWorkflow initialMode={mode} />
        <AtsHowCalc />
      </div>
    </>
  );
}

export default AtsLanding;