import { describe, expect, it } from "vitest";
import { detectPlatform, PLATFORMS, SETUP } from "./downloads.js";

describe("detectPlatform", () => {
  it("picks the build this computer can run, and nothing on a phone", () => {
    expect(detectPlatform("Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/129.0")).toBe("windows");
    expect(detectPlatform("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15")).toBe("mac-arm");
    expect(detectPlatform("Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X)")).toBeNull();
    expect(detectPlatform("Mozilla/5.0 (X11; Linux x86_64)")).toBeNull();
  });

  // The download-started page looks these up by key; a build without setup steps would render an empty list.
  it("every build has setup steps for its system", () => {
    for (const p of PLATFORMS) expect(SETUP[p.os]?.length).toBeGreaterThan(0);
    expect(PLATFORMS.map((p) => p.key)).toContain(detectPlatform("Windows NT"));
    expect(PLATFORMS.map((p) => p.key)).toContain(detectPlatform("Macintosh"));
  });
});
