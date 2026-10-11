import { apiClient } from "./apiClient.js";
import {
  clearAttribution,
  readAttribution,
} from "@/features/attribution/attribution.js";

/**
 * Creates the backend user record. Every signup path comes through here, so this
 * is where the ambassador link a visitor arrived through is attached -- and
 * cleared once the account exists, so it is never sent for a second one.
 */
export async function createUserInCloud({ id, email, fullName, phoneNumber }) {
  const attribution = readAttribution();
  const result = await apiClient.post("user", {
    id,
    email,
    fullName,
    phoneNumber,
    ...(attribution ? { attribution } : {}),
  });
  if (result.success) clearAttribution();
  return result;
}

export async function checkAuthStatus(accessToken) {
  return apiClient.fetchWithToken("user/auth-status", accessToken);
}
