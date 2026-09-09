"use client";

import Image from "next/image";
import { ArrowButton } from "@/components/site/ui/Button";
import { Eyebrow, Reveal, RevealGroup, RevealItem } from "@/components/site/ui/Primitives";
import { assets } from "@/lib/assets";
import { features } from "@/lib/content";
import {
  ApplyForm,
  NotifyFeed,
  OutreachDesk,
  ResumeSheet,
  SourceGraph,
} from "@/components/site/sections/feature-cards";

const cardBase = "relative overflow-hidden rounded-[20px] bg-surface";

export function Features() {
  return (
    <section id="features" className="relative pt-[120px] md:pt-[200px]">
      <div className="container-page">
        <div className="flex flex-col gap-[50px]">
          {/* heading row */}
          <div className="flex flex-col items-start gap-[30px] lg:flex-row lg:items-end lg:gap-[50px]">
            <Reveal className="flex flex-1 flex-col items-start gap-2.5">
              <Eyebrow>{features.eyebrow}</Eyebrow>
              <h2 className="t-h2 max-w-[575px]">{features.title}</h2>
            </Reveal>
            <Reveal delay={0.1} className="flex flex-1 flex-col items-start gap-5 lg:items-end">
              <p className="t-body-lg lg:text-right">{features.description}</p>
              <ArrowButton label={features.cta.label} href={features.cta.href} tone="dark" />
            </Reveal>
          </div>

          {/* bento */}
          <RevealGroup step={0.08} className="grid gap-[30px] lg:grid-cols-3">
            <div className="grid gap-[30px] sm:grid-cols-2 lg:col-span-2">
              <RevealItem className={`${cardBase} flex h-[393px] flex-col gap-6 p-10`}>
                <p className="t-h5 text-center">{features.findJobs.title}</p>
                <SourceGraph />
              </RevealItem>

              <RevealItem className={`${cardBase} flex h-[393px] flex-col items-center gap-[26px] p-10`}>
                <Image
                  src={assets.features.chartBg}
                  alt=""
                  fill
                  sizes="380px"
                  className="object-cover"
                />
                <span className="absolute inset-0 bg-[linear-gradient(#fff_0%,#fff_0%,rgba(255,255,255,0)_100%)]" />
                <p className="t-h5 relative text-center">{features.resume.title}</p>
                <ResumeSheet />
              </RevealItem>

              <RevealItem
                className={`${cardBase} flex h-[354px] flex-col items-center justify-between px-10 pt-10 sm:col-span-2`}
              >
                <Image
                  src={assets.features.outreachBg}
                  alt=""
                  fill
                  sizes="790px"
                  className="object-cover"
                />
                <span className="absolute inset-0 bg-[linear-gradient(#fff_0%,#fff_0%,rgba(255,255,255,0.3)_100%)]" />
                <div className="relative flex max-w-[500px] flex-col items-center gap-1 pb-6">
                  <p className="t-h5 text-center">{features.outreach.title}</p>
                  <p className="t-body text-center">{features.outreach.description}</p>
                </div>
                <OutreachDesk />
              </RevealItem>
            </div>

            <div className="flex flex-col gap-[30px]">
              <RevealItem className="relative flex h-[508px] flex-col items-center gap-6 overflow-hidden rounded-[20px] bg-black p-10">
                <p className="t-h5 text-center text-white">{features.autoApply.title}</p>
                <ApplyForm />
                <p className="mt-auto text-center text-[15px] leading-[1.3] font-medium text-grey">
                  {features.autoApply.description}
                </p>
              </RevealItem>

              <RevealItem className={`${cardBase} flex h-[239px] flex-col items-center gap-6 p-10`}>
                <p className="t-h5 text-center">{features.tracking.title}</p>
                <NotifyFeed />
              </RevealItem>
            </div>
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
