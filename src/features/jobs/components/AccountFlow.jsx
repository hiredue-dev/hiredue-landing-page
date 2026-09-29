"use client";

import { useEffect, useState } from "react";
import { Check, Eye, EyeOff, MailCheck, PartyPopper } from "lucide-react";
import clsx from "clsx";
import { useAuth } from "@/features/auth/context/AuthContext.jsx";
import { COUNTRY_BY_ISO, COUNTRY_OPTIONS, detectDefaultCountry } from "@/features/auth/countries.js";
import { friendlyAuthError } from "@/features/auth/errorMessages.js";
import { validateContactNumber, validateEmail, validateSignupPassword } from "@/features/auth/validators.js";
import { primaryButton, secondaryButton } from "./ui.jsx";

/*
 * Sign-up and log-in as in-page steps, for the job board's dialogs. Same
 * Cognito calls and user creation as the /signup and /login pages
 * (AuthContext), so an account made here is identical — only the UI differs.
 */

// Width is kept out of the base so a field can set its own (two conflicting
// width utilities on one element resolve by CSS order, not by which came last).
const fieldBase =
  "h-12 rounded-[14px] border border-line bg-white px-4 text-[15px] font-medium text-ink outline-none transition-colors placeholder:text-dim/60 focus:border-brand";
export const fieldClass = `${fieldBase} w-full`;

export function Field({ label, error, children }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[14px] font-semibold text-ink">{label}</span>
      {children}
      {error && <span className="text-[13px] text-danger">{error}</span>}
    </label>
  );
}

export function FormError({ children }) {
  if (!children) return null;
  return <p className="rounded-[12px] bg-danger-05 px-4 py-3 text-[14px] leading-[1.45] text-danger">{children}</p>;
}

/** Numbered progress for multi-step dialogs. */
export function Steps({ steps, current }) {
  return (
    <ol className="flex items-center gap-2" aria-label="Progress">
      {steps.map((label, index) => {
        const done = index < current;
        const active = index === current;
        return (
          <li key={label} className="flex min-w-0 flex-1 items-center gap-2 last:flex-none">
            <span
              aria-current={active ? "step" : undefined}
              className={clsx(
                "grid size-6 shrink-0 place-items-center rounded-full text-[12px] font-semibold transition-colors",
                done && "bg-success text-white",
                active && "bg-brand text-white",
                !done && !active && "bg-surface text-dim",
              )}
            >
              {done ? <Check size={13} strokeWidth={3} /> : index + 1}
            </span>
            <span className={clsx("truncate text-[13px] font-semibold", active ? "text-ink" : "text-dim")}>{label}</span>
            {index < steps.length - 1 && <span aria-hidden className="h-px min-w-3 flex-1 bg-line" />}
          </li>
        );
      })}
    </ol>
  );
}

function PasswordInput({ value, onChange, autoComplete, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative block">
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className={clsx(fieldClass, "pr-12")}
        required
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? "Hide password" : "Show password"}
        className="absolute top-1/2 right-3 grid size-8 -translate-y-1/2 place-items-center rounded-full text-dim hover:bg-surface"
      >
        {show ? <EyeOff size={17} /> : <Eye size={17} />}
      </button>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Sign-up: details → verify email → done                               */
/* ------------------------------------------------------------------ */

export const SIGNUP_STEPS = ["Your details", "Verify email", "Done"];

/**
 * Drives the sign-up steps. `step` is 0 (details), 1 (verify) or 2 (done);
 * the parent renders the matching component and the progress bar.
 */
export function useSignupFlow({ initialEmail = "" } = {}) {
  const { signUp, confirmSignUp, resendConfirmationCode, completeSignup } = useAuth();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: "",
    email: initialEmail,
    countryCode: "IN",
    contact: "",
    password: "",
    agreed: false,
  });
  const [userSub, setUserSub] = useState(null);
  const [notice, setNotice] = useState(null);

  // navigator is only available in the browser.
  useEffect(() => setForm((f) => ({ ...f, countryCode: detectDefaultCountry() })), []);

  const submitDetails = async () => {
    const result = await signUp(form.email.trim(), form.password);
    if (result.success) {
      setUserSub(result.data?.userSub || null);
      setNotice(null);
      setStep(1);
      return { ok: true };
    }
    if (result.error === "UsernameExistsException") {
      // Registered but never verified: send a fresh code and carry on.
      const resend = await resendConfirmationCode(form.email.trim());
      if (resend.success) {
        setNotice("You started signing up before. We've sent a new code to finish it.");
        setStep(1);
        return { ok: true };
      }
      return { ok: false, exists: true, error: "You already have an account with this email." };
    }
    return { ok: false, error: friendlyAuthError(result.error, "signup", "Sign up failed. Please try again.") };
  };

  const verify = async (code) => {
    const confirm = await confirmSignUp(form.email.trim(), code);
    if (!confirm.success) throw new Error(confirm.error || "Verification failed.");
    // E.164 so the number is valid for any country and accepted by Cognito.
    const dial = COUNTRY_BY_ISO[form.countryCode]?.dial || "";
    await completeSignup({
      id: userSub || "",
      email: form.email.trim(),
      fullName: form.name.trim(),
      phoneNumber: `+${dial}${form.contact}`,
      password: form.password,
    });
    setStep(2);
  };

  const resend = async () => {
    const result = await resendConfirmationCode(form.email.trim());
    if (!result.success) throw new Error(result.error || "Failed to resend code.");
  };

  return { step, setStep, form, setForm, notice, submitDetails, verify, resend };
}

export function SignupDetailsStep({ flow, onSwitchToLogin, submitLabel = "Create free account" }) {
  const { form, setForm } = flow;
  const [error, setError] = useState(null);
  const [exists, setExists] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (key) => (event) => {
    const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
    setForm((f) => ({ ...f, [key]: key === "contact" ? value.replace(/\D/g, "").slice(0, 15) : value }));
  };

  const errors = {
    email: validateEmail(form.email),
    contact: validateContactNumber(form.contact),
    password: validateSignupPassword(form.password),
  };

  const submit = async (event) => {
    event.preventDefault();
    setError(null);
    setExists(false);
    if (!form.name.trim() || !form.email || !form.contact || !form.password) {
      setError("Please fill in all the fields.");
      return;
    }
    if (Object.values(errors).some(Boolean)) {
      setError("Please fix the highlighted fields.");
      return;
    }
    if (!form.agreed) {
      setError("Please accept the Terms and Privacy Policy to continue.");
      return;
    }
    setLoading(true);
    try {
      const result = await flow.submitDetails();
      if (!result.ok) {
        setError(result.error);
        setExists(!!result.exists);
      }
    } catch (err) {
      setError(friendlyAuthError(err.message, "signup", "Sign up failed. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-4">
      <Field label="Full name">
        <input className={fieldClass} value={form.name} onChange={set("name")} autoComplete="name" placeholder="Your name" required />
      </Field>
      <Field label="Email" error={form.email && errors.email}>
        <input className={fieldClass} type="email" value={form.email} onChange={set("email")} autoComplete="email" placeholder="you@example.com" required />
      </Field>
      <Field label="Phone number" error={form.contact && errors.contact}>
        <span className="flex gap-2">
          <select
            aria-label="Country"
            value={form.countryCode}
            onChange={set("countryCode")}
            className={clsx(fieldBase, "w-[150px] shrink-0")}
          >
            {COUNTRY_OPTIONS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          <input
            className={clsx(fieldBase, "w-full min-w-0 flex-1")}
            type="tel"
            inputMode="numeric"
            value={form.contact}
            onChange={set("contact")}
            autoComplete="tel-national"
            placeholder="Phone number"
            required
          />
        </span>
      </Field>
      <Field label="Password" error={form.password && errors.password}>
        <PasswordInput value={form.password} onChange={set("password")} autoComplete="new-password" placeholder="At least 8 characters" />
      </Field>

      <label className="flex cursor-pointer items-start gap-2.5 text-[14px] leading-[1.45] text-dim">
        <input type="checkbox" checked={form.agreed} onChange={set("agreed")} className="mt-0.5 size-4 accent-[var(--color-brand)]" />
        <span>
          I agree to the{" "}
          <a href="/terms" target="_blank" rel="noopener noreferrer" className="font-semibold text-brand hover:underline">
            Terms
          </a>{" "}
          and{" "}
          <a href="/privacy" target="_blank" rel="noopener noreferrer" className="font-semibold text-brand hover:underline">
            Privacy Policy
          </a>
          .
        </span>
      </label>

      <FormError>{error}</FormError>
      {exists && (
        <button type="button" onClick={() => onSwitchToLogin(form.email)} className={clsx(secondaryButton, "h-11")}>
          Log in instead
        </button>
      )}

      <button type="submit" disabled={loading} className={clsx(primaryButton, "h-12 text-[15px]")}>
        {loading ? "Creating your account…" : submitLabel}
      </button>
      <p className="text-center text-[14px] text-dim">
        Already have an account?{" "}
        <button type="button" onClick={() => onSwitchToLogin(form.email)} className="font-semibold text-brand hover:underline">
          Log in
        </button>
      </p>
    </form>
  );
}

const RESEND_COOLDOWN_S = 30;

export function VerifyStep({ flow, onBack }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(flow.notice);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_S);

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const submit = async (event) => {
    event.preventDefault();
    if (code.length < 6) {
      setError("Enter the 6-digit code from your email.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await flow.verify(code);
    } catch (err) {
      setError(friendlyAuthError(err.message, "otpVerify", "Verification failed. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    setError(null);
    setInfo(null);
    try {
      await flow.resend();
      setInfo("A new code is on its way.");
      setCooldown(RESEND_COOLDOWN_S);
    } catch (err) {
      setError(friendlyAuthError(err.message, "otpResend", "Couldn't resend the code. Please try again."));
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div className="flex gap-3 rounded-[15px] bg-surface p-4">
        <MailCheck size={20} className="mt-0.5 shrink-0 text-brand" aria-hidden />
        <p className="text-[14px] leading-[1.5] text-dim">
          We sent a 6-digit code to <strong className="font-semibold break-all text-ink">{flow.form.email}</strong>. It can
          take a minute to arrive; check spam too.
        </p>
      </div>

      <input
        value={code}
        onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
        inputMode="numeric"
        autoComplete="one-time-code"
        autoFocus
        aria-label="Verification code"
        placeholder="••••••"
        className="h-14 w-full rounded-[14px] border border-line bg-white px-4 text-center font-display text-[26px] font-semibold tracking-[0.5em] text-ink outline-none transition-colors placeholder:text-dim/40 focus:border-brand"
      />

      <FormError>{error}</FormError>
      {info && !error && <p className="rounded-[12px] bg-success-10 px-4 py-3 text-[14px] text-success">{info}</p>}

      <button type="submit" disabled={loading || code.length < 6} className={clsx(primaryButton, "h-12 text-[15px]")}>
        {loading ? "Verifying…" : "Verify and continue"}
      </button>
      <div className="flex items-center justify-between text-[14px]">
        <button type="button" onClick={onBack} className="font-semibold text-dim hover:text-ink">
          ← Change email
        </button>
        <button
          type="button"
          onClick={resend}
          disabled={cooldown > 0}
          className="font-semibold text-brand hover:underline disabled:text-dim disabled:no-underline"
        >
          {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
        </button>
      </div>
    </form>
  );
}

export function DoneStep({ name, title = "You're all set", body, children }) {
  const first = name?.trim().split(/\s+/)[0];
  return (
    <div className="flex flex-col items-center gap-4 py-2 text-center">
      <span className="grid size-14 place-items-center rounded-full bg-success-10 text-success">
        <PartyPopper size={26} aria-hidden />
      </span>
      <div className="flex flex-col gap-1.5">
        <h3 className="t-h5">
          {title}
          {first ? `, ${first}` : ""}!
        </h3>
        {body && <p className="t-body max-w-[360px]">{body}</p>}
      </div>
      <div className="flex w-full flex-col gap-2.5">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Log in                                                               */
/* ------------------------------------------------------------------ */

export function LoginForm({ initialEmail = "", onSuccess, onSwitchToSignup }) {
  const { login } = useAuth();
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [unconfirmed, setUnconfirmed] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError(null);
    setUnconfirmed(false);
    setLoading(true);
    try {
      await login({ email: email.trim(), password });
      onSuccess();
    } catch (err) {
      setUnconfirmed(err.message === "UserNotConfirmedException");
      setError(friendlyAuthError(err.message, "signin", "Invalid email or password."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <Field label="Email">
        <input className={fieldClass} type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="you@example.com" required />
      </Field>
      <Field label="Password">
        <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" placeholder="Your password" />
      </Field>
      <a href="/forgot-password" target="_blank" rel="noopener noreferrer" className="-mt-2 self-end text-[13px] font-semibold text-brand hover:underline">
        Forgot password?
      </a>

      <FormError>{error}</FormError>
      {unconfirmed && (
        // An unverified sign-up: the sign-up step resends the code and finishes it.
        <button type="button" onClick={() => onSwitchToSignup(email)} className={clsx(secondaryButton, "h-11")}>
          Finish verifying my email
        </button>
      )}

      <button type="submit" disabled={loading} className={clsx(primaryButton, "h-12 text-[15px]")}>
        {loading ? "Logging in…" : "Log in"}
      </button>
      <p className="text-center text-[14px] text-dim">
        New to HireDue?{" "}
        <button type="button" onClick={() => onSwitchToSignup(email)} className="font-semibold text-brand hover:underline">
          Create a free account
        </button>
      </p>
    </form>
  );
}
