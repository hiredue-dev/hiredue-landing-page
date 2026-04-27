import styles from "./Button.module.css";

const Button = ({
  children,
  className = "",
  type = "button",
  variant = "primary",
  size = "md",
  as: Component = "button",
  ...props
}) => {
  const classes = [styles.button, styles[variant], styles[size], className].filter(Boolean).join(" ");

  if (Component === "button") {
    return (
      <button type={type} className={classes} {...props}>
        {children}
      </button>
    );
  }

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
};

export default Button;
