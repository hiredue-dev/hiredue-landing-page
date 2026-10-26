import clsx from "clsx";

/**
 * "Live" as a broadcast badge in the brand blue: a dot that sends out a pulse, beside the
 * word. Sized to sit inside a line of 18px button text without changing its
 * height; the pulse stops under reduced motion and the dot stays.
 */
export function LiveBadge({ className }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full bg-[#e8eefc] px-2 align-top text-[#2847a8]",
        className,
      )}
    >
      <span aria-hidden className="relative flex size-2">
        <span className="absolute inset-0 animate-ping rounded-full bg-brand opacity-75 motion-reduce:hidden" />
        <span className="relative size-2 rounded-full bg-brand" />
      </span>
      Live
    </span>
  );
}

/** A label with its word "Live" swapped for the badge (no "Live": as is). */
export function WithLiveBadge({ label }) {
  const at = label.indexOf("Live");
  if (at < 0) return label;
  return (
    <>
      {label.slice(0, at)}
      <LiveBadge />
      {label.slice(at + 4)}
    </>
  );
}
