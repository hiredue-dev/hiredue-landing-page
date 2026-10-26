import { describe, expect, it } from "vitest";
import { EMPTY_FILTERS, sidebarFilterCount } from "./filters.js";

describe("sidebarFilterCount", () => {
  it("is zero with nothing set", () => {
    expect(sidebarFilterCount(EMPTY_FILTERS)).toBe(0);
  });

  it("counts each selected value, plus the two single-value filters", () => {
    const filters = {
      ...EMPTY_FILTERS,
      platforms: ["linkedin", "naukri"],
      roles: ["Frontend"],
      experience: ["entry"],
      easyApply: true,
      postedWithin: "7",
    };
    expect(sidebarFilterCount(filters)).toBe(6);
  });

  it("ignores the search bar and the tab", () => {
    expect(sidebarFilterCount({ ...EMPTY_FILTERS, q: "react", location: "Pune", source: "posts" })).toBe(0);
  });
});
