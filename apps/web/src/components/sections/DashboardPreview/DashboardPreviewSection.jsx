// DEPRECATED: Retained for safe rollback during refactor.
// Active home flow uses DashboardTiltShowcaseSection.
import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Briefcase, CalendarCheck, MessageSquare, Send } from "lucide-react";
import Section from "@/components/ui/Section/Section.jsx";
import SectionHeading from "@/components/ui/SectionHeading/SectionHeading.jsx";
import styles from "./DashboardPreviewSection.module.css";

const stats = [
  { icon: Briefcase, label: "Jobs Identified", value: 847 },
  { icon: Send, label: "Applications Sent", value: 312 },
  { icon: MessageSquare, label: "Recruiter Messages", value: 156 },
  { icon: CalendarCheck, label: "Interview Responses", value: 42 },
];

const CountUp = ({ target, inView }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) {
      return undefined;
    }

    let start = 0;
    const duration = 1500;
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

  return <span>{count.toLocaleString()}</span>;
};

const DashboardPreviewSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <Section ref={ref}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}>
        <SectionHeading title="Track everything in one place" />
      </motion.div>

      <div className={styles.previewWrap}>
        <motion.div
          className={styles.window}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.windowBar}>
            <span className={styles.barDot} />
            <span className={styles.barDot} />
            <span className={styles.barDot} />
          </div>
          <div className={styles.content}>
            <div className={styles.statsGrid}>
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className={styles.statCard}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                >
                  <stat.icon size={20} className={styles.statIcon} strokeWidth={1.5} />
                  <div className={styles.statValue}>
                    <CountUp target={stat.value} inView={inView} />
                  </div>
                  <p className={styles.statLabel}>{stat.label}</p>
                </motion.div>
              ))}
            </div>
            <div className={styles.rows}>
              {[1, 2, 3].map((row) => (
                <div key={row} className={styles.row}>
                  <div className={styles.rowIcon} />
                  <div className={styles.rowText}>
                    <div className={styles.rowLinePrimary} />
                    <div className={styles.rowLineSecondary} />
                  </div>
                  <div className={styles.rowBadge} />
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
};

export default DashboardPreviewSection;
