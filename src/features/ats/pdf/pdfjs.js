/*
 * pdf.js, loaded on first use and shared by the resume reader (extract.js)
 * and the preview (PdfViewer). The worker parses off the main thread.
 */
let loading = null;

export function loadPdfjs() {
  loading ??= import("pdfjs-dist").then((pdfjs) => {
    pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
    return pdfjs;
  });
  return loading;
}
