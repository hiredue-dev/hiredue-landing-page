"use client";

import { useState } from "react";
import { onboardingCallSchema, formatZodErrors } from "@/lib/shared.js";
import onboardingCallService from "../services/onboardingCallService.js";

const initialState = {
  name: "",
  phone: "",
  email: "",
  preferredDate: "",
};

const useOnboardingCallForm = () => {
  const [values, setValues] = useState(initialState);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: [] }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const parsed = onboardingCallSchema.safeParse(values);
    if (!parsed.success) {
      setErrors(formatZodErrors(parsed.error));
      setStatus("error");
      setMessage("Please fix the highlighted fields.");
      return;
    }

    try {
      setStatus("submitting");
      setErrors({});
      const response = await onboardingCallService.submit(parsed.data);
      setStatus("success");
      setValues(initialState);
      setMessage(response.message);
    } catch (error) {
      setStatus("error");
      setErrors({});
      setMessage(error.message || "Could not submit your request right now. Please try again.");
    }
  };

  return {
    values,
    status,
    message,
    errors,
    handleChange,
    handleSubmit,
  };
};

export default useOnboardingCallForm;
