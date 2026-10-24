"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import clsx from "clsx";
import { spring } from "@/lib/motion";
import { formatCount, formatEvery } from "@/features/today/todayStats";
import { FIREFLIES, STARS, skyScene } from "@/features/today/sky";
import { Odometer } from "./Odometer";

/*
 * Today's count against the sky at that hour in India: stars and a moon at
 * night, the sun crossing by day, a house whose window lights up in the
 * evening. Every layer is decoration (aria-hidden); the label, the count and
 * the day bar carry the meaning.
 */
export function TodaySky({ hour, value, everySeconds, clock, gain }) {
  const reduce = useReducedMotion();
  const scene = skyScene(hour);
  const progress = `${((hour / 24) * 100).toFixed(2)}%`;

  return (
    <section
      aria-label="Applications sent today"
      className="relative flex min-h-[340px] flex-col justify-between gap-7 overflow-hidden rounded-[28px] p-6 text-white shadow-[0_20px_50px_rgba(20,28,70,0.22)] min-[810px]:p-10"
      style={{ background: scene.background }}
    >
      {/* Stars and a shooting star, out at night */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity duration-[1200ms]"
        style={{ opacity: scene.night }}
      >
        {STARS.map((s, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white motion-safe:animate-[today-twinkle_3s_ease-in-out_infinite]"
            style={{ left: s.x, top: s.y, width: s.size, height: s.size, animationDelay: s.delay }}
          />
        ))}
        <span className="absolute top-[10%] right-[12%] h-0.5 w-[90px] rounded-full bg-[linear-gradient(90deg,rgba(255,255,255,0.9),rgba(255,255,255,0))] opacity-0 motion-safe:animate-[today-shoot_9s_ease-out_infinite]" />
      </div>

      {/* Sun */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -mt-8 -ml-8 size-16 rounded-full"
        style={{
          left: scene.sun.x,
          top: scene.sun.y,
          background: scene.sun.color,
          boxShadow: `0 0 40px 14px ${scene.sun.color}aa, 0 0 120px 50px ${scene.sun.color}33`,
          opacity: scene.sun.opacity,
        }}
      />
      {/* Moon: a crescent cut from an inset shadow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -mt-[23px] -ml-[23px] size-[46px] -rotate-[20deg] rounded-full shadow-[inset_12px_-8px_0_0_#f3efe2] drop-shadow-[0_0_14px_rgba(243,239,226,0.55)]"
        style={{ left: scene.moon.x, top: scene.moon.y, opacity: scene.moon.opacity }}
      />

      {/* Clouds */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[12%] right-[6%] h-[30%] w-[46%]"
        style={{ opacity: scene.cloudOpacity }}
      >
        <svg
          viewBox="0 0 200 70"
          className="absolute top-0 left-[8%] h-[60px] w-[170px] motion-safe:animate-[today-cloud_22s_ease-in-out_infinite]"
        >
          <g fill={scene.cloudTint}>
            <ellipse cx="60" cy="48" rx="50" ry="18" />
            <circle cx="78" cy="34" r="24" />
            <circle cx="112" cy="40" r="20" />
            <ellipse cx="128" cy="50" rx="44" ry="15" />
          </g>
        </svg>
        <svg
          viewBox="0 0 200 70"
          className="absolute top-[46%] right-0 h-[42px] w-[120px] opacity-80 motion-safe:animate-[today-cloud_22s_ease-in-out_infinite]"
          style={{ animationDelay: "-9s" }}
        >
          <g fill={scene.cloudTint}>
            <ellipse cx="70" cy="48" rx="56" ry="16" />
            <circle cx="92" cy="34" r="22" />
            <circle cx="124" cy="42" r="16" />
          </g>
        </svg>
      </div>

      {/* Hills */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1200 160"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[150px] w-full"
      >
        <path d="M0 72 C 180 26, 380 96, 600 52 S 1000 14, 1200 58 V160 H0 Z" fill={scene.hillFar} />
        <path d="M0 122 C 240 84, 460 134, 720 104 S 1060 70, 1200 92 V160 H0 Z" fill={scene.hillNear} />
      </svg>

      {/* House, with chimney smoke and a window that glows after dark */}
      <div aria-hidden="true" className="pointer-events-none absolute right-[9%] bottom-[62px] h-[84px] w-[92px]">
        {/* The flicker animates opacity, so the time-of-day opacity sits on a wrapper. */}
        <div className="absolute top-[26px] left-[18px] size-[60px]" style={{ opacity: scene.windowOpacity }}>
          <div className="size-full rounded-full bg-[radial-gradient(circle,rgba(255,196,110,0.75)_0%,rgba(255,170,90,0)_70%)] motion-safe:animate-[today-flicker_3.4s_ease-in-out_infinite]" />
        </div>
        {[0, -1.5, -3].map((delay) => (
          <span
            key={delay}
            className="absolute -top-0.5 left-[62px] size-2.5 rounded-full opacity-0 motion-safe:animate-[today-smoke_4.5s_ease-out_infinite]"
            style={{ background: scene.smoke, animationDelay: `${delay}s` }}
          />
        ))}
        <svg viewBox="0 0 92 84" className="absolute inset-0 h-[84px] w-[92px]">
          <rect x="60" y="8" width="12" height="24" fill={scene.house} />
          <path d="M6 44 L46 12 L86 44 Z" fill={scene.roof} />
          <rect x="14" y="42" width="64" height="42" fill={scene.house} />
          <g style={{ opacity: scene.windowOpacity }}>
            <rect
              x="24"
              y="52"
              width="16"
              height="14"
              rx="2"
              fill="#ffcf7a"
              className="motion-safe:animate-[today-flicker_3.4s_ease-in-out_infinite]"
            />
          </g>
          <rect x="24" y="52" width="16" height="14" rx="2" fill="none" stroke={scene.roof} strokeWidth="2" />
          <path d="M32 52 V66 M24 59 H40" stroke={scene.roof} strokeWidth="2" />
          <rect x="52" y="58" width="14" height="26" rx="2" fill={scene.roof} />
        </svg>
      </div>

      {/* Fireflies, out at night */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ opacity: scene.night * 0.9 }}>
        {FIREFLIES.map((f, i) => (
          <span
            key={i}
            className="absolute size-1 rounded-full bg-[#ffe08a] shadow-[0_0_8px_3px_rgba(255,214,120,0.7)] motion-safe:animate-[today-fly_4s_ease-in-out_infinite]"
            style={{ left: f.x, bottom: f.y, animationDelay: f.delay }}
          />
        ))}
      </div>

      {/* Darkens the foot of the card so the day bar's labels read on any sky */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-[linear-gradient(to_top,rgba(10,8,24,0.32),rgba(10,8,24,0))]"
      />

      <div className="relative flex flex-wrap items-center justify-between gap-2.5">
        <span className="text-[14px] font-semibold tracking-[0.4px] uppercase [text-shadow:0_1px_3px_rgba(0,0,0,0.35)]">
          Applications sent today
        </span>
        {everySeconds != null && (
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-3 py-1.5 text-[13px] font-semibold backdrop-blur-md">
            {scene.phase} · 1 every {formatEvery(everySeconds)}
          </span>
        )}
      </div>

      <div className="relative inline-flex items-start self-start">
        {/* A drop-shadow filter, not text-shadow: each odometer column clips, which would cut a text-shadow into boxes. */}
        <span className="font-display inline-flex text-[76px] leading-none font-bold tracking-[-3px] [filter:drop-shadow(0_4px_24px_rgba(0,0,0,0.25))] min-[810px]:text-[104px] min-[1200px]:text-[128px]">
          {value == null ? "—" : <Odometer value={value} />}
        </span>
        <AnimatePresence>
          {gain && !reduce && (
            <motion.span
              key={gain.id}
              aria-hidden="true"
              className="font-display absolute -top-1 -right-2 translate-x-full text-[26px] font-bold"
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: [0, 1, 1, 0], y: [10, 0, -18, -36], scale: [0.8, 1, 1, 1] }}
              transition={{ duration: 1.1, ease: "easeOut" }}
            >
              +{formatCount(gain.delta)}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <div className="relative flex flex-col gap-2">
        <div className="relative h-2 rounded-full bg-white/[0.22]">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full bg-white"
            initial={{ width: reduce ? progress : "0%" }}
            animate={{ width: progress }}
            transition={spring(1.4, 0.2)}
          />
          <motion.div
            aria-hidden="true"
            className={clsx(
              "absolute top-1/2 -mt-2 -ml-2 size-4 rounded-full bg-white",
              "motion-safe:animate-[today-now_1.6s_ease-out_infinite]",
            )}
            initial={{ left: reduce ? progress : "0%" }}
            animate={{ left: progress }}
            transition={spring(1.4, 0.2)}
          />
        </div>
        <div className="flex justify-between text-[13px] font-medium [text-shadow:0_1px_3px_rgba(0,0,0,0.35)]">
          <span>12 AM</span>
          <span>Now · {clock}</span>
          <span>Midnight</span>
        </div>
      </div>
    </section>
  );
}
