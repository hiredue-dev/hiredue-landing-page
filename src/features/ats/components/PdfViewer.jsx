"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Minus, Plus } from "lucide-react";
import clsx from "clsx";
import { loadPdfjs } from "../pdf/pdfjs.js";

const ZOOMS = [0.75, 1, 1.25, 1.5];

/**
 * In-page PDF viewer: pdf.js draws each page onto a canvas sized to the
 * viewer's width. Not an <iframe>: phone browsers don't show PDFs inside one,
 * and this looks the same everywhere.
 */
/** `frameClassName` replaces the frame's default height limits, for a viewer inside a dialog that scrolls on its own. */
export function PdfViewer({ bytes, label, frameClassName }) {
  const frameRef = useRef(null);
  const [doc, setDoc] = useState(null);
  const [failed, setFailed] = useState(false);
  const [width, setWidth] = useState(0);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    if (!bytes) return undefined;
    let cancelled = false;
    let loaded = null;
    setDoc(null);
    setFailed(false);
    loadPdfjs()
      // pdf.js takes ownership of the buffer it's given; hand it a copy.
      .then((pdfjs) => pdfjs.getDocument({ data: bytes.slice() }).promise)
      .then((pdf) => {
        loaded = pdf;
        if (cancelled) pdf.destroy();
        else setDoc(pdf);
      })
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
      loaded?.destroy();
    };
  }, [bytes]);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return undefined;
    const observer = new ResizeObserver(([entry]) => setWidth(Math.floor(entry.contentRect.width)));
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  const pages = doc ? Array.from({ length: doc.numPages }, (_, i) => i + 1) : [];
  const zoomIndex = ZOOMS.indexOf(zoom);

  return (
    <div className="flex flex-col overflow-hidden rounded-[18px] border border-line bg-surface" data-clarity-mask="True">
      <div className="flex items-center justify-between gap-3 border-b border-line bg-white px-4 py-2.5">
        <p className="truncate text-[13.5px] font-semibold text-ink">
          {label}
          {doc && (
            <span className="font-medium text-dim">
              {" "}
              · {doc.numPages} page{doc.numPages === 1 ? "" : "s"}
            </span>
          )}
        </p>
        <div className="flex shrink-0 items-center gap-1" role="group" aria-label="Zoom">
          <ZoomButton label="Zoom out" disabled={zoomIndex <= 0} onClick={() => setZoom(ZOOMS[zoomIndex - 1])}>
            <Minus size={15} aria-hidden />
          </ZoomButton>
          <span className="w-11 text-center text-[13px] font-semibold text-dim tabular-nums" aria-live="polite">
            {Math.round(zoom * 100)}%
          </span>
          <ZoomButton label="Zoom in" disabled={zoomIndex >= ZOOMS.length - 1} onClick={() => setZoom(ZOOMS[zoomIndex + 1])}>
            <Plus size={15} aria-hidden />
          </ZoomButton>
        </div>
      </div>

      <div
        ref={frameRef}
        role="document"
        aria-label={label}
        aria-busy={!doc && !failed}
        tabIndex={0}
        className={clsx(
          "overflow-auto p-3 outline-none focus-visible:ring-2 focus-visible:ring-brand/40 sm:p-5",
          frameClassName ?? "max-h-[78vh] min-h-[320px] sm:max-h-[860px]",
        )}
      >
        {failed ? (
          <p className="t-body-sm p-6 text-center">The preview couldn&apos;t load. The download still works.</p>
        ) : !doc || !width ? (
          <div className="grid min-h-[300px] place-items-center text-dim">
            <Loader2 size={22} className="animate-spin" aria-label="Loading preview" />
          </div>
        ) : (
          <div className="mx-auto flex w-max min-w-full flex-col items-center gap-4">
            {pages.map((n) => (
              <PdfPage key={n} doc={doc} number={n} width={Math.max(240, (width - (width >= 600 ? 40 : 24)) * zoom)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PdfPage({ doc, number, width }) {
  const canvasRef = useRef(null);
  const [height, setHeight] = useState(null);

  useEffect(() => {
    let task = null;
    let cancelled = false;
    doc.getPage(number).then((page) => {
      if (cancelled) return;
      const base = page.getViewport({ scale: 1 });
      const scale = width / base.width;
      const ratio = window.devicePixelRatio || 1;
      const viewport = page.getViewport({ scale: scale * ratio });
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      setHeight(Math.round(base.height * scale));
      task = page.render({ canvas, viewport });
      task.promise.catch(() => {}); // cancelled by a resize or zoom
    });
    return () => {
      cancelled = true;
      task?.cancel();
    };
  }, [doc, number, width]);

  return (
    <canvas
      ref={canvasRef}
      aria-label={`Page ${number}`}
      style={{ width, height: height ?? width * (11 / 8.5) }}
      className="block shrink-0 rounded-[4px] bg-white shadow-[0_2px_12px_rgba(29,29,29,0.08)]"
    />
  );
}

function ZoomButton({ label, disabled, onClick, children }) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={clsx(
        "relative grid size-8 place-items-center rounded-full text-ink transition-colors after:absolute after:-inset-1.5 after:content-['']",
        disabled ? "cursor-not-allowed opacity-40" : "hover:bg-surface",
      )}
    >
      {children}
    </button>
  );
}
