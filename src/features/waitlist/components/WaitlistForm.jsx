"use client";

import Button from "@/components/ui/Button/Button.jsx";
import Input from "@/components/ui/Input/Input.jsx";
import getFieldError from "@/utils/getFieldError.js";
import styles from "./WaitlistForm.module.css";

const WaitlistForm = ({ form }) => {
  const emailError = getFieldError(form.errors, "email");
  const nameError = getFieldError(form.errors, "name");
  const phoneError = getFieldError(form.errors, "phone");

  return (
    <form className={styles.form} onSubmit={form.handleSubmit}>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="waitlist-email">
          Email
        </label>
        <Input
          id="waitlist-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={form.values.email}
          onChange={form.handleChange}
          aria-invalid={emailError ? true : undefined}
          aria-describedby={emailError ? "waitlist-email-error" : undefined}
        />
        {emailError ? <p id="waitlist-email-error" className={styles.error}>{emailError}</p> : null}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="waitlist-name">
          Full name
        </label>
        <Input
          id="waitlist-name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Your full name"
          value={form.values.name}
          onChange={form.handleChange}
          aria-invalid={nameError ? true : undefined}
          aria-describedby={nameError ? "waitlist-name-error" : undefined}
        />
        {nameError ? <p id="waitlist-name-error" className={styles.error}>{nameError}</p> : null}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="waitlist-phone">
          Contact number
        </label>
        <Input
          id="waitlist-phone"
          name="phone"
          type="tel"
          inputMode="numeric"
          maxLength={10}
          autoComplete="tel-national"
          placeholder="9876543210"
          value={form.values.phone}
          onChange={form.handleChange}
          aria-invalid={phoneError ? true : undefined}
          aria-describedby={phoneError ? "waitlist-phone-error" : undefined}
        />
        {phoneError ? <p id="waitlist-phone-error" className={styles.error}>{phoneError}</p> : null}
      </div>

      <Button type="submit" size="lg" className={styles.submit} disabled={form.status === "submitting"}>
        {form.status === "submitting" ? "Joining..." : "Join Waitlist"}
      </Button>

      {form.message ? (
        <p
          role={form.status === "success" ? "status" : "alert"}
          className={form.status === "success" ? styles.success : styles.errorMessage}
        >
          {form.message}
        </p>
      ) : null}
    </form>
  );
};

export default WaitlistForm;
