"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/features/auth/context/AuthContext.jsx";
import { validateResumeFile } from "../domain/validation.js";
import { isValidReport } from "../domain/report.js";
import atsService from "../services/atsService.js";

/**
 * Scan workflow states (single source of truth for the ATS experience):
 *
 *   idle         — no file selected yet
 *   uploading    — file is being sent to temporary storage (anonymous OK)
 *   awaitingAuth — upload stored; waiting for the user to sign up / log in
 *   scanning     — authenticated; backend deterministic engine is running
 *   result       — a valid report has been returned and authenticated
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

/** Maps a pure validation/user-facing message key to stable display text keys. */
const ERROR_CODE_TO_COPY = {
  unsupportedFile: "unsupportedFile",
  fileTooLarge: "fileTooLarge",
  noFile: "noFile",
  upload_failed: "uploadFailed",
  claim_failed: "authInterrupted",
  scan_failed: "scanFailed",
  report_failed: "invalidReport",
  expired_upload: "expiredUpload",
  backend_unavailable: "backendUnavailable",
  subscription_restricted: "subscriptionRestricted",
};

/**
 * Builds the hook's full state at once so we avoid duplicated `setX` calls and
 * keep the state machine explicit and testable.
 */
export function useAtsScan({ mode = "generic" } = {}) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [status, setStatus] = useState(ATS_STATUS.IDLE);
  const [file, setFile] = useState(null);
  const [uploadToken, setUploadToken] = useState(null);
  const [fileId, setFileId] = useState(null);
  const [report, setReport] = useState(null);
  const [errorKey, setErrorKey] = useState(null);
  const [history, setHistory] = useState([]);

  // True once an upload+claim chain has been resolved for the current session.
  const hasClaimedRef = useRef(false);
  // Re-entrancy guard so a scan (or a StrictMode double-invoke) never runs twice
  // against the same pending upload, which would create duplicate reports.
  const scanInFlightRef = useRef(false);
  // Guard against acting on a stale token after a reset.
  const sessionRef = useRef(0);

  const resetState = useCallback(() => {
    sessionRef.current += 1;
    scanInFlightRef.current = false;
    setStatus(ATS_STATUS.IDLE);
    setFile(null);
    setUploadToken(null);
    setFileId(null);
    setReport(null);
    setErrorKey(null);
    setHistory([]);
    hasClaimedRef.current = false;
  }, []);

  const setError = useCallback((code) => {
    setStatus(ATS_STATUS.ERROR);
    setErrorKey(ERROR_CODE_TO_COPY[code] || "uploadFailed");
  }, []);

  /* ------------------------------------------------------------------ *
   * Upload a selected file to temporary storage (no auth required).
   * ------------------------------------------------------------------ */
  const upload = useCallback(
    async (nextFile) => {
      const validation = validateResumeFile(nextFile);
      if (!validation.ok) {
        setErrorKey(validation.code);
        setStatus(ATS_STATUS.ERROR);
        return false;
      }

      const session = ++sessionRef.current;
      setFile(validation.file);
      setErrorKey(null);
      setStatus(ATS_STATUS.UPLOADING);

      const result = await atsService.uploadResume(validation.file);
      if (sessionRef.current !== session) return false;

      if (!result.success) {
        setError(result.error);
        return false;
      }

      setUploadToken(result.data.uploadToken);
      setFileId(result.data.fileId);
      setStatus(ATS_STATUS.AWAITING_AUTH);
      return true;
    },
    [setError],
  );

  /* ------------------------------------------------------------------ *
   * Once the user is authenticated, claim the pending upload and scan.
   * ------------------------------------------------------------------ */
  const scan = useCallback(async () => {
    const token = uploadToken;
    if (!token) {
      setError("scan_failed");
      return false;
    }
    // Re-entrancy guard: bail if a scan is already in flight (e.g. StrictMode
    // double-invoke), so we never claim/scan the same upload twice.
    if (scanInFlightRef.current) return false;
    scanInFlightRef.current = true;

    const session = ++sessionRef.current;
    setStatus(ATS_STATUS.SCANNING);
    setErrorKey(null);

    try {
      // Claim the anonymous upload so the backend binds it to the account.
      if (!hasClaimedRef.current) {
        const claim = await atsService.claimUpload(token);
        if (sessionRef.current !== session) return false;
        if (!claim.success) {
          hasClaimedRef.current = false;
          setError(
            claim.error === "expired_upload" ? "expired_upload" : "claim_failed",
          );
          return false;
        }
        hasClaimedRef.current = true;
      }

      // Ask the backend's deterministic engine to produce the report.
      const scanResult = await atsService.startScan({ fileId, mode });
      if (sessionRef.current !== session) return false;
      if (!scanResult.success) {
        setError(scanResult.error);
        return false;
      }

      const reportId = scanResult.data?.reportId ?? scanResult.data?.id;
      if (!reportId) {
        setReport(null);
        setError("report_failed");
        return false;
      }

      const reportResult = await atsService.getReport(reportId);
      if (sessionRef.current !== session) return false;
      if (!reportResult.success || !isValidReport(reportResult.data)) {
        setError("report_failed");
        return false;
      }

      setReport(reportResult.data);
      setStatus(ATS_STATUS.RESULT);
      return true;
    } finally {
      scanInFlightRef.current = false;
    }
  }, [uploadToken, fileId, mode, setError]);

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

  /* ------------------------------------------------------------------ *
   * Optional: refresh the authenticated user's scan history.
   * ------------------------------------------------------------------ */
  const loadHistory = useCallback(async () => {
    if (!isAuthenticated) return;
    const result = await atsService.getHistory();
    if (result.success) setHistory(result.data);
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && status === ATS_STATUS.RESULT) {
      loadHistory();
    }
  }, [isAuthenticated, status, loadHistory]);

  // Keep the flow explicit: if a transition left `status` out of the known set,
  // fall back to a clean `idle` rather than rendering an undefined branch.
  const sanitizedStatus = VALID_STATUSES.has(status)
    ? status
    : ATS_STATUS.IDLE;

  const value = useMemo(
    () => ({
      // state
      status: sanitizedStatus,
      file,
      uploadToken,
      report,
      errorKey,
      history,
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
      loadHistory,
      reset: resetState,
    }),
    [
      sanitizedStatus,
      file,
      uploadToken,
      report,
      errorKey,
      history,
      upload,
      scan,
      loadHistory,
      resetState,
    ],
  );

  return value;
}

export default useAtsScan;