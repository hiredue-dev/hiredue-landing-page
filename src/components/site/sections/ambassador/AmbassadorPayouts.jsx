"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import { Eyebrow, Reveal } from "@/components/site/ui/Primitives";
import { ambassadorPage } from "@/lib/content";
import { spring } from "@/lib/motion";
import { commissionPayout, compactViews, money, viewsPayout } from "./earnings";
import { useCountUp } from "./use-count-up";

const { payouts } = ambassadorPage;
const { estimator, tiers } = payouts;

const MAX_VIEWS = tiers[tiers.length - 1].views;
const MAX_SALES = 50;

/** Which published tier a given view count falls into. */
const band = (views) =>
  (tiers.find((t) => views <= t.views) ?? tiers[tiers.length - 1]).label;

export function AmbassadorPayouts() {
  const [views, setViews] = useState(50_000);
  const [sales, setSales] = useState(10);

  const fromViews = viewsPayout(views);
  const fromSales = commissionPayout(sales);
  const total = useCountUp(fromViews + fromSales, 500);

  /* the split bar under the total, so the two streams stay legible as one
     slider is pushed far past the other */
  const share = fromViews + fromSales === 0 ? 0.5 : fromViews / (fromViews + fromSales);

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
            {/* rate card */}
            <div className="flex flex-col gap-5 rounded-[30px] bg-surface p-[26px] min-[810px]:p-10">
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <h3 className="t-h4">Paid on reach</h3>
                  <p className="t-body">Every month, across everything you posted.</p>
                </div>
                {payouts.placeholder && (
                  <span className="shrink-0 rounded-full bg-white px-3 py-1.5 text-[11px] leading-none font-semibold tracking-wide text-dim uppercase">
                    Example
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2.5">
                {tiers.map((tier, i) => (
                  <div
                    key={tier.label}
                    className="flex items-center gap-4 rounded-[16px] bg-white px-5 py-4"
                  >
                    <span className="w-[92px] shrink-0 text-[15px] leading-none font-semibold text-ink">
                      {tier.label}
                    </span>
                    <span className="relative h-2 flex-1 overflow-hidden rounded-full bg-surface">
                      <motion.span
                        initial={{ width: 0 }}
                        whileInView={{ width: `${((i + 1) / tiers.length) * 100}%` }}
                        viewport={{ once: true, amount: 0.6 }}
                        transition={spring(0.7, 0.08 * i)}
                        className="absolute inset-y-0 left-0 rounded-full bg-[linear-gradient(90deg,#5290f4_0%,#406ae4_100%)]"
                      />
                    </span>
                    <span className="w-[68px] shrink-0 text-right text-[16px] leading-none font-semibold text-brand tabular-nums">
                      {money(tier.payout)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-2.5 rounded-[16px] bg-white px-5 py-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[15px] leading-none font-semibold text-ink">
                    Paid on referrals
                  </span>
                  <span className="rounded-full bg-success-20 px-2.5 py-1 text-[13px] leading-none font-semibold text-success">
                    {Math.round(payouts.commission * 100)}% of every sale
                  </span>
                </div>
                <p className="t-body-sm">
                  Your code, your commission — for as long as they buy through it.
                </p>
              </div>

              <p className="t-body-sm">{payouts.note}</p>
            </div>

            {/* estimator */}
            <div className="flex flex-col gap-6 rounded-[30px] bg-[linear-gradient(160deg,#1d1d1d_0%,#323232_100%)] p-[26px] min-[810px]:p-10">
              <div className="flex flex-col gap-1">
                <h3 className="t-h4 text-white">{estimator.title}</h3>
                <p className="text-[16px] leading-[1.3] font-medium text-white/60">
                  Drag either one. The maths is the rate card on the left.
                </p>
              </div>

              <Slider
                label={estimator.viewsLabel}
                value={views}
                display={compactViews(views)}
                min={0}
                max={MAX_VIEWS}
                step={5_000}
                onChange={setViews}
              />
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
                That reach sits in the{" "}
                <span className="font-semibold text-white/80">{band(views)}</span> band on the rate
                card, and each sale pays you{" "}
                <span className="font-semibold text-white/80">
                  {money(payouts.planPrice * payouts.commission)}
                </span>
                .
              </p>

              <div className="mt-auto flex flex-col gap-4 rounded-[20px] bg-white/8 p-5">
                <div className="flex flex-col gap-2.5">
                  <Line label={estimator.viewsPayoutLabel} value={money(fromViews)} dot="bg-brand-lighter" />
                  <Line label={estimator.commissionLabel} value={money(fromSales)} dot="bg-success" />
                </div>

                {/* how the total splits between the two streams */}
                <span className="flex h-2 overflow-hidden rounded-full bg-white/15">
                  <motion.span
                    className="bg-brand-lighter"
                    animate={{ width: `${share * 100}%` }}
                    transition={spring(0.4)}
                  />
                  <motion.span
                    className="bg-success"
                    animate={{ width: `${(1 - share) * 100}%` }}
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

function Slider({
  label,
  value,
  display,
  min,
  max,
  step,
  onChange,
}) {
  const pct = max === min ? 0 : ((value - min) / (max - min)) * 100;

  return (
    <label className="flex flex-col gap-2.5">
      <span className="flex items-baseline justify-between gap-3">
        <span className="text-[14px] leading-[1.3] font-medium text-white/60">{label}</span>
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

function Line({ label, value, dot }) {
  return (
    <span className="flex items-center justify-between gap-3">
      <span className="flex items-center gap-2 text-[14px] leading-[1.3] font-medium text-white/70">
        <span className={clsx("size-2 shrink-0 rounded-full", dot)} />
        {label}
      </span>
      <span className="shrink-0 text-[16px] leading-none font-semibold text-white tabular-nums">
        {value}
      </span>
    </span>
  );
}
