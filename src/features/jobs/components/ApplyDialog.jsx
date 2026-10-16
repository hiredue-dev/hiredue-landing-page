"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ExternalLink, Sparkles } from "lucide-react";
import { useAuth } from "@/features/auth/context/AuthContext.jsx";
import { EVENTS, trackEvent } from "@/lib/analytics";
import { startApplyTimer } from "../applyTimer.js";
import { getApplyLink } from "../services/jobBoardService.js";
import { Dialog, primaryButton, secondaryButton } from "./ui.jsx";

/**
 * Driven by `?apply=<id>` in the URL. Signed-out visitors never open it — the
 * board sends them to sign-up with this URL as the redirect — so sign-up lands
 * them back here with the link unlocked.
 *
 * The last stop before the employer's page, so it asks once for the resume:
 * tailoring it to this posting is the primary action, and the plain link out is
 * a quiet one that also starts the apply timer. `tailored` (from `?tailored=1`,
 * set by the ATS checker's "Continue to application") skips the ask.
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
    <Dialog open={!!jobId && !signedOut} onClose={onClose} labelledBy="apply-dialog-title">
      <div className="flex flex-col gap-5 p-6 pt-7">
        {isLoading ? <Pending label="One moment…" /> : <UnlockedApply jobId={jobId} path={path} tailored={tailored} />}
      </div>
    </Dialog>
  );
}

function UnlockedApply({ jobId, path, tailored }) {
  const [state, setState] = useState({ status: "loading", data: null, error: null });

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
    trackEvent(EVENTS.jobManualApplyStarted, { job_id: String(jobId), path, tailored, post: isPost });
  };
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

      {isPost || tailored ? (
        external
      ) : (
        <>
          <div className="flex flex-col gap-3 rounded-[15px] bg-ice/60 p-4">
            <p className="text-[15px] font-semibold text-ink">Tailor your resume to this posting first</p>
            <p className="text-[14px] leading-[1.5] text-dim">
              A resume written for the posting gets past the screening software and in front of a person more often.
              Free, one click, about a minute. We keep only the text, never the file.
            </p>
            <Link
              href={`/ats-checker?job=${encodeURIComponent(jobId)}`}
              onClick={() => trackEvent(EVENTS.jobOptimizeClicked, { job_id: String(jobId), path })}
              className={`${primaryButton} h-12`}
            >
              <Sparkles size={16} aria-hidden /> Optimize my resume for this job
            </Link>
          </div>
          {/* Quiet on purpose, but a real link: people who want the form now should get it on one click. */}
          <a
            href={job.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={openEmployer}
            className="inline-flex items-center justify-center gap-1.5 self-center py-1 text-[14px] font-medium text-dim underline-offset-4 transition-colors hover:text-ink hover:underline"
          >
            Apply without optimizing <ExternalLink size={14} aria-hidden />
          </a>
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
