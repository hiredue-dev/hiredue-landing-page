"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { completeGoogleSignIn } from "@/features/auth/services/googleAuthService.js";
import { useAuth } from "@/features/auth/context/AuthContext";

export default function CognitoCallbackPage() {
  const router = useRouter();
  const { loginWithGoogle } = useAuth();
  const [error, setError] = useState(null);
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    (async () => {
      try {
        const { tokens, claims } = await completeGoogleSignIn();
        await loginWithGoogle(tokens, claims);
        router.replace("/#pricing");
      } catch (err) {
        setError(err.message || "Google sign in failed. Please try again.");
      }
    })();
  }, [router, loginWithGoogle]);

  if (error) {
    return (
      <section style={styles.page}>
        <div style={styles.card}>
          <h1 style={styles.title}>Sign in failed</h1>
          <p style={styles.error}>{error}</p>
          <a href="/login" style={styles.link}>
            Back to sign in
          </a>
        </div>
      </section>
    );
  }

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

const styles = {
  page: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    padding: "40px 20px",
    background: "linear-gradient(180deg, rgba(226,245,255,0.92) 0%, rgba(237,241,244,0.74) 48%, #fff 100%)",
  },
  card: {
    width: "100%",
    maxWidth: 440,
    borderRadius: 24,
    padding: "48px 36px",
    textAlign: "center",
    background: "rgba(255,255,255,0.96)",
    border: "1px solid rgba(221,229,237,0.9)",
    boxShadow: "0 0 0 5px rgba(221,229,237,0.52), 0 26px 70px rgba(29,29,29,0.09)",
  },
  title: {
    margin: 0,
    color: "#1d1d1d",
    fontFamily: "var(--font-bricolage), 'Bricolage Grotesque', sans-serif",
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
