"use client";

import { motion } from "framer-motion";
import clsx from "clsx";
import { inView, rise } from "@/lib/motion";

/** Small capsule label that sits above every section headline. */
export function Eyebrow({
  children,
  tone = "surface",
  className,
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-2.5 rounded-full px-5 py-2.5",
        "text-[14px] leading-[1.3] font-medium text-ink",
        tone === "surface" ? "bg-surface" : "bg-white",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Fade-and-rise wrapper used for every scroll-triggered entrance. */
export function Reveal({
  children,
  y = 20,
  delay = 0,
  duration = 0.6,
  className,
  as = "div",
}) {
  const Tag = motion[as];
  return (
    <Tag
      {...inView}
      variants={rise(y, duration)}
      transition={{ delay }}
      className={className}
    >
      {children}
    </Tag>
  );
}

/** Parent for staggered reveals — children should be <Reveal> or motion nodes. */
export function RevealGroup({
  children,
  step = 0.1,
  delayChildren = 0,
  className,
}) {
  return (
    <motion.div
      {...inView}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: step, delayChildren } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Child of <RevealGroup>: inherits the parent's stagger timing. */
export function RevealItem({
  children,
  y = 20,
  duration = 0.6,
  className,
  style,
}) {
  return (
    <motion.div variants={rise(y, duration)} className={className} style={style}>
      {children}
    </motion.div>
  );
}

/**
 * Seamless horizontal marquee. Renders the row twice and translates a full
 * copy width, so the loop has no visible seam.
 */
export function Marquee({
  children,
  duration = 40,
  reverse = false,
  gap = 70,
  pauseOnHover = true,
  className,
}) {
  const group = (
    <div
      className="flex shrink-0 items-center"
      style={{ gap: `${gap}px`, paddingRight: `${gap}px` }}
    >
      {children}
    </div>
  );

  return (
    <div className={clsx("marquee-root relative overflow-hidden", className)}>
      <div
        className="marquee-track"
        style={
          {
            "--marquee-duration": `${duration}s`,
            "--marquee-direction": reverse ? "reverse" : "normal",
            "--marquee-hover": pauseOnHover ? "paused" : "running",
          }
        }
      >
        {group}
        <div aria-hidden className="contents">
          {group}
        </div>
      </div>
    </div>
  );
}
