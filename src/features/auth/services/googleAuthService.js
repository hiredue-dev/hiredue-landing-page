import {
  setTokens,
  setUserEmail,
  getRefreshToken,
  decodeJwtPayload,
} from "./tokenStore.js";

const COGNITO_CLIENT_ID = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID;
const COGNITO_REGION = process.env.NEXT_PUBLIC_COGNITO_REGION;
const COGNITO_DOMAIN = process.env.NEXT_PUBLIC_COGNITO_DOMAIN;
const COGNITO_OAUTH_REDIRECT_URI =
  process.env.NEXT_PUBLIC_COGNITO_OAUTH_REDIRECT_URI
  || process.env.NEXT_PUBLIC_COGNITO_OAUTH_REDIRECT_ENDPOINT;

const AUTH_METHOD_KEY = "hd_auth_method";

function getRedirectUri() {
  return COGNITO_OAUTH_REDIRECT_URI;
}

function base64urlEncode(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function generatePkcePair() {
  const verifierBytes = new Uint8Array(64);
  crypto.getRandomValues(verifierBytes);
  const verifier = base64urlEncode(verifierBytes);

  const encoder = new TextEncoder();
  const hashBytes = await crypto.subtle.digest("SHA-256", encoder.encode(verifier));
  const challenge = base64urlEncode(hashBytes);

  return { verifier, challenge };
}

export function startGoogleSignIn(redirectAfterAuth) {
  const state = crypto.randomUUID();

  if (redirectAfterAuth) {
    sessionStorage.setItem("hd_google_redirect", redirectAfterAuth);
  }

  generatePkcePair().then(({ verifier, challenge }) => {
    sessionStorage.setItem("hd_google_verifier", verifier);
    sessionStorage.setItem("hd_google_state", state);

    const params = new URLSearchParams({
      response_type: "code",
      client_id: COGNITO_CLIENT_ID,
      redirect_uri: getRedirectUri(),
      scope: "openid email profile aws.cognito.signin.user.admin",
      identity_provider: "Google",
      state,
      code_challenge: challenge,
      code_challenge_method: "S256",
      prompt: "select_account",
    });

    const authorizeUrl = `https://${COGNITO_DOMAIN}.auth.${COGNITO_REGION}.amazoncognito.com/oauth2/authorize?${params.toString()}`;
    window.location.assign(authorizeUrl);
  });
}

export function getGoogleRedirectAfterAuth() {
  if (typeof window === "undefined") return null;
  const redirect = sessionStorage.getItem("hd_google_redirect");
  sessionStorage.removeItem("hd_google_redirect");
  return redirect;
}

/**
 * Exchange the OAuth code for Cognito tokens. Does NOT persist them — the
 * caller must inspect auth-status before committing via commitGoogleTokens().
 */
export async function exchangeGoogleCode() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  const state = params.get("state");

  if (!code) {
    throw new Error("Missing authorization code from Cognito callback.");
  }

  const savedState = sessionStorage.getItem("hd_google_state");
  if (!savedState || state !== savedState) {
    throw new Error("State mismatch — possible CSRF or stale redirect.");
  }

  const verifier = sessionStorage.getItem("hd_google_verifier");
  if (!verifier) {
    throw new Error("Missing PKCE verifier — session may have expired.");
  }

  sessionStorage.removeItem("hd_google_state");
  sessionStorage.removeItem("hd_google_verifier");

  const tokenUrl = `https://${COGNITO_DOMAIN}.auth.${COGNITO_REGION}.amazoncognito.com/oauth2/token`;

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: COGNITO_CLIENT_ID,
    code,
    code_verifier: verifier,
    redirect_uri: getRedirectUri(),
  });

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Unknown error");
    throw new Error(`Token exchange failed: ${errorText}`);
  }

  const raw = await response.json();

  const claims = decodeJwtPayload(raw.id_token);
  if (!claims) {checkAuthStatus
    throw new Error("Failed to decode id_token from token exchange.");
  }

  return {
    tokens: {
      accessToken: raw.access_token,
      idToken: raw.id_token,
      refreshToken: raw.refresh_token,
    },
    claims,
  };
}

/**
 * Persist tokens and mark auth method as Google. Call ONLY after auth-status
 * confirms the user should proceed.
 */
export function commitGoogleTokens({ accessToken, idToken, refreshToken }) {
  setTokens({ accessToken, idToken, refreshToken });
  localStorage.setItem(AUTH_METHOD_KEY, "google");

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("auth:stateChanged"));
  }
}

/**
 * Remove any partially-stored tokens for a Google sign-in that should not
 * proceed (e.g. email_taken, network error during auth-status check).
 */
export function discardGoogleTokens() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_METHOD_KEY);
}

/**
 * Legacy wrapper — exchange + commit in one step. Used when the caller does
 * its own auth-status check (or none) and just wants the old behaviour.
 */
export async function completeGoogleSignIn() {
  const { tokens, claims } = await exchangeGoogleCode();
  commitGoogleTokens(tokens);
  setUserEmail(claims.email);
  return { tokens, claims };
}

export async function refreshHostedUiTokens() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    return { success: false, data: null, error: "Missing refresh token" };
  }

  try {
    const tokenUrl = `https://${COGNITO_DOMAIN}.auth.${COGNITO_REGION}.amazoncognito.com/oauth2/token`;

    const body = new URLSearchParams({
      grant_type: "refresh_token",
      client_id: COGNITO_CLIENT_ID,
      refresh_token: refreshToken,
    });

    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });

    if (!response.ok) {
      return { success: false, data: null, error: "Hosted UI refresh failed" };
    }

    const tokens = await response.json();

    setTokens({
      accessToken: tokens.access_token,
      idToken: tokens.id_token,
    });

    return {
      success: true,
      data: {
        accessToken: tokens.access_token,
        idToken: tokens.id_token,
      },
      error: null,
    };
  } catch (err) {
    return { success: false, data: null, error: err.message || "Hosted UI refresh failed" };
  }
}

export function getAuthMethod() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_METHOD_KEY);
}
