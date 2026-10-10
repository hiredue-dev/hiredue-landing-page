import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  captureAttribution,
  clearAttribution,
  MAX_AGE_MS,
  parseAttribution,
  readAttribution,
  STORAGE_KEY,
} from "./attribution.js";

const link = (over = {}) =>
  "?" +
  new URLSearchParams({
    utm_source: "amb_K7Q2XM9P",
    utm_medium: "linkedin",
    utm_campaign: "campus_2026",
    utm_content: "R4TD8WQ2HN",
    ...over,
  }).toString();

beforeEach(() => window.localStorage.clear());

describe("parseAttribution", () => {
  it("reads an ambassador link into separate UTM fields", () => {
    expect(parseAttribution(link())).toEqual({
      utm_source: "amb_K7Q2XM9P",
      utm_medium: "linkedin",
      utm_campaign: "campus_2026",
      utm_content: "R4TD8WQ2HN",
    });
  });

  it.each([
    "linkedin",
    "whatsapp",
    "instagram",
    "x",
    "telegram",
    "email",
    "other",
  ])("accepts %s", (medium) => {
    expect(parseAttribution(link({ utm_medium: medium }))?.utm_medium).toBe(
      medium,
    );
  });

  it("ignores a page with no tracking parameters", () => {
    expect(parseAttribution("")).toBeNull();
    expect(parseAttribution("?redirect=/pricing")).toBeNull();
  });

  it("ignores UTM traffic that is not an ambassador link", () => {
    expect(
      parseAttribution("?utm_source=newsletter&utm_medium=email"),
    ).toBeNull();
    expect(parseAttribution(link({ utm_content: "" }))).toBeNull();
  });

  it.each([
    ["a lower-case code", { utm_source: "amb_k7q2xm9p" }],
    ["a short code", { utm_source: "amb_K7Q" }],
    ["markup", { utm_source: "amb_<script>" }],
    [
      "a database id",
      { utm_source: "amb_6f1c2a4e-1b2d-4c3e-8f9a-0b1c2d3e4f50" },
    ],
    ["a bad link code", { utm_content: "R4TD8WQ2H'" }],
  ])("rejects %s", (_label, over) => {
    expect(parseAttribution(link(over))).toBeNull();
  });

  it("drops a malformed medium or campaign but keeps the link", () => {
    const parsed = parseAttribution(
      link({ utm_medium: "<b>", utm_campaign: "x".repeat(80) }),
    );
    expect(parsed?.utm_content).toBe("R4TD8WQ2HN");
    expect(parsed?.utm_medium).toBeNull();
    expect(parsed?.utm_campaign).toBeNull();
  });
});

describe("captureAttribution", () => {
  it("stores the link and reads it back after a reload", () => {
    captureAttribution(link(), { now: 1_000 });
    // A reload, or coming back from Google sign-in, is a fresh page reading the same storage.
    expect(readAttribution({ now: 2_000 })?.utm_source).toBe("amb_K7Q2XM9P");
  });

  it("keeps the link while the visitor moves to pages without parameters", () => {
    captureAttribution(link(), { now: 1_000 });
    captureAttribution("", { now: 2_000 });
    captureAttribution("?redirect=/pricing", { now: 3_000 });
    expect(readAttribution({ now: 4_000 })?.utm_content).toBe("R4TD8WQ2HN");
  });

  it("first click wins: a second ambassador's link does not replace the first", () => {
    captureAttribution(link(), { now: 1_000 });
    captureAttribution(
      link({ utm_source: "amb_ZZZZZZZZ", utm_content: "ZZZZZZZZZZ" }),
      { now: 2_000 },
    );
    expect(readAttribution({ now: 3_000 })).toMatchObject({
      utm_source: "amb_K7Q2XM9P",
      utm_content: "R4TD8WQ2HN",
    });
  });

  it("expires after 30 days, after which a new link can be stored", () => {
    captureAttribution(link(), { now: 0 });
    expect(readAttribution({ now: MAX_AGE_MS - 1 })).not.toBeNull();
    expect(readAttribution({ now: MAX_AGE_MS })).toBeNull();
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();

    captureAttribution(
      link({ utm_source: "amb_ZZZZZZZZ", utm_content: "ZZZZZZZZZZ" }),
      { now: MAX_AGE_MS + 1 },
    );
    expect(readAttribution({ now: MAX_AGE_MS + 2 })?.utm_source).toBe(
      "amb_ZZZZZZZZ",
    );
  });

  it("throws away a stored value someone edited by hand", () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        utm: { utm_source: "amb_<x>", utm_content: "R4TD8WQ2HN" },
        capturedAt: 1,
      }),
    );
    expect(readAttribution({ now: 2 })).toBeNull();
    window.localStorage.setItem(STORAGE_KEY, "not json");
    expect(readAttribution({ now: 2 })).toBeNull();
  });

  it("does nothing, and does not throw, when storage is blocked", () => {
    const blocked = {
      getItem() {
        throw new Error("SecurityError");
      },
      setItem() {
        throw new Error("SecurityError");
      },
      removeItem() {
        throw new Error("SecurityError");
      },
    };
    expect(captureAttribution(link(), { storage: blocked })).toBeNull();
    expect(readAttribution({ storage: blocked })).toBeNull();
    expect(() => clearAttribution({ storage: blocked })).not.toThrow();
  });
});

describe("createUserInCloud", () => {
  async function load() {
    vi.resetModules();
    const post = vi.fn(async () => ({ success: true }));
    vi.doMock("@/features/auth/services/apiClient.js", () => ({
      apiClient: { post },
    }));
    const { createUserInCloud } =
      await import("@/features/auth/services/userService.js");
    return { createUserInCloud, post };
  }
  const user = {
    id: "sub-1",
    email: "a@example.com",
    fullName: "A",
    phoneNumber: "",
  };

  it("sends the stored link with the signup, then clears it", async () => {
    captureAttribution(link());
    const { createUserInCloud, post } = await load();
    await createUserInCloud(user);
    expect(post).toHaveBeenCalledWith("user", {
      ...user,
      attribution: {
        utm_source: "amb_K7Q2XM9P",
        utm_medium: "linkedin",
        utm_campaign: "campus_2026",
        utm_content: "R4TD8WQ2HN",
      },
    });
    expect(readAttribution()).toBeNull();
  });

  it("sends a direct signup exactly as before", async () => {
    const { createUserInCloud, post } = await load();
    await createUserInCloud(user);
    expect(post).toHaveBeenCalledWith("user", user);
  });

  it("keeps the link when the signup fails, so a retry still carries it", async () => {
    captureAttribution(link());
    const { createUserInCloud, post } = await load();
    post.mockResolvedValueOnce({ success: false, error: "taken" });
    await createUserInCloud(user);
    expect(readAttribution()?.utm_content).toBe("R4TD8WQ2HN");
  });
});
