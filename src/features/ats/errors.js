/*
 * Every way the ATS checker can fail, with the sentence the visitor sees.
 * `retry` says whether trying the same thing again could help.
 */

const MESSAGES = {
  unsupported: { message: "That file type isn't supported. Upload a PDF or DOCX.", retry: false },
  legacy_doc: { message: "Old .doc files can't be read. Save it as .docx or PDF and upload again.", retry: false },
  too_large: { message: "That file is over 5 MB. Upload a smaller PDF or DOCX.", retry: false },
  empty_file: { message: "That file is empty.", retry: false },
  too_many_pages: { message: "That PDF has more than 10 pages. Upload just your resume.", retry: false },
  parse_failed: { message: "We couldn't read that file. It may be damaged or password-protected. Try exporting it again.", retry: false },
  no_text: {
    message: "We couldn't find any text in that file. It looks like a scan or an image. ATS software can't read those either: export a text-based PDF or DOCX.",
    retry: false,
  },
  too_long: { message: "That's too much text to process at once. Shorten the resume or the job description and try again.", retry: false },
  auth: { message: "Your session has expired. Log in again to continue.", retry: false },
  rate_limited: { message: "You've made a lot of requests in a short time. Wait a minute and try again.", retry: true },
  timeout: { message: "This is taking longer than it should. Please try again.", retry: true },
  unavailable: { message: "Our AI service is busy right now. Please try again in a moment.", retry: true },
  unstructured: {
    message: "We couldn't reliably tell your resume's sections, roles and bullets apart. Try again, or upload a simpler single-column PDF or DOCX.",
    retry: true,
  },
  failed: { message: "Something went wrong. Please try again.", retry: true },
};

export class AtsError extends Error {
  constructor(code, { cause, retryAfter } = {}) {
    const entry = MESSAGES[code] ?? MESSAGES.failed;
    super(entry.message, { cause });
    this.name = "AtsError";
    this.code = MESSAGES[code] ? code : "failed";
    this.retry = entry.retry;
    this.retryAfter = retryAfter ?? null;
  }
}

/** Anything thrown → an AtsError, so the UI has one shape to show. */
export function toAtsError(err) {
  return err instanceof AtsError ? err : new AtsError("failed", { cause: err });
}
