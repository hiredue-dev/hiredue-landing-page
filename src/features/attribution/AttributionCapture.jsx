"use client";

import { useEffect } from "react";
import { captureAttribution } from "./attribution.js";

/** Records an ambassador link on whatever page a visitor lands on. Renders nothing. */
export default function AttributionCapture() {
  useEffect(() => {
    captureAttribution(window.location.search);
  }, []);
  return null;
}
