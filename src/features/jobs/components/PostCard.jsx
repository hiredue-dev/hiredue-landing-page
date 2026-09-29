"use client";

import { Check, Linkedin, Lock } from "lucide-react";
import clsx from "clsx";
import { experienceLabel, postedLabel } from "../format.js";
import { AutomateLink, Chip, placeLabel } from "./JobCard.jsx";
import { CompanyLogo, primaryButton } from "./ui.jsx";

/** LinkedIn's blue, used only to mark hiring posts apart from ordinary listings. */
export const POST_ACCENT = "#0a66c2";

export function HiringPostBadge({ className }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full bg-[#0a66c2] px-2.5 py-1 text-[12px] leading-none font-semibold text-white",
        className,
      )}
    >
      <Linkedin size={12} aria-hidden /> Hiring post
    </span>
  );
}

/**
 * A LinkedIn hiring post. Same compact layout as a listing card, set apart by
 * LinkedIn blue: a post is someone announcing an opening, often before it
 * reaches a job board. Only what the scraper extracted is shown — never the
 * author or the post text.
 */
export function PostCard({ job, onOpen, onApply }) {
  const chips = [experienceLabel(job), placeLabel(job), job.compensation].filter(Boolean);
  const posted = postedLabel(job);

  return (
    <article className="group @container relative flex w-full flex-col gap-4 rounded-[18px] border border-[#0a66c2]/25 bg-[linear-gradient(180deg,#eef5fc_0%,#ffffff_96px)] p-5 transition-[box-shadow,border-color] duration-200 hover:border-[#0a66c2]/45 hover:shadow-[0_14px_34px_rgba(10,102,194,0.1)]">
      <div className="flex items-center gap-3">
        <CompanyLogo src={null} name={job.hiringCompany || job.jobTitle} size={44} />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <p className="truncate text-[15px] leading-none font-medium text-dim">{job.hiringCompany || "Company"}</p>
          {posted && <p className="truncate text-[12.5px] leading-none text-dim/80">Posted {posted.toLowerCase()}</p>}
        </div>
        <HiringPostBadge className="shrink-0" />
      </div>

      <h3 className="line-clamp-2 font-display text-[19px] leading-[1.25] font-semibold text-ink">
        {/* Stretched button: the whole card opens the details; footer controls sit above it. */}
        <button
          type="button"
          onClick={() => onOpen(job)}
          className="text-left after:absolute after:inset-0 after:rounded-[18px] after:content-[''] focus-visible:outline-none group-hover:text-[#0a66c2]"
        >
          {job.jobTitle}
        </button>
      </h3>

      {chips.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {chips.map((chip) => (
            <Chip key={chip}>{chip}</Chip>
          ))}
        </div>
      )}

      {/* Side by side when the card has room; stacked in narrow cards (the swipeable strip on phones). */}
      <div className="relative z-10 mt-auto flex flex-col gap-2 border-t border-[#0a66c2]/15 pt-4 @min-[268px]:flex-row">
        <AutomateLink className="min-w-0 flex-1" />
        <button type="button" onClick={() => onApply(job)} className={clsx(primaryButton, "shrink-0")}>
          Apply
        </button>
      </div>
    </article>
  );
}

/**
 * What a signed-out visitor sees instead of a post: the real title, experience
 * and place (the API sends nothing more), with the company blurred behind a
 * lock. The whole card leads to sign-up.
 */
export function LockedPostCard({ job, onUnlock }) {
  const chips = [experienceLabel(job), placeLabel(job)].filter(Boolean);
  const posted = postedLabel(job);

  return (
    <article className="group relative flex w-full flex-col gap-4 rounded-[18px] border border-[#0a66c2]/25 bg-[linear-gradient(180deg,#eef5fc_0%,#ffffff_96px)] p-5 transition-[box-shadow,border-color] duration-200 hover:border-[#0a66c2]/45 hover:shadow-[0_14px_34px_rgba(10,102,194,0.1)]">
      <div className="flex items-center gap-3">
        <span aria-hidden className="grid size-11 shrink-0 place-items-center rounded-[12px] bg-[#0a66c2]/10 text-[#0a66c2]">
          <Lock size={18} />
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          {/* Placeholder text, blurred: the real company is never sent to visitors. */}
          <p aria-hidden className="truncate text-[15px] leading-none font-medium text-dim blur-[5px] select-none">
            Company name here
          </p>
          <p className="truncate text-[12.5px] leading-none text-dim/80">
            {posted ? `Posted ${posted.toLowerCase()}` : "Hiring now"}
          </p>
        </div>
        <HiringPostBadge className="shrink-0" />
      </div>

      <h3 className="line-clamp-2 font-display text-[19px] leading-[1.25] font-semibold text-ink">
        <button
          type="button"
          onClick={onUnlock}
          className="text-left after:absolute after:inset-0 after:rounded-[18px] after:content-[''] group-hover:text-[#0a66c2]"
        >
          {job.jobTitle}
        </button>
      </h3>

      {chips.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {chips.map((chip) => (
            <Chip key={chip}>{chip}</Chip>
          ))}
        </div>
      )}

      <div className="relative z-10 mt-auto border-t border-[#0a66c2]/15 pt-4">
        <button type="button" onClick={onUnlock} className={clsx(primaryButton, "w-full py-3")}>
          <Lock size={15} aria-hidden /> Sign up free to unlock
        </button>
      </div>
    </article>
  );
}

const UNLOCK_POINTS = [
  "Message the hiring manager or recruiter who posted it — directly on LinkedIn",
  "Send a connection request and ask for a referral, before the role is even on a job board",
  "See the company, role, experience and requirements before you reach out",
];

/**
 * The pitch above locked posts. The point isn't just "more listings" — every
 * post here is written by the person doing the hiring, which is what makes a
 * connection request and a referral ask realistic in a way a job-board
 * application never is.
 */
export function UnlockPostsPanel({ total, onSignup, onLogin }) {
  return (
    <div className="relative overflow-hidden rounded-[20px] bg-[linear-gradient(120deg,#0a66c2_0%,#406ae4_100%)] p-6 text-white sm:p-8">
      <div aria-hidden className="pointer-events-none absolute -top-16 -right-10 size-56 rounded-full bg-white/10" />
      <div aria-hidden className="pointer-events-none absolute -bottom-20 right-32 size-40 rounded-full bg-white/10" />
      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex max-w-[560px] flex-col gap-3">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[12px] font-semibold tracking-[0.04em] uppercase">
            <Linkedin size={13} aria-hidden /> Members only
          </span>
          <h3 className="font-display text-[26px] leading-[1.2] font-semibold sm:text-[30px]">
            Reach the person actually hiring
          </h3>
          <p className="text-[15px] leading-[1.5] text-white/85">
            {total ? total.toLocaleString() : "Every"} LinkedIn posts, each written by someone at the company
            announcing the opening themselves — not a normal job listing.
          </p>
          <ul className="flex flex-col gap-2 text-[15px] leading-[1.45] text-white/90">
            {UNLOCK_POINTS.map((point) => (
              <li key={point} className="flex gap-2.5">
                <Check size={18} className="mt-0.5 shrink-0" aria-hidden /> {point}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex shrink-0 flex-col gap-2.5 sm:flex-row lg:flex-col">
          <button
            type="button"
            onClick={onSignup}
            className="inline-flex h-12 items-center justify-center rounded-full bg-white px-7 text-[15px] font-semibold text-[#0a66c2] shadow-[0_8px_20px_rgba(0,0,0,0.15)] transition-transform duration-200 hover:-translate-y-0.5"
          >
            Sign up free
          </button>
          <button
            type="button"
            onClick={onLogin}
            className="inline-flex h-12 items-center justify-center rounded-full border border-white/40 px-7 text-[15px] font-semibold text-white hover:bg-white/10"
          >
            I have an account
          </button>
        </div>
      </div>
    </div>
  );
}
