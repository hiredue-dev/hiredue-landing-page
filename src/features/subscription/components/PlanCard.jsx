"use client";

import { ArrowRight, Check } from "lucide-react";

import Button from "@/components/ui/Button/Button.jsx";
import styles from "./Pricing.module.css";

const CURRENCY_SYMBOLS = { INR: "₹", USD: "$", EUR: "€", GBP: "£" };

const FEATURE_LABELS = {
  feature_1: "Core Feature 1",
  feature_2: "Core Feature 2",
  feature_3: "Core Feature 3",
  advanced_jobs: "Advanced Jobs",
  unlimited_jobs: "Unlimited Jobs",
  job_tracking: "Job Tracking",
};

function formatPrice(priceMinor, currency) {
  const major = priceMinor / 100;
  const symbol = CURRENCY_SYMBOLS[currency] || `${currency} `;
  return `${symbol}${major.toLocaleString()}`;
}

function billingLabel(price) {
  if (!price) return "";
  const count = price.payment_frequency_count;
  const interval = price.payment_frequency_interval;
  if (count === 1) return `/ ${interval.toLowerCase()}`;
  return `/ ${count} ${interval.toLowerCase()}s`;
}

// {
//   product.description && (
//     <p className={styles.cardDescription}>
//       {product.description.length > 140
//         ? `${product.description.slice(0, 140)}…`
//         : product.description}
//     </p>
//   );
// }

export default function PlanCard({ product, isFeatured, onSelect, loading, disabled }) {
  const { price } = product;
  const discountedMinor = price?.discount
    ? Math.round(price.price * (1 - price.discount / 100))
    : null;

  const cardBody = (
    <>
      <div>
        <h3 className={styles.cardName}>{product.name}</h3>
        
      </div>

      {price && (
        <div>
          <div className={styles.price}>
            <span className={styles.amount}>
              {formatPrice(discountedMinor ?? price.price, price.currency)}
            </span>
            <span className={styles.interval}>{billingLabel(price)}</span>
          </div>
          <div className={styles.priceMeta}>
            {discountedMinor && (
              <span className={styles.original}>
                {formatPrice(price.price, price.currency)}
              </span>
            )}
            {price.discount > 0 && (
              <span className={styles.badge}>Save {price.discount}%</span>
            )}
            {price.trial_period_days > 0 && (
              <span className={`${styles.badge} ${styles.badgeTrial}`}>
                {price.trial_period_days}-day free trial
              </span>
            )}
          </div>
        </div>
      )}

      {product.features?.length > 0 && (
        <ul className={styles.features}>
          {product.features.map((feature) => (
            <li key={feature} className={styles.feature}>
              <Check size={16} color="#15803d" />
              <span>{FEATURE_LABELS[feature] || feature}</span>
            </li>
          ))}
        </ul>
      )}

      <Button
        type="button"
        size="lg"
        className={styles.cta}
        onClick={() => onSelect(product)}
        disabled={disabled || loading}
      >
        {loading ? (
          "Processing…"
        ) : (
          <>
            <span>{isFeatured ? "Get Premium" : "Choose plan"}</span>
            <ArrowRight size={16} />
          </>
        )}
      </Button>
    </>
  );

  if (isFeatured) {
    return (
      <div className={styles.featuredWrapper}>
        <div className={styles.featuredHeader}>Best Value</div>
        <article className={`${styles.card} ${styles.featured}`}>
          {cardBody}
        </article>
      </div>
    );
  }

  return (
    <article className={styles.card}>
      {cardBody}
    </article>
  );
}
