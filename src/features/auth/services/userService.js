import { apiClient } from "./apiClient.js";

export async function createUserInCloud({ id, email, fullName, phoneNumber }) {
  return apiClient.post("user", { id, email, fullName, phoneNumber });
}
