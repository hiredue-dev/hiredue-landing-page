'use client';

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import Section from "@/components/ui/Section/Section.jsx";
import { useWaitlist } from "@/app/providers/waitlist-context.js";
import styles from "./FinalCTASection.module.css";

const FinalCTASection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const { openWaitlist } = useWaitlist();
  const [email, setEmail] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    openWaitlist({ prefillEmail: email });
  };

  return (
    <Section ref={ref} className={styles.section}>
      <motion.div
        className={styles.block}
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <span className={styles.eyebrow}>Join the beta</span>
        <h2 className={styles.heading}>
          Stop applying.
          <br />
          Start interviewing.
        </h2>
        <p className={styles.lede}>
          Early access is open for the first beta cohort. We onboard new users every Friday.
        </p>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <input
            type="email"
            className={styles.input}
            placeholder="you@work.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-label="Work email"
          />
          <button type="submit" className={styles.submit}>
            Get early access
          </button>
        </form>

        <div className={styles.micro}>
          300+ users already onboarded · cohort #4 closes Friday
        </div>
      </motion.div>
    </Section>
  );
};

export default FinalCTASection;
