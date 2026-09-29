"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/context/AuthContext.jsx";
import { getJob } from "../services/jobBoardService.js";
import { AutomateLink, JobBadges, JobMeta } from "./JobCard.jsx";
import { CompanyLogo, Dialog, primaryButton } from "./ui.jsx";

/** Full posting. Opens instantly from the card's data; the description loads in behind it. */
export function JobDetailDialog({ job, onClose, onApply }) {
  const { isAuthenticated } = useAuth();
  const [detail, setDetail] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!job) return undefined;
    let cancelled = false;
    setDetail(null);
    setFailed(false);
    getJob(job.id)
      .then((response) => {
        if (cancelled) return;
        if (response.success) setDetail(response.data);
        else setFailed(true);
      })
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
    };
  }, [job]);

  const shown = detail ?? job;

  return (
    <Dialog open={!!job} onClose={onClose} labelledBy="job-detail-title" size="lg">
      {shown && (
        <>
          <div className="flex flex-col gap-4 border-b border-line p-6 pr-16">
            <div className="flex gap-4">
              <CompanyLogo src={shown.imageUrl} name={shown.hiringCompany || shown.jobTitle} size={56} />
              <div className="flex min-w-0 flex-col gap-1">
                <h2 id="job-detail-title" className="t-h5">
                  {shown.jobTitle}
                </h2>
                {shown.hiringCompany && (
                  <p className="text-[16px] font-medium text-ink/80">{shown.hiringCompany}</p>
                )}
              </div>
            </div>
            <JobMeta job={shown} />
            <JobBadges job={shown} />
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {detail?.description ? (
              <p className="text-[15px] leading-[1.65] whitespace-pre-line text-ink/90">
                {detail.description}
              </p>
            ) : failed ? (
              <p className="t-body">We couldn&apos;t load the full description. You can still apply below.</p>
            ) : detail ? (
              <p className="t-body">No description was provided for this role.</p>
            ) : (
              <div aria-hidden className="flex animate-pulse flex-col gap-3">
                {[100, 95, 88, 97, 60].map((width) => (
                  <div key={width} className="h-3.5 rounded bg-surface" style={{ width: `${width}%` }} />
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-line p-4 sm:px-6">
            <p className="hidden text-[13px] text-dim sm:block">
              {isAuthenticated ? "Opens the employer's application page." : "Free account required to apply."}
            </p>
            <div className="flex w-full gap-2 sm:w-auto">
              <AutomateLink className="flex-1 sm:flex-none" />
              <button
                type="button"
                onClick={() => onApply(shown)}
                className={`${primaryButton} flex-1 sm:flex-none sm:px-8`}
              >
                Apply
              </button>
            </div>
          </div>
        </>
      )}
    </Dialog>
  );
}
