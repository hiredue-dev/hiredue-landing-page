'use client';

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import Section from "@/components/ui/Section/Section.jsx";
import { useAuth } from "@/features/auth/context/AuthContext.jsx";
import styles from "./FinalCTASection.module.css";

const FinalCTASection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const { isAuthenticated } = useAuth();

  return (
    <Section ref={ref} className={styles.section}>
      <motion.div
        className={styles.block}
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <span className={styles.eyebrow}>Now live</span>
        <h2 className={styles.heading}>
          Stop applying.
          <br />
          Start interviewing.
        </h2>
        <p className={styles.lede}>
          HireDue is live. Create your account, install the desktop app, and let
          it run your job search end to end.
        </p>

        <div className={styles.ctaButtons}>
          <Link href="/signup" className={styles.ctaPrimary}>
            Get started free
          </Link>
          <Link href="/download" className={styles.ctaSecondary}>
            Download the app
          </Link>
        </div>

        <div className={styles.micro}>
          300+ users already onboarded
        </div>

        {!isAuthenticated && (
          <p className={styles.signinLine}>
            Already have an account?{" "}
            <Link href="/login" className={styles.signinLink}>
              Log in
            </Link>
          </p>
        )}
      </motion.div>
    </Section>
  );
};

export default FinalCTASection;
