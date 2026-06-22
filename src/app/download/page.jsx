"use client";

import Link from "next/link";
import { Check, Clock, Download } from "lucide-react";

import styles from "./download.module.css";

const MAC_ARM_URL = process.env.NEXT_PUBLIC_DOWNLOAD_MAC_ARM || "";
const MAC_INTEL_URL = process.env.NEXT_PUBLIC_DOWNLOAD_MAC_INTEL || "";
const WINDOWS_URL = process.env.NEXT_PUBLIC_DOWNLOAD_WINDOWS || "";

const APP_VERSION = "1.0.1";

const AppleIcon = (props) => (
  <svg viewBox="0 0 384 512" aria-hidden="true" fill="currentColor" {...props}>
    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
  </svg>
);

const WindowsIcon = (props) => (
  <svg viewBox="0 0 448 512" aria-hidden="true" fill="currentColor" {...props}>
    <path d="M0 93.7l183.6-25.3v177.4H0V93.7zm0 324.6l183.6 25.3V268.4H0v149.9zm203.8 28L448 480V268.4H203.8v177.9zm0-380.6v180.1H448V32L203.8 65.7z" />
  </svg>
);

const platforms = [
  {
    key: "mac-arm",
    Icon: AppleIcon,
    name: "macOS",
    variant: "Apple Silicon (M1–M4)",
    note: "Recommended for newer Macs",
    url: MAC_ARM_URL,
    fileLabel: ".dmg",
    comingSoon: false,
  },
  {
    key: "windows",
    Icon: WindowsIcon,
    name: "Windows",
    variant: "Windows 10 & 11 (64-bit)",
    note: "Installer for PC",
    url: WINDOWS_URL,
    fileLabel: ".exe",
    comingSoon: false,
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
  },
];

function PlatformCard({ platform }) {
  const { Icon, name, variant, note, url, fileLabel, comingSoon } = platform;
  const available = !comingSoon && Boolean(url);

  return (
    <div className={`${styles.card} ${available ? "" : styles.cardDisabled}`.trim()}>
      <div className={styles.cardIcon}>
        <Icon className={styles.platformGlyph} />
      </div>
      <h2 className={styles.cardName}>{name}</h2>
      <p className={styles.cardVariant}>{variant}</p>
      <p className={styles.cardNote}>{note}</p>

      {available ? (
        <a
          href={url}
          className={styles.downloadBtn}
          download
          rel="noopener noreferrer"
        >
          <Download size={18} />
          Download {fileLabel}
        </a>
      ) : (
        <span className={styles.soonBtn}>
          <Clock size={16} />
          Coming soon
        </span>
      )}
    </div>
  );
}

export default function DownloadPage() {
  return (
    <div className={styles.page}>
      <p className={styles.eyebrow}>Desktop app</p>
      <h1 className={styles.title}>Download HireDue</h1>
      <p className={styles.subtitle}>
        Install the desktop app to start automating your job search. Pick your
        platform below — it's free to download.
      </p>

      <div className={styles.grid}>
        {platforms.map((platform) => (
          <PlatformCard key={platform.key} platform={platform} />
        ))}
      </div>

      <div className={styles.meta}>
        <span className={styles.version}>Version {APP_VERSION}</span>
        <span className={styles.metaDivider} aria-hidden="true">•</span>
        <span className={styles.metaItem}>
          <Check size={14} /> Free to install
        </span>
      </div>

      <div className={styles.notice}>
        <strong>Already installed?</strong> Open the desktop app and sign in with
        the same email and password — your subscription and account sync
        automatically. Need an account?{" "}
        <Link href="/signup" className={styles.noticeLink}>
          Sign up
        </Link>{" "}
        or{" "}
        <Link href="/login" className={styles.noticeLink}>
          log in
        </Link>
        .
      </div>
    </div>
  );
}
