import styles from "./Container.module.css";

const Container = ({ children, narrow = false, className = "" }) => (
  <div className={[styles.container, narrow ? styles.narrow : "", className].filter(Boolean).join(" ")}>{children}</div>
);

export default Container;
