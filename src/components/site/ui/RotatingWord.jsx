"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const spring = { type: "spring", bounce: 0, duration: 0.5 };

/**
 * Cycles through `words`, sliding the next one up from below while the
 * current one slides up and out — like a flip clock. The box (and anything
 * `className` paints on it, e.g. a chip background) resizes to fit the word
 * on show, animating its width alongside the flip — growing and shrinking
 * from the right only: it sits in a slot as wide as the widest word, so its
 * left edge (and the rest of the line) never moves.
 *
 * Widths can't come from the strings — different words render to different
 * pixel widths for the same character count — so every word is rendered once,
 * invisibly, and measured. Until that has happened (server render, first
 * paint) the box fills the slot, i.e. the widest word, so nothing is clipped
 * before the measurements land.
 *
 * Screen readers get every word once, in a hidden span, instead of whichever
 * one happens to be showing when the heading is read.
 */
export function RotatingWord({ words, interval = 2000, className }) {
  const [index, setIndex] = useState(0);
  const [widths, setWidths] = useState(null);
  const measureRefs = useRef([]);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % words.length);
    }, interval);
    return () => clearInterval(id);
  }, [words.length, interval]);

  /* Measure every word. Again once web fonts have loaded (the fallback face
     has different widths) and whenever the viewport resizes, since the
     headline's font size steps at breakpoints. */
  useEffect(() => {
    const measure = () => {
      const next = measureRefs.current.map((el) => el?.getBoundingClientRect().width ?? 0);
      if (next.every((w) => w > 0)) setWidths(next);
    };
    measure();
    document.fonts?.ready.then(measure);
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [words]);

  return (
    <>
      <span className="sr-only">{words.join(", ")}</span>
      {/* A fixed slot as wide as the widest word's box, so the line around it
          never re-centres; the visible box is pinned to the slot's left edge
          and only its right side moves. */}
      <span aria-hidden className="relative inline-grid align-top text-left">
        {/* the slot's sizer: the box around every word at once, unseen */}
        <span className={`invisible col-start-1 row-start-1 inline-block leading-none ${className ?? ""}`}>
          <span className="grid h-[1em]">
            {words.map((w) => (
              <span key={w} className="col-start-1 row-start-1 whitespace-nowrap">
                {w}
              </span>
            ))}
          </span>
        </span>

        {/* Width as a plain style with a CSS transition, not a motion
            `animate`: framer held off applying the first measured width until
            the word changed, and the box sat collapsed to its padding. Until
            the widths are measured it fills the slot (the widest word). */}
        <span
          style={{ boxSizing: "content-box", width: widths ? `${widths[index]}px` : undefined }}
          className={`relative col-start-1 row-start-1 inline-block justify-self-start leading-none transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${widths ? "" : "w-full box-border"} ${className ?? ""}`}
        >
          {/* the clip for the flip; padding on the box stays clear */}
          <span className="relative block h-[1em] overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={words[index]}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                exit={{ y: "-100%", opacity: 0 }}
                transition={spring}
                className="absolute top-0 left-0 leading-none whitespace-nowrap"
              >
                {words[index]}
              </motion.span>
            </AnimatePresence>
          </span>

          {/* measuring copies: same font, out of the flow, never seen */}
          {words.map((w, i) => (
            <span
              key={w}
              ref={(el) => {
                measureRefs.current[i] = el;
              }}
              className="pointer-events-none invisible absolute top-0 left-0 whitespace-nowrap"
            >
              {w}
            </span>
          ))}
        </span>
      </span>
    </>
  );
}
