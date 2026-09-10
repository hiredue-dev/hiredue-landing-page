"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { SlideButton } from "@/components/site/ui/Button";
import { Eyebrow, Reveal } from "@/components/site/ui/Primitives";
import { useAuth } from "@/features/auth/context/AuthContext";
import { assets } from "@/lib/assets";
import { pricing } from "@/lib/content";
import { spring } from "@/lib/motion";
import useCheckoutPolling from "@/features/subscription/hooks/useCheckoutPolling";
import { createCheckout, getProducts } from "@/features/subscription/services/subscriptionService";

const CURRENCY_SYMBOLS = { INR: "₹", USD: "$", EUR: "€", GBP: "£" };

function formatPrice(priceMinor, currency) {
  const major = priceMinor / 100;
  const symbol = CURRENCY_SYMBOLS[currency] || `${currency} `;
  return `${symbol}${major.toLocaleString()}`;
}

function billingLabel(price) {
  if (!price) return "";
  const count = price.payment_frequency_count;
  const interval = price.payment_frequency_interval?.toLowerCase();
  return count === 1 ? `/ ${interval}` : `/ ${count} ${interval}s`;
}

function planTagline(price) {
  const count = price?.payment_frequency_count ?? 1;
  return count === 1 ? "Billed monthly" : `Billed every ${count} months`;
}

function planName(price) {
  const count = price?.payment_frequency_count ?? 1;
  if (count === 1) return "Monthly plan";
  return `${count}-month plan`;
}

export function Pricing() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading");

  const [checkoutLoadingId, setCheckoutLoadingId] = useState(null);
  const [checkoutError, setCheckoutError] = useState(null);

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
  }, []);

  const handleSelect = useCallback(
    async (product) => {
      setCheckoutError(null);

      if (!isAuthenticated) {
        router.push(`/signup?redirect=${encodeURIComponent("/#pricing")}`);
        return;
      }

      setCheckoutLoadingId(product.productId);
      try {
        const response = await createCheckout(product.productId);
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
    [isAuthenticated, router, start],
  );

  const featuredId =
    products.find((p) => String(p.metadata?.Is_best).toLowerCase() === "true")?.productId ??
    products[Math.floor(products.length / 2)]?.productId;

  return (
    <section id="pricing" className="relative pb-[120px] md:pb-[200px]">
      <div className="mx-auto w-full max-w-[1060px] px-[30px]">
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

                <div className="grid w-full gap-5 md:grid-cols-3">
                  {products.map((product) => (
                    <PlanCard
                      key={product.productId}
                      product={product}
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
                <SlideButton
                  label={pricing.enterprise.cta.label}
                  href={pricing.enterprise.cta.href}
                  tone="ink"
                />
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

function PlanCard({ product, featured, onSelect, loading, disabled }) {
  const { price } = product;
  const priceMinor = price?.discount
    ? Math.round(price.price * (1 - price.discount / 100))
    : price?.price;

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

      <button
        type="button"
        onClick={() => onSelect(product)}
        disabled={disabled || loading}
        className={clsx(
          "inline-flex w-full items-center justify-center rounded-full px-6 py-[18px] text-[18px] leading-[1.3] font-semibold transition-opacity duration-200 disabled:cursor-not-allowed disabled:opacity-60",
          featured ? "bg-white text-ink" : "bg-ink text-white",
        )}
      >
        {loading ? "Processing…" : pricing.ctaLabel}
      </button>

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
          <button
            type="button"
            onClick={onVerify}
            disabled={verifying}
            className="rounded-full bg-ink px-4 py-2 text-[14px] font-semibold text-white transition-opacity duration-200 hover:opacity-90 disabled:opacity-60"
          >
            {verifying ? "Checking…" : verifyLabel}
          </button>
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
