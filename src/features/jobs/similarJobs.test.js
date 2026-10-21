import { describe, expect, it } from "vitest";
import { similarSearches } from "./similarJobs.js";

describe("similarSearches", () => {
  // The board ANDs every word, so the exact title is tried first and the searches then widen; a seniority word never narrows the later ones.
  it("widens from the exact title to two core words, newest first", () => {
    const searches = similarSearches("Senior IoT Software Development Engineer II");
    expect(searches.map((s) => [s.q, s.postedWithin])).toEqual([
      ["Senior IoT Software Development Engineer II", "1"],
      ["IoT Software Development Engineer", "7"],
      ["IoT Software", "7"],
      ["IoT Software", ""],
    ]);
    expect(searches[0].label).toMatch(/24 hours/);
    expect(searches[3].label).toBe("Roles like this one");
  });

  it("never repeats a search and never sends an empty one", () => {
    expect(similarSearches("Designer").map((s) => [s.q, s.postedWithin])).toEqual([
      ["Designer", "1"],
      ["Designer", "7"],
      ["Designer", ""],
    ]);
    expect(similarSearches("")).toEqual([]);
    // A title that is all seniority words still gets searched as typed; there is nothing else to widen to.
    expect(similarSearches("Senior II").map((s) => [s.q, s.postedWithin])).toEqual([["Senior II", "1"]]);
  });
});
