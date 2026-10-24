/*
 * The numbers behind hiredue.com/today, from GET /api/public/today.
 *
 * Plain fetch rather than apiClient: the page and its share image read this on
 * the server too, where Next's `revalidate` hint lets every visitor in a minute
 * share one backend call.
 */

import { BACKEND_API_URL } from "@/features/auth/services/apiClient.js";

export const TODAY_REFRESH_MS = 60_000;

const COUNT_FIELDS = ["applicationsToday", "applications7d", "recruiterReplies7d"];

const isCount = (n) => Number.isFinite(n) && n >= 0;

/** The response's `data`, or null when any count is missing: a public page shows a dash, never a made-up zero. */
export function parseTodayStats(data) {
  if (!data || typeof data !== "object") return null;
  for (const field of COUNT_FIELDS) {
    if (!isCount(data[field])) return null;
  }
  const days = Array.isArray(data.days)
    ? data.days.filter(
        (d) => typeof d?.date === "string" && isCount(d.applications) && isCount(d.replies),
      )
    : [];
  const asOf = Date.parse(data.asOf);
  const dayStartedAt = Date.parse(data.dayStartedAt);
  return {
    applicationsToday: data.applicationsToday,
    applications7d: data.applications7d,
    recruiterReplies7d: data.recruiterReplies7d,
    // Bars only when the whole week came back; a partial chart would mislead.
    days: days.length === 7 ? days : [],
    timezone: typeof data.timezone === "string" ? data.timezone : "Asia/Kolkata",
    asOf: Number.isNaN(asOf) ? null : data.asOf,
    dayStartedAt: Number.isNaN(dayStartedAt) ? null : data.dayStartedAt,
  };
}

/**
 * How the day is going, from the moment the numbers were read: how far through
 * the day it is (0–1) and, on average, how often an application went out.
 * Read from `asOf` rather than the clock so the server and browser agree.
 */
export function dayPace(stats) {
  if (!stats?.asOf || !stats?.dayStartedAt) return null;
  const elapsed = (Date.parse(stats.asOf) - Date.parse(stats.dayStartedAt)) / 1000;
  if (!(elapsed > 0)) return null;
  const progress = Math.min(1, elapsed / 86_400);
  if (!stats.applicationsToday) return { progress, everySeconds: null };
  return { progress, everySeconds: elapsed / stats.applicationsToday };
}

/** "58 sec", "4.2 min", "1.5 hr": the gap between applications, short enough for a chip. */
export function formatEvery(seconds) {
  if (seconds < 90) return `${Math.max(1, Math.round(seconds))} sec`;
  if (seconds < 5400) return `${(seconds / 60).toFixed(1)} min`;
  return `${(seconds / 3600).toFixed(1)} hr`;
}

/** "Mon" for a YYYY-MM-DD date. Parsed as UTC noon so no timezone moves it to the next day. */
export function weekdayLabel(date) {
  return new Intl.DateTimeFormat("en-IN", { weekday: "short", timeZone: "UTC" }).format(
    new Date(`${date}T12:00:00Z`),
  );
}

/**
 * On the server, `revalidate` lets one backend call serve a minute of renders.
 * In the browser pass `fresh`: the endpoint's `max-age=60,
 * stale-while-revalidate=300` would otherwise let the browser answer a poll
 * from its own cache, minutes behind. The backend's one-minute cache still
 * spares the database.
 */
export async function fetchTodayStats({ revalidate = 60, fresh = false } = {}) {
  try {
    const base = BACKEND_API_URL.replace(/\/$/, "");
    const response = await fetch(
      `${base}/public/today`,
      fresh ? { cache: "no-store" } : { next: { revalidate } },
    );
    if (!response.ok) return null;
    const body = await response.json();
    return parseTodayStats(body?.data);
  } catch {
    return null;
  }
}

/** "1,24,310" for an Indian audience, matching the timezone "today" is counted in. */
export function formatCount(n) {
  return Math.round(n).toLocaleString("en-IN");
}

/** "4:12 PM IST": when the numbers were read, in the timezone the day is counted in. */
export function formatAsOf(iso, timezone) {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: timezone,
    timeZoneName: "short",
  }).format(date);
}
