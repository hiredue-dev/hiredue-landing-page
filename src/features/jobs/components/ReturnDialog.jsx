"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, MonitorDown, Sparkles } from "lucide-react";
import clsx from "clsx";
import { EVENTS, trackEvent } from "@/lib/analytics";
import { describeElapsed } from "../applyTimer.js";
import { postedLabel } from "../format.js";
import { getJob, listJobs } from "../services/jobBoardService.js";
import { SIMILAR_COUNT, similarSearches } from "../similarJobs.js";
import { CompanyLogo, Dialog, darkButton, primaryButton, secondaryButton } from "./ui.jsx";

/** The first search that finds enough other roles, or the one that found the most. */
async function findSimilar(title, excludeId) {
  let best = { label: "", jobs: [] };
  for (const search of similarSearches(title)) {
    const params = new URLSearchParams({ q: search.q, postedWithin: search.postedWithin, page: "1", limit: String(SIMILAR_COUNT + 1) });
    const list = await listJobs(params);
    if (!list.success) continue;
    const jobs = (list.data?.jobs ?? []).filter((j) => String(j.id) !== String(excludeId)).slice(0, SIMILAR_COUNT);
    if (jobs.length >= SIMILAR_COUNT) return { label: search.label, jobs };
    if (jobs.length > best.jobs.length) best = { label: search.label, jobs };
  }
  return best;
}

/**
 * Shown when our tab is visible again after someone left for an employer's
 * application form. `info` is {jobId, elapsedMs, verdict} from the apply clock;
 * the board never opens this for "quiet", and the words for the time come from the clock.
 *
 * Says what the clock measured, offers the desktop app where it can be
 * installed, and lists a few fresh roles like the one just applied to, each a
 * way back into the loop.
 */
export function ReturnDialog({ info, canInstall, onClose, onDownload, onOpenJob, onAutoApply }) {
  const [job, setJob] = useState(null);
  const [similar, setSimilar] = useState({ label: "", jobs: [] });

  useEffect(() => {
    if (!info) return undefined;
    setJob(null);
    setSimilar({ label: "", jobs: [] });
    let cancelled = false;
    getJob(info.jobId)
      .then((response) => {
        if (cancelled || !response.success || !response.data) return undefined;
        setJob(response.data);
        return findSimilar(response.data.jobTitle, info.jobId).then((found) => {
          if (!cancelled) setSimilar(found);
        });
      })
      .catch(() => {
        // The dialog still says what the clock measured; the strip just stays empty.
      });
    return () => {
      cancelled = true;
    };
  }, [info]);

  useEffect(() => {
    if (!info) return;
    trackEvent(EVENTS.jobReturnShown, { verdict: info.verdict, minutes: Math.round(info.elapsedMs / 60_000), can_install: canInstall });
  }, [info, canInstall]);

  const act = (action, then) => () => {
    trackEvent(EVENTS.jobReturnAction, { action, can_install: canInstall });
    then();
  };

  const spent = info ? describeElapsed(info.elapsedMs) : "";

  return (
    <Dialog open={!!info} onClose={onClose} labelledBy="return-dialog-title" size="lg">
      {info && (
        <div className="flex flex-col gap-6 overflow-y-auto p-6 pt-7">
          <div className="flex flex-col gap-2 pr-8">
            <p className="text-[13px] leading-none font-medium tracking-[0.03em] text-brand uppercase">Welcome back</p>
            <h2 id="return-dialog-title" className="t-h5">
              You spent {spent} on that application. HireDue could have automated that.
            </h2>
            {job && (
              <p className="t-body">
                {job.jobTitle}
                {job.hiringCompany ? ` at ${job.hiringCompany}` : ""}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-4 rounded-[15px] bg-ink p-5 text-white">
            <div className="flex items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white/10">
                <MonitorDown size={18} aria-hidden />
              </span>
              <p className="text-[18px] leading-[1.3] font-semibold">Download HireDue to automate your job hunt</p>
            </div>
            {canInstall && (
              <button type="button" onClick={act("download", onDownload)} className={clsx(primaryButton, "h-12 text-[15px]")}>
                Download HireDue now
              </button>
            )}
            <p className="text-[13.5px] leading-[1.45] text-white/70">
              {canInstall
                ? "The desktop app fills forms like that one for you in the background while you get on with your day."
                : "The desktop app, on a Mac or Windows laptop, fills forms like that one for you while you get on with your day."}
            </p>
          </div>

          {similar.jobs.length > 0 && (
            <div className="flex flex-col gap-3">
              <h3 className="text-[15px] font-semibold text-ink">{similar.label}</h3>
              <ul className="flex flex-col divide-y divide-line rounded-[15px] border border-line">
                {similar.jobs.map((j) => (
                  <li key={j.id} className="flex items-center gap-3 p-3">
                    <CompanyLogo src={j.imageUrl} name={j.hiringCompany || j.jobTitle} size={40} />
                    <button type="button" onClick={act("open_job", () => onOpenJob(j))} className="min-w-0 flex-1 text-left">
                      <span className="block truncate text-[15px] font-semibold text-ink hover:text-brand">{j.jobTitle}</span>
                      <span className="block truncate text-[13px] text-dim">
                        {j.hiringCompany || "Company"}
                        {postedLabel(j) ? ` · ${postedLabel(j)}` : ""}
                      </span>
                    </button>
                    {canInstall ? (
                      <button type="button" onClick={act("auto_apply", () => onAutoApply(j))} className={clsx(darkButton, "h-9 shrink-0 px-3.5 text-[13px]")}>
                        Auto-apply
                      </button>
                    ) : (
                      <button type="button" onClick={act("open_job", () => onOpenJob(j))} className={clsx(secondaryButton, "h-9 shrink-0 px-3.5 text-[13px]")}>
                        View <ArrowRight size={14} aria-hidden />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Link
            href="/ats-checker"
            onClick={act("ats", () => {})}
            className="inline-flex items-center justify-center gap-1.5 self-center text-[14px] font-medium text-dim underline-offset-4 hover:text-ink hover:underline"
          >
            <Sparkles size={14} aria-hidden /> Check your ATS score instead
          </Link>
        </div>
      )}
    </Dialog>
  );
}
