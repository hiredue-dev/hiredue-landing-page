import { describe, expect, it } from "vitest";
import {
  answerError,
  buildApplicationFormData,
  cleanAnswers,
  hasErrors,
  linkedinError,
  MAX_RESUME_TEXT,
  normalizeLinkedin,
  phoneError,
  submitFailure,
  validateAnswers,
  validateApplication,
} from "./form.js";

const QUESTIONS = [
  { id: "q1", question: "Notice period in days?", type: "number", options: [], required: true },
  { id: "q2", question: "Can you relocate?", type: "yes_no", options: [], required: true },
  { id: "q3", question: "Preferred stack", type: "choice", options: ["React", "Vue"], required: false },
  { id: "q4", question: "Anything else?", type: "text", options: [], required: false },
];

const pdf = (size = 1000, name = "cv.pdf") => new File([new Uint8Array(size)], name, { type: "application/pdf" });

describe("answerError", () => {
  it("requires required questions", () => {
    expect(answerError(QUESTIONS[0], "")).toMatch(/required/);
    expect(answerError(QUESTIONS[0], "   ")).toMatch(/required/);
    expect(answerError(QUESTIONS[3], "")).toBeNull();
  });

  it("checks each type", () => {
    expect(answerError(QUESTIONS[0], "30")).toBeNull();
    expect(answerError(QUESTIONS[0], "1.5")).toBeNull();
    expect(answerError(QUESTIONS[0], "thirty")).toMatch(/number/);
    expect(answerError(QUESTIONS[1], "yes")).toBeNull();
    expect(answerError(QUESTIONS[1], "maybe")).toMatch(/Yes or No/);
    expect(answerError(QUESTIONS[2], "React")).toBeNull();
    expect(answerError(QUESTIONS[2], "Angular")).toMatch(/options/);
    expect(answerError(QUESTIONS[3], "x".repeat(2001))).toMatch(/under/);
  });
});

describe("validateAnswers / cleanAnswers", () => {
  it("lists only the questions with a problem", () => {
    expect(validateAnswers(QUESTIONS, { q1: "abc", q3: "Vue" })).toEqual({ q1: "Enter a number.", q2: "This question is required." });
    expect(validateAnswers(QUESTIONS, { q1: "30", q2: "no" })).toEqual({});
  });

  it("trims, drops blanks and unknown ids", () => {
    expect(cleanAnswers(QUESTIONS, { q1: " 30 ", q2: "yes", q4: "  ", stray: "x" })).toEqual({ q1: "30", q2: "yes" });
  });
});

describe("contact fields", () => {
  it("accepts empty or plausible phone numbers", () => {
    expect(phoneError("")).toBeNull();
    expect(phoneError("+91 98765 43210")).toBeNull();
    expect(phoneError("(555) 123-4567")).toBeNull();
    expect(phoneError("123")).toMatch(/valid/);
    expect(phoneError("call me")).toMatch(/valid/);
  });

  it("accepts LinkedIn URLs with or without the scheme", () => {
    expect(normalizeLinkedin("linkedin.com/in/jane")).toBe("https://linkedin.com/in/jane");
    expect(normalizeLinkedin("  ")).toBe("");
    expect(linkedinError("")).toBeNull();
    expect(linkedinError("https://www.linkedin.com/in/jane")).toBeNull();
    expect(linkedinError("in.linkedin.com/in/jane")).toBeNull();
    expect(linkedinError("https://evil.com/linkedin.com")).toMatch(/LinkedIn/);
    expect(linkedinError("notlinkedin.com/in/x")).toMatch(/LinkedIn/);
  });
});

describe("validateApplication", () => {
  const base = { questions: QUESTIONS, answers: { q1: "30", q2: "yes" }, useProfileResume: true, resume: null, phone: "", linkedinUrl: "" };

  it("passes with the profile resume", () => {
    expect(hasErrors(validateApplication(base))).toBe(false);
  });

  it("needs a file when not using the profile resume", () => {
    const errors = validateApplication({ ...base, useProfileResume: false });
    expect(errors.resume).toMatch(/Upload your resume/);
    expect(hasErrors(errors)).toBe(true);
  });

  it("rejects files over 5 MB and wrong types", () => {
    expect(validateApplication({ ...base, useProfileResume: false, resume: pdf(5 * 1024 * 1024 + 1) }).resume).toMatch(/5 MB/);
    const txt = new File(["hi"], "cv.txt", { type: "text/plain" });
    expect(validateApplication({ ...base, useProfileResume: false, resume: txt }).resume).toMatch(/PDF or DOCX/);
    expect(validateApplication({ ...base, useProfileResume: false, resume: pdf() }).resume).toBeUndefined();
  });

  it("collects answer and contact errors together", () => {
    const errors = validateApplication({ ...base, answers: {}, phone: "12", linkedinUrl: "x.com" });
    expect(Object.keys(errors.answers)).toEqual(["q1", "q2"]);
    expect(errors.phone).toBeTruthy();
    expect(errors.linkedinUrl).toBeTruthy();
  });
});

describe("buildApplicationFormData", () => {
  it("sends answers and utm as JSON strings and leaves empty optionals out", () => {
    const form = buildApplicationFormData({ jobId: "job-1", answers: { q1: "30" }, utm: { source: "linkedin" } });
    expect(form.get("jobId")).toBe("job-1");
    expect(JSON.parse(form.get("answers"))).toEqual({ q1: "30" });
    expect(JSON.parse(form.get("utm"))).toEqual({ source: "linkedin" });
    for (const key of ["resume", "resumeText", "phone", "linkedinUrl"]) expect(form.has(key)).toBe(false);
  });

  it("sends {} for missing utm", () => {
    expect(buildApplicationFormData({ jobId: "j" }).get("utm")).toBe("{}");
  });

  it("attaches the file with its text (capped), phone and normalised LinkedIn", () => {
    const file = pdf(10, "Jane CV.pdf");
    const form = buildApplicationFormData({
      jobId: "j",
      resume: file,
      resumeText: "x".repeat(MAX_RESUME_TEXT + 50),
      phone: " +91 98765 43210 ",
      linkedinUrl: "linkedin.com/in/jane",
    });
    expect(form.get("resume").name).toBe("Jane CV.pdf");
    expect(form.get("resumeText")).toHaveLength(MAX_RESUME_TEXT);
    expect(form.get("phone")).toBe("+91 98765 43210");
    expect(form.get("linkedinUrl")).toBe("https://linkedin.com/in/jane");
  });

  it("never sends resumeText without a file", () => {
    expect(buildApplicationFormData({ jobId: "j", resumeText: "text" }).has("resumeText")).toBe(false);
  });
});

describe("submitFailure", () => {
  it("tells already-applied from closed on 409", () => {
    expect(submitFailure({ status: 409, error: "You have already applied" }).kind).toBe("already_applied");
    expect(submitFailure({ status: 409, error: "This job is no longer accepting applications" }).kind).toBe("closed");
  });

  it("puts resume problems on the resume field", () => {
    expect(submitFailure({ status: 400, error: "A resume is required" })).toMatchObject({ kind: "invalid", field: "resume", message: "A resume is required" });
    expect(submitFailure({ status: 400, error: "Answer the required questions" })).toMatchObject({ kind: "invalid", field: undefined });
  });

  it("maps the rest", () => {
    expect(submitFailure({ status: 401 }).kind).toBe("signed_out");
    expect(submitFailure({ status: 404 }).kind).toBe("not_found");
    expect(submitFailure({ status: 429 }).kind).toBe("invalid");
    expect(submitFailure({ status: 500 }).kind).toBe("error");
  });
});
