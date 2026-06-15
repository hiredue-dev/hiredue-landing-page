"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getSubscription } from "../services/subscriptionService.js";

const POLL_INTERVAL_MS = 5000;
const MAX_POLL_ATTEMPTS = 60;
const MAX_CONSECUTIVE_ERRORS = 3;

export default function useCheckoutPolling({ onActive } = {}) {
  const [polling, setPolling] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState(null);

  const intervalRef = useRef(null);
  const mountedRef = useRef(true);
  const consecutiveErrorsRef = useRef(0);
  const attemptsRef = useRef(0);
  const onActiveRef = useRef(onActive);

  useEffect(() => {
    onActiveRef.current = onActive;
  }, [onActive]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    consecutiveErrorsRef.current = 0;
    attemptsRef.current = 0;
    if (mountedRef.current) setPolling(false);
  }, []);

  const handleConfirmed = useCallback(
    (subscription) => {
      stop();
      onActiveRef.current?.(subscription);
    },
    [stop],
  );

  const checkOnce = useCallback(async () => {
    const response = await getSubscription();
    if (!response.success) {
      throw new Error(response.error || "Failed to verify subscription");
    }
    return response.data;
  }, []);

  const start = useCallback(() => {
    setError(null);
    setPolling(true);
    attemptsRef.current = 0;
    consecutiveErrorsRef.current = 0;

    intervalRef.current = setInterval(async () => {
      if (!mountedRef.current) {
        stop();
        return;
      }
      attemptsRef.current += 1;
      try {
        const subscription = await checkOnce();
        consecutiveErrorsRef.current = 0;
        if (subscription?.hasActiveSubscription) {
          handleConfirmed(subscription);
          return;
        }
      } catch (err) {
        consecutiveErrorsRef.current += 1;
        if (consecutiveErrorsRef.current >= MAX_CONSECUTIVE_ERRORS) {
          stop();
          if (mountedRef.current) {
            setError(
              'Unable to reach the server. Please check your connection, then click "Check payment status".',
            );
          }
          return;
        }
      }
      if (attemptsRef.current >= MAX_POLL_ATTEMPTS) {
        stop();
        if (mountedRef.current) {
          setError(
            'Payment not detected after 5 minutes. If you completed payment, click "Check payment status" below.',
          );
        }
      }
    }, POLL_INTERVAL_MS);
  }, [checkOnce, handleConfirmed, stop]);

  const verifyNow = useCallback(async () => {
    setVerifying(true);
    setError(null);
    try {
      const subscription = await checkOnce();
      if (subscription?.hasActiveSubscription) {
        handleConfirmed(subscription);
      } else {
        setError(
          "No active subscription found yet. Payments can take a moment to process — please try again shortly.",
        );
      }
    } catch {
      setError("Could not verify payment status. Please check your connection and try again.");
    } finally {
      if (mountedRef.current) setVerifying(false);
    }
  }, [checkOnce, handleConfirmed]);

  useEffect(() => {
    const handleWindowFocus = async () => {
      if (!polling || !mountedRef.current) return;
      try {
        const subscription = await checkOnce();
        if (subscription?.hasActiveSubscription) handleConfirmed(subscription);
      } catch {
        // ignore — interval will retry
      }
    };
    window.addEventListener("focus", handleWindowFocus);
    return () => window.removeEventListener("focus", handleWindowFocus);
  }, [polling, checkOnce, handleConfirmed]);

  return {
    polling,
    verifying,
    error,
    setError,
    start,
    stop,
    verifyNow,
  };
}
