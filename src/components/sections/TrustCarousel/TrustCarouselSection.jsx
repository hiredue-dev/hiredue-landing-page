import styles from "./TrustCarouselSection.module.css";
import { trustCarouselContent } from "@/content/home/trustCarouselContent.js";

const companyWeightClass = (company) => {
  if (company === "LinkedIn") return styles.linkedin;
  if (company === "Workday") return styles.workday;
  if (company === "Greenhouse") return styles.greenhouse;
  return "";
};

const TrustCarouselSection = () => (
  <section className={styles.section}>
    <div className={styles.container}>
      <div className={styles.trustBand} aria-label="Trusted platforms">
        <p className={styles.trustHeading}>{trustCarouselContent.heading}</p>
        <div className={styles.trustMarquee}>
          <div className={styles.trustTrack}>
            {[...trustCarouselContent.companies, ...trustCarouselContent.companies].map((company, index) => (
              <span
                key={`${company}-${index}`}
                className={`${styles.companyChip} ${companyWeightClass(company)}`}
                aria-hidden="true"
              >
                {company}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default TrustCarouselSection;
