"use client";

import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";

/** Accepts a full YouTube URL (watch/share/embed) or a bare video ID. */
function extractYouTubeId(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") return u.pathname.slice(1) || null;
    const v = u.searchParams.get("v");
    if (v) return v;
    const embedMatch = u.pathname.match(/\/embed\/([^/?]+)/);
    if (embedMatch) return embedMatch[1];
    return null;
  } catch {
    return /^[\w-]{6,}$/.test(url) ? url : null;
  }
}

/**
 * Click-to-play YouTube facade: shows the thumbnail until clicked, so the
 * iframe (and YouTube's JS) never loads unless someone actually wants the
 * video. Falls back to a plain image when no URL is configured or it can't
 * be parsed into a video ID.
 */
export function YouTubeEmbed({ url, fallbackSrc, fallbackAlt = "", className }) {
  const [playing, setPlaying] = useState(false);
  const videoId = extractYouTubeId(url);

  if (!videoId) {
    return (
      <Image
        src={fallbackSrc}
        alt={fallbackAlt}
        width={1920}
        height={1080}
        unoptimized
        sizes="(max-width: 1260px) 100vw, 1188px"
        className={className}
      />
    );
  }

  if (playing) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
        title="HireDue product demo"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className={clsx("aspect-video w-full", className)}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label="Play the product demo"
      className={clsx("group relative block aspect-video w-full overflow-hidden", className)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- external host, intentionally unoptimized */}
      <img
        src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
        alt=""
        className="h-full w-full object-cover"
      />
      <span className="absolute inset-0 flex items-center justify-center bg-ink/20 transition-colors duration-200 group-hover:bg-ink/30">
        <span className="grid size-20 place-items-center rounded-full bg-white/95 shadow-[0_10px_30px_rgba(0,0,0,0.25)] transition-transform duration-200 group-hover:scale-105">
          <PlayIcon className="ml-1 size-7 text-ink" />
        </span>
      </span>
    </button>
  );
}

function PlayIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M8 5.14v13.72a1 1 0 0 0 1.53.85l10.9-6.86a1 1 0 0 0 0-1.7L9.53 4.29A1 1 0 0 0 8 5.14Z" />
    </svg>
  );
}
