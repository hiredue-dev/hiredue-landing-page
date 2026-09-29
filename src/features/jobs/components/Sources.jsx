"use client";

import clsx from "clsx";
import { groupSources, platformLabel } from "../format.js";

/*
 * How each source's round tile is drawn:
 *   mask   – a monochrome SVG painted white on the brand colour (LinkedIn, …)
 *   cover  – a square app icon that already includes its background (Naukri, Instahyre)
 *   inset  – a colour mark on transparency, shown on white (Foundit)
 *   letter – a single bold letter, no image (kept for a source with no icon at all)
 */
const SOURCES = {
  // The brand mark — the "hi" ligature from the wordmark's icon, black on white.
  hiredue: { mode: "mask", src: "/images/logos/hiredue.svg", color: "#0a0a0a" },
  linkedin: { mode: "mask", src: "/images/logos/linkedin.svg", color: "#0a66c2" },
  naukri: { mode: "cover", src: "/images/logos/naukri.png" },
  instahyre: { mode: "cover", src: "/images/logos/instahyre.png" },
  foundit: { mode: "inset", src: "/images/logos/foundit.png" },
  wellfound: { mode: "mask", src: "/images/logos/wellfound.svg", color: "#000000" },
  indeed: { mode: "mask", src: "/images/logos/indeed.svg", color: "#003a9b" },
  monster: { mode: "mask", src: "/images/logos/monster.svg", color: "#6e46ae" },
};

/** Tiles appear in this order when the source has jobs. HireDue's own crawl first. */
export const SOURCE_ORDER = ["hiredue", "linkedin", "naukri", "instahyre", "foundit", "wellfound", "indeed", "monster"];

const maskStyle = (src, size) => ({
  width: size,
  height: size,
  maskImage: `url(${src})`,
  WebkitMaskImage: `url(${src})`,
  maskSize: "contain",
  WebkitMaskSize: "contain",
  maskRepeat: "no-repeat",
  WebkitMaskRepeat: "no-repeat",
  maskPosition: "center",
  WebkitMaskPosition: "center",
});

const ring = "shadow-[0_0_0_1px_rgba(29,29,29,0.06),0_4px_10px_rgba(29,29,29,0.06)]";

export function SourceLogo({ name, size = 48 }) {
  const source = SOURCES[name];
  const box = { width: size, height: size };

  if (!source) {
    return (
      <span aria-hidden style={box} className={clsx("grid shrink-0 place-items-center rounded-full bg-dim text-white", ring)}>
        {(platformLabel(name) || "?").charAt(0)}
      </span>
    );
  }

  if (source.mode === "letter") {
    return (
      <span
        aria-hidden
        style={{ ...box, background: source.color, fontSize: Math.round(size * 0.46) }}
        className={clsx("grid shrink-0 place-items-center rounded-full font-display font-bold text-white", ring)}
      >
        {source.letter}
      </span>
    );
  }

  if (source.mode === "cover") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={source.src} alt="" aria-hidden width={size} height={size} style={box} className={clsx("shrink-0 rounded-full object-cover", ring)} />
    );
  }

  const inner = Math.round(size * (source.mode === "inset" ? 0.62 : 0.46));
  return (
    <span
      aria-hidden
      style={{ ...box, background: source.color ?? "#ffffff" }}
      className={clsx("grid shrink-0 place-items-center rounded-full", ring)}
    >
      {source.mode === "mask" ? (
        <span className="block bg-white" style={maskStyle(source.src, inner)} />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={source.src} alt="" width={inner} height={inner} style={{ width: inner, height: inner }} className="object-contain" />
      )}
    </span>
  );
}

function CircleButton({ active, label, onClick, size, children }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      title={label}
      onClick={onClick}
      className="group flex flex-col items-center gap-1.5"
      style={{ width: size + 20 }}
    >
      <span
        className={clsx(
          "rounded-full transition-shadow duration-200",
          active
            ? "shadow-[0_0_0_2px_white,0_0_0_4px_var(--color-brand)]"
            : "shadow-[0_0_0_2px_white,0_0_0_4px_transparent] group-hover:shadow-[0_0_0_2px_white,0_0_0_4px_var(--color-line)]",
        )}
      >
        {children}
      </span>
      <span className={clsx("text-[11.5px] leading-tight font-semibold whitespace-nowrap", active ? "text-brand" : "text-ink")}>
        {label}
      </span>
    </button>
  );
}

/**
 * Plain circular source filters — no pill/button chrome around them, just the
 * logo with its name underneath. Used beside the "Job listings / Hiring
 * posts" tabs, where it filters the currently-shown list by source. Starts
 * with an explicit "All" circle, since clearing the filter isn't otherwise
 * discoverable — clicking a source's own active circle also clears it.
 */
export function SourceCircles({ platforms, selected = [], onSelect, size = 40 }) {
  const counts = new Map(groupSources(platforms).map((p) => [p.name, p.count]));
  const tiles = SOURCE_ORDER.filter((name) => counts.get(name) > 0);
  if (!tiles.length) return null;

  const onlyOne = selected.length === 1 ? selected[0] : null;

  return (
    <div className="flex flex-wrap items-start gap-x-4 gap-y-2">
      <CircleButton active={selected.length === 0} label="All" onClick={() => onSelect([])} size={size}>
        <span
          aria-hidden
          style={{ width: size, height: size, fontSize: Math.round(size * 0.34) }}
          className={clsx("grid place-items-center rounded-full bg-ink font-display font-bold text-white", ring)}
        >
          All
        </span>
      </CircleButton>

      {tiles.map((name) => (
        <CircleButton
          key={name}
          active={onlyOne === name}
          label={platformLabel(name)}
          onClick={() => onSelect(onlyOne === name ? [] : [name])}
          size={size}
        >
          <SourceLogo name={name} size={size} />
        </CircleButton>
      ))}
    </div>
  );
}
