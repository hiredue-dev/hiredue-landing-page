"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import clsx from "clsx";
import { Reveal } from "@/components/site/ui/Primitives";
import { ArrowButton } from "@/components/site/ui/Button";
import { useCountUp } from "@/components/site/sections/ambassador/use-count-up";
import { inView, spring } from "@/lib/motion";
import {
  TODAY_REFRESH_MS,
  dayPace,
  fetchTodayStats,
  formatCount,
  weekdayLabel,
} from "@/features/today/todayStats";
import { clockAt } from "@/features/today/sky";
import { TodaySky } from "./TodaySky";

/*
 * The server renders the page with real numbers, so a screenshot or a link
 * preview never shows zeros. In the browser today's count rolls in, the week
 * counts up, and the page refreshes once a minute while it's on screen; the
 * sky follows the hour the numbers were read at.
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

  const pace = dayPace(stats);
  const hour = useSkyHour(pace);
  const clock = clockAt(hour);
  const days = stats?.days ?? [];

  return (
    <section className="relative pt-[120px] pb-[64px] min-[810px]:pt-[150px] min-[1200px]:pt-[170px] min-[1200px]:pb-[96px]">
      <div className="mx-auto flex w-full max-w-[1140px] flex-col gap-4 px-4 min-[810px]:px-[30px]">
        <Reveal className="mb-2 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
          <div className="flex flex-col gap-1.5">
            <h1 className="font-display text-[30px] leading-[1.1] font-semibold tracking-[-1px] text-ink min-[810px]:text-[40px]">
              Today on HireDue
            </h1>
            <p className="text-[16px] leading-[1.4] font-medium text-dim">
              Every application sent and every recruiter reply, counted as it happens.
            </p>
          </div>
          {/* With no numbers at all (the stats service down on first load),
              don't claim "Live" over a row of dashes: say so, and stop the
              pulse. A refresh that later succeeds flips it back. */}
          <span className="inline-flex items-center gap-2.5 rounded-full bg-surface px-4 py-2 text-[14px] font-medium text-ink">
            <span className="relative flex size-2">
              {stats && (
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60 motion-reduce:hidden" />
              )}
              <span className={clsx("relative inline-flex size-2 rounded-full", stats ? "bg-success" : "bg-dim")} />
            </span>
            {stats ? `Live · ${clock} IST` : "Live numbers unavailable · retrying"}
          </span>
        </Reveal>

        <Reveal delay={0.08}>
          <TodaySky
            hour={hour}
            value={stats?.applicationsToday}
            everySeconds={pace?.everySeconds ?? null}
            clock={clock}
            gain={gain}
          />
        </Reveal>

        <div className="flex flex-wrap gap-4">
          <Reveal delay={0.16} className="min-w-0 flex-[1_1_380px]">
            <WeekCard
              eyebrow="This week"
              value={stats?.applications7d}
              label="applications, last 7 days"
              days={days}
              pick={(d) => d.applications}
              chartLabel="Applications per day, last 7 days"
            />
          </Reveal>
          <Reveal delay={0.24} className="min-w-0 flex-[1_1_380px]">
            <WeekCard
              eyebrow="Recruiters wrote back"
              value={stats?.recruiterReplies7d}
              label="replies, last 7 days"
              days={days}
              pick={(d) => d.replies}
              chartLabel="Recruiter replies per day, last 7 days"
            />
          </Reveal>
        </div>

        <Reveal
          delay={0.24}
          className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-4"
        >
          <div className="flex max-w-[620px] flex-col gap-1">
            <h2 className="font-display text-[24px] leading-[1.2] font-semibold tracking-[-0.4px] text-ink">
              Tomorrow&apos;s count starts at midnight. Be in it.
            </h2>
            <p className="text-[13px] leading-[1.5] text-dim">
              Counts across all HireDue users, refreshed every minute. Recruiter replies leave out
              automatic &ldquo;we received your application&rdquo; emails.
            </p>
          </div>
          <ArrowButton label="Get HireDue" href="/download" />
        </Reveal>
      </div>
    </section>
  );
}

/*
 * The hour the sky shows: the moment the numbers were read, so the server and
 * browser agree. With no numbers (backend down) the browser falls back to its
 * own clock in IST after mount; until then, early afternoon.
 */
function useSkyHour(pace) {
  const [fallback, setFallback] = useState(13);
  useEffect(() => {
    if (pace) return;
    const [h, m] = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
      timeZone: "Asia/Kolkata",
    })
      .format(new Date())
      .split(":")
      .map(Number);
    setFallback(h + m / 60);
  }, [pace]);
  return pace ? pace.progress * 24 : fallback;
}

function WeekCard({ eyebrow, value, label, days, pick, chartLabel }) {
  const reduce = useReducedMotion();
  const shown = useCountUp(value ?? 0, 1400, { from: reduce ? undefined : 0 });
  const values = days.map(pick);
  const max = Math.max(1, ...values);

  return (
    <div className="grid h-full grid-cols-1 items-end gap-5 rounded-[24px] bg-surface px-6 py-6 min-[480px]:grid-cols-[auto_minmax(0,1fr)] min-[480px]:gap-6 min-[480px]:px-7">
      <div className="flex flex-col gap-1">
        <span className="text-[13px] font-semibold tracking-[0.4px] text-dim uppercase">{eyebrow}</span>
        <span className="font-display text-[44px] leading-none font-bold tracking-[-1.4px] text-ink tabular-nums">
          {value == null ? "—" : formatCount(shown)}
        </span>
        <span className="text-[14px] font-medium text-dim">{label}</span>
      </div>

      {days.length > 0 && (
        <motion.div
          {...inView}
          role="img"
          aria-label={`${chartLabel}: ${days
            .map((d, i) => `${i === days.length - 1 ? "today" : weekdayLabel(d.date)} ${values[i]}`)
            .join(", ")}`}
          className="grid h-24 grid-cols-7 items-end gap-1.5"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: reduce ? 0 : 0.06 } } }}
        >
          {days.map((d, i) => {
            const isToday = i === days.length - 1;
            return (
              <div key={d.date} className="flex h-full flex-col items-center justify-end gap-1.5">
                <motion.div
                  className={clsx("w-full rounded-md", isToday ? "bg-brand" : "bg-[#c5d3f5]")}
                  style={{ height: `${Math.max(3, (values[i] / max) * 75)}%`, originY: 1 }}
                  variants={{
                    hidden: { scaleY: reduce ? 1 : 0 },
                    visible: { scaleY: 1, transition: spring(0.9) },
                  }}
                />
                <span className={clsx("text-[12px]", isToday ? "font-semibold text-ink" : "font-medium text-dim")}>
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
