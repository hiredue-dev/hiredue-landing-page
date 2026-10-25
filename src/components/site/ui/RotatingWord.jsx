"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const spring = { type: "spring", bounce: 0, duration: 0.5 };

/**
 * Cycles through `words`, sliding the next one up from below while the
 * current one slides up and out — like a flip clock. The box (and anything
 * `className` paints on it, e.g. a chip background) resizes to fit the word
 * on show, animating its width alongside the flip.
 *
 * Widths can't come from the strings — different words render to different
 * pixel widths for the same character count — so every word is rendered once,
 * invisibly, and measured. Until that has happened (server render, first
 * paint) the words are stacked in one grid cell instead, which sizes the box
 * to the widest, so nothing is clipped before the measurements land.
 *
 * Screen readers get every word once, in a hidden span, instead of whichever
 * one happens to be showing when the heading is read.
 */
export function RotatingWord({ words, interval = 2000, className }) {
  const [index, setIndex] = useState(0);
  const [widths, setWidths] = useState(null);
  const measureRefs = useRef([]);
  const reduced = useReducedMotion();

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
      <motion.span
        aria-hidden
        initial={false}
        animate={widths ? { width: widths[index] } : undefined}
        transition={reduced ? { duration: 0 } : spring}
        style={{ boxSizing: "content-box" }}
        className={`relative inline-block align-top leading-none ${className ?? ""}`}
      >
        {/* the clip for the flip; padding on the outer box stays clear */}
        <span className="relative block h-[1em] overflow-hidden">
          {!widths && (
            <span className="invisible grid">
              {words.map((w) => (
                <span key={w} className="col-start-1 row-start-1 whitespace-nowrap">
                  {w}
                </span>
              ))}
            </span>
          )}
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
      </motion.span>
    </>
  );
}
