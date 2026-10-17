import { beforeEach, describe, expect, it } from "vitest";
import { canInstall, clearIntent, INTENT_TTL_MS, loadIntent, saveIntent } from "./funnel.js";

const UA = {
  windowsChrome: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36",
  macSafari: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15",
  iphone: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1",
  androidChrome: "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Mobile Safari/537.36",
  // iPadOS 13 and later ask for desktop sites and send a Mac user agent.
  ipadAsMac: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15",
  linux: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36",
  chromeos: "Mozilla/5.0 (X11; CrOS x86_64 14541.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36",
};

describe("canInstall", () => {
  it("is true only where a HireDue build exists: Windows and Mac", () => {
    expect(canInstall(UA.windowsChrome)).toBe(true);
    expect(canInstall(UA.macSafari, 0)).toBe(true);
  });

  // Phones, tablets, Linux and ChromeOS have nothing to download, so they must never see the install button.
  it("is false for phones, tablets, Linux and ChromeOS", () => {
    expect(canInstall(UA.iphone)).toBe(false);
    expect(canInstall(UA.androidChrome)).toBe(false);
    expect(canInstall(UA.ipadAsMac, 5)).toBe(false);
    expect(canInstall(UA.linux)).toBe(false);
    expect(canInstall(UA.chromeos)).toBe(false);
    expect(canInstall("")).toBe(false);
  });
});

describe("intent across the Google round trip", () => {
  beforeEach(() => window.sessionStorage.clear());

  it("comes back as saved while fresh", () => {
    expect(saveIntent({ intent: "install", jobId: "abc" })).toBe(true);
    expect(loadIntent()).toEqual({ intent: "install", jobId: "abc" });
  });

  // Half an hour later the visitor has moved on; firing a download they no longer expect would be worse than doing nothing.
  it("is gone after the time limit and after clearing", () => {
    const t0 = 1_000_000;
    saveIntent({ intent: "apply", jobId: "abc" }, t0);
    expect(loadIntent(t0 + INTENT_TTL_MS)).toEqual({ intent: "apply", jobId: "abc" });
    expect(loadIntent(t0 + INTENT_TTL_MS + 1)).toBeNull();
    saveIntent({ intent: "apply", jobId: "abc" });
    clearIntent();
    expect(loadIntent()).toBeNull();
  });

  it("refuses anything that is not one of the two buttons, and drops garbage it finds", () => {
    expect(saveIntent({ intent: "delete-account", jobId: "abc" })).toBe(false);
    expect(saveIntent({ intent: "install", jobId: "" })).toBe(false);
    window.sessionStorage.setItem("hd_job_intent", "{not json");
    expect(loadIntent()).toBeNull();
    expect(window.sessionStorage.getItem("hd_job_intent")).toBeNull();
  });
});
