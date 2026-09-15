import { apiClient } from "@/features/auth/services/apiClient.js";

/**
 * ATS service boundary.
 *
 * This is the ONLY place the frontend speaks to the ATS backend. It exposes
 * granular, named operations (upload / claim / scan / report / history) and
 * returns normalized results. No React state, no UI logic, and — critically —
 * no scoring calculation lives here. The backend's deterministic engine is the
 * sole authority for the numerical score; the frontend only stores and asks.
 *
 * CONTRACT ASSUMPTION (documented):
 * The external backend endpoints and the exact response envelope are not yet
 * final. This module centralizes that assumption so evolution is confined to a
 * single file. Expected contract:
 *
 *   POST /ats/upload   -> FormData(file)          -> { uploadToken, fileId }
 *   POST /ats/claim    -> { uploadToken }         -> { becameAuthenticated }
 *   POST /ats/scan     -> { fileId, mode }        -> { reportId }
 *   GET  /ats/report/:id                         -> { ATSReport }
 *   GET  /ats/history                            -> { ATSReport[] }
 *
 * Responses are expected to follow the existing `apiClient` envelope:
 * `{ success, data, error, message }`. Everything is defensive so a wrong or
 * missing field degrades gracefully instead of throwing into the UI.
 */

const OK = true;
const FAIL = false;

function ok(data) {
  return { success: OK, data, error: null, message: "" };
}

function fail(error, message = "") {
  return { success: FAIL, data: null, error: error ?? "ats_error", message };
}

/* ------------------------------------------------------------------ *
 * File upload helper
 * ------------------------------------------------------------------ */
/**
 * The JSON-only `apiClient.post` cannot carry a resume file, so the single
 * upload call uses a raw fetch + FormData against the same backend base URL.
 * This keeps the default auth header handling centralized and lets the service
 * layer own authentication for the request (Bearer token when present).
 */
async function uploadFile(path, file, uploadToken = null) {
  const base =
    (process.env.NEXT_PUBLIC_BACKEND_API_URL || "").replace(/\/$/, "") +
    (path.startsWith("/") ? path : `/${path}`);

  const { getAccessToken } = await import(
    "@/features/auth/services/tokenStore.js"
  );

  const form = new FormData();
  form.append("file", file);
  if (uploadToken) form.append("uploadToken", uploadToken);

  const headers = {};
  const token = getAccessToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(base, { method: "POST", headers, body: form });

  let body = {};
  try {
    body = await response.json();
  } catch {
    body = {};
  }

  return {
    success: body.success ?? response.ok,
    data: body.data ?? null,
    error: body.error ?? null,
    message: body.message ?? "",
    status: response.status,
  };
}

/* ------------------------------------------------------------------ *
 * Named operations
 * ------------------------------------------------------------------ */

/** Upload a resume to temporary storage (anonymous, before sign-in). */
export async function uploadResume(file, uploadToken = null) {
  try {
    const result = await uploadFile("/ats/upload", file, uploadToken);
    if (!result.success) return fail(result.error, result.message);
    if (!result.data || !result.data.uploadToken) {
      return fail("missing_upload_token", "Upload returned no token.");
    }
    return ok({
      uploadToken: result.data.uploadToken,
      fileId: result.data.fileId ?? null,
    });
  } catch (err) {
    return fail(err?.message || "upload_failed");
  }
}

/** Claim a pending anonymous upload after authentication. */
export async function claimUpload(uploadToken) {
  try {
    const result = await apiClient.post("/ats/claim", { uploadToken });
    if (!result.success) return fail(result.error, result.message);
    return ok(result.data ?? {});
  } catch (err) {
    return fail(err?.message || "claim_failed");
  }
}

/** Ask the backend to run its deterministic scoring engine on an upload. */
export async function startScan({ fileId, mode = "generic" }) {
  try {
    const result = await apiClient.post("/ats/scan", { fileId, mode });
    if (!result.success) return fail(result.error, result.message);
    return ok(result.data ?? {});
  } catch (err) {
    return fail(err?.message || "scan_failed");
  }
}

/** Retrieve a previously computed report. */
export async function getReport(reportId) {
  try {
    const result = await apiClient.get(`/ats/report/${reportId}`);
    if (!result.success) return fail(result.error, result.message);
    return ok(result.data ?? null);
  } catch (err) {
    return fail(err?.message || "report_failed");
  }
}

/** Retrieve the authenticated user's scan history (subscription-gated). */
export async function getHistory() {
  try {
    const result = await apiClient.get("/ats/history");
    if (!result.success) return fail(result.error, result.message);
    return ok(Array.isArray(result.data) ? result.data : []);
  } catch (err) {
    return fail(err?.message || "history_failed");
  }
}

export const atsService = {
  uploadResume,
  claimUpload,
  startScan,
  getReport,
  getHistory,
};

export default atsService;