import clsx from "clsx";

/** Brand glyphs ship as single-path SVGs, so a CSS mask tints them freely. */
export function Mark({
  src,
  color,
  className,
}) {
  return (
    <span
      aria-hidden
      className={clsx("block shrink-0", className)}
      style={{
        backgroundColor: color,
        maskImage: `url(${src})`,
        WebkitMaskImage: `url(${src})`,
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
      }}
    />
  );
}
