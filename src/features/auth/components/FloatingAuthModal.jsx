"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { X, Eye, EyeOff } from "lucide-react";
import clsx from "clsx";
import { useAuth } from "@/features/auth/context/AuthContext.jsx";
import { startGoogleSignIn } from "@/features/auth/services/googleAuthService.js";
import {
  validateEmail,
  validateSignupPassword,
} from "@/features/auth/validators.js";
import { friendlyAuthError } from "@/features/auth/errorMessages.js";
import useBodyScrollLock from "@/hooks/useBodyScrollLock.js";

const AuthModalContext = createContext(null);

export function AuthModalProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState("signin"); // signin | signup | forgot
  const [redirectTo, setRedirectTo] = useState(null);

  const showModal = useCallback((opts = {}) => {
    setView(opts.view || "signin");
    setRedirectTo(opts.redirectTo || null);
    setOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setOpen(false);
  }, []);

  const value = useMemo(
    () => ({ showModal, closeModal, isOpen: open }),
    [showModal, closeModal, open],
  );

  return (
    <AuthModalContext.Provider value={value}>
      {children}
      <FloatingAuthModal
        isOpen={open}
        view={view}
        setView={setView}
        redirectTo={redirectTo}
        onClose={closeModal}
      />
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const ctx = useContext(AuthModalContext);
  if (!ctx) {
    throw new Error("useAuthModal must be used within AuthModalProvider");
  }
  return ctx;
}

const fieldBase =
  "h-12 w-full rounded-[14px] border border-line bg-white px-4 text-[15px] font-medium text-ink outline-none transition-colors placeholder:text-dim/60 focus:border-brand";

function GoogleIcon() {
  return (
    <svg className="size-5 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

function OrDivider() {
  return (
    <div className="flex items-center gap-3 text-[13px] font-medium text-dim">
      <span className="h-px flex-1 bg-line" />
      <span>or</span>
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Floating modal component                                            */
/* ------------------------------------------------------------------ */

function FloatingAuthModal({ isOpen, view, setView, redirectTo, onClose }) {
  const router = useRouter();

  useBodyScrollLock(isOpen);

  useEffect(() => {
    if (!isOpen) return;
    setView(view);
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isOpen) return null;

  const isBrowser = typeof document !== "undefined";

  return isBrowser
    ? createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-end justify-center sm:items-center"
          role="presentation"
        >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={clsx(
          "relative z-10 flex w-full flex-col gap-5 rounded-t-[24px] bg-white px-6 pt-7 pb-8 shadow-2xl",
          "sm:max-w-[420px] sm:rounded-[24px] sm:pb-7",
          "max-h-[90vh] overflow-y-auto",
        )}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={view === "signin" ? "Sign in" : view === "forgot" ? "Reset password" : "Sign up"}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 grid size-8 place-items-center rounded-full text-dim hover:bg-surface"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {view === "signin" && (
          <SigninView
            onClose={onClose}
            onSwitch={() => setView("signup")}
            onForgot={() => setView("forgot")}
            redirectTo={redirectTo}
            router={router}
          />
        )}

        {view === "signup" && (
          <SignupView
            onClose={onClose}
            onSwitch={() => setView("signin")}
            redirectTo={redirectTo}
            router={router}
          />
        )}

        {view === "forgot" && (
          <ForgotView
            onSwitch={() => setView("signin")}
          />
        )}
      </div>
        </div>,
        document.body,
      )
    : null;
}

/* ------------------------------------------------------------------ */
/* Sign in                                                              */
/* ------------------------------------------------------------------ */

function SigninView({ onClose, onSwitch, onForgot, redirectTo, router }) {
  const { login, hasActiveSubscription } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login({ email: email.trim(), password });
      onClose();
      if (redirectTo) {
        router.push(redirectTo);
      } else {
        router.push(hasActiveSubscription ? "/download" : "/#pricing");
      }
    } catch (err) {
      setError(friendlyAuthError(err.message, "signin", "Invalid email or password."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="grid size-11 place-items-center rounded-full bg-[rgba(64,106,228,0.1)] text-brand">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </span>
        <h2 className="font-display text-[24px] leading-[1.2] font-semibold text-ink">
          Welcome back
        </h2>
        <p className="text-[15px] leading-[1.45] text-dim">
          Sign in to continue your job search journey.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={startGoogleSignIn}
          className="inline-flex w-full items-center justify-center gap-2.5 rounded-[14px] border border-line bg-white px-4 py-0 min-h-[48px] text-[15px] font-semibold text-ink transition-colors hover:border-dim/60 hover:bg-surface hover:shadow-sm"
        >
          <GoogleIcon />
          Continue with Google
        </button>
        <OrDivider />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5" noValidate>
        <label className="flex flex-col gap-1.5">
          <span className="text-[14px] font-semibold text-ink">Email</span>
          <input
            className={fieldBase}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            placeholder="you@example.com"
            required
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[14px] font-semibold text-ink">Password</span>
          <span className="relative block">
            <input
              className={clsx(fieldBase, "pr-12")}
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              placeholder="Your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute top-1/2 right-3 grid size-8 -translate-y-1/2 place-items-center rounded-full text-dim hover:bg-surface"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </span>
        </label>

        <button
          type="button"
          onClick={onForgot}
          className="-mt-1 self-end text-[13px] font-semibold text-brand hover:underline"
        >
          Forgot password?
        </button>

        {error && (
          <p className="rounded-[12px] bg-[rgba(245,28,35,0.06)] px-4 py-3 text-[13px] leading-[1.45] text-[#b91c1c]">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className={clsx(
            "inline-flex w-full items-center justify-center rounded-full h-12 text-[15px] font-semibold text-white transition-opacity disabled:opacity-50",
            "bg-[linear-gradient(110deg,#3b82f6_0%,#406ae4_100%)] shadow-[inset_4px_4px_8px_0_rgba(255,255,255,0.3),inset_-4px_-4px_8px_0_rgba(255,255,255,0.3),0_8px_16px_0_rgba(58,119,229,0.5)]",
          )}
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="text-center text-[14px] text-dim">
        Don&apos;t have an account?{" "}
        <button type="button" onClick={onSwitch} className="font-semibold text-brand hover:underline">
          Create one
        </button>
      </p>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Sign up                                                              */
/* ------------------------------------------------------------------ */

function SignupView({ onClose, onSwitch, redirectTo, router }) {
  const { signUp, confirmSignUp, completeSignup, resendConfirmationCode } = useAuth();
  const [step, setStep] = useState("form"); // form | otp | done
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [otp, setOtp] = useState("");
  const [userSub, setUserSub] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);

  const emailError = email && validateEmail(email);
  const passwordError = password && validateSignupPassword(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setNotice(null);
    if (!fullName.trim() || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (emailError || passwordError) {
      setError("Please fix the highlighted fields.");
      return;
    }
    setLoading(true);
    try {
      const result = await signUp(email.trim(), password);
      if (!result.success) {
        if (result.error === "UsernameExistsException") {
          const resend = await resendConfirmationCode(email.trim());
          if (resend.success) {
            setNotice("We've sent a new verification code to your email.");
            setStep("otp");
            return;
          }
          setError("You already have an account with this email.");
          return;
        }
        setError(friendlyAuthError(result.error, "signup", "Sign up failed. Please try again."));
        return;
      }
      setUserSub(result.data?.userSub || null);
      setStep("otp");
    } catch (err) {
      setError(friendlyAuthError(err.message, "signup", "Sign up failed. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (otp.length < 6) {
      setError("Please enter the 6-digit code.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const confirm = await confirmSignUp(email.trim(), otp);
      if (!confirm.success) {
        throw new Error(confirm.error || "Verification failed.");
      }
      await completeSignup({
        id: userSub || "",
        email: email.trim(),
        fullName: fullName.trim(),
        phoneNumber: "",
        password,
      });
      setStep("done");
    } catch (err) {
      setError(friendlyAuthError(err.message, "otpVerify", "Verification failed. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = () => {
    onClose();
    router.push(redirectTo || "/#pricing");
  };

  if (step === "done") {
    return (
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        <span className="grid size-14 place-items-center rounded-full bg-[rgba(16,185,129,0.12)] text-success">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </span>
        <div className="flex flex-col gap-1.5">
          <h2 className="font-display text-[24px] leading-[1.2] font-semibold text-ink">
            You&apos;re all set{fullName ? `, ${fullName.split(/\s+/)[0]}` : ""}!
          </h2>
          <p className="text-[15px] leading-[1.45] text-dim">
            Your HireDue account is ready.
          </p>
        </div>
        <button
          type="button"
          onClick={handleFinish}
          className={clsx(
            "inline-flex w-full items-center justify-center rounded-full h-12 text-[15px] font-semibold text-white transition-opacity",
            "bg-[linear-gradient(110deg,#3b82f6_0%,#406ae4_100%)] shadow-[inset_4px_4px_8px_0_rgba(255,255,255,0.3),inset_-4px_-4px_8px_0_rgba(255,255,255,0.3),0_8px_16px_0_rgba(58,119,229,0.5)]",
          )}
        >
          Continue
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="grid size-11 place-items-center rounded-full bg-[rgba(64,106,228,0.1)] text-brand">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <line x1="19" y1="8" x2="19" y2="14" />
            <line x1="22" y1="11" x2="16" y2="11" />
          </svg>
        </span>
        <h2 className="font-display text-[24px] leading-[1.2] font-semibold text-ink">
          {step === "otp" ? "Verify your email" : "Create your account"}
        </h2>
        <p className="text-[15px] leading-[1.45] text-dim">
          {step === "otp"
            ? `We sent a 6-digit code to ${email}. Enter it below to continue.`
            : "Sign up to discover jobs, auto-apply, and get hired faster."}
        </p>
      </div>

      {step === "form" && (
        <>
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={startGoogleSignIn}
              className="inline-flex w-full items-center justify-center gap-2.5 rounded-[14px] border border-line bg-white px-4 py-0 min-h-[48px] text-[15px] font-semibold text-ink transition-colors hover:border-dim/60 hover:bg-surface hover:shadow-sm"
            >
              <GoogleIcon />
              Continue with Google
            </button>
            <OrDivider />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5" noValidate>
            <label className="flex flex-col gap-1.5">
              <span className="text-[14px] font-semibold text-ink">Full name</span>
              <input
                className={fieldBase}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="name"
                placeholder="Your name"
                required
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[14px] font-semibold text-ink">Email</span>
              <input
                className={clsx(fieldBase, emailError && "border-[#f51c23]/40")}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="you@example.com"
                required
              />
              {emailError && <span className="text-[12px] text-[#c0382b]">{emailError}</span>}
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[14px] font-semibold text-ink">Password</span>
              <span className="relative block">
                <input
                  className={clsx(fieldBase, "pr-12", passwordError && "border-[#f51c23]/40")}
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute top-1/2 right-3 grid size-8 -translate-y-1/2 place-items-center rounded-full text-dim hover:bg-surface"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </span>
              {passwordError && <span className="text-[12px] text-[#c0382b]">{passwordError}</span>}
            </label>

            {notice && (
              <p className="rounded-[12px] bg-[rgba(16,185,129,0.08)] px-4 py-3 text-[13px] leading-[1.45] text-[#087a57]">
                {notice}
              </p>
            )}
            {error && !notice && (
              <p className="rounded-[12px] bg-[rgba(245,28,35,0.06)] px-4 py-3 text-[13px] leading-[1.45] text-[#b91c1c]">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className={clsx(
                "inline-flex w-full items-center justify-center rounded-full h-12 text-[15px] font-semibold text-white transition-opacity disabled:opacity-50",
                "bg-[linear-gradient(110deg,#3b82f6_0%,#406ae4_100%)] shadow-[inset_4px_4px_8px_0_rgba(255,255,255,0.3),inset_-4px_-4px_8px_0_rgba(255,255,255,0.3),0_8px_16px_0_rgba(58,119,229,0.5)]",
              )}
            >
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>
        </>
      )}

      {step === "otp" && (
        <form onSubmit={handleVerify} className="flex flex-col gap-4">
          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            inputMode="numeric"
            autoComplete="one-time-code"
            autoFocus
            aria-label="Verification code"
            placeholder="••••••"
            className="h-14 w-full rounded-[14px] border border-line bg-white px-4 text-center font-display text-[26px] font-semibold tracking-[0.5em] text-ink outline-none transition-colors placeholder:text-dim/40 focus:border-brand"
          />

          {error && (
            <p className="rounded-[12px] bg-[rgba(245,28,35,0.06)] px-4 py-3 text-[13px] leading-[1.45] text-[#b91c1c]">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || otp.length < 6}
            className={clsx(
              "inline-flex w-full items-center justify-center rounded-full h-12 text-[15px] font-semibold text-white transition-opacity disabled:opacity-50",
              "bg-[linear-gradient(110deg,#3b82f6_0%,#406ae4_100%)] shadow-[inset_4px_4px_8px_0_rgba(255,255,255,0.3),inset_-4px_-4px_8px_0_rgba(255,255,255,0.3),0_8px_16px_0_rgba(58,119,229,0.5)]",
            )}
          >
            {loading ? "Verifying…" : "Verify and continue"}
          </button>
        </form>
      )}

      {step !== "otp" && (
        <p className="text-center text-[14px] text-dim">
          Already have an account?{" "}
          <button type="button" onClick={onSwitch} className="font-semibold text-brand hover:underline">
            Sign in
          </button>
        </p>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Forgot password                                                      */
/* ------------------------------------------------------------------ */

function ForgotView({ onSwitch }) {
  const { forgotPassword, confirmResetPassword } = useAuth();
  const [step, setStep] = useState("request"); // request | reset
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const result = await forgotPassword(email.trim());
      if (!result.success) throw new Error(result.error || "Failed to send code.");
      setStep("reset");
      setSuccess("A verification code has been sent to your email.");
    } catch (err) {
      setError(friendlyAuthError(err.message, "forgotPasswordRequest", "Couldn't send the code. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    const pwErr = validateSignupPassword(password);
    if (pwErr) { setError(pwErr); return; }
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const result = await confirmResetPassword(email.trim(), code.trim(), password);
      if (!result.success) throw new Error(result.error || "Failed to reset password.");
      setSuccess("Password reset. Redirecting to sign in…");
      setTimeout(() => onSwitch(), 1200);
    } catch (err) {
      setError(friendlyAuthError(err.message, "forgotPasswordConfirm", "Couldn't reset your password. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="grid size-11 place-items-center rounded-full bg-[rgba(64,106,228,0.1)] text-brand">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </span>
        <h2 className="font-display text-[24px] leading-[1.2] font-semibold text-ink">
          {step === "request" ? "Forgot password" : "Reset password"}
        </h2>
        <p className="text-[15px] leading-[1.45] text-dim">
          {step === "request"
            ? "Enter your email and we'll send you a verification code."
            : "Enter the code we sent you along with a new password."}
        </p>
      </div>

      {step === "request" ? (
        <form onSubmit={handleRequest} className="flex flex-col gap-3.5">
          <label className="flex flex-col gap-1.5">
            <span className="text-[14px] font-semibold text-ink">Email</span>
            <input
              className={fieldBase}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>

          {error && (
            <p className="rounded-[12px] bg-[rgba(245,28,35,0.06)] px-4 py-3 text-[13px] leading-[1.45] text-[#b91c1c]">{error}</p>
          )}
          {success && (
            <p className="rounded-[12px] bg-[rgba(16,185,129,0.08)] px-4 py-3 text-[13px] leading-[1.45] text-[#087a57]">{success}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={clsx(
              "inline-flex w-full items-center justify-center rounded-full h-12 text-[15px] font-semibold text-white transition-opacity disabled:opacity-50",
              "bg-[linear-gradient(110deg,#3b82f6_0%,#406ae4_100%)] shadow-[inset_4px_4px_8px_0_rgba(255,255,255,0.3),inset_-4px_-4px_8px_0_rgba(255,255,255,0.3),0_8px_16px_0_rgba(58,119,229,0.5)]",
            )}
          >
            {loading ? "Sending code…" : "Send code"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleReset} className="flex flex-col gap-3.5">
          <label className="flex flex-col gap-1.5">
            <span className="text-[14px] font-semibold text-ink">Verification code</span>
            <input
              className={fieldBase}
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="••••••"
              required
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[14px] font-semibold text-ink">New password</span>
            <span className="relative block">
              <input
                className={clsx(fieldBase, "pr-12")}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute top-1/2 right-3 grid size-8 -translate-y-1/2 place-items-center rounded-full text-dim hover:bg-surface"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </span>
          </label>

          {error && (
            <p className="rounded-[12px] bg-[rgba(245,28,35,0.06)] px-4 py-3 text-[13px] leading-[1.45] text-[#b91c1c]">{error}</p>
          )}
          {success && (
            <p className="rounded-[12px] bg-[rgba(16,185,129,0.08)] px-4 py-3 text-[13px] leading-[1.45] text-[#087a57]">{success}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={clsx(
              "inline-flex w-full items-center justify-center rounded-full h-12 text-[15px] font-semibold text-white transition-opacity disabled:opacity-50",
              "bg-[linear-gradient(110deg,#3b82f6_0%,#406ae4_100%)] shadow-[inset_4px_4px_8px_0_rgba(255,255,255,0.3),inset_-4px_-4px_8px_0_rgba(255,255,255,0.3),0_8px_16px_0_rgba(58,119,229,0.5)]",
            )}
          >
            {loading ? "Resetting…" : "Reset password"}
          </button>
        </form>
      )}

      <p className="text-center text-[14px] text-dim">
        Remembered your password?{" "}
        <button type="button" onClick={onSwitch} className="font-semibold text-brand hover:underline">
          Sign in
        </button>
      </p>
    </>
  );
}
