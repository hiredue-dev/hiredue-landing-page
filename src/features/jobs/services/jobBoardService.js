import { apiClient } from "@/features/auth/services/apiClient.js";

// Listings are public and sent without a token, so every visitor shares one
// cacheable response. LinkedIn hiring posts need the token: signed-in users get
// them in full, visitors get a locked teaser.
const PUBLIC = { withAuth: false };
const WITH_TOKEN_IF_SIGNED_IN = { withAuth: true };

export function listJobs(params) {
  const search = new URLSearchParams(params);
  const query = search.toString();
  const opts = search.get("source") === "posts" ? WITH_TOKEN_IF_SIGNED_IN : PUBLIC;
  return apiClient.get(`job-board${query ? `?${query}` : ""}`, opts);
}

export function getJobFilters() {
  return apiClient.get("job-board/filters", PUBLIC);
}

// A post's details are for signed-in users, so send the token when there is one.
export function getJob(id) {
  return apiClient.get(`job-board/${encodeURIComponent(id)}`, WITH_TOKEN_IF_SIGNED_IN);
}

export function getApplyLink(id) {
  return apiClient.get(`job-board/${encodeURIComponent(id)}/apply`);
}
