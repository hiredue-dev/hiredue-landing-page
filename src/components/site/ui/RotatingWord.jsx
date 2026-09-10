"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Cycles through `words`, sliding the next one up from below while the
 * current one slides up and out — like a flip clock.
 *
 * The wrapper's width can't be sized off the longest *string* — different
 * words render to different pixel widths for the same character count, and
 * sizing off the wrong one clips whichever word is actually widest. Instead
 * every word is stacked invisibly in the same grid cell, so the cell sizes
 * itself to whichever one is widest in practice.
 */
export function RotatingWord({ words, interval = 2000, className }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % words.length);
    }, interval);
    return () => clearInterval(id);
  }, [words.length, interval]);

  return (
    <span
      className={`relative inline-grid h-[1em] overflow-hidden text-left align-top leading-none ${className ?? ""}`}
    >
      <span className="invisible col-start-1 row-start-1 grid">
        {words.map((w) => (
          <span key={w} className="col-start-1 row-start-1 whitespace-nowrap">
            {w}
          </span>
        ))}
      </span>
      <AnimatePresence mode="popLayout">
        <motion.span
          key={words[index]}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ type: "spring", bounce: 0, duration: 0.5 }}
          className="absolute inset-0 col-start-1 row-start-1 leading-none whitespace-nowrap"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
