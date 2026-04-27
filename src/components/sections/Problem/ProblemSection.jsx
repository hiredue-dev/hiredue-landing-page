'use client';

import { AnimatePresence, motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Section from "@/components/ui/Section/Section.jsx";
import SectionHeading from "@/components/ui/SectionHeading/SectionHeading.jsx";
import { problemContent } from "@/content/home/problemContent.js";
import styles from "./ProblemSection.module.css";

const problemIcons = [
  "/assets/Problem/1.png",
  "/assets/Problem/2.png",
  "/assets/Problem/3.png",
  "/assets/Problem/4.png",
];

const solutionIcons = [
  "/assets/Solutions/5.png",
  "/assets/Solutions/6.png",
  "/assets/Solutions/7.png",
  "/assets/Solutions/8.png",
];

const ProblemSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [supportsHover, setSupportsHover] = useState(true);
  const [tappedFlips, setTappedFlips] = useState({});
  const [hoveredIndex, setHoveredIndex] = useState(-1);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hoverMedia = window.matchMedia("(hover: hover)");
    setSupportsHover(hoverMedia.matches);
  }, []);

  return (
    <Section tone="default" className={styles.section} ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      >
        <SectionHeading
          title={problemContent.heading}
          className={styles.headingWrap}
          titleClassName={styles.heading}
        />
      </motion.div>

      <div className={styles.grid}>
        {problemContent.cards.map((card, index) => {
          const isFlipped = supportsHover ? hoveredIndex === index : Boolean(tappedFlips[card.id]);
          const frontIconSrc = problemIcons[index] || problemIcons[0];
          const backIconSrc = solutionIcons[index] || solutionIcons[0];
          return (
            <motion.button
              key={card.id}
              type="button"
              className={styles.perspectiveCard}
              onHoverStart={() => supportsHover && setHoveredIndex(index)}
              onHoverEnd={() => supportsHover && setHoveredIndex(-1)}
              onClick={() => !supportsHover && setTappedFlips((prev) => ({ ...prev, [card.id]: !prev[card.id] }))}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setTappedFlips((prev) => ({ ...prev, [card.id]: !prev[card.id] }));
                }
              }}
              initial={{ opacity: 0, y: 22 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              whileTap={{ scale: 0.98 }}
              aria-label={`${card.front.title} to ${card.back.title}`}
            >
              <motion.div
                className={styles.flipInner}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <div className={`${styles.cardFace} ${styles.cardFront}`.trim()}>
                  <div className={styles.iconWrap} aria-hidden="true">
                    <img src={frontIconSrc} alt="" className={styles.iconImage} loading="lazy" />
                  </div>
                  <h3 className={styles.cardTitle}>{card.front.title}</h3>
                  <p className={styles.cardText}>{card.front.desc}</p>
                </div>

                <div className={`${styles.cardFace} ${styles.cardBack}`.trim()}>
                  <div className={styles.iconWrap} aria-hidden="true">
                    <img src={backIconSrc} alt="" className={styles.iconImage} loading="lazy" />
                  </div>
                  <h3 className={styles.cardTitle}>{card.back.title}</h3>
                  <p className={styles.cardText}>{card.back.desc}</p>
                </div>
              </motion.div>

              <div className={styles.cardState}>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={isFlipped ? "solution" : "pain"}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isFlipped ? "HireDue Solution" : "Pain Point"}
                  </motion.span>
                </AnimatePresence>
              </div>
            </motion.button>
          );
        })}
      </div>

      <a href="#how-it-works" className={styles.learnLink}>
        {problemContent.learnMoreLabel}
      </a>
    </Section>
  );
};

export default ProblemSection;
