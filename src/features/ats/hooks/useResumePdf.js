"use client";

import { useEffect, useState } from "react";

/**
 * The structured resume typeset as a PDF (see pdf/renderResumePdf.js), rebuilt
 * when the resume changes. pdf-lib is imported here, on first use, not with the page.
 * @returns {{status: "idle"|"rendering"|"ready"|"error", bytes: Uint8Array|null}}
 */
export function useResumePdf(resume) {
  const [state, setState] = useState({ status: "idle", bytes: null });

  useEffect(() => {
    if (!resume) {
      setState({ status: "idle", bytes: null });
      return undefined;
    }
    let cancelled = false;
    setState({ status: "rendering", bytes: null });
    import("../pdf/renderResumePdf.js")
      .then(({ renderResumePdf }) => renderResumePdf(resume))
      .then((bytes) => !cancelled && setState({ status: "ready", bytes }))
      .catch(() => !cancelled && setState({ status: "error", bytes: null }));
    return () => {
      cancelled = true;
    };
  }, [resume]);

  return state;
}

/** Saves the bytes as `name` through a temporary link. */
export function downloadPdf(bytes, name) {
  const url = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

/** "Priya CV.pdf" + "optimized" → "Priya CV - optimized.pdf" */
export function pdfFileName(fileName, suffix) {
  const base = String(fileName || "resume").replace(/\.(pdf|docx)$/i, "").trim() || "resume";
  return `${base} - ${suffix}.pdf`;
}
