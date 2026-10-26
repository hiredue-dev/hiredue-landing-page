"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown, X } from "lucide-react";
import clsx from "clsx";
import { buttonClass } from "@/components/site/ui/Button";
import useBodyScrollLock from "@/hooks/useBodyScrollLock.js";
import useDialogFocus from "@/hooks/useDialogFocus.js";

/* The tools' button looks, from the site's one Button (components/site/ui/Button). */
export const primaryButton = buttonClass({ variant: "primary", size: "tool" });

export const secondaryButton = buttonClass({ variant: "outline", size: "tool" });

// No padding or font size here: set them where it is used, since two conflicting
// utilities on one element resolve by CSS order, not by which was passed last.
export const darkButton = clsx(buttonClass({ variant: "dark", size: null }), "whitespace-nowrap");

export function CompanyLogo({ src, name, size = 48 }) {
  const [failed, setFailed] = useState(false);
  const box = { width: size, height: size };

  if (!src || failed) {
    return (
      <div
        aria-hidden
        style={box}
        className="grid shrink-0 place-items-center rounded-[12px] bg-surface text-[18px] font-semibold text-dim"
      >
        {(name || "?").trim().charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    // Logos come from many third-party CDNs (and some expire), so next/image's
    // remotePatterns allow-list doesn't fit; a failed load falls back to the initial.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      style={box}
      className="shrink-0 rounded-[12px] border border-line bg-white object-contain"
    />
  );
}

export function Badge({ children, tone = "surface" }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[12px] leading-none font-semibold",
        tone === "brand" && "bg-ice text-brand",
        tone === "success" && "bg-success-10 text-success",
        tone === "surface" && "bg-surface text-dim",
      )}
    >
      {children}
    </span>
  );
}

/**
 * Bottom sheet on phones, centred dialog from `sm` up. Closes on Escape and
 * on a click outside the panel.
 */
export function Dialog({ open, onClose, labelledBy, size = "md", children }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useBodyScrollLock(open);
  const panelRef = useDialogFocus(open && mounted, onClose);

  if (!open || !mounted) return null;

  return createPortal(
    <div
      role="presentation"
      onClick={onClose}
      className="fixed inset-0 z-[90] flex items-end justify-center bg-ink/40 backdrop-blur-[2px] sm:items-center sm:p-6"
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        className={clsx(
          "relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-[20px] outline-none bg-white shadow-[0_24px_60px_rgba(0,0,0,0.2)] sm:rounded-[20px]",
          size === "lg" ? "sm:max-w-[760px]" : "sm:max-w-[480px]",
        )}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 grid size-9 place-items-center rounded-full border border-line bg-white text-dim transition-colors after:absolute after:-inset-1 after:content-[''] hover:bg-surface"
        >
          <X size={18} />
        </button>
        {children}
      </div>
    </div>,
    document.body,
  );
}

/**
 * Button + floating panel, used for the search bar's dropdowns. Closes on an
 * outside click or Escape; the panel is rendered in place so it scrolls with the bar.
 */
/** `align="end"` pins the panel to the button's right edge below `lg`, for a dropdown sitting on the right of a phone row. */
export function Dropdown({ icon: Icon, label, placeholder, open, onOpenChange, children, className, align = "start" }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onPointer = (event) => {
      if (ref.current && !ref.current.contains(event.target)) onOpenChange(false);
    };
    const onKey = (event) => {
      if (event.key === "Escape") onOpenChange(false);
    };
    document.addEventListener("mousedown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onOpenChange]);

  return (
    <div ref={ref} className={clsx("relative", className)}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => onOpenChange(!open)}
        className="flex h-full min-h-12 w-full items-center gap-2 px-4 text-left text-[14.5px] font-medium"
      >
        {Icon && <Icon size={17} className="shrink-0 text-dim" aria-hidden />}
        <span className={clsx("min-w-0 flex-1 truncate", label ? "text-ink" : "text-dim")}>
          {label || placeholder}
        </span>
        <ChevronDown
          size={18}
          aria-hidden
          className={clsx("shrink-0 text-dim transition-transform duration-200", open && "rotate-180")}
        />
      </button>
      {open && (
        <div className={clsx("absolute top-[calc(100%+8px)] z-30 w-full min-w-[260px] overflow-hidden rounded-[15px] border border-line bg-white p-1.5 shadow-[0_18px_40px_rgba(29,29,29,0.12)]", align === "end" ? "right-0 lg:right-auto lg:left-0" : "left-0")}>
          {children}
        </div>
      )}
    </div>
  );
}

export function DropdownOption({ selected, onSelect, children }) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      onClick={onSelect}
      className={clsx(
        "flex w-full items-center justify-between gap-3 rounded-[10px] px-3.5 py-2.5 text-left text-[15px] font-medium transition-colors",
        selected ? "bg-surface text-ink" : "text-dim hover:bg-surface hover:text-ink",
      )}
    >
      <span className="min-w-0 truncate">{children}</span>
      {selected && <Check size={16} className="shrink-0 text-brand" aria-hidden />}
    </button>
  );
}

/** Checkbox row with a count pill — the sidebar's filter lists. */
export function CheckRow({ checked, onChange, label, count, type = "checkbox", name }) {
  return (
    <label className="group flex cursor-pointer items-center gap-3 py-1.5">
      <input type={type} name={name} checked={checked} onChange={onChange} className="peer sr-only" />
      <span
        aria-hidden
        className={clsx(
          "grid size-[22px] shrink-0 place-items-center border-[1.5px] transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-brand/40",
          type === "radio" ? "rounded-full" : "rounded-[6px]",
          checked ? "border-ink bg-ink text-white" : "border-line bg-white group-hover:border-grey",
        )}
      >
        {checked &&
          (type === "radio" ? (
            <span className="size-2 rounded-full bg-white" />
          ) : (
            <Check size={14} strokeWidth={3} />
          ))}
      </span>
      <span className="min-w-0 flex-1 truncate text-[15px] font-medium text-ink">{label}</span>
      {count != null && (
        <span className="rounded-full bg-surface px-2 py-0.5 text-[12px] font-semibold text-dim">
          {count.toLocaleString()}
        </span>
      )}
    </label>
  );
}
