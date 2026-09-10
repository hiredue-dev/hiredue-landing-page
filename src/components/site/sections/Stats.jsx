"use client";

import { motion } from "framer-motion";
import clsx from "clsx";
import { Eyebrow, Reveal, RevealGroup, RevealItem } from "@/components/site/ui/Primitives";
import { stats } from "@/lib/content";

const tones = {
  light: {
    card: "bg-[linear-gradient(135deg,#edf1f4_0%,#edf1f4_100%)]",
    label: "text-dim",
    value: "text-ink",
    body: "text-dim",
    icon: "bg-[linear-gradient(133deg,#406ae4_0%,#3b82f6_100%)]",
  },
  dark: {
    card: "bg-[linear-gradient(135deg,#323232_0%,#000_100%)]",
    label: "text-white",
    value: "text-white",
    body: "text-[#edf1f4]",
    icon: "bg-white",
  },
  primary: {
    card: "bg-[linear-gradient(90deg,#406ae4_0%,#3b82f6_100%)]",
    label: "text-white",
    value: "text-white",
    body: "text-[#edf1f4]",
    icon: "bg-black",
  },
};

/* A full lap = a full day: the ring spins once every 24s. */
const DAY_DURATION = 24;

export function Stats() {
  return (
    <section className="relative pt-[100px]">
      <div className="container-page">
        {/* ---- large screens: cards scattered around the headline ---- */}
        <div className="relative hidden h-[1080px] w-full xl:block">
          {/* the day/night cycle, orbiting behind everything */}
          <div className="pointer-events-none absolute top-1/2 left-1/2 size-[820px] -translate-x-1/2 -translate-y-1/2">
            <div className="absolute inset-0 rounded-full border border-dashed border-line" />
            <motion.div
              className="absolute inset-0"
              animate={{ rotate: 360 }}
              transition={{ duration: DAY_DURATION, repeat: Infinity, ease: "linear" }}
            >
              <span className="absolute top-0 left-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[linear-gradient(135deg,#406ae4_0%,#3b82f6_100%)] shadow-[0_0_24px_6px_rgba(64,106,228,0.35)]">
                <motion.span
                  animate={{ rotate: -360 }}
                  transition={{ duration: DAY_DURATION, repeat: Infinity, ease: "linear" }}
                  className="grid place-items-center text-white"
                >
                  <SunIcon className="size-5" />
                </motion.span>
              </span>
            </motion.div>
          </div>

          <RevealGroup step={0.08} className="absolute inset-0">
            {stats.cards.map((card) => (
              /* placement copied from the original 1200 × 1080 stage */
              <RevealItem key={card.label} className="absolute" style={{ left: card.x, top: card.y }}>
                <StatCard {...card} />
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal className="absolute top-1/2 left-1/2 flex w-[700px] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2.5">
            <Eyebrow>{stats.eyebrow}</Eyebrow>
            <h2 className="t-h2 text-center">{stats.title}</h2>
            <p className="t-body-lg text-center">{stats.description}</p>
          </Reveal>
        </div>

        {/* ---- everything else: headline, then a plain grid ---- */}
        <div className="flex flex-col items-center gap-[50px] xl:hidden">
          <Reveal className="flex max-w-[700px] flex-col items-center gap-2.5">
            <Eyebrow>{stats.eyebrow}</Eyebrow>
            <h2 className="t-h2 text-center">{stats.title}</h2>
            <p className="t-body-lg text-center">{stats.description}</p>
          </Reveal>
          <RevealGroup
            step={0.08}
            className="grid w-full grid-cols-1 justify-items-center gap-[30px] sm:grid-cols-2 lg:grid-cols-3"
          >
            {stats.cards.map((card, i) => (
              <RevealItem key={card.label}>
                <StatCard {...card} index={i} />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}

function StatCard({ label, value, description, icon, tone, index = 0 }) {
  const t = tones[tone];
  const Icon = TIME_ICONS[icon] ?? SunIcon;
  return (
    <div
      className={clsx(
        "flex size-[280px] flex-col justify-between overflow-hidden rounded-[30px] p-[30px]",
        t.card,
      )}
    >
      <div className="flex items-start gap-2.5 pb-[30px]">
        <p className={clsx("flex-1 text-[16px] leading-[1.3] font-medium", t.label)}>{label}</p>
        <motion.span
          animate={{ scale: [1, 1.12, 1] }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.35,
          }}
          className={clsx("grid size-10 shrink-0 place-items-center rounded-full", t.icon)}
        >
          <Icon className={clsx("size-5", tone === "dark" ? "text-ink" : "text-white")} />
        </motion.span>
      </div>
      <div className="flex flex-col gap-1.5">
        <p className={clsx("t-h3", t.value)}>{value}</p>
        <p className={clsx("text-[16px] leading-[1.3] font-medium", t.body)}>{description}</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Minimal time-of-day glyphs — kept local since they're only used here. */

function SunriseIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <path d="M5 18h14M7.5 18a4.5 4.5 0 0 1 9 0M12 8V4M5.6 10.6l1.4 1.4M18.4 10.6 17 12M3 14h1.5M19.5 14H21" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SunIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M12 3v2.2M12 18.8V21M21 12h-2.2M5.2 12H3M18.4 5.6l-1.5 1.5M7.1 16.9l-1.5 1.5M18.4 18.4l-1.5-1.5M7.1 7.1 5.6 5.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function CloudSunIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <path d="M8.2 6V4M4.6 8.6 3.4 7.4M4 12.5H2M13 8.6l1.2-1.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="8.2" cy="12.5" r="3.1" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M9.5 14.2h6.3a3 3 0 0 0 .5-5.96 4 4 0 0 0-7.55-1.55"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M6 19h13M9 19a3 3 0 0 1 6 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function SunsetIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <path d="M5 18h14M7.5 14a4.5 4.5 0 0 1 9 0M12 10V4M5.6 8.6l1.4 1.4M18.4 8.6 17 10M3 14h1.5M19.5 14H21" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MoonIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <path
        d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.6 6.6 0 0 0 10.5 10.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M17 3v3M15.5 4.5h3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

const TIME_ICONS = {
  sunrise: SunriseIcon,
  sun: SunIcon,
  "cloud-sun": CloudSunIcon,
  sunset: SunsetIcon,
  moon: MoonIcon,
};
