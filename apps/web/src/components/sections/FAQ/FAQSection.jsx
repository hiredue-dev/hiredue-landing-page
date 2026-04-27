import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Section from "@/components/ui/Section/Section.jsx";
import SectionHeading from "@/components/ui/SectionHeading/SectionHeading.jsx";
import { faqContent } from "@/content/home/faqContent.js";
import styles from "./FAQSection.module.css";

const FAQSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [openIndex, setOpenIndex] = useState(0);

  useEffect(() => {
    if (!inView) return undefined;

    const intervalId = setInterval(() => {
      setOpenIndex((current) => (current + 1) % faqContent.items.length);
    }, 4000);

    return () => clearInterval(intervalId);
  }, [inView]);

  return (
    <Section id="faq" narrow ref={ref} className={styles.section}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}>
        <SectionHeading title={faqContent.heading} />
      </motion.div>

      <motion.div
        className={styles.list}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {faqContent.items.map((faq, index) => {
          const isOpen = openIndex === index;

          return (
            <div key={faq.q} className={`${styles.item} ${isOpen ? styles.itemOpen : ""}`.trim()}>
              <button
                type="button"
                className={styles.trigger}
                onClick={() => setOpenIndex(index)}
                aria-expanded={isOpen}
              >
                <span>{faq.q}</span>
                <span className={`${styles.symbol} ${isOpen ? styles.symbolOpen : ""}`.trim()} aria-hidden="true" />
              </button>
              <div className={`${styles.contentWrap} ${isOpen ? styles.contentWrapOpen : ""}`.trim()}>
                <div className={styles.content}>{faq.a}</div>
              </div>
            </div>
          );
        })}
      </motion.div>
    </Section>
  );
};

export default FAQSection;
