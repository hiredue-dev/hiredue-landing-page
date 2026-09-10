"use client";

import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { motion } from "framer-motion";
import { Eyebrow, Reveal } from "@/components/site/ui/Primitives";
import { assets } from "@/lib/assets";
import { downloadPage } from "@/lib/content";

const MAC_ARM_URL = process.env.NEXT_PUBLIC_DOWNLOAD_MAC_ARM || "";
const MAC_INTEL_URL = process.env.NEXT_PUBLIC_DOWNLOAD_MAC_INTEL || "";
const WINDOWS_URL = process.env.NEXT_PUBLIC_DOWNLOAD_WINDOWS || "";

const platforms = [
  {
    key: "mac-arm",
    Icon: AppleIcon,
    name: "macOS",
    variant: "Apple Silicon",
    note: "For newer Macs",
    url: MAC_ARM_URL,
    fileLabel: ".dmg",
    bg: assets.useCases[2].card,
  },
  {
    key: "windows",
    Icon: WindowsIcon,
    name: "Windows",
    variant: "Windows 10 & 11 (64-bit)",
    note: "Installer for PC",
    url: WINDOWS_URL,
    fileLabel: ".exe",
    bg: assets.useCases[1].card,
  },
  {
    key: "mac-intel",
    Icon: AppleIcon,
    name: "macOS",
    variant: "Intel-based Macs",
    note: "We're polishing this build",
    url: MAC_INTEL_URL,
    fileLabel: ".dmg",
    comingSoon: true,
    bg: assets.useCases[2].card,
  },
];

export function DownloadHero() {
  return (
    <section className="relative pt-[140px] pb-[100px] min-[810px]:pt-[170px] min-[810px]:pb-[160px] min-[1200px]:pt-[194px] min-[1200px]:pb-[200px]">
      <div className="mx-auto w-full max-w-[1100px] px-[30px]">
        <div className="flex flex-col items-center gap-[50px]">
          <Reveal className="flex flex-col items-center gap-2.5">
            <Eyebrow>{downloadPage.eyebrow}</Eyebrow>
            <h1 className="t-h2 text-center">{downloadPage.title}</h1>
            <p className="t-body-lg max-w-[520px] text-center">{downloadPage.description}</p>
          </Reveal>

          <Reveal y={30} className="grid w-full gap-5 md:grid-cols-3">
            {platforms.map((platform) => (
              <PlatformCard key={platform.key} platform={platform} />
            ))}
          </Reveal>

          <Reveal delay={0.1} className="flex flex-col items-center gap-5">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <span className="t-body-sm">{downloadPage.version}</span>
              <span className="size-1 rounded-full bg-dim" />
              <span className="flex items-center gap-1.5 text-[14px] leading-[1.3] font-medium text-dim">
                <Image src={assets.icons.checkGreen} alt="" width={14} height={14} className="size-3.5" />
                {downloadPage.freeNote}
              </span>
            </div>

            <div className="max-w-[620px] rounded-[20px] bg-surface px-6 py-5 text-center">
              <p className="t-body">
                <strong className="font-semibold text-ink">{downloadPage.notice.heading}</strong>{" "}
                {downloadPage.notice.body} Need an account?{" "}
                <Link
                  href={downloadPage.notice.cta.href}
                  className="font-semibold text-brand underline decoration-brand/30 underline-offset-2"
                >
                  {downloadPage.notice.cta.label}
                </Link>{" "}
                or{" "}
                <Link
                  href="/login"
                  className="font-semibold text-brand underline decoration-brand/30 underline-offset-2"
                >
                  {downloadPage.notice.altCta.label}
                </Link>
                .
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function PlatformCard({ platform }) {
  const { Icon, name, variant, note, url, fileLabel, comingSoon, bg } = platform;
  const available = !comingSoon && Boolean(url);

  return (
    <div
      className={clsx(
        "relative h-[420px] w-full overflow-hidden rounded-[30px] p-2.5",
        comingSoon && "opacity-70",
      )}
    >
      <Image
        src={bg}
        alt=""
        fill
        sizes="(max-width: 810px) 100vw, 340px"
        className={clsx("object-cover", comingSoon && "grayscale")}
      />

      <div className="relative flex h-full flex-col justify-between rounded-[20px] bg-white/30 p-[26px] backdrop-blur-[2px]">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <h3 className="t-h4">{name}</h3>
            <p className="t-body-lg">{variant}</p>
          </div>
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-ink shadow-[0_4px_10px_rgba(0,0,0,0.1)]">
            <Icon className="size-[18px]" />
          </span>
        </div>

        <div className="flex flex-col gap-3">
          <p className="t-body">{note}</p>

          {available ? (
            <motion.a
              href={url}
              download
              rel="noopener noreferrer"
              initial="rest"
              whileHover="hover"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 text-[15px] font-semibold text-white transition-opacity duration-200 hover:opacity-90"
            >
              <motion.span
                className="inline-flex"
                variants={{
                  rest: { y: 0 },
                  hover: {
                    y: [0, 3, 0],
                    transition: { duration: 1.4, repeat: Infinity, ease: "easeInOut" },
                  },
                }}
              >
                <DownloadIcon className="size-4" />
              </motion.span>
              Download {fileLabel}
            </motion.a>
          ) : (
            <span className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white/70 px-6 py-3.5 text-[15px] font-semibold text-dim">
              <ClockIcon className="size-4" />
              Coming soon
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function AppleIcon(props) {
  return (
    <svg viewBox="0 0 384 512" fill="currentColor" aria-hidden {...props}>
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
    </svg>
  );
}

function WindowsIcon(props) {
  return (
    <svg viewBox="0 0 448 512" fill="currentColor" aria-hidden {...props}>
      <path d="M0 93.7l183.6-25.3v177.4H0V93.7zm0 324.6l183.6 25.3V268.4H0v149.9zm203.8 28L448 480V268.4H203.8v177.9zm0-380.6v180.1H448V32L203.8 65.7z" />
    </svg>
  );
}

function DownloadIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <path
        d="M12 3v12m0 0l-4.5-4.5M12 15l4.5-4.5M4 20h16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ClockIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 7v5l3.5 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
