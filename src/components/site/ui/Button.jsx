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
  ink: "bg-ink text-white",
  outline: "border border-line bg-white text-ink hover:bg-surface hover:opacity-100",
  // on a dark panel (the /account plan card)
  ghost: "bg-white/10 text-white ring-1 ring-white/25 hover:bg-white/15 hover:opacity-100",
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
  /* Full external URLs (wa.me, social links, …) open in a new tab so we
     don't navigate the visitor away from the site entirely. */
  const external = /^https?:\/\//.test(href);
  return (
    <a
      href={href}
      className={className}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...rest}
    >
      {children}
    </a>
  );
}


const SIZE = {
  md: "min-h-11 px-[30px] py-3 text-[18px]",
  sm: "min-h-11 px-5 py-2.5 text-[14px]",
  // the tools' compact controls (job board, ATS checker, dialogs)
  tool: "px-5 py-2.5 text-[14px]",
};

/**
 * The button's look as classes, for controls that can't be a <Button> (a
 * <label>, a download <a>, the tools' class constants). `size: null` leaves
 * padding and type size to the caller.
 */
export function buttonClass({ variant = "primary", size = "md" } = {}) {
  return clsx(
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold leading-[1.3] transition-opacity duration-200 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60",
    size && SIZE[size],
    surface[variant],
  );
}

/**
 * The site's one button. A link when given `href` (routes go through the
 * router, external URLs open in a new tab), otherwise a <button>.
 *
 *   variant  primary (the sign-up action) · dark · white · ink · outline · ghost
 *   size     md · sm (navbar), both at least 44px tall · tool (compact)
 *   effect   none · "arrow" (an arrow bubble that swaps on hover)
 *            · "slide" (the label slides up to a second copy on hover)
 *   ring     the faint halo the hero and footer CTAs sit in
 *
 * Extra classes (e.g. `w-full`) go on the outer element.
 */
export function Button({
  children,
  href,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  effect,
  ring = false,
  disabled,
  className,
}) {
  if (effect === "arrow") {
    return (
      <ArrowButton href={href} onClick={onClick} variant={variant} size={size} ring={ring} className={className}>
        {children}
      </ArrowButton>
    );
  }
  if (effect === "slide") {
    return (
      <SlideButton href={href} onClick={onClick} variant={variant} className={className}>
        {children}
      </SlideButton>
    );
  }

  const pill = clsx(buttonClass({ variant, size }), "shrink-0 whitespace-nowrap");
  const inner = ring ? <span className={clsx(pill, "w-full")}>{children}</span> : children;
  const outer = ring ? clsx("inline-flex shrink-0 rounded-full bg-white/10 p-1.5", className) : clsx(pill, className);

  return href ? (
    <Anchor href={href} onClick={onClick} className={outer}>
      {inner}
    </Anchor>
  ) : (
    <button type={type} onClick={onClick} disabled={disabled} className={outer}>
      {inner}
    </button>
  );
}

/*
 * Arrow effect. On hover the arrow leaves through the right edge while a
 * second, tilted arrow flies in from the left and straightens up; the text
 * padding swaps to follow it across.
 */
function ArrowButton({ children, href, onClick, variant, size, ring, className }) {
  const [hovered, setHovered] = useState(false);

  const pad =
    size === "md"
      ? { rest: { paddingLeft: 30, paddingRight: 54 }, hover: { paddingLeft: 54, paddingRight: 30 } }
      : { rest: { paddingLeft: 24, paddingRight: 40 }, hover: { paddingLeft: 40, paddingRight: 24 } };

  const arrow = (
    <Image src={assets.icons.arrow} alt="" width={13} height={9} className={size === "md" ? "w-3.5" : "w-3"} />
  );

  const bubble = "absolute top-2 bottom-2 aspect-square grid place-items-center rounded-full bg-white";
  const Outer = href ? Anchor : "button";

  return (
    <Outer
      {...(href ? { href } : { type: "button" })}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={clsx("inline-flex shrink-0 rounded-full", ring && "bg-white/10 p-1.5", className)}
    >
      <motion.span
        animate={hovered ? pad.hover : pad.rest}
        transition={arrowTransition}
        className={clsx(
          "relative flex min-h-11 items-center justify-center overflow-hidden rounded-full",
          size === "md" ? "py-3 text-[18px]" : "py-2.5 text-[14px]",
          "font-semibold leading-[1.3]",
          surface[variant],
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

        <span className="relative z-1 whitespace-nowrap">{children}</span>

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
    </Outer>
  );
}

/*
 * Slide effect. The label sits in a two-deep stack that slides up on hover
 * so a second copy takes its place. Flat surfaces only (white, ink, outline).
 */
function SlideButton({ children, href, onClick, variant, className }) {
  const Outer = href ? Anchor : "button";
  return (
    <Outer
      {...(href ? { href } : { type: "button" })}
      onClick={onClick}
      className={clsx(
        "group inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full px-11 py-[18px]",
        "text-[18px] leading-[1.3] font-semibold",
        surface[variant],
        className,
      )}
    >
      <span className="relative block h-[23px] overflow-hidden">
        <span className="block transition-transform duration-400 ease-[cubic-bezier(0.44,0,0.56,1)] group-hover:-translate-y-[53px] motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">
          <span className="block whitespace-nowrap">{children}</span>
          <span aria-hidden className="mt-[30px] block whitespace-nowrap">
            {children}
          </span>
        </span>
      </span>
    </Outer>
  );
}
