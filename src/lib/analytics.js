/*
 * Product analytics: one call sends an event to Vercel Analytics and, when their
 * tags are loaded, to Google Analytics and Microsoft Clarity as well. Page views are counted
 * by <Analytics /> in the root layout on their own; these events are for the
 * pages and actions we want to follow by name.
 *
 * Event names are snake_case so they read the same in both tools. Properties
 * must be flat strings, numbers or booleans, and never personal data: no
 * emails, names or resume text.
 */

import { track } from "@vercel/analytics";

export const EVENTS = {
  jobsPageViewed: "jobs_page_viewed",
  atsPageViewed: "ats_page_viewed",
  jobViewed: "job_viewed",
  jobApplyClicked: "job_apply_clicked",
  jobAutoApplyClicked: "job_auto_apply_clicked",
  resumeUploaded: "ats_resume_uploaded",
  resumeUploadFailed: "ats_resume_upload_failed",
  atsActionRequested: "ats_action_requested",
  atsActionCompleted: "ats_action_completed",
  atsActionFailed: "ats_action_failed",
  resumePdfDownloaded: "ats_pdf_downloaded",
  authModalOpened: "auth_modal_opened",
  signedUp: "signed_up",
  loggedIn: "logged_in",
};

// Vercel drops properties that aren't flat values; keep only those, and short.
function clean(props) {
  const out = {};
  for (const [key, value] of Object.entries(props ?? {})) {
    if (value === undefined || value === null) continue;
    if (typeof value === "string") out[key] = value.slice(0, 255);
    else if (typeof value === "number" || typeof value === "boolean") out[key] = value;
  }
  return out;
}

/** The fields of a job worth reporting, and where on the site it was seen. */
export const jobProps = (job, from) => ({
  from,
  job_id: job?.id != null ? String(job.id) : undefined,
  job_title: job?.jobTitle,
  company: job?.hiringCompany,
  platform: job?.platformName,
});

/**
 * @param {string} name  one of EVENTS
 * @param {Record<string, string|number|boolean|null|undefined>} [props]
 */
export function trackEvent(name, props) {
  if (typeof window === "undefined") return;
  const data = clean(props);
  // Analytics must never break the page it measures.
  try {
    track(name, data);
  } catch {}
  try {
    window.gtag?.("event", name, data);
  } catch {}
  // Clarity takes only the event name; it can then filter recordings by it.
  try {
    window.clarity?.("event", name);
  } catch {}
}
