"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

import { Eyebrow, Reveal } from "@/components/site/ui/Primitives";
import { useAuth } from "@/features/auth/context/AuthContext.jsx";
import { useAuthModal } from "@/features/auth/components/FloatingAuthModal.jsx";
import { cancelSubscription, getPortalLink } from "@/features/subscription/services/subscriptionService.js";
import { assets } from "@/lib/assets";

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }) : null;

/*
 * The site's pill buttons, as plain <button>s: every action here calls
 * something rather than navigating, so the href-based buttons in
 * components/site/ui/Button do not fit.
 */
const PILL =
  "inline-flex items-center justify-center rounded-full px-7 py-[15px] text-[16px] leading-[1.3] font-semibold transition-opacity duration-200 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60";

const PILL_TONE = {
  primary:
    "bg-[linear-gradient(110deg,#3b82f6_0%,#406ae4_100%)] text-white shadow-[inset_4px_4px_8px_0_rgba(255,255,255,0.3),inset_-4px_-4px_8px_0_rgba(255,255,255,0.3),0_8px_16px_0_rgba(58,119,229,0.5)]",
  ink: "bg-ink text-white",
  white: "bg-white text-ink",
  outline: "bg-transparent text-ink ring-1 ring-line hover:bg-surface hover:opacity-100",
  // On the dark plan card.
  ghost: "bg-white/10 text-white ring-1 ring-white/25 hover:bg-white/15 hover:opacity-100",
};

function Pill({ tone = "ink", className, ...props }) {
  return <button type="button" className={clsx(PILL, PILL_TONE[tone], className)} {...props} />;
}

/** One labelled fact on the plan card. */
function Fact({ label, value, dark }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className={clsx("text-[14px] leading-[1.3] font-medium", dark ? "text-grey" : "text-dim")}>{label}</dt>
      <dd className={clsx("text-[18px] leading-[1.3] font-semibold", dark ? "text-white" : "text-ink")}>{value}</dd>
    </div>
  );
}

export default function AccountPage() {
  const { user, isAuthenticated, isLoading, subscription, logout, refreshSubscription } =
    useAuth();
  const router = useRouter();
  const { showModal } = useAuthModal();
  const [portalLoading, setPortalLoading] = useState(false);
  const [portalError, setPortalError] = useState(null);
  const [confirmingCancel, setConfirmingCancel] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  /* Signed out — usually a "Manage subscription" link from an email or the
     desktop app. Ask for the sign-in right here rather than bouncing to the
     home page; once signed in, this page simply renders. Skipped after
     logging out on purpose, which heads home instead. */
  const loggingOut = useRef(false);
  const signedOut = !isLoading && !isAuthenticated;
  useEffect(() => {
    if (signedOut && !loggingOut.current) showModal({ view: "signin", redirectTo: "/account" });
  }, [signedOut, showModal]);

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

  const handleCancel = async () => {
    setCancelling(true);
    setPortalError(null);
    try {
      const response = await cancelSubscription();
      if (!response.success) {
        throw new Error(
          (typeof response.error === "string" && response.error) ||
            response.message ||
            "Unable to cancel the subscription.",
        );
      }
      setConfirmingCancel(false);
      await refreshSubscription();
    } catch (err) {
      console.warn("[Account] cancel error:", err);
      setPortalError(err.message || "Unable to cancel the subscription.");
    } finally {
      setCancelling(false);
    }
  };

  const handleLogout = async () => {
    loggingOut.current = true;
    await logout();
    router.replace("/");
  };

  if (isLoading) return <AccountSkeleton />;
  if (!isAuthenticated) return <SignedOut onSignIn={() => showModal({ view: "signin", redirectTo: "/account" })} />;

  // `accessType` distinguishes a paid plan from a trial; `hasActiveSubscription`
  // alone can't, because a live trial is deliberately "active" too (it grants
  // the same product access). Using it by itself to decide whether to show
  // "Manage subscription" sent every trial user's click straight into the
  // "no billing account yet" error the portal returns for a trial row — that
  // account genuinely has nothing in Dodo to manage yet.
  const accessType = subscription?.accessType ?? "none";
  const isPaid = accessType === "paid";
  const isTrial = accessType === "trial";
  // Signed up, but the trial's clock hasn't started: it starts once the job
  // profile is set up in the desktop app, not at signup.
  const isTrialPending = !isPaid && !isTrial && !!subscription?.trialPending;
  const pendingTrialDays = subscription?.trialDays;

  // Razorpay has no customer portal, so a plan it bills is managed here: this
  // page is where "Manage subscription" in the desktop app lands. Asking the
  // backend for a portal link would only hand back this page's own address.
  const managedHere = isPaid && subscription?.paymentProvider === "razorpay";
  // Cancelled, but paid up to the end of the current period.
  const endsAtPeriodEnd = isPaid && !!subscription?.cancelAtPeriodEnd;

  const renewalDate = formatDate(subscription?.currentPeriodEnd);
  const trialEndDate = formatDate(subscription?.trialEndsAt);
  const daysLeft = subscription?.trialDaysRemaining;

  const status = isPaid
    ? endsAtPeriodEnd
      ? { label: "Ending soon", className: "bg-[rgba(245,158,11,0.18)] text-[#fbbf24]" }
      : { label: "Active", className: "bg-[rgba(16,185,129,0.18)] text-[#34d399]" }
    : isTrial
      ? { label: "Free trial", className: "bg-[rgba(64,106,228,0.12)] text-brand" }
      : isTrialPending
        ? { label: "Trial not started", className: "bg-[rgba(64,106,228,0.12)] text-brand" }
        : { label: "No plan", className: "bg-white text-dim" };

  const planTitle = isPaid
    ? subscription?.productName || "HireDue Pro"
    : isTrial
      ? "Free trial"
      : isTrialPending
        ? "Your free trial is waiting"
        : "You're not subscribed";

  const planBlurb = isPaid
    ? endsAtPeriodEnd
      ? `Your subscription is cancelled and won't renew. You keep full access until ${renewalDate || "the end of the current period"}, and you won't be charged again.`
      : "Your agent is searching, applying and reaching out every day."
    : isTrial
      ? "You have full access while your trial runs. Upgrade anytime to keep your agent working once it ends."
      : isTrialPending
        ? `Your ${pendingTrialDays ? `${pendingTrialDays}-day ` : ""}free trial starts when you download the desktop app and set up your job profile, so you don't lose any days before you're ready.`
        : "Pick a plan to switch your agent on: daily applications, recruiter outreach and tracking.";

  return (
    <AccountShell>
      <div className="flex flex-col gap-[40px]">
        <Reveal className="flex flex-col items-center gap-2.5 text-center">
          <Eyebrow>Your account</Eyebrow>
          <h1 className="t-h2">Manage your plan</h1>
          <p className="t-body-lg break-all">{user?.email}</p>
        </Reveal>

        {/* ---- Plan ---- */}
        <Reveal y={30}>
          <div
            className={clsx(
              "flex flex-col gap-[30px] overflow-hidden rounded-[30px] p-[30px] sm:p-[40px]",
              isPaid ? "bg-[linear-gradient(132deg,#323232_0%,#000_100%)]" : "bg-surface",
            )}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <span className={clsx("text-[16px] leading-[1.3] font-medium", isPaid ? "text-grey" : "text-dim")}>
                  Current plan
                </span>
                <h2 className={clsx("t-h4", isPaid && "text-white")}>{planTitle}</h2>
              </div>
              <span
                className={clsx(
                  "rounded-full px-4 py-2 text-[14px] leading-[1.3] font-semibold",
                  status.className,
                )}
              >
                {status.label}
              </span>
            </div>

            <p className={clsx("max-w-[560px] text-[18px] leading-[1.4] font-medium", isPaid ? "text-[#edf1f4]" : "text-dim")}>
              {planBlurb}
            </p>

            {(isPaid && renewalDate) || isTrial ? (
              <dl
                className={clsx(
                  "grid gap-6 border-t pt-[30px] sm:grid-cols-2",
                  isPaid ? "border-white/15" : "border-line",
                )}
              >
                {isPaid && renewalDate && (
                  <Fact dark label={endsAtPeriodEnd ? "Access until" : "Next renewal"} value={renewalDate} />
                )}
                {isPaid && (
                  <Fact dark label="Billing" value={endsAtPeriodEnd ? "Won't renew" : "Renews automatically"} />
                )}
                {isTrial && trialEndDate && <Fact label="Trial ends" value={trialEndDate} />}
                {isTrial && typeof daysLeft === "number" && (
                  <Fact label="Time left" value={`${daysLeft} ${daysLeft === 1 ? "day" : "days"}`} />
                )}
              </dl>
            ) : null}

            {managedHere && confirmingCancel && (
              <div className="rounded-[20px] bg-white/10 p-5 ring-1 ring-white/15">
                <p className="text-[18px] leading-[1.3] font-semibold text-white">Cancel your subscription?</p>
                <p className="mt-1.5 text-[16px] leading-[1.4] font-medium text-[#edf1f4]">
                  You keep full access until {renewalDate || "the end of the current period"} and won&apos;t be
                  charged again. A cancelled subscription can&apos;t be restarted — you would subscribe again from
                  the pricing page.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Pill tone="white" onClick={handleCancel} disabled={cancelling}>
                    {cancelling ? "Cancelling…" : "Yes, cancel subscription"}
                  </Pill>
                  <Pill tone="ghost" onClick={() => setConfirmingCancel(false)} disabled={cancelling}>
                    Keep subscription
                  </Pill>
                </div>
              </div>
            )}

            {portalError && (
              <p
                role="alert"
                className={clsx(
                  "rounded-[16px] px-5 py-4 text-[15px] leading-[1.3] font-medium",
                  isPaid ? "bg-[rgba(245,28,35,0.16)] text-[#fca5a5]" : "bg-danger-05 text-danger ring-1 ring-danger/20",
                )}
              >
                {portalError}
              </p>
            )}

            {!(managedHere && (endsAtPeriodEnd || confirmingCancel)) && (
              <div className="flex flex-wrap gap-3">
                {managedHere ? (
                  <Pill tone="ghost" onClick={() => setConfirmingCancel(true)}>
                    Cancel subscription
                  </Pill>
                ) : isPaid ? (
                  <Pill tone="white" onClick={handlePortal} disabled={portalLoading}>
                    {portalLoading ? "Opening portal…" : "Manage subscription"}
                  </Pill>
                ) : isTrialPending ? (
                  <>
                    <Pill tone="primary" onClick={() => router.push("/download")}>
                      Download the app
                    </Pill>
                    <Pill tone="outline" onClick={() => router.push("/#pricing")}>
                      View plans
                    </Pill>
                  </>
                ) : (
                  <Pill tone="primary" onClick={() => router.push("/#pricing")}>
                    {isTrial ? "Upgrade plan" : "View plans"}
                  </Pill>
                )}
              </div>
            )}
          </div>
        </Reveal>

        {/* ---- Desktop app + sign out ---- */}
        <Reveal y={30} delay={0.1} className="grid gap-5 md:grid-cols-2">
          <div className="relative flex min-h-[230px] flex-col justify-between gap-6 overflow-hidden rounded-[30px] bg-[linear-gradient(#e2f5ff_0%,#fff_100%)] p-[30px] ring-1 ring-line-70">
            <div className="relative z-1 flex flex-col gap-2">
              <h3 className="t-h5">Desktop app</h3>
              <p className="t-body-lg max-w-[300px]">
                Your agent runs from the HireDue app for macOS and Windows.
              </p>
            </div>
            <Pill tone="ink" className="relative z-1 self-start" onClick={() => router.push("/download")}>
              Download the app
            </Pill>
            <Image
              src={assets.pricing.enterprise}
              alt=""
              width={455}
              height={180}
              className="pointer-events-none absolute -right-[120px] -bottom-[50px] w-[380px] max-w-none opacity-80"
            />
          </div>

          <div className="flex min-h-[230px] flex-col justify-between gap-6 rounded-[30px] bg-surface p-[30px]">
            <div className="flex flex-col gap-2">
              <h3 className="t-h5">Sign out</h3>
              <p className="t-body-lg max-w-[320px]">
                Sign out of this browser. You&apos;ll need to log in again to reach your account.
              </p>
            </div>
            <Pill tone="outline" className="self-start bg-white" onClick={handleLogout}>
              Log out
            </Pill>
          </div>
        </Reveal>
      </div>
    </AccountShell>
  );
}

/** Same frame as the page, so nothing jumps when the account loads. */
function AccountShell({ children }) {
  return (
    <section className="relative pt-[140px] pb-[100px] min-[810px]:pt-[170px] min-[810px]:pb-[140px] min-[1200px]:pt-[194px]">
      <div className="mx-auto w-full max-w-[900px] px-[30px]">{children}</div>
    </section>
  );
}

function AccountSkeleton() {
  return (
    <AccountShell>
      <div aria-busy="true" aria-label="Loading your account" className="flex animate-pulse flex-col gap-[40px] motion-reduce:animate-none">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-32 rounded-full bg-surface" />
          <div className="h-12 w-72 rounded-[12px] bg-surface" />
          <div className="h-5 w-56 rounded bg-surface" />
        </div>
        <div className="h-[320px] rounded-[30px] bg-surface" />
      </div>
    </AccountShell>
  );
}

function SignedOut({ onSignIn }) {
  return (
    <AccountShell>
      <div className="flex flex-col items-center gap-2.5 text-center">
        <Eyebrow>Your account</Eyebrow>
        <h1 className="t-h2">Log in to manage your plan</h1>
        <p className="t-body-lg max-w-[520px]">
          Your plan, billing and subscription settings are here once you&apos;re signed in.
        </p>
        <Pill tone="primary" onClick={onSignIn} className="mt-5">
          Log in
        </Pill>
      </div>
    </AccountShell>
  );
}
