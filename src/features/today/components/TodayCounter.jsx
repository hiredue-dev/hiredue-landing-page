"use client";

import { useEffect, useState } from "react";
import { Eyebrow, Reveal } from "@/components/site/ui/Primitives";
import { ArrowButton } from "@/components/site/ui/Button";
import { useCountUp } from "@/components/site/sections/ambassador/use-count-up";
import {
  TODAY_REFRESH_MS,
  fetchTodayStats,
  formatAsOf,
  formatCount,
} from "@/features/today/todayStats";

/*
 * The server renders the page with real numbers, so a screenshot or a link
 * preview never shows zeros. From there the page refreshes once a minute while
 * it's on screen, and each change counts up to the new value.
 */
export function TodayCounter({ initial }) {
  const [stats, setStats] = useState(initial);

  useEffect(() => {
    let cancelled = false;
    const refresh = async () => {
      const next = await fetchTodayStats({ revalidate: 0 });
      // A failed refresh keeps the last good numbers rather than blanking them.
      if (!cancelled && next) setStats(next);
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

  const asOf = stats ? formatAsOf(stats.asOf, stats.timezone) : null;

  return (
    <section className="relative pt-[140px] pb-[80px] min-[810px]:pt-[170px] min-[1200px]:pb-[120px] min-[1200px]:pt-[194px]">
      <div className="mx-auto w-full max-w-[1080px] px-[30px]">
        <Reveal className="flex flex-col items-center gap-2.5 text-center">
          <Eyebrow>
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60 motion-reduce:hidden" />
              <span className="relative inline-flex size-2 rounded-full bg-success" />
            </span>
            Live{asOf ? ` · updated ${asOf}` : ""}
          </Eyebrow>
          <h1 className="t-h2 text-center">Today on HireDue</h1>
          <p className="t-body-lg max-w-[520px] text-center">
            Every application HireDue sends and every recruiter who writes back, counted as it happens.
          </p>
        </Reveal>

        <Reveal
          delay={0.1}
          className="mt-12 grid gap-4 min-[810px]:grid-cols-3 min-[1200px]:mt-16"
        >
          <Stat
            value={stats?.applicationsToday}
            label="applications sent today"
            note="since midnight IST"
            highlight
          />
          <Stat
            value={stats?.recruiterReplies7d}
            label="recruiter replies this week"
            note="last 7 days"
          />
          <Stat
            value={stats?.companiesReplied7d}
            label="companies that replied"
            note="last 7 days"
          />
        </Reveal>

        <Reveal delay={0.2} className="mt-12 flex flex-col items-center gap-6 text-center">
          <ArrowButton label="Get HireDue" href="/download" />
          <p className="max-w-[560px] text-[14px] leading-[1.5] text-dim">
            Counts across all HireDue users, refreshed every minute. Replies leave out automatic
            &ldquo;we received your application&rdquo; emails; companies are counted once each, and
            replies sent through job boards or from personal inboxes don&apos;t add a company.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function Stat({ value, label, note, highlight = false }) {
  const shown = useCountUp(value ?? 0);
  return (
    <div
      className={
        highlight
          ? "flex flex-col items-center gap-2 rounded-[28px] bg-[linear-gradient(110deg,#3b82f6_0%,#406ae4_100%)] px-6 py-10 text-white"
          : "flex flex-col items-center gap-2 rounded-[28px] bg-surface px-6 py-10 text-ink"
      }
    >
      <span
        className="font-display text-[64px] leading-none font-semibold tracking-[-2px] tabular-nums min-[1200px]:text-[80px]">
        {value == null ? "—" : formatCount(shown)}
      </span>
      <span className="text-[18px] leading-[1.3] font-medium">{label}</span>
      <span className={highlight ? "text-[14px] text-white/75" : "text-[14px] text-dim"}>
        {note}
      </span>
    </div>
  );
}
