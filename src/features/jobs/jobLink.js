/**
 * The address of one job on the public site, and nothing else on it.
 *
 * Ambassadors paste this into their dashboard to make a tracked link, so it
 * must never carry the UTM tags of whoever happened to copy it.
 */

export function jobLinkFor(origin, id) {
  const url = new URL("/jobs", origin);
  url.searchParams.set("job", id);
  return url.toString();
}
