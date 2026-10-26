/*
 * The desktop app's installers and how to set them up, shared by the download
 * dialog on the job board and the download-started page. One list, so a new
 * build is added in one place.
 */

export const PLATFORMS = [
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

/** The released build's version, read from the installer file names (HireDue-2.3.0-arm64.dmg), so it can't fall behind the files. Null if no name carries one. */
export const APP_VERSION =
  PLATFORMS.map((p) => p.url.match(/(\d+\.\d+\.\d+)/)?.[1]).find(Boolean) ?? null;

export const SETUP = {
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

/** The build for this computer, or null. Browsers cannot tell Apple Silicon from Intel, so every Mac gets the Apple Silicon build first. */
export function detectPlatform(userAgent = typeof navigator === "undefined" ? "" : navigator.userAgent) {
  // An iPhone says "like Mac OS X", so phones are ruled out before the Mac check.
  if (/iPhone|iPad|iPod|Android|Mobile/i.test(userAgent)) return null;
  if (/Windows/i.test(userAgent)) return "windows";
  if (/Mac/i.test(userAgent)) return "mac-arm";
  return null;
}
