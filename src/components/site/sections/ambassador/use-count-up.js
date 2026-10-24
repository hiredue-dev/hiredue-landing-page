"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Eases a number up to `target` whenever it changes. With `from`, the first
 * run starts there instead (0 for a count-up on arrival); the server still
 * renders `target`, so the real number is in the HTML.
 */
export function useCountUp(target, duration = 900, { from: start } = {}) {
  const [value, setValue] = useState(target);
  const from = useRef(start ?? target);

  useEffect(() => {
    const start = performance.now();
    const origin = from.current;
    let raf = 0;

    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      /* easeOutCubic — fast off the mark, settles rather than stops dead */
      const eased = 1 - (1 - t) ** 3;
      setValue(origin + (target - origin) * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
      else from.current = target;
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return value;
}
