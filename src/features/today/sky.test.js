import { describe, expect, it } from "vitest";
import { clockAt, mix, phaseAt, skyAt, skyScene } from "./sky";

describe("sky colours", () => {
  it("blends hex colours", () => {
    expect(mix("#000000", "#ffffff", 0)).toBe("#000000");
    expect(mix("#000000", "#ffffff", 1)).toBe("#ffffff");
    expect(mix("#000000", "#ffffff", 0.5)).toBe("#808080");
  });

  it("lands exactly on a keyframe, and midnight matches at both ends of the day", () => {
    expect(skyAt(13).top).toBe("#2b6ccc");
    expect(skyAt(0)).toEqual(skyAt(23.999));
  });
});

describe("skyScene", () => {
  it("is night at 2 AM: stars out, no sun, moon up, window lit", () => {
    const s = skyScene(2);
    expect(s.night).toBe(1);
    expect(s.sun.opacity).toBe(0);
    expect(s.moon.opacity).toBeGreaterThan(0.9);
    expect(s.windowOpacity).toBe(1);
  });

  it("is day at 1 PM: no stars, sun high, no moon", () => {
    const s = skyScene(13);
    expect(s.night).toBe(0);
    expect(s.sun.opacity).toBe(1);
    expect(parseFloat(s.sun.y)).toBeLessThan(30);
    expect(s.moon.opacity).toBe(0);
  });

  it("names the part of the day", () => {
    expect([2, 6, 9.5, 13, 18, 19.5, 21.5].map(phaseAt)).toEqual([
      "Night",
      "Sunrise",
      "Morning",
      "Afternoon",
      "Sunset",
      "Evening",
      "Night",
    ]);
  });
});

describe("clockAt", () => {
  it("reads like a clock", () => {
    expect(clockAt(0)).toBe("12:00 AM");
    expect(clockAt(17.5833)).toBe("5:34 PM");
    expect(clockAt(12.25)).toBe("12:15 PM");
  });
});
