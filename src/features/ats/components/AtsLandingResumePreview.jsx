"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { AtSign, Award, FileSearch, Sparkles } from "lucide-react";
import { Reveal } from "@/components/site/ui/Primitives";
import { ats } from "@/lib/content";

/**
 * The /ats landing hero's right-rail showcase: a static (fictional) resume
 * image floating alongside the upload interaction, with a few soft analytical
 * badges that gently animate in. It explains — in plain, illustrative terms —
 * what the checker inspects (keywords, skills, experience, ATS-readiness)
 * without ever claiming to be the user's own report.
 *
 * Motion is deliberately restrained:
 *   - The resume sheet drifts on a light float loop and tilts slightly toward
 *     the cursor on hover (mouse-dependent).
 *   - Badges fade/rise in once, staggered.
 *   - All of it respects `prefers-reduced-motion` (via `useReducedMotion`):
 *     no float, no tilt under reduced motion — content is always conveyed by
 *     the visible text, never by animation alone.
 *
 * Purely presentational — copy lives in `ats.hero.preview*`.
 */
export function AtsLandingResumePreview() {
  const prefersReducedMotion = useReducedMotion();
  const { preview } = ats.hero;

  const badges = [
    { key: "ats", Icon: Award, ...preview.badges.atsReady },
    { key: "skills", Icon: Sparkles, ...preview.badges.skills },
    { key: "experience", Icon: FileSearch, ...preview.badges.experience },
    { key: "keywords", Icon: AtSign, ...preview.badges.keywords },
  ];

  // Subtle 3D tilt toward the cursor — disabled under reduced motion. A small
  // pointer window maps to a few degrees of rotation and a touch of drift, kept
  // subtle so the sheet never feels gimmicky.
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const swayX = useMotionValue(0);
  const swayY = useMotionValue(0);
  const springCfg = { stiffness: 140, damping: 20, mass: 0.6 };

  const smoothRotateX = useSpring(rotateX, springCfg);
  const smoothRotateY = useSpring(rotateY, springCfg);
  const floatX = useSpring(swayX, { stiffness: 50, damping: 18 });
  const floatY = useSpring(swayY, { stiffness: 50, damping: 18 });

  const ref = useRef(null);
  const handlePointerMove = (event) => {
    if (prefersReducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * 8);
    rotateX.set(-py * 8);
    swayX.set(px * 6);
    swayY.set(py * 5);
  };

  const handlePointerLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    swayX.set(0);
    swayY.set(0);
  };

  const floatTransition = prefersReducedMotion
    ? null
    : { duration: 7, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" };

  return (
    <Reveal
      delay={0.06}
      className="flex flex-col items-center lg:items-stretch"
    >
      <div className="relative mx-auto w-full max-w-[400px] md:max-w-[360px]">
        {/* Illustration only — decorative but still communicates state via text. */}
        <motion.div
          ref={ref}
          className="relative"
          style={
            prefersReducedMotion
              ? {}
              : { rotateX: smoothRotateX, rotateY: smoothRotateY }
          }
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
        >
          {/* The resume sheet drifts gently on the page; tilt is layered on top. */}
          <motion.div
            animate={
              prefersReducedMotion
                ? undefined
                : { y: [0, -10, 0], x: [0, 4, 0] }
            }
            transition={floatTransition}
            style={
              prefersReducedMotion
                ? undefined
                : {
                    x: floatX,
                    y: floatY,
                    transformPerspective: 1200,
                    willChange: "transform",
                  }
            }
            className="relative rounded-[18px] bg-white p-2.5 shadow-[0_30px_70px_-28px_rgba(29,29,29,0.35)] ring-1 ring-line"
          >
            <Image
              src="/images/ats/resume-ats.png"
              alt={preview.captionAlt}
              width={1102}
              height={1427}
              priority
              sizes="(max-width: 480px) 320px, 360px"
              className="block h-auto w-full rounded-[12px] object-contain"
            />
          </motion.div>
        </motion.div>

        {/* Floating analytical badges — gently fade/rise in once, staggered. */}
        {badges.map(({ key, Icon, label, toneClass }, index) => {
          const position =
            index % 2 === 0
              ? `left-[-18px] md:left-[-26px] ${index === 0 ? "top-2" : "bottom-24"}`
              : `right-[-18px] md:right-[-26px] ${index === 1 ? "top-16" : "bottom-8"}`;
          return (
            <motion.span
              key={key}
              initial={
                prefersReducedMotion
                  ? undefined
                  : { opacity: 0, y: 8, scale: 0.96 }
              }
              animate={
                prefersReducedMotion ? undefined : { opacity: 1, y: 0, scale: 1 }
              }
              transition={
                prefersReducedMotion
                  ? undefined
                  : { delay: 0.45 + index * 0.14, duration: 0.5, ease: "easeOut" }
              }
              className={`absolute z-20 inline-flex items-center gap-1.5 rounded-full border bg-white px-3 py-1.5 text-[12px] font-semibold text-ink shadow-[0_10px_24px_-12px_rgba(29,29,29,0.35)] ${position} ${toneClass}`}
            >
              <Icon aria-hidden className="size-3.5 text-brand" />
              {label}
            </motion.span>
          );
        })}
      </div>

      {/* Honest disclosure — illustrative, never the user's result. */}
      <p className="mt-8 max-w-[340px] text-center text-[12px] leading-[1.5] text-dim lg:text-left">
        {preview.caption}
      </p>
    </Reveal>
  );
}

export default AtsLandingResumePreview;