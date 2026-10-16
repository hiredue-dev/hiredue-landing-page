"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/features/auth/context/AuthContext.jsx";
import { useAuthModal } from "@/features/auth/components/FloatingAuthModal.jsx";
import { EVENTS, trackEvent } from "@/lib/analytics";
import { toAtsError } from "../errors.js";
import { extractText } from "../extract.js";
import { clearPending, loadPending, RETURN_PATH, savePending } from "../pendingAction.js";
import { scoreResume } from "../scoring.js";
import { optimizeResume, tailorResume } from "../services/atsService.js";

export const EMPTY_JOB = { title: "", company: "", description: "" };
const IDLE = { status: "idle", stage: null, result: null, error: null };

/** Title and description are what tailoring works from; company is optional. */
export function jobFormErrors(job) {
  const errors = {};
  if (!job.title.trim()) errors.title = "Enter the job title.";
  if (job.description.trim().length < 80) errors.description = "Paste the full job description (at least a few sentences).";
  return errors;
}

/**
 * Everything the ATS checker section does: read and score a resume (anyone),
 * optimise or tailor it (signed in), and carry the visitor through sign-in
 * without losing their place.
 *
 * Gating: a signed-out click saves {action, resume text, job form} to
 * sessionStorage and opens the site's sign-up / log-in modal with RETURN_PATH
 * as its redirect. Every way through that modal ends at RETURN_PATH: email
 * log-in and sign-up push to it, Google comes back to it via
 * /cognito-callback. Arriving there (`handleReturn`, driven by the ?ats=resume
 * flag) restores the saved state and runs the action once auth has settled.
 */
export function useAtsChecker() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { showModal } = useAuthModal();

  const [resume, setResume] = useState(null); // {fileName, text, score}
  const [parse, setParse] = useState({ status: "idle", error: null });
  const [job, setJob] = useState(EMPTY_JOB);
  const [optimize, setOptimize] = useState(IDLE);
  const [tailor, setTailor] = useState(IDLE);
  const [resumeAction, setResumeAction] = useState(null); // action to run once auth settles
  const [tab, setTab] = useState("optimize");

  // A newer upload or run makes an older one's answer moot.
  const runId = useRef({ optimize: 0, tailor: 0, parse: 0 });

  const upload = useCallback(async (file) => {
    const id = ++runId.current.parse;
    setParse({ status: "parsing", error: null });
    try {
      const text = await extractText(file);
      if (id !== runId.current.parse) return;
      const score = scoreResume(text);
      trackEvent(EVENTS.resumeUploaded, { file_type: fileType(file), score: score.overall });
      setResume({ fileName: file.name, text, score });
      setOptimize(IDLE);
      setTailor(IDLE);
      setParse({ status: "idle", error: null });
      clearPending();
    } catch (err) {
      if (id !== runId.current.parse) return;
      const error = toAtsError(err);
      trackEvent(EVENTS.resumeUploadFailed, { file_type: fileType(file), code: error.code });
      setParse({ status: "error", error });
    }
  }, []);

  const reset = useCallback(() => {
    runId.current.parse += 1;
    runId.current.optimize += 1;
    runId.current.tailor += 1;
    setResume(null);
    setParse({ status: "idle", error: null });
    setOptimize(IDLE);
    setTailor(IDLE);
    clearPending();
  }, []);

  /** Back to the form / button: drops a finished or failed run. */
  const clearRun = useCallback((action) => {
    runId.current[action] += 1;
    (action === "optimize" ? setOptimize : setTailor)(IDLE);
  }, []);

  const execute = useCallback(async (action, text, jobInput) => {
    const set = action === "optimize" ? setOptimize : setTailor;
    const id = ++runId.current[action];
    setTab(action);
    set({ status: "running", stage: action === "optimize" ? "structuring" : "analyzing", result: null, error: null });
    const onStage = (stage) => id === runId.current[action] && set((s) => ({ ...s, stage }));
    try {
      const result = action === "optimize" ? await optimizeResume(text, { onStage }) : await tailorResume(text, jobInput, { onStage });
      if (id !== runId.current[action]) return;
      trackEvent(EVENTS.atsActionCompleted, {
        action,
        score_before: result.score?.before?.overall,
        score_after: result.score?.after?.overall,
        match_before: result.match?.before?.percent,
        match_after: result.match?.after?.percent,
        changes: result.changes?.length,
        partial: Boolean(result.partial),
      });
      set({ status: "done", stage: null, result, error: null });
    } catch (err) {
      if (id !== runId.current[action]) return;
      const error = toAtsError(err);
      trackEvent(EVENTS.atsActionFailed, { action, code: error.code });
      set({ status: "error", stage: null, result: null, error });
    }
  }, []);

  /**
   * The Optimize / Tailor buttons. Signed in: runs. Signed out: saves and
   * opens the sign-up modal; the action runs on the way back (handleReturn).
   * (A session that expires mid-run logs the visitor out in apiClient, so the
   * next click comes through here again.)
   * @param {"optimize"|"tailor"} action
   */
  const request = useCallback(
    (action) => {
      if (!resume) return;
      trackEvent(EVENTS.atsActionRequested, { action, signed_in: isAuthenticated });
      if (isAuthenticated) {
        execute(action, resume.text, action === "tailor" ? job : null);
        return;
      }
      savePending({ action, fileName: resume.fileName, text: resume.text, job });
      showModal({ view: "signup", redirectTo: RETURN_PATH });
    },
    [resume, job, isAuthenticated, execute, showModal],
  );

  /** Puts back a resume saved before sign-in; returns the action it was saved for. */
  const restore = useCallback(() => {
    const pending = loadPending();
    if (!pending) return null;
    setResume({ fileName: pending.fileName, text: pending.text, score: scoreResume(pending.text) });
    if (pending.job) setJob(pending.job);
    setTab(pending.action);
    return pending.action;
  }, []);

  // An ordinary visit within the TTL (e.g. the modal was closed and the page
  // reloaded): the resume is back, nothing runs.
  useEffect(() => {
    restore();
  }, [restore]);

  /**
   * Sign-in brought the visitor to RETURN_PATH: restore, drop the flag so a
   * reload doesn't run it twice, and queue the action.
   */
  const handleReturn = useCallback(() => {
    const action = restore();
    const url = new URL(window.location.href);
    url.searchParams.delete("ats");
    window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
    if (action) setResumeAction(action);
  }, [restore]);

  useEffect(() => {
    if (!resumeAction || authLoading || !resume) return;
    setResumeAction(null);
    if (!isAuthenticated) return; // came back without signing in: state is restored, nothing runs
    clearPending();
    execute(resumeAction, resume.text, resumeAction === "tailor" ? job : null);
  }, [resumeAction, authLoading, isAuthenticated, resume, job, execute]);

  return {
    resume,
    parse,
    upload,
    reset,
    job,
    setJob,
    optimize,
    tailor,
    request,
    clearRun,
    handleReturn,
    tab,
    setTab,
    isAuthenticated,
  };
}

const fileType = (file) => file?.name?.split(".").pop()?.toLowerCase() || "unknown";
