"use client";

import { useState } from "react";

import Button from "@/components/ui/Button/Button.jsx";
import Input from "@/components/ui/Input/Input.jsx";
import Modal from "@/components/ui/Modal/Modal.jsx";
import { friendlyAuthError } from "../errorMessages.js";
import styles from "./AuthForm.module.css";

export default function OtpModal({
  isOpen,
  email,
  onClose,
  onVerify,
  onResend,
}) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState(null);
  const [resendNotice, setResendNotice] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!otp || otp.length < 4) {
      setError("Please enter the verification code.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await onVerify(otp);
    } catch (err) {
      setError(friendlyAuthError(err.message, "otpVerify", "Verification failed. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setResendNotice(null);
    setError(null);
    try {
      await onResend();
      setResendNotice("A new code has been sent to your email.");
    } catch (err) {
      setError(friendlyAuthError(err.message, "otpResend", "Couldn't resend the code. Please try again."));
    } finally {
      setResending(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Verify your email">
      <form onSubmit={handleSubmit} className={styles.otpBody}>
        <p style={{ fontSize: "0.95rem", color: "var(--color-muted-foreground)" }}>
          Enter the 6-digit code we sent to <strong>{email}</strong>.
        </p>

        <Input
          inputMode="numeric"
          maxLength={6}
          autoFocus
          value={otp}
          onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))}
          className={styles.otpInput}
          placeholder="••••••"
        />

        {error && <div className={styles.error}>{error}</div>}
        {resendNotice && <div className={styles.success}>{resendNotice}</div>}

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.linkButton}
            onClick={handleResend}
            disabled={resending || loading}
          >
            {resending ? "Sending…" : "Resend code"}
          </button>
          <Button type="submit" size="md" disabled={loading || !otp}>
            {loading ? "Verifying…" : "Verify"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
