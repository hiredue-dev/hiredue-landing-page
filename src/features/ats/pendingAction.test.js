import { beforeEach, describe, expect, it } from "vitest";
import { clearPending, isReturnFromAuth, loadPending, PENDING_KEY, PENDING_TTL_MS, RETURN_PATH, savePending } from "./pendingAction.js";

const JOB = { title: "Frontend Engineer", company: "Acme", description: "Build things." };

beforeEach(() => window.sessionStorage.clear());

describe("pending ATS action", () => {
  it("round-trips the resume, the job form and the action", () => {
    expect(savePending({ action: "tailor", fileName: "cv.pdf", text: "resume text", job: JOB }, 1000)).toBe(true);
    expect(loadPending(2000)).toEqual({ action: "tailor", fileName: "cv.pdf", text: "resume text", job: JOB });
  });

  it("expires after the TTL and cleans up", () => {
    savePending({ action: "optimize", fileName: "cv.pdf", text: "t" }, 0);
    expect(loadPending(PENDING_TTL_MS)).not.toBeNull();
    expect(loadPending(PENDING_TTL_MS + 1)).toBeNull();
    expect(window.sessionStorage.getItem(PENDING_KEY)).toBeNull();
  });

  it("rejects unknown actions and empty resumes", () => {
    expect(savePending({ action: "delete", text: "t" })).toBe(false);
    expect(savePending({ action: "optimize", text: "" })).toBe(false);
    expect(window.sessionStorage.getItem(PENDING_KEY)).toBeNull();
  });

  it("drops corrupt or tampered entries", () => {
    window.sessionStorage.setItem(PENDING_KEY, "{not json");
    expect(loadPending()).toBeNull();
    window.sessionStorage.setItem(PENDING_KEY, JSON.stringify({ v: 1, action: "rm -rf", text: "t", savedAt: Date.now() }));
    expect(loadPending()).toBeNull();
    expect(window.sessionStorage.getItem(PENDING_KEY)).toBeNull();
  });

  it("coerces a stored job back to three strings", () => {
    window.sessionStorage.setItem(
      PENDING_KEY,
      JSON.stringify({ v: 1, action: "tailor", text: "t", savedAt: Date.now(), job: { title: 5, description: null, extra: "x" } }),
    );
    expect(loadPending().job).toEqual({ title: "5", company: "", description: "" });
  });

  it("clears", () => {
    savePending({ action: "optimize", text: "t" });
    clearPending();
    expect(loadPending()).toBeNull();
  });

  it("recognises the page sign-in returns to", () => {
    const url = new URL(RETURN_PATH, "https://hiredue.com");
    expect(url.pathname).toBe("/ats-checker");
    expect(isReturnFromAuth(url.search)).toBe(true);
    expect(isReturnFromAuth("?utm_source=x")).toBe(false);
  });
});
