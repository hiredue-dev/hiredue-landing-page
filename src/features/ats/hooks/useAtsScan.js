"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/features/auth/context/AuthContext.jsx";
import { validateResumeFile } from "../domain/validation.js";
import { isValidReport, normalizeAtsResult } from "../domain/report.js";
import atsService from "../services/atsService.js";
import mockAtsService from "../services/mockAtsService.js";
import {
  savePendingScan,
  getPendingScan,
  clearPendingScan,
} from "../services/pendingScanStorage.js";
import { savePreviewSource, clearPreviewSource } from "../services/previewSourceStorage.js";
import { saveResult, clearResult } from "../services/resultStorage.js";

/**
 * Resolve the service boundary once (client / build-time constant). When
 * `NEXT_PUBLIC_ATS_MODE === "mock"`, the full workflow runs against the
 * in-browser mock adapter so the UI can be tested without a live backend.
 * Default is the real service — the mock is an explicit opt-in.
 */
const ACTIVE_SERVICE =
  process.env.NEXT_PUBLIC_ATS_MODE === "mock" ? mockAtsService : atsService;

/**
 * Scan workflow states (single source of truth for the ATS experience):
 *
 *   idle         — no file selected yet
 *   uploading    — requesting a signed S3 URL and PUTting the resume (anonymous OK)
 *   awaitingAuth — resume uploaded to S3; waiting for the user to sign up / log in
 *   scanning     — authenticated; POST /api/ats/process is running (synchronous)
 *   result       — a valid result has been returned and authenticated
 *
 * Transitions include explicit `error` and `reset` paths. Components must NOT
 * manipulate these states independently — they call the actions exposed here.
 */

export const ATS_STATUS = {
  IDLE: "idle",
  UPLOADING: "uploading",
  AWAITING_AUTH: "awaitingAuth",
  SCANNING: "scanning",
  RESULT: "result",
  ERROR: "error",
};

const VALID_STATUSES = new Set(Object.values(ATS_STATUS));

/** Maps service/validation error codes to stable user-facing copy keys. */
const ERROR_CODE_TO_COPY = {
  unsupportedFile: "unsupportedFile",
  fileTooLarge: "fileTooLarge",
  noFile: "noFile",
  upload_failed: "uploadFailed",
  invalid_upload: "invalidUpload",
  upload_not_found: "uploadNotFound",
  upload_conflict: "uploadConflict",
  scan_failed: "scanFailed",
  invalid_report: "invalidReport",
  expired_upload: "expiredUpload",
  backend_unavailable: "backendUnavailable",
  subscription_restricted: "subscriptionRestricted",
};

/**
 * Builds the hook's full state at once so we avoid duplicated `setX` calls and
 * keep the state machine explicit and testable.
 */
export function useAtsScan() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [status, setStatus] = useState(ATS_STATUS.IDLE);
  const [file, setFile] = useState(null);
  const [uploadId, setUploadId] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [report, setReport] = useState(null);
  const [errorKey, setErrorKey] = useState(null);
  const [jobDescription, setJobDescription] = useState("");

  // Re-entrancy guard so a scan (or a StrictMode double-invoke) never runs twice
  // against the same pending upload.
  const scanInFlightRef = useRef(false);
  // Guard against acting on a stale upload after a reset / new scan.
  const sessionRef = useRef(0);

  const resetState = useCallback(() => {
    sessionRef.current += 1;
    scanInFlightRef.current = false;
    clearPendingScan();
    clearResult();
    setStatus(ATS_STATUS.IDLE);
    setFile(null);
    setUploadId(null);
    setFileName(null);
    setReport(null);
    setErrorKey(null);
    setJobDescription("");
  }, []);

  const setError = useCallback((code) => {
    setStatus(ATS_STATUS.ERROR);
    setErrorKey(ERROR_CODE_TO_COPY[code] || "uploadFailed");
  }, []);

  /* ------------------------------------------------------------------ *
   * Upload a selected resume (PDF · DOCX · TXT): request a signed S3 URL,
   * then PUT the bytes directly to S3. No auth is required for this stage.
   * On success we retain the uploadId for the later authenticated process call.
   *
   * An optional job description is captured and retained in state so a future
   * JD-aware processing step can use it, but it is NOT sent to the current
   * backend (process only accepts { uploadId }) — see docs/ats-api-contract.md.
   * ------------------------------------------------------------------ */
  const upload = useCallback(
    async (nextFile, jobDescription = "") => {
      const validation = validateResumeFile(nextFile);
      if (!validation.ok) {
        setErrorKey(validation.code);
        setStatus(ATS_STATUS.ERROR);
        return false;
      }

      const session = ++sessionRef.current;
      setFile(validation.file);
      setJobDescription(jobDescription ?? "");
      setErrorKey(null);
      setStatus(ATS_STATUS.UPLOADING);

      // A fresh scan clears any previously completed result so the dashboard
      // never shows a stale analysis from an earlier run.
      clearResult();

      // 1. Request a pre-signed S3 URL (anonymous, no body).
      const init = await ACTIVE_SERVICE.requestSignedUpload();
      if (sessionRef.current !== session) return false;
      if (!init.success) {
        setError(init.error);
        return false;
      }

      // 2. PUT the resume bytes directly to S3 (never to the backend).
      const put = await ACTIVE_SERVICE.uploadPdfToS3(
        init.data.url,
        validation.file,
      );
      if (sessionRef.current !== session) return false;
      if (!put.success) {
        setError(put.error);
        return false;
      }

      // 3. Retain the uploadId and persist it so the Sign Up / Log In
      //    navigation (which unmounts this hook) can resume the scan.
      const id = init.data.uploadId;
      setUploadId(id);
      setFileName(validation.file.name);
      // Best-effort: persist the uploaded File bytes so the dashboard can show a
      // REAL preview of the exact resume. Backend offers no GET URL for it, so
      // this small frontend boundary is what makes same-session preview possible.
      // Failure here is non-fatal — the dashboard degrades to an honest state.
      savePreviewSource(validation.file);
      savePendingScan({ uploadId: id, fileName: validation.file.name });
      setStatus(ATS_STATUS.AWAITING_AUTH);
      return true;
    },
    [setError],
  );

  /* ------------------------------------------------------------------ *
   * Once authenticated, run the synchronous processing request.
   * ------------------------------------------------------------------ */
  const scan = useCallback(async () => {
    const id = uploadId;
    if (!id) {
      setError("scan_failed");
      return false;
    }
    // Re-entrancy guard: bail if a scan is already in flight (e.g. StrictMode
    // double-invoke), so we never process the same upload twice.
    if (scanInFlightRef.current) return false;
    scanInFlightRef.current = true;

    const session = ++sessionRef.current;
    setStatus(ATS_STATUS.SCANNING);
    setErrorKey(null);

    try {
      // Synchronous — the request stays open until the final result is ready.
      const result = await ACTIVE_SERVICE.processUpload(id);
      if (sessionRef.current !== session) return false;
      if (!result.success) {
        setError(result.error);
        return false;
      }

      const normalized = normalizeAtsResult(result.data);
      if (!normalized || !isValidReport(normalized)) {
        setError("invalid_report");
        return false;
      }

      setReport(normalized);
      // Persist the completed result (plus the uploaded filename captured during
      // the upload step) for the /ats -> /ats/dashboard navigation (the workflow
      // component and its hook state unmount on the route change). The backend
      // process response does not include the filename, so we bridge it here.
      saveResult(normalized, fileName);
      // The scan is done; the pending-scan context is no longer needed and must
      // not be resumed on a future remount.
      clearPendingScan();
      setStatus(ATS_STATUS.RESULT);
      return true;
    } finally {
      scanInFlightRef.current = false;
    }
  }, [uploadId, fileName, setError]);

  /* ------------------------------------------------------------------ *
   * Restore a pending scan left behind by a navigation away from /ats
   * (including the Sign Up / Log In round-trip, which unmounts this hook).
   *
   * On remount the hook starts at IDLE, so we re-materialize the persisted
   * context (uploadId) into AWAITING_AUTH. The gate-on-auth effect below then
   * resumes the scan automatically if the user is authenticated; if they're
   * not, the auth gate is shown instead. `restoredRef` only becomes true once
   * the auth status has settled so we never permanently bail while authLoading.
   * ------------------------------------------------------------------ */
  const restoredRef = useRef(false);
  useEffect(() => {
    if (restoredRef.current) return;
    if (authLoading) return;
    const stored = getPendingScan();
    if (!stored) return;
    // Re-entrancy guard: never resume into a scan that is already running.
    if (scanInFlightRef.current) return;

    setUploadId(stored.uploadId ?? null);
    setFileName(stored.fileName ?? null);
    // Park in AWAITING_AUTH so the gate-on-auth effect below picks up the
    // restored context and continues straight into SCANNING → RESULT.
    setStatus(ATS_STATUS.AWAITING_AUTH);
    restoredRef.current = true;
  }, [isAuthenticated, authLoading]);

  /* ------------------------------------------------------------------ *
   * If an anonymous visitor has a pending upload and then authenticates,
   * automatically continue into the scan (gate-on-auth handoff).
   * ------------------------------------------------------------------ */
  useEffect(() => {
    if (
      authLoading ||
      !isAuthenticated ||
      status !== ATS_STATUS.AWAITING_AUTH
    ) {
      return;
    }
    scan();
  }, [isAuthenticated, authLoading, status, scan]);

  // Keep the flow explicit: if a transition left `status` out of the known set,
  // fall back to a clean `idle` rather than rendering an undefined branch.
  const sanitizedStatus = VALID_STATUSES.has(status) ? status : ATS_STATUS.IDLE;

  const value = useMemo(
    () => ({
      // state
      status: sanitizedStatus,
      file,
      fileName,
      uploadId,
      report,
      errorKey,
      jobDescription,
      // convenience booleans (interface segregation: consumers read what they need)
      isIdle: sanitizedStatus === ATS_STATUS.IDLE,
      isUploading: sanitizedStatus === ATS_STATUS.UPLOADING,
      isAwaitingAuth: sanitizedStatus === ATS_STATUS.AWAITING_AUTH,
      isScanning: sanitizedStatus === ATS_STATUS.SCANNING,
      hasResult: sanitizedStatus === ATS_STATUS.RESULT && !!report,
      hasError: sanitizedStatus === ATS_STATUS.ERROR,
      // actions
      upload,
      scan,
      reset: resetState,
    }),
    [
      sanitizedStatus,
      file,
      fileName,
      uploadId,
      report,
      errorKey,
      jobDescription,
      upload,
      scan,
      resetState,
    ],
  );

  return value;
}

export default useAtsScan;
