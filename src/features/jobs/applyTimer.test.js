import { beforeEach, describe, expect, it } from "vitest";
import { CAP_MS, clearApplyTimer, FLOOR_MS, formatElapsed, readApplyTimer, startApplyTimer, timerVerdict } from "./applyTimer.js";

describe("the apply timer", () => {
  beforeEach(() => window.sessionStorage.clear());

  it("measures from the click to now, for the job that was clicked", () => {
    startApplyTimer("job-1", 1_000);
    expect(readApplyTimer(1_000 + 517_000)).toEqual({ jobId: "job-1", elapsedMs: 517_000 });
  });

  // Two applications in a row: the first number would be about a different job, so only the latest click counts.
  it("a second click replaces the first", () => {
    startApplyTimer("job-1", 1_000);
    startApplyTimer("job-2", 5_000);
    expect(readApplyTimer(6_000)).toEqual({ jobId: "job-2", elapsedMs: 1_000 });
  });

  it("is nothing once cleared, and drops garbage it finds", () => {
    startApplyTimer("job-1");
    clearApplyTimer();
    expect(readApplyTimer()).toBeNull();
    window.sessionStorage.setItem("hd_apply_timer", "{nope");
    expect(readApplyTimer()).toBeNull();
    expect(window.sessionStorage.getItem("hd_apply_timer")).toBeNull();
  });

  it("refuses to start without a job", () => {
    expect(startApplyTimer("")).toBe(false);
    expect(readApplyTimer()).toBeNull();
  });
});

describe("what the return screen may say", () => {
  // The three bands from the plan: say nothing under 90 s, the measured time up to 35 min, "over 35 minutes" beyond.
  it("is quiet under the floor, measured in between, capped above", () => {
    expect(timerVerdict(FLOOR_MS - 1)).toBe("quiet");
    expect(timerVerdict(FLOOR_MS)).toBe("measured");
    expect(timerVerdict(CAP_MS)).toBe("measured");
    expect(timerVerdict(CAP_MS + 1)).toBe("capped");
  });

  it("formats the way a person would say it", () => {
    expect(formatElapsed(517_000)).toBe("8 min 37 s");
    expect(formatElapsed(12 * 60_000)).toBe("12 min");
    expect(formatElapsed(95_400)).toBe("1 min 35 s");
  });
});
