"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  exchangeGoogleCode,
  commitGoogleTokens,
  discardGoogleTokens,
  getGoogleRedirectAfterAuth,
} from "@/features/auth/services/googleAuthService.js";
import { checkAuthStatus } from "@/features/auth/services/userService.js";
import { useAuth } from "@/features/auth/context/AuthContext";
import {
  COUNTRIES,
  COUNTRY_OPTIONS,
  detectDefaultCountry,
} from "@/features/auth/countries.js";
import { validateContactNumber } from "@/features/auth/validators.js";

export default function CognitoCallbackPage() {
  const router = useRouter();
  const { loginWithGoogle } = useAuth();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState(() => detectDefaultCountry());
  const [authData, setAuthData] = useState(null);

  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    const resolveAuth = async () => {
      let accessToken, tokens, claims;
      try {
        const result = await exchangeGoogleCode();
        tokens = result.tokens;
        claims = result.claims;
        accessToken = tokens.accessToken;
      } catch (err) {
        console.error("Google token exchange failed:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Unable to complete sign in. Please try again."
        );
        setLoading(false);
        return;
      }

      let statusResp;
      try {
        statusResp = await checkAuthStatus(accessToken);
      } catch (err) {
        console.error("auth-status check failed:", err);
        discardGoogleTokens();
        setError(
          "Unable to verify your account. Please try again."
        );
        setLoading(false);
        return;
      }

      if (!statusResp.success) {
        discardGoogleTokens();
        setError(
          statusResp.error || "Unable to verify your account."
        );
        setLoading(false);
        return;
      }

      const { status } = statusResp.data;

      if (status === "registered") {
        commitGoogleTokens(tokens);
        try {
          await loginWithGoogle(tokens, claims);
          const redirectTo = getGoogleRedirectAfterAuth() || "/#pricing";
          router.replace(redirectTo);
          return;
        } catch (err) {
          console.error("loginWithGoogle failed:", err);
          setError(
            err instanceof Error
              ? err.message
              : "Unable to sign in. Please try again."
          );
          setLoading(false);
          return;
        }
      }

      if (status === "email_taken") {
        discardGoogleTokens();
        setError(
          "This email is already registered with a password. Please sign in with your password instead."
        );
        setLoading(false);
        return;
      }

      setAuthData({ tokens, claims });
      setLoading(false);
    };

    resolveAuth();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const buildE164 = () => {
    const country = COUNTRIES.find((c) => c.iso === countryCode);
    const dial = country ? country.dial : "";
    const digits = phone.replace(/\D/g, "");
    return `+${dial}${digits}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) return;

    const digits = phone.replace(/\D/g, "");
    const phoneErr = validateContactNumber(digits);
    if (phoneErr) {
      setError(phoneErr);
      return;
    }
    if (digits.length < 5) {
      setError("Please enter a valid phone number.");
      return;
    }

    if (!authData?.tokens || !authData?.claims) {
      setError("Your sign-in session has expired. Please try again.");
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      const { tokens, claims } = authData;

      commitGoogleTokens(tokens);

      const updatedClaims = {
        ...claims,
        phoneNumber: buildE164(),
      };

      await loginWithGoogle(tokens, updatedClaims);

      const redirectTo = getGoogleRedirectAfterAuth() || "/#pricing";
      router.replace(redirectTo);
    } catch (err) {
      console.error("Google signup failed:", err);
      discardGoogleTokens();

      setError(
        err instanceof Error
          ? err.message
          : "Unable to complete sign up. Please try again."
      );

      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <section style={styles.page}>
        <div style={styles.card}>
          <h1 style={styles.title}>Completing sign in…</h1>
          <p style={styles.subtitle}>
            Finishing your Google sign in. You&apos;ll be redirected shortly.
          </p>
          <div style={styles.spinner} aria-hidden />
        </div>
      </section>
    );
  }

  if (error && !authData) {
    return (
      <section style={styles.page}>
        <div style={styles.card}>
          <h1 style={styles.title}>Sign in failed</h1>
          <p style={styles.error}>{error}</p>
          <Link href="/" style={styles.link}>
            Back to sign in
          </Link>
        </div>
      </section>
    );
  }

  const name = authData?.claims?.name || "";
  const email = authData?.claims?.email || "";

  return (
    <section style={styles.page}>
      <div style={styles.modal}>
        <Link href="/" style={styles.closeButton} aria-label="Close">
          ×
        </Link>

        <div style={styles.header}>
          <h1 style={styles.modalTitle}>Almost there</h1>

          <p style={styles.modalSubtitle}>
            Signed in as{" "}
            <span style={styles.email}>{email}</span>.
            <br />
            We just need a phone number to finish
            <br />
            setting up your account.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <label style={styles.label}>
            NAME <span style={styles.required}>*</span>
          </label>

          <input
            type="text"
            value={name}
            disabled
            style={styles.input}
          />

          <label style={styles.phoneLabel}>
            Contact Number <span style={styles.required}>*</span>
          </label>

          <div style={styles.phoneRow}>
            <select
              aria-label="Country"
              style={styles.countrySelect}
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
            >
              {COUNTRY_OPTIONS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>

            <input
              type="tel"
              value={phone}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                setPhone(value);
              }}
              autoFocus
              disabled={submitting}
              placeholder="Phone number"
              maxLength={15}
              style={styles.phoneInput}
            />
          </div>

          {error && <p style={styles.formError}>{error}</p>}

          <button
            type="submit"
            disabled={submitting || !phone.trim()}
            style={{
              ...styles.submitButton,
              opacity: submitting || !phone.trim() ? 0.6 : 1,
              cursor:
                submitting || !phone.trim()
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            {submitting ? "Finishing..." : "Finish signing up"}
          </button>
        </form>
      </div>
    </section>
  );
}




const styles = {
  page: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    padding: "40px 20px",
    background:
      "linear-gradient(180deg, rgba(226,245,255,0.92) 0%, rgba(237,241,244,0.74) 48%, #fff 100%)",
  },

  card: {
    width: "100%",
    maxWidth: 440,
    borderRadius: 24,
    padding: "48px 36px",
    textAlign: "center",
    background: "rgba(255,255,255,0.96)",
    border: "1px solid rgba(221,229,237,0.9)",
    boxShadow:
      "0 0 0 5px rgba(221,229,237,0.52), 0 26px 70px rgba(29,29,29,0.09)",
  },

  modal: {
    position: "relative",
    width: "100%",
    maxWidth: 350,
    borderRadius: 9,
    padding: "48px 24px 24px",
    background: "#fff",
    boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
  },

  closeButton: {
    position: "absolute",
    top: 10,
    right: 13,
    color: "#64748b",
    fontSize: 25,
    lineHeight: 1,
    fontWeight: 300,
    textDecoration: "none",
  },

  header: {
    textAlign: "center",
  },

  modalTitle: {
    margin: 0,
    color: "#151b2b",
    fontFamily:
      "var(--font-bricolage), 'Bricolage Grotesque', sans-serif",
    fontSize: 23,
    lineHeight: 1.2,
    fontWeight: 700,
    letterSpacing: "-0.5px",
  },

  modalSubtitle: {
    margin: "20px 0 0",
    color: "#697386",
    fontSize: 15,
    lineHeight: "21px",
    fontWeight: 400,
  },

  email: {
    color: "#566174",
    fontWeight: 700,
  },

  label: {
    display: "block",
    marginTop: 21,
    color: "#667085",
    fontSize: 14,
    fontWeight: 700,
    letterSpacing: "0.2px",
  },

  required: {
    color: "#ef4444",
  },

  input: {
    width: "100%",
    height: 52,
    marginTop: 9,
    padding: "0 19px",
    borderRadius: 14,
    border: "1px solid #dfe4ea",
    outline: "none",
    background: "#fff",
    color: "#1f2937",
    fontSize: 16,
    boxSizing: "border-box",
  },

  phoneLabel: {
    display: "block",
    marginTop: 20,
    color: "#172033",
    fontSize: 14,
    fontWeight: 500,
  },

  phoneRow: {
    display: "flex",
    gap: 7,
    marginTop: 9,
  },

  countrySelect: {
    width: 168,
    height: 50,
    padding: "0 14px",
    borderRadius: 14,
    border: "1px solid #dfe4ea",
    color: "#344054",
    fontSize: 14,
    boxSizing: "border-box",
    background: "#fff",
    cursor: "pointer",
  },

  phoneInput: {
    flex: 1,
    minWidth: 0,
    height: 50,
    padding: "0 14px",
    borderRadius: 14,
    border: "1px solid #3268ff",
    outline: "none",
    boxShadow: "0 0 0 3px rgba(50,104,255,0.16)",
    color: "#1f2937",
    fontSize: 16,
    boxSizing: "border-box",
  },

  formError: {
    margin: "10px 0 0",
    color: "#b91c1c",
    fontSize: 13,
    lineHeight: 1.4,
  },

  submitButton: {
    width: "100%",
    height: 59,
    marginTop: 19,
    border: "none",
    borderRadius: 16,
    background: "#000",
    color: "#fff",
    fontSize: 17,
    fontWeight: 600,
  },

  title: {
    margin: 0,
    color: "#1d1d1d",
    fontFamily:
      "var(--font-bricolage), 'Bricolage Grotesque', sans-serif",
    fontSize: 28,
    lineHeight: 1.15,
    fontWeight: 600,
    letterSpacing: "-0.5px",
  },

  subtitle: {
    margin: "12px 0 0",
    color: "#4d585f",
    fontSize: 15,
    lineHeight: 1.45,
    fontWeight: 500,
  },

  error: {
    margin: "12px 0 0",
    borderRadius: 12,
    padding: "11px 13px",
    border: "1px solid rgba(245,28,35,0.14)",
    color: "#b91c1c",
    background: "rgba(245,28,35,0.06)",
    fontSize: 13,
    lineHeight: 1.4,
    fontWeight: 550,
  },

  link: {
    display: "inline-block",
    marginTop: 16,
    color: "#406ae4",
    fontWeight: 700,
    fontSize: 14,
    textDecoration: "none",
  },

  spinner: {
    width: 28,
    height: 28,
    margin: "24px auto 0",
    borderRadius: "50%",
    border: "3px solid #dde5ed",
    borderTopColor: "#406ae4",
    animation: "spin 0.7s linear infinite",
  },
};