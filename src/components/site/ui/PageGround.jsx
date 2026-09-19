"use client";

/**
 * Shared "page ground" for the ATS routes — the soft HireDue brand wash that
 * makes /ats and /ats/dashboard read as one continuous product page rather
 * than plain white app screens.
 *
 * It mirrors the site-wide background treatment (the soft top radial brand
 * glow over a near-white ground, plus a faint top-right bloom) without
 * tinting any panel — content surfaces stay white/`bg-surface` on top.
 *
 * Usage: place this as the first child of a `relative isolate overflow-hidden`
 * section. It renders decorative, non-interactive layers that sit behind the
 * content via `-z-10`, so it never competes with them.
 *
 * This is the composed full-page ground; any workspace-specific extras
 * (e.g. the dashboard's taller corner atmosphere) can be layered after it.
 */
export function PageGround() {
  return (
    <>
      {/* Soft brand wash radiating from the top of the viewport. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(64,106,228,0.09)_0%,rgba(64,106,228,0.03)_40%,rgba(255,255,255,0)_72%)]"
      />
      {/* Faint brand bloom in the top-right corner. */}
      <span
        aria-hidden
        className="pointer-events-none absolute -z-10 -top-32 right-[-140px] size-[440px] rounded-full bg-[rgba(82,144,244,0.10)] blur"
      />
    </>
  );
}