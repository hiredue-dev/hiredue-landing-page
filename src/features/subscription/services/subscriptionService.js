import { apiClient } from "@/features/auth/services/apiClient.js";

// Public, but sent with the visitor's token when they have one: the backend
// uses it only to decide which price list a signed-in user sees. A visitor
// with no token is unaffected.
export function getProducts() {
  return apiClient.get("dodo/products");
}

export function getSubscription() {
  return apiClient.get("dodo/subscription");
}

// `couponCode` is optional. The backend refuses an invalid one with a message
// meant for the customer, before any payment page is opened.
export function createCheckout(productId, couponCode) {
  return apiClient.post("dodo/checkout", couponCode ? { productId, couponCode } : { productId });
}

// Checks a coupon without creating anything. On success `data` holds the code
// as stored and what is known of its discount; a refused code is a 400 whose
// `error` is the reason.
export function validateCoupon(productId, couponCode) {
  return apiClient.post("dodo/coupons/validate", { productId, couponCode });
}

export function getPortalLink({ sendEmail = false } = {}) {
  const suffix = sendEmail ? "?sendEmail=true" : "";
  return apiClient.get(`dodo/subscription/portal${suffix}`);
}

export function cancelSubscription() {
  return apiClient.post("dodo/subscription/cancel");
}

export function syncSubscription() {
  return apiClient.get("dodo/subscription/sync");
}
