"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowButton, SlideButton } from "@/components/site/ui/Button";
import { CloudStage } from "@/components/site/ui/Cloud";
import { Eyebrow } from "@/components/site/ui/Primitives";
import { assets } from "@/lib/assets";
import { ambassadorPage } from "@/lib/content";
import { spring } from "@/lib/motion";
import { CreatorCard } from "./creator-card";

const appear = (delay) => ({
  initial: { opacity: 0.001, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: spring(1, delay),
});

const { hero, applyUrl, applyLabel } = ambassadorPage;

export function AmbassadorHero() {
  return (
    <section className="relative isolate flex flex-col overflow-hidden bg-white pt-[128px] pb-[100px] min-[810px]:pt-[158px] min-[810px]:pb-[160px] min-[1200px]:pt-[194px] min-[1200px]:pb-[200px]">
      <Image
        src={assets.hero.sky}
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover object-top"
      />

      <CloudStage
        cloud01={assets.hero.cloud01}
        cloud02={assets.hero.cloud02}
        cloud03={assets.hero.cloud03}
      />

      <div className="container-page relative z-[2]">
        <div className="grid gap-[60px] min-[1200px]:grid-cols-[1fr_520px] min-[1200px]:items-center min-[1200px]:gap-[50px]">
          <motion.div
            {...appear(0.1)}
            className="flex flex-col items-start gap-5 min-[1200px]:gap-10"
          >
            <div className="flex flex-col items-start gap-2.5">
              <Eyebrow tone="white">{hero.eyebrow}</Eyebrow>
              <h1 className="t-h1-ambassador">{hero.title}</h1>
              <p className="max-w-[600px] text-[18px] leading-[1.3] font-medium text-dim min-[810px]:text-[20px]">
                {hero.description}
              </p>
            </div>

            <div className="grid w-full max-w-[600px] grid-cols-2 gap-5 min-[810px]:grid-cols-3 min-[810px]:gap-[30px]">
              {hero.stats.map((stat) => (
                <div key={stat.label} className="flex flex-col gap-1.5">
                  <p className="t-h3">{stat.value}</p>
                  <p className="t-body">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <ArrowButton label={applyLabel} href={applyUrl} tone="primary" />
              <SlideButton label={hero.secondary.label} href={hero.secondary.href} tone="white" />
            </div>
          </motion.div>

          <motion.div {...appear(0.25)} className="flex justify-center min-[1200px]:justify-end">
            <CreatorCard />
          </motion.div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[100px] bg-[linear-gradient(rgba(255,255,255,0)_0%,rgba(255,255,255,0.7)_25%,#fff_50%)] min-[810px]:h-[160px] min-[1200px]:h-[200px]" />
    </section>
  );
}
