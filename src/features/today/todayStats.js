/*
 * The numbers behind hiredue.com/today, from GET /api/public/today.
 *
 * Plain fetch rather than apiClient: the page and its share image read this on
 * the server too, where Next's `revalidate` hint lets every visitor in a minute
 * share one backend call.
 */

import { BACKEND_API_URL } from "@/features/auth/services/apiClient.js";

export const TODAY_REFRESH_MS = 60_000;

const COUNT_FIELDS = ["applicationsToday", "recruiterReplies7d", "companiesReplied7d"];

/** The response's `data`, or null when any count is missing: a public page shows a dash, never a made-up zero. */
export function parseTodayStats(data) {
  if (!data || typeof data !== "object") return null;
  for (const field of COUNT_FIELDS) {
    if (!Number.isFinite(data[field]) || data[field] < 0) return null;
  }
  return {
    applicationsToday: data.applicationsToday,
    recruiterReplies7d: data.recruiterReplies7d,
    companiesReplied7d: data.companiesReplied7d,
    timezone: typeof data.timezone === "string" ? data.timezone : "Asia/Kolkata",
    asOf: typeof data.asOf === "string" ? data.asOf : null,
  };
}

export async function fetchTodayStats({ revalidate = 60 } = {}) {
  try {
    const base = BACKEND_API_URL.replace(/\/$/, "");
    const response = await fetch(`${base}/public/today`, { next: { revalidate } });
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
