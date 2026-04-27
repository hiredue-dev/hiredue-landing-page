import { motion } from "framer-motion";
import { useState } from "react";
import Button from "@/components/ui/Button/Button.jsx";
import Input from "@/components/ui/Input/Input.jsx";
import { useWaitlist } from "@/app/providers/waitlist-context.js";
import { heroContent } from "@/content/home/heroContent.js";
import styles from "./HeroSection.module.css";

const HeroSection = () => {
  const [email, setEmail] = useState("");
  const { openWaitlist } = useWaitlist();

  const openWaitlistModal = () => {
    openWaitlist({ prefillEmail: email.trim() });
  };

  return (
    <section className={styles.section}>
      <div className={styles.background} />
      <div className={styles.container}>
        <div className={styles.grid}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {heroContent.announcement ? (
              <div className={styles.announcementPill}>
                <span className={styles.announcementTag}>
                  <span className={styles.announcementDot} />
                  {heroContent.announcement.tag}
                </span>
                <span className={styles.announcementText}>{heroContent.announcement.text}</span>
              </div>
            ) : null}
            <h1 className={styles.heading}>
              {heroContent.headingPrefix} <span className={styles.gradientText}>{heroContent.headingHighlight}</span>
            </h1>
            <p className={styles.description}>
              {heroContent.description}
            </p>
            <p className={styles.microTrust}>{heroContent.microTrustLine}</p>

            <div className={styles.waitlistInline}>
              <Input
                type="email"
                placeholder={heroContent.emailPlaceholder}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    openWaitlistModal();
                  }
                }}
                className={styles.waitlistInput}
              />
              <Button className={styles.waitlistInlineButton} onClick={openWaitlistModal}>
                {heroContent.inlineCtaLabel}
              </Button>
            </div>

            {heroContent.trustBadge ? (
              <div className={styles.trustBadge} aria-label={`${heroContent.trustBadge.prefix} ${heroContent.trustBadge.highlight} ${heroContent.trustBadge.suffix}`}>
                <div className={styles.trustBadgeAvatars}>
                  {heroContent.trustBadge.avatars.map((avatar, index) => (
                    <span key={`${avatar.src}-${index}`} className={styles.trustBadgeAvatarWrap}>
                      <img src={avatar.src} alt={avatar.alt} className={styles.trustBadgeAvatar} loading="lazy" decoding="async" />
                    </span>
                  ))}
                </div>
                <p className={styles.trustBadgeText}>
                  {heroContent.trustBadge.prefix} <strong>{heroContent.trustBadge.highlight}</strong> {heroContent.trustBadge.suffix}
                </p>
              </div>
            ) : null}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
