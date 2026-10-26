"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { Spinner } from "@/components/site/ui/Spinner";

const MIN = 500;
const MAX = 4000;

/** The splash's look for in-site loads: logo, spinner and what's loading. */
export function BrandLoader({ label }) {
  return (
    <div className="page-loader__inner">
      {/* eslint-disable-next-line @next/next/no-img-element -- must paint with the HTML, no loader */}
      <img src="/assets/Brand_logos/full_logo_dark.svg" alt="" width={174} height={43} />
      <span className="flex items-center gap-2.5 text-[15px] leading-[1.3] font-medium text-dim">
        <Spinner className="text-brand" />
        {label}
      </span>
      <span className="site-splash__bar" />
    </div>
  );
}

/**
 * A full-page loader under the navbar for a tool page's first load (/jobs,
 * /ats-checker). Server-rendered visible, so it's there from the first frame;
 * it lifts once `ready`, after at least MIN ms so it doesn't flash, and at
 * most MAX ms in however slow the data is. Once lifted it stays gone: later
 * reloads of the data (filters, pages) have their own in-page states.
 */
export function PageLoader({ ready, label }) {
  const [shownAt] = useState(() => Date.now());
  const [gone, setGone] = useState(false);
  const goneRef = useRef(false);

  useEffect(() => {
    if (goneRef.current) return undefined;
    const lift = () => {
      goneRef.current = true;
      setGone(true);
    };
    const cap = setTimeout(lift, Math.max(0, MAX - (Date.now() - shownAt)));
    if (!ready) return () => clearTimeout(cap);
    const t = setTimeout(lift, Math.max(0, MIN - (Date.now() - shownAt)));
    return () => {
      clearTimeout(t);
      clearTimeout(cap);
    };
  }, [ready, shownAt]);

  return (
    <div
      role="status"
      aria-busy={!gone}
      aria-label={gone ? undefined : label}
      className={clsx("page-loader", gone && "page-loader--gone")}
    >
      {!gone && <BrandLoader label={label} />}
    </div>
  );
}

/** The same loader for a route's loading.jsx, while its code streams in. */
export function RouteLoader({ label }) {
  return (
    <div role="status" aria-busy="true" aria-label={label} className="page-loader page-loader--route">
      <span className="route-progress" aria-hidden />
      <BrandLoader label={label} />
    </div>
  );
}
