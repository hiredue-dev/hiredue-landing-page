"use client";

import { useEffect, useState } from "react";
import { Clock, Download, MonitorDown } from "lucide-react";
import clsx from "clsx";
import { useAuth } from "@/features/auth/context/AuthContext.jsx";
import { Steps } from "./AccountFlow.jsx";
import { Dialog, darkButton, primaryButton, secondaryButton } from "./ui.jsx";

const PLATFORMS = [
  {
    key: "mac-arm",
    name: "macOS",
    variant: "Apple Silicon (M1 and newer)",
    url: process.env.NEXT_PUBLIC_DOWNLOAD_MAC_ARM || "",
    file: ".dmg",
    os: "mac",
  },
  {
    key: "windows",
    name: "Windows",
    variant: "Windows 10 & 11, 64-bit",
    url: process.env.NEXT_PUBLIC_DOWNLOAD_WINDOWS || "",
    file: ".exe",
    os: "windows",
  },
  {
    key: "mac-intel",
    name: "macOS",
    variant: "Intel Macs",
    url: process.env.NEXT_PUBLIC_DOWNLOAD_MAC_INTEL || "",
    file: ".dmg",
    os: "mac",
    comingSoon: !process.env.NEXT_PUBLIC_DOWNLOAD_MAC_INTEL,
  },
];

const SETUP = {
  mac: [
    "Open the HireDue .dmg from your Downloads.",
    "Drag HireDue into your Applications folder.",
    "Open HireDue from Applications. If macOS asks, confirm you want to open it.",
  ],
  windows: [
    "Open the HireDue installer (.exe) from your Downloads.",
    "Follow the installer. It takes under a minute.",
    "Launch HireDue from the Start menu.",
  ],
};

const STEPS = ["Download", "Set up"];

/** Browsers can't tell Apple Silicon from Intel, so every Mac gets the Apple Silicon build first. */
function detectPlatform() {
  const ua = typeof navigator === "undefined" ? "" : navigator.userAgent;
  if (/Windows/i.test(ua)) return "windows";
  if (/Mac/i.test(ua)) return "mac-arm";
  return null;
}

/**
 * "Automate with HireDue": download the desktop app, then how to set it up.
 * Deliberately doesn't ask for a HireDue account first — that's a separate
 * decision from "get the installer," and the app itself asks for sign-in (or
 * sign-up) once it's running. Applying to one job through the web (the Apply
 * button elsewhere) and installing the app to automate everything are two
 * different things a visitor can want, so they're two different dialogs
 * rather than one flow folded into the other.
 */
export function DownloadDialog({ open, onClose }) {
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [detected, setDetected] = useState(null);

  useEffect(() => {
    if (!open) return;
    setDetected(detectPlatform());
    setChosen(null);
    setStep(0);
  }, [open]);

  const ordered = [...PLATFORMS].sort((a, b) => (b.key === detected) - (a.key === detected));
  const platform = PLATFORMS.find((p) => p.key === chosen);

  return (
    <Dialog open={open} onClose={onClose} labelledBy="download-dialog-title">
      <div className="flex flex-col gap-5 overflow-y-auto p-6 pt-7">
        <div className="flex flex-col gap-3 pr-8">
          <span className="grid size-11 place-items-center rounded-full bg-ink text-white">
            <MonitorDown size={19} aria-hidden />
          </span>
          <div className="flex flex-col gap-1">
            <h2 id="download-dialog-title" className="t-h5">
              Let HireDue apply for you
            </h2>
            <p className="t-body">
              The desktop app finds jobs like these and applies on your behalf. Free to install.
            </p>
          </div>
        </div>

        <Steps steps={STEPS} current={step} />

        {step === 0 && (
          <div className="flex flex-col gap-3">
            {ordered.map((p) => {
              const available = !p.comingSoon && !!p.url;
              const suggested = p.key === detected;
              return (
                <div
                  key={p.key}
                  className={clsx(
                    "flex items-center gap-4 rounded-[15px] border p-4",
                    suggested ? "border-brand/40 bg-ice/60" : "border-line",
                    !available && "opacity-60",
                  )}
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white text-ink shadow-[0_2px_8px_rgba(29,29,29,0.08)]">
                    {p.os === "mac" ? <AppleIcon className="size-[18px]" /> : <WindowsIcon className="size-[17px]" />}
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <p className="flex flex-wrap items-center gap-2 text-[15px] font-semibold text-ink">
                      {p.name}
                      {suggested && (
                        <span className="rounded-full bg-brand px-2 py-0.5 text-[11px] leading-none font-semibold text-white">
                          Your computer
                        </span>
                      )}
                    </p>
                    <p className="truncate text-[13px] text-dim">{p.variant}</p>
                  </div>
                  {available ? (
                    <a
                      href={p.url}
                      download
                      rel="noopener noreferrer"
                      onClick={() => {
                        setChosen(p.key);
                        setStep(1);
                      }}
                      className={clsx(suggested ? darkButton : secondaryButton, "h-10 shrink-0 px-4 text-[14px]")}
                    >
                      <Download size={15} aria-hidden /> {p.file}
                    </a>
                  ) : (
                    <span className="inline-flex shrink-0 items-center gap-1.5 text-[13px] font-semibold text-dim">
                      <Clock size={14} aria-hidden /> Coming soon
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {step === 1 && platform && (
          <div className="flex flex-col gap-4">
            <p className="rounded-[12px] bg-success-10 px-4 py-3 text-[14px] font-medium text-success">
              Your download for {platform.name} ({platform.variant}) has started.
            </p>
            <ol className="flex flex-col gap-3">
              {[
                ...SETUP[platform.os],
                user?.email
                  ? `Sign in with ${user.email} and your password.`
                  : "Sign in with your HireDue account — sign up first if you don't have one yet.",
              ].map((text, index) => (
                <li key={text} className="flex gap-3 text-[15px] leading-[1.5] text-ink">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-surface text-[12px] font-semibold text-dim">
                    {index + 1}
                  </span>
                  <span className="pt-px">{text}</span>
                </li>
              ))}
            </ol>
            <button type="button" onClick={onClose} className={clsx(primaryButton, "h-12 text-[15px]")}>
              Done
            </button>
            <p className="text-center text-[14px] text-dim">
              Download didn&apos;t start?{" "}
              <a href={platform.url} download rel="noopener noreferrer" className="font-semibold text-brand hover:underline">
                Try again
              </a>{" "}
              or{" "}
              <button type="button" onClick={() => setStep(0)} className="font-semibold text-brand hover:underline">
                pick another version
              </button>
            </p>
          </div>
        )}
      </div>
    </Dialog>
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
