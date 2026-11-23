import { apiClient, BACKEND_API_URL } from "@/features/auth/services/apiClient.js";

/*
 * HireDue company jobs (backend docs/company-jobs.md §2–3). The base URL is
 * NEXT_PUBLIC_BACKEND_API_URL, which already ends in /api.
 */

// Public, but sent with the token when there is one so hasApplied / hasProfileResume mean something.
export function getCompanyJob(id) {
  return apiClient.get(`ats/jobs/${encodeURIComponent(id)}`, { withAuth: true });
}

/** @param {FormData} formData from buildApplicationFormData */
export function submitApplication(formData) {
  return apiClient.postForm("ats/applications", formData, { withAuth: true });
}

/**
 * Server side, for the page's title and description: the public job, or null
 * on any failure (the client page still loads and shows its own states).
 */
export async function fetchCompanyJobForMetadata(id) {
  const base = BACKEND_API_URL.replace(/\/$/, "");
  if (!/^https?:\/\//.test(base)) return null;
  try {
    const response = await fetch(`${base}/ats/jobs/${encodeURIComponent(id)}`, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(4000),
    });
    if (!response.ok) return null;
    const body = await response.json();
    return body?.data ?? null;
  } catch {
    return null;
  }
}
