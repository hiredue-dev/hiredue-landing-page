"use client";

import { useEffect, useState } from "react";
import { ArrowRight, ChevronRight, Linkedin, Lock } from "lucide-react";
import { filtersToQuery } from "../filters.js";
import { experienceLabel } from "../format.js";
import { listJobs } from "../services/jobBoardService.js";
import { CompanyLogo } from "./ui.jsx";

const STRIP_SIZE = 3;

/**
 * Sits above the job listings and surfaces the newest LinkedIn hiring posts
 * that match the same search, so posts get the spotlight without a separate
 * page. Deliberately a slim list of rows, not full post cards — the full
 * card treatment is what the Hiring posts tab itself uses; a promo above a
 * search's actual results shouldn't out-compete them for the screen. Same
 * blue gradient as the "members only" banner on the Hiring posts tab, so the
 * feature reads as one highlighted thing wherever it turns up, not a pale
 * afterthought here and a bold pitch there. Hidden when no post matches.
 * Signed-out visitors get locked teasers that lead to sign-up.
 */
export function HiringPostsStrip({ filters, authKey, onUnlock, onSeeAll, onOpen }) {
  const [state, setState] = useState({ status: "loading", jobs: [], total: 0, locked: false });

  // Same keywords, location, role and experience; source filters and Easy Apply
  // don't apply to posts.
  const query = filtersToQuery({ ...filters, source: "posts", platforms: [], easyApply: false });

  useEffect(() => {
    let cancelled = false;
    setState((prev) => ({ ...prev, status: "loading" }));
    const params = new URLSearchParams(query);
    params.set("page", "1");
    params.set("limit", String(STRIP_SIZE));
    listJobs(params)
      .then((response) => {
        if (cancelled) return;
        setState(
          response.success && response.data
            ? {
                status: "ready",
                jobs: response.data.jobs.slice(0, STRIP_SIZE),
                total: response.data.total,
                locked: !!response.data.locked,
              }
            : { status: "error", jobs: [], total: 0, locked: false },
        );
      })
      .catch(() => !cancelled && setState({ status: "error", jobs: [], total: 0, locked: false }));
    return () => {
      cancelled = true;
    };
  }, [query, authKey]);

  if (state.status !== "loading" && !state.jobs.length) return null;

  return (
    <section
      aria-labelledby="hiring-posts-strip"
      className="relative overflow-hidden rounded-[16px] bg-[linear-gradient(120deg,#0a66c2_0%,#406ae4_100%)] p-4 text-white sm:p-4.5"
    >
      <div aria-hidden className="pointer-events-none absolute -top-10 -right-8 size-32 rounded-full bg-white/10" />

      <div className="relative flex flex-col gap-3.5">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
          <div className="flex items-center gap-2.5">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white/15 text-white">
              <Linkedin size={15} aria-hidden />
            </span>
            <span className="flex min-w-0 flex-col">
              <h3 id="hiring-posts-strip" className="flex flex-wrap items-center gap-2 text-[15px] font-semibold text-white">
                Message hiring managers directly
                <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-[10px] leading-[1.4] font-semibold tracking-[0.04em] text-white uppercase">
                  New
                </span>
              </h3>
              <span className="text-[12.5px] leading-tight text-white/75">
                Posted by the people hiring — connect on LinkedIn, not a normal listing
              </span>
            </span>
          </div>
          {state.status === "ready" &&
            (state.locked ? (
              <button
                type="button"
                onClick={onUnlock}
                className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-[13px] font-semibold text-[#0a66c2] hover:opacity-90"
              >
                <Lock size={13} aria-hidden /> Sign up to see all {state.total.toLocaleString()}
              </button>
            ) : (
              <button
                type="button"
                onClick={onSeeAll}
                className="inline-flex items-center gap-1 text-[13.5px] font-semibold text-white hover:underline"
              >
                See all {state.total.toLocaleString()}
                <ArrowRight size={14} aria-hidden />
              </button>
            ))}
        </div>

        <div className="grid gap-2.5 sm:grid-cols-3">
          {state.status === "loading"
            ? [0, 1, 2].map((i) => (
                <div key={i} aria-hidden className="h-[76px] animate-pulse rounded-[14px] bg-white/15" />
              ))
            : state.jobs.map((job) => (
                <CompactPostRow
                  key={job.id}
                  job={job}
                  locked={state.locked}
                  onClick={() => (state.locked ? onUnlock() : onOpen(job))}
                />
              ))}
        </div>
      </div>
    </section>
  );
}

/** Title on up to two lines (a single truncated line was cutting titles off
 * mid-word), one line of meta below — a card meant to be skimmed, not read.
 * Near-opaque white so it reads as a card floating on the banner, not a wash
 * of blue-on-blue. */
function CompactPostRow({ job, locked, onClick }) {
  const meta = [experienceLabel(job), job.location].filter(Boolean).join(" · ");

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-w-0 items-center gap-3 rounded-[14px] border border-white/40 bg-white/95 px-3.5 py-3 text-left transition-[background-color,box-shadow] duration-200 hover:bg-white hover:shadow-[0_4px_14px_rgba(0,0,0,0.12)]"
    >
      <CompanyLogo src={null} name={job.hiringCompany || job.jobTitle} size={34} />
      <span className="min-w-0 flex-1">
        <span className="line-clamp-2 text-[13.5px] leading-[1.35] font-semibold text-ink">{job.jobTitle}</span>
        {meta && <span className="mt-1 block truncate text-[12px] leading-none text-dim">{meta}</span>}
      </span>
      {locked ? (
        <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#0a66c2]/10 text-[#0a66c2]">
          <Lock size={13} aria-hidden />
        </span>
      ) : (
        <ChevronRight size={16} className="shrink-0 text-dim" aria-hidden />
      )}
    </button>
  );
}
