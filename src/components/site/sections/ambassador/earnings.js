import { ambassadorPage } from "@/lib/content";

const { payouts } = ambassadorPage;

/**
 * The rate card is a handful of points, so anything between them is read off
 * a straight line between the two neighbouring tiers. Above the top tier the
 * top tier's own rate carries on.
 */
export function viewsPayout(views) {
  const tiers = payouts.tiers;
  const first = tiers[0];
  if (views <= first.views) return Math.round((views / first.views) * first.payout);

  for (let i = 1; i < tiers.length; i += 1) {
    const lo = tiers[i - 1];
    const hi = tiers[i];
    if (views <= hi.views) {
      const k = (views - lo.views) / (hi.views - lo.views);
      return Math.round(lo.payout + k * (hi.payout - lo.payout));
    }
  }

  const top = tiers[tiers.length - 1];
  return Math.round((views / top.views) * top.payout);
}

export const commissionPayout = (sales) =>
  Math.round(sales * payouts.planPrice * payouts.commission);

export const money = (n) => `${payouts.currency}${Math.round(n).toLocaleString("en-US")}`;

export const compactViews = (n) =>
  n >= 1_000_000
    ? `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`
    : n >= 1_000
      ? `${Math.round(n / 1_000)}K`
      : `${n}`;
