"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import clsx from "clsx";
import { assets } from "@/lib/assets";
import { comparison } from "@/lib/content";
import { Reveal } from "@/components/site/ui/Primitives";
import { spring } from "@/lib/motion";

/**
 * A sticky panel that flips from the "before" state to the "after" state
 * partway through its scroll range — the dial in the header turns over with it.
 */
export function Comparison() {
  const sectionRef = useRef(null);
  const [after, setAfter] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setAfter(v > 0.3);
  });

  const side = after ? comparison.after : comparison.before;

  return (
    <section ref={sectionRef} className="relative flex flex-col gap-[150px] pt-[120px] md:pt-[200px]">
      <div className="sticky top-20 mx-auto w-full max-w-[760px] px-[30px]">
        <div className="flex flex-col gap-[50px]">
          <Reveal className="px-[30px]">
            <h2 className="t-h2 text-center">{comparison.title}</h2>
          </Reveal>

          <Reveal y={30} className="relative pt-[89px]">
            {/* header: two labels with the dial wedged between them */}
            <div className="absolute inset-x-[10px] top-0 z-10 flex h-[90px] gap-5 sm:inset-x-[50px]">
              <span
                className={clsx(
                  "flex flex-1 items-end justify-end pr-5 pb-5 text-[16px] leading-[1.3] font-medium transition-colors duration-500",
                  after ? "text-grey" : "text-ink",
                )}
              >
                {comparison.beforeLabel}
              </span>

              <span className="relative z-30 w-[100px] shrink-0 sm:w-[130px]">
                <AnimatePresence initial={false} mode="popLayout">
                  <motion.span
                    key={after ? "after" : "before"}
                    initial={{ opacity: 0, rotate: after ? -25 : 25, scale: 0.9 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: after ? 25 : -25, scale: 0.9 }}
                    transition={spring(0.55)}
                    className="absolute inset-x-0 top-0 block"
                  >
                    <Image
                      src={after ? assets.comparison.dialAfter : assets.comparison.dialBefore}
                      alt=""
                      width={130}
                      height={160}
                      className="w-full"
                    />
                  </motion.span>
                </AnimatePresence>
              </span>

              <span
                className={clsx(
                  "flex flex-1 items-end justify-start pb-5 pl-5 text-[16px] leading-[1.3] font-medium transition-colors duration-500",
                  after ? "text-ink" : "text-grey",
                )}
              >
                {comparison.afterLabel}
              </span>

              {/* soft white veil so the dial reads against the header */}
              <span className="pointer-events-none absolute inset-x-[25%] top-0 z-20 h-[45px] bg-[linear-gradient(#fff_0%,rgba(255,255,255,0)_100%)]" />
              <span className="absolute inset-x-[50px] bottom-0 h-px bg-white" />
            </div>

            {/* card */}
            <div className="rounded-[30px] p-1.5 shadow-[0_0_0_1px_rgba(221,229,237,0.55)]">
              <motion.div
                animate={{ backgroundColor: after ? "#000000" : "#edf1f4" }}
                transition={{ duration: 0.5 }}
                className="relative overflow-hidden rounded-[24px] px-[30px] pt-[90px] pb-[30px]"
              >
                {after && (
                  <>
                    <Image
                      src={assets.comparison.afterBg}
                      alt=""
                      fill
                      sizes="700px"
                      className="object-cover"
                    />
                    <span className="absolute inset-0 bg-[linear-gradient(#000_0%,rgba(0,0,0,0.88)_45%,rgba(0,0,0,0.8)_100%)]" />
                  </>
                )}

                <AnimatePresence mode="wait">
                  <motion.div
                    key={after ? "after" : "before"}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={spring(0.45)}
                    className="relative flex flex-col gap-[30px] sm:min-h-[339px] sm:flex-row"
                  >
                    <div className="flex flex-col gap-5 sm:w-[374px]">
                      <h3
                        className={clsx(
                          "font-display text-[32px] leading-[1.2] font-semibold",
                          after ? "text-white" : "text-ink",
                        )}
                      >
                        {side.heading}
                      </h3>
                      <ul className="flex flex-col gap-2.5">
                        {side.items.map((item, i) => (
                          <motion.li
                            key={item}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={spring(0.5, 0.08 * i)}
                            className="flex items-start gap-1.5"
                          >
                            <Image
                              src={after ? assets.icons.checkGreen : assets.icons.crossRed}
                              alt=""
                              width={12}
                              height={10}
                              className="mt-[7px] w-3 shrink-0"
                            />
                            <span
                              className={clsx(
                                "text-[18px] leading-[1.3] font-medium",
                                after ? "text-[#edf1f4]" : "text-dim",
                              )}
                            >
                              {item}
                            </span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-col gap-[30px] sm:w-[224px] sm:shrink-0">
                      {side.stats.map((stat, i) => (
                        <motion.div
                          key={stat.label}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={spring(0.6, 0.12 + 0.12 * i)}
                          className={clsx(
                            "flex flex-col justify-center gap-1.5 rounded-[20px] p-5 sm:h-[100px]",
                            after
                              ? "bg-[rgba(16,185,129,0.1)] ring-1 ring-[rgba(16,185,129,0.3)]"
                              : "bg-[#ff0d0d0d] ring-1 ring-[rgba(245,28,35,0.15)]",
                          )}
                        >
                          <span
                            className={clsx(
                              "font-display text-[28px] leading-[1.2] font-semibold",
                              after ? "text-white" : "text-ink",
                            )}
                          >
                            {stat.value}
                          </span>
                          <span
                            className={clsx(
                              "text-[16px] leading-[1.3] font-medium",
                              after ? "text-[#dcdcdc]" : "text-dim",
                            )}
                          >
                            {stat.label}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* scroll runway that keeps the panel pinned while it flips */}
      <div aria-hidden className="h-[450px]" />
    </section>
  );
}
