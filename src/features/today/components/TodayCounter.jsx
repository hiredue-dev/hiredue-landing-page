"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
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
 * preview never shows zeros. In the browser the numbers count up on arrival,
 * then refresh once a minute while the page is on screen; when today's count
 * moves, the gain floats off the number.
 */
export function TodayCounter({ initial }) {
  const [stats, setStats] = useState(initial);
  const [gain, setGain] = useState(null);
  const gainId = useRef(0);
  const latest = useRef(initial);

  useEffect(() => {
    let cancelled = false;
    const refresh = async () => {
      const next = await fetchTodayStats({ revalidate: 0 });
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

        <Reveal delay={0.08}>
          <TodayHero value={stats?.applicationsToday} pace={pace} asOf={asOf} gain={gain} />
        </Reveal>

        <div className="grid gap-6 min-[900px]:grid-cols-2">
          <Reveal delay={0.16} className="h-full">
            <WeekCard
              eyebrow="This week"
              value={stats?.applications7d}
              label="applications sent in the last 7 days"
              days={days}
              pick={(d) => d.applications}
              chartLabel="Applications per day, last 7 days"
            />
          </Reveal>
          <Reveal delay={0.24} className="h-full">
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

function useArrivalCount(value) {
  const reduce = useReducedMotion();
  return useCountUp(value ?? 0, 1400, { from: reduce ? undefined : 0 });
}

function TodayHero({ value, pace, asOf, gain }) {
  const shown = useArrivalCount(value);
  const reduce = useReducedMotion();
  const progress = pace ? `${(pace.progress * 100).toFixed(2)}%` : "0%";

  return (
    <div className="relative flex flex-col gap-7 overflow-hidden rounded-[32px] bg-[linear-gradient(115deg,#406ae4_0%,#2f55d4_100%)] p-8 text-white shadow-[0_24px_60px_rgba(47,85,212,0.28)] min-[810px]:p-14">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="flex min-w-0 flex-col gap-2">
          <span className="text-[14px] font-semibold tracking-[0.4px] text-white/90 uppercase min-[810px]:text-[16px]">
            Applications sent today
          </span>
          <div className="relative inline-flex items-start">
            <span className="font-display text-[88px] leading-[0.95] font-bold tracking-[-4px] tabular-nums min-[810px]:text-[128px] min-[1200px]:text-[168px] min-[1200px]:tracking-[-5px]">
              {value == null ? "—" : formatCount(shown)}
            </span>
            <AnimatePresence>
              {gain && !reduce && (
                <motion.span
                  key={gain.id}
                  aria-hidden="true"
                  className="font-display absolute -top-1 -right-2 translate-x-full text-[28px] font-bold min-[810px]:text-[32px]"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: [0, 1, 1, 0], y: -36 }}
                  transition={{ duration: 1.1, ease: "easeOut" }}
                >
                  +{formatCount(gain.delta)}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        {pace?.everySeconds != null && (
          <div className="flex min-w-[240px] flex-col gap-1.5 rounded-[20px] bg-white/[0.14] px-6 py-5">
            <span className="text-[14px] font-medium text-white/90">Right now, that&apos;s</span>
            <span className="font-display text-[28px] leading-[1.1] font-bold min-[810px]:text-[30px]">
              one every {formatEvery(pace.everySeconds)}
            </span>
            <span className="text-[14px] font-medium text-white/90">averaged since midnight IST</span>
          </div>
        )}
      </div>

      {pace && (
        <div className="flex flex-col gap-2.5">
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

function WeekCard({ eyebrow, value, label, days, pick, chartLabel }) {
  const shown = useArrivalCount(value);
  const reduce = useReducedMotion();
  const values = days.map(pick);
  const max = Math.max(1, ...values);

  return (
    <div className="flex h-full flex-col gap-7 rounded-[32px] bg-surface p-7 min-[810px]:p-11">
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
          className="mt-auto grid h-[150px] grid-cols-7 items-end gap-2.5"
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
