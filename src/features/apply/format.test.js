import { describe, expect, it } from "vitest";
import { experienceRangeLabel, jobChips, jobTitleLine, websiteHost } from "./format.js";

describe("experienceRangeLabel", () => {
  it("covers the shapes campus sends", () => {
    expect(experienceRangeLabel(4, 7)).toBe("4–7 yrs");
    expect(experienceRangeLabel(4, null)).toBe("4+ yrs");
    expect(experienceRangeLabel(null, 2)).toBe("Up to 2 yrs");
    expect(experienceRangeLabel(1, 1)).toBe("1 yr");
    expect(experienceRangeLabel(0, 0)).toBe("Fresher");
    expect(experienceRangeLabel(null, null)).toBeNull();
  });
});

describe("jobChips", () => {
  it("lists the filled-in facts in order", () => {
    const job = { location: "Bengaluru", workMode: "hybrid", employmentType: "full_time", experienceMinYears: 4, experienceMaxYears: 7, compensation: "₹25–30 LPA" };
    expect(jobChips(job).map((c) => c.label)).toEqual(["Bengaluru", "Hybrid", "Full-time", "4–7 yrs", "₹25–30 LPA"]);
    expect(jobChips({ workMode: "unknown" })).toEqual([]);
  });
});

describe("websiteHost / jobTitleLine", () => {
  it("shows a bare host for web URLs only", () => {
    expect(websiteHost("https://www.acme.com/careers")).toBe("acme.com");
    expect(websiteHost("javascript:alert(1)")).toBeNull();
    expect(websiteHost(null)).toBeNull();
  });

  it("titles the page", () => {
    expect(jobTitleLine({ title: "React Dev", company: { name: "Acme" } })).toBe("React Dev at Acme");
    expect(jobTitleLine(null)).toBe("Apply");
  });
});
