"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import Button from "@/components/ui/Button/Button.jsx";
import Input from "@/components/ui/Input/Input.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import {
  validateContactNumber,
  validateEmail,
  validateSignupPassword,
} from "../validators.js";
import { friendlyAuthError } from "../errorMessages.js";
import { COUNTRY_OPTIONS, COUNTRY_BY_ISO, detectDefaultCountry } from "../countries.js";
import OtpModal from "./OtpModal.jsx";
import styles from "./AuthForm.module.css";

const EMPTY_FORM = {
  name: "",
  email: "",
  countryCode: detectDefaultCountry(), // ISO code, e.g. "IN"
  contact: "",
  password: "",
  confirmPassword: "",
};

export default function SignupForm() {
  const { signUp, confirmSignUp, resendConfirmationCode, completeSignup } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [form, setForm] = useState(EMPTY_FORM);
  const [userSub, setUserSub] = useState(null);
  const [otpOpen, setOtpOpen] = useState(false);
  const [reverify, setReverify] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fieldErrors = {
    contact: validateContactNumber(form.contact),
    password: validateSignupPassword(form.password),
    email: validateEmail(form.email),
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "contact" ? value.replace(/\D/g, "").slice(0, 15) : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (!form.name || !form.email || !form.contact || !form.password || !form.confirmPassword) {
      setError("Please fill the required fields.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (Object.values(fieldErrors).some(Boolean)) {
      setError("Please fix the highlighted fields.");
      return;
    }

    setLoading(true);
    try {
      const result = await signUp(form.email, form.password);
      if (!result.success) {
        if (result.error === "UsernameExistsException") {
          const resend = await resendConfirmationCode(form.email);
          if (resend.success) {
            setReverify(true);
            setError(
              "Email already exists but is not verified. Please enter the verification code sent to your email.",
            );
            setOtpOpen(true);
            return;
          }
          setError("You have already registered. Please log in.");
          return;
        }
        setError(friendlyAuthError(result.error, "signup", "Sign up failed. Please try again."));
        return;
      }
      setUserSub(result.data?.userSub || null);
      setReverify(false);
      setOtpOpen(true);
    } catch (err) {
      setError(friendlyAuthError(err.message, "signup", "Sign up failed. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerify = async (code) => {
    const confirm = await confirmSignUp(form.email, code);
    if (!confirm.success) {
      throw new Error(confirm.error || "Verification failed.");
    }

    // Send the phone in E.164 format (e.g. "+919876543210") so it's
    // valid for any country and accepted by Cognito.
    const dial = COUNTRY_BY_ISO[form.countryCode]?.dial || "";
    await completeSignup({
      id: userSub || "",
      email: form.email,
      fullName: form.name,
      phoneNumber: `+${dial}${form.contact}`,
      password: form.password,
    });

    setOtpOpen(false);
    const redirect = searchParams.get("redirect") || "/pricing";
    router.replace(redirect);
  };

  const handleOtpResend = async () => {
    const result = await resendConfirmationCode(form.email);
    if (!result.success) throw new Error(result.error || "Failed to resend code.");
  };

  return (
    <div className={styles.shell}>
      <div className={styles.card}>
        <p className={styles.eyebrow}>Get started</p>
        <h1 className={styles.title}>Create your account</h1>
        <p className={styles.subtitle}>Join HireDue and start your 14-day free trial.</p>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="name">Name</label>
            <Input id="name" name="name" value={form.name} onChange={handleChange} required />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">Email</label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              required
            />
            {form.email && fieldErrors.email && (
              <span className={styles.fieldError}>{fieldErrors.email}</span>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="contact">Contact number</label>
            <div className={styles.phoneRow}>
              <select
                name="countryCode"
                aria-label="Country"
                className={styles.countrySelect}
                value={form.countryCode}
                onChange={handleChange}
              >
                {COUNTRY_OPTIONS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
              <Input
                id="contact"
                name="contact"
                type="tel"
                inputMode="numeric"
                maxLength={15}
                value={form.contact}
                onChange={handleChange}
                required
                className={styles.phoneInput}
              />
            </div>
            {form.contact && fieldErrors.contact && (
              <span className={styles.fieldError}>{fieldErrors.contact}</span>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">Password</label>
            <div className={styles.inputWrap}>
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
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
            {form.password && fieldErrors.password && (
              <span className={styles.fieldError}>{fieldErrors.password}</span>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="confirmPassword">Confirm password</label>
            <div className={styles.inputWrap}>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                style={{ paddingRight: 44 }}
              />
              <button
                type="button"
                className={styles.toggleVisibility}
                onClick={() => setShowConfirmPassword((s) => !s)}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <label className={styles.checkboxRow}>
            <input
              type="checkbox"
              checked={agreed}
              onChange={(event) => setAgreed(event.target.checked)}
              required
            />
            <span>
              I agree to the{" "}
              <Link href="/terms" className={styles.footerLink} target="_blank" rel="noopener noreferrer">Terms</Link>
              {" "}and{" "}
              <Link href="/privacy" className={styles.footerLink} target="_blank" rel="noopener noreferrer">Privacy Policy</Link>.
            </span>
          </label>

          {error && <div className={styles.error}>{error}</div>}

          <Button
            type="submit"
            size="lg"
            className={styles.submit}
            disabled={loading || !agreed}
          >
            {loading ? "Creating account…" : "Create account"}
          </Button>
        </form>

        <p className={styles.footerText}>
          Already have an account?
          <Link href="/login" className={styles.footerLink}>Sign in</Link>
        </p>
      </div>

      <OtpModal
        isOpen={otpOpen}
        email={form.email}
        onClose={() => setOtpOpen(false)}
        onVerify={handleOtpVerify}
        onResend={handleOtpResend}
      />
    </div>
  );
}
