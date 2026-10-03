"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { SlideButton } from "@/components/site/ui/Button";
import { CloudStage } from "@/components/site/ui/Cloud";
import { FeatureHeroVisual } from "@/components/site/sections/feature/FeatureHeroVisual";
import { useAuthModal } from "@/features/auth/components/FloatingAuthModal.jsx";
import { assets } from "@/lib/assets";
import { featurePage } from "@/lib/content";
import { spring } from "@/lib/motion";

/* The route's appear animations: y 20 → 0, spring bounce 0, 1s, two delays. */
const appear = (delay) => ({
  initial: { opacity: 0.001, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: spring(1, delay),
});

const { hero } = featurePage;

export function FeatureHero() {
  const { showModal } = useAuthModal();
  return (
    <section className="relative isolate flex flex-col overflow-hidden bg-white pt-[128px] pb-[100px] min-[810px]:pt-[158px] min-[810px]:pb-[160px] min-[1200px]:pt-[194px] min-[1200px]:pb-[200px]">
      {/* sky */}
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
        <div className="grid gap-[30px] min-[1200px]:grid-cols-2 min-[1200px]:items-start min-[1200px]:gap-[50px]">
          {/* copy */}
          <motion.div
            {...appear(0.1)}
            className="flex flex-col items-start gap-5 min-[1200px]:gap-10"
          >
            <div className="flex flex-col gap-2.5">
              <h1 className="t-h2-feature">{hero.title}</h1>
              <p className="max-w-[600px] text-[18px] leading-[1.3] font-medium text-dim min-[810px]:text-[20px]">
                {hero.description}
              </p>
            </div>

            <div className="grid w-full grid-cols-2 gap-5 min-[810px]:gap-[30px]">
              {hero.stats.map((stat) => (
                <div key={stat.value} className="flex flex-col gap-1.5">
                  <p className="t-h4">{stat.value}</p>
                  <p className="t-body">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-5">
              <button
                type="button"
                onClick={() => showModal({ view: "signup" })}
                className="inline-flex shrink-0 rounded-full bg-white/10 p-1.5"
              >
                <span className="relative flex items-center justify-center overflow-hidden rounded-full bg-[linear-gradient(110deg,#3b82f6_0%,#406ae4_100%)] px-[30px] py-3 text-[18px] font-semibold leading-[1.3] text-white shadow-[inset_4px_4px_8px_0_rgba(255,255,255,0.3),inset_-4px_-4px_8px_0_rgba(255,255,255,0.3),0_8px_16px_0_rgba(58,119,229,0.5)] transition-opacity hover:opacity-90">
                  {hero.cta.label}
                </span>
              </button>
              {hero.secondaryCta && (
                <SlideButton
                  label={hero.secondaryCta.label}
                  href={hero.secondaryCta.href}
                  tone="white"
                />
              )}
            </div>
          </motion.div>

          {/* product visuals: discover → outreach → auto apply */}
          <motion.div {...appear(0.2)} className="w-full">
            <FeatureHeroVisual />
          </motion.div>
        </div>
      </div>

      {/* fade the sky into the page */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[100px] bg-[linear-gradient(rgba(255,255,255,0)_0%,rgba(255,255,255,0.7)_25%,#fff_50%)] min-[810px]:h-[160px] min-[1200px]:h-[200px]" />
    </section>
  );
}
