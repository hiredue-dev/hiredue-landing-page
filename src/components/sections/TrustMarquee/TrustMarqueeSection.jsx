// DEPRECATED: Retained for safe rollback during refactor.
// Active home flow uses TrustCarouselSection.
import styles from "./TrustMarqueeSection.module.css";

const companyLogos = [
  "LinkedIn",
  "Indeed",
  "Naukri",
  "Foundit",
  "Glassdoor",
  "Wellfound",
  "ZipRecruiter",
  "Instahyre",
];

const TrustMarqueeSection = () => (
  <section className={styles.section} aria-label="Trusted platforms">
    <div className={styles.container}>
      <p className={styles.heading}>Discover jobs from</p>
      <div className={styles.marquee}>
        <div className={styles.track}>
          {[...companyLogos, ...companyLogos].map((logo, index) => (
            <div key={`${logo}-${index}`} className={styles.logoChip}>
              <span className={styles.logoDot} />
              <span className={styles.logoText}>{logo}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default TrustMarqueeSection;
