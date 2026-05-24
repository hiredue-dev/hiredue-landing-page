"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import Button from "@/components/ui/Button/Button.jsx";
import Input from "@/components/ui/Input/Input.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { validateSignupPassword } from "../validators.js";
import { friendlyAuthError } from "../errorMessages.js";
import styles from "./AuthForm.module.css";

export default function ForgotPasswordForm() {
  const { forgotPassword, confirmResetPassword } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState("request"); // "request" | "reset"
  const [form, setForm] = useState({ email: "", code: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleRequest = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const result = await forgotPassword(form.email);
      if (!result.success) throw new Error(result.error || "Failed to send code.");
      setStep("reset");
      setSuccess("A verification code has been sent to your email.");
    } catch (err) {
      setError(friendlyAuthError(err.message, "forgotPasswordRequest", "Couldn't send the code. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (event) => {
    event.preventDefault();
    const passwordError = validateSignupPassword(form.password);
    if (passwordError) {
      setError(passwordError);
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const result = await confirmResetPassword(form.email, form.code, form.password);
      if (!result.success) throw new Error(result.error || "Failed to reset password.");
      setSuccess("Password reset. Redirecting to sign in…");
      setTimeout(() => router.replace("/login"), 1200);
    } catch (err) {
      setError(friendlyAuthError(err.message, "forgotPasswordConfirm", "Couldn't reset your password. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.shell}>
      <div className={styles.card}>
        <p className={styles.eyebrow}>Account recovery</p>
        <h1 className={styles.title}>
          {step === "request" ? "Forgot password" : "Reset password"}
        </h1>
        <p className={styles.subtitle}>
          {step === "request"
            ? "Enter your email and we'll send you a verification code."
            : "Enter the code we sent you along with a new password."}
        </p>

        {step === "request" ? (
          <form className={styles.form} onSubmit={handleRequest}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="email">Email</label>
              <Input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            {error && <div className={styles.error}>{error}</div>}
            {success && <div className={styles.success}>{success}</div>}

            <Button type="submit" size="lg" className={styles.submit} disabled={loading}>
              {loading ? "Sending code…" : "Send code"}
            </Button>
          </form>
        ) : (
          <form className={styles.form} onSubmit={handleReset}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="code">Verification code</label>
              <Input
                id="code"
                name="code"
                inputMode="numeric"
                maxLength={6}
                value={form.code}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="password">New password</label>
              <div className={styles.inputWrap}>
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  required
                  style={{ paddingRight: 44 }}
                />
                <button
                  type="button"
                  className={styles.toggleVisibility}
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && <div className={styles.error}>{error}</div>}
            {success && <div className={styles.success}>{success}</div>}

            <Button type="submit" size="lg" className={styles.submit} disabled={loading}>
              {loading ? "Resetting…" : "Reset password"}
            </Button>
          </form>
        )}

        <p className={styles.footerText}>
          Remembered your password?
          <Link href="/login" className={styles.footerLink}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
