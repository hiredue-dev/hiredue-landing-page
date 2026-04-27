'use client';

import { motion, useInView } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { Download, FileText, Link2, SlidersHorizontal, Pizza } from "lucide-react";
import Section from "@/components/ui/Section/Section.jsx";
import SectionHeading from "@/components/ui/SectionHeading/SectionHeading.jsx";
import { howItWorksContent } from "@/content/home/howItWorksContent.js";
import styles from "./HowItWorksSection.module.css";

const stepIcons = [Download, FileText, Link2, SlidersHorizontal, Pizza];
const DWELL_MS = 1600;
const BEAM_MS = 320;

const HowItWorksSection = () => {
  const ref = useRef(null);
  const panelRef = useRef(null);
  const stepRefs = useRef([]);
  const timersRef = useRef([]);
  const beamPathRef = useRef({ from: 0, to: 1 });
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const [activeIndex, setActiveIndex] = useState(0);
  const [beamVisible, setBeamVisible] = useState(false);
  const [beamStyle, setBeamStyle] = useState({ left: 0, top: 0, width: 0 });

  const clearLoopTimers = useCallback(() => {
    timersRef.current.forEach((timerId) => clearTimeout(timerId));
    timersRef.current = [];
  }, []);

  const computeBeamStyle = useCallback((fromIndex, toIndex) => {
    const panelEl = panelRef.current;
    const fromStep = stepRefs.current[fromIndex];
    const toStep = stepRefs.current[toIndex];
    if (!panelEl || !fromStep || !toStep) return;

    const fromCircle = fromStep.querySelector(`.${styles.iconWrap}`);
    const toCircle = toStep.querySelector(`.${styles.iconWrap}`);
    if (!fromCircle || !toCircle) return;

    const panelRect = panelEl.getBoundingClientRect();
    const fromRect = fromCircle.getBoundingClientRect();
    const toRect = toCircle.getBoundingClientRect();

    const x1 = fromRect.left + fromRect.width / 2 - panelRect.left;
    const x2 = toRect.left + toRect.width / 2 - panelRect.left;

    const connectorEl = panelEl.querySelector(`.${styles.connectorLine}`);
    const connectorRect = connectorEl?.getBoundingClientRect();
    const y = connectorRect
      ? connectorRect.top + connectorRect.height / 2 - panelRect.top
      : fromRect.top + fromRect.height / 2 - panelRect.top;

    setBeamStyle({
      left: Math.min(x1, x2),
      top: y,
      width: Math.abs(x2 - x1),
    });
  }, []);

  const runStepLoop = useCallback((currentIndex) => {
    const nextIndex = (currentIndex + 1) % howItWorksContent.steps.length;

    const dwellTimer = setTimeout(() => {
      beamPathRef.current = { from: currentIndex, to: nextIndex };
      computeBeamStyle(currentIndex, nextIndex);
      setBeamVisible(true);

      const hitTimer = setTimeout(() => {
        setBeamVisible(false);
        setActiveIndex(nextIndex);
        runStepLoop(nextIndex);
      }, BEAM_MS);

      timersRef.current.push(hitTimer);
    }, DWELL_MS);

    timersRef.current.push(dwellTimer);
  }, [computeBeamStyle]);

  useEffect(() => {
    if (!inView) return undefined;
    setActiveIndex(0);
    runStepLoop(0);
    return () => clearLoopTimers();
  }, [clearLoopTimers, inView, runStepLoop]);

  useEffect(() => {
    const onResize = () => {
      if (!beamVisible) return;
      computeBeamStyle(beamPathRef.current.from, beamPathRef.current.to);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [beamVisible]);

  return (
    <Section id="how-it-works" ref={ref} className={styles.section}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.55 }}
      >
        <SectionHeading title={howItWorksContent.heading} />
      </motion.div>

      <motion.div
        ref={panelRef}
        className={styles.panel}
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.65, delay: 0.1 }}
      >
        <div className={styles.connectorLine} aria-hidden="true" />
        <span
          className={`${styles.beam} ${beamVisible ? styles.beamVisible : ""} ${
            beamVisible && beamPathRef.current.from > beamPathRef.current.to ? styles.beamReverse : ""
          }`.trim()}
          style={{
            left: `${beamStyle.left}px`,
            top: `${beamStyle.top}px`,
            width: `${beamStyle.width}px`,
          }}
          aria-hidden="true"
        />

        <div className={styles.grid}>
          {howItWorksContent.steps.map((step, index) => {
            const Icon = stepIcons[index] || Download;
            const isActive = activeIndex === index;
            return (
              <article
                key={step.title}
                ref={(node) => {
                  stepRefs.current[index] = node;
                }}
                className={`${styles.item} ${isActive ? styles.itemActive : ""}`.trim()}
              >
                <div className={styles.nodeWrap}>
                  <div className={styles.iconWrap}>
                    <Icon className={styles.iconGlyph} aria-hidden="true" />
                  </div>
                  <span className={styles.nodeStem} aria-hidden="true" />
                  <span className={styles.stepLabel}>{howItWorksContent.states[index]}</span>
                </div>

                <div className={styles.stepCard}>
                  <h3 className={styles.itemTitle}>{step.title}</h3>
                  <p className={styles.itemText}>{step.desc}</p>
                </div>
              </article>
            );
          })}
        </div>
      </motion.div>
    </Section>
  );
};

export default HowItWorksSection;
