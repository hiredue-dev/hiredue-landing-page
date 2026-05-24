"use client";

import styles from "./Pricing.module.css";

export default function CheckoutBanner({
  variant = "info",
  message,
  onVerify,
  verifying,
  onDismiss,
  verifyLabel = "Check payment status",
}) {
  return (
    <div
      className={`${styles.banner} ${
        variant === "error" ? styles.bannerError : styles.bannerInfo
      }`.trim()}
      role="status"
      aria-live="polite"
    >
      <span>{message}</span>
      <div className={styles.bannerActions}>
        {onVerify && (
          <button
            type="button"
            className={styles.bannerBtn}
            onClick={onVerify}
            disabled={verifying}
          >
            {verifying ? "Checking…" : verifyLabel}
          </button>
        )}
        {onDismiss && (
          <button type="button" className={styles.bannerBtn} onClick={onDismiss}>
            Dismiss
          </button>
        )}
      </div>
    </div>
  );
}
