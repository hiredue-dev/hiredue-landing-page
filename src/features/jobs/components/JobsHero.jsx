"use client";

/**
 * The job board's header: a live-openings pill, the headline and the
 * subtitle. The source circles used to live in here too, but that duplicated
 * the same filter shown beside the results tabs and made the header taller
 * than it needed to be — they now live in one place, next to "Job listings /
 * Hiring posts", right where they act on the list beneath them.
 */
export function JobsHero({ facets }) {
  const live = (facets?.sources?.jobs ?? 0) + (facets?.sources?.posts ?? 0);

  return (
    // Extra bottom padding: the search bar overlaps this panel's lower edge
    // (see JobBoard), so there's room under the text for it to sit on.
    <div className="flex flex-col items-center gap-2.5 rounded-[20px] bg-surface px-5 pt-6 pb-14 text-center sm:px-8 sm:pt-7 sm:pb-16">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-[12.5px] font-semibold text-ink shadow-[0_2px_10px_rgba(29,29,29,0.06)]">
        <span className="relative flex size-1.5">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60 motion-reduce:animate-none" />
          <span className="relative inline-flex size-1.5 rounded-full bg-success" />
        </span>
        {live ? `${live.toLocaleString()} live openings` : "Live openings"} · updated daily
      </span>

      <div className="flex flex-col gap-1.5">
        <h1 className="font-display text-[28px] leading-[1.15] font-semibold tracking-[-0.6px] text-ink sm:text-[36px] sm:tracking-[-1px]">
          Find your next <span className="text-brand">role</span>
        </h1>
        <p className="t-body mx-auto max-w-[520px] text-balance">
          Openings from LinkedIn, Naukri, Instahyre, Foundit, Wellfound and company career pages, plus LinkedIn
          hiring posts, in one place.
        </p>
      </div>
    </div>
  );
}
