import styles from "./Input.module.css";

const Input = ({ className = "", ...props }) => (
  <input className={[styles.input, className].filter(Boolean).join(" ")} {...props} />
);

export default Input;
