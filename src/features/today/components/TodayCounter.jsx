"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Activity } from "lucide-react";
import clsx from "clsx";
import { Eyebrow, Reveal } from "@/components/site/ui/Primitives";
import { ArrowButton } from "@/components/site/ui/Button";
import { useCountUp } from "@/components/site/sections/ambassador/use-count-up";
import { inView, spring } from "@/lib/motion";
import {
  TODAY_REFRESH_MS,
  dayPace,
  fetchTodayStats,
  formatAsOf,
  formatCount,
  formatEvery,
  weekdayLabel,
} from "@/features/today/todayStats";

/*
 * The server renders the page with real numbers, so a screenshot or a link
 * preview never shows zeros. In the browser the numbers roll and count up on
 * arrival, then refresh once a minute while the page is on screen; when
 * today's count moves, its digits roll on, it glows, and the gain floats off.
 */
export function TodayCounter({ initial }) {
  const [stats, setStats] = useState(initial);
  const [gain, setGain] = useState(null);
  const gainId = useRef(0);
  const latest = useRef(initial);

  useEffect(() => {
    let cancelled = false;
    const refresh = async () => {
      const next = await fetchTodayStats({ fresh: true });
      // A failed refresh keeps the last good numbers rather than blanking them.
      if (cancelled || !next) return;
      const prev = latest.current;
      const delta = prev ? next.applicationsToday - prev.applicationsToday : 0;
      latest.current = next;
      setStats(next);
      if (delta > 0) setGain({ id: ++gainId.current, delta });
    };
    const id = setInterval(() => {
      if (document.visibilityState === "visible") refresh();
    }, TODAY_REFRESH_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") refresh();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      cancelled = true;
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  useEffect(() => {
    if (!gain) return;
    const t = setTimeout(() => setGain(null), 1200);
    return () => clearTimeout(t);
  }, [gain]);

  const asOf = stats ? formatAsOf(stats.asOf, stats.timezone) : null;
  const pace = dayPace(stats);
  const days = stats?.days ?? [];

  return (
    <section className="relative pt-[140px] pb-[80px] min-[810px]:pt-[170px] min-[1200px]:pb-[120px] min-[1200px]:pt-[194px]">
      <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-6 px-4 min-[810px]:px-[30px]">
        <Reveal className="mb-6 flex flex-col items-center gap-3.5 text-center">
          <Eyebrow>
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60 motion-reduce:hidden" />
              <span className="relative inline-flex size-2 rounded-full bg-success" />
            </span>
            Live{asOf ? ` · updated ${asOf}` : ""}
          </Eyebrow>
          <h1 className="t-h2 text-center">Today on HireDue</h1>
          <p className="t-body-lg max-w-[540px] text-center">
            Every application HireDue sends and every recruiter who writes back, counted as it happens.
          </p>
        </Reveal>

        <div className="flex flex-wrap gap-6">
          <Reveal delay={0.08} className="min-w-0 flex-[2_1_600px]">
            <TodayHero value={stats?.applicationsToday} pace={pace} asOf={asOf} gain={gain} />
          </Reveal>
          <Reveal delay={0.16} className="min-w-0 flex-[1_1_300px]">
            <PaceCard pace={pace} />
          </Reveal>
        </div>

        <div className="flex flex-wrap gap-6">
          <Reveal delay={0.24} className="min-w-0 flex-[7_1_440px]">
            <WeekCard
              eyebrow="This week"
              value={stats?.applications7d}
              label="applications sent in the last 7 days"
              days={days}
              pick={(d) => d.applications}
              chartLabel="Applications per day, last 7 days"
            />
          </Reveal>
          <Reveal delay={0.32} className="min-w-0 flex-[5_1_340px]">
            <WeekCard
              eyebrow="Recruiters wrote back"
              value={stats?.recruiterReplies7d}
              label="recruiter replies in the last 7 days"
              days={days}
              pick={(d) => d.replies}
              chartLabel="Recruiter replies per day, last 7 days"
            />
          </Reveal>
        </div>

        <Reveal delay={0.1} className="mt-10 flex flex-col items-center gap-6 text-center">
          <h2 className="t-h3 max-w-[640px] text-center">
            Tomorrow&apos;s count starts at midnight. Be in it.
          </h2>
          <ArrowButton label="Get HireDue" href="/download" />
          <p className="max-w-[600px] text-[14px] leading-[1.55] text-dim">
            Counts across all HireDue users, refreshed every minute. Recruiter replies leave out
            automatic &ldquo;we received your application&rdquo; emails.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

const cardLift =
  "transition-transform duration-[350ms] ease-[cubic-bezier(.2,.7,.2,1)] hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0";

function useArrivalCount(value) {
  const reduce = useReducedMotion();
  return useCountUp(value ?? 0, 1400, { from: reduce ? undefined : 0 });
}

/*
 * Odometer: each digit is a 0–9 column slid to its value. Server and first
 * client render both sit at zero (so hydration matches); the roll starts on
 * mount, right-hand digit first. Columns are keyed from the right so a new
 * leading digit (999 → 1,000) doesn't reroll the others. Screen readers get
 * the plain number.
 */
function Odometer({ value }) {
  const [rolled, setRolled] = useState(false);
  const firstRoll = useRef(true);

  useEffect(() => {
    const t = setTimeout(() => setRolled(true), 250);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    if (!rolled) return;
    // Stagger only the arrival; later updates roll together.
    const t = setTimeout(() => (firstRoll.current = false), 2000);
    return () => clearTimeout(t);
  }, [rolled]);

  const text = formatCount(value);
  const chars = text.split("");
  const digitCount = chars.filter((c) => /\d/.test(c)).length;
  let fromRight = digitCount;

  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="inline-flex">
        {chars.map((c, i) => {
          const key = `${chars.length - i}`;
          if (!/\d/.test(c)) {
            return (
              <span key={key} className="inline-block w-[0.26em] text-center">
                {c}
              </span>
            );
          }
          fromRight -= 1;
          const digit = rolled ? Number(c) : 0;
          return (
            <span key={key} className="inline-block h-[1em] w-[0.6em] overflow-hidden align-top">
              <span
                className="flex flex-col transition-transform duration-[1400ms] ease-[cubic-bezier(.16,1,.3,1)] motion-reduce:transition-none"
                style={{
                  transform: `translateY(${-digit * 10}%)`,
                  transitionDelay: firstRoll.current ? `${fromRight * 0.12}s` : "0s",
                }}
              >
                {"0123456789".split("").map((d) => (
                  <span key={d} className="block h-[1em] text-center leading-[1em]">
                    {d}
                  </span>
                ))}
              </span>
            </span>
          );
        })}
      </span>
    </>
  );
}

function TodayHero({ value, pace, asOf, gain }) {
  const reduce = useReducedMotion();
  const progress = pace ? `${(pace.progress * 100).toFixed(2)}%` : "0%";

  return (
    <div className="relative flex h-full flex-col justify-between gap-10 overflow-hidden rounded-[32px] bg-[linear-gradient(115deg,#406ae4_0%,#2f55d4_100%)] p-8 text-white shadow-[0_24px_60px_rgba(47,85,212,0.28)] min-[810px]:p-14">
      <svg
        viewBox="0 0 400 400"
        aria-hidden="true"
        className="pointer-events-none absolute -top-[140px] -right-[140px] size-[440px] animate-[spin_60s_linear_infinite] motion-reduce:animate-none"
      >
        <circle cx="200" cy="200" r="198" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="1.5" strokeDasharray="3 9" />
        <circle cx="200" cy="200" r="150" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
        <circle cx="200" cy="200" r="100" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
        <circle cx="200" cy="2" r="5" fill="rgba(255,255,255,0.6)" />
      </svg>

      <div className="relative flex flex-col gap-2.5">
        <span className="text-[14px] font-semibold tracking-[0.4px] text-white/90 uppercase min-[810px]:text-[16px]">
          Applications sent today
        </span>
        <div className="relative inline-flex items-start self-start">
          <span
            className={clsx(
              "font-display inline-flex text-[72px] leading-none font-bold tracking-[-3px] min-[480px]:text-[88px] min-[810px]:text-[128px] min-[1200px]:text-[168px] min-[1200px]:tracking-[-4px]",
              // Two identical keyframes, alternated, so each update restarts the glow.
              gain && !reduce && (gain.id % 2 ? "animate-[today-flash-a_.9s_ease-out]" : "animate-[today-flash-b_.9s_ease-out]"),
            )}
          >
            {value == null ? "—" : <Odometer value={value} />}
          </span>
          <AnimatePresence>
            {gain && !reduce && (
              <motion.span
                key={gain.id}
                aria-hidden="true"
                className="font-display absolute -top-1.5 -right-2 translate-x-full text-[28px] font-bold min-[810px]:text-[32px]"
                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                animate={{ opacity: [0, 1, 1, 0], y: [10, 0, -20, -40], scale: [0.8, 1, 1, 1] }}
                transition={{ duration: 1.1, ease: "easeOut" }}
              >
                +{formatCount(gain.delta)}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {pace && (
        <div className="relative flex flex-col gap-2.5">
          <div className="relative h-2.5 rounded-full bg-white/20">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full bg-white"
              initial={{ width: reduce ? progress : "0%" }}
              animate={{ width: progress }}
              transition={spring(1.4, 0.2)}
            />
            <motion.div
              aria-hidden="true"
              className="absolute top-1/2 -mt-[9px] -ml-[9px] size-[18px] rounded-full bg-white motion-safe:animate-[today-now_1.6s_ease-out_infinite]"
              initial={{ left: reduce ? progress : "0%" }}
              animate={{ left: progress }}
              transition={spring(1.4, 0.2)}
            />
          </div>
          <div className="flex justify-between text-[13px] font-medium text-white/90">
            <span>12 AM</span>
            {asOf && <span>Now · {asOf}</span>}
            <span>Midnight</span>
          </div>
        </div>
      )}
    </div>
  );
}

function PaceCard({ pace }) {
  return (
    <div
      className={clsx(
        "flex h-full flex-col justify-between gap-8 rounded-[32px] bg-ink p-7 text-white min-[810px]:p-10",
        cardLift,
      )}
    >
      <div className="relative grid size-[120px] place-items-center">
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-brand/35 motion-safe:animate-[today-breathe_3.2s_ease-in-out_infinite]"
        />
        <span aria-hidden="true" className="absolute inset-[22px] rounded-full bg-brand" />
        <Activity aria-hidden="true" className="relative size-[34px]" strokeWidth={2} />
      </div>
      {pace?.everySeconds != null ? (
        <div className="flex flex-col gap-2">
          <span className="text-[15px] font-medium text-white/80">Right now, that&apos;s</span>
          <span className="font-display text-[36px] leading-[1.05] font-bold tracking-[-1.2px] min-[1200px]:text-[48px]">
            one every {formatEvery(pace.everySeconds)}
          </span>
          <span className="text-[14px] font-medium text-white/80">averaged since midnight IST</span>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <span className="font-display text-[32px] leading-[1.1] font-bold tracking-[-1px]">
            The day&apos;s count has just begun
          </span>
          <span className="text-[14px] font-medium text-white/80">counting since midnight IST</span>
        </div>
      )}
    </div>
  );
}

function WeekCard({ eyebrow, value, label, days, pick, chartLabel }) {
  const shown = useArrivalCount(value);
  const reduce = useReducedMotion();
  const values = days.map(pick);
  const max = Math.max(1, ...values);

  return (
    <div className={clsx("flex h-full flex-col gap-7 rounded-[32px] bg-surface p-7 min-[810px]:p-11", cardLift)}>
      <div className="flex flex-col gap-1.5">
        <span className="text-[14px] font-semibold tracking-[0.4px] text-dim uppercase">{eyebrow}</span>
        <span className="font-display text-[56px] leading-none font-bold tracking-[-2px] text-ink tabular-nums min-[1200px]:text-[84px] min-[1200px]:tracking-[-2.5px]">
          {value == null ? "—" : formatCount(shown)}
        </span>
        <span className="text-[18px] leading-[1.3] font-medium text-ink">{label}</span>
      </div>

      {days.length > 0 && (
        <motion.div
          {...inView}
          role="img"
          aria-label={`${chartLabel}: ${days
            .map((d, i) => `${i === days.length - 1 ? "today" : weekdayLabel(d.date)} ${values[i]}`)
            .join(", ")}`}
          className="mt-auto grid h-[150px] grid-cols-7 items-end gap-2"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: reduce ? 0 : 0.06 } } }}
        >
          {days.map((d, i) => {
            const isToday = i === days.length - 1;
            return (
              <div key={d.date} className="flex h-full flex-col items-center justify-end gap-2">
                <motion.div
                  className={clsx("w-full rounded-[10px]", isToday ? "bg-brand" : "bg-[#c5d3f5]")}
                  style={{ height: `${Math.max(3, (values[i] / max) * 75)}%`, originY: 1 }}
                  variants={{
                    hidden: { scaleY: reduce ? 1 : 0 },
                    visible: { scaleY: 1, transition: spring(0.9) },
                  }}
                />
                <span className={clsx("text-[13px]", isToday ? "font-semibold text-ink" : "font-medium text-dim")}>
                  {isToday ? "Today" : weekdayLabel(d.date)}
                </span>
              </div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
