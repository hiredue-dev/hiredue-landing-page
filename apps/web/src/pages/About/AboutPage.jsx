import styles from "./AboutPage.module.css";
import { Linkedin, Rocket, ShieldCheck, Sparkles } from "lucide-react";
import { aboutPageContent } from "@/content/pages/aboutPageContent.js";

const AboutPage = () => (
  <section className={styles.section}>
    <div className={styles.container}>
      <header className={styles.heroCentered}>
        <span className={styles.heroPill}>{aboutPageContent.hero.pill}</span>
        <div className={styles.heroContent}>
          <span className={styles.eyebrow}>{aboutPageContent.hero.eyebrow}</span>
          <h1 className={styles.heading}>{aboutPageContent.hero.heading}</h1>
          <p className={styles.lead}>{aboutPageContent.hero.subheading}</p>
        </div>
      </header>

      <section className={styles.missionVision}>
        <div className={styles.mvBlock}>
          <span className={styles.mvGhost}>Vision</span>
          <span className={styles.mvLabel}>{aboutPageContent.vision.label}</span>
          <p className={styles.mvStatement}>{aboutPageContent.vision.statement}</p>
        </div>

        <span className={styles.mvDivider} aria-hidden="true" />

        <div className={styles.mvBlock}>
          <span className={styles.mvGhost}>Mission</span>
          <span className={styles.mvLabel}>{aboutPageContent.mission.label}</span>
          <p className={styles.mvIntro}>{aboutPageContent.mission.intro}</p>
          <div className={styles.pillarRow}>
            {aboutPageContent.mission.pillars.map((pillar, index) => (
              <div
                key={pillar}
                className={`${styles.pillarCircle} ${index === 2 ? styles.pillarCircleActive : ""}`.trim()}
              >
                <p>{pillar}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.valuesSection}>
        <h2 className={styles.sectionTitle}>Our Values</h2>
        <div className={styles.valuesGrid}>
          {aboutPageContent.values.map((value) => {
            const iconMap = {
              craft: Sparkles,
              privacy: ShieldCheck,
              velocity: Rocket,
            };
            const Icon = iconMap[value.key];
            return (
              <article key={value.title} className={styles.valueCard}>
                <span className={styles.valueIcon}>
                  <Icon size={18} />
                </span>
                <div className={styles.valueCopy}>
                  <h3>{value.title}</h3>
                  <p>{value.description}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className={styles.teamSection}>
        <h2 className={styles.sectionTitle}>Founding Team</h2>
        <div className={styles.teamGrid}>
          {aboutPageContent.foundingTeam.map((member) => (
            <article key={member.name} className={styles.memberCard}>
              <span className={styles.memberAvatar}>
                {member.avatar ? (
                  <img src={member.avatar} alt={member.name} className={styles.memberAvatarImage} loading="lazy" decoding="async" />
                ) : (
                  member.initials
                )}
              </span>
              <h3>{member.name}</h3>
              <p>{member.role}</p>
              <a href={member.linkedin} className={styles.memberLink} aria-label={`${member.name} LinkedIn`}>
                <Linkedin size={16} />
              </a>
            </article>
          ))}
        </div>
      </section>
    </div>
  </section>
);

export default AboutPage;
