"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { security } from "@/lib/content";

function LockIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <rect x="5" y="11" width="14" height="10" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 11V8a4 4 0 018 0v3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="15.5" r="1.4" fill="currentColor" />
    </svg>
  );
}

function LaptopIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <rect x="4" y="4" width="16" height="11" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M2 19h20l-1.5-3h-17z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function CloudIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <path
        d="M7 18a4 4 0 01-.5-7.97A5 5 0 0116.9 9.05 4 4 0 0117 18H7z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** The local vault dominates; the cloud is a small, secondary node fed by a
    single thin line — the diagram should read "local-first" before any label does. */
export function SecurityDiagram() {
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setPulse((v) => v + 1), 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex w-full max-w-[400px] flex-col items-center">
      <div className="grid size-16 shrink-0 place-items-center rounded-[18px] bg-[linear-gradient(135deg,#323232_0%,#000_100%)] btn-emboss">
        <LaptopIcon className="size-7 text-white" />
      </div>
      <p className="mt-3 text-[15px] leading-none font-semibold text-ink">Your device</p>
      <p className="mt-1 text-[13px] leading-[1.3] font-medium text-dim">
        Everything below is encrypted, right here
      </p>

      <div className="mt-5 flex w-full flex-col gap-2">
        {security.local.map((item) => (
          <div
            key={item}
            className="flex items-center gap-2.5 rounded-[12px] bg-white px-3.5 py-2.5 shadow-[0_4px_14px_rgba(29,29,29,0.06)]"
          >
            <span className="grid size-7 shrink-0 place-items-center rounded-[8px] bg-success-10">
              <LockIcon className="size-[15px] text-success" />
            </span>
            <span className="flex-1 text-[13px] leading-none font-semibold text-ink">{item}</span>
            <span className="rounded-full bg-surface px-2.5 py-1 text-[10px] leading-none font-semibold text-dim">
              Local only
            </span>
          </div>
        ))}
      </div>

      {/* thin, muted connector down to the small cloud node — deliberately the
          least prominent element, since only account/billing data ever syncs */}
      <div className="relative my-2 h-9 w-px bg-line">
        <motion.span
          key={pulse}
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: 36, opacity: [0, 1, 1, 0] }}
          transition={{ duration: 1.1, ease: "easeInOut" }}
          className="absolute -left-[3px] top-0 size-[7px] rounded-full bg-line-70"
        />
      </div>

      <div className="flex items-center gap-2 rounded-full bg-surface px-3.5 py-2">
        <CloudIcon className="size-[15px] text-grey" />
        <span className="text-[12px] leading-none font-medium text-dim">{security.synced}</span>
      </div>
    </div>
  );
}
