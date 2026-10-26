"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { Button } from "@/components/site/ui/Button";
import { Eyebrow, Reveal } from "@/components/site/ui/Primitives";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useAuthModal } from "@/features/auth/components/FloatingAuthModal.jsx";
import { assets } from "@/lib/assets";
import { pricing } from "@/lib/content";
import { spring } from "@/lib/motion";
import useCheckoutPolling from "@/features/subscription/hooks/useCheckoutPolling";
import {
  createCheckout,
  getProducts,
  validateCoupon,
} from "@/features/subscription/services/subscriptionService";
import { Busy } from "@/components/site/ui/Spinner";

const CURRENCY_SYMBOLS = { INR: "₹", USD: "$", EUR: "€", GBP: "£" };

const BILLING_INTERVALS = {
  day: { plan: "Daily plan", billed: "Billed daily" },
  week: { plan: "Weekly plan", billed: "Billed weekly" },
  month: { plan: "Monthly plan", billed: "Billed monthly" },
  year: { plan: "Annual plan", billed: "Billed annually" },
};

function formatPrice(priceMinor, currency) {
  const major = priceMinor / 100;
  const symbol = CURRENCY_SYMBOLS[currency] || `${currency} `;
  // A discounted price is often not a whole amount; show it to the paisa
  // (₹799.20, not ₹799.2) and leave whole amounts bare.
  const digits = Number.isInteger(major) ? 0 : 2;
  return `${symbol}${major.toLocaleString(undefined, { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;
}

/* ---- Coupons ------------------------------------------------------------
   Our coupon codes apply to Razorpay plans (ids `plan_…`). Other plans take
   their discount codes on the payment page itself, so the field is hidden for
   them rather than offering a code the checkout would refuse. */

const takesCoupon = (productId) => String(productId).startsWith("plan_");

/** Whether the coupon may be used on this plan. No plan list means every plan. */
function couponCovers(coupon, productId) {
  if (!coupon || !takesCoupon(productId)) return false;
  return !coupon.planIds?.length || coupon.planIds.includes(productId);
}

/**
 * What a plan costs with the coupon, in minor units, or null when the coupon
 * carries no discount details to preview. Never below zero.
 */
function couponPrice(baseMinor, coupon) {
  if (!coupon?.discountType || !coupon.discountValue) return null;
  const discounted =
    coupon.discountType === "percent"
      ? Math.round(baseMinor * (1 - coupon.discountValue / 100))
      : baseMinor - coupon.discountValue;
  return Math.max(0, discounted);
}

/** "your first payment" / "your first 3 payments" / null when it never ends. */
function couponSpan(coupon) {
  if (coupon.discountCycles == null) return null;
  return coupon.discountCycles === 1
    ? "your first payment"
    : `your first ${coupon.discountCycles} payments`;
}

/** One line saying what the applied coupon gives. */
function couponSummary(coupon) {
  if (!coupon.discountType || !coupon.discountValue) {
    return coupon.description || "Your discount is applied at payment.";
  }
  const amount =
    coupon.discountType === "percent"
      ? `${coupon.discountValue}% off`
      : `${formatPrice(coupon.discountValue, "INR")} off`;
  const span = couponSpan(coupon);
  return span ? `${amount} ${span}` : `${amount} every payment`;
}

const METHOD_LABELS = { upi: "UPI", card: "a card" };

function getBillingPeriod(price) {
  const parsedCount = Number(price?.payment_frequency_count);
  const count =
    Number.isFinite(parsedCount) && parsedCount > 0 ? parsedCount : 1;
  const interval = price?.payment_frequency_interval?.toLowerCase() || "month";
  return { count, interval };
}

function pluralizeInterval(interval, count) {
  if (count === 1) return interval;
  return interval.endsWith("s") ? interval : `${interval}s`;
}

function billingLabel(price) {
  if (!price) return "";
  const { count, interval } = getBillingPeriod(price);
  return count === 1
    ? `/ ${interval}`
    : `/ ${count} ${pluralizeInterval(interval, count)}`;
}

function planTagline(price) {
  const { count, interval } = getBillingPeriod(price);
  if (count === 1)
    return BILLING_INTERVALS[interval]?.billed ?? `Billed every ${interval}`;
  return `Billed every ${count} ${pluralizeInterval(interval, count)}`;
}

function planName(price) {
  const { count, interval } = getBillingPeriod(price);
  if (count === 1) {
    return (
      BILLING_INTERVALS[interval]?.plan ??
      `${interval[0].toUpperCase()}${interval.slice(1)} plan`
    );
  }
  return `${count}-${interval} plan`;
}

export function Pricing() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { showModal } = useAuthModal();

  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading");

  const [checkoutLoadingId, setCheckoutLoadingId] = useState(null);
  const [checkoutError, setCheckoutError] = useState(null);

  const [couponCode, setCouponCode] = useState("");
  // The coupon the backend accepted, with what it knows of the discount.
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState(null);
  const [applying, setApplying] = useState(false);

  const {
    polling,
    verifying,
    error: pollError,
    setError: setPollError,
    start,
    verifyNow,
  } = useCheckoutPolling({
    onActive: () => {
      setCheckoutLoadingId(null);
      router.replace("/download");
    },
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const response = await getProducts();
        if (!response.success) throw new Error(response.error || "Failed to load plans");
        const collection = response.data?.collections?.[0];
        const sorted = [...(collection?.products || [])].sort(
          (a, b) => (a.priceMinor ?? 0) - (b.priceMinor ?? 0),
        );
        if (cancelled) return;
        setProducts(sorted);
        setStatus(sorted.length ? "ready" : "error");
      } catch {
        if (!cancelled) setStatus("error");
      }
    })();
    return () => {
      cancelled = true;
    };
    // Reloaded on sign-in and sign-out: the price list can differ for a
    // signed-in visitor.
  }, [isAuthenticated]);

  // A coupon belongs to the price list it was checked against.
  useEffect(() => {
    setAppliedCoupon(null);
    setCouponError(null);
  }, [isAuthenticated]);

  const couponPlanId = products.find((p) => takesCoupon(p.productId))?.productId ?? null;

  const applyCoupon = async (event) => {
    event?.preventDefault();
    const code = couponCode.trim();
    if (!code || applying) return;

    // Checking a code needs an account, as buying does.
    if (!isAuthenticated) {
      showModal({ view: "signup", redirectTo: "/#pricing" });
      return;
    }

    setApplying(true);
    setCouponError(null);
    try {
      const response = await validateCoupon(couponPlanId, code);
      if (!response.success || !response.data?.valid) {
        throw new Error(
          (typeof response.error === "string" && response.error) ||
            "This coupon code could not be applied.",
        );
      }
      setAppliedCoupon(response.data);
      setCouponCode(response.data.code);
    } catch (err) {
      setAppliedCoupon(null);
      setCouponError(err.message);
    } finally {
      setApplying(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError(null);
  };

  const handleSelect = useCallback(
    async (product) => {
      setCheckoutError(null);

      if (!isAuthenticated) {
        showModal({ view: "signup", redirectTo: "/#pricing" });
        return;
      }

      // An applied code goes with the plans it covers; a plan it doesn't cover
      // is bought at the full price its card shows. A typed but unapplied code
      // is still sent: the backend refuses a bad one before any payment page
      // opens.
      const coupon = appliedCoupon
        ? couponCovers(appliedCoupon, product.productId)
          ? appliedCoupon.code
          : ""
        : takesCoupon(product.productId)
          ? couponCode.trim()
          : "";

      setCheckoutLoadingId(product.productId);
      try {
        const response = await createCheckout(product.productId, coupon);
        if (!response.success || !response.data?.checkoutUrl) {
          throw new Error(response.error || "Failed to create checkout session");
        }
        window.open(response.data.checkoutUrl, "_blank", "noopener,noreferrer");
        start();
      } catch (err) {
        setCheckoutError(err.message || "Something went wrong. Please try again.");
        setCheckoutLoadingId(null);
      }
    },
    [isAuthenticated, showModal, start, appliedCoupon, couponCode],
  );

  const featuredId =
    products.find((p) => String(p.metadata?.Is_best).toLowerCase() === "true")?.productId ??
    products[Math.floor(products.length / 2)]?.productId;

  return (
    <section id="pricing" className="relative pb-[120px] md:pb-[200px]">
      <div className="container-wide">
        <div className="flex flex-col items-center gap-[50px]">
          <Reveal className="flex flex-col items-center gap-2.5">
            <Eyebrow>{pricing.eyebrow}</Eyebrow>
            <h2 className="t-h2 text-center">{pricing.title}</h2>
          </Reveal>

          <div className="flex w-full flex-col items-center gap-[30px]">
            {status === "loading" && (
              <p className="t-body-lg text-dim py-[60px]">{pricing.loading}</p>
            )}
            {status === "error" && (
              <p className="t-body-lg text-dim py-[60px]">{pricing.error}</p>
            )}

            {status === "ready" && (
              <Reveal y={30} className="flex w-full flex-col gap-[30px]">
                {checkoutError && (
                  <StatusBanner
                    variant="error"
                    message={checkoutError}
                    onDismiss={() => setCheckoutError(null)}
                  />
                )}
                {polling && (
                  <StatusBanner
                    variant="info"
                    message="Checkout opened in a new tab. Waiting for payment confirmation…"
                    onVerify={verifyNow}
                    verifying={verifying}
                    verifyLabel="I've completed payment"
                  />
                )}
                {pollError && (
                  <StatusBanner
                    variant="error"
                    message={pollError}
                    onVerify={verifyNow}
                    verifying={verifying}
                    onDismiss={() => setPollError(null)}
                  />
                )}

                {couponPlanId && (
                  <CouponBox
                    code={couponCode}
                    onCodeChange={(value) => {
                      setCouponCode(value);
                      setCouponError(null);
                    }}
                    applied={appliedCoupon}
                    error={couponError}
                    applying={applying}
                    disabled={polling || checkoutLoadingId !== null}
                    onApply={applyCoupon}
                    onRemove={removeCoupon}
                  />
                )}

                <div className="grid w-full gap-5 md:grid-cols-3">
                  {products.map((product) => (
                    <PlanCard
                      key={product.productId}
                      product={product}
                      coupon={appliedCoupon}
                      featured={product.productId === featuredId}
                      onSelect={handleSelect}
                      loading={checkoutLoadingId === product.productId}
                      disabled={
                        polling ||
                        (checkoutLoadingId !== null && checkoutLoadingId !== product.productId)
                      }
                    />
                  ))}
                </div>
                <ul className="flex flex-wrap items-center justify-center gap-3">
                  {pricing.notes.map((note) => (
                    <li
                      key={note}
                      className="flex items-center gap-1.5 rounded-full bg-[rgba(16,185,129,0.12)] px-4 py-2"
                    >
                      <Image
                        src={assets.icons.checkGreen}
                        alt=""
                        width={16}
                        height={16}
                        className="size-4 shrink-0"
                      />
                      <span className="text-[15px] leading-[1.3] font-semibold text-success">
                        {note}
                      </span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}

            {/* enterprise strip */}
            <div className="relative w-full overflow-hidden rounded-[30px] bg-[linear-gradient(#e2f5ff_0%,#fff_100%)] p-[30px]">
              <div className="relative z-1 flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="flex flex-1 flex-col gap-2.5">
                  <h3 className="t-h5">{pricing.enterprise.title}</h3>
                  <p className="t-body-lg max-w-[406px]">{pricing.enterprise.description}</p>
                </div>
                <Button effect="slide" variant="ink" href={pricing.enterprise.cta.href}>{pricing.enterprise.cta.label}</Button>
              </div>
              <Image
                src={assets.pricing.enterprise}
                alt=""
                width={455}
                height={180}
                className="pointer-events-none absolute -right-[50px] -bottom-[40px] w-[455px] max-w-none"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

/** The coupon field, and once a code is accepted, what it gives. */
function CouponBox({ code, onCodeChange, applied, error, applying, disabled, onApply, onRemove }) {
  if (applied) {
    return (
      <div className="flex flex-col items-center gap-2.5" aria-live="polite">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 rounded-[16px] bg-[rgba(16,185,129,0.12)] px-5 py-3.5">
          <div className="flex flex-col text-center sm:text-left">
            <span className="text-[16px] leading-[1.3] font-semibold text-success">
              {applied.code} applied
            </span>
            <span className="text-[15px] leading-[1.3] font-medium text-ink">
              {couponSummary(applied)}
              {applied.paymentMethod && ` · Pay with ${METHOD_LABELS[applied.paymentMethod]} to get it`}
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={onRemove} disabled={disabled}>
            Remove
          </Button>
        </div>
        {/* The payment page opens on the plan's full price and only brings the
            offer in once a payment method is being chosen. Saying so here
            keeps the full price from reading as "the code failed". */}
        <p className="max-w-[560px] text-center text-[14px] leading-[1.4] font-medium text-dim">
          The payment page opens showing the full price. Your discount is applied at the payment
          step{applied.paymentMethod ? `, when you pay with ${METHOD_LABELS[applied.paymentMethod]}` : ""},
          before you are charged.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2" aria-live="polite">
      <form onSubmit={onApply} className="flex flex-wrap items-center justify-center gap-2.5">
        <label htmlFor="pricing-coupon" className="text-[16px] leading-[1.3] font-medium text-dim">
          Have a coupon code?
        </label>
        <input
          id="pricing-coupon"
          type="text"
          value={code}
          onChange={(e) => onCodeChange(e.target.value.toUpperCase())}
          placeholder="Enter code"
          autoComplete="off"
          spellCheck={false}
          maxLength={64}
          aria-invalid={!!error}
          aria-describedby={error ? "pricing-coupon-error" : undefined}
          disabled={applying || disabled}
          className={clsx(
            "w-[190px] rounded-full bg-surface px-5 py-2.5 text-[16px] font-semibold tracking-wide text-ink ring-1 outline-none placeholder:font-medium placeholder:tracking-normal placeholder:text-dim focus-visible:ring-2 focus-visible:ring-ink disabled:opacity-60",
            error ? "ring-danger/40" : "ring-line",
          )}
        />
        <Button type="submit" variant="ink" size="sm" disabled={!code.trim() || applying || disabled}>
          <Busy busy={applying} label="Checking…">Apply</Busy>
        </Button>
      </form>
      {error && (
        <p id="pricing-coupon-error" role="alert" className="text-[14px] leading-[1.3] font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

function PlanCard({ product, coupon, featured, onSelect, loading, disabled }) {
  const { price } = product;
  const listMinor = price?.discount
    ? Math.round(price.price * (1 - price.discount / 100))
    : price?.price;
  // The coupon comes off whatever the plan already costs.
  const covered = couponCovers(coupon, product.productId);
  const withCoupon = covered ? couponPrice(listMinor, coupon) : null;
  const couponEnds = withCoupon !== null ? couponSpan(coupon) : null;
  const priceMinor = withCoupon ?? listMinor;

  return (
    <div
      className={clsx(
        "flex flex-col gap-[30px] overflow-hidden rounded-[20px] p-[30px]",
        featured ? "bg-[linear-gradient(132deg,#323232_0%,#000_100%)]" : "bg-surface",
      )}
    >
      <div className="flex items-start gap-2.5">
        <div className="flex flex-1 flex-col gap-1.5">
          <h3 className={clsx("t-h5", featured && "text-white")}>{planName(price)}</h3>
          <p
            className={clsx(
              "text-[18px] leading-[1.3] font-medium",
              featured ? "text-grey" : "text-dim",
            )}
          >
            {planTagline(price)}
          </p>
        </div>
        {featured && (
          <span className="rounded-full bg-[linear-gradient(110deg,#406ae4_0%,#5290f4_100%)] px-3.5 py-1.5 text-[14px] leading-[1.3] font-semibold text-white">
            Popular
          </span>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <span
          className={clsx(
            "font-display text-[40px] leading-[1.2] font-semibold",
            featured ? "text-white" : "text-ink",
          )}
        >
          <RollingPrice value={formatPrice(priceMinor, price?.currency)} />
        </span>
        <span
          className={clsx(
            "text-[18px] leading-[1.3] font-medium",
            featured ? "text-grey" : "text-dim",
          )}
        >
          {billingLabel(price)}
        </span>
      </div>

      {(withCoupon !== null || (coupon && !covered)) && (
        <div
          className={clsx(
            "-mt-[18px] flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[15px] leading-[1.3] font-medium",
            featured ? "text-grey" : "text-dim",
          )}
        >
          {withCoupon !== null ? (
            <>
              <span className="line-through">{formatPrice(listMinor, price?.currency)}</span>
              <span className="rounded-full bg-[rgba(16,185,129,0.16)] px-2.5 py-0.5 text-[13px] font-semibold tracking-wide text-success">
                {coupon.code}
              </span>
              {couponEnds && (
                <span className="basis-full">
                  For {couponEnds}, then {formatPrice(listMinor, price?.currency)} {billingLabel(price)}
                </span>
              )}
            </>
          ) : (
            <span>{coupon.code} doesn&apos;t apply to this plan.</span>
          )}
        </div>
      )}

      <Button
        variant={featured ? "white" : "ink"}
        onClick={() => onSelect(product)}
        disabled={disabled || loading}
        className="w-full py-[18px]"
      >
        <Busy busy={loading} label="Processing…">{pricing.ctaLabel}</Busy>
      </Button>

      <ul className="flex flex-col gap-2.5">
        {product.features?.map((feature) => (
          <li key={feature} className="flex items-start gap-1.5">
            <Image
              src={assets.icons.chevronBlue}
              alt=""
              width={7}
              height={10}
              className="mt-[6px] w-[7px] shrink-0"
            />
            <span
              className={clsx(
                "text-[16px] leading-[1.3] font-medium",
                featured ? "text-[#edf1f4]" : "text-ink",
              )}
            >
              {feature}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Rolls each character when the price string changes. */
function RollingPrice({ value }) {
  const chars = String(value).split("");
  return (
    <span className="inline-flex items-baseline">
      {chars.map((char, i) => (
        <span key={i} className="relative inline-block h-[48px] overflow-hidden align-bottom">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.span
              key={char}
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "-100%", opacity: 0 }}
              transition={spring(0.45)}
              className="block"
            >
              {char}
            </motion.span>
          </AnimatePresence>
        </span>
      ))}
    </span>
  );
}

/** Checkout status / error banner shown above the plan cards. */
function StatusBanner({ variant, message, onVerify, verifying, onDismiss, verifyLabel }) {
  const error = variant === "error";
  return (
    <div
      role="status"
      aria-live="polite"
      className={clsx(
        "flex flex-wrap items-center justify-between gap-3 rounded-[16px] px-5 py-4",
        error ? "bg-danger-05 ring-1 ring-danger/20" : "bg-[rgba(64,106,228,0.08)]",
      )}
    >
      <span className={clsx("text-[15px] leading-[1.3] font-medium", error ? "text-danger" : "text-ink")}>
        {message}
      </span>
      <div className="flex items-center gap-2.5">
        {onVerify && (
          <Button variant="ink" size="sm" onClick={onVerify} disabled={verifying}>
            <Busy busy={verifying} label="Checking…">{verifyLabel}</Busy>
          </Button>
        )}
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="rounded-full px-4 py-2 text-[14px] font-semibold text-dim ring-1 ring-line hover:text-ink"
          >
            Dismiss
          </button>
        )}
      </div>
    </div>
  );
}
