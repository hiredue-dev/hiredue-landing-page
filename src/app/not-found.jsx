"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import styles from "@/views/NotFound/NotFoundPage.module.css";

export default function NotFound() {
  const pathname = usePathname();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", pathname);
  }, [pathname]);

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.code}>404</h1>
        <p className={styles.message}>Oops! Page not found</p>
        <a href="/" className={styles.link}>
          Return to Home
        </a>
      </div>
    </div>
  );
}
