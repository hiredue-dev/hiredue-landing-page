'use client';

import { useState } from "react";
import { waitlistSchema, formatZodErrors } from "@/lib/shared.js";
import waitlistService from "../services/waitlistService.js";

const createInitialState = (prefillEmail = "") => ({
  email: prefillEmail,
  name: "",
  phone: "",
});

const useWaitlistForm = ({ source = "waitlist", prefillEmail = "" } = {}) => {
  const [values, setValues] = useState(createInitialState(prefillEmail));
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: [] }));
  };

  const prefill = (nextEmail = "") => {
    setValues((current) => ({
      ...current,
      email: nextEmail,
    }));
    setErrors((current) => ({ ...current, email: [] }));
  };

  const reset = () => {
    setValues(createInitialState(""));
    setStatus("idle");
    setMessage("");
    setErrors({});
  };

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
      setValues(createInitialState(""));
    } catch (error) {
      setStatus("error");
      setErrors(error.errors || {});
      setMessage(error.message || "Could not join waitlist right now. Please try again.");
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
