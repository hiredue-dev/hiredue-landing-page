/**
 * The template animates everything with a critically-damped spring
 * (`bounce: 0`), so entrances glide to a stop instead of overshooting.
 */
export const spring = (duration = 0.6, delay = 0) => ({
  type: "spring",
  bounce: 0,
  duration,
  delay,
});

/** Fade + rise. `y` is 10px for small chrome, 20px for content blocks. */
export const rise = (y = 20, duration = 0.6) => ({
  hidden: { opacity: 0.001, y },
  visible: { opacity: 1, y: 0, transition: spring(duration) },
});

/** Parent that staggers its children the way the hero column does. */
export const stagger = (step = 0.1, delayChildren = 0.1) => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: step, delayChildren },
  },
});

/** Shared `whileInView` config — fire once, a little before fully on screen. */
export const inView = {
  initial: "hidden",
  whileInView: "visible",
  viewport: { once: true, amount: 0.2, margin: "0px 0px -80px 0px" },
};
