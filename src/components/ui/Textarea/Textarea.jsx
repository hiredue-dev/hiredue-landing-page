import styles from "./Textarea.module.css";

const Textarea = ({ className = "", ...props }) => (
  <textarea className={[styles.textarea, className].filter(Boolean).join(" ")} {...props} />
);

export default Textarea;
