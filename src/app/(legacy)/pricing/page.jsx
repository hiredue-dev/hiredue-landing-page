"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import CheckoutBanner from "@/features/subscription/components/CheckoutBanner.jsx";
import PricingGrid from "@/features/subscription/components/PricingGrid.jsx";
import useCheckoutPolling from "@/features/subscription/hooks/useCheckoutPolling.js";
import {
  createCheckout,
  getProducts,
} from "@/features/subscription/services/subscriptionService.js";
import { useAuth } from "@/features/auth/context/AuthContext.jsx";
import styles from "@/features/subscription/components/Pricing.module.css";

export default function PricingPage() {
  const { isAuthenticated, isLoading, hasActiveSubscription } = useAuth();
  const router = useRouter();

  const [collections, setCollections] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(null);

  const [checkoutLoadingId, setCheckoutLoadingId] = useState(null);
  const [checkoutError, setCheckoutError] = useState(null);

  const { polling, verifying, error: pollError, setError: setPollError, start, verifyNow } =
    useCheckoutPolling({
      onActive: () => {
        setCheckoutLoadingId(null);
        router.replace("/download");
      },
    });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setProductsLoading(true);
      setProductsError(null);
      try {
        const response = await getProducts();
        if (!response.success) throw new Error(response.error || "Failed to load plans");
        if (!cancelled) setCollections(response.data?.collections || []);
      } catch (err) {
        if (!cancelled) setProductsError(err.message || "Failed to load plans");
      } finally {
        if (!cancelled) setProductsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isLoading && isAuthenticated && hasActiveSubscription) {
      router.replace("/download");
    }
  }, [isLoading, isAuthenticated, hasActiveSubscription, router]);

  const handleSelect = useCallback(
    async (product) => {
      setCheckoutError(null);

      if (!isAuthenticated) {
        router.push(`/signup?redirect=${encodeURIComponent("/pricing")}`);
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

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Pricing</p>
        <h1 className={styles.title}>Choose the plan that moves you forward.</h1>
        <p className={styles.subtitle}>
          Start with a free trial. Upgrade, downgrade, or cancel anytime.
        </p>
      </header>

      {checkoutError && (
        <CheckoutBanner
          variant="error"
          message={checkoutError}
          onDismiss={() => setCheckoutError(null)}
        />
      )}

      {polling && (
        <CheckoutBanner
          variant="info"
          message="Checkout opened in a new tab. Waiting for payment confirmation…"
          onVerify={verifyNow}
          verifying={verifying}
          verifyLabel="I've completed payment"
        />
      )}

      {pollError && (
        <CheckoutBanner
          variant="error"
          message={pollError}
          onVerify={verifyNow}
          verifying={verifying}
          onDismiss={() => setPollError(null)}
        />
      )}

      {productsLoading ? (
        <div className={styles.loading}>Curating your plans…</div>
      ) : productsError ? (
        <div className={styles.empty}>Failed to load plans: {productsError}</div>
      ) : (
        <PricingGrid
          collections={collections}
          onSelect={handleSelect}
          checkoutLoadingProductId={checkoutLoadingId}
          disableAll={polling}
        />
      )}
    </div>
  );
}
