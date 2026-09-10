"use client";

import clsx from "clsx";
import { Mark } from "@/components/site/ui/Mark";
import { marks } from "@/lib/assets";
import { WHATSAPP_GREEN, WHATSAPP_NUMBER, whatsappHref } from "@/lib/whatsapp";

/**
 * Pill button that opens a WhatsApp chat in a new tab. Mirrors <SlideButton>
 * (same sizing, tones, and sliding-text hover) with a WhatsApp glyph pinned
 * to the left, so it drops into any spot a SlideButton would.
 */
export function WhatsAppButton({
  label = "Chat on WhatsApp",
  number = WHATSAPP_NUMBER,
  message,
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
    <a
      href={whatsappHref(number, message)}
      target="_blank"
      rel="noopener noreferrer"
      className={clsx(
        "group inline-flex shrink-0 items-center justify-center gap-2.5 overflow-hidden rounded-full px-9 py-[18px]",
        "text-[18px] leading-[1.3] font-semibold",
        skin,
        className,
      )}
    >
      <Mark src={marks.whatsapp} color={WHATSAPP_GREEN} className="size-5 shrink-0" />
      <span className="relative block h-[23px] overflow-hidden">
        <span className="block transition-transform duration-400 ease-[cubic-bezier(0.44,0,0.56,1)] group-hover:-translate-y-[53px]">
          <span className="block whitespace-nowrap">{label}</span>
          <span aria-hidden className="mt-[30px] block whitespace-nowrap">
            {label}
          </span>
        </span>
      </span>
    </a>
  );
}
