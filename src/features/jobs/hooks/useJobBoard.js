"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { listJobs } from "../services/jobBoardService.js";

const PAGE_SIZE = 20;

const INITIAL = {
  jobs: [],
  total: 0,
  page: 0,
  hasMore: false,
  // loading     – first load, nothing to show yet (skeletons)
  // refreshing  – new filters; the previous results stay on screen, dimmed,
  //               so the page doesn't collapse and jump while the new ones load
  // loadingMore – next page
  status: "loading",
  error: null,
  failedPage: null,
  // Hiring posts for a signed-out visitor: a teaser, not the real list.
  locked: false,
};

/**
 * Paged job list for one filter query string. A new query restarts at page 1;
 * responses for a query the user has already moved past are dropped.
 * `authKey` changes on sign-in / sign-out, which reloads: hiring posts differ
 * for signed-in users. `scope` (listings vs posts) changing clears the list
 * instead of dimming it, since the two render as different cards.
 */
export function useJobBoard(filterQuery, authKey, scope) {
  const [state, setState] = useState(INITIAL);
  const requestId = useRef(0);
  const lastScope = useRef(scope);

  const load = useCallback(
    async (page) => {
      const id = ++requestId.current;
      const scopeChanged = lastScope.current !== scope;
      lastScope.current = scope;

      setState((prev) => {
        if (page > 1) return { ...prev, status: "loadingMore", error: null };
        if (scopeChanged || !prev.jobs.length) return { ...INITIAL, status: "loading" };
        return { ...prev, status: "refreshing", error: null };
      });

      const params = new URLSearchParams(filterQuery);
      params.set("page", String(page));
      params.set("limit", String(PAGE_SIZE));

      let response;
      try {
        response = await listJobs(params);
      } catch {
        response = { success: false, error: null };
      }
      if (id !== requestId.current) return;

      if (!response.success || !response.data) {
        setState((prev) => ({
          ...prev,
          status: "error",
          error: response.error || "We couldn't load jobs right now.",
          failedPage: page,
        }));
        return;
      }

      const { jobs, total, hasMore, locked = false } = response.data;
      setState((prev) => {
        // Offset paging can repeat a row if the board refreshed between pages.
        const seen = new Set(page === 1 ? [] : prev.jobs.map((job) => job.id));
        const merged =
          page === 1
            ? jobs
            : [...prev.jobs, ...jobs.filter((job) => !seen.has(job.id))];
        return {
          jobs: merged,
          total,
          page,
          hasMore,
          status: "ready",
          error: null,
          failedPage: null,
          locked,
        };
      });
    },
    // authKey is only a reload trigger.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filterQuery, authKey, scope],
  );

  useEffect(() => {
    load(1);
  }, [load]);

  const loadMore = useCallback(() => load(state.page + 1), [load, state.page]);
  const retry = useCallback(
    () => load(state.failedPage ?? 1),
    [load, state.failedPage],
  );

  return { ...state, loadMore, retry };
}
