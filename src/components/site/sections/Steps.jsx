"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { ArrowButton } from "@/components/site/ui/Button";
import { Eyebrow, Reveal } from "@/components/site/ui/Primitives";
import {
  ConnectVisual,
  DownloadVisual,
  PreferencesVisual,
  RunVisual,
} from "@/components/site/sections/step-visuals";
import { steps } from "@/lib/content";
import { spring } from "@/lib/motion";

const DWELL = 7000;
const VISUALS = [DownloadVisual, ConnectVisual, PreferencesVisual, RunVisual];

export function Steps() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setTimeout(() => setIndex((v) => (v + 1) % steps.items.length), DWELL);
    return () => clearTimeout(id);
  }, [index, paused]);

  const step = steps.items[index];
  const Visual = VISUALS[index];

  return (
    <section id="how-it-works" className="relative pb-[120px] md:pb-[200px]">
      <div className="container-page">
        <div className="flex flex-col gap-[50px] lg:flex-row lg:gap-[70px]">
          <Reveal className="flex flex-col gap-[50px] lg:w-[502px] lg:shrink-0 lg:gap-[70px] lg:pt-[59px]">
            <div className="flex flex-col items-start gap-2.5">
              <Eyebrow>{steps.eyebrow}</Eyebrow>
              <h2 className="t-h2">{steps.title}</h2>
              <p className="t-body-lg">{steps.description}</p>
            </div>
            <div className="grid gap-[30px] sm:grid-cols-2">
              {steps.stats.map((stat) => (
                <div key={stat.label} className="flex flex-col gap-1.5">
                  <p className="font-display text-[32px] leading-[1.2] font-semibold text-ink">
                    {stat.value}
                  </p>
                  <p className="t-body">{stat.label}</p>
                </div>
              ))}
            </div>
            <ArrowButton label={steps.cta.label} href={steps.cta.href} tone="dark" />
          </Reveal>

          <Reveal
            delay={0.1}
            className="flex flex-1 flex-col items-center"
            // pause the carousel while the reader is interacting with it
          >
            <div
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              className="flex w-full flex-col items-center"
            >
              {/* tabs */}
              <div className="relative flex items-center gap-2.5 p-2.5">
                <span className="absolute inset-x-[-39px] bottom-0 h-px bg-white" />
                {steps.items.map((item, i) => (
                  <button
                    key={item.tab}
                    type="button"
                    onClick={() => setIndex(i)}
                    className={clsx(
                      "relative rounded-full px-5 py-2.5 text-[14px] leading-[1.3] font-medium transition-colors duration-300",
                      i === index ? "text-white" : "bg-surface text-grey hover:text-dim",
                    )}
                  >
                    {i === index && (
                      <motion.span
                        layoutId="step-tab"
                        transition={spring(0.5)}
                        className="absolute inset-0 rounded-full bg-ink"
                      />
                    )}
                    <span className="relative">{item.tab}</span>
                  </button>
                ))}
                <span className="pointer-events-none absolute inset-x-[-2px] -top-px h-[70px] bg-[linear-gradient(#fff_0%,rgba(255,255,255,0)_100%)] opacity-70" />
              </div>

              {/* panel */}
              <div className="w-full rounded-[30px] p-1.5">
                <div className="overflow-hidden rounded-[24px] bg-surface p-10">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={step.title}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -16 }}
                      transition={spring(0.5)}
                      className="flex flex-col items-center gap-10"
                    >
                      <div className="flex h-[280px] w-full max-w-[536px] items-center justify-center">
                        <Visual />
                      </div>
                      <div className="flex flex-col items-center gap-1.5 text-center">
                        <h3 className="t-h5">{step.title}</h3>
                        <p className="t-body-lg">{step.description}</p>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
