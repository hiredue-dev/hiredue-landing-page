"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/site/ui/Button";
import { CloudStage } from "@/components/site/ui/Cloud";
import { RotatingWord } from "@/components/site/ui/RotatingWord";
import { WithLiveBadge } from "@/components/site/ui/LiveBadge";
import { useAuthModal } from "@/features/auth/components/FloatingAuthModal.jsx";
import { assets } from "@/lib/assets";
import { hero } from "@/lib/content";
import { appear } from "@/lib/motion";
import { useAuth } from "@/features/auth/context/AuthContext.jsx";

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
  /* Both effects belong to the desktop layout only, same as the original.
     With reduced motion the dashboard sits at full size and the hills only
     fade — no scroll-linked zoom or slide. */
  const desktop = useMediaQuery("(min-width: 1200px)");
  const reduced = useReducedMotion();
  const zoom = desktop && !reduced;
  const { isAuthenticated } = useAuth();

  const { showModal } = useAuthModal();

  const { scrollY } = useScroll();
  const dashScale = useTransform(
    scrollY,
    [DASH_FROM, DASH_TO],
    zoom ? [0.64, 1] : [1, 1],
    { clamp: true },
  );
  const dashY = useTransform(scrollY, [DASH_FROM, DASH_TO], zoom ? [-190, 0] : [0, 0], {
    clamp: true,
  });
  const hillScale = useTransform(scrollY, [0, HILL_RANGE], reduced ? [1, 1] : [1, 2], {
    clamp: true,
  });
  const hillY = useTransform(scrollY, [0, HILL_RANGE], reduced ? [0, 0] : [0, 1400], {
    clamp: true,
  });
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
                  <h1 style={appear(0.3)} className="appear t-h1 max-w-[1200px] text-center">
                    HireDue{" "}
                    {/* a white chip with brand text: white type straight on the
                        pale sky read as the faintest word in the headline */}
                    <RotatingWord
                      words={hero.rotatingWords}
                      className="rounded-[0.2em] bg-white px-[0.16em] pt-[0.06em] pb-[0.1em] text-brand shadow-[0_8px_24px_rgba(29,29,29,0.08)]"
                    />{" "}
                    {/* its own line, always: left inline, the chip's width
                        change would pull "while" up onto the first line for
                        short words and push it back down for long ones */}
                    <span className="block">{hero.tagline}</span>
                  </h1>
                </div>

                <p
                  style={appear(0.4)}
                  className="appear max-w-[600px] text-center text-[20px] leading-[1.3] font-medium text-dim"
                >
                  {hero.description}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-5">
                <div style={appear(0.5)} className="appear">
                  {/* signed in, sign-up is moot — the next step is the app */}
                  {isAuthenticated ? (
                    <Button effect="arrow" ring href={hero.signedIn.href}>{hero.signedIn.label}</Button>
                  ) : (
                    <Button ring onClick={() => showModal({ view: "signup" })}>
                      {hero.primary.label}
                    </Button>
                  )}
                </div>
                <div style={appear(0.6)} className="appear">
                  {/* "Live" gets a broadcast badge: it's a real session, not a video */}
                  <Button effect="slide" variant="white" href={hero.secondary.href}><WithLiveBadge label={hero.secondary.label} /></Button>
                </div>
              </div>

              {!isAuthenticated && (
                <p
                  style={appear(0.65)}
                  className="appear -mt-2 rounded-full px-4 py-1.5 text-center text-[14px] leading-[1.3] font-medium text-dim max-md:bg-white/80 max-md:text-ink max-md:backdrop-blur-sm"
                >
                  {hero.reassurance}
                </p>
              )}

            </div>

            {/* product shot */}
            <div style={appear(1.2, 50)} className="appear mx-auto w-full max-w-[1060px]">
              <motion.div
                style={{ scale: dashScale, y: dashY }}
                className="origin-center will-change-transform"
              >
                <DashboardShot />
              </motion.div>
            </div>
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

/*
 * The product shot is an ~840 KB animated WebP, too heavy to be the page's
 * first big paint. Its first frame (~30 KB) loads with priority instead, and
 * the animation fades in over it once the page has finished loading. Reduced
 * motion and Data Saver keep the still.
 */
function DashboardShot() {
  const reduced = useReducedMotion();
  const [animate, setAnimate] = useState(false);
  const [animationReady, setAnimationReady] = useState(false);

  useEffect(() => {
    if (reduced || navigator.connection?.saveData) return undefined;
    const start = () => setAnimate(true);
    if (document.readyState === "complete") {
      start();
      return undefined;
    }
    window.addEventListener("load", start, { once: true });
    return () => window.removeEventListener("load", start);
  }, [reduced]);

  return (
    <div className="relative">
      <Image
        src={assets.hero.dashboardPoster}
        alt="HireDue dashboard"
        width={1200}
        height={675}
        priority
        unoptimized
        sizes="(max-width: 1100px) 100vw, 1060px"
        className="w-full rounded-[20px]"
      />
      {animate && (
        <Image
          src={assets.hero.dashboard}
          alt=""
          width={1200}
          height={675}
          unoptimized
          onLoad={() => setAnimationReady(true)}
          sizes="(max-width: 1100px) 100vw, 1060px"
          className={`absolute inset-0 w-full rounded-[20px] transition-opacity duration-500 ${animationReady ? "opacity-100" : "opacity-0"}`}
        />
      )}
    </div>
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
