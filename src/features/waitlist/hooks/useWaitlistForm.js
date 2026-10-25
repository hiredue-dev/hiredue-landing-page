"use client";

import { useCallback, useEffect, useState } from "react";
import { detectDefaultCountry } from "@/features/auth/countries.js";
import { waitlistSchema, formatZodErrors } from "@/lib/shared.js";
import waitlistService from "../services/waitlistService.js";

const createInitialState = (prefillEmail = "") => ({
  email: prefillEmail,
  name: "",
  countryCode: "IN",
  phone: "",
});

const useWaitlistForm = ({ source = "waitlist", prefillEmail = "" } = {}) => {
  const [values, setValues] = useState(createInitialState(prefillEmail));
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  // The visitor's country from the browser locale; client-only, so after mount.
  useEffect(() => {
    setValues((current) => ({ ...current, countryCode: detectDefaultCountry() }));
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: [] }));
  };

  const prefill = useCallback((nextEmail = "") => {
    setValues((current) => ({
      ...current,
      email: nextEmail,
    }));
    setErrors((current) => ({ ...current, email: [] }));
  }, []);

  const reset = useCallback(() => {
    setValues((current) => ({ ...createInitialState(""), countryCode: current.countryCode }));
    setStatus("idle");
    setMessage("");
    setErrors({});
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const parsed = waitlistSchema.safeParse(values);
    if (!parsed.success) {
      setErrors(formatZodErrors(parsed.error));
      setStatus("error");
      setMessage("Please check the highlighted fields.");
      return;
    }

    try {
      setStatus("submitting");
      setErrors({});

      await waitlistService.submit({
        ...parsed.data,
        source,
        submittedAt: new Date().toISOString(),
      });

      setStatus("success");
      setMessage("You’re on the waitlist.");
      setValues((current) => ({ ...createInitialState(""), countryCode: current.countryCode }));
    } catch (error) {
      setStatus("error");
      setErrors(error.errors || {});
      setMessage(
        error.message || "Could not join waitlist right now. Please try again.",
      );
    }
  };

  return {
    values,
    status,
    message,
    errors,
    handleChange,
    handleSubmit,
    prefill,
    reset,
  };
};

export default useWaitlistForm;
