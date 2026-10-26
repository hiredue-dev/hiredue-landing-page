import { apiClient, BACKEND_API_URL } from "@/features/auth/services/apiClient.js";

// The backend's subscription API, provider-neutral (Dodo, Razorpay, trials).
// It used to live under "dodo/"; the backend keeps that prefix as a legacy
// alias for installed desktop builds.

// Public, but sent with the visitor's token when they have one: the backend
// uses it only to decide which price list a signed-in user sees. A visitor
// with no token is unaffected.
export function getProducts() {
  return apiClient.get("billing/products");
}

export function getSubscription() {
  return apiClient.get("billing/subscription");
}

// `couponCode` is optional. The backend refuses an invalid one with a message
// meant for the customer, before any payment page is opened.
export function createCheckout(productId, couponCode) {
  return apiClient.post("billing/checkout", couponCode ? { productId, couponCode } : { productId });
}

// Checks a coupon without creating anything. On success `data` holds the code
// as stored and what is known of its discount; a refused code is a 400 whose
// `error` is the reason.
export function validateCoupon(productId, couponCode) {
  return apiClient.post("billing/coupons/validate", { productId, couponCode });
}

export function getPortalLink({ sendEmail = false } = {}) {
  const suffix = sendEmail ? "?sendEmail=true" : "";
  return apiClient.get(`billing/subscription/portal${suffix}`);
}

export function cancelSubscription() {
  return apiClient.post("billing/subscription/cancel");
}

export function syncSubscription() {
  return apiClient.get("billing/subscription/sync");
}

/** A collection's plans, cheapest first: the order the pricing cards use. */
export function sortPlans(data) {
  const products = data?.collections?.[0]?.products || [];
  return [...products].sort((a, b) => (a.priceMinor ?? 0) - (b.priceMinor ?? 0));
}

// For server components: the price list a signed-out visitor sees, cached for
// an hour. Pages render it into their HTML so the plans and prices are in the
// page source, not behind "Loading plans…". Empty on any failure — the
// pricing section then loads the plans in the browser as before.
export async function getPublicPlans() {
  try {
    const base = BACKEND_API_URL.replace(/\/$/, "");
    const response = await fetch(`${base}/billing/products`, { next: { revalidate: 3600 } });
    if (!response.ok) return [];
    const body = await response.json();
    return body.success ? sortPlans(body.data) : [];
  } catch {
    return [];
  }
}
