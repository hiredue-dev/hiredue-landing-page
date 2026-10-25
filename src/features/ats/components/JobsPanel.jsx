"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock, SearchX, X } from "lucide-react";
import clsx from "clsx";
import { useAuth } from "@/features/auth/context/AuthContext.jsx";
import { useAuthModal } from "@/features/auth/components/FloatingAuthModal.jsx";
import { JobCard, JobCardSkeleton } from "@/features/jobs/components/JobCard.jsx";
import { JobDetailDialog } from "@/features/jobs/components/JobDetailDialog.jsx";
import { secondaryButton } from "@/features/jobs/components/ui.jsx";
import { EMPTY_FILTERS, filtersToQuery } from "@/features/jobs/filters.js";
import { useJobBoard } from "@/features/jobs/hooks/useJobBoard.js";
import { getJobFilters } from "@/features/jobs/services/jobBoardService.js";
import { roleLabel } from "@/features/jobs/format.js";
import { EVENTS, jobProps, trackEvent } from "@/lib/analytics";
import { atsChecker } from "@/lib/content";
import { keywordsToQuery, resumeKeywords } from "../jobQuery.js";

const SHOWN = 6;

// Role facets come from the board in lower case; skills keep the resume's spelling.
const chipLabel = (term) => (/^[a-z\s]+$/.test(term) ? roleLabel(term) : term);

/**
 * The job board's own search (public, like /jobs), fed the roles and skills
 * on the resume. Apply follows the board's rules: signed in, the board opens
 * the link; signed out, an account comes first.
 */
export function JobsPanel({ text }) {
  const [terms, setTerms] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getJobFilters()
      .then((response) => (response.success ? response.data?.roles ?? [] : []))
      .catch(() => [])
      .then((roles) => !cancelled && setTerms(resumeKeywords(text, roles)));
    return () => {
      cancelled = true;
    };
  }, [text]);

  const copy = atsChecker.tabs.jobs;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <h3 className="t-h5">{copy.title}</h3>
        <p className="t-body">{copy.body}</p>
      </div>
      {terms === null ? (
        <ResultsSkeleton />
      ) : terms.length === 0 ? (
        <Empty
          title="We couldn't pick out roles or skills"
          body="Add a Skills section to your resume, or search the job board yourself."
          href="/jobs"
        />
      ) : (
        <>
          <ul className="flex flex-wrap gap-2" aria-label="Searching for">
            {terms.map((term) => (
              <li key={term}>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white py-1.5 pr-1.5 pl-3.5 text-[13.5px] font-semibold text-ink">
                  {chipLabel(term)}
                  {terms.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setTerms((list) => list.filter((t) => t !== term))}
                      aria-label={`Remove ${term}`}
                      className="relative grid size-5 place-items-center rounded-full text-dim after:absolute after:-inset-3 after:content-[''] hover:bg-surface hover:text-ink"
                    >
                      <X size={13} aria-hidden />
                    </button>
                  )}
                </span>
              </li>
            ))}
          </ul>
          <Matches terms={terms} />
        </>
      )}
    </div>
  );
}

function Matches({ terms }) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { showModal } = useAuthModal();
  const query = useMemo(() => filtersToQuery({ ...EMPTY_FILTERS, q: keywordsToQuery(terms) }), [terms]);
  const board = useJobBoard(query, "public", "jobs");
  const [detail, setDetail] = useState(null);
  const boardHref = `/jobs?${query}`;

  const openDetail = useCallback((job) => {
    trackEvent(EVENTS.jobViewed, jobProps(job, "ats_checker"));
    setDetail(job);
  }, []);

  const apply = useCallback(
    (job) => {
      setDetail(null);
      trackEvent(EVENTS.jobApplyClicked, { ...jobProps(job, "ats_checker"), signed_in: isAuthenticated });
      const href = `${boardHref}&apply=${encodeURIComponent(job.id)}`;
      if (isAuthenticated) {
        router.push(href);
        return;
      }
      // The board opens the apply link from ?apply= once the visitor is signed in.
      showModal({ view: "signup", redirectTo: href });
    },
    [boardHref, isAuthenticated, router, showModal],
  );

  if (board.status === "loading") return <ResultsSkeleton />;
  if (board.status === "error" && !board.jobs.length) {
    return (
      <div role="alert" className="flex flex-col items-start gap-3">
        <p className="t-body">{board.error}</p>
        <button type="button" onClick={board.retry} className={secondaryButton}>
          Try again
        </button>
      </div>
    );
  }
  if (!board.jobs.length) {
    return <Empty title="No open jobs match right now" body="Remove a keyword above, or browse every job on the board." href="/jobs" />;
  }

  return (
    <div className={clsx("flex flex-col gap-5 transition-opacity duration-200", board.status === "refreshing" && "opacity-50")}>
      <p className="text-[15px] font-semibold text-ink" aria-live="polite">
        {board.total.toLocaleString()} <span className="font-medium text-dim">matching {board.total === 1 ? "job" : "jobs"}</span>
      </p>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,280px),1fr))] gap-5">
        {board.jobs.slice(0, SHOWN).map((job) => (
          <JobCard key={job.id} job={job} onOpen={openDetail} onApply={apply} />
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Link href={boardHref} className={clsx(secondaryButton, "h-12 px-6 text-[15px]")}>
          See all {board.total.toLocaleString()} on the job board <ArrowRight size={16} aria-hidden />
        </Link>
        {!isAuthenticated && (
          <span className="flex items-center gap-1.5 text-[13px] font-medium text-dim">
            <Lock size={14} aria-hidden /> Applying needs a free account
          </span>
        )}
      </div>
      <JobDetailDialog job={detail} onClose={() => setDetail(null)} onApply={apply} />
    </div>
  );
}

function ResultsSkeleton() {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,280px),1fr))] gap-5" aria-busy="true" aria-label="Loading jobs">
      {[0, 1, 2].map((i) => (
        <JobCardSkeleton key={i} />
      ))}
    </div>
  );
}

function Empty({ title, body, href }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-[20px] border border-dashed border-line bg-white px-6 py-12 text-center">
      <div className="grid size-12 place-items-center rounded-full bg-surface text-dim">
        <SearchX size={20} aria-hidden />
      </div>
      <p className="t-h5">{title}</p>
      <p className="t-body max-w-[420px]">{body}</p>
      <Link href={href} className={secondaryButton}>
        Browse all jobs
      </Link>
    </div>
  );
}
