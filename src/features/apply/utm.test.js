import { beforeEach, describe, expect, it } from "vitest";
import {
  INTENT_TTL_MS,
  UTM_KEY_PREFIX,
  UTM_TTL_MS,
  captureUtm,
  clearApplyIntent,
  clearUtm,
  loadUtm,
  parseUtm,
  saveApplyIntent,
  saveUtm,
  takeApplyIntent,
} from "./utm.js";

const LINK = "?utm_source=linkedin&utm_medium=job_post&utm_campaign=SPRING26&utm_content=AB12CD";

beforeEach(() => sessionStorage.clear());

describe("parseUtm", () => {
  it("reads the four UTM fields into the API's shape", () => {
    expect(parseUtm(LINK)).toEqual({ source: "linkedin", medium: "job_post", campaign: "SPRING26", content: "AB12CD" });
  });

  it("keeps whichever fields are present and drops blanks", () => {
    expect(parseUtm("?utm_source=whatsapp&utm_medium=&ref=x")).toEqual({ source: "whatsapp" });
  });

  it("is null when the link has no UTM", () => {
    expect(parseUtm("")).toBeNull();
    expect(parseUtm("?ref=abc")).toBeNull();
    expect(parseUtm(undefined)).toBeNull();
  });

  it("cuts very long values", () => {
    expect(parseUtm(`?utm_campaign=${"x".repeat(500)}`).campaign).toHaveLength(200);
  });
});

describe("captureUtm / loadUtm", () => {
  it("keeps the link's UTM per job so it survives the sign-in round trip", () => {
    expect(captureUtm("job-1", LINK)).toEqual(parseUtm(LINK));
    // Back from /cognito-callback, or from /jobs, with a bare URL.
    expect(captureUtm("job-1", "")).toEqual(parseUtm(LINK));
    expect(loadUtm("job-1")).toEqual(parseUtm(LINK));
  });

  it("does not hand one job's UTM to another", () => {
    captureUtm("job-1", LINK);
    expect(captureUtm("job-2", "")).toBeNull();
  });

  it("lets a newer link replace the kept one", () => {
    captureUtm("job-1", LINK);
    expect(captureUtm("job-1", "?utm_source=naukri")).toEqual({ source: "naukri" });
    expect(loadUtm("job-1")).toEqual({ source: "naukri" });
  });

  it("forgets stale or unreadable entries", () => {
    const now = 1_000_000;
    saveUtm("job-1", { source: "linkedin" }, now);
    expect(loadUtm("job-1", now + UTM_TTL_MS + 1)).toBeNull();
    expect(sessionStorage.getItem(`${UTM_KEY_PREFIX}job-1`)).toBeNull();

    sessionStorage.setItem(`${UTM_KEY_PREFIX}job-2`, "{not json");
    expect(loadUtm("job-2")).toBeNull();
    expect(sessionStorage.getItem(`${UTM_KEY_PREFIX}job-2`)).toBeNull();
  });

  it("only returns known string fields from storage", () => {
    sessionStorage.setItem(`${UTM_KEY_PREFIX}job-1`, JSON.stringify({ v: 1, savedAt: Date.now(), utm: { source: "x", evil: "y", medium: 3 } }));
    expect(loadUtm("job-1")).toEqual({ source: "x" });
  });

  it("clears", () => {
    captureUtm("job-1", LINK);
    clearUtm("job-1");
    expect(loadUtm("job-1")).toBeNull();
  });
});

describe("apply intent", () => {
  it("is taken once, for the same job", () => {
    saveApplyIntent("job-1");
    expect(takeApplyIntent("job-1")).toBe(true);
    expect(takeApplyIntent("job-1")).toBe(false);
  });

  it("does not fire for another job, and is used up anyway", () => {
    saveApplyIntent("job-1");
    expect(takeApplyIntent("job-2")).toBe(false);
    expect(takeApplyIntent("job-1")).toBe(false);
  });

  it("expires", () => {
    const now = 5_000_000;
    saveApplyIntent("job-1", now);
    expect(takeApplyIntent("job-1", now + INTENT_TTL_MS + 1)).toBe(false);
  });

  it("can be cleared when the sign-in dialog is closed", () => {
    saveApplyIntent("job-1");
    clearApplyIntent();
    expect(takeApplyIntent("job-1")).toBe(false);
  });
});
