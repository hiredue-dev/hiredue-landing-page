"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
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
  /* hover or keyboard focus inside the panel holds the current slide */
  const [held, setHeld] = useState(false);
  const ref = useRef(null);
  const visible = useInView(ref);
  /* reduced motion: no auto-advance at all — the dots still switch slides */
  const reduced = useReducedMotion();

  useEffect(() => {
    if (held || reduced || !visible) return;
    const id = setTimeout(() => setIndex((i) => (i + 1) % SLIDES.length), DWELL);
    return () => clearTimeout(id);
  }, [index, held, reduced, visible]);

  const slide = SLIDES[index];

  return (
    <motion.div
      ref={ref}
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={() => setHeld(false)}
      layout
      animate={{ backgroundColor: slide.dark ? "#000000" : "#edf1f4" }}
      transition={{ duration: 0.5 }}
      className="relative flex min-h-[460px] w-full flex-col items-center overflow-hidden rounded-[20px] p-8"
    >
      {/* progress dots */}
      <div className="flex shrink-0 items-center gap-0.5 pb-4">
        {SLIDES.map((s, i) => (
          /* the visible dot stays small; the button around it is the
             44px hit area */
          <button
            key={s.key}
            type="button"
            aria-label={`Show slide ${i + 1}: ${s.label}`}
            aria-current={i === index}
            onClick={() => setIndex(i)}
            className="grid h-11 min-w-6 place-items-center rounded-full px-1 focus-visible:outline-2 focus-visible:outline-brand"
          >
            <span
              className={clsx(
                "block h-1.5 rounded-full transition-all duration-300",
                i === index ? "w-6 bg-brand" : slide.dark ? "w-1.5 bg-white/40" : "w-1.5 bg-line",
              )}
            />
          </button>
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
