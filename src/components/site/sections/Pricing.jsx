"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { SlideButton } from "@/components/site/ui/Button";
import { Eyebrow, Reveal } from "@/components/site/ui/Primitives";
import { assets } from "@/lib/assets";
import { pricing } from "@/lib/content";
import { spring } from "@/lib/motion";

export function Pricing() {
  const [yearly, setYearly] = useState(false);

  return (
    <section id="pricing" className="relative pb-[120px] md:pb-[200px]">
      <div className="mx-auto w-full max-w-[860px] px-[30px]">
        <div className="flex flex-col items-center gap-[50px]">
          <Reveal className="flex flex-col items-center gap-2.5">
            <Eyebrow>{pricing.eyebrow}</Eyebrow>
            <h2 className="t-h2 text-center">{pricing.title}</h2>
          </Reveal>

          <div className="flex w-full flex-col items-center">
            {/* billing toggle */}
            <Reveal y={10} className="relative flex items-center gap-5 px-5 py-2.5">
              <span className="absolute inset-x-[-39px] bottom-0 h-px bg-white" />
              <span className="text-[18px] leading-[1.3] font-medium text-ink">
                {pricing.monthlyLabel}
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={yearly}
                aria-label="Bill yearly"
                onClick={() => setYearly((v) => !v)}
                className={clsx(
                  "flex h-[30px] w-[60px] items-center rounded-[6px] p-[3px] transition-colors duration-300",
                  yearly ? "bg-brand-light" : "bg-surface",
                )}
              >
                <motion.span
                  layout
                  transition={spring(0.35)}
                  className="size-6 rounded-[4px] bg-white shadow-[0_2px_6px_0_rgba(0,0,0,0.1)]"
                  style={{ marginLeft: yearly ? "auto" : 0 }}
                />
              </button>
              <span className="flex items-center gap-1.5">
                <span className="text-[18px] leading-[1.3] font-medium text-ink">
                  {pricing.yearlyLabel}
                </span>
                <span className="rounded-full bg-[rgba(16,185,129,0.2)] px-2.5 py-0.5 text-[14px] leading-[1.3] font-semibold text-success">
                  {pricing.discountLabel}
                </span>
              </span>
            </Reveal>

            <Reveal y={30} className="flex w-full flex-col gap-[30px]">
              <div className="flex flex-col items-center gap-5 rounded-[30px] p-1.5 pb-5">
                <div className="grid w-full gap-2.5 rounded-[24px] bg-surface p-2.5 md:grid-cols-2">
                  {pricing.plans.map((plan) => (
                    <PlanCard key={plan.name} plan={plan} yearly={yearly} />
                  ))}
                </div>
                <ul className="flex flex-wrap items-center justify-center gap-5">
                  {pricing.notes.map((note, i) => (
                    <li key={note} className="flex items-center gap-5">
                      {i > 0 && <span className="size-1 rounded-full bg-dim" />}
                      <span className="t-body-sm">{note}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* enterprise strip */}
              <div className="relative overflow-hidden rounded-[30px] bg-[linear-gradient(#e2f5ff_0%,#fff_100%)] p-[30px]">
                <div className="relative z-1 flex flex-col gap-5 sm:flex-row sm:items-center">
                  <div className="flex flex-1 flex-col gap-2.5">
                    <h3 className="t-h5">{pricing.enterprise.title}</h3>
                    <p className="t-body-lg max-w-[406px]">{pricing.enterprise.description}</p>
                  </div>
                  <SlideButton
                    label={pricing.enterprise.cta.label}
                    href={pricing.enterprise.cta.href}
                    tone="ink"
                  />
                </div>
                <Image
                  src={assets.pricing.enterprise}
                  alt=""
                  width={455}
                  height={180}
                  className="pointer-events-none absolute -right-[50px] -bottom-[40px] w-[455px] max-w-none"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function PlanCard({ plan, yearly }) {
  const dark = plan.popular;
  const price = yearly ? plan.yearly : plan.monthly;

  return (
    <div
      className={clsx(
        "flex flex-col gap-[30px] overflow-hidden rounded-[20px] p-[30px]",
        dark ? "bg-[linear-gradient(132deg,#323232_0%,#000_100%)]" : "bg-surface",
      )}
    >
      <div className="flex items-start gap-2.5">
        <div className="flex flex-1 flex-col gap-1.5">
          <h3 className={clsx("t-h5", dark && "text-white")}>{plan.name}</h3>
          <p className={clsx("text-[18px] leading-[1.3] font-medium", dark ? "text-grey" : "text-dim")}>
            {plan.tagline}
          </p>
        </div>
        {plan.popular && (
          <span className="rounded-full bg-[linear-gradient(110deg,#406ae4_0%,#5290f4_100%)] px-3.5 py-1.5 text-[14px] leading-[1.3] font-semibold text-white">
            Popular
          </span>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <span
          className={clsx(
            "font-display text-[40px] leading-[1.2] font-semibold",
            dark ? "text-white" : "text-ink",
          )}
        >
          <RollingPrice value={price} />
        </span>
        <span className={clsx("text-[18px] leading-[1.3] font-medium", dark ? "text-grey" : "text-dim")}>
          /month
        </span>
      </div>

      <SlideButton
        label={plan.cta}
        href={plan.ctaHref}
        tone={dark ? "white" : "ink"}
        className="w-full"
      />

      <ul className="flex flex-col gap-2.5">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-1.5">
            <Image
              src={assets.icons.chevronBlue}
              alt=""
              width={7}
              height={10}
              className="mt-[6px] w-[7px] shrink-0"
            />
            <span
              className={clsx(
                "text-[16px] leading-[1.3] font-medium",
                dark ? "text-[#edf1f4]" : "text-ink",
              )}
            >
              {feature}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** `$` plus one masked column per digit, so digits roll when the plan flips. */
function RollingPrice({ value }) {
  const digits = String(value).split("");
  return (
    <span className="inline-flex items-baseline">
      <span>$</span>
      {digits.map((digit, i) => (
        <span key={i} className="relative inline-block h-[48px] overflow-hidden align-bottom">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.span
              key={digit}
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "-100%", opacity: 0 }}
              transition={spring(0.45)}
              className="block"
            >
              {digit}
            </motion.span>
          </AnimatePresence>
        </span>
      ))}
    </span>
  );
}
