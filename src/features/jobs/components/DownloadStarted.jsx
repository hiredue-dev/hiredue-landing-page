"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Clock, Download, FileText, LayoutDashboard, Lock } from "lucide-react";
import clsx from "clsx";
import { Eyebrow, Reveal } from "@/components/site/ui/Primitives";
import { YouTubeEmbed } from "@/components/site/ui/YouTubeEmbed";
import { EVENTS, trackEvent } from "@/lib/analytics";
import { assets } from "@/lib/assets";
import { detectPlatform, PLATFORMS } from "../downloads.js";
import { getJob } from "../services/jobBoardService.js";
import { darkButton, secondaryButton } from "./ui.jsx";

// The product demo on YouTube, the same one sent with onboarding calendar invites; the env var overrides it when the video changes.
const DEMO_VIDEO_URL = process.env.NEXT_PUBLIC_DEMO_VIDEO_URL || "https://www.youtube.com/watch?v=Slh8o5oQRU4";

/** Why install, from the job seeker's side. Benefits, not features, and nothing the app cannot do. */
const BENEFITS = [
  {
    icon: Clock,
    title: "Your evenings back",
    body: "Each application you fill by hand takes a quarter of an hour or more. HireDue fills them from your profile while you do something else, and you review what went out.",
  },
  {
    icon: FileText,
    title: "A resume written for every posting",
    body: "Screening software reads your resume before a person does. HireDue rewrites it for each role so the right words are there, and you keep every version.",
  },
  {
    icon: LayoutDashboard,
    title: "One place to see where you stand",
    body: "Jobs found, resumes tailored, applications sent and recruiters contacted, in one dashboard instead of a spreadsheet and six tabs.",
  },
  {
    icon: Lock,
    title: "Your data stays on your laptop",
    body: "Your resume, your logins and your applications live on your own computer. Nothing is stored for you on a server you cannot see.",
  },
];

/**
 * Where "Auto-apply with HireDue" lands once the visitor is signed in. The
 * installer for this computer starts on its own, and the page uses the wait to
 * say what the app does, since most people arriving here have never seen it.
 *
 * The download is started in a hidden iframe rather than by navigating: a
 * browser that refuses a download with no click (Safari, some managed Chromes)
 * then leaves the page in place with the button still there.
 */
export function DownloadStarted() {
  const searchParams = useSearchParams();
  const jobId = searchParams.get("job");
  const [platformKey, setPlatformKey] = useState(null);
  const [started, setStarted] = useState(false);
  const [job, setJob] = useState(null);

  useEffect(() => {
    const key = detectPlatform();
    setPlatformKey(key);
    const build = PLATFORMS.find((p) => p.key === key);
    if (build?.url && !build.comingSoon) setStarted(true);
    trackEvent(EVENTS.downloadStarted, { platform: key ?? "none", auto: !!(build?.url && !build.comingSoon), job_id: jobId ?? undefined });
  }, [jobId]);

  useEffect(() => {
    if (!jobId) return undefined;
    let cancelled = false;
    getJob(jobId)
      .then((response) => !cancelled && response.success && response.data && setJob(response.data))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [jobId]);

  const build = PLATFORMS.find((p) => p.key === platformKey && p.url && !p.comingSoon) ?? null;
  const others = PLATFORMS.filter((p) => p.key !== build?.key && p.url && !p.comingSoon);
  const manualHref = jobId ? `/jobs?apply=${encodeURIComponent(jobId)}` : "/jobs";

  return (
    <section className="relative pt-[140px] pb-[100px] min-[810px]:pt-[170px] min-[810px]:pb-[140px]">
      <div className="mx-auto w-full max-w-[1100px] px-[20px] sm:px-[30px]">
        <div className="flex flex-col gap-[50px]">
          <Reveal className="mx-auto flex max-w-[720px] flex-col items-center gap-4 text-center">
            <Eyebrow>{started ? "Download started" : "Download HireDue"}</Eyebrow>
            <h1 className="t-h2">
              {started ? `Your download for ${build.name} has started.` : "Get the HireDue desktop app"}
            </h1>
            <p className="t-body-lg max-w-[560px]">
              {job
                ? `Open it when it finishes and sign in. From then on HireDue finds roles like ${job.jobTitle}${job.hiringCompany ? ` at ${job.hiringCompany}` : ""} and applies for you.`
                : "Open it when it finishes and sign in. From then on HireDue finds roles that fit you and applies for you."}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {build && (
                <a href={build.url} download rel="noopener noreferrer" className={clsx(darkButton, "h-12 px-6 text-[15px]")}>
                  <Download size={16} aria-hidden /> {started ? "Download didn't start? Try again" : `Download for ${build.name}`} ({build.file})
                </a>
              )}
              {others.map((p) => (
                <a key={p.key} href={p.url} download rel="noopener noreferrer" className={clsx(secondaryButton, "h-12")}>
                  {p.name} {p.file}
                </a>
              ))}
            </div>
            {/* Quiet, like the job dialog's manual link: still a real way out for someone who wants the form now. */}
            <Link href={manualHref} className="text-[14px] font-medium text-dim underline-offset-4 hover:text-ink hover:underline">
              Apply manually instead
            </Link>
          </Reveal>

          <Reveal y={30} className="mx-auto w-full max-w-[900px] rounded-[20px] bg-white p-1.5">
            <YouTubeEmbed url={DEMO_VIDEO_URL} fallbackSrc={assets.overview.dashboard} fallbackAlt="HireDue live dashboard" className="w-full rounded-[14px]" />
          </Reveal>

          <Reveal delay={0.1} className="flex flex-col gap-6">
            <div className="mx-auto flex max-w-[640px] flex-col items-center gap-2 text-center">
              <h2 className="t-h3">What changes once HireDue is running</h2>
              <p className="t-body-lg">The app does the part of a job search that eats your time, so the part that needs you gets it.</p>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {BENEFITS.map(({ icon: Icon, title, body }) => (
                <div key={title} className="flex gap-4 rounded-[20px] bg-white p-6">
                  <span className="grid size-10 shrink-0 place-items-center rounded-[12px] bg-ice text-brand">
                    <Icon size={18} aria-hidden />
                  </span>
                  <div className="flex flex-col gap-1.5">
                    <h3 className="text-[17px] font-semibold text-ink">{title}</h3>
                    <p className="t-body">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      {/* The hidden frame is what starts the download; it is added only after the build is known so it never points at an empty URL. */}
      {started && <iframe src={build.url} title="HireDue installer download" hidden />}
    </section>
  );
}
