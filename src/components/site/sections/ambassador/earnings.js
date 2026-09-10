import { ambassadorPage } from "@/lib/content";

const { payouts } = ambassadorPage;

export const commissionPayout = (sales) => sales * payouts.perReferral;

export const money = (n) =>
  `${payouts.currency}${Math.round(n).toLocaleString("en-US")}`;
