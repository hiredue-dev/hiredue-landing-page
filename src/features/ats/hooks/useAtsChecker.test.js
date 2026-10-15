import { createElement } from "react";
import { createRoot } from "react-dom/client";
import { act } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const auth = { isAuthenticated: false, isLoading: false };
const showModal = vi.fn();
vi.mock("@/features/auth/context/AuthContext.jsx", () => ({ useAuth: () => auth }));
vi.mock("@/features/auth/components/FloatingAuthModal.jsx", () => ({ useAuthModal: () => ({ showModal }) }));
vi.mock("../services/atsService.js", () => ({
  optimizeResume: vi.fn(async (text) => ({ text: `${text}!`, changes: [], refused: [], score: { before: {}, after: {} } })),
  tailorResume: vi.fn(async (text) => ({ text, changes: [], refused: [], match: {}, score: {} })),
}));

import { STRONG } from "../__fixtures__/resumes.js";
import { loadPending, PENDING_KEY, RETURN_PATH, savePending } from "../pendingAction.js";
import { optimizeResume, tailorResume } from "../services/atsService.js";
import { useAtsChecker } from "./useAtsChecker.js";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const JOB = { title: "Frontend Engineer", company: "Acme", description: "React and TypeScript. ".repeat(10) };

let container;
let root;
let hook;

function Probe() {
  hook = useAtsChecker();
  return null;
}

async function mount() {
  container = document.createElement("div");
  root = createRoot(container);
  await act(async () => root.render(createElement(Probe)));
}

beforeEach(() => {
  window.sessionStorage.clear();
  window.history.replaceState(null, "", "/");
  auth.isAuthenticated = false;
  auth.isLoading = false;
  vi.clearAllMocks();
});

afterEach(async () => {
  await act(async () => root?.unmount());
});

// What the site's auth modal does on success: close and push to its redirect.
async function signInAndReturn() {
  auth.isAuthenticated = true;
  window.history.replaceState(null, "", RETURN_PATH);
  await act(async () => hook.handleReturn());
}

describe("useAtsChecker: carrying an action through sign-in", () => {
  it("signed out: saves the resume and job, opens the site's sign-up modal, runs on return", async () => {
    // A resume and job form already on the page (restored here instead of parsing a real file).
    savePending({ action: "tailor", fileName: "cv.pdf", text: STRONG, job: JOB });
    await mount();
    expect(hook.resume.fileName).toBe("cv.pdf");
    expect(hook.job).toEqual(JOB);
    expect(hook.tab).toBe("tailor");

    await act(async () => hook.request("tailor"));
    expect(tailorResume).not.toHaveBeenCalled();
    expect(showModal).toHaveBeenCalledWith({ view: "signup", redirectTo: RETURN_PATH });
    expect(loadPending()).toMatchObject({ action: "tailor", text: STRONG, job: JOB });

    await signInAndReturn();
    expect(tailorResume).toHaveBeenCalledTimes(1);
    expect(tailorResume).toHaveBeenCalledWith(STRONG, JOB, expect.any(Object));
    expect(window.sessionStorage.getItem(PENDING_KEY)).toBeNull();
    expect(hook.tailor.status).toBe("done");
    // The flag is gone so a reload doesn't run it again.
    expect(window.location.pathname).toBe("/ats-checker");
    expect(window.location.search).toBe("");
  });

  it("full page load back from Google: restores everything and runs once auth settles", async () => {
    savePending({ action: "optimize", fileName: "cv.pdf", text: STRONG });
    window.history.replaceState(null, "", RETURN_PATH);
    auth.isLoading = true;
    await mount();
    await act(async () => hook.handleReturn());

    // Restored, but nothing runs while auth is still hydrating.
    expect(hook.resume.text).toBe(STRONG);
    expect(hook.resume.score.overall).toBeGreaterThan(0);
    expect(optimizeResume).not.toHaveBeenCalled();

    auth.isLoading = false;
    auth.isAuthenticated = true;
    await act(async () => root.render(createElement(Probe)));
    expect(optimizeResume).toHaveBeenCalledTimes(1);
    expect(optimizeResume).toHaveBeenCalledWith(STRONG, expect.any(Object));
    expect(hook.optimize.status).toBe("done");
    expect(loadPending()).toBeNull();
  });

  it("back without signing in: restores the resume but runs nothing", async () => {
    savePending({ action: "optimize", fileName: "cv.pdf", text: STRONG });
    window.history.replaceState(null, "", RETURN_PATH);
    await mount();
    await act(async () => hook.handleReturn());
    expect(hook.resume.fileName).toBe("cv.pdf");
    expect(optimizeResume).not.toHaveBeenCalled();
  });

  it("an ordinary visit with a saved resume restores it without running anything", async () => {
    savePending({ action: "optimize", fileName: "cv.pdf", text: STRONG });
    auth.isAuthenticated = true;
    await mount();
    expect(hook.resume.fileName).toBe("cv.pdf");
    expect(optimizeResume).not.toHaveBeenCalled();
  });

  it("signed in: runs straight away, no modal, nothing saved", async () => {
    savePending({ action: "optimize", fileName: "cv.pdf", text: STRONG });
    auth.isAuthenticated = true;
    await mount();
    window.sessionStorage.clear();
    await act(async () => hook.request("optimize"));
    expect(optimizeResume).toHaveBeenCalledTimes(1);
    expect(showModal).not.toHaveBeenCalled();
    expect(window.sessionStorage.getItem(PENDING_KEY)).toBeNull();
  });
});
