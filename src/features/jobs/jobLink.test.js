import { describe, expect, it } from "vitest";
import { jobLinkFor } from "./jobLink.js";

describe("jobLinkFor", () => {
  it("is the jobs page with only the job id on it", () => {
    expect(jobLinkFor("https://hiredue.com", "7c235daf-a2d2-417a-bba3-87c595a858dc")).toBe(
      "https://hiredue.com/jobs?job=7c235daf-a2d2-417a-bba3-87c595a858dc",
    );
  });

  // A visitor who arrived through an ambassador's link has UTM tags in the address bar; the copied link must not pass them on to the next person.
  it("drops whatever else is on the current address", () => {
    const origin = new URL("https://hiredue.com/jobs?q=react&utm_source=amb_K7Q2XM9P&job=x").origin;
    expect(jobLinkFor(origin, "abc")).toBe("https://hiredue.com/jobs?job=abc");
  });
});
