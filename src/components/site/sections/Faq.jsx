"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { ArrowButton } from "@/components/site/ui/Button";
import { Reveal } from "@/components/site/ui/Primitives";
import { assets } from "@/lib/assets";
import { faq } from "@/lib/content";
import { spring } from "@/lib/motion";

export function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faqs" className="relative pb-[100px]">
      <div className="container-page">
        <div className="flex flex-col gap-[50px] lg:flex-row lg:gap-[70px]">
          <Reveal className="flex flex-col gap-[50px] lg:w-[424px] lg:shrink-0 lg:gap-20">
            <div className="flex flex-col gap-2.5">
              <h2 className="t-h2">{faq.title}</h2>
              <p className="t-body-lg">{faq.description}</p>
            </div>

            <div className="flex flex-col gap-5 rounded-[30px] bg-surface p-10">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center pr-2.5">
                  {assets.faq.avatars.map((avatar, i) => (
                    <Image
                      key={avatar}
                      src={avatar}
                      alt=""
                      width={40}
                      height={40}
                      className={clsx(
                        "size-10 rounded-full object-cover ring-2 ring-surface",
                        i > 0 && "-ml-2.5",
                      )}
                    />
                  ))}
                </div>
                <span className="text-[20px] leading-[1.3] font-medium text-ink">+</span>
                <span className="grid size-10 place-items-center rounded-full bg-[linear-gradient(312deg,#3b82f6_0%,#406ae4_100%)] text-[14px] leading-[1.3] font-medium text-white">
                  You
                </span>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <h3 className="t-h5">{faq.aside.title}</h3>
                  <p className="t-body">{faq.aside.description}</p>
                </div>
                <ArrowButton label={faq.aside.cta.label} href={faq.aside.cta.href} tone="dark" />
              </div>
            </div>
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
                    {isOpen && item.answer && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={spring(0.4)}
                        className="overflow-hidden"
                      >
                        <p className="t-body max-w-[500px] pr-[60px] pb-5 pl-5">{item.answer}</p>
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
