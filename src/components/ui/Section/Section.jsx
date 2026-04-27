'use client';

import { forwardRef } from "react";
import Container from "@/components/ui/Container/Container.jsx";
import styles from "./Section.module.css";

const Section = forwardRef(function Section(
  {
    as: Component = "section",
    children,
    className = "",
    contentClassName = "",
    narrow = false,
    tone = "default",
    ...props
  },
  ref,
) {
  const sectionClassName = [styles.section, styles[tone], className].filter(Boolean).join(" ");

  return (
    <Component ref={ref} className={sectionClassName} {...props}>
      <Container narrow={narrow} className={contentClassName}>
        {children}
      </Container>
    </Component>
  );
});

export default Section;
