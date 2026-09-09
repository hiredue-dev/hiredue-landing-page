import Image from "next/image";
import { Eyebrow, Reveal } from "@/components/site/ui/Primitives";
import { CapabilityFlow } from "@/components/site/sections/feature/capability-flow";
import { assets } from "@/lib/assets";
import { featurePage } from "@/lib/content";

const { capabilities } = featurePage;

export function FeatureCapabilities() {
  return (
    <section className="relative isolate py-[100px] min-[810px]:py-[160px] min-[1200px]:py-[200px]">
      <Image
        src={assets.featurePage.bg}
        alt=""
        fill
        sizes="100vw"
        className="-z-10 object-cover"
      />
      <span className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[100px] bg-[linear-gradient(0deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.7)_25%,#fff_50%)] min-[810px]:h-[160px] min-[1200px]:h-[200px]" />
      <span className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[100px] bg-[linear-gradient(rgba(255,255,255,0)_0%,rgba(255,255,255,0.7)_25%,#fff_50%)] min-[810px]:h-[160px] min-[1200px]:h-[200px]" />

      <div className="container-page">
        <div className="flex flex-col items-center gap-[30px] min-[810px]:gap-10 min-[1200px]:gap-[50px]">
          <Reveal className="flex max-w-[800px] flex-col items-center gap-2.5">
            <Eyebrow>{capabilities.eyebrow}</Eyebrow>
            <h2 className="t-h2-feature text-center">{capabilities.title}</h2>
          </Reveal>

          <Reveal className="w-full">
            <CapabilityFlow />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
