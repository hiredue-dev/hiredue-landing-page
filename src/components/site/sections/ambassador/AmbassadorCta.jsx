"use client";

import { Reveal } from "@/components/site/ui/Primitives";
import { useAuthModal } from "@/features/auth/components/FloatingAuthModal.jsx";
import { ambassadorPage } from "@/lib/content";

const { cta, applyUrl, applyLabel } = ambassadorPage;

export function AmbassadorCta() {
  const { showModal } = useAuthModal();
  return (
    <section id="apply" className="relative pb-[100px] min-[810px]:pb-[160px]">
      <div className="container-page">
        <Reveal
          y={30}
          className="relative overflow-hidden rounded-[30px] bg-[linear-gradient(133deg,#406ae4_0%,#3b82f6_100%)] p-[30px] min-[810px]:p-[60px]"
        >
          {/* two soft lights so the slab is not a flat rectangle of blue */}
          <span
            aria-hidden
            className="pointer-events-none absolute -top-[120px] -right-[60px] size-[320px] rounded-full bg-white/15 blur-[60px]"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute -bottom-[140px] -left-[40px] size-[280px] rounded-full bg-[#8fc0ff]/25 blur-[70px]"
          />

          <div className="relative z-1 flex flex-col items-start gap-6 min-[810px]:items-center min-[810px]:text-center">
            <div className="flex max-w-[620px] flex-col gap-2.5">
              <h2 className="t-h2 text-white">{cta.title}</h2>
              <p className="text-[18px] leading-[1.3] font-medium text-white/80">
                {cta.description}
              </p>
            </div>
            <button
              type="button"
              onClick={() => showModal({ view: "signup" })}
              className="inline-flex shrink-0 items-center justify-center rounded-full bg-[linear-gradient(110deg,#323232_0%,#000_100%)] px-9 py-3.5 text-[18px] font-semibold leading-[1.3] text-white shadow-[inset_4px_4px_8px_0_rgba(255,255,255,0.3),inset_-4px_-4px_8px_0_rgba(255,255,255,0.3),0_8px_16px_0_rgba(29,29,29,0.5)] transition-opacity hover:opacity-90"
            >
              {applyLabel}
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
