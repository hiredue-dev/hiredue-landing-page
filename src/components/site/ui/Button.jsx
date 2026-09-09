"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import { assets } from "@/lib/assets";

/*
 * Two inner white highlights plus a coloured drop shadow — the exact values
 * the original uses, so the pills keep their soft "pressed metal" look.
 */
const surface = {
  primary:
    "bg-[linear-gradient(110deg,#3b82f6_0%,#406ae4_100%)] text-white shadow-[inset_4px_4px_8px_0_rgba(255,255,255,0.3),inset_-4px_-4px_8px_0_rgba(255,255,255,0.3),0_8px_16px_0_rgba(58,119,229,0.5)]",
  dark: "bg-[linear-gradient(110deg,#323232_0%,#000_100%)] text-white shadow-[inset_4px_4px_8px_0_rgba(255,255,255,0.3),inset_-4px_-4px_8px_0_rgba(255,255,255,0.3),0_8px_16px_0_rgba(29,29,29,0.5)]",
  white: "bg-white text-ink",
};

const arrowTransition = { type: "spring", bounce: 0, duration: 0.45 };

/*
 * Buttons are declared as plain hrefs in the content file. Route-shaped ones
 * ("/signup", "/download", …) go through the router so the navigation stays
 * client-side; hashes and mailto: links stay plain anchors.
 */
function Anchor({
  href,
  className,
  children,
  ...rest
}) {
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={className} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={className} {...rest}>
      {children}
    </a>
  );
}


/**
 * Arrow button. On hover the arrow leaves through the right edge while a
 * second, tilted arrow flies in from the left and straightens up; the text
 * padding swaps to follow it across.
 */
export function ArrowButton({
  label,
  href = "#",
  tone = "primary",
  size = "md",
  ring = true,
  className,
}) {
  const [hovered, setHovered] = useState(false);

  const pad =
    size === "md"
      ? { rest: { paddingLeft: 30, paddingRight: 54 }, hover: { paddingLeft: 54, paddingRight: 30 } }
      : { rest: { paddingLeft: 24, paddingRight: 40 }, hover: { paddingLeft: 40, paddingRight: 24 } };

  const arrow = (
    <Image
      src={assets.icons.arrow}
      alt=""
      width={13}
      height={9}
      className={size === "md" ? "w-3.5" : "w-3"}
    />
  );

  const bubble =
    "absolute top-2 bottom-2 aspect-square grid place-items-center rounded-full bg-white";

  return (
    <Anchor
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={clsx(
        "inline-flex shrink-0 rounded-full",
        ring && "bg-white/10 p-1.5",
        className,
      )}
    >
      <motion.span
        animate={hovered ? pad.hover : pad.rest}
        transition={arrowTransition}
        className={clsx(
          "relative flex items-center justify-center overflow-hidden rounded-full",
          size === "md" ? "py-3 text-[18px]" : "py-2.5 text-[14px]",
          "font-semibold leading-[1.3]",
          surface[tone],
        )}
      >
        {/* arrow that flies in from the left */}
        <motion.span
          className={clsx(bubble, "left-2 origin-center")}
          initial={false}
          animate={hovered ? { x: 0, rotate: 0 } : { x: -40, rotate: -45 }}
          transition={arrowTransition}
        >
          {arrow}
        </motion.span>

        <span className="relative z-1 whitespace-nowrap">{label}</span>

        {/* arrow that leaves through the right */}
        <motion.span
          className={clsx(bubble, "right-2 origin-center")}
          initial={false}
          animate={hovered ? { x: 40, rotate: 45 } : { x: 0, rotate: 0 }}
          transition={arrowTransition}
        >
          {arrow}
        </motion.span>
      </motion.span>
    </Anchor>
  );
}

/**
 * Plain pill button. The label sits in a two-deep stack that slides up on
 * hover so a second copy takes its place.
 */
export function SlideButton({
  label,
  href = "#",
  tone = "white",
  className,
}) {
  const skin =
    tone === "white"
      ? "bg-white text-ink"
      : tone === "ink"
        ? "bg-ink text-white"
        : "border border-line bg-transparent text-ink";

  return (
    <Anchor
      href={href}
      className={clsx(
        "group inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full px-11 py-[18px]",
        "text-[18px] leading-[1.3] font-semibold",
        skin,
        className,
      )}
    >
      <span className="relative block h-[23px] overflow-hidden">
        <span className="block transition-transform duration-400 ease-[cubic-bezier(0.44,0,0.56,1)] group-hover:-translate-y-[53px]">
          <span className="block whitespace-nowrap">{label}</span>
          <span aria-hidden className="mt-[30px] block whitespace-nowrap">
            {label}
          </span>
        </span>
      </span>
    </Anchor>
  );
}
