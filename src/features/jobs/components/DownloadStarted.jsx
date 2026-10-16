"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check, Download } from "lucide-react";
import clsx from "clsx";
import { Eyebrow, Reveal } from "@/components/site/ui/Primitives";
import { YouTubeEmbed } from "@/components/site/ui/YouTubeEmbed";
import { useAuth } from "@/features/auth/context/AuthContext.jsx";
import { EVENTS, trackEvent } from "@/lib/analytics";
import { assets } from "@/lib/assets";
import { steps } from "@/lib/content";
import { detectPlatform, PLATFORMS, SETUP } from "../downloads.js";
import { getJob } from "../services/jobBoardService.js";
import { darkButton, secondaryButton } from "./ui.jsx";

const DEMO_VIDEO_URL = process.env.NEXT_PUBLIC_DEMO_VIDEO_URL || "";

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
  const { user } = useAuth();
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

          <Reveal y={30} className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="rounded-[20px] bg-white p-1.5">
              <YouTubeEmbed url={DEMO_VIDEO_URL} fallbackSrc={assets.overview.dashboard} fallbackAlt="HireDue live dashboard" className="w-full rounded-[14px]" />
            </div>
            <div className="flex flex-col gap-4 rounded-[20px] bg-surface p-6">
              <h2 className="t-h5">{build ? `Set up on ${build.name}` : "Set up"}</h2>
              <ol className="flex flex-col gap-3">
                {[
                  ...(build ? SETUP[build.os] : ["Download the installer for your computer above."]),
                  user?.email ? `Sign in with ${user.email}.` : "Sign in with your HireDue account.",
                ].map((text, index) => (
                  <li key={text} className="flex gap-3 text-[15px] leading-[1.5] text-ink">
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-white text-[12px] font-semibold text-dim">{index + 1}</span>
                    <span className="pt-px">{text}</span>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="flex flex-col gap-6">
            <h2 className="t-h3 text-center">What happens once it is running</h2>
            <div className="grid gap-5 md:grid-cols-3">
              {steps.items.slice(1).map((item) => (
                <div key={item.title} className="flex flex-col gap-2 rounded-[20px] bg-white p-6">
                  <span className="inline-flex size-8 items-center justify-center rounded-full bg-success-10 text-success">
                    <Check size={16} aria-hidden />
                  </span>
                  <h3 className="text-[17px] font-semibold text-ink">{item.title}</h3>
                  <p className="t-body">{item.description}</p>
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
