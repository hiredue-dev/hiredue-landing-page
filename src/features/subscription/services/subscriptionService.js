import { apiClient } from "@/features/auth/services/apiClient.js";

export function getProducts() {
  return apiClient.get("dodo/products", { withAuth: false });
}

export function getSubscription() {
  return apiClient.get("dodo/subscription");
}

export function createCheckout(productId) {
  return apiClient.post("dodo/checkout", { productId });
}

export function getPortalLink({ sendEmail = false } = {}) {
  const suffix = sendEmail ? "?sendEmail=true" : "";
  return apiClient.get(`dodo/subscription/portal${suffix}`);
}

export function syncSubscription() {
  return apiClient.get("dodo/subscription/sync");
}
