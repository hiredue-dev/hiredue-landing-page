"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Linkedin, Loader2, SearchX, SlidersHorizontal } from "lucide-react";
import clsx from "clsx";
import { useJobBoard } from "../hooks/useJobBoard.js";
import { useAuth } from "@/features/auth/context/AuthContext.jsx";
import { getJobFilters } from "../services/jobBoardService.js";
import {
  EMPTY_FILTERS,
  filtersToParams,
  filtersToQuery,
  hasActiveFilters,
  readFilters,
} from "../filters.js";
import { roleLabel } from "../format.js";
import { JobDialogsContext } from "../jobDialogs.js";
import { AccountDialog } from "./AccountDialog.jsx";
import { ApplyDialog } from "./ApplyDialog.jsx";
import { DownloadDialog } from "./DownloadDialog.jsx";
import { FilterSidebar } from "./FilterSidebar.jsx";
import { HiringPostsStrip } from "./HiringPostsStrip.jsx";
import { JobCard, JobCardSkeleton } from "./JobCard.jsx";
import { JobDetailDialog } from "./JobDetailDialog.jsx";
import { JobsHero } from "./JobsHero.jsx";
import { SourceCircles } from "./Sources.jsx";
import { LockedPostCard, PostCard, UnlockPostsPanel } from "./PostCard.jsx";
import { SearchBar } from "./SearchBar.jsx";
import { Dialog, primaryButton, secondaryButton } from "./ui.jsx";

// Fixed navbar height plus breathing room: where scrolled-to content should land.
const NAV_OFFSET = 100;

export function JobBoard() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();

  const filters = useMemo(() => readFilters(searchParams), [searchParams]);
  const filterQuery = useMemo(() => filtersToQuery(filters), [filters]);
  const showPosts = filters.source === "posts";
  // Posts depend on who's asking (full for members, a teaser for visitors), so
  // they reload on sign-in / sign-out; listings are the same for everyone.
  const authKey = isAuthenticated ? "member" : "visitor";
  const board = useJobBoard(filterQuery, showPosts ? authKey : "public", filters.source);

  const [facets, setFacets] = useState(null);
  const [detailJob, setDetailJob] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  // In-page sign-up / log-in and app download (instead of leaving for /signup or /download).
  const [accountRequest, setAccountRequest] = useState(null);
  const [downloadOpen, setDownloadOpen] = useState(false);

  const resultsRef = useRef(null);
  const lastQuery = useRef(filterQuery);

  useEffect(() => {
    getJobFilters()
      .then((response) => response.success && setFacets(response.data))
      .catch(() => {});
  }, []);

  // Arriving on the board always starts at the top (not a restored or
  // carried-over scroll position), unless the URL points at an anchor.
  // "instant": the site sets smooth scrolling globally, and an animated jump
  // from far down the previous page can be cut short partway.
  useEffect(() => {
    if (!window.location.hash) window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  // After a search or filter change, bring the results heading to just below
  // the nav — whether that means scrolling up (the reader was deep in a long
  // list) or down (a first search from the top of the page, where the header
  // would otherwise leave the results below the fold with no visible
  // feedback that anything happened). Compared against the previous query
  // (not a first-run flag), so it never fires on arrival, including React's
  // double-run of effects in development.
  useEffect(() => {
    if (lastQuery.current === filterQuery) return;
    lastQuery.current = filterQuery;
    const top = resultsRef.current?.getBoundingClientRect().top;
    if (top != null) {
      window.scrollTo({ top: window.scrollY + top - NAV_OFFSET, behavior: "smooth" });
    }
  }, [filterQuery]);

  const setParams = useCallback(
    (updates) => {
      const next = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value == null || value === "") next.delete(key);
        else next.set(key, String(value));
      }
      const query = next.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  const updateFilters = useCallback(
    (patch) => setParams(filtersToParams({ ...filters, ...patch })),
    [filters, setParams],
  );
  // Reset clears filters but stays on the current tab.
  const resetFilters = useCallback(
    () => setParams(filtersToParams({ ...EMPTY_FILTERS, source: filters.source })),
    [filters.source, setParams],
  );
  const setSource = useCallback(
    // Listing-only filters mean nothing for posts; drop them on the way over.
    (source) => updateFilters(source === "posts" ? { source, platforms: [], easyApply: false } : { source }),
    [updateFilters],
  );
  const selectSources = useCallback(
    (platforms) => updateFilters({ source: "jobs", platforms }),
    [updateFilters],
  );
  const toggleRole = useCallback(
    (role) => updateFilters({ roles: filters.roles.includes(role) ? [] : [role] }),
    [filters.roles, updateFilters],
  );

  const noun = showPosts ? "post" : "job";
  const postsLocked = showPosts && board.locked;
  const Card = showPosts ? PostCard : JobCard;

  const applyId = searchParams.get("apply");
  const closeApply = useCallback(() => setParams({ apply: null }), [setParams]);
  const closeDetail = useCallback(() => setDetailJob(null), []);

  const openAccount = useCallback(
    (request = {}) => {
      setDetailJob(null);
      setDownloadOpen(false);
      setAccountRequest({ mode: "signup", ...request });
    },
    [],
  );
  const openDownload = useCallback(() => {
    setDetailJob(null);
    setAccountRequest(null);
    if (applyId) closeApply();
    setDownloadOpen(true);
  }, [applyId, closeApply]);
  const dialogs = useMemo(() => ({ openAccount, openDownload }), [openAccount, openDownload]);

  const openApply = useCallback(
    (job) => {
      setDetailJob(null);
      if (isAuthenticated) {
        setParams({ apply: job.id });
        return;
      }
      // Signed out: sign up right here, then the application link opens.
      openAccount({ reason: "apply", job, onSuccess: () => setParams({ apply: job.id }) });
    },
    [isAuthenticated, setParams, openAccount],
  );
  const unlockPosts = useCallback(
    (mode = "signup") => openAccount({ mode, reason: "posts", onSuccess: () => setSource("posts") }),
    [openAccount, setSource],
  );

  const loading = board.status === "loading";
  const refreshing = board.status === "refreshing";
  const failed = board.status === "error" && !board.jobs.length;
  const trendingRoles = (facets?.roles ?? []).slice(0, 6);

  const sidebar = (
    <FilterSidebar
      filters={filters}
      facets={facets}
      onChange={updateFilters}
      onReset={resetFilters}
    />
  );

  return (
    <JobDialogsContext.Provider value={dialogs}>
    <section className="relative pt-[104px] pb-[120px] min-[810px]:pt-[116px] min-[1200px]:pb-[160px]">
      <div className="mx-auto w-full max-w-[1380px] px-[20px] sm:px-[30px]">
        <JobsHero facets={facets} />

        {/* Straddles the hero panel's bottom edge, as before. */}
        <div className="relative z-20 mx-auto -mt-9 w-full max-w-[1160px] sm:-mt-10 sm:px-6">
          <SearchBar filters={filters} facets={facets} onSearch={updateFilters} />
        </div>

        {trendingRoles.length > 0 && (
          <div className="mx-auto mt-4 flex max-w-[1160px] items-center gap-2 sm:px-6">
            <span className="shrink-0 text-[13.5px] font-semibold text-dim">Trending:</span>
            {/* flex-nowrap + scroll, not wrap: a single line always, even if a
                role label ends up unexpectedly long (bad source data has done
                this before — see job_board_role() in docs/job-board.sql). */}
            <div className="-mx-1 flex flex-nowrap gap-2 overflow-x-auto px-1 pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {trendingRoles.map((role) => {
                const active = filters.roles.includes(role.name);
                return (
                  <button
                    key={role.name}
                    type="button"
                    aria-pressed={active}
                    title={roleLabel(role.name)}
                    onClick={() => toggleRole(role.name)}
                    className={clsx(
                      "max-w-[200px] shrink-0 truncate rounded-full border bg-white px-3.5 py-1.5 text-[13.5px] font-medium transition-colors duration-200",
                      // Selected: an outline, not a fill — sleek rather than a solid block of colour.
                      active ? "border-ink border-[1.5px] font-semibold text-ink" : "border-line text-ink hover:border-ink/50",
                    )}
                  >
                    {roleLabel(role.name)}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-10 grid gap-10 lg:grid-cols-[250px_minmax(0,1fr)] min-[1200px]:mt-12">
          <aside className="hidden lg:block">
            {/* Sticky, and scrolls on its own when taller than the screen. */}
            <div className="scroll-on-hover sticky top-[104px] -mr-3 max-h-[calc(100vh-124px)] pr-3 pb-6">{sidebar}</div>
          </aside>

          <div ref={resultsRef} className="flex min-w-0 flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
              <SourceTabs source={filters.source} onChange={setSource} />
              {/* Filters the list on the left; hidden on Hiring posts, where every result is already from LinkedIn. */}
              {!showPosts && (
                <SourceCircles platforms={facets?.platforms} selected={filters.platforms} onSelect={selectSources} />
              )}
            </div>

            {/* Highlighted the same way as before: right under the tabs, above the
                results, not buried below them. */}
            {!showPosts && (
              <HiringPostsStrip
                filters={filters}
                authKey={authKey}
                onUnlock={() => unlockPosts()}
                onSeeAll={() => setSource("posts")}
                onOpen={setDetailJob}
              />
            )}

            <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
              <h2 className="flex items-center gap-3 font-display text-[28px] leading-[1.2] font-semibold tracking-[-0.5px] text-ink sm:text-[32px]" aria-live="polite">
                {loading ? (
                  `Searching ${noun}s…`
                ) : failed ? (
                  showPosts ? "Hiring posts" : "Jobs"
                ) : (
                  <span>
                    {board.total.toLocaleString()}{" "}
                    <span className="font-medium text-dim">
                      {showPosts ? "Hiring " : ""}
                      {board.total === 1 ? (showPosts ? "Post" : "Job") : showPosts ? "Posts" : "Jobs"} Found
                    </span>
                  </span>
                )}
                {refreshing && <Loader2 size={20} className="animate-spin text-brand" aria-label="Updating" />}
              </h2>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setFiltersOpen(true)}
                  className={clsx(secondaryButton, "lg:hidden")}
                >
                  <SlidersHorizontal size={16} aria-hidden /> Filters
                </button>
                {!postsLocked && (
                  <label className="flex items-center gap-1.5 text-[16px] font-medium text-dim">
                    Sort by:
                    <select
                      value={filters.q ? filters.sort : "recent"}
                      onChange={(event) => updateFilters({ sort: event.target.value })}
                      className="cursor-pointer bg-transparent font-semibold text-ink outline-none"
                    >
                      <option value="recent">Newest post</option>
                      <option value="relevance" disabled={!filters.q}>
                        Best match
                      </option>
                    </select>
                  </label>
                )}
              </div>
            </div>

            {/* Keeps the area from collapsing between searches, so the page doesn't jump. */}
            <div className={clsx("flex min-h-[60vh] flex-col gap-6 transition-opacity duration-200", refreshing && "pointer-events-none opacity-50")}>
            {loading ? (
              <CardGrid>
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <JobCardSkeleton key={i} />
                ))}
              </CardGrid>
            ) : failed ? (
              <EmptyState
                title={`We couldn't load ${noun}s`}
                body={board.error}
                action={
                  <button type="button" onClick={board.retry} className={secondaryButton}>
                    Try again
                  </button>
                }
              />
            ) : !board.jobs.length ? (
              <EmptyState
                  title={`No ${showPosts ? "hiring posts" : "jobs"} match these filters`}
                  body="Try other keywords, another location, or reset the filters."
                  action={
                    hasActiveFilters(filters) ? (
                      <button type="button" onClick={resetFilters} className={secondaryButton}>
                        Reset filters
                      </button>
                    ) : null
                  }
                />
            ) : postsLocked ? (
              <>
                <UnlockPostsPanel total={board.total} onSignup={() => unlockPosts()} onLogin={() => unlockPosts("login")} />
                <CardGrid>
                  {board.jobs.map((job) => (
                    <LockedPostCard key={job.id} job={job} onUnlock={() => unlockPosts()} />
                  ))}
                </CardGrid>
              </>
            ) : (
              <>
                <CardGrid>
                  {board.jobs.map((job) => (
                    <Card key={job.id} job={job} onOpen={setDetailJob} onApply={openApply} />
                  ))}
                </CardGrid>

                {(board.hasMore || board.status === "error") && (
                  <div className="flex flex-col items-center gap-2 pt-4">
                    {board.status === "error" && <p className="text-[14px] text-danger">{board.error}</p>}
                    <button
                      type="button"
                      onClick={board.status === "error" ? board.retry : board.loadMore}
                      disabled={board.status === "loadingMore"}
                      className={clsx(secondaryButton, "h-12 px-8")}
                    >
                      {board.status === "loadingMore"
                        ? "Loading…"
                        : board.status === "error"
                          ? "Try again"
                          : `Load more ${noun}s`}
                    </button>
                  </div>
                )}
              </>
            )}
            </div>
          </div>
        </div>
      </div>

      {/* Phones and tablets: the sidebar lives in a sheet. */}
      <Dialog open={filtersOpen} onClose={() => setFiltersOpen(false)} labelledBy="job-filters-title">
        <div className="border-b border-line p-6 pr-16">
          <h2 id="job-filters-title" className="t-h5">
            Filters
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto p-6">{sidebar}</div>
        <div className="border-t border-line p-4">
          <button type="button" onClick={() => setFiltersOpen(false)} className={clsx(primaryButton, "h-12 w-full")}>
            Show {board.total.toLocaleString()} {board.total === 1 ? noun : `${noun}s`}
          </button>
        </div>
      </Dialog>

      <JobDetailDialog job={detailJob} onClose={closeDetail} onApply={openApply} />
      <ApplyDialog jobId={applyId} onClose={closeApply} />
      <AccountDialog
        request={accountRequest}
        onClose={() => setAccountRequest(null)}
        onSuccess={accountRequest?.onSuccess}
      />
      <DownloadDialog open={downloadOpen} onClose={() => setDownloadOpen(false)} />
    </section>
    </JobDialogsContext.Provider>
  );
}

/** Listings and LinkedIn hiring posts share the page as two tabs. */
function SourceTabs({ source, onChange }) {
  const tabs = [
    { value: "jobs", label: "Job listings" },
    { value: "posts", label: "Hiring posts" },
  ];
  return (
    <div role="tablist" aria-label="What to show" className="flex w-full gap-1 self-start rounded-full border border-line bg-surface p-1 sm:w-auto">
      {tabs.map((tab) => {
        const active = source === tab.value;
        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => !active && onChange(tab.value)}
            className={clsx(
              "inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full px-3.5 text-[14px] font-semibold whitespace-nowrap transition-colors duration-200 sm:flex-none",
              active ? "bg-white text-ink shadow-[0_2px_8px_rgba(29,29,29,0.08)]" : "text-dim hover:text-ink",
            )}
          >
            {tab.value === "posts" && <Linkedin size={14} className="shrink-0 text-[#0a66c2]" aria-hidden />}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

// As many ≥300px columns as the results area fits: 1 on phones, 2 beside the sidebar, 3 on wide screens.
function CardGrid({ children }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] gap-5">{children}</div>
  );
}


function EmptyState({ title, body, action }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-[20px] border border-dashed border-line bg-white px-6 py-16 text-center">
      <div className="grid size-12 place-items-center rounded-full bg-surface text-dim">
        <SearchX size={20} aria-hidden />
      </div>
      <h2 className="t-h5">{title}</h2>
      {body && <p className="t-body max-w-[420px]">{body}</p>}
      {action}
    </div>
  );
}

/** Server-rendered placeholder while the board's JavaScript loads, so the page never sits blank. */
export function JobBoardFallback() {
  return (
    <section className="relative pt-[104px] pb-[120px] min-[810px]:pt-[116px]">
      <div className="mx-auto w-full max-w-[1380px] px-[20px] sm:px-[30px]">
        {/* The real header (with the page's h1) is in the static HTML. */}
        <JobsHero facets={null} />
        <div className="relative z-20 mx-auto -mt-9 w-full max-w-[1160px] sm:-mt-10 sm:px-6">
          <div aria-hidden className="h-14 rounded-[20px] border border-line bg-white shadow-[0_0_0_4px_rgba(221,229,237,0.5)]" />
        </div>
        <div className="mt-10 grid gap-10 lg:grid-cols-[250px_minmax(0,1fr)] min-[1200px]:mt-12">
          <div className="hidden flex-col gap-3 lg:flex">
            {[70, 55, 62, 48].map((width) => (
              <div key={width} className="h-4 animate-pulse rounded bg-surface" style={{ width: `${width}%` }} />
            ))}
          </div>
          <div className="flex flex-col gap-6">
            <div className="h-9 w-56 animate-pulse rounded bg-surface" />
            <CardGrid>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <JobCardSkeleton key={i} />
              ))}
            </CardGrid>
          </div>
        </div>
      </div>
    </section>
  );
}
