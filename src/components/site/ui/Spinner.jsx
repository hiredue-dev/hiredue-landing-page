import clsx from "clsx";

/** A ring spinner in the current text colour, sized to the text by default. */
export function Spinner({ className }) {
  return (
    <span
      aria-hidden
      className={clsx(
        "inline-block size-[1em] shrink-0 animate-spin rounded-full border-2 border-current border-r-transparent motion-reduce:animate-[spin_2.5s_linear_infinite]",
        className,
      )}
    />
  );
}

/**
 * A button's label that turns into "spinner + `label`" while `busy`, so a
 * click that's waiting on the network shows it's working, not just greyed out.
 */
export function Busy({ busy, label, children }) {
  return (
    <span className="inline-flex items-center justify-center gap-2">
      {busy && <Spinner />}
      {busy ? label : children}
    </span>
  );
}
