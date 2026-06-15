'use client';

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import Section from "@/components/ui/Section/Section.jsx";
import { howItWorksContent } from "@/content/home/howItWorksContent.js";
import styles from "./HowItWorksSection.module.css";

const STEP_INTERVAL_MS = 4500;

function StepVisual({ kind }) {
  if (kind === "signup") {
    return (
      <div className={styles.visualSignup}>
        <div className={styles.visualEyebrow}>Sign up</div>
        <div className={styles.visualField}>you@work.com</div>
        <div className={`${styles.visualField} ${styles.visualFieldPwd}`}>••••••••</div>
        <button type="button" className={styles.visualBtnAccent}>
          Continue <ArrowRight size={14} aria-hidden="true" />
        </button>
        <div className={styles.visualMuted}>or sign in with Google · GitHub</div>
      </div>
    );
  }

  if (kind === "resume") {
    return (
      <div className={styles.visualResumeWrap}>
        <div className={styles.visualDropzone}>
          <div className={styles.visualDropIcon}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <path d="M14 2v6h6" />
            </svg>
          </div>
          <div className={styles.visualDropTitle}>Drop your resume here</div>
          <div className={styles.visualDropSub}>PDF, DOCX up to 5MB</div>
        </div>
        <div className={styles.visualFileRow}>
          <div className={styles.visualFileCheck}>
            <Check size={14} aria-hidden="true" />
          </div>
          <div className={styles.visualFileMeta}>
            <div className={styles.visualFileName}>resume_v4.pdf</div>
            <div className={styles.visualFileSub}>Parsed · 4 roles · 12 skills</div>
          </div>
        </div>
      </div>
    );
  }

  if (kind === "connect") {
    const connections = [
      { name: "LinkedIn", sub: "Profile + messages", connected: true, color: "#0a66c2", letter: "L" },
      { name: "Gmail", sub: "Recruiter replies", connected: true, color: "#ea4335", letter: "G" },
      { name: "Workday", sub: "Direct application sync", connected: false, color: "#0875e1", letter: "W" },
    ];
    return (
      <div className={styles.visualConnectList}>
        {connections.map((c) => (
          <div key={c.name} className={styles.visualConnectRow}>
            <div className={styles.visualConnectLogo} style={{ background: c.color }}>{c.letter}</div>
            <div className={styles.visualConnectMeta}>
              <div className={styles.visualConnectName}>{c.name}</div>
              <div className={styles.visualConnectSub}>{c.sub}</div>
            </div>
            {c.connected ? (
              <span className={styles.visualConnectBadge}>● CONNECTED</span>
            ) : (
              <span className={styles.visualConnectAction}>Connect</span>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (kind === "prefs") {
    const chips = ["Senior SWE", "Product Eng", "Bangalore", "Remote (IN)", "₹35–60L", "Series A–C", "Hybrid OK"];
    return (
      <div className={styles.visualPrefsCard}>
        <div className={styles.visualEyebrow}>Targeting</div>
        <div className={styles.visualChips}>
          {chips.map((c, i) => (
            <span
              key={c}
              className={`${styles.visualChip} ${i < 3 ? styles.visualChipActive : ""}`.trim()}
            >
              {c}
            </span>
          ))}
          <span className={styles.visualChipAdd}>+ add filter</span>
        </div>
        <div className={styles.visualPrefsFoot}>
          <span>Daily application cap</span>
          <span className={styles.visualMono}>25 / day</span>
        </div>
      </div>
    );
  }

  if (kind === "live") {
    const metrics = [
      { l: "Applied", v: "47", c: "accent" },
      { l: "Recruiter replies", v: "12", c: "ok" },
      { l: "Interview invites", v: "4", c: "warn" },
    ];
    return (
      <div className={styles.visualLiveCard}>
        <div className={styles.visualLiveHead}>
          <span className={styles.visualLiveDot} aria-hidden="true" />
          <span className={styles.visualLiveStatus}>Agent live · running</span>
          <span className={styles.visualLiveTime}>02:14 PM</span>
        </div>
        <div className={styles.visualMetrics}>
          {metrics.map((m) => (
            <div key={m.l} className={styles.visualMetricRow}>
              <span
                className={`${styles.visualMetricBadge} ${styles[`metric_${m.c}`]}`}
              >
                {m.v}
              </span>
              <span className={styles.visualMetricLabel}>{m.l}</span>
              <span className={styles.visualMetricMeta}>this week</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}

const HowItWorksSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "-100px" });
  const [active, setActive] = useState(0);
  const steps = howItWorksContent.steps;

  useEffect(() => {
    if (!inView) return undefined;
    const id = setInterval(() => {
      setActive((a) => (a + 1) % steps.length);
    }, STEP_INTERVAL_MS);
    return () => clearInterval(id);
  }, [inView, steps.length]);

  const current = steps[active];

  return (
    <Section id="how-it-works" ref={ref} className={styles.section}>
      <motion.div
        className={styles.head}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.55 }}
      >
        <span className={styles.eyebrow}>{howItWorksContent.eyebrow}</span>
        <h2 className={styles.title}>{howItWorksContent.heading}</h2>
        <p className={styles.lede}>{howItWorksContent.description}</p>
      </motion.div>

      <motion.div
        className={styles.steps}
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.65, delay: 0.1 }}
      >
        <div className={styles.rail} role="tablist" aria-label="Onboarding steps">
          {steps.map((s, i) => {
            const isActive = i === active;
            const isDone = i < active;
            return (
              <button
                type="button"
                key={s.state}
                role="tab"
                aria-selected={isActive}
                className={`${styles.node} ${isActive ? styles.nodeActive : ""} ${isDone ? styles.nodeDone : ""}`.trim()}
                onClick={() => setActive(i)}
              >
                <span className={styles.bullet}>
                  {isDone ? <Check size={16} aria-hidden="true" /> : String(i + 1).padStart(2, "0")}
                </span>
                <span className={styles.nodeLabel}>{s.state}</span>
              </button>
            );
          })}
        </div>

        <div className={styles.panel}>
          <motion.div
            key={`copy-${active}`}
            className={styles.panelCopy}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <span className={styles.eyebrow}>Step {active + 1} of {steps.length}</span>
            <h3 className={styles.stepTitle}>{current.title}</h3>
            <p className={styles.stepDesc}>{current.desc}</p>
            <div className={styles.actions}>
              {active === steps.length - 1 ? (
                <Link href="/signup" className={styles.btnPrimary}>
                  Get started
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              ) : (
                <button
                  type="button"
                  className={styles.btnPrimary}
                  onClick={() => setActive((active + 1) % steps.length)}
                >
                  Continue
                  <ArrowRight size={16} aria-hidden="true" />
                </button>
              )}
              <button
                type="button"
                className={styles.btnGhost}
                onClick={() => setActive((active + 1) % steps.length)}
              >
                Next step
              </button>
            </div>
          </motion.div>

          <div className={styles.panelVisual}>
            <motion.div
              key={`visual-${active}`}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className={styles.panelVisualInner}
            >
              <StepVisual kind={current.visual} />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </Section>
  );
};

export default HowItWorksSection;
