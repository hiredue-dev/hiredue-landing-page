/**
 * Frontend-only mock implementation of the ATS service boundary.
 *
 * This mirrors the exact public shape of `atsService.js` — requestSignedUpload /
 * uploadPdfToS3 / processUpload, each returning the normalized
 * `{ success, data, error, message }` envelope — so the workflow hook can swap
 * between the two without any UI changes.
 *
 * It exists ONLY so the frontend can be exercised end-to-end before the backend
 * endpoints exist. It does NOT run an ATS scoring engine — `processUpload`
 * returns static fixture payloads matching the FINAL backend shape
 * ({ headline, quality, completeness, contentStrength, advisories }). A handful
 * of tiers (~low / ~mid / ~high) let every result state be exercised.
 *
 * Formats: the approved product requirement is PDF · DOCX · TXT; the mock PUT is
 * a no-op so it works for any accepted extension.
 */

const OK = true;
const FAIL = false;

function ok(data) {
  return { success: OK, data, error: null, message: "" };
}

function fail(error = "ats_error", message = "") {
  return { success: FAIL, data: null, error, message };
}

/** Vary the fixture by uploadId so two files in the same session differ a little. */
function hashString(value) {
  let h = 0;
  const str = String(value ?? "");
  for (let i = 0; i < str.length; i += 1) {
    h = (h * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function buildFlatResult(uploadId) {
  const h = hashString(uploadId);
  const headline = [41, 62, 85][h % 3] + (h % 5); // ~ low / mid / high tiers
  return {
    headline: Math.min(99, headline),
    quality: Math.min(99, headline + 3),
    cappedByParseHealth: headline > 88,
    parseHealth: headline - 4,
    completeness: {
      score: Math.min(99, headline + (h % 7)),
      items: [
        "Sections are complete and in a standard order.",
        "Contact, skills, experience and education are all present.",
      ],
    },
    contentStrength: {
      score: Math.min(99, headline - (h % 6)),
      items: [
        "Achievements are mostly quantified with measurable outcomes.",
        "Consider adding role-specific terminology for a stronger match.",
      ],
    },
    advisories: [
      {
        severity: "info",
        title: "Keep it scannable",
        detail: "Preserve clear headings and avoid tables so parsers read top-to-bottom.",
      },
      {
        severity: "info",
        title: "Quantify impact",
        detail: "Rewrite duties as achievements with numbers, percentages, or timeframes.",
      },
    ],
  };
}

/* In-memory "storage" so a process call can reference the upload that was
 * registered by requestSignedUpload + uploadPdfToS3. */
const store = new Map();
let seq = 0;

/** Request a pre-signed S3 PUT URL (anonymous). Returns a fake S3 URL + uploadId. */
export async function requestSignedUpload() {
  const uploadId = `mock-${++seq}`;
  const url = `https://mock-s3.invalid/resume/temporary/${uploadId}`;
  store.set(uploadId, { fileName: `resume-${uploadId}.pdf`, url });
  return ok({ url, key: `resume/temporary/${uploadId}`, expiresIn: 900, uploadId });
}

/** Directly "PUT" the resume to S3 — a no-op success in mock (any format). */
export async function uploadPdfToS3(signedUrl, file) {
  const label = file?.name || "resume.pdf";
  for (const [id, rec] of store) {
    if (rec.url === signedUrl) {
      store.set(id, { ...rec, fileName: label });
      break;
    }
  }
  return ok({ uploaded: true });
}

/** Synchronously "process" an upload into a flat ATS result (final shape). */
export async function processUpload(uploadId) {
  const record = uploadId ? store.get(uploadId) : null;
  if (!record) return fail("upload_not_found", "Upload not found in mock store.");
  const result = buildFlatResult(uploadId);
  store.set(uploadId, { ...record, result });
  return ok(result);
}

export const mockAtsService = {
  requestSignedUpload,
  uploadPdfToS3,
  processUpload,
};

export default mockAtsService;