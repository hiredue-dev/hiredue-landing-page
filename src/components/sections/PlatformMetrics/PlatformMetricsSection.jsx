'use client';

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Section from "@/components/ui/Section/Section.jsx";
import { platformMetricsContent } from "@/content/home/platformMetricsContent.js";
import styles from "./PlatformMetricsSection.module.css";

const CountUp = ({ target, inView, duration = 1600 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return undefined;
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.floor(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration]);

  return <>{count.toLocaleString()}</>;
};

const PlatformMetricsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <Section ref={ref} className={styles.section}>
      <motion.div
        className={styles.head}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        <span className={styles.eyebrow}>{platformMetricsContent.eyebrow}</span>
        <h2 className={styles.title}>{platformMetricsContent.heading}</h2>
      </motion.div>

      <motion.div
        className={styles.grid}
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        {platformMetricsContent.metrics.map((metric) => (
          <div key={metric.label} className={styles.cell}>
            <div className={styles.num}>
              <CountUp target={metric.value} inView={inView} />
              <span className={styles.suffix}>{metric.suffix}</span>
            </div>
            <div className={styles.label}>{metric.label}</div>
          </div>
        ))}
      </motion.div>
    </Section>
  );
};

export default PlatformMetricsSection;
