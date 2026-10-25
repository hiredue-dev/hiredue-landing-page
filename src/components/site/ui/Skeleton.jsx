import clsx from "clsx";

/*
 * Page skeletons for route `loading.jsx` files: grey placeholders in the
 * shape of the page on its way, so a visit swaps blocks for content instead
 * of a blank screen. Server components, no JS — they paint while the route
 * streams in. Each one keeps the real page's top padding and column width,
 * so nothing jumps when the content lands.
 */

/** One placeholder block; size and shape come from `className`. */
export function Bone({ className, style }) {
  return <div style={style} className={clsx("rounded-[10px] bg-surface", className)} />;
}

/** Wraps a skeleton: announces the load once, pulses unless motion is reduced. */
export function SkeletonPage({ label = "Loading page", className, children }) {
  return (
    <div role="status" aria-busy="true" aria-label={label}>
      <span className="route-progress" aria-hidden />
      <div className={clsx("animate-pulse motion-reduce:animate-none", className)}>{children}</div>
    </div>
  );
}

/** The centred eyebrow / title / lede block most page heroes open with. */
export function HeroBones({ eyebrow = true, lede = true, className }) {
  return (
    <div className={clsx("flex w-full flex-col items-center gap-3", className)}>
      {eyebrow && <Bone className="h-8 w-28 rounded-full" />}
      <Bone className="h-11 w-full max-w-[520px] rounded-[12px] min-[810px]:h-14" />
      <Bone className="h-11 w-3/4 max-w-[380px] rounded-[12px] min-[810px]:hidden" />
      {lede && (
        <div className="mt-2 flex w-full flex-col items-center gap-2">
          <Bone className="h-5 w-full max-w-[540px]" />
          <Bone className="h-5 w-2/3 max-w-[360px]" />
        </div>
      )}
    </div>
  );
}

/** Ragged paragraph lines, the way running text sits. */
export function TextBones({ lines = 4, className }) {
  const widths = [100, 96, 98, 72, 94, 100, 88, 60];
  return (
    <div className={clsx("flex flex-col gap-2.5", className)}>
      {Array.from({ length: lines }, (_, i) => (
        <Bone
          key={i}
          className="h-4"
          style={{ width: `${i === lines - 1 ? 55 : widths[i % widths.length]}%` }}
        />
      ))}
    </div>
  );
}

/** A blog card: cover, category pill, two-line title. */
export function CardBones() {
  return (
    <div className="flex flex-col gap-2.5 rounded-[20px] bg-white p-2.5 shadow-[0_0_0_4px_rgba(221,229,237,0.7)]">
      <Bone className="aspect-[1200/680] w-full" />
      <div className="flex flex-col gap-2.5 p-2.5 min-[810px]:p-4">
        <Bone className="h-7 w-24 rounded-full" />
        <Bone className="h-6 w-full" />
        <Bone className="h-6 w-2/3" />
      </div>
    </div>
  );
}

/** Top-of-page padding shared by the inner pages' heroes. */
export const HERO_TOP = "pt-[140px] min-[810px]:pt-[170px] min-[1200px]:pt-[194px]";
