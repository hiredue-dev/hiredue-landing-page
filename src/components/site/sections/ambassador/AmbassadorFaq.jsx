"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { Reveal } from "@/components/site/ui/Primitives";
import { ambassadorPage } from "@/lib/content";
import { spring } from "@/lib/motion";

const { faq } = ambassadorPage;

export function AmbassadorFaq() {
  const [open, setOpen] = useState(0);

  return (
    <section
      id="ambassador-faqs"
      className="relative pb-[100px] min-[810px]:pb-[160px] min-[1200px]:pb-[200px]"
    >
      <div className="container-page">
        <div className="flex flex-col gap-[50px] lg:flex-row lg:gap-[70px]">
          <Reveal className="flex flex-col gap-2.5 lg:w-[380px] lg:shrink-0">
            <h2 className="t-h2">{faq.title}</h2>
            <p className="t-body-lg">{faq.description}</p>
          </Reveal>

          <Reveal delay={0.1} className="flex flex-1 flex-col gap-5">
            {faq.items.map((item, i) => {
              const isOpen = open === i;
              return (
                <div
                  key={item.question}
                  className={clsx(
                    "overflow-hidden rounded-[20px] transition-colors duration-300",
                    isOpen ? "bg-surface" : "bg-transparent ring-1 ring-line",
                  )}
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="flex w-full items-start gap-2.5 p-5 text-left"
                  >
                    <span className="flex-1 text-[20px] leading-[1.3] font-medium text-ink">
                      {item.question}
                    </span>
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

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={spring(0.4)}
                        className="overflow-hidden"
                      >
                        <p className="t-body max-w-[620px] pr-[60px] pb-5 pl-5">{item.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
