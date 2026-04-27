'use client';

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Section from "@/components/ui/Section/Section.jsx";
import SectionHeading from "@/components/ui/SectionHeading/SectionHeading.jsx";
import { platformMetricsContent } from "@/content/home/platformMetricsContent.js";
import styles from "./PlatformMetricsSection.module.css";

const CountUp = ({ target, inView }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) {
      return undefined;
    }

    let start = 0;
    const duration = 2000;
    const step = target / (duration / 16);
    const interval = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(interval);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(interval);
  }, [inView, target]);

  return <>{count.toLocaleString()}</>;
};

const PlatformMetricsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <Section tone="muted" ref={ref}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}>
        <SectionHeading title={platformMetricsContent.heading} />
      </motion.div>

      <div className={styles.grid}>
        {platformMetricsContent.metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            className={styles.item}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <div className={styles.value}>
              <CountUp target={metric.value} inView={inView} />
              {metric.suffix}
            </div>
            <p className={styles.label}>{metric.label}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
};

export default PlatformMetricsSection;
