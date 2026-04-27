import styles from "./SectionHeading.module.css";

const SectionHeading = ({ title, description, align = "center", className = "", titleClassName = "", descriptionClassName = "" }) => (
  <div className={[styles.wrapper, styles[align], className].filter(Boolean).join(" ")}>
    <h2 className={[styles.title, titleClassName].filter(Boolean).join(" ")}>{title}</h2>
    {description ? <p className={[styles.description, descriptionClassName].filter(Boolean).join(" ")}>{description}</p> : null}
  </div>
);

export default SectionHeading;
