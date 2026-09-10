"use client";

import Image from "next/image";
import { useEffect, useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { assets } from "@/lib/assets";
import { spring } from "@/lib/motion";
import { commissionPayout, money } from "./earnings";
import { platformColor, platformIcons } from "./creator-icons";
import { useCountUp } from "./use-count-up";

/* Three sketches of the kind of creator the program is for. Earnings are
   derived from the same referral commission used by the estimator. */
const creators = [
  {
    handle: "@careerwithanya",
    niche: "Career coaching · 48K subs",
    platform: "YouTube",
    avatar: assets.testimonials.avatars.c,
    sales: 26,
    code: "ANYA",
    bars: [22, 34, 28, 52, 45, 78, 96],
  },
  {
    handle: "@thedevdiaries",
    niche: "Dev tooling · 12K followers",
    platform: "Instagram",
    avatar: assets.testimonials.avatars.a,
    sales: 11,
    code: "DEVD",
    bars: [30, 26, 44, 38, 62, 55, 84],
  },
  {
    handle: "@placedoncampus",
    niche: "Campus placements · 9K followers",
    platform: "LinkedIn",
    avatar: assets.testimonials.avatars.e,
    sales: 18,
    code: "CAMPUS",
    bars: [18, 40, 33, 58, 48, 70, 88],
  },
];

const DWELL = 4200;

/** The hero's proof-of-concept: one creator's referral month, on repeat. */
export function CreatorCard() {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const id = setTimeout(() => setI((v) => (v + 1) % creators.length), DWELL);
    return () => clearTimeout(id);
  }, [i, reduced]);

  const creator = creators[i];
  const fromSales = commissionPayout(creator.sales);

  const sales = useCountUp(creator.sales);
  const total = useCountUp(fromSales);

  return (
    <div className="relative w-full max-w-[520px]">
      <div className="flex flex-col gap-5 rounded-[30px] bg-white p-[26px] shadow-[0_24px_60px_rgba(29,29,29,0.12)] min-[810px]:p-[30px]">
        {/* who */}
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={creator.handle}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={spring(0.4)}
              >
                <Image
                  src={creator.avatar}
                  alt=""
                  width={44}
                  height={44}
                  className="size-11 rounded-full object-cover"
                />
              </motion.div>
            </AnimatePresence>
            <span
              className="absolute -right-1 -bottom-1 grid size-[22px] place-items-center rounded-full bg-white ring-2 ring-white"
              style={{ color: platformColor[creator.platform] }}
            >
              <span className="block size-[15px]">
                {platformIcons[creator.platform]}
              </span>
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={creator.handle}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={spring(0.4)}
              className="flex min-w-0 flex-col gap-0.5"
            >
              <p className="truncate text-[16px] leading-none font-semibold text-ink">
                {creator.handle}
              </p>
              <p className="truncate text-[13px] leading-none font-medium text-dim">
                {creator.niche}
              </p>
            </motion.div>
          </AnimatePresence>

          <span className="ml-auto shrink-0 rounded-full bg-surface px-3 py-1.5 text-[12px] leading-none font-semibold text-dim">
            Last 30 days
          </span>
        </div>

        {/* referral performance */}
        <div className="flex flex-col gap-3 rounded-[20px] bg-surface p-5">
          <div className="flex items-end justify-between gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-[13px] leading-none font-medium text-dim">
                Customers referred this month
              </span>
              <span className="font-display text-[28px] leading-none font-semibold text-ink tabular-nums">
                {Math.round(sales)}
              </span>
            </div>
            <span className="flex items-center gap-1 rounded-full bg-success-20 px-2.5 py-1 text-[12px] leading-none font-semibold text-success">
              <svg viewBox="0 0 24 24" aria-hidden className="size-3">
                <path
                  d="M12 19V5M12 5l-6 6M12 5l6 6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Growing
            </span>
          </div>

          <Sparkline key={creator.handle} points={creator.bars} />
        </div>

        {/* the money */}
        <div className="flex flex-col gap-3">
          <Row
            label="Commission per eligible sale"
            value={money(commissionPayout(1))}
          />
          <Row
            label={`Referral earnings · ${creator.sales} customers`}
            value={money(fromSales)}
            accent
          />

          <span className="h-px bg-line" />

          <div className="flex items-center justify-between gap-3">
            <span className="text-[15px] leading-none font-semibold text-ink">
              Paid out this month
            </span>
            <span className="font-display text-[30px] leading-none font-semibold text-brand tabular-nums">
              {money(total)}
            </span>
          </div>
        </div>
      </div>

      {/* the creator's own code, sitting proud of the card */}
      {/* min-width keeps the pill from collapsing while the code crossfades */}
      <div className="absolute -bottom-5 left-1/2 flex min-w-[212px] -translate-x-1/2 items-center justify-center gap-2 rounded-full bg-[linear-gradient(133deg,#406ae4_0%,#3b82f6_100%)] px-4 py-2.5 shadow-[0_10px_24px_rgba(58,119,229,0.45)]">
        <span className="shrink-0 text-[12px] leading-none font-medium whitespace-nowrap text-white/75">
          Your code
        </span>
        <AnimatePresence mode="wait">
          <motion.span
            key={creator.code}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={spring(0.35)}
            className="text-[14px] leading-none font-semibold tracking-wide whitespace-nowrap text-white"
          >
            HIREDUE-{creator.code}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* A compact referral trend for the creator's last 30 days. */
const SPARK_W = 300;
const SPARK_H = 64;

function sparkPath(points) {
  const max = Math.max(...points, 1);
  const step = SPARK_W / (points.length - 1);
  const xy = points.map((v, i) => [
    i * step,
    SPARK_H - (v / max) * (SPARK_H - 6) - 3,
  ]);

  let d = `M${xy[0][0]} ${xy[0][1]}`;
  for (let i = 1; i < xy.length; i += 1) {
    const [px, py] = xy[i - 1];
    const [x, y] = xy[i];
    const cx = (px + x) / 2;
    d += ` C${cx} ${py} ${cx} ${y} ${x} ${y}`;
  }
  return { d, last: xy[xy.length - 1] };
}

function Sparkline({ points }) {
  const { d, last } = sparkPath(points);
  const uid = useId().replace(/:/g, "");

  return (
    <svg
      viewBox={`0 0 ${SPARK_W} ${SPARK_H}`}
      preserveAspectRatio="none"
      aria-hidden
      className="h-[64px] w-full"
    >
      <defs>
        <linearGradient id={`sparkFill-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#406ae4" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#406ae4" stopOpacity="0" />
        </linearGradient>
        {/* the curve is drawn by wiping this window across it, which survives
            the non-uniform scale that a dash-based draw does not */}
        <clipPath id={`sparkWipe-${uid}`}>
          <motion.rect
            x="0"
            y="0"
            height={SPARK_H}
            initial={{ width: 0 }}
            animate={{ width: SPARK_W }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
          />
        </clipPath>
      </defs>

      <g clipPath={`url(#sparkWipe-${uid})`}>
        <path
          d={`${d} L${SPARK_W} ${SPARK_H} L0 ${SPARK_H} Z`}
          fill={`url(#sparkFill-${uid})`}
        />
        <path
          d={d}
          fill="none"
          stroke="#406ae4"
          strokeWidth={2.5}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </g>
      <motion.circle
        cx={last[0]}
        cy={last[1]}
        r={3}
        fill="#406ae4"
        stroke="#fff"
        strokeWidth={2}
        vectorEffect="non-scaling-stroke"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={spring(0.4, 0.85)}
      />
    </svg>
  );
}

function Row({ label, value, accent }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="flex items-center gap-2 text-[14px] leading-[1.3] font-medium text-dim">
        <span
          className={`size-2 shrink-0 rounded-full ${accent ? "bg-success" : "bg-brand-lighter"}`}
        />
        {label}
      </span>
      <span className="shrink-0 text-[16px] leading-none font-semibold text-ink tabular-nums">
        {value}
      </span>
    </div>
  );
}
