"use client";

import { Children, cloneElement, isValidElement, useId } from "react";
import Image from "next/image";
import clsx from "clsx";
import { Busy } from "@/components/site/ui/Spinner";
import { assets } from "@/lib/assets";
import getFieldError from "@/utils/getFieldError";

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

/**
 * A text input bound to one of the marketing forms' hooks (useContactForm,
 * useOnboardingCallForm): value, change handler and error all come from
 * `form` by `name`. Anything else goes on the <input>.
 */
export function FormInput({ form, name, label, required, hint, ...inputProps }) {
  return (
    <Field label={label} required={required} error={getFieldError(form.errors, name)} hint={hint}>
      <Input name={name} value={form.values[name]} onChange={form.handleChange} {...inputProps} />
    </Field>
  );
}

/**
 * The card the contact and onboarding-call forms sit in: grey panel, the
 * fields, a submit button that spins while sending, the result line, and
 * the hills along the bottom.
 */
export function FormCard({ form, submitLabel, submittingLabel, children }) {
  const submitting = form.status === "submitting";
  return (
    <div className="relative w-full overflow-hidden rounded-[30px] bg-surface shadow-[0_24px_60px_rgba(29,29,29,0.12)]">
      <form
        onSubmit={form.handleSubmit}
        className="relative z-10 flex flex-col gap-5 p-[26px] pb-[150px] min-[810px]:p-10 min-[810px]:pb-[170px]"
      >
        {children}

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex w-full items-center justify-center rounded-full bg-ink px-8 py-4 text-[16px] font-semibold text-white transition-opacity duration-200 hover:opacity-90 disabled:opacity-60 sm:w-auto"
        >
          <Busy busy={submitting} label={submittingLabel}>
            {submitLabel}
          </Busy>
        </button>

        <FormStatus status={form.status} message={form.message} />
      </form>

      <Image
        src={assets.hero.hills}
        alt=""
        width={1040}
        height={260}
        className="pointer-events-none absolute right-0 bottom-0 left-0 z-0 h-[140px] w-full object-cover object-top min-[810px]:h-[170px]"
      />
    </div>
  );
}
