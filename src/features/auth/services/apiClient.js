import { getAccessToken, clearTokens } from "./tokenStore.js";
import { refreshTokens } from "./authService.js";

export const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || "";

function buildUrl(path) {
  if (/^https?:\/\//.test(path)) return path;
  const base = BACKEND_API_URL.replace(/\/$/, "");
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return base + suffix;
}

function notifyLoggedOut() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("auth:loggedOut"));
  }
}

async function doFetch(path, options, withAuth) {
  const url = buildUrl(path);
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (withAuth) {
    const token = getAccessToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, { ...options, headers });
  let body = {};
  try {
    body = await response.json();
  } catch {
    body = {};
  }

  return {
    status: response.status,
    ok: response.ok,
    success: body.success ?? response.ok,
    data: body.data ?? null,
    error: body.error ?? null,
    message: body.message ?? "",
  };
}

async function request(path, options = {}, { withAuth = true } = {}) {
  let result = await doFetch(path, options, withAuth);

  if (result.status === 401 && withAuth) {
    const refresh = await refreshTokens();
    if (refresh.success) {
      result = await doFetch(path, options, withAuth);
    } else {
      clearTokens();
      notifyLoggedOut();
    }
  }

  return result;
}

export const apiClient = {
  get(path, opts) {
    return request(path, { method: "GET" }, opts);
  },
  post(path, body, opts) {
    return request(
      path,
      { method: "POST", body: JSON.stringify(body ?? {}) },
      opts,
    );
  },
  patch(path, body, opts) {
    return request(
      path,
      { method: "PATCH", body: JSON.stringify(body ?? {}) },
      opts,
    );
  },
  delete(path, opts) {
    return request(path, { method: "DELETE" }, opts);
  },
};
