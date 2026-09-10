"use client";

import Image from "next/image";
import { motion } from "framer-motion";

/**
 * One of the drifting clouds that sit over the sky photo in a hero.
 * Positions come from the original's 1440-wide stage, so callers place these
 * inside a `w-[1440px]` relative box rather than positioning them themselves.
 */
export function Cloud({
  src,
  w,
  h,
  top,
  left,
  delay,
}) {
  return (
    <motion.div
      initial={{ opacity: 0.001 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, delay: delay * 0.15 }}
      className="absolute"
      style={{ top, left, width: w, height: h }}
    >
      <motion.div
        animate={{ x: [0, 24, 0] }}
        transition={{ duration: 26 + delay * 3, repeat: Infinity, ease: "easeInOut", delay }}
        className="size-full"
      >
        <Image src={src} alt="" width={w} height={h} className="size-full object-contain" />
      </motion.div>
    </motion.div>
  );
}

/** The three-cloud stage shared by the home and feature heroes. */
export function CloudStage({
  cloud01,
  cloud02,
  cloud03,
}) {
  return (
    <div className="pointer-events-none absolute inset-0 -z-[9] hidden justify-center min-[810px]:flex">
      <div className="relative h-full w-[1440px]">
        <Cloud src={cloud01} w={602} h={350} top={-40} left={-130} delay={0} />
        <Cloud src={cloud02} w={519} h={240} top={50} left={460} delay={1.2} />
        <Cloud src={cloud03} w={584} h={350} top={80} left={916} delay={2.4} />
      </div>
    </div>
  );
}
