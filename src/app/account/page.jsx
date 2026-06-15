"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Button from "@/components/ui/Button/Button.jsx";
import { useAuth } from "@/features/auth/context/AuthContext.jsx";
import { getPortalLink } from "@/features/subscription/services/subscriptionService.js";
import styles from "./account.module.css";

export default function AccountPage() {
  const { user, isAuthenticated, isLoading, subscription, logout, refreshSubscription } =
    useAuth();
  const router = useRouter();
  const [portalLoading, setPortalLoading] = useState(false);
  const [portalError, setPortalError] = useState(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login?redirect=/account");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) refreshSubscription();
  }, [isAuthenticated, refreshSubscription]);

  const handlePortal = async () => {
    setPortalLoading(true);
    setPortalError(null);
    try {
      const response = await getPortalLink();
      console.log("[Account] portal response:", response);
      const url =
        response.data?.portalUrl ||
        response.data?.link ||
        response.data?.url;
      if (!response.success) {
        const backendError =
          (typeof response.error === "string" && response.error) ||
          response.error?.message ||
          response.message ||
          `Portal request failed (status ${response.status})`;
        throw new Error(backendError);
      }
      if (!url) {
        throw new Error(
          `Portal URL missing from response. Got: ${JSON.stringify(response.data)}`,
        );
      }
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (err) {
      console.error("[Account] portal error:", err);
      setPortalError(err.message || "Unable to open billing portal and this");
    } finally {
      setPortalLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/");
  };

  if (isLoading || !isAuthenticated) return null;

  const hasActive = !!subscription?.hasActiveSubscription;

  return (
    <div className={styles.page}>
      <p className={styles.eyebrow}>Account</p>
      <h1 className={styles.title}>{user?.email}</h1>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Subscription</h2>
        <div className={styles.row}>
          <span className={styles.rowLabel}>Status</span>
          <span className={hasActive ? styles.statusActive : styles.statusInactive}>
            {hasActive ? "Active" : "Not subscribed"}
          </span>
        </div>
        {subscription?.plan && (
          <div className={styles.row}>
            <span className={styles.rowLabel}>Plan</span>
            <span className={styles.rowValue}>{subscription.plan.name || subscription.plan}</span>
          </div>
        )}
        {subscription?.nextBillingDate && (
          <div className={styles.row}>
            <span className={styles.rowLabel}>Next renewal</span>
            <span className={styles.rowValue}>
              {new Date(subscription.nextBillingDate).toLocaleDateString()}
            </span>
          </div>
        )}
        {portalError && <p className={styles.notice}>{portalError}</p>}
        <div className={styles.actions}>
          {hasActive ? (
            <Button onClick={handlePortal} disabled={portalLoading}>
              {portalLoading ? "Opening portal…" : "Manage subscription"}
            </Button>
          ) : (
            <Button onClick={() => router.push("/pricing")}>View plans</Button>
          )}
          <Button variant="secondary" onClick={() => router.push("/download")}>
            Download desktop app
          </Button>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Sign out</h2>
        <p style={{ color: "var(--color-muted-foreground)", fontSize: "0.95rem" }}>
          Sign out of this browser. You will need to log in again to access your account.
        </p>
        <div className={styles.actions}>
          <Button variant="secondary" onClick={handleLogout}>Log out</Button>
        </div>
      </section>
    </div>
  );
}
