"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Button from "@/components/ui/Button/Button.jsx";
import { useAuth } from "@/features/auth/context/AuthContext.jsx";
import { getPortalLink } from "@/features/subscription/services/subscriptionService.js";
import styles from "./account.module.css";

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }) : null;

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
      const url = response.data?.portalUrl || response.data?.link || response.data?.url;
      if (!response.success) {
        throw new Error(
          (typeof response.error === "string" && response.error) ||
            response.error?.message ||
            response.message ||
            `Portal request failed (status ${response.status})`,
        );
      }
      if (!url) {
        throw new Error("Portal URL missing from the response.");
      }
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (err) {
      // Only the "Manage subscription" button below reaches this, and that
      // only shows for a paid plan — so a failure here is an actual problem,
      // not the routine "trial has no billing account yet" case. Still,
      // console.warn rather than .error: Next's dev overlay treats any
      // console.error as an unhandled-looking crash, and this is already
      // shown to the user via the notice below.
      console.warn("[Account] portal error:", err);
      setPortalError(err.message || "Unable to open the billing portal.");
    } finally {
      setPortalLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/");
  };

  if (isLoading || !isAuthenticated) return null;

  // `accessType` distinguishes a paid plan from a trial; `hasActiveSubscription`
  // alone can't, because a live trial is deliberately "active" too (it grants
  // the same product access). Using it by itself to decide whether to show
  // "Manage subscription" sent every trial user's click straight into the
  // "no billing account yet" error the portal returns for a trial row — that
  // account genuinely has nothing in Dodo to manage yet.
  const accessType = subscription?.accessType ?? "none";
  const isPaid = accessType === "paid";
  const isTrial = accessType === "trial";

  const statusLabel = isPaid ? "Active" : isTrial ? "Free trial" : "Not subscribed";
  const statusClassName = isPaid ? styles.statusActive : isTrial ? styles.statusTrial : styles.statusInactive;

  const renewalDate = formatDate(subscription?.currentPeriodEnd);
  const trialEndDate = formatDate(subscription?.trialEndsAt);

  return (
    <div className={styles.page}>
      <p className={styles.eyebrow}>Account</p>
      <h1 className={styles.title}>{user?.email}</h1>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Subscription</h2>
        <div className={styles.row}>
          <span className={styles.rowLabel}>Status</span>
          <span className={statusClassName}>{statusLabel}</span>
        </div>
        {subscription?.productName && (
          <div className={styles.row}>
            <span className={styles.rowLabel}>Plan</span>
            <span className={styles.rowValue}>{subscription.productName}</span>
          </div>
        )}
        {isPaid && renewalDate && (
          <div className={styles.row}>
            <span className={styles.rowLabel}>Next renewal</span>
            <span className={styles.rowValue}>{renewalDate}</span>
          </div>
        )}
        {isTrial && (
          <div className={styles.row}>
            <span className={styles.rowLabel}>Trial ends</span>
            <span className={styles.rowValue}>
              {trialEndDate}
              {typeof subscription?.trialDaysRemaining === "number" &&
                ` (${subscription.trialDaysRemaining} ${subscription.trialDaysRemaining === 1 ? "day" : "days"} left)`}
            </span>
          </div>
        )}
        {isTrial && (
          <p className={styles.hint}>
            You&apos;re on a free trial — there&apos;s no billing account to manage yet. Upgrade anytime to keep
            automating once it ends.
          </p>
        )}
        {portalError && <p className={styles.notice}>{portalError}</p>}
        <div className={styles.actions}>
          {isPaid ? (
            <Button onClick={handlePortal} disabled={portalLoading}>
              {portalLoading ? "Opening portal…" : "Manage subscription"}
            </Button>
          ) : (
            <Button onClick={() => router.push("/#pricing")}>
              {isTrial ? "Upgrade plan" : "View plans"}
            </Button>
          )}
          <Button variant="secondary" onClick={() => router.push("/download")}>
            Download desktop app
          </Button>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Sign out</h2>
        <p className={styles.hint}>
          Sign out of this browser. You will need to log in again to access your account.
        </p>
        <div className={styles.actions}>
          <Button variant="secondary" onClick={handleLogout}>Log out</Button>
        </div>
      </section>
    </div>
  );
}
