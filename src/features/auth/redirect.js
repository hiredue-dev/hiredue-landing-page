/**
 * `?redirect=` comes from the URL, so anyone can craft it. Only same-site
 * paths are followed: "/jobs?apply=…" yes, "//evil.com" or "https://…" no.
 */
export function safeRedirect(value, fallback = null) {
  if (
    typeof value === "string" &&
    value.startsWith("/") &&
    !value.startsWith("//") &&
    !value.startsWith("/\\")
  ) {
    return value;
  }
  return fallback;
}

/** "/signup" + "/jobs?apply=1" → "/signup?redirect=%2Fjobs%3Fapply%3D1" */
export function withRedirect(path, redirect) {
  const target = safeRedirect(redirect);
  return target ? `${path}?redirect=${encodeURIComponent(target)}` : path;
}
