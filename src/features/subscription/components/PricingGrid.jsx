"use client";

import { useMemo } from "react";
import PlanCard from "./PlanCard.jsx";
import styles from "./Pricing.module.css";

function effectivePrice(price) {
  if (!price) return 0;
  return price.discount
    ? Math.round(price.price * (1 - price.discount / 100))
    : price.price;
}

export default function PricingGrid({
  collections,
  onSelect,
  checkoutLoadingProductId,
  disableAll,
}) {
  const decorated = useMemo(() => {
    return (collections || []).map((collection) => {
      const sorted = [...(collection.products || [])].sort(
        (a, b) => effectivePrice(a.price) - effectivePrice(b.price),
      );
      const best = sorted.find(
        (p) => String(p.metadata?.Is_best).toLowerCase() === "true",
      );
      const fallback = sorted.length ? sorted[sorted.length - 1] : null;
      const featuredId = best?.productId ?? fallback?.productId ?? null;
      return { ...collection, products: sorted, featuredId };
    });
  }, [collections]);

  if (!decorated.length) {
    return (
      <div className={styles.empty}>
        <p>Plans are being prepared. Please check back in a moment.</p>
      </div>
    );
  }

  return (
    <>
      {decorated.map((collection) => (
        <section key={collection.collectionId} className={styles.collection}>
          {decorated.length > 1 && (
            <h2 className={styles.collectionTitle}>{collection.collectionName}</h2>
          )}
          <div className={styles.grid}>
            {collection.products.map((product) => (
              <PlanCard
                key={product.productId}
                product={product}
                isFeatured={product.productId === collection.featuredId}
                onSelect={onSelect}
                loading={checkoutLoadingProductId === product.productId}
                disabled={
                  disableAll ||
                  (checkoutLoadingProductId &&
                    checkoutLoadingProductId !== product.productId)
                }
              />
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
