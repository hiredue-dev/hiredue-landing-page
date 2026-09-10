"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Eyebrow, Reveal } from "@/components/site/ui/Primitives";
import { ambassadorPage } from "@/lib/content";
import { spring } from "@/lib/motion";
import { commissionPayout, money } from "./earnings";
import { useCountUp } from "./use-count-up";

const { payouts } = ambassadorPage;
const { estimator } = payouts;

const MAX_SALES = 50;

export function AmbassadorPayouts() {
  const [sales, setSales] = useState(10);
  const fromSales = commissionPayout(sales);
  const total = useCountUp(fromSales, 500);
  const commissionPerSale = commissionPayout(1);

  return (
    <section
      id="payouts"
      className="relative pb-[100px] min-[810px]:pb-[160px] min-[1200px]:pb-[200px]"
    >
      <div className="container-page">
        <div className="flex flex-col items-center gap-[30px] min-[810px]:gap-10 min-[1200px]:gap-[50px]">
          <Reveal className="flex max-w-[860px] flex-col items-center gap-2.5">
            <Eyebrow>{payouts.eyebrow}</Eyebrow>
            <h2 className="t-h2 text-center">{payouts.title}</h2>
            <p className="t-body-lg text-center">{payouts.description}</p>
          </Reveal>

          <Reveal
            y={30}
            className="grid w-full gap-5 min-[1000px]:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] min-[1000px]:gap-[30px]"
          >
            {/* referral model */}
            <div className="flex flex-col gap-5 rounded-[30px] bg-surface p-[26px] min-[810px]:p-10">
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <h3 className="t-h4">Earn on every referral</h3>
                  <p className="t-body">
                    You earn when someone buys through your code or link.
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-success-20 px-3 py-1.5 text-[13px] leading-none font-semibold text-success">
                  Up to {money(payouts.perReferral)}
                </span>
              </div>

              <div className="flex flex-col gap-2.5">
                {[
                  [
                    "01",
                    "Share your code",
                    "Add your personal referral code or link to your content.",
                  ],
                  [
                    "02",
                    "A customer buys",
                    "Their eligible purchase is tracked back to your account.",
                  ],
                  [
                    "03",
                    "Earn your commission",
                    `You receive up to ${money(payouts.perReferral)} for that referral.`,
                  ],
                ].map(([number, title, description]) => (
                  <div
                    key={number}
                    className="flex items-start gap-3 rounded-[16px] bg-white px-5 py-4"
                  >
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand/10 text-[11px] font-bold text-brand">
                      {number}
                    </span>
                    <span className="flex flex-col gap-1">
                      <strong className="text-[15px] leading-[1.2] font-semibold text-ink">
                        {title}
                      </strong>
                      <span className="t-body-sm">{description}</span>
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-2.5 rounded-[16px] bg-white px-5 py-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[15px] leading-none font-semibold text-ink">
                    Earnings per referral
                  </span>
                  <span className="text-[18px] leading-none font-semibold text-brand tabular-nums">
                    {money(commissionPerSale)}
                  </span>
                </div>
                <p className="t-body-sm">Paid for every eligible referral, on any plan.</p>
              </div>

              <p className="t-body-sm">{payouts.note}</p>
            </div>

            {/* estimator */}
            <div className="flex flex-col gap-6 rounded-[30px] bg-[linear-gradient(160deg,#1d1d1d_0%,#323232_100%)] p-[26px] min-[810px]:p-10">
              <div className="flex flex-col gap-1">
                <h3 className="t-h4 text-white">{estimator.title}</h3>
                <p className="text-[16px] leading-[1.3] font-medium text-white/60">
                  Adjust the number of customers who purchase through your
                  referral.
                </p>
              </div>

              <Slider
                label={estimator.salesLabel}
                value={sales}
                display={`${sales}`}
                min={0}
                max={MAX_SALES}
                step={1}
                onChange={setSales}
              />

              <p className="text-[13px] leading-[1.3] font-medium text-white/45">
                Each eligible referred sale earns you{" "}
                <span className="font-semibold text-white/80">
                  {money(commissionPerSale)}
                </span>
                , on any plan.
              </p>

              <div className="mt-auto flex flex-col gap-4 rounded-[20px] bg-white/8 p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 text-[14px] leading-[1.3] font-medium text-white/70">
                    <span className="size-2 shrink-0 rounded-full bg-success" />
                    {estimator.commissionLabel}
                  </span>
                  <span className="shrink-0 text-[16px] leading-none font-semibold text-white tabular-nums">
                    {money(fromSales)}
                  </span>
                </div>

                <span className="relative h-2 overflow-hidden rounded-full bg-white/15">
                  <motion.span
                    className="absolute inset-y-0 left-0 rounded-full bg-success"
                    animate={{ width: `${(sales / MAX_SALES) * 100}%` }}
                    transition={spring(0.4)}
                  />
                </span>

                <div className="flex items-end justify-between gap-3">
                  <span className="text-[15px] leading-[1.3] font-semibold text-white/70">
                    {estimator.totalLabel}
                  </span>
                  <span className="font-display text-[38px] leading-none font-semibold text-white tabular-nums">
                    {money(total)}
                  </span>
                </div>
              </div>

              <p className="text-[13px] leading-[1.3] font-medium text-white/45">
                {estimator.disclaimer}
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Slider({ label, value, display, min, max, step, onChange }) {
  const pct = max === min ? 0 : ((value - min) / (max - min)) * 100;

  return (
    <label className="flex flex-col gap-2.5">
      <span className="flex items-baseline justify-between gap-3">
        <span className="text-[14px] leading-[1.3] font-medium text-white/60">
          {label}
        </span>
        <span className="font-display text-[20px] leading-none font-semibold text-white tabular-nums">
          {display}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range-blue"
        style={{ backgroundSize: `${pct}% 100%` }}
      />
    </label>
  );
}
