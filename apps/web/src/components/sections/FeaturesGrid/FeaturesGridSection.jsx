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
    <svg className={styles.integrationSvg} viewBox="0 0 320 180" aria-hidden="true">
      <path d="M44 34C44 68 104 82 160 112" />
      <path d="M108 34C108 76 142 86 160 112" />
      <path d="M212 34C212 76 178 86 160 112" />
      <path d="M276 34C276 68 216 82 160 112" />
      <path d="M160 118V148" />
    </svg>
    <div className={styles.centerNode}>Connect</div>
    <div className={styles.glassStrip}>Making lists of matching jobs in real time</div>
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

const CollaborationVisual = () => (
  <div className={styles.visualShell}>
    <div className={styles.outreachScene}>
      <div className={styles.outreachTitle}>Recruiter Outreach</div>
      <div className={styles.outreachCanvas}>
        <div className={styles.outreachStack}>
          <span className={styles.stackSheetA} aria-hidden="true" />
          <span className={styles.stackSheetB} aria-hidden="true" />
          <span className={styles.stackSheetC} aria-hidden="true" />

          <div className={styles.outreachMainCard}>
            <div className={styles.messageBlock}>
              <div className={styles.messageHead}>Hello [Recruiter Name],</div>
              <div className={styles.messageMeta}>
                <span />
                <span />
              </div>
              <span className={styles.messageEdit}>✎</span>
            </div>

            <div className={styles.messageArrow}>↓</div>

            <div className={styles.replyBlock}>Re: Application for [Role at Company]</div>

            <div className={styles.messageArrow}>↓</div>

            <div className={styles.messageBlock}>
              <div className={styles.messageHead}>[Customized message logic...]</div>
              <button type="button" className={styles.outreachBtn}>
                Launch Personalized Outreach Campaign
              </button>
            </div>
          </div>
        </div>

        <svg className={styles.outreachConnectors} viewBox="0 0 220 180" aria-hidden="true">
          <path d="M8 90C54 92 62 42 124 36" />
          <path d="M8 90C52 90 62 76 124 76" />
          <path d="M8 90C52 90 62 114 124 114" />
          <path d="M8 90C56 90 66 152 124 150" />
        </svg>

        <div className={styles.pipelineCards}>
          <div className={`${styles.profileCard} ${styles.profileCardTop}`.trim()}>
            <span className={styles.profileAvatar} />
            <span className={styles.profileBadge}>in</span>
            <span className={styles.profileLine} />
            <span className={styles.profileLineShort} />
            <div className={styles.profileMetaRow}>
              <span />
              <span />
            </div>
          </div>
          <div className={`${styles.profileCard} ${styles.profileCardMidLeft}`.trim()}>
            <span className={styles.profileAvatar} />
            <span className={styles.profileLine} />
            <span className={styles.profileLineShort} />
            <div className={styles.profileMetaRow}>
              <span />
              <span />
            </div>
          </div>
          <div className={`${styles.profileCard} ${styles.profileCardMidRight}`.trim()}>
            <span className={styles.profileAvatar} />
            <span className={styles.profileBadge}>in</span>
            <span className={styles.profileLine} />
            <span className={styles.profileLineShort} />
            <div className={styles.profileMetaRow}>
              <span />
              <span />
            </div>
          </div>
          <div className={`${styles.profileCard} ${styles.profileCardBottom}`.trim()}>
            <span className={styles.profileAvatar} />
            <span className={styles.profileLine} />
            <span className={styles.profileLineShort} />
            <div className={styles.profileMetaRow}>
              <span />
              <span />
            </div>
          </div>
        </div>
        <div className={styles.pipelineLabel}>Pipeline of Connections</div>
      </div>
    </div>
  </div>
);

const AutomationVisual = () => (
  <div className={styles.visualShell}>
    <div className={styles.ruleScene}>
      <div className={styles.ruleTitle}>Rule Builder</div>

      <div className={styles.ruleTopIcons}>
        <span>📍</span>
        <span>💰</span>
        <span>📶</span>
      </div>

      <svg className={styles.ruleLines} viewBox="0 0 320 180" aria-hidden="true">
        <path d="M20 54H96V92H170V62H300" />
        <path d="M38 126H136V92" />
        <path d="M188 146V92" />
        <circle cx="40" cy="76" r="4.5" />
        <circle cx="66" cy="96" r="4.5" />
        <circle cx="94" cy="116" r="4.5" />
        <circle cx="228" cy="76" r="4.5" />
      </svg>

      <div className={styles.ruleToggles}>
        <span />
        <span />
        <span />
      </div>

      <div className={styles.automationTags}>
        <span>Import</span>
        <button type="button" className={styles.launchBtn}>
          Launch Rule
        </button>
        <span>Track</span>
      </div>
    </div>
  </div>
);

const SecurityVisual = () => (
  <div className={styles.visualShell}>
    <div className={styles.vaultScene}>
      <div className={styles.vaultTitle}>Secure Vault</div>
      <svg className={styles.vaultShield} viewBox="0 0 320 180" aria-hidden="true">
        <path d="M160 22L238 56V106C238 136 212 158 160 174C108 158 82 136 82 106V56L160 22Z" />
      </svg>
      <div className={styles.vaultFolders}>
        <span><i /></span>
        <span><i /></span>
        <span><i /></span>
        <span><i /></span>
      </div>
      <button type="button" className={styles.vaultBtn}>
        Archive &amp; Monitor
      </button>
    </div>
  </div>
);

const visualMap = {
  integration: IntegrationVisual,
  dashboard: DashboardVisual,
  collaboration: CollaborationVisual,
  automation: AutomationVisual,
  security: SecurityVisual,
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
