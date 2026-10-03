"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { X, Eye, EyeOff, ArrowLeft } from "lucide-react";
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
  const [view, setView] = useState("signin");
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
  "h-12 w-full rounded-[14px] border bg-white px-4 text-[15px] font-medium text-ink outline-none transition-colors placeholder:text-dim/50 focus:border-brand";

const btnPrimary = clsx(
  "inline-flex w-full items-center justify-center rounded-full h-12",
  "text-[15px] font-semibold leading-[1.3] text-white transition-all duration-200",
  "bg-[linear-gradient(110deg,#3b82f6_0%,#406ae4_100%)]",
  "shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_4px_12px_rgba(58,119,229,0.3)]",
  "hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_6px_18px_rgba(58,119,229,0.4)]",
  "disabled:opacity-50 disabled:pointer-events-none",
);

const btnGoogle = clsx(
  "inline-flex w-full items-center justify-center gap-2.5 rounded-[14px]",
  "border border-[#dadce0] bg-white px-4 min-h-[48px]",
  "text-[15px] font-medium text-[#3c4043]",
  "transition-all duration-200",
  "hover:bg-[#f8f9fa] hover:shadow-[0_1px_3px_rgba(60,64,67,0.08)]",
  "active:bg-[#f1f3f4]",
);

const ease = [0.22, 1, 0.36, 1];

const modalVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.18 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const panelVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.28, ease },
  },
  exit: {
    opacity: 0,
    y: 14,
    scale: 0.985,
    transition: { duration: 0.18, ease },
  },
};

const viewVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2, ease } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.13 } },
};

function GoogleIcon() {
  return (
    <svg className="size-[18px] shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

function OrDivider() {
  return (
    <div className="flex items-center gap-3 text-[13px] font-medium text-[#5f6368]">
      <span className="h-px flex-1 bg-[#dadce0]" />
      <span>or</span>
      <span className="h-px flex-1 bg-[#dadce0]" />
    </div>
  );
}

function HeaderIcon({ children }) {
  return (
    <span className="grid size-10 place-items-center rounded-full bg-[linear-gradient(135deg,rgba(64,106,228,0.12),rgba(59,130,246,0.08))] text-brand">
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Floating modal - portal to body with animations                     */
/* ------------------------------------------------------------------ */

function FloatingAuthModal({ isOpen, view, setView, redirectTo, onClose }) {
  const router = useRouter();
  useBodyScrollLock(isOpen);

  const isBrowser = typeof document !== "undefined";
  if (!isBrowser) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="auth-modal"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-[9999] flex items-end justify-center p-0 sm:items-center sm:p-5"
          role="presentation"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-[rgba(15,23,42,0.52)] backdrop-blur-[3px]"
            onClick={onClose}
          />

          <motion.div
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={clsx(
              "relative z-10 flex w-full max-w-[440px] flex-col overflow-hidden rounded-t-[28px] bg-white",
              "sm:rounded-[24px]",
              "max-h-[92dvh] overflow-y-auto overscroll-contain",
              "ring-1 ring-black/[0.06] shadow-[0_-12px_48px_rgba(15,23,42,0.18)] sm:shadow-[0_24px_80px_rgba(15,23,42,0.25)]",
            )}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={view === "signin" ? "Sign in" : view === "forgot" ? "Reset password" : "Sign up"}
          >
            <div className="flex flex-col px-5 pt-3 pb-6 sm:px-7 sm:pt-5 sm:pb-7">
              <span aria-hidden className="mx-auto mb-2 h-1 w-10 rounded-full bg-line sm:hidden" />
              <div className="flex h-8 items-center justify-between">
                <span className="text-[13px] font-semibold tracking-[-0.01em] text-ink">HireDue</span>
                <button
                  type="button"
                  onClick={onClose}
                  className="grid size-8 place-items-center rounded-full text-dim transition-colors duration-200 hover:bg-surface hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                  aria-label="Close"
                >
                  <X size={18} strokeWidth={2} />
                </button>
              </div>

              <div className="mt-4">
                <AnimatePresence mode="wait" initial={false}>
                {view === "signin" && (
                  <motion.div key="signin" variants={viewVariants} initial="initial" animate="animate" exit="exit">
                    <SigninView
                      onClose={onClose}
                      onSwitch={() => setView("signup")}
                      onForgot={() => setView("forgot")}
                      redirectTo={redirectTo}
                      router={router}
                    />
                  </motion.div>
                )}

                {view === "signup" && (
                  <motion.div key="signup" variants={viewVariants} initial="initial" animate="animate" exit="exit">
                    <SignupView
                      onClose={onClose}
                      onSwitch={() => setView("signin")}
                      redirectTo={redirectTo}
                      router={router}
                    />
                  </motion.div>
                )}

                {view === "forgot" && (
                  <motion.div key="forgot" variants={viewVariants} initial="initial" animate="animate" exit="exit">
                    <ForgotView
                      onBack={() => setView("signin")}
                    />
                  </motion.div>
                )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
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
      router.push(redirectTo || (hasActiveSubscription ? "/download" : "/#pricing"));
    } catch (err) {
      setError(friendlyAuthError(err.message, "signin", "Invalid email or password."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col items-center gap-1.5 text-center">
        <HeaderIcon>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </HeaderIcon>
        <h2 className="font-display text-[22px] leading-[1.2] font-semibold text-ink">
          Welcome back
        </h2>
        <p className="text-[14px] leading-[1.5] text-dim">
          Sign in to continue where you left off.
        </p>
      </div>

      <button
        type="button"
        onClick={startGoogleSignIn}
        className={btnGoogle}
      >
        <GoogleIcon />
        Continue with Google
      </button>

      <OrDivider />

      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5" noValidate>
        <label className="flex flex-col gap-1.5">
          <span className="text-[13px] font-semibold text-ink">Email</span>
          <input
            className={clsx(fieldBase, "border-line")}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            placeholder="you@example.com"
            required
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[13px] font-semibold text-ink">Password</span>
          <span className="relative block">
            <input
              className={clsx(fieldBase, "border-line pr-12")}
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
              className="absolute top-1/2 right-2 grid size-9 -translate-y-1/2 place-items-center rounded-full text-dim transition-colors duration-200 hover:bg-surface hover:text-ink"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </span>
        </label>

        <button
          type="button"
          onClick={onForgot}
          className="-mt-0.5 self-end text-[13px] font-medium text-brand transition-colors duration-200 hover:text-[#5290f4]"
        >
          Forgot password?
        </button>

        {error && (
          <p className="rounded-[12px] bg-[rgba(245,28,35,0.06)] px-4 py-3 text-[13px] leading-[1.45] font-medium text-[#b91c1c] border border-[rgba(245,28,35,0.12)]">
            {error}
          </p>
        )}

        <button type="submit" disabled={loading} className={btnPrimary}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="text-center text-[14px] text-dim">
        Don&apos;t have an account?{" "}
        <button
          type="button"
          onClick={onSwitch}
          className="font-semibold text-brand transition-colors duration-200 hover:text-[#5290f4]"
        >
          Create one
        </button>
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sign up                                                              */
/* ------------------------------------------------------------------ */

function SignupView({ onClose, onSwitch, redirectTo, router }) {
  const { signUp, confirmSignUp, completeSignup, resendConfirmationCode } = useAuth();
  const [step, setStep] = useState("form");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [otp, setOtp] = useState("");
  const [userSub, setUserSub] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const [cooldown, setCooldown] = useState(0);

  const emailError = email && validateEmail(email);
  const passwordError = password && validateSignupPassword(password);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

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
            setNotice("We've resent the verification code.");
            setStep("otp");
            setCooldown(30);
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
      setCooldown(30);
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
      if (!confirm.success) throw new Error(confirm.error || "Verification failed.");
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

  const handleResend = async () => {
    setError(null);
    try {
      await resendConfirmationCode(email.trim());
      setNotice("A new code has been sent.");
      setCooldown(30);
    } catch (err) {
      setError(friendlyAuthError(err.message, "otpResend", "Couldn't resend. Try again."));
    }
  };

  const handleFinish = () => {
    onClose();
    router.push(redirectTo || "/#pricing");
  };

  if (step === "done") {
    return (
      <div className="flex flex-col items-center gap-5 py-3 text-center">
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.06 }}
          className="grid size-16 place-items-center rounded-full bg-[rgba(16,185,129,0.1)]"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-success">
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
              d="M20 6L9 17l-5-5"
            />
          </svg>
        </motion.span>
        <div className="flex flex-col gap-1.5">
          <h2 className="font-display text-[22px] leading-[1.2] font-semibold text-ink">
            You&apos;re all set{fullName ? `, ${fullName.split(/\s+/)[0]}` : ""}!
          </h2>
          <p className="text-[14px] leading-[1.5] text-dim">Your HireDue account is ready.</p>
        </div>
        <button type="button" onClick={handleFinish} className={btnPrimary}>
          Continue
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col items-center gap-1.5 text-center">
        <HeaderIcon>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <line x1="19" y1="8" x2="19" y2="14" />
            <line x1="22" y1="11" x2="16" y2="11" />
          </svg>
        </HeaderIcon>
        <h2 className="font-display text-[22px] leading-[1.2] font-semibold text-ink">
          {step === "otp" ? "Verify your email" : "Create your account"}
        </h2>
        <p className="text-[14px] leading-[1.5] text-dim">
          {step === "otp"
            ? `Enter the 6-digit code sent to ${email}`
            : "Discover jobs, auto-apply, and get hired faster."}
        </p>
      </div>

      {step === "form" && (
        <>
          <button
            type="button"
            onClick={startGoogleSignIn}
            className={btnGoogle}
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <OrDivider />

          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5" noValidate>
            <label className="flex flex-col gap-1.5">
              <span className="text-[13px] font-semibold text-ink">Full name</span>
              <input
                className={clsx(fieldBase, "border-line")}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="name"
                placeholder="Your name"
                required
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[13px] font-semibold text-ink">Email</span>
              <input
                className={clsx(fieldBase, emailError ? "border-[#f51c23]/40" : "border-line")}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="you@example.com"
                required
              />
              {emailError && <span className="text-[12px] font-medium text-[#c0382b]">{emailError}</span>}
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[13px] font-semibold text-ink">Password</span>
              <span className="relative block">
                <input
                  className={clsx(fieldBase, "pr-12", passwordError ? "border-[#f51c23]/40" : "border-line")}
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
                  className="absolute top-1/2 right-2 grid size-9 -translate-y-1/2 place-items-center rounded-full text-dim transition-colors duration-200 hover:bg-surface hover:text-ink"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </span>
              {passwordError && <span className="text-[12px] font-medium text-[#c0382b]">{passwordError}</span>}
            </label>

            {notice && (
              <p className="rounded-[12px] bg-[rgba(16,185,129,0.06)] px-4 py-3 text-[13px] leading-[1.45] font-medium text-[#087a57] border border-[rgba(16,185,129,0.12)]">
                {notice}
              </p>
            )}
            {error && !notice && (
              <p className="rounded-[12px] bg-[rgba(245,28,35,0.06)] px-4 py-3 text-[13px] leading-[1.45] font-medium text-[#b91c1c] border border-[rgba(245,28,35,0.12)]">
                {error}
              </p>
            )}

            <button type="submit" disabled={loading} className={btnPrimary}>
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
            className="h-[56px] w-full rounded-[14px] border border-line bg-white px-4 text-center font-display text-[28px] font-semibold tracking-[0.5em] text-ink outline-none transition-colors placeholder:text-dim/30 focus:border-brand"
          />

          {error && (
            <p className="rounded-[12px] bg-[rgba(245,28,35,0.06)] px-4 py-3 text-[13px] leading-[1.45] font-medium text-[#b91c1c] border border-[rgba(245,28,35,0.12)]">
              {error}
            </p>
          )}
          {notice && !error && (
            <p className="rounded-[12px] bg-[rgba(16,185,129,0.06)] px-4 py-3 text-[13px] leading-[1.45] font-medium text-[#087a57] border border-[rgba(16,185,129,0.12)]">
              {notice}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || otp.length < 6}
            className={btnPrimary}
          >
            {loading ? "Verifying…" : "Verify and continue"}
          </button>

          <div className="flex items-center justify-between text-[14px]">
            <button
              type="button"
              onClick={() => setStep("form")}
              className="flex items-center gap-1 font-medium text-dim transition-colors duration-200 hover:text-ink"
            >
              <ArrowLeft size={14} /> Change email
            </button>
            <button
              type="button"
              onClick={handleResend}
              disabled={cooldown > 0}
              className="font-medium text-brand transition-colors duration-200 hover:text-[#5290f4] disabled:text-dim disabled:pointer-events-none"
            >
              {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
            </button>
          </div>
        </form>
      )}

      {step !== "otp" && (
        <p className="text-center text-[14px] text-dim">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSwitch}
            className="font-semibold text-brand transition-colors duration-200 hover:text-[#5290f4]"
          >
            Sign in
          </button>
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Forgot password                                                      */
/* ------------------------------------------------------------------ */

function ForgotView({ onBack }) {
  const { forgotPassword, confirmResetPassword } = useAuth();
  const [step, setStep] = useState("request");
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
      setSuccess("Password reset. Taking you to sign in…");
      setTimeout(() => onBack(), 1500);
    } catch (err) {
      setError(friendlyAuthError(err.message, "forgotPasswordConfirm", "Couldn't reset your password. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col items-center gap-1.5 text-center">
        <HeaderIcon>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </HeaderIcon>
        <h2 className="font-display text-[22px] leading-[1.2] font-semibold text-ink">
          {step === "request" ? "Forgot password?" : "Reset password"}
        </h2>
        <p className="text-[14px] leading-[1.5] text-dim">
          {step === "request"
            ? "Enter your email and we'll send a code to reset it."
            : "Enter the code and choose a new password."}
        </p>
      </div>

      {step === "request" ? (
        <form onSubmit={handleRequest} className="flex flex-col gap-3.5">
          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-semibold text-ink">Email</span>
            <input
              className={clsx(fieldBase, "border-line")}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>

          {error && (
            <p className="rounded-[12px] bg-[rgba(245,28,35,0.06)] px-4 py-3 text-[13px] leading-[1.45] font-medium text-[#b91c1c] border border-[rgba(245,28,35,0.12)]">
              {error}
            </p>
          )}
          {success && (
            <p className="rounded-[12px] bg-[rgba(16,185,129,0.06)] px-4 py-3 text-[13px] leading-[1.45] font-medium text-[#087a57] border border-[rgba(16,185,129,0.12)]">
              {success}
            </p>
          )}

          <button type="submit" disabled={loading} className={btnPrimary}>
            {loading ? "Sending code…" : "Send code"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleReset} className="flex flex-col gap-3.5">
          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-semibold text-ink">Verification code</span>
            <input
              className={clsx(fieldBase, "border-line")}
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="••••••"
              required
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-semibold text-ink">New password</span>
            <span className="relative block">
              <input
                className={clsx(fieldBase, "border-line pr-12")}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute top-1/2 right-2 grid size-9 -translate-y-1/2 place-items-center rounded-full text-dim transition-colors duration-200 hover:bg-surface hover:text-ink"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </span>
          </label>

          {error && (
            <p className="rounded-[12px] bg-[rgba(245,28,35,0.06)] px-4 py-3 text-[13px] leading-[1.45] font-medium text-[#b91c1c] border border-[rgba(245,28,35,0.12)]">
              {error}
            </p>
          )}
          {success && (
            <p className="rounded-[12px] bg-[rgba(16,185,129,0.06)] px-4 py-3 text-[13px] leading-[1.45] font-medium text-[#087a57] border border-[rgba(16,185,129,0.12)]">
              {success}
            </p>
          )}

          <button type="submit" disabled={loading} className={btnPrimary}>
            {loading ? "Resetting…" : "Reset password"}
          </button>
        </form>
      )}

      <p className="text-center text-[14px] text-dim">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 font-semibold text-brand transition-colors duration-200 hover:text-[#5290f4]"
        >
          <ArrowLeft size={14} /> Back to sign in
        </button>
      </p>
    </div>
  );
}
