"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { ApplyForm, OutreachDesk, SourceGraph } from "@/components/site/sections/feature-cards";
import { spring } from "@/lib/motion";

/* Same widgets the home page's feature bento uses for "discover", "outreach",
   and "auto apply" — cycled here as full-width slides instead of small
   cards, so the hero shows the product doing the work instead of a static
   screenshot. */
const SLIDES = [
  { key: "discover", label: "Discovers roles across every board", Visual: SourceGraph, dark: false },
  { key: "outreach", label: "Reaches out to the right people", Visual: OutreachDesk, dark: false },
  { key: "apply", label: "Fills out and submits the application", Visual: ApplyForm, dark: true },
];

const DWELL = 4200;

export function FeatureHeroVisual() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), DWELL);
    return () => clearInterval(id);
  }, []);

  const slide = SLIDES[index];

  return (
    <motion.div
      layout
      animate={{ backgroundColor: slide.dark ? "#000000" : "#edf1f4" }}
      transition={{ duration: 0.5 }}
      className="relative flex min-h-[460px] w-full flex-col items-center overflow-hidden rounded-[20px] p-8"
    >
      {/* progress dots */}
      <div className="flex shrink-0 items-center gap-2 pb-7">
        {SLIDES.map((s, i) => (
          <span
            key={s.key}
            className={clsx(
              "h-1.5 rounded-full transition-all duration-300",
              i === index ? "w-6 bg-brand" : slide.dark ? "w-1.5 bg-white/20" : "w-1.5 bg-line",
            )}
          />
        ))}
      </div>

      <div className="relative flex w-full flex-1 items-center justify-center py-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.key}
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -60, opacity: 0 }}
            transition={spring(0.6)}
            className="flex w-full max-w-[420px] flex-col items-center gap-6"
          >
            <p className={clsx("t-h5 text-center", slide.dark ? "text-white" : "text-ink")}>
              {slide.label}
            </p>
            <slide.Visual />
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
