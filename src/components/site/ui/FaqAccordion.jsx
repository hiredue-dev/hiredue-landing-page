"use client";

import { useId, useState } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import { spring } from "@/lib/motion";

/**
 * The question list every FAQ on the site uses: one answer open at a time,
 * the first open to start. Each button points at its panel (aria-controls)
 * and each panel is a region named by its question. `answerClassName` sets
 * the answer's measure, which differs by layout.
 */
export function FaqAccordion({ items, answerClassName }) {
  const [open, setOpen] = useState(0);
  const baseId = useId();

  return items.map((item, i) => {
    const isOpen = open === i;
    const buttonId = `${baseId}-q${i}`;
    const panelId = `${baseId}-a${i}`;
    return (
      <div
        key={item.question}
        className={clsx(
          "overflow-hidden rounded-[20px] transition-colors duration-300",
          isOpen ? "bg-surface" : "bg-transparent ring-1 ring-line",
        )}
      >
        <button
          id={buttonId}
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={() => setOpen(isOpen ? -1 : i)}
          className="flex w-full items-start gap-2.5 p-5 text-left"
        >
          <span className="flex-1 text-[20px] leading-[1.3] font-medium text-ink">{item.question}</span>
          <motion.span
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={spring(0.4)}
            className={clsx(
              "relative grid size-[30px] shrink-0 place-items-center rounded-full transition-colors duration-300",
              isOpen ? "bg-ink" : "bg-surface",
            )}
          >
            {/* the wrapper spins, so counter-rotate this arm to leave a minus */}
            <motion.span
              animate={{ rotate: isOpen ? -90 : 0 }}
              transition={spring(0.4)}
              className={clsx(
                "absolute h-0.5 w-4 rounded-full transition-colors duration-300",
                isOpen ? "bg-white" : "bg-ink",
              )}
            />
            <motion.span
              animate={{ opacity: isOpen ? 0 : 1 }}
              transition={{ duration: 0.25 }}
              className={clsx(
                "absolute h-4 w-0.5 rounded-full transition-colors duration-300",
                isOpen ? "bg-white" : "bg-ink",
              )}
            />
          </motion.span>
        </button>

        {/* every answer stays in the server HTML, closed ones collapsed to
            zero height, so crawlers and the FAQPage schema see all of them */}
        {item.answer && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            aria-hidden={!isOpen}
            initial={false}
            animate={isOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
            transition={spring(0.4)}
            className="overflow-hidden"
          >
            <p className={clsx("t-body pr-[60px] pb-5 pl-5", answerClassName)}>{item.answer}</p>
          </motion.div>
        )}
      </div>
    );
  });
}
