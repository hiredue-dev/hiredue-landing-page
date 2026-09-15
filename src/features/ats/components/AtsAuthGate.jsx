"use client";

import { ArrowButton, SlideButton } from "@/components/site/ui/Button";
import { Eyebrow, Reveal } from "@/components/site/ui/Primitives";
import { ats } from "@/lib/content";

/**
 * The authentication boundary — non-negotiable. When a visitor has an uploaded,
 * pending resume but is NOT authenticated, this is the ONLY thing shown for the
 * scan stage. It deliberately renders no score, preview, verdict or analysis.
 *
 * It hands off to the existing /signup and /login routes with `redirect=/ats`,
 * reusing the existing auth system (no second auth implementation). The pending
 * upload is preserved across that round-trip by the workflow hook.
 */
const SIGNUP_HREF = "/signup?redirect=%2Fats";
const LOGIN_HREF = "/login?redirect=%2Fats";

export function AtsAuthGate() {
  return (
    <Reveal className="rounded-[24px] bg-surface p-10 md:p-14">
      <div className="flex flex-col items-center gap-6 text-center">
        <Eyebrow>{ats.auth.eyebrow}</Eyebrow>
        <div className="flex flex-col items-center gap-3">
          <h3 className="t-h3">{ats.auth.title}</h3>
          <p className="t-body max-w-[520px] text-dim">
            {ats.auth.description}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-5">
          <ArrowButton
            label={ats.auth.signupLabel}
            href={SIGNUP_HREF}
            tone="dark"
          />
          <SlideButton label={ats.auth.loginLabel} href={LOGIN_HREF} tone="white" />
        </div>

        <p className="text-[13px] font-medium tracking-wide text-dim">
          {ats.auth.privacyNote}
        </p>
      </div>
    </Reveal>
  );
}

export default AtsAuthGate;