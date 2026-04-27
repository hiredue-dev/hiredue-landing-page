// DEPRECATED: Retained for safe rollback during refactor.
// This section is intentionally not part of strict home v1 rendering.
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { FileCheck, LayoutDashboard, MessageSquare, Search, Send } from "lucide-react";
import Section from "@/components/ui/Section/Section.jsx";
import styles from "./AutomationEngineSection.module.css";

const pipeline = [
  { icon: Search, label: "Jobs Discovered" },
  { icon: FileCheck, label: "Resume Optimized" },
  { icon: Send, label: "Application Submitted" },
  { icon: MessageSquare, label: "Recruiter Outreach" },
  { icon: LayoutDashboard, label: "Dashboard Tracking" },
];

const AutomationEngineSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <Section tone="default" ref={ref} className={styles.section}>
      <div className={styles.shell}>
        <div className={styles.grid}>
          <motion.div
            className={styles.copy}
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className={styles.eyebrow}>Automation Pipeline</p>
            <h3 className={styles.title}>Streamlined Job Hunt</h3>
            <p className={styles.description}>
              HireDue&apos;s automation pipeline works around the clock, discovering jobs, tailoring your resume,
              submitting applications, and reaching out to recruiters while you focus on interviews.
            </p>
          </motion.div>

          <div className={styles.pipeline}>
            <svg className={styles.connectorSvg} viewBox="0 0 44 100" preserveAspectRatio="none" aria-hidden="true">
              <circle cx="6" cy="50" r="1.6" className={styles.connectorHubDot} />
              <path d="M6 50 C16 50 24 18 38 18" className={styles.connectorPath} />
              <path d="M6 50 C16 50 24 39 38 39" className={styles.connectorPath} />
              <path d="M6 50 C16 50 24 50 38 50" className={styles.connectorPathMid} />
              <path d="M6 50 C16 50 24 61 38 61" className={styles.connectorPath} />
              <path d="M6 50 C16 50 24 82 38 82" className={styles.connectorPath} />
            </svg>
            {pipeline.map((step, index) => (
              <motion.div
                key={step.label}
                className={styles.stepRow}
                initial={{ opacity: 0, x: 24, y: 8 }}
                animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
                transition={{ duration: 0.42, delay: 0.22 + index * 0.12, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.div
                  className={styles.stepCard}
                  whileHover={{ x: 4, scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className={styles.stepIconWrap}>
                    <step.icon size={17} className={styles.stepIcon} strokeWidth={1.7} />
                  </span>
                  <span className={styles.stepLabel}>{step.label}</span>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
};

export default AutomationEngineSection;
