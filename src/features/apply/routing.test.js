import { describe, expect, it } from "vitest";
import { applyPathFor, hiredueApplyPath } from "./routing.js";

describe("hiredueApplyPath", () => {
  it("returns the board item's /apply path", () => {
    expect(hiredueApplyPath({ hiredueApplyPath: "/apply/3f1c2a9e-1b2c-4d5e-8f90-123456789abc" })).toBe("/apply/3f1c2a9e-1b2c-4d5e-8f90-123456789abc");
  });

  it("is null for ordinary listings and anything off-site", () => {
    expect(hiredueApplyPath({ hiredueApplyPath: null })).toBeNull();
    expect(hiredueApplyPath({})).toBeNull();
    expect(hiredueApplyPath(null)).toBeNull();
    expect(hiredueApplyPath({ hiredueApplyPath: "https://evil.com/apply/1" })).toBeNull();
    expect(hiredueApplyPath({ hiredueApplyPath: "//evil.com/apply/1" })).toBeNull();
    expect(hiredueApplyPath({ hiredueApplyPath: "/jobs?apply=1" })).toBeNull();
  });

  it("builds the path from an id", () => {
    expect(applyPathFor("abc")).toBe("/apply/abc");
  });
});
