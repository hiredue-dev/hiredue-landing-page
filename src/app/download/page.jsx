"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import Button from "@/components/ui/Button/Button.jsx";
import { useAuth } from "@/features/auth/context/AuthContext.jsx";
import styles from "./download.module.css";

const DOWNLOAD_URL = process.env.NEXT_PUBLIC_DESKTOP_DOWNLOAD_URL || "";

export default function DownloadPage() {
  const { isAuthenticated, isLoading, hasActiveSubscription } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login?redirect=/download");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) return null;

  return (
    <div className={styles.page}>
      <p className={styles.eyebrow}>You're in</p>
      <h1 className={styles.title}>Download HireDue for desktop</h1>
      <p className={styles.subtitle}>
        Your account is ready. Install the desktop app to start automating your
        job search with HireDue.
      </p>

      {hasActiveSubscription && <span className={styles.statusBadge}>Subscription active</span>}

      <div className={styles.actions}>
        <Button
          as="a"
          href={DOWNLOAD_URL || "#"}
          target="_blank"
          rel="noopener noreferrer"
          size="lg"
        >
          Download for macOS / Windows
        </Button>
        <Button variant="secondary" onClick={() => router.push("/account")}>
          Manage account
        </Button>
      </div>

      <div className={styles.notice}>
        <strong>Already installed?</strong> Open the desktop app and sign in with the same
        email and password — your subscription and account will be synced automatically.
      </div>
    </div>
  );
}
