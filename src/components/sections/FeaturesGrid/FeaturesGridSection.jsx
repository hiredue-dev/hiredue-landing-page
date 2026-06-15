"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Section from "@/components/ui/Section/Section.jsx";
import SectionHeading from "@/components/ui/SectionHeading/SectionHeading.jsx";
import { featuresGridContent } from "@/content/home/featuresGridContent.js";
import styles from "./FeaturesGridSection.module.css";

const IntegrationVisual = () => (
  <div className={styles.visualShell}>
    <div className={styles.integrationPills}>
      {["LinkedIn", "Naukri", "Indeed", "Greenhouse"].map((item) => (
        <span key={item} className={styles.pill}>
          {item}
        </span>
      ))}
    </div>
    <svg
      className={styles.integrationSvg}
      viewBox="0 0 320 180"
      aria-hidden="true"
    >
      <path d="M44 34C44 68 104 82 160 112" />
      <path d="M108 34C108 76 142 86 160 112" />
      <path d="M212 34C212 76 178 86 160 112" />
      <path d="M276 34C276 68 216 82 160 112" />
      <path d="M160 118V148" />
    </svg>
    <div className={styles.centerNode}>Connect</div>
    <div className={styles.glassStrip}>
      Making lists of matching jobs in real time
    </div>
  </div>
);

const DashboardVisual = () => (
  <div className={styles.visualShell}>
    <div className={styles.resumeScene}>
      <div className={styles.codePaneLeft}>
        <span>&lt;/&gt;</span>
        <span>&lt;/&gt;</span>
        <span>parseResume()</span>
        <span>{"{}"}</span>
        <span>&lt;/&gt;</span>
      </div>
      <div className={styles.codePaneRight}>
        <span>[]</span>
        <span className={styles.matchScorePill}>matchScore: 85</span>
        <span>{"{}"}</span>
        <span>[]</span>
        <span className={styles.matchScorePill}>matchScore: 85</span>
      </div>

      <div className={styles.resumeDocument}>
        <div className={styles.resumeDocHeader}>
          <span className={styles.resumeDocAvatar} />
          <div className={styles.resumeDocTitleLines}>
            <span />
            <span />
            <span />
          </div>
        </div>

        <div className={styles.resumeDocDivider} />

        <div className={styles.resumeDocColumns}>
          <div className={styles.resumeDocColumn}>
            <span className={styles.sectionBar} />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span className={styles.sectionBar} />
            <span />
            <span />
          </div>
          <div className={styles.resumeDocColumn}>
            <span className={styles.sectionBar} />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span className={styles.sectionBar} />
            <span />
            <span />
          </div>
        </div>

        <button
          type="button"
          className={`${styles.tailorBtn} ${styles.floatNode} ${styles.resumeAction}`.trim()}
        >
          Tailor Resume
        </button>
      </div>
    </div>
  </div>
);

const cap = (value) => value.charAt(0).toUpperCase() + value.slice(1);

const OutreachVisual = () => (
  <div className={styles.visualShell}>
    <div className={styles.outreachScene}>
      <div className={styles.outreachTo}>
        <span className={styles.outreachToLabel}>Reaching out to</span>
        <div className={styles.recruiterAvatars}>
          <span className={`${styles.recruiterAvatar} ${styles.rAvatarA}`} />
          <span className={`${styles.recruiterAvatar} ${styles.rAvatarB}`} />
          <span className={`${styles.recruiterAvatar} ${styles.rAvatarC}`} />
          <span className={styles.recruiterMore}>+6</span>
        </div>
      </div>

      <div className={styles.outreachMessage}>
        <div className={styles.outreachFrom}>
          <span className={styles.outreachFromAvatar}>SC</span>
          <div className={styles.outreachFromMeta}>
            <span className={styles.outreachFromName}>Sarah Chen</span>
            <span className={styles.outreachFromRole}>Recruiter · Stripe</span>
          </div>
          <span className={styles.aiBadge}>✦ AI</span>
        </div>

        <p className={styles.outreachText}>
          Hi Sarah, I saw you&rsquo;re hiring a{" "}
          <span className={styles.personalToken}>Senior Designer</span>
          <span className={styles.outreachCaret} aria-hidden="true" />
        </p>
        <span className={styles.outreachLine} />
        <span className={styles.outreachLineShort} />
      </div>

      <button type="button" className={styles.outreachSend}>
        <span className={styles.sendIcon} aria-hidden="true">
          ➤
        </span>
        Send personalized intro
      </button>
    </div>
  </div>
);

const autoApplyJobs = [
  {
    logo: "S",
    tone: "green",
    role: "Product Designer",
    company: "Stripe",
    status: "Applied",
    state: "done",
  },
  {
    logo: "F",
    tone: "violet",
    role: "UX Engineer",
    company: "Figma",
    status: "Applying",
    state: "active",
  },
  {
    logo: "A",
    tone: "navy",
    role: "Design Lead",
    company: "Airbnb",
    status: "Queued",
    state: "queued",
  },
];

const AutoApplyVisual = () => (
  <div className={styles.visualShell}>
    <div className={styles.applyScene}>
      <div className={styles.applyHeader}>
        <span className={styles.applyTitle}>Auto-Apply</span>
        <span className={styles.applyToggle} aria-hidden="true">
          <i />
        </span>
      </div>

      <div className={styles.applyQueue}>
        {autoApplyJobs.map((job) => (
          <div key={job.company} className={styles.applyRow}>
            <span
              className={`${styles.applyLogo} ${styles[`applyLogo${cap(job.tone)}`]}`.trim()}
            >
              {job.logo}
            </span>
            <div className={styles.applyInfo}>
              <span className={styles.applyRole}>{job.role}</span>
              <span className={styles.applyCompany}>{job.company}</span>
            </div>
            <span
              className={`${styles.applyStatus} ${styles[`applyStatus${cap(job.state)}`]}`.trim()}
            >
              {job.state === "done" && (
                <span className={styles.applyCheck}>✓</span>
              )}
              {job.state === "active" && (
                <i className={styles.applyPulse} aria-hidden="true" />
              )}
              {job.status}
            </span>
          </div>
        ))}
      </div>

      <div className={styles.applyProgress}>
        <div className={styles.applyBar}>
          <span />
        </div>
        <span className={styles.applyCount}>14 / 20 applied</span>
      </div>
    </div>
  </div>
);

const trackColumns = [
  { label: "Applied", tone: "blue", count: 48, cards: ["M", "N"] },
  { label: "Interview", tone: "amber", count: 12, cards: ["S"] },
  { label: "Offer", tone: "green", count: 3, cards: ["F"] },
];

const TrackingVisual = () => (
  <div className={styles.visualShell}>
    <div className={styles.trackScene}>
      <div className={styles.trackHeader}>
        <span className={styles.trackTitle}>Application Tracker</span>
        <span className={styles.trackFilter}>This week ▾</span>
      </div>

      <div className={styles.trackBoard}>
        {trackColumns.map((column) => (
          <div key={column.label} className={styles.trackColumn}>
            <div className={styles.trackColHead}>
              <span
                className={`${styles.trackDot} ${styles[`trackDot${cap(column.tone)}`]}`.trim()}
              />
              <span className={styles.trackColLabel}>{column.label}</span>
              <span className={styles.trackColCount}>{column.count}</span>
            </div>
            {column.cards.map((initial, cardIndex) => (
              <div
                key={`${column.label}-${cardIndex}`}
                className={styles.trackCard}
              >
                <span className={styles.trackCardAvatar}>{initial}</span>
                <span className={styles.trackCardLine} />
                <span className={styles.trackCardLineShort} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  </div>
);

const visualMap = {
  integration: IntegrationVisual,
  dashboard: DashboardVisual,
  outreach: OutreachVisual,
  autoApply: AutoApplyVisual,
  tracking: TrackingVisual,
};

const FeatureCard = ({ feature, index, inView, large = false }) => {
  const Visual = visualMap[feature.visualKey];

  return (
    <motion.article
      className={`${styles.card} ${large ? styles.cardLarge : ""}`.trim()}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      whileHover={{ y: -5 }}
    >
      <div className={styles.media}>{Visual ? <Visual /> : null}</div>
      <h3 className={styles.title}>{feature.title}</h3>
      <p className={styles.text}>{feature.desc}</p>
    </motion.article>
  );
};

const FeaturesGridSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <Section id="features" ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        <SectionHeading title={featuresGridContent.heading} />
      </motion.div>

      <div className={styles.layout}>
        <div className={styles.topRow}>
          {featuresGridContent.topRow.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              feature={feature}
              index={index}
              inView={inView}
              large
            />
          ))}
        </div>

        <div className={styles.bottomRow}>
          {featuresGridContent.bottomRow.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              feature={feature}
              index={index + featuresGridContent.topRow.length}
              inView={inView}
            />
          ))}
        </div>
      </div>
    </Section>
  );
};

export default FeaturesGridSection;
