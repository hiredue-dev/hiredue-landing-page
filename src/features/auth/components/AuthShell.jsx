import { Check, Sparkles } from "lucide-react";
import styles from "./AuthForm.module.css";

const highlights = [
  "Matches roles to your profile",
  "Tailors every application",
  "Reaches the hiring team",
];

export default function AuthShell({ mode, children }) {
  const isSignup = mode === "signup";

  return (
    <section className={styles.authPage}>
      <span className={styles.glowOne} aria-hidden />
      <span className={styles.glowTwo} aria-hidden />

      <div className={styles.authLayout}>
        <aside className={styles.storyPanel}>
          <div className={styles.storyCopy}>
            <span className={styles.storyEyebrow}>
              <Sparkles size={14} strokeWidth={2.2} />
              Your job-search agent
            </span>
            <h2 className={styles.storyTitle}>
              {isSignup
                ? "A better job search starts here."
                : "Your job search keeps moving."}
            </h2>
            <p className={styles.storyBody}>
              HireDue discovers the right roles, personalizes your outreach and
              applies while you focus on the interview.
            </p>
          </div>

          <div className={styles.agentCard}>
            <div className={styles.agentHeader}>
              <span className={styles.agentMark}>
                <Sparkles size={16} strokeWidth={2.2} />
              </span>
              <span>
                <strong>HireDue agent</strong>
                <small>Working in real time</small>
              </span>
              <span className={styles.liveBadge}>
                <i /> Live
              </span>
            </div>

            <div className={styles.agentSteps}>
              {highlights.map((highlight, index) => (
                <div className={styles.agentStep} key={highlight}>
                  <span className={styles.checkMark}>
                    <Check size={13} strokeWidth={2.5} />
                  </span>
                  <span>{highlight}</span>
                  <i style={{ animationDelay: `${index * 0.35}s` }} />
                </div>
              ))}
            </div>
          </div>

          <div className={styles.storyStats}>
            <span>
              <strong>50,000+</strong>
              <small>career pages scanned</small>
            </span>
            <span>
              <strong>24/7</strong>
              <small>always-on assistance</small>
            </span>
          </div>
        </aside>

        <div className={styles.formColumn}>{children}</div>
      </div>
    </section>
  );
}
