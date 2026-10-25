"use client";

import { Children, cloneElement, isValidElement, useId } from "react";
import clsx from "clsx";

/*
 * Labelled field for the marketing-site forms (contact, onboarding call).
 * Wraps exactly one control and wires its error up for every reader: the
 * control gets `aria-invalid` (which also paints the red border — see
 * `controlClass`) and `aria-describedby` pointing at the message. An optional
 * `hint` shows under the control until there's an error to show instead.
 */
export function Field({ label, required, error, hint, children }) {
  const errorId = useId();
  const hintId = useId();
  const describedBy = error ? errorId : hint ? hintId : undefined;
  const control = Children.only(children);

  return (
    <label className="flex flex-col gap-2">
      <span className="text-[14px] leading-[1.3] font-medium text-ink">
        {label}
        {required && <span className="text-brand">*</span>}
      </span>
      {isValidElement(control)
        ? cloneElement(control, {
            "aria-invalid": error ? true : undefined,
            "aria-describedby": describedBy,
            "aria-required": required || undefined,
          })
        : control}
      {error ? (
        <span id={errorId} className="text-[13px] leading-[1.3] font-medium text-[#b91c1c]">
          {error}
        </span>
      ) : hint ? (
        <span id={hintId} className="text-[13px] leading-[1.3] font-medium text-dim">
          {hint}
        </span>
      ) : null}
    </label>
  );
}

/** Shared look for inputs and textareas; the error state keys off aria-invalid. */
export const controlClass =
  "w-full rounded-[12px] border border-line bg-white px-4 py-3 text-[15px] font-medium text-ink placeholder:text-dim/70 focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none aria-[invalid=true]:border-[#b91c1c] aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-[#b91c1c]/15";

export function Input({ className, ...rest }) {
  return <input {...rest} className={clsx(controlClass, className)} />;
}

/** The submit-result line under a form, announced to screen readers. */
export function FormStatus({ status, message }) {
  if (!message) return null;
  return (
    <p
      role={status === "success" ? "status" : "alert"}
      className={clsx(
        "text-[14px] font-medium",
        status === "success" ? "text-success" : "text-[#b91c1c]",
      )}
    >
      {message}
    </p>
  );
}
