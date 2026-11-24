"use client";

import { useId, useRef, useState } from "react";
import { FileText, Upload, X } from "lucide-react";
import clsx from "clsx";
import { ACCEPT, extractText } from "@/features/ats/extract.js";
import { Field, FormError, fieldClass } from "@/features/jobs/components/AccountFlow.jsx";
import { primaryButton } from "@/features/jobs/components/ui.jsx";
import { Busy } from "@/components/site/ui/Spinner";
import { EVENTS, trackEvent } from "@/lib/analytics";
import {
  YES_NO,
  buildApplicationFormData,
  cleanAnswers,
  hasErrors,
  resumeFileError,
  submitFailure,
  validateApplication,
} from "../form.js";
import { submitApplication } from "../services/applyService.js";

/**
 * The signed-in application: resume, optional phone and LinkedIn, and the
 * company's screening questions. Calls back with what the page should switch
 * to (submitted, already applied, closed, signed out); field problems stay here.
 */
export function ApplicationForm({ job, utm, analytics, onStart, onDone }) {
  const [useProfileResume, setUseProfileResume] = useState(!!job.hasProfileResume);
  const [resume, setResume] = useState(null);
  const [answers, setAnswers] = useState({});
  const [phone, setPhone] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [errors, setErrors] = useState({ answers: {} });
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  // Text read from the chosen file in the browser, sent as resumeText. Keyed by the file so a quick swap can't mix them up.
  const extraction = useRef({ file: null, promise: null });
  const formRef = useRef(null);
  const questions = job.screeningQuestions ?? [];

  const startedRef = useRef(false);
  const start = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    onStart?.();
  };

  const clearError = (key) => setErrors((e) => ({ ...e, [key]: undefined }));
  const setAnswer = (id, value) => {
    setAnswers((a) => ({ ...a, [id]: value }));
    setErrors((e) => ({ ...e, answers: { ...e.answers, [id]: undefined } }));
  };

  const pickFile = (file) => {
    if (!file) return;
    start();
    const error = resumeFileError(file);
    if (error) {
      setResume(null);
      extraction.current = { file: null, promise: null };
      setErrors((e) => ({ ...e, resume: error }));
      return;
    }
    clearError("resume");
    setResume(file);
    // A scan or an unusual PDF yields no text; the file still goes, the backend just gets no resumeText.
    extraction.current = { file, promise: extractText(file).catch(() => "") };
  };

  const submit = async (event) => {
    event.preventDefault();
    if (submitting) return;
    start();
    setFormError(null);
    const found = validateApplication({ questions, answers, useProfileResume, resume, phone, linkedinUrl });
    setErrors(found);
    if (hasErrors(found)) {
      trackEvent(EVENTS.companyJobApplyFailed, { ...analytics, reason: "validation" });
      // Bring the first problem into view.
      requestAnimationFrame(() => formRef.current?.querySelector("[aria-invalid='true'], [data-invalid='true']")?.focus());
      return;
    }

    setSubmitting(true);
    try {
      const file = useProfileResume ? null : resume;
      const resumeText = file && extraction.current.file === file ? await extraction.current.promise : "";
      const body = buildApplicationFormData({
        jobId: job.id,
        answers: cleanAnswers(questions, answers),
        utm,
        resume: file,
        resumeText,
        phone,
        linkedinUrl,
      });
      const response = await submitApplication(body);
      if (response.success && response.data?.applicationId) {
        trackEvent(EVENTS.companyJobApplySucceeded, { ...analytics, profile_resume: !file, questions: questions.length });
        onDone({ kind: "submitted", data: response.data });
        return;
      }
      const failure = submitFailure(response);
      trackEvent(EVENTS.companyJobApplyFailed, { ...analytics, reason: failure.kind, status: response.status });
      if (failure.kind === "invalid" && failure.field) setErrors((e) => ({ ...e, [failure.field]: failure.message }));
      else if (failure.kind === "invalid" || failure.kind === "error") setFormError(failure.message);
      else onDone(failure);
    } catch {
      trackEvent(EVENTS.companyJobApplyFailed, { ...analytics, reason: "network" });
      setFormError("We couldn't reach HireDue. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={submit} onFocus={start} noValidate className="flex flex-col gap-5">
      <ResumeField
        hasProfileResume={!!job.hasProfileResume}
        useProfileResume={useProfileResume}
        onUseProfile={(value) => {
          start();
          setUseProfileResume(value);
          clearError("resume");
        }}
        resume={resume}
        onPick={pickFile}
        onClear={() => {
          setResume(null);
          extraction.current = { file: null, promise: null };
        }}
        error={errors.resume}
      />

      <Field label={<Optional>Phone</Optional>} error={errors.phone}>
        <input
          className={fieldClass}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+91 98765 43210"
          value={phone}
          maxLength={20}
          aria-invalid={errors.phone ? "true" : undefined}
          onChange={(e) => {
            setPhone(e.target.value);
            clearError("phone");
          }}
        />
      </Field>

      <Field label={<Optional>LinkedIn profile</Optional>} error={errors.linkedinUrl}>
        <input
          className={fieldClass}
          type="url"
          inputMode="url"
          autoComplete="url"
          placeholder="linkedin.com/in/your-name"
          value={linkedinUrl}
          maxLength={300}
          aria-invalid={errors.linkedinUrl ? "true" : undefined}
          onChange={(e) => {
            setLinkedinUrl(e.target.value);
            clearError("linkedinUrl");
          }}
        />
      </Field>

      {questions.length > 0 && (
        <div className="flex flex-col gap-5 border-t border-line pt-5">
          <p className="text-[13px] leading-none font-semibold tracking-[0.03em] text-dim uppercase">Questions from {job.company?.name || "the company"}</p>
          {questions.map((question) => (
            <Question
              key={question.id}
              question={question}
              value={answers[question.id] ?? ""}
              onChange={(value) => setAnswer(question.id, value)}
              error={errors.answers?.[question.id]}
            />
          ))}
        </div>
      )}

      <FormError>{formError}</FormError>

      <button type="submit" disabled={submitting} className={clsx(primaryButton, "h-12 w-full text-[15px]")}>
        <Busy busy={submitting} label="Sending application…">
          Submit application
        </Busy>
      </button>
      <p className="text-center text-[12.5px] leading-[1.45] text-dim">
        Your resume, answers and HireDue profile are shared with {job.company?.name || "the company"} for this role.
      </p>
    </form>
  );
}

function Optional({ children }) {
  return (
    <>
      {children} <span className="font-medium text-dim">(optional)</span>
    </>
  );
}

function Required({ children, required }) {
  return (
    <>
      {children}
      {required && (
        <span className="text-danger" aria-hidden>
          {" "}*
        </span>
      )}
      {required && <span className="sr-only"> (required)</span>}
    </>
  );
}

function ResumeField({ hasProfileResume, useProfileResume, onUseProfile, resume, onPick, onClear, error }) {
  const inputId = useId();
  const errorId = useId();
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const upload = (
    <div className="flex flex-col gap-1.5">
      {resume ? (
        <div className="flex items-center gap-3 rounded-[14px] border border-line bg-white px-4 py-3">
          <FileText size={18} className="shrink-0 text-brand" aria-hidden />
          <span className="min-w-0 flex-1 truncate text-[14.5px] font-medium text-ink">{resume.name}</span>
          <button
            type="button"
            onClick={() => {
              onClear();
              if (inputRef.current) inputRef.current.value = "";
            }}
            aria-label="Remove file"
            className="grid size-8 shrink-0 place-items-center rounded-full text-dim hover:bg-surface"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <label
          htmlFor={inputId}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            onPick(e.dataTransfer.files?.[0]);
          }}
          className={clsx(
            "flex cursor-pointer flex-col items-center gap-1.5 rounded-[14px] border border-dashed px-4 py-6 text-center transition-colors",
            dragging ? "border-brand bg-ice/60" : error ? "border-danger/60" : "border-line hover:border-brand/60 hover:bg-surface/60",
          )}
        >
          <Upload size={20} className="text-brand" aria-hidden />
          <span className="text-[14.5px] font-semibold text-ink">Upload your resume</span>
          <span className="text-[13px] text-dim">PDF or DOCX, up to 5 MB</span>
        </label>
      )}
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={ACCEPT}
        className="sr-only"
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? errorId : undefined}
        onChange={(e) => onPick(e.target.files?.[0])}
      />
    </div>
  );

  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-1.5 text-[14px] font-semibold text-ink">
        <Required required>Resume</Required>
      </legend>
      {hasProfileResume ? (
        <>
          <Choice name={`${inputId}-resume`} checked={useProfileResume} onChange={() => onUseProfile(true)}>
            Use my HireDue resume
            <span className="block text-[13px] font-normal text-dim">The one saved on your HireDue profile</span>
          </Choice>
          <Choice name={`${inputId}-resume`} checked={!useProfileResume} onChange={() => onUseProfile(false)}>
            Upload a different resume
          </Choice>
          {!useProfileResume && upload}
        </>
      ) : (
        upload
      )}
      {error && (
        <span id={errorId} className="text-[13px] text-danger">
          {error}
        </span>
      )}
    </fieldset>
  );
}

/** A radio as a bordered row; the whole row is the target, which suits a thumb. */
function Choice({ name, checked, onChange, children, invalid }) {
  return (
    <label
      className={clsx(
        "flex cursor-pointer items-start gap-3 rounded-[14px] border px-4 py-3 text-[14.5px] font-medium text-ink transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand/40",
        checked ? "border-brand bg-ice/50" : "border-line hover:border-dim/50",
      )}
    >
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onChange}
        // aria-invalid isn't valid on a radio; the group's error text is linked from the fieldset. This marks where focus goes.
        data-invalid={invalid ? "true" : undefined}
        className="mt-0.5 size-[18px] shrink-0 accent-[var(--color-brand)]"
      />
      <span className="min-w-0 flex-1">{children}</span>
    </label>
  );
}

function Question({ question, value, onChange, error }) {
  const id = useId();
  const label = <Required required={question.required}>{question.question}</Required>;
  const invalid = error ? "true" : undefined;

  if (question.type === "yes_no" || question.type === "choice") {
    const options = question.type === "yes_no" ? YES_NO : (question.options ?? []).map((o) => ({ value: o, label: o }));
    return (
      <fieldset className="flex flex-col gap-2" aria-describedby={error ? `${id}-error` : undefined}>
        <legend className="mb-1.5 text-[14px] font-semibold text-ink">{label}</legend>
        <div className={clsx("grid gap-2", question.type === "yes_no" && "grid-cols-2")}>
          {options.map((option, index) => (
            <Choice
              key={option.value}
              name={id}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              // The first radio carries the invalid flag so focus can land on the group.
              invalid={index === 0 ? invalid : undefined}
            >
              {option.label}
            </Choice>
          ))}
        </div>
        {error && (
          <span id={`${id}-error`} className="text-[13px] text-danger">
            {error}
          </span>
        )}
      </fieldset>
    );
  }

  return (
    <Field label={label} error={error}>
      {question.type === "number" ? (
        <input
          className={fieldClass}
          type="text"
          inputMode="decimal"
          value={value}
          aria-invalid={invalid}
          maxLength={20}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <textarea
          className={clsx(fieldClass, "h-auto min-h-[88px] resize-y py-3 leading-[1.5]")}
          rows={3}
          value={value}
          aria-invalid={invalid}
          maxLength={2000}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </Field>
  );
}
