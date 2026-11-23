/*
 * The application form's rules, apart from the UI: what each screening
 * question accepts, the optional contact fields, and the multipart body
 * POST /api/ats/applications takes (backend docs/company-jobs.md §3).
 */

import { AtsError } from "@/features/ats/errors.js";
import { validateFile } from "@/features/ats/extract.js";

export const QUESTION_TYPES = ["text", "yes_no", "number", "choice"];
export const YES_NO = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];
export const MAX_RESUME_TEXT = 100_000;
export const MAX_TEXT_ANSWER = 2000;

const isBlank = (value) => value == null || String(value).trim() === "";

/** One question's answer → an error sentence, or null when it is fine. */
export function answerError(question, value) {
  if (isBlank(value)) return question.required ? "This question is required." : null;
  const text = String(value).trim();
  switch (question.type) {
    case "yes_no":
      return YES_NO.some((o) => o.value === text) ? null : "Choose Yes or No.";
    case "number":
      return /^-?\d+(\.\d+)?$/.test(text) && Number.isFinite(Number(text)) ? null : "Enter a number.";
    case "choice":
      return (question.options ?? []).includes(text) ? null : "Choose one of the options.";
    default:
      return text.length > MAX_TEXT_ANSWER ? `Keep it under ${MAX_TEXT_ANSWER} characters.` : null;
  }
}

/** @returns {Record<string, string>} question id → error, only for the questions that have one */
export function validateAnswers(questions = [], answers = {}) {
  const errors = {};
  for (const question of questions) {
    const error = answerError(question, answers[question.id]);
    if (error) errors[question.id] = error;
  }
  return errors;
}

/** The answers the API should get: trimmed, only for known questions, blanks left out. */
export function cleanAnswers(questions = [], answers = {}) {
  const out = {};
  for (const question of questions) {
    const value = answers[question.id];
    if (!isBlank(value)) out[question.id] = String(value).trim();
  }
  return out;
}

/** Optional; when given, 7–15 digits with the usual separators and an optional leading +. */
export function phoneError(phone) {
  if (isBlank(phone)) return null;
  const text = String(phone).trim();
  if (!/^\+?[\d\s().-]+$/.test(text)) return "Enter a valid phone number.";
  const digits = text.replace(/\D/g, "").length;
  return digits >= 7 && digits <= 15 ? null : "Enter a valid phone number.";
}

/** "linkedin.com/in/jane" → "https://linkedin.com/in/jane"; blank stays blank. */
export function normalizeLinkedin(url) {
  const text = String(url ?? "").trim();
  if (!text) return "";
  return /^https?:\/\//i.test(text) ? text : `https://${text}`;
}

export function linkedinError(url) {
  const text = normalizeLinkedin(url);
  if (!text) return null;
  try {
    const { hostname, protocol } = new URL(text);
    if (!/^https?:$/.test(protocol)) throw new Error("protocol");
    return /(^|\.)linkedin\.com$/i.test(hostname) ? null : "Enter a LinkedIn profile URL (linkedin.com/in/…).";
  } catch {
    return "Enter a LinkedIn profile URL (linkedin.com/in/…).";
  }
}

/** A resume file we can send, or the sentence saying why not. */
export function resumeFileError(file) {
  try {
    validateFile(file);
    return null;
  } catch (err) {
    return err instanceof AtsError ? err.message : "That file can't be used.";
  }
}

/**
 * Every client-side check before submitting.
 * @param {{questions: object[], answers: object, useProfileResume: boolean, resume: File|null, phone: string, linkedinUrl: string}} form
 * @returns {{answers: Record<string,string>, resume?: string, phone?: string, linkedinUrl?: string}} errors (empty objects/keys when valid)
 */
export function validateApplication({ questions, answers, useProfileResume, resume, phone, linkedinUrl }) {
  const errors = { answers: validateAnswers(questions, answers) };
  if (!useProfileResume) {
    const error = resume ? resumeFileError(resume) : "Upload your resume (PDF or DOCX, up to 5 MB).";
    if (error) errors.resume = error;
  }
  const phoneMsg = phoneError(phone);
  if (phoneMsg) errors.phone = phoneMsg;
  const linkedinMsg = linkedinError(linkedinUrl);
  if (linkedinMsg) errors.linkedinUrl = linkedinMsg;
  return errors;
}

export function hasErrors(errors) {
  return Object.keys(errors.answers ?? {}).length > 0 || ["resume", "phone", "linkedinUrl"].some((k) => errors[k]);
}

/**
 * The multipart body for POST /api/ats/applications. Optional fields are left
 * out when empty: no `resume` means the backend uses the profile resume.
 */
export function buildApplicationFormData({ jobId, answers = {}, utm = null, resume = null, resumeText = "", phone = "", linkedinUrl = "" }) {
  const form = new FormData();
  form.append("jobId", String(jobId));
  form.append("answers", JSON.stringify(answers ?? {}));
  form.append("utm", JSON.stringify(utm ?? {}));
  if (resume) {
    form.append("resume", resume, resume.name);
    const text = String(resumeText ?? "").trim();
    if (text) form.append("resumeText", text.slice(0, MAX_RESUME_TEXT));
  }
  const cleanPhone = String(phone ?? "").trim();
  if (cleanPhone) form.append("phone", cleanPhone);
  const cleanLinkedin = normalizeLinkedin(linkedinUrl);
  if (cleanLinkedin) form.append("linkedinUrl", cleanLinkedin);
  return form;
}

/**
 * A failed submit → what the page should do: show the "already applied" or
 * "closed" state, send the visitor to sign in again, or show the message inline
 * (on the resume field when it is about the resume).
 * @param {{status: number, error?: string|null, message?: string}} response
 */
export function submitFailure(response) {
  const message = response?.error || response?.message || "";
  const status = response?.status ?? 0;
  if (status === 409 && /already applied/i.test(message)) return { kind: "already_applied", message };
  if (status === 409) return { kind: "closed", message: message || "This job is no longer accepting applications." };
  if (status === 404) return { kind: "not_found", message };
  if (status === 401) return { kind: "signed_out", message: "Your session has expired. Sign in again to apply." };
  if (status === 413) return { kind: "invalid", field: "resume", message: "That file is over 5 MB. Upload a smaller PDF or DOCX." };
  if (status === 429) return { kind: "invalid", message: "You've sent a lot of applications in a short time. Wait a minute and try again." };
  if (status === 400) return { kind: "invalid", field: /resume|file/i.test(message) ? "resume" : undefined, message: message || "Please check the form and try again." };
  return { kind: "error", message: "Something went wrong sending your application. Please try again." };
}
