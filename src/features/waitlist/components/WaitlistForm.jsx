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
          Work email
        </label>
        <Input
          id="waitlist-email"
          name="email"
          type="email"
          placeholder="you@company.com"
          value={form.values.email}
          onChange={form.handleChange}
        />
        {emailError ? <p className={styles.error}>{emailError}</p> : null}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="waitlist-name">
          Full name
        </label>
        <Input
          id="waitlist-name"
          name="name"
          type="text"
          placeholder="Your full name"
          value={form.values.name}
          onChange={form.handleChange}
        />
        {nameError ? <p className={styles.error}>{nameError}</p> : null}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="waitlist-phone">
          Contact number
        </label>
        <Input
          id="waitlist-phone"
          name="phone"
          type="tel"
          placeholder="+919876543210"
          value={form.values.phone}
          onChange={form.handleChange}
        />
        {phoneError ? <p className={styles.error}>{phoneError}</p> : null}
      </div>

      <Button type="submit" size="lg" className={styles.submit} disabled={form.status === "submitting"}>
        {form.status === "submitting" ? "Joining..." : "Join Waitlist"}
      </Button>

      {form.message ? (
        <p className={form.status === "success" ? styles.success : styles.errorMessage}>{form.message}</p>
      ) : null}
    </form>
  );
};

export default WaitlistForm;
