import { apiClient } from "@/features/auth/services/apiClient.js";
import { resumeMimeType } from "../domain/validation.js";

/**
 * ATS service boundary — the ONLY place the frontend speaks to the ATS backend.
 *
 * Adheres to the FINAL backend contract (docs/ats-api-contract.md):
 *
 *   1. POST /api/ats/upload  (anonymous, no body)
 *        -> { url, key, expiresIn, uploadId }   (pre-signed S3 PUT URL)
 *   2. PUT  <url>            (direct to S3, Content-Type matched to the file)
 *        -> the resume bytes go straight to S3; they NEVER reach the backend.
 *   3. POST /api/ats/process (authenticated, Bearer JWT)
 *        body { uploadId }
 *        -> synchronous HTTP 200 with the full ATS result. No polling, no
 *           status/result endpoint, no second request.
 *
 * Formats: the approved product requirement is PDF · DOCX · TXT, and this
 * boundary sends the correct S3 `Content-Type` for each via `resumeMimeType()`.
 * The deployed backend snapshot presigns for `application/pdf`; accepting
 * DOCX/TXT on the backend needs no change here — the PUT already sends the
 * right type once the presign is widened.
 *
 * No `userId` is ever sent — the backend derives the account from the Cognito
 * middleware. No JD is sent (the current API does not support JD matching).
 *
 * Every method returns the envelope `{ success, data, error, message }`. `data`
 * for processUpload is the raw backend payload; the hook normalizes it via
 * `domain/report.js` so presentation never reads raw shapes.
 */

const OK = true;
const FAIL = false;

function ok(data) {
  return { success: OK, data, error: null, message: "" };
}

function fail(error, message = "") {
  // `error` is a stable machine code (mapped to copy by the hook), not backend
  // text. `message` is an optional human detail kept for debugging only.
  return { success: FAIL, data: null, error: error ?? "ats_error", message };
}

/**
 * Build an absolute ATS API URL from NEXT_PUBLIC_BACKEND_API_URL, normalizing
 * the `/api` segment so we never produce `.../api/api/ats/...` or drop `/api`.
 *
 *   NEXT_PUBLIC_BACKEND_API_URL="https://x.com/api"  -> https://x.com/api/ats/upload
 *   NEXT_PUBLIC_BACKEND_API_URL="https://x.com"      -> https://x.com/api/ats/upload
 */
function buildAtsApiUrl(apiPath) {
  const base = (process.env.NEXT_PUBLIC_BACKEND_API_URL || "").replace(/\/+$/, "");
  const withApi = base.endsWith("/api") ? base : `${base}/api`;
  return `${withApi}/ats/${apiPath}`;
}

/**
 * Map an HTTP status from the backend to a stable, presentation-safe error code.
 * We key off the status (not backend text) per the contract's error table.
 */
function errorCodeFromStatus(status) {
  if (status === 400) return "invalid_upload";
  if (status === 404) return "upload_not_found";
  if (status === 409) return "upload_conflict";
  if (status === 410) return "expired_upload";
  if (status === 502) return "backend_unavailable";
  return "scan_failed";
}

/* ------------------------------------------------------------------ *
 * Anonymous upload initialization
 * ------------------------------------------------------------------ */

/**
 * Request a pre-signed S3 PUT URL (anonymous — no auth). Returns
 * { url, key, expiresIn, uploadId }. No file bytes are sent.
 */
export async function requestSignedUpload() {
  try {
    const result = await apiClient.post(buildAtsApiUrl("upload"), {}, { withAuth: false });
    if (!result.success) return fail(errorCodeFromStatus(result.status), result.message);
    const data = result.data;
    if (!data || !data.url || !data.uploadId) {
      return fail("upload_failed", "Upload initialisation returned no URL/uploadId.");
    }
    return ok({
      url: data.url,
      key: data.key ?? null,
      expiresIn: data.expiresIn ?? null,
      uploadId: data.uploadId,
    });
  } catch (err) {
    return fail(err?.status ? errorCodeFromStatus(err.status) : "backend_unavailable", err?.message || "upload_failed");
  }
}

/* ------------------------------------------------------------------ *
 * Direct upload of the PDF to S3
 * ------------------------------------------------------------------ */

/**
 * Upload the resume bytes directly to the pre-signed S3 URL returned by
 * requestSignedUpload(). The bytes are sent to S3 only — never to the backend.
 * `Content-Type` is resolved from the file's extension via `resumeMimeType()`
 * (PDF · DOCX · TXT), never hardcoded.
 */
export async function uploadPdfToS3(signedUrl, file) {
  try {
    const response = await fetch(signedUrl, {
      method: "PUT",
      headers: { "Content-Type": resumeMimeType(file) },
      body: file,
    });
    if (!response.ok) return fail("upload_failed", `S3 upload failed (${response.status}).`);
    return ok({ uploaded: true });
  } catch (err) {
    return fail("backend_unavailable", err?.message || "s3_upload_failed");
  }
}

/* ------------------------------------------------------------------ *
 * Authenticated, synchronous processing
 * ------------------------------------------------------------------ */

/**
 * Ask the backend to process the previously uploaded resume. Authenticated via
 * the shared apiClient (attaches the Cognito bearer token and handles 401
 * refresh). Sends ONLY { uploadId }. Synchronous — this request stays open until
 * the final result is ready and returns it directly.
 */
export async function processUpload(uploadId) {
  if (!uploadId) return fail("invalid_upload", "Missing uploadId.");

  try {
    const result = await apiClient.post(buildAtsApiUrl("process"), { uploadId });
    if (!result.success) return fail(errorCodeFromStatus(result.status), result.message);
    return ok(result.data ?? null);
  } catch (err) {
    return fail(err?.status ? errorCodeFromStatus(err.status) : "scan_failed", err?.message || "process_failed");
  }
}

export const atsService = {
  requestSignedUpload,
  uploadPdfToS3,
  processUpload,
};

export default atsService;