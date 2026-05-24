"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import Button from "@/components/ui/Button/Button.jsx";
import Input from "@/components/ui/Input/Input.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { friendlyAuthError } from "../errorMessages.js";
import styles from "./AuthForm.module.css";

export default function SigninForm() {
  const { login, hasActiveSubscription } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(form);
      const redirect = searchParams.get("redirect");
      if (redirect) {
        router.replace(redirect);
        return;
      }
      router.replace(hasActiveSubscription ? "/download" : "/pricing");
    } catch (err) {
      setError(friendlyAuthError(err.message, "signin", "Invalid email or password."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.shell}>
      <div className={styles.card}>
        <p className={styles.eyebrow}>Welcome back</p>
        <h1 className={styles.title}>Sign in to HireDue</h1>
        <p className={styles.subtitle}>Pick up where you left off.</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">Email</label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">Password</label>
            <div className={styles.inputWrap}>
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange}
                required
                style={{ paddingRight: 44 }}
              />
              <button
                type="button"
                className={styles.toggleVisibility}
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className={styles.row}>
            <span />
            <Link href="/forgot-password" className={styles.linkButton}>
              Forgot password?
            </Link>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <Button type="submit" size="lg" className={styles.submit} disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <p className={styles.footerText}>
          Don&apos;t have an account?
          <Link href="/signup" className={styles.footerLink}>Sign up</Link>
        </p>
      </div>
    </div>
  );
}
