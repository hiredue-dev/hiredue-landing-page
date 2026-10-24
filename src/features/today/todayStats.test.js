import { describe, expect, it } from "vitest";
import {
  dayPace,
  formatAsOf,
  formatCount,
  formatEvery,
  parseTodayStats,
  weekdayLabel,
} from "./todayStats";

const days = [
  ["2026-10-18", 912, 9],
  ["2026-10-19", 1180, 14],
  ["2026-10-20", 1046, 11],
  ["2026-10-21", 987, 12],
  ["2026-10-22", 1233, 15],
  ["2026-10-23", 1121, 10],
  ["2026-10-24", 1074, 9],
].map(([date, applications, replies]) => ({ date, applications, replies }));

const valid = {
  applicationsToday: 1074,
  applications7d: 7553,
  recruiterReplies7d: 80,
  days,
  timezone: "Asia/Kolkata",
  dayStartedAt: "2026-10-23T18:30:00.000Z",
  asOf: "2026-10-24T12:05:00.000Z",
};

describe("parseTodayStats", () => {
  it("keeps the counts, the week and when they were read", () => {
    expect(parseTodayStats(valid)).toEqual(valid);
  });

  it("accepts zero", () => {
    expect(parseTodayStats({ ...valid, applicationsToday: 0 })?.applicationsToday).toBe(0);
  });

  it("rejects a missing, non-numeric or negative count instead of showing zero", () => {
    expect(parseTodayStats(null)).toBeNull();
    expect(parseTodayStats({ ...valid, applications7d: undefined })).toBeNull();
    expect(parseTodayStats({ ...valid, recruiterReplies7d: "80" })).toBeNull();
    expect(parseTodayStats({ ...valid, applicationsToday: -1 })).toBeNull();
  });

  it("drops the bars rather than draw a partial week", () => {
    expect(parseTodayStats({ ...valid, days: days.slice(1) })?.days).toEqual([]);
    expect(parseTodayStats({ ...valid, days: [...days.slice(1), { date: "x" }] })?.days).toEqual([]);
    expect(parseTodayStats({ ...valid, days: undefined })?.days).toEqual([]);
  });
});

describe("dayPace", () => {
  it("averages the gap between applications since midnight", () => {
    // 5:35 pm IST is 63,300 s after midnight; 1,074 applications → one every ~59 s.
    const pace = dayPace(valid);
    expect(pace.everySeconds).toBeCloseTo(63300 / 1074);
    expect(pace.progress).toBeCloseTo(63300 / 86400);
  });

  it("has no pace before the first application, and nothing without times", () => {
    expect(dayPace({ ...valid, applicationsToday: 0 }).everySeconds).toBeNull();
    expect(dayPace({ ...valid, asOf: null })).toBeNull();
    expect(dayPace(null)).toBeNull();
  });
});

describe("formatting", () => {
  it("groups counts the Indian way and rounds mid-animation values", () => {
    expect(formatCount(124310)).toBe("1,24,310");
    expect(formatCount(86.6)).toBe("87");
  });

  it("says the gap plainly", () => {
    expect(formatEvery(0.4)).toBe("second");
    expect(formatEvery(58.9)).toBe("59 seconds");
    expect(formatEvery(60)).toBe("minute");
    expect(formatEvery(252)).toBe("4.2 minutes");
    expect(formatEvery(7200)).toBe("2 hours");
  });

  it("labels each day by its own date, whatever the browser's timezone", () => {
    expect(weekdayLabel("2026-10-18")).toBe("Sun");
    expect(weekdayLabel("2026-10-23")).toBe("Fri");
  });

  it("shows the read time in the counting timezone", () => {
    expect(formatAsOf(valid.asOf, "Asia/Kolkata")).toMatch(/5:35\s?pm IST/i);
    expect(formatAsOf(null, "Asia/Kolkata")).toBeNull();
    expect(formatAsOf("not a date", "Asia/Kolkata")).toBeNull();
  });
});
