"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowButton, SlideButton } from "@/components/site/ui/Button";
import { CloudStage } from "@/components/site/ui/Cloud";
import { RotatingWord } from "@/components/site/ui/RotatingWord";
import { assets } from "@/lib/assets";
import { hero } from "@/lib/content";
import { spring } from "@/lib/motion";

/** Load-in: fade up, with the same delay ladder the original uses. */
const appear = (delay, y = 20, duration = 1) => ({
  initial: { opacity: 0.001, y },
  animate: { opacity: 1, y: 0 },
  transition: spring(duration, delay),
});

/*
 * Scroll ranges measured off the original at a 1440 viewport:
 *   dashboard  90 → 700px    scale 0.64 → 1,  y −190 → 0
 *   hills       0 → 1233px   scale 1 → 2,     y 0 → 1400
 *
 * The hills are painted *over* the product shot. Scrolling grows them and
 * slides them down out of the clipped section while the dashboard rises and
 * zooms up to full size, so it emerges from behind them. The opacity ramp is
 * ours, not the original's — it clears the grass off the dashboard sooner.
 */
const DASH_FROM = 90;
const DASH_TO = 700;
const HILL_RANGE = 1233;
const HILL_FADE = [250, 820];

/*
 * The hero's own height is what places the hills: the original is 175vh tall
 * on desktop and hangs the landscape ~231px above its bottom edge, so on a
 * tall window the grass sits low (or below the fold) instead of cutting
 * across the product shot.
 */
const COPY_BLOCK = 420;

export function Hero() {
  /* Both effects belong to the desktop layout only, same as the original. */
  const desktop = useMediaQuery("(min-width: 1200px)");

  const { scrollY } = useScroll();
  const dashScale = useTransform(
    scrollY,
    [DASH_FROM, DASH_TO],
    desktop ? [0.64, 1] : [1, 1],
    { clamp: true },
  );
  const dashY = useTransform(scrollY, [DASH_FROM, DASH_TO], desktop ? [-190, 0] : [0, 0], {
    clamp: true,
  });
  const hillScale = useTransform(scrollY, [0, HILL_RANGE], [1, 2], { clamp: true });
  const hillY = useTransform(scrollY, [0, HILL_RANGE], [0, 1400], { clamp: true });
  const hillOpacity = useTransform(scrollY, HILL_FADE, [1, 0], { clamp: true });

  return (
    <section
      id="top"
      className="relative isolate flex flex-col overflow-hidden bg-white pt-[120px] pb-[40px] sm:pt-[150px] min-[1200px]:min-h-[145vh]"
    >
      {/* sky */}
      <Image
        src={assets.hero.sky}
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover object-top"
      />

      {/* drifting clouds, pinned to a 1440-wide stage like the original */}
      <CloudStage
        cloud01={assets.hero.cloud01}
        cloud02={assets.hero.cloud02}
        cloud03={assets.hero.cloud03}
      />

      <div className="relative z-[2] flex flex-1 flex-col">
        <div className="container-page flex flex-1 flex-col">
          <div className="flex flex-1 flex-col gap-[40px] md:gap-[60px]">
            {/* reserve the original's copy-block height so the product shot
                always lands in the same place, however long the copy runs */}
            <div
              className="flex flex-col items-center gap-10 min-[1200px]:min-h-[var(--copy-block)]"
              style={{ "--copy-block": `${COPY_BLOCK}px` }}
            >
              <div className="flex flex-col items-center gap-5">
                <div className="flex flex-col items-center gap-2.5">
                  <motion.h1 {...appear(0.3)} className="t-h1 max-w-[1200px] text-center">
                    HireDue{" "}
                    <RotatingWord
                      words={hero.rotatingWords}
                      className="text-white drop-shadow-[0_4px_20px_rgba(29,29,29,0.25)]"
                    />
                    <br />
                    {hero.tagline}
                  </motion.h1>
                </div>

                <motion.p
                  {...appear(0.4)}
                  className="max-w-[600px] text-center text-[20px] leading-[1.3] font-medium text-dim"
                >
                  {hero.description}
                </motion.p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-5">
                <motion.div {...appear(0.5)}>
                  <ArrowButton label={hero.primary.label} href={hero.primary.href} tone="primary" />
                </motion.div>
                <motion.div {...appear(0.6)}>
                  <SlideButton
                    label={hero.secondary.label}
                    href={hero.secondary.href}
                    tone="white"
                  />
                </motion.div>
              </div>

              <motion.ul
                {...appear(0.7)}
                className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2.5"
              >
                {hero.proof.map((item, i) => (
                  <li key={item.label} className="flex items-center gap-x-5">
                    {i > 0 && <span className="hidden h-[22px] w-px bg-ink sm:block" />}
                    <span className="flex items-center gap-1.5">
                      <Image
                        src={item.icon}
                        alt=""
                        width={19}
                        height={18}
                        className="h-[18px] w-auto"
                      />
                      <span className="t-body">{item.label}</span>
                    </span>
                  </li>
                ))}
              </motion.ul>
            </div>

            {/* product shot */}
            <motion.div
              initial={{ opacity: 0.001, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={spring(1, 1.2)}
              className="mx-auto w-full max-w-[1060px]"
            >
              <motion.div
                style={{ scale: dashScale, y: dashY }}
                className="origin-center will-change-transform"
              >
                <Image
                  src={assets.hero.dashboard}
                  alt="HireDue dashboard"
                  width={1920}
                  height={1080}
                  priority
                  unoptimized
                  sizes="(max-width: 1100px) 100vw, 1060px"
                  className="w-full rounded-[20px]"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* rolling hills — in front of the product shot, clipped to the section */}
      <div className="pointer-events-none absolute inset-y-0 -right-5 left-0 z-[3] hidden overflow-clip min-[1200px]:block">
        <motion.div
          style={{ scale: hillScale, y: hillY, opacity: hillOpacity }}
          className="absolute bottom-[120px] left-0 w-full origin-center will-change-transform"
        >
          <Image
            src={assets.hero.hills}
            alt=""
            width={2920}
            height={1143}
            sizes="(max-width: 1460px) 100vw, 1460px"
            className="w-full"
          />
        </motion.div>
      </div>

      {/* fade the sky into the page */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[4] h-[100px] bg-[linear-gradient(rgba(255,255,255,0)_0%,rgba(255,255,255,0.7)_25%,#fff_50%)] min-[810px]:h-[160px] min-[1200px]:h-[200px]" />
    </section>
  );
}

function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [query]);

  return matches;
}
