import { useState } from "react";
import { contactSchema, formatZodErrors } from "@hiredue/shared";
import contactService from "../services/contactService.js";

const initialState = {
  name: "",
  email: "",
  message: "",
};

const useContactForm = () => {
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

    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      setErrors(formatZodErrors(parsed.error));
      setStatus("error");
      setMessage("Please fix the highlighted fields.");
      return;
    }

    try {
      setStatus("submitting");
      setErrors({});
      const response = await contactService.submit({
        ...parsed.data,
        source: "contact_page",
        submittedAt: new Date().toISOString(),
      });
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

export default useContactForm;
