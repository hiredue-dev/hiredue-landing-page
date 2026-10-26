"use client";

import { useEffect, useRef } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Keyboard behaviour every modal needs: Escape closes it, Tab stays inside
 * the panel, focus moves into the panel on open and back to whatever opened
 * it on close. Put the returned ref on the panel (with `tabIndex={-1}` so it
 * can take focus itself).
 */
const useDialogFocus = (open, onClose) => {
  const panelRef = useRef(null);

  /* callers usually pass an inline onClose; reading it through a ref keeps
     the effects below from re-running (and re-focusing) on every render */
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") onCloseRef.current?.();
      // Keep Tab inside the dialog: it's modal, the page behind can't be used.
      if (event.key !== "Tab" || !panelRef.current) return;
      const items = [...panelRef.current.querySelectorAll(FOCUSABLE)];
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Focus moves into the dialog on open and back to whatever opened it on close.
  useEffect(() => {
    if (!open) return undefined;
    const opener = document.activeElement;
    const panel = panelRef.current;
    const target = panel?.querySelector("[autofocus]") ?? panel;
    target?.focus({ preventScroll: true });
    return () => {
      if (opener instanceof HTMLElement && opener.isConnected) opener.focus({ preventScroll: true });
    };
  }, [open]);

  return panelRef;
};

export default useDialogFocus;
