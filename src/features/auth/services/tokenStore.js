const KEY_ACCESS = "hd_access_token";
const KEY_ID = "hd_id_token";
const KEY_REFRESH = "hd_refresh_token";
const KEY_USER_EMAIL = "hd_user_email";

const isBrowser = () => typeof window !== "undefined";

export function setTokens({ accessToken, idToken, refreshToken } = {}) {
  if (!isBrowser()) return;
  if (accessToken) localStorage.setItem(KEY_ACCESS, accessToken);
  if (idToken) localStorage.setItem(KEY_ID, idToken);
  if (refreshToken) localStorage.setItem(KEY_REFRESH, refreshToken);
}

export function getAccessToken() {
  if (!isBrowser()) return null;
  return localStorage.getItem(KEY_ACCESS);
}

export function getIdToken() {
  if (!isBrowser()) return null;
  return localStorage.getItem(KEY_ID);
}

export function getRefreshToken() {
  if (!isBrowser()) return null;
  return localStorage.getItem(KEY_REFRESH);
}

export function setUserEmail(email) {
  if (!isBrowser() || !email) return;
  localStorage.setItem(KEY_USER_EMAIL, email);
}

export function getUserEmail() {
  if (!isBrowser()) return null;
  return localStorage.getItem(KEY_USER_EMAIL);
}

export function clearTokens() {
  if (!isBrowser()) return;
  localStorage.removeItem(KEY_ACCESS);
  localStorage.removeItem(KEY_ID);
  localStorage.removeItem(KEY_REFRESH);
  localStorage.removeItem(KEY_USER_EMAIL);
}

export function decodeJwtPayload(token) {
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    const padded = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(padded);
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch {
    return null;
  }
}
