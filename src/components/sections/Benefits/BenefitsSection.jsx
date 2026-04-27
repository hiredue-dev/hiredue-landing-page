'use client';

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Section from "@/components/ui/Section/Section.jsx";
import SectionHeading from "@/components/ui/SectionHeading/SectionHeading.jsx";
import { Clock, Rocket, TrendingUp } from "lucide-react";
import { benefitsContent } from "@/content/home/benefitsContent.js";
import styles from "./BenefitsSection.module.css";

const iconMap = {
  clock: Clock,
  rocket: Rocket,
  trendingUp: TrendingUp,
};

const BenefitsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <Section id="benefits" tone="muted" ref={ref}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}>
        <SectionHeading title={benefitsContent.heading} />
      </motion.div>

      <div className={styles.grid}>
        {benefitsContent.items.map((benefit, index) => {
          const Icon = iconMap[benefit.icon] || Clock;

          return (
          <motion.div
            key={benefit.title}
            className={styles.card}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: index * 0.12 }}
          >
            <div className={styles.iconWrap}>
              <Icon size={26} className={styles.icon} strokeWidth={1.5} />
            </div>
            <h3 className={styles.title}>{benefit.title}</h3>
            <p className={styles.text}>{benefit.desc}</p>
          </motion.div>
          );
        })}
      </div>
    </Section>
  );
};

export default BenefitsSection;
