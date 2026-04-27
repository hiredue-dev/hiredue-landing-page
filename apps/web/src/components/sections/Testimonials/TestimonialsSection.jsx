import { motion, useInView } from "framer-motion";
import { useMemo, useRef } from "react";
import Card from "@/components/ui/Card/Card.jsx";
import Section from "@/components/ui/Section/Section.jsx";
import SectionHeading from "@/components/ui/SectionHeading/SectionHeading.jsx";
import { testimonialsContent } from "@/content/home/testimonialsContent.js";
import styles from "./TestimonialsSection.module.css";

const rotateFrom = (array, start) => [...array.slice(start), ...array.slice(0, start)];

const TestimonialsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const rows = useMemo(() => {
    const base = testimonialsContent.items;
    const primary = [...base, ...base, ...base];
    const secondaryBase = rotateFrom(base, 2 % base.length);
    const secondary = [...secondaryBase, ...secondaryBase, ...secondaryBase];
    return [primary, secondary];
  }, []);

  return (
    <Section id="testimonials" ref={ref}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}>
        <SectionHeading title={testimonialsContent.heading} />
      </motion.div>

      <motion.div
        className={styles.content}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className={styles.marqueeWrap}>
          <div className={styles.rows}>
            {rows.map((rowItems, rowIndex) => (
              <div
                key={`row-${rowIndex}`}
                className={`${styles.rowTrack} ${rowIndex === 0 ? styles.toLeft : styles.toRight} ${inView ? styles.play : ""}`.trim()}
              >
                {rowItems.map((item, itemIndex) => (
                  <Card key={`${rowIndex}-${item.name}-${itemIndex}`} className={styles.card}>
                    <p className={styles.quote}>&quot;{item.quote}&quot;</p>
                    <div className={styles.author}>
                      <div className={styles.avatar}>{item.name[0]}</div>
                      <div>
                        <p className={styles.name}>{item.name}</p>
                        <p className={styles.role}>{item.role}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </Section>
  );
};

export default TestimonialsSection;
