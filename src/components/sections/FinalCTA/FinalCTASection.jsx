'use client';

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Button from "@/components/ui/Button/Button.jsx";
import Section from "@/components/ui/Section/Section.jsx";
import { useWaitlist } from "@/app/providers/waitlist-context.js";
import styles from "./FinalCTASection.module.css";

const FinalCTASection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const { openWaitlist } = useWaitlist();

  return (
    <Section ref={ref}>
      <motion.div
        className={styles.panel}
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <div className={styles.overlay} />
        <h2 className={styles.heading}>Let HireDue handle the grind</h2>
        <p className={styles.text}>Start automating your job search today.</p>
        <Button size="lg" variant="ghost" className={styles.button} onClick={openWaitlist}>
          Join Waitlist
        </Button>
      </motion.div>
    </Section>
  );
};

export default FinalCTASection;
