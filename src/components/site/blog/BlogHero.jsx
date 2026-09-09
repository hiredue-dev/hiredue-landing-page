"use client";

import Image from "next/image";
import clsx from "clsx";

/**
 * The sky-backed header both blog routes share: a cropped photo with a white
 * wash over it, and an 800px column of centred copy on top.
 */
export function BlogHero({
  bg,
  className,
  children,
}) {
  return (
    <section
      className={clsx(
        "relative isolate flex flex-col items-center overflow-hidden pt-[128px] min-[810px]:pt-[158px] min-[1200px]:pt-[194px]",
        className,
      )}
    >
      <Image src={bg} alt="" fill priority sizes="100vw" className="-z-10 object-cover" />
      <span className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.5)_0%,#fff_50%)]" />

      <div className="relative mx-auto w-full max-w-[860px] px-[30px]">
        <div className="flex flex-col items-center gap-2.5">{children}</div>
      </div>
    </section>
  );
}
