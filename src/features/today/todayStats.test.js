import { describe, expect, it } from "vitest";
import { formatAsOf, formatCount, parseTodayStats } from "./todayStats";

const valid = {
  applicationsToday: 1240,
  recruiterReplies7d: 87,
  companiesReplied7d: 31,
  timezone: "Asia/Kolkata",
  dayStartedAt: "2026-10-23T18:30:00.000Z",
  asOf: "2026-10-24T10:42:00.000Z",
};

describe("parseTodayStats", () => {
  it("keeps the counts and the time they were read", () => {
    expect(parseTodayStats(valid)).toEqual({
      applicationsToday: 1240,
      recruiterReplies7d: 87,
      companiesReplied7d: 31,
      timezone: "Asia/Kolkata",
      asOf: "2026-10-24T10:42:00.000Z",
    });
  });

  it("accepts zero", () => {
    expect(parseTodayStats({ ...valid, applicationsToday: 0 })?.applicationsToday).toBe(0);
  });

  it("rejects a missing, non-numeric or negative count instead of showing zero", () => {
    expect(parseTodayStats(null)).toBeNull();
    expect(parseTodayStats({ ...valid, companiesReplied7d: undefined })).toBeNull();
    expect(parseTodayStats({ ...valid, recruiterReplies7d: "87" })).toBeNull();
    expect(parseTodayStats({ ...valid, applicationsToday: -1 })).toBeNull();
  });
});

describe("formatting", () => {
  it("groups counts the Indian way and rounds mid-animation values", () => {
    expect(formatCount(124310)).toBe("1,24,310");
    expect(formatCount(86.6)).toBe("87");
  });

  it("shows the read time in the counting timezone", () => {
    expect(formatAsOf(valid.asOf, "Asia/Kolkata")).toMatch(/4:12\s?pm IST/i);
    expect(formatAsOf(null, "Asia/Kolkata")).toBeNull();
    expect(formatAsOf("not a date", "Asia/Kolkata")).toBeNull();
  });
});
