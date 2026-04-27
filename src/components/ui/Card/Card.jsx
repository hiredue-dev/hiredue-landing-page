import styles from "./Card.module.css";

const Card = ({
  as: Component = "div",
  children,
  className = "",
  surface = "card",
  padding = "none",
  interactive = false,
  hover = "none",
  align = "left",
  ...props
}) => {
  const classes = [
    styles.card,
    styles[`surface${surface.charAt(0).toUpperCase()}${surface.slice(1)}`],
    styles[`padding${padding.charAt(0).toUpperCase()}${padding.slice(1)}`],
    interactive ? styles.interactive : "",
    hover !== "none" ? styles[`hover${hover.charAt(0).toUpperCase()}${hover.slice(1)}`] : "",
    align !== "left" ? styles[`align${align.charAt(0).toUpperCase()}${align.slice(1)}`] : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
};

export default Card;
