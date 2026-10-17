"use client";

import { useCallback, useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import { useAuth } from "@/features/auth/context/AuthContext.jsx";
import { jobFormErrors } from "@/features/ats/hooks/useAtsChecker.js";
import { EVENTS, trackEvent } from "@/lib/analytics";
import { startApplyTimer } from "../applyTimer.js";
import { getApplyLink, getJob } from "../services/jobBoardService.js";
import { TailorHere } from "./TailorHere.jsx";
import { Dialog, primaryButton, secondaryButton } from "./ui.jsx";

/**
 * Driven by `?apply=<id>` in the URL. Signed-out visitors never open it — the
 * board sends them to sign-up with this URL as the redirect — so sign-up lands
 * them back here with the link unlocked.
 *
 * The last stop before the employer's page, so it asks once for the resume:
 * dropping it here tailors it to this posting on the spot, and the plain link
 * out is a quiet one that also starts the apply timer. `tailored` (from
 * `?tailored=1`, set by the ATS checker's "Continue to application") skips the
 * ask, as does a posting with no description to tailor against.
 */
export function ApplyDialog({ jobId, onClose, path = "desktop", tailored = false }) {
  const { isAuthenticated, isLoading } = useAuth();

  // Reached signed out (a shared link, or Back from the sign-up page): drop the
  // param rather than bounce to sign-up again, which would trap the Back button.
  const signedOut = !!jobId && !isLoading && !isAuthenticated;
  useEffect(() => {
    if (signedOut) onClose();
  }, [signedOut, onClose]);

  return (
    <Dialog open={!!jobId && !signedOut} onClose={onClose} labelledBy="apply-dialog-title" size="lg">
      <div className="flex flex-col gap-5 p-6 pt-7">
        {isLoading ? <Pending label="One moment…" /> : <UnlockedApply jobId={jobId} path={path} tailored={tailored} />}
      </div>
    </Dialog>
  );
}

function UnlockedApply({ jobId, path, tailored }) {
  const [state, setState] = useState({ status: "loading", data: null, error: null });
  // The full posting, for the description tailoring works from; the apply link alone does not carry it.
  const [detail, setDetail] = useState(null);
  const [tailoredHere, setTailoredHere] = useState(false);
  useEffect(() => {
    let cancelled = false;
    setDetail(null);
    setTailoredHere(false);
    getJob(jobId)
      .then((response) => !cancelled && response.success && response.data && setDetail(response.data))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [jobId]);
  const onTailored = useCallback(() => setTailoredHere(true), []);

  const load = useCallback(async () => {
    setState({ status: "loading", data: null, error: null });
    try {
      const response = await getApplyLink(jobId);
      if (response.success && response.data?.applyUrl) {
        setState({ status: "ready", data: response.data, error: null });
      } else {
        setState({
          status: "error",
          data: null,
          error:
            response.status === 404
              ? "This job doesn't have an application link any more."
              : response.error || "We couldn't get the application link.",
        });
      }
    } catch {
      setState({ status: "error", data: null, error: "We couldn't get the application link." });
    }
  }, [jobId]);

  useEffect(() => {
    load();
  }, [load]);

  if (state.status === "loading") return <Pending label="Getting your application link…" />;

  if (state.status === "error") {
    return (
      <>
        <h2 id="apply-dialog-title" className="t-h5 pr-8">
          Something went wrong
        </h2>
        <p className="t-body">{state.error}</p>
        <button type="button" onClick={load} className={`${secondaryButton} h-12`}>
          Try again
        </button>
      </>
    );
  }

  const job = state.data;
  // A hiring post with no separate job link sends people to the post itself.
  const isPost = /linkedin\.com\/(posts|feed\/update)\//i.test(job.applyUrl);
  // The clock starts when the employer's page opens; the return screen reads it when this tab is visible again.
  const openEmployer = () => {
    startApplyTimer(jobId);
    trackEvent(EVENTS.jobManualApplyStarted, { job_id: String(jobId), path, tailored: tailored || tailoredHere, post: isPost });
  };
  const tailorJob = detail && { title: detail.jobTitle ?? "", company: detail.hiringCompany ?? "", description: detail.description ?? "" };
  // A posting too thin to tailor against gets the plain link; asking for a resume we cannot use would be a dead end.
  const canTailor = tailorJob && Object.keys(jobFormErrors(tailorJob)).length === 0;
  const external = (
    <a href={job.applyUrl} target="_blank" rel="noopener noreferrer" onClick={openEmployer} className={`${primaryButton} h-12`}>
      {isPost ? "Open LinkedIn post" : "Continue to application"} <ExternalLink size={16} aria-hidden />
    </a>
  );
  return (
    <>
      <div className="flex flex-col gap-2 pr-8">
        <p className="text-[13px] leading-none font-medium tracking-[0.03em] text-brand uppercase">
          {isPost ? "Hiring post" : "Ready to apply"}
        </p>
        <h2 id="apply-dialog-title" className="t-h5">
          {job.jobTitle}
        </h2>
        {job.hiringCompany && <p className="t-body">{job.hiringCompany}</p>}
      </div>

      {!job.isActive && (
        <p className="rounded-[12px] bg-danger-05 px-4 py-3 text-[14px] text-danger">
          This posting is more than 30 days old and may have closed.
        </p>
      )}

      {isPost || tailored || (detail && !canTailor) ? (
        external
      ) : (
        <>
          <div className="flex flex-col gap-3 rounded-[15px] bg-ice/60 p-4">
            {!tailoredHere && (
              <>
                <p className="text-[16px] font-semibold text-ink">Tailored resumes get 3x more responses</p>
                <p className="text-[14px] leading-[1.5] text-dim">
                  Drop your resume. We rewrite it for the {job.jobTitle} role{job.hiringCompany ? ` at ${job.hiringCompany}` : ""} and
                  hand you the PDF in 60 seconds.
                </p>
              </>
            )}
            {canTailor ? <TailorHere job={tailorJob} onDone={onTailored} /> : <Pending label="Reading the posting…" />}
          </div>
          {tailoredHere ? (
            external
          ) : (
            // Quiet on purpose, but a real link: people who want the form now should get it on one click.
            <a
              href={job.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={openEmployer}
              className="inline-flex items-center justify-center gap-1.5 self-center py-1 text-[14px] font-medium text-dim underline-offset-4 transition-colors hover:text-ink hover:underline"
            >
              Apply without optimizing <ExternalLink size={14} aria-hidden />
            </a>
          )}
        </>
      )}
    </>
  );
}

function Pending({ label }) {
  return (
    <div className="flex items-center gap-3 py-6" role="status">
      <span className="size-5 animate-spin rounded-full border-2 border-line border-t-brand" aria-hidden />
      <span id="apply-dialog-title" className="t-body">
        {label}
      </span>
    </div>
  );
}
