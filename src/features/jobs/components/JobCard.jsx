"use client";

import Link from "next/link";
import { Banknote, BriefcaseBusiness, Clock, MapPin } from "lucide-react";
import clsx from "clsx";
import { experienceLabel, platformLabel, postedLabel, workModeOf } from "../format.js";
import { useJobDialogs } from "../jobDialogs.js";
import { Badge, CompanyLogo, darkButton, primaryButton } from "./ui.jsx";

/** Location / pay / age line — used in the detail dialog header. */
export function JobMeta({ job }) {
  const posted = postedLabel(job);
  const experience = experienceLabel(job);
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[14px] leading-[1.3] text-dim">
      {experience && (
        <span className="inline-flex items-center gap-1.5">
          <BriefcaseBusiness size={15} aria-hidden /> {experience}
        </span>
      )}
      {job.location && (
        <span className="inline-flex items-center gap-1.5">
          <MapPin size={15} aria-hidden /> {job.location}
        </span>
      )}
      {job.compensation && (
        <span className="inline-flex items-center gap-1.5">
          <Banknote size={15} aria-hidden /> {job.compensation}
        </span>
      )}
      {posted && (
        <span className="inline-flex items-center gap-1.5">
          <Clock size={15} aria-hidden /> {posted}
        </span>
      )}
    </div>
  );
}

export function JobBadges({ job }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge>{platformLabel(job.platformName)}</Badge>
      {job.isEasyApplyAvailable && <Badge tone="success">Easy Apply</Badge>}
    </div>
  );
}

/** Bordered pill for the card's key facts (experience, place, pay), as in the reference cards. */
export function Chip({ children }) {
  return (
    <span className="max-w-full truncate rounded-[10px] border border-line px-3 py-1.5 text-[13px] leading-none font-medium whitespace-nowrap text-ink/80">
      {children}
    </span>
  );
}

/** "Bengaluru, Karnataka, India" → "Bengaluru"; remote/hybrid say so. */
export function placeLabel(job) {
  const mode = workModeOf(job);
  const city = job.location?.split(/[,(|/]/)[0].trim();
  if (mode === "Remote") return "Remote";
  if (mode === "Hybrid") return city && !/hybrid/i.test(city) ? `${city} · Hybrid` : "Hybrid";
  return city || null;
}

/**
 * The desktop app applies for the user — the upsell next to every Apply button.
 * On the job board it opens the download dialog in place; anywhere else it
 * falls back to the /download page.
 */
export function AutomateLink({ className }) {
  const dialogs = useJobDialogs();
  const classes = clsx(darkButton, "px-4 py-2.5 text-[14px]", className);
  if (!dialogs) {
    return (
      <Link href="/download" className={classes}>
        Automate with HireDue
      </Link>
    );
  }
  return (
    <button type="button" onClick={dialogs.openDownload} className={classes}>
      Automate with HireDue
    </button>
  );
}

export function JobCard({ job, onOpen, onApply }) {
  const chips = [experienceLabel(job), placeLabel(job), job.compensation].filter(Boolean);
  const posted = postedLabel(job);

  return (
    <article className="group @container relative flex flex-col gap-4 rounded-[18px] border border-line bg-white p-5 transition-[box-shadow,border-color] duration-200 hover:border-grey/60 hover:shadow-[0_14px_34px_rgba(29,29,29,0.07)]">
      <div className="flex items-center gap-3">
        <CompanyLogo src={job.imageUrl} name={job.hiringCompany || job.jobTitle} size={44} />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <p className="truncate text-[15px] leading-none font-medium text-dim">{job.hiringCompany || "Company"}</p>
          <p className="truncate text-[12.5px] leading-none text-dim/80">
            {platformLabel(job.platformName)}
            {posted && <> · {posted}</>}
          </p>
        </div>
        {job.isEasyApplyAvailable && (
          <span className="shrink-0 rounded-[8px] bg-success-10 px-2.5 py-1.5 text-[12px] leading-none font-semibold text-success">
            Easy Apply
          </span>
        )}
      </div>

      <h3 className="line-clamp-2 font-display text-[19px] leading-[1.25] font-semibold text-ink">
        {/* Stretched button: the whole card opens the details; footer controls sit above it. */}
        <button
          type="button"
          onClick={() => onOpen(job)}
          className="text-left after:absolute after:inset-0 after:rounded-[18px] after:content-[''] focus-visible:outline-none group-hover:text-brand"
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

      {/* Side by side when the card has room; stacked on narrow phones. */}
      <div className="relative z-10 mt-auto flex flex-col gap-2 border-t border-line pt-4 @min-[268px]:flex-row">
        <AutomateLink className="min-w-0 flex-1" />
        <button type="button" onClick={() => onApply(job)} className={clsx(primaryButton, "shrink-0")}>
          Apply
        </button>
      </div>
    </article>
  );
}

export function JobCardSkeleton() {
  return (
    <div aria-hidden className="flex animate-pulse flex-col gap-4 rounded-[18px] border border-line bg-white p-5">
      <div className="flex items-center gap-3">
        <div className="size-11 rounded-[12px] bg-surface" />
        <div className="flex flex-1 flex-col gap-2">
          <div className="h-3.5 w-1/2 rounded bg-surface" />
          <div className="h-3 w-1/3 rounded bg-surface" />
        </div>
      </div>
      <div className="h-4 w-3/4 rounded bg-surface" />
      <div className="flex gap-2">
        <div className="h-7 w-16 rounded-[10px] bg-surface" />
        <div className="h-7 w-20 rounded-[10px] bg-surface" />
        <div className="h-7 w-24 rounded-[10px] bg-surface" />
      </div>
      <div className="h-10 rounded-full bg-surface" />
    </div>
  );
}
