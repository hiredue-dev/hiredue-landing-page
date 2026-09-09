import { ArrowButton } from "@/components/site/ui/Button";
import { Reveal } from "@/components/site/ui/Primitives";
import { ambassadorPage } from "@/lib/content";

const { cta, applyUrl, applyLabel } = ambassadorPage;

export function AmbassadorCta() {
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
            <ArrowButton label={applyLabel} href={applyUrl} tone="dark" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
