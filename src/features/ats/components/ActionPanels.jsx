"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { ArrowRight, Lock, Sparkles, Target } from "lucide-react";
import clsx from "clsx";
import { Field, fieldClass } from "@/features/jobs/components/AccountFlow.jsx";
import { primaryButton } from "@/features/jobs/components/ui.jsx";
import { atsChecker } from "@/lib/content";
import { MAX_JOB_CHARS } from "../services/atsService.js";
import { jobFormErrors } from "../hooks/useAtsChecker.js";
import { ChangeList, Progress, ResumePreview, RunError, UnchangedResult } from "./Results.jsx";
import { ScoreDelta } from "./Score.jsx";

const copy = atsChecker.tabs;

/**
 * The button that runs an AI action. Signed out, the lock sits on the button
 * itself and the note is tied to it, so the account step is no surprise.
 */
function GatedButton({ signedIn, onClick, children, icon: Icon, type = "button" }) {
  const noteId = useId();
  const ButtonIcon = signedIn ? Icon : Lock;
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type={type}
        onClick={onClick}
        aria-describedby={signedIn ? undefined : noteId}
        className={clsx(primaryButton, "h-12 px-7 text-[15px]")}
      >
        <ButtonIcon size={17} aria-hidden />
        {children}
      </button>
      {!signedIn && (
        <span id={noteId} className="text-[13px] font-medium text-dim">
          Needs a free account — your score stays free
        </span>
      )}
    </div>
  );
}

function PanelIntro({ title, body }) {
  return (
    <div className="flex flex-col gap-1.5">
      <h3 className="t-h5">{title}</h3>
      <p className="t-body">{body}</p>
    </div>
  );
}

export function OptimizePanel({ state, signedIn, fileName, bytes, onRun }) {
  const { status, stage, result, error } = state;
  const run = () => onRun("optimize");
  return (
    <div className="flex flex-col gap-6">
      <PanelIntro title={copy.optimize.title} body={copy.optimize.body} />
      {status === "running" ? (
        <Progress stages={atsChecker.stages.optimize} current={stage} />
      ) : (
        <>
          {status === "error" && <RunError error={error} onRetry={run} />}
          {status !== "done" && (
            <GatedButton signedIn={signedIn} onClick={run} icon={Sparkles}>
              {copy.optimize.cta}
            </GatedButton>
          )}
        </>
      )}
      {status === "done" && result?.unchanged && (
        <div className="flex flex-col gap-6">
          <UnchangedResult
            title={`Your resume is already well optimized (ATS score ${result.score.before.overall})`}
            detail="None of the changes we tried would raise your score, so we've kept your resume exactly as it is."
            result={result}
            bytes={bytes}
            fileName={fileName}
            action="optimize"
          />
          <button type="button" onClick={run} className="self-start text-[14px] font-semibold text-brand hover:underline">
            Try again
          </button>
        </div>
      )}
      {status === "done" && result && !result.unchanged && (
        <div className="flex flex-col gap-6">
          <ScoreDelta
            label="ATS score"
            before={result.score.before.overall}
            after={result.score.after.overall}
            detail={`${result.changes.length} change${result.changes.length === 1 ? "" : "s"} made. Your original file is untouched.`}
          />
          <ResumePreview resume={result.resume} text={result.text} fileName={fileName} suffix="optimized" label="Optimized resume" action="optimize" />
          <ChangeList original={result.original} text={result.text} changes={result.changes} refusedCount={result.refused.length} droppedCount={result.dropped?.length ?? 0} />
          <button type="button" onClick={run} className="self-start text-[14px] font-semibold text-brand hover:underline">
            Run it again
          </button>
        </div>
      )}
    </div>
  );
}

export function TailorPanel({ state, signedIn, fileName, bytes, job, onJobChange, onRun, onEdit, continueHref = null }) {
  const { status, stage, result, error } = state;
  const [touched, setTouched] = useState(false);
  const errors = jobFormErrors(job);
  const showErrors = touched ? errors : {};
  const countId = useId();
  const set = (key) => (event) => onJobChange({ ...job, [key]: event.target.value });

  const run = (event) => {
    event?.preventDefault();
    setTouched(true);
    if (Object.keys(errors).length) {
      // Put the visitor on the first field to fix.
      document.getElementById(errors.title ? "ats-job-title" : "ats-job-description")?.focus();
      return;
    }
    onRun("tailor");
  };

  return (
    <div className="flex flex-col gap-6">
      <PanelIntro title={copy.tailor.title} body={copy.tailor.body} />
      {status === "running" ? (
        <Progress stages={atsChecker.stages.tailor} current={stage} />
      ) : status === "done" && result?.unchanged ? (
        <div className="flex flex-col gap-6">
          <UnchangedResult
            title={`Your resume already fits ${job.title.trim() || "this job"} well`}
            detail={`It matches ${result.match.before.percent}% of the job's keywords with an ATS score of ${result.score.before.overall}. None of the changes we tried would raise your match without lowering your ATS score, so we've kept it exactly as it is.`}
            result={result}
            bytes={bytes}
            fileName={fileName}
            action="tailor"
          />
          <KeywordChips keywords={result.match.before.keywords} before={result.match.before.keywords} />
          {continueHref && (
            <Link href={continueHref} className={clsx(primaryButton, "h-12 self-start px-6")}>
              Continue to application <ArrowRight size={16} aria-hidden />
            </Link>
          )}
          <button type="button" onClick={onEdit} className="self-start text-[14px] font-semibold text-brand hover:underline">
            Tailor to another job
          </button>
        </div>
      ) : status === "done" && result ? (
        <div className="flex flex-col gap-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <ScoreDelta
              label={`Match for ${job.title.trim() || "this job"}`}
              before={result.match.before.percent}
              after={result.match.after.percent}
              suffix="%"
              detail={`${result.match.after.covered} of ${result.match.after.total} job keywords on your resume, up from ${result.match.before.covered}.`}
            />
            <ScoreDelta label="ATS score" before={result.score.before.overall} after={result.score.after.overall} />
          </div>
          <KeywordChips keywords={result.match.after.keywords} before={result.match.before.keywords} />
          {result.partial && <p className="t-body-sm">Part of the tailoring didn&apos;t finish this time. Run it again for a fuller result.</p>}
          <ResumePreview
            resume={result.resume}
            text={result.text}
            fileName={fileName}
            suffix={`tailored for ${job.title.trim() || "job"}`.replace(/[\\/:*?"<>|]+/g, " ")}
            label={`Tailored for ${job.title.trim() || "this job"}`}
            action="tailor"
          />
          <ChangeList original={result.original} text={result.text} changes={result.changes} refusedCount={result.refused.length} droppedCount={result.dropped?.length ?? 0} />
          {continueHref && (
            // Came from a job's apply dialog: the tailored PDF is above, and this is the way on to the employer's form.
            <Link href={continueHref} className={clsx(primaryButton, "h-12 self-start px-6")}>
              Continue to application <ArrowRight size={16} aria-hidden />
            </Link>
          )}
          <button type="button" onClick={onEdit} className="self-start text-[14px] font-semibold text-brand hover:underline">
            Tailor to another job
          </button>
        </div>
      ) : (
        <form onSubmit={run} noValidate className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Job title" error={showErrors.title}>
              <input id="ats-job-title" className={fieldClass} value={job.title} onChange={set("title")} placeholder="e.g. Senior Frontend Engineer" aria-invalid={!!showErrors.title} required />
            </Field>
            <Field label="Company (optional)">
              <input className={fieldClass} value={job.company} onChange={set("company")} placeholder="e.g. Razorpay" autoComplete="organization" />
            </Field>
          </div>
          <Field label="Job description" error={showErrors.description}>
            <textarea
              id="ats-job-description"
              className={clsx(fieldClass, "h-auto min-h-[180px] resize-y py-3 leading-[1.5]")}
              value={job.description}
              onChange={set("description")}
              maxLength={MAX_JOB_CHARS}
              placeholder="Paste the full job description: responsibilities, requirements, nice-to-haves."
              aria-invalid={!!showErrors.description}
              aria-describedby={countId}
              required
            />
          </Field>
          <p id={countId} className="-mt-2 text-right text-[12.5px] text-dim tabular-nums">
            {job.description.length.toLocaleString()} / {MAX_JOB_CHARS.toLocaleString()}
          </p>
          {status === "error" && <RunError error={error} onRetry={run} />}
          <GatedButton type="submit" signedIn={signedIn} icon={Target}>
            {copy.tailor.cta}
          </GatedButton>
        </form>
      )}
    </div>
  );
}

function KeywordChips({ keywords, before }) {
  const was = new Map(before.map((k) => [k.term, k.covered]));
  const groups = [
    { label: "Added", tone: "bg-success-10 text-success", items: keywords.filter((k) => k.covered && !was.get(k.term)) },
    { label: "Already there", tone: "bg-surface text-ink", items: keywords.filter((k) => k.covered && was.get(k.term)) },
    { label: "Still missing", tone: "border border-line bg-white text-dim", items: keywords.filter((k) => !k.covered) },
  ].filter((g) => g.items.length);
  return (
    <div className="flex flex-col gap-4">
      {groups.map((group) => (
        <div key={group.label} className="flex flex-col gap-2">
          <h4 className="text-[14px] font-semibold text-ink">
            {group.label} ({group.items.length})
          </h4>
          <ul className="flex flex-wrap gap-2">
            {group.items.map((k) => (
              <li key={k.term} className={clsx("rounded-full px-3 py-1.5 text-[13px] font-semibold", group.tone)}>
                {k.term}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
