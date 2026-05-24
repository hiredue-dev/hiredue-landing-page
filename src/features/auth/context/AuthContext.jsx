"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import {
  confirmResetPassword as svcConfirmResetPassword,
  confirmSignUp as svcConfirmSignUp,
  forgotPassword as svcForgotPassword,
  resendConfirmationCode as svcResendCode,
  signIn as svcSignIn,
  signOut as svcSignOut,
  signUp as svcSignUp,
} from "../services/authService.js";
import {
  decodeJwtPayload,
  getAccessToken,
  getIdToken,
  getUserEmail,
  setUserEmail,
} from "../services/tokenStore.js";
import { createUserInCloud } from "../services/userService.js";
import { getSubscription } from "@/features/subscription/services/subscriptionService.js";

const AuthContext = createContext(null);

function deriveUserFromIdToken() {
  const idToken = getIdToken();
  if (!idToken) return null;
  const payload = decodeJwtPayload(idToken);
  if (!payload) return null;
  return {
    id: payload.sub,
    email: payload.email || getUserEmail(),
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [subscription, setSubscription] = useState(null);

  const loadSubscription = useCallback(async () => {
    const response = await getSubscription();
    if (response.success) {
      setSubscription(response.data ?? null);
      return response.data ?? null;
    }
    setSubscription(null);
    return null;
  }, []);

  const hydrate = useCallback(async () => {
    const token = getAccessToken();
    if (!token) {
      setUser(null);
      setIsAuthenticated(false);
      setSubscription(null);
      setIsLoading(false);
      return;
    }
    const derived = deriveUserFromIdToken();
    setUser(derived);
    setIsAuthenticated(true);
    try {
      await loadSubscription();
    } finally {
      setIsLoading(false);
    }
  }, [loadSubscription]);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    const handler = () => {
      setUser(null);
      setIsAuthenticated(false);
      setSubscription(null);
    };
    window.addEventListener("auth:loggedOut", handler);
    return () => window.removeEventListener("auth:loggedOut", handler);
  }, []);

  const login = useCallback(
    async ({ email, password }) => {
      const result = await svcSignIn(email, password);
      if (!result.success) {
        throw new Error(result.error || "Sign in failed");
      }
      setUserEmail(email);
      const derived = deriveUserFromIdToken();
      setUser(derived);
      setIsAuthenticated(true);
      await loadSubscription();
      return derived;
    },
    [loadSubscription],
  );

  const completeSignup = useCallback(
    async ({ id, email, fullName, phoneNumber, password }) => {
      const signinResult = await svcSignIn(email, password);
      if (!signinResult.success) {
        throw new Error(signinResult.error || "Failed to sign in after signup");
      }
      const userResp = await createUserInCloud({ id, email, fullName, phoneNumber });
      if (!userResp.success) {
        throw new Error(userResp.error || "Failed to create user record");
      }
      setUserEmail(email);
      const derived = deriveUserFromIdToken();
      setUser(derived);
      setIsAuthenticated(true);
      await loadSubscription();
      return derived;
    },
    [loadSubscription],
  );

  const logout = useCallback(async () => {
    svcSignOut();
    setUser(null);
    setIsAuthenticated(false);
    setSubscription(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      isLoading,
      subscription,
      hasActiveSubscription: !!subscription?.hasActiveSubscription,
      login,
      logout,
      completeSignup,
      refreshSubscription: loadSubscription,
      signUp: svcSignUp,
      confirmSignUp: svcConfirmSignUp,
      resendConfirmationCode: svcResendCode,
      forgotPassword: svcForgotPassword,
      confirmResetPassword: svcConfirmResetPassword,
    }),
    [
      user,
      isAuthenticated,
      isLoading,
      subscription,
      login,
      logout,
      completeSignup,
      loadSubscription,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
