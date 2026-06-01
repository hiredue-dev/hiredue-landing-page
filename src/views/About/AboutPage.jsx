"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Linkedin } from "lucide-react";
import styles from "./AboutPage.module.css";
import { aboutPageContent } from "@/content/pages/aboutPageContent.js";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

const AboutPage = () => {
  const { hero, origin, vision, principles, numbers, team, closing } = aboutPageContent;

  return (
    <article className={styles.page}>
      <div className={styles.container}>
        <header className={styles.hero}>
          <motion.span
            className={styles.heroPill}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
          >
            <span className={styles.heroPillDot} />
            {hero.pill}
          </motion.span>

          <motion.span
            className={styles.eyebrow}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.05}
          >
            {hero.eyebrow}
          </motion.span>

          <motion.h1
            className={styles.heroHeading}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.12}
          >
            {hero.heading}
          </motion.h1>

          <motion.p
            className={styles.heroLead}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.22}
          >
            {hero.subheading}
          </motion.p>

          <motion.dl
            className={styles.heroMeta}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.32}
          >
            {hero.meta.map((m) => (
              <div key={m.label} className={styles.heroMetaItem}>
                <dt>{m.label}</dt>
                <dd>{m.value}</dd>
              </div>
            ))}
          </motion.dl>
        </header>

        <section className={styles.section} aria-labelledby="origin-title">
          <span className={styles.sectionKicker}>{origin.kicker}</span>
          <h2 id="origin-title" className={styles.sectionTitle}>
            {origin.title}
          </h2>
          <div className={styles.proseColumn}>
            {origin.body.map((para, i) => (
              <p key={i} className={styles.prose}>
                {para}
              </p>
            ))}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="vision-title">
          <span className={styles.sectionKicker}>{vision.kicker}</span>
          <h2 id="vision-title" className={styles.visionStatement}>
            {vision.statement}
          </h2>
          <p className={styles.missionIntro}>{vision.mission}</p>

          <ul className={styles.pillarList}>
            {vision.pillars.map((p, i) => (
              <motion.li
                key={p.title}
                className={styles.pillarItem}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, delay: 0.06 + i * 0.08, ease: "easeOut" }}
              >
                <span className={styles.pillarIndex}>{p.index}</span>
                <h3 className={styles.pillarTitle}>{p.title}</h3>
                <p className={styles.pillarBody}>{p.description}</p>
              </motion.li>
            ))}
          </ul>
        </section>

        <section className={styles.section} aria-labelledby="principles-title">
          <span className={styles.sectionKicker}>{principles.kicker}</span>
          <h2 id="principles-title" className={styles.sectionTitle}>
            {principles.title}
          </h2>
          <ul className={styles.principlesList}>
            {principles.items.map((item, i) => (
              <motion.li
                key={item.key}
                className={styles.principleRow}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.55, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className={styles.principleNum}>{item.number}</span>
                <div className={styles.principleContent}>
                  <h3 className={styles.principleTitle}>{item.title}</h3>
                  <p className={styles.principleBody}>{item.description}</p>
                </div>
              </motion.li>
            ))}
          </ul>
        </section>

        <section className={styles.numbersBand} aria-label="By the numbers">
          <span className={styles.sectionKicker}>{numbers.kicker}</span>
          <ul className={styles.numbersGrid}>
            {numbers.items.map((n, i) => (
              <motion.li
                key={n.label}
                className={styles.numberItem}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.55, delay: i * 0.07, ease: "easeOut" }}
              >
                <span className={styles.numberValue}>{n.value}</span>
                <span className={styles.numberLabel}>{n.label}</span>
              </motion.li>
            ))}
          </ul>
        </section>

        <section className={styles.section} aria-labelledby="team-title">
          <span className={styles.sectionKicker}>{team.kicker}</span>
          <h2 id="team-title" className={styles.sectionTitle}>
            {team.title}
          </h2>
          <p className={styles.teamNote}>{team.note}</p>

          <ul className={styles.teamGrid}>
            {team.members.map((member, i) => (
              <motion.li
                key={member.name}
                className={styles.memberCard}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.55, delay: i * 0.08, ease: "easeOut" }}
              >
                <div className={styles.memberFrame}>
                  {member.avatar ? (
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className={styles.memberImage}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <span className={styles.memberInitials}>{member.initials}</span>
                  )}
                </div>
                <div className={styles.memberMeta}>
                  <h3 className={styles.memberName}>{member.name}</h3>
                  <p className={styles.memberRole}>
                    <span>{member.role}</span>
                    <span className={styles.memberDivider} aria-hidden="true">·</span>
                    <span className={styles.memberFocus}>{member.focus}</span>
                  </p>
                  <a
                    href={member.linkedin}
                    className={styles.memberLink}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={`${member.name} on LinkedIn`}
                  >
                    <Linkedin size={15} strokeWidth={2} />
                    <span>LinkedIn</span>
                    <ArrowUpRight size={13} strokeWidth={2.25} />
                  </a>
                </div>
              </motion.li>
            ))}
          </ul>
        </section>

        <section className={styles.closing} aria-label="Closing">
          <span className={styles.closingEyebrow}>{closing.eyebrow}</span>
          <p className={styles.closingLine}>{closing.line}</p>
          <div className={styles.closingActions}>
            <Link href={closing.cta.href} className={styles.closingCta}>
              {closing.cta.label}
              <ArrowUpRight size={17} strokeWidth={2.25} />
            </Link>
            <Link href={closing.secondary.href} className={styles.closingSecondary}>
              {closing.secondary.label}
            </Link>
          </div>
        </section>
      </div>
    </article>
  );
};

export default AboutPage;
