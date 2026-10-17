"use client";

import { useEffect, useRef, useState } from "react";
import { Progress, ResumePreview, RunError, UnchangedResult } from "@/features/ats/components/Results.jsx";
import { ResumeDropzone } from "@/features/ats/components/ResumeDropzone.jsx";
import { ScoreDelta } from "@/features/ats/components/Score.jsx";
import { toAtsError } from "@/features/ats/errors.js";
import { extractText } from "@/features/ats/extract.js";
import { tailorResume } from "@/features/ats/services/atsService.js";
import { EVENTS, trackEvent } from "@/lib/analytics";
import { atsChecker } from "@/lib/content";

const IDLE = { status: "idle", stage: null, result: null, error: null, fileName: "", bytes: null };

/**
 * Tailoring inside the apply dialog: drop a resume, it is rewritten for this
 * posting, the PDF is offered, and `onDone` lets the dialog turn its quiet
 * "apply anyway" link into the main button. One drop is the whole action;
 * there is no second button to press. The visitor is signed in, since the
 * apply dialog only opens signed in, so no sign-up detour is needed here.
 *
 * `job` is {title, company, description}; the caller only renders this when
 * the description is long enough to tailor against.
 */
export function TailorHere({ job, onDone }) {
  const [state, setState] = useState(IDLE);
  // A newer drop makes an older run's answer moot.
  const runId = useRef(0);

  useEffect(() => {
    if (state.status === "done") onDone?.(state.result);
    // onDone is a stable callback from the dialog; re-running on its identity would re-fire.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.status]);

  const run = async (file) => {
    const id = ++runId.current;
    setState({ ...IDLE, status: "parsing", fileName: file.name });
    trackEvent(EVENTS.jobOptimizeClicked, { from: "apply_dialog" });
    try {
      const text = await extractText(file);
      // Kept in memory to show the PDF as it is if tailoring wouldn't improve it.
      const bytes = /\.pdf$/i.test(file.name) ? new Uint8Array(await file.arrayBuffer()) : null;
      if (id !== runId.current) return;
      trackEvent(EVENTS.atsActionRequested, { action: "tailor", signed_in: true, from: "apply_dialog" });
      setState({ ...IDLE, status: "running", stage: "analyzing", fileName: file.name });
      const onStage = (stage) => id === runId.current && setState((s) => ({ ...s, stage }));
      const result = await tailorResume(text, job, { onStage });
      if (id !== runId.current) return;
      trackEvent(EVENTS.atsActionCompleted, {
        action: "tailor",
        from: "apply_dialog",
        match_before: result.match?.before?.percent,
        match_after: result.match?.after?.percent,
        changes: result.changes?.length,
        partial: Boolean(result.partial),
        unchanged: Boolean(result.unchanged),
      });
      setState({ status: "done", stage: null, result, error: null, fileName: file.name, bytes });
    } catch (err) {
      if (id !== runId.current) return;
      const error = toAtsError(err);
      trackEvent(EVENTS.atsActionFailed, { action: "tailor", from: "apply_dialog", code: error.code });
      setState({ ...IDLE, status: "error", error, fileName: file.name });
    }
  };

  if (state.status === "running") return <Progress stages={atsChecker.stages.tailor} current={state.stage} />;

  if (state.status === "error") return <RunError error={state.error} onRetry={() => setState(IDLE)} />;

  if (state.status === "done") {
    const { result, fileName, bytes } = state;
    if (result.unchanged) {
      return (
        <UnchangedResult
          title={`Your resume already fits ${job.title.trim() || "this job"} well`}
          detail={`It matches ${result.match.before.percent}% of the posting's keywords with an ATS score of ${result.score.before.overall}. None of the changes we tried would raise your match without lowering your ATS score, so send it as it is.`}
          result={result}
          bytes={bytes}
          fileName={fileName}
          action="tailor"
        />
      );
    }
    return (
      <div className="flex flex-col gap-4">
        <ScoreDelta
          label={`Match for ${job.title.trim() || "this job"}`}
          before={result.match.before.percent}
          after={result.match.after.percent}
          suffix="%"
          detail={`${result.match.after.covered} of ${result.match.after.total} job keywords on your resume, up from ${result.match.before.covered}.`}
        />
        {result.partial && <p className="t-body-sm">Part of the tailoring didn&apos;t finish this time. The resume below still has the changes that did.</p>}
        <ResumePreview
          resume={result.resume}
          text={result.text}
          fileName={fileName}
          suffix={`tailored for ${job.title.trim() || "job"}`.replace(/[\\/:*?"<>|]+/g, " ")}
          label={`Tailored for ${job.title.trim() || "this job"}`}
          action="tailor"
        />
      </div>
    );
  }

  return (
    <ResumeDropzone
      parsing={state.status === "parsing"}
      error={null}
      onFile={run}
      privacyNote="We keep only the text of your resume, never the file, and only to write this version."
    />
  );
}
