import {
  SignUpCommand,
  ConfirmSignUpCommand,
  ResendConfirmationCodeCommand,
  InitiateAuthCommand,
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand,
} from "@aws-sdk/client-cognito-identity-provider";

import { getCognitoClient, COGNITO_CLIENT_ID } from "./cognitoClient.js";
import { setTokens, getRefreshToken, clearTokens, setUserEmail } from "./tokenStore.js";
import { refreshHostedUiTokens } from "./googleAuthService.js";

function ok(data) {
  return { success: true, data, error: null };
}

function fail(err, fallback) {
  const code = err?.name || err?.__type;
  const message = code || err?.message || fallback;
  return { success: false, data: null, error: message };
}

export async function signUp(email, password) {
  try {
    const client = getCognitoClient();
    const response = await client.send(
      new SignUpCommand({
        ClientId: COGNITO_CLIENT_ID,
        Username: email,
        Password: password,
        UserAttributes: [{ Name: "email", Value: email }],
      }),
    );
    return ok({ userSub: response.UserSub });
  } catch (err) {
    return fail(err, "Sign up failed");
  }
}

export async function confirmSignUp(email, code) {
  try {
    const client = getCognitoClient();
    await client.send(
      new ConfirmSignUpCommand({
        ClientId: COGNITO_CLIENT_ID,
        Username: email,
        ConfirmationCode: code,
      }),
    );
    return ok({});
  } catch (err) {
    return fail(err, "Confirm signup failed");
  }
}

export async function resendConfirmationCode(email) {
  try {
    const client = getCognitoClient();
    const response = await client.send(
      new ResendConfirmationCodeCommand({
        ClientId: COGNITO_CLIENT_ID,
        Username: email,
      }),
    );
    return ok(response);
  } catch (err) {
    return fail(err, "Resend code failed");
  }
}

export async function signIn(email, password) {
  try {
    const client = getCognitoClient();
    const response = await client.send(
      new InitiateAuthCommand({
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: COGNITO_CLIENT_ID,
        AuthParameters: {
          USERNAME: email,
          PASSWORD: password,
        },
      }),
    );

    if (!response.AuthenticationResult) {
      return fail({ message: "Authentication failed" }, "Authentication failed");
    }

    const tokens = response.AuthenticationResult;
    setTokens({
      accessToken: tokens.AccessToken,
      idToken: tokens.IdToken,
      refreshToken: tokens.RefreshToken,
    });
    setUserEmail(email);

    return ok({
      accessToken: tokens.AccessToken,
      idToken: tokens.IdToken,
      refreshToken: tokens.RefreshToken,
      expiresIn: tokens.ExpiresIn,
    });
  } catch (err) {
    return fail(err, "Sign in failed");
  }
}

export async function forgotPassword(email) {
  try {
    const client = getCognitoClient();
    const response = await client.send(
      new ForgotPasswordCommand({
        ClientId: COGNITO_CLIENT_ID,
        Username: email,
      }),
    );
    return ok(response);
  } catch (err) {
    return fail(err, "Forgot password failed");
  }
}

export async function confirmResetPassword(email, code, newPassword) {
  try {
    const client = getCognitoClient();
    const response = await client.send(
      new ConfirmForgotPasswordCommand({
        ClientId: COGNITO_CLIENT_ID,
        Username: email,
        ConfirmationCode: code,
        Password: newPassword,
      }),
    );
    return ok(response);
  } catch (err) {
    return fail(err, "Reset password failed");
  }
}

export async function refreshTokens() {
  const authMethod = localStorage.getItem("hd_auth_method");

  if (authMethod === "google") {
    return refreshHostedUiTokens();
  }

  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      return fail({ message: "Missing refresh token" }, "Missing refresh token");
    }

    const client = getCognitoClient();
    const response = await client.send(
      new InitiateAuthCommand({
        AuthFlow: "REFRESH_TOKEN_AUTH",
        ClientId: COGNITO_CLIENT_ID,
        AuthParameters: { REFRESH_TOKEN: refreshToken },
      }),
    );

    if (!response.AuthenticationResult) {
      return fail({ message: "Refresh failed" }, "Refresh failed");
    }

    const tokens = response.AuthenticationResult;
    setTokens({
      accessToken: tokens.AccessToken,
      idToken: tokens.IdToken,
    });

    return ok({
      accessToken: tokens.AccessToken,
      idToken: tokens.IdToken,
    });
  } catch (err) {
    return fail(err, "Refresh failed");
  }
}

async function refreshHostedUiTokens() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    return fail({ message: "Missing refresh token" }, "Missing refresh token");
  }

  try {
    const domain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN;
    const region = process.env.NEXT_PUBLIC_COGNITO_REGION;
    const tokenUrl = `https://${domain}.auth.${region}.amazoncognito.com/oauth2/token`;

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
      return fail({ message: "Hosted UI refresh failed" }, "Hosted UI refresh failed");
    }

    const tokens = await response.json();

    setTokens({
      accessToken: tokens.access_token,
      idToken: tokens.id_token,
    });

    return ok({
      accessToken: tokens.access_token,
      idToken: tokens.id_token,
    });
  } catch (err) {
    return fail(err, "Hosted UI refresh failed");
  }
}

export function signOut() {
  clearTokens();
  return ok({});
}
