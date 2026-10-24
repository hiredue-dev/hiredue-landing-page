"use client";

import { useEffect, useRef, useState } from "react";
import { formatCount } from "@/features/today/todayStats";

/*
 * Each digit is a 0–9 column slid to its value. Server and first client
 * render both sit at zero (so hydration matches); the roll starts on mount,
 * right-hand digit first. Columns are keyed from the right so a new leading
 * digit (999 → 1,000) doesn't reroll the others. Screen readers get the plain
 * number.
 */
export function Odometer({ value }) {
  const [rolled, setRolled] = useState(false);
  const firstRoll = useRef(true);

  useEffect(() => {
    const t = setTimeout(() => setRolled(true), 250);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    if (!rolled) return;
    // Stagger only the arrival; later updates roll together.
    const t = setTimeout(() => (firstRoll.current = false), 2000);
    return () => clearTimeout(t);
  }, [rolled]);

  const text = formatCount(value);
  const chars = text.split("");
  let fromRight = chars.filter((c) => /\d/.test(c)).length;

  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="inline-flex">
        {chars.map((c, i) => {
          const key = `${chars.length - i}`;
          if (!/\d/.test(c)) {
            return (
              <span key={key} className="inline-block w-[0.26em] text-center">
                {c}
              </span>
            );
          }
          fromRight -= 1;
          const digit = rolled ? Number(c) : 0;
          return (
            <span key={key} className="inline-block h-[1em] w-[0.6em] overflow-hidden align-top">
              <span
                className="flex flex-col transition-transform duration-[1400ms] ease-[cubic-bezier(.16,1,.3,1)] motion-reduce:transition-none"
                style={{
                  transform: `translateY(${-digit * 10}%)`,
                  transitionDelay: firstRoll.current ? `${fromRight * 0.12}s` : "0s",
                }}
              >
                {"0123456789".split("").map((d) => (
                  <span key={d} className="block h-[1em] text-center leading-[1em]">
                    {d}
                  </span>
                ))}
              </span>
            </span>
          );
        })}
      </span>
    </>
  );
}
