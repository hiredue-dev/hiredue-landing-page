"use client";

import { PageGround } from "@/components/site/ui/PageGround";
import { AtsLandingHero } from "./AtsLandingHero.jsx";
import { AtsCheckerWorkflow } from "./AtsCheckerWorkflow.jsx";
import { AtsLandingResumePreview } from "./AtsLandingResumePreview.jsx";
import { AtsWhatAtsChecks } from "./AtsWhatAtsChecks.jsx";
import { AtsHowCalc } from "./AtsHowCalc.jsx";
import { AtsJourney } from "./AtsJourney.jsx";
import { AtsOptimize } from "./AtsOptimize.jsx";

/**
 * Composes the whole /ats landing (upload/entry) experience as a first-class
 * HireDue feature page. This is a client component (it hosts the interactive
 * scan workflow); the page keeps SEO metadata as a server-only `metadata`.
 *
 * The page deliberately reuses HireDue's landing-section rhythm — a feature-style
 * hero, then alternating editorial lists, clean surface panels and a two-column
 * split — so the ATS checker reads as part of the platform rather than a
 * separate tool. Every section below anchors to the hero's upload interaction;
 * nothing here changes the upload → sign-in → score → dashboard flow.
 *
 * Structure:
 *   Hero (first viewport)                    -> eyebrow / H1 / short copy / upload card (left)
 *                                                + floating resume showcase (right, stacks
 *                                                beneath the upload on mobile)
 *   AtsWhatAtsChecks                         -> 6 concepts, lighter editorial list
 *   AtsJourney                               -> Upload → Analysis → Results → Improve strip
 *   AtsHowCalc                               -> methodology (single compact panel)
 *   AtsOptimize                             -> two-column split (honest, no auto-rewrite)
 */
export function AtsLanding() {
  return (
    <section className="relative isolate min-h-screen overflow-x-clip bg-white">
      {/* Shared HireDue page ground — soft brand wash + corner bloom. Panels
          stay white; only the page ground carries the blue tint. */}
      <PageGround />
      {/* ---- First viewport: explain + upload (left) / floating resume (right) ---- */}
      <div className="relative">
        <div className="container-page pt-24 pb-10 md:pt-28 md:pb-14">
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-12">
            {/* Left column: lean hero copy + the upload interaction (the primary CTA) */}
            <div className="flex flex-col gap-8 lg:gap-10">
              <AtsLandingHero />
              <AtsCheckerWorkflow className="mt-0" />
            </div>

            {/* Right column: compact, secondary resume showcase.
                Sticky on desktop; stacks beneath the upload on mobile. */}
            <div className="lg:sticky lg:top-28">
              <AtsLandingResumePreview />
            </div>
          </div>
        </div>
      </div>

      {/* ---- Sections below the fold, in HireDue's section rhythm ---- */}
      <div className="container-page">
        <AtsWhatAtsChecks />
        <AtsJourney />
        <AtsHowCalc />
        <AtsOptimize />
      </div>
    </section>
  );
}

export default AtsLanding;
