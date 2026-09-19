/**
 * Small, safe frontend boundary that carries the *uploaded resume* from the
 * /ats upload step across the authentication + navigation round-trip so the
 * dashboard can show a REAL preview of the exact resume that was analyzed.
 *
 * WHY THIS EXISTS
 *   - The backend returns a PUT-only pre-signed S3 URL for upload; neither
 *     /api/ats/upload nor /api/ats/process returns a readable GET/read URL or
 *     object reference for the uploaded document. After the document is moved
 *     to the user's permanent S3 key the frontend has no way to fetch it back.
 *   - The browser File object only lives in React state on /ats and is unmounted
 *     during the Sign Up / Log In redirect and again before the dashboard.
 *
 * This module bridges that gap WITHOUT touching the backend contract: it stores
 * the local File bytes (blob) in sessionStorage (base64) so the same browser
 * session can re-render the actual uploaded resume. It is a *best-effort*
 * boundary with an explicit size guard — sessionStorage is limited (~5 MB by
 * default), so a resume beyond the safe threshold simply degrades to "preview
 * not available" rather than failing or fabricating content.
 *
 * It deliberately NEVER invents a URL or claims a backend preview capability.
 */

const KEY = "hd_resume_preview";

/** Base64 text longer than this (≈ 2.6 MB of PDF bytes) is not persisted. */
const MAX_SAFE_BASE64_LENGTH = 3.5 * 1024 * 1024;

const isBrowser = () => typeof window !== "undefined";

function toBase64(arrayBuffer) {
  const bytes = new Uint8Array(arrayBuffer);
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

/**
 * Persist a local File as the preview source. Returns true when stored, false
 * when it could not be (storage unavailable / quota / too large).
 */
export function savePreviewSource(file) {
  if (!isBrowser() || !file) return false;
  try {
    const payload = {
      name: file.name || "resume.pdf",
      type: file.type || "application/pdf",
      size: file.size || 0,
      // best-effort: emailed via base64 only when small enough to be safe
      data: null,
    };
    if (file.arrayBuffer) {
      return file.arrayBuffer().then((buf) => {
        const b64 = toBase64(buf);
        if (b64.length > MAX_SAFE_BASE64_LENGTH) {
          // Too large for sessionStorage — keep the metadata only (unavailable
          // preview), never a truncated/fake document.
          sessionStorage.setItem(KEY, JSON.stringify({ ...payload, data: null }));
          return false;
        }
        payload.data = b64;
        sessionStorage.setItem(KEY, JSON.stringify(payload));
        return true;
      });
    }
    sessionStorage.setItem(KEY, JSON.stringify(payload));
    return false;
  } catch {
    try {
      sessionStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
    return false;
  }
}

/**
 * Rebuild the preview source as a Browser `Blob` when a persisted one exists.
 * Returns null when nothing is available (the dashboard shows an honest state).
 */
export function getPreviewSource() {
  if (!isBrowser()) return null;
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    if (!parsed.data || typeof parsed.data !== "string") {
      // Metadata without bytes -> no real preview available.
      return { name: parsed.name, type: parsed.type, blob: null, hasBytes: false };
    }
    const binary = atob(parsed.data);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
    const blob = new Blob([bytes.buffer], { type: parsed.type || "application/pdf" });
    return { name: parsed.name, type: blob.type, blob, hasBytes: true };
  } catch {
    return null;
  }
}

/** Remove any persisted preview source (fresh upload / New Scan). */
export function clearPreviewSource() {
  if (!isBrowser()) return;
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    /* ignore storage errors */
  }
}