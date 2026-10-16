"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

/** Sends `event` once when the page mounts, for pages we follow by name. */
export function TrackPageView({ event }) {
  useEffect(() => {
    trackEvent(event, { path: window.location.pathname, referrer: document.referrer ? new URL(document.referrer).hostname : "direct" });
  }, [event]);
  return null;
}
