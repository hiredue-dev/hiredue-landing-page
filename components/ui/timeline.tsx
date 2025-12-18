"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { off } from "process";
import { useEffect, useMemo, useRef, useState } from "react";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

const BASE_Y = 100;
const AMP = 60;

export function Timeline({ data }: { data: TimelineEntry[] }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);

  const segments = data.length + 1;
  const offset = 100;
  /* Measure path */
  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
  }, []);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start 75%", "end 25%"],
  });

  const dashOffset = useTransform(scrollYProgress, [0, 0.6], [pathLength, 0]);
  const timelineProgress = useTransform(scrollYProgress, [0, 0.6], [0, 1], {
    clamp: true,
  });

  const wavePath = useMemo(() => {
    const segmentWidth = 1200 / segments;
    let d = `M 0 ${BASE_Y}`;

    for (let i = 1; i <= segments; i++) {
      const x = segmentWidth * i;
      const cx = x - segmentWidth / 2;
      const cy = BASE_Y + (i % 2 === 0 ? AMP : -AMP);

      d += ` Q ${cx} ${cy} ${x} ${BASE_Y}`;
    }

    return d;
  }, [segments]);

  return (
    <section
      ref={wrapperRef}
      className="relative w-full py-40 overflow-visible"
    >
      <div className="relative w-full max-w-7xl mx-auto overflow-visible">
        {/* SVG */}
        <svg viewBox="0 0 1200 200" className="w-full h-[220px]">
          <path
            d={wavePath}
            stroke="rgba(148,163,184,0.25)"
            strokeWidth="3"
            fill="none"
          />
          <motion.path
            ref={pathRef}
            d={wavePath}
            stroke="url(#gradient)"
            strokeWidth="3"
            fill="none"
            strokeDasharray={pathLength}
            style={{ strokeDashoffset: dashOffset }}
          /> 
          {Array.from({ length: segments }).map((_, i) => {
            const progressStart = i / segments;
            const progressEnd = (i + 1) / segments;

            const glowOpacity = useTransform(
              timelineProgress,
              [progressStart, progressEnd],
              [0.2, 1]
            );

            const glowScale = useTransform(
              timelineProgress,
              [progressStart, progressEnd],
              [0.6, 1.4]
            );

            const cx = (1200 / segments) * (i + 0.5);
            const cy = BASE_Y + (i % 2 === 0 ? -AMP + offset/3.5 : AMP - offset/3.5);

            return (
              <motion.circle
                key={i}
                cx={cx}
                cy={cy}
                r="3"
                fill="var(--brand-foreground)"
                style={{
                  opacity: glowOpacity,
                  scale: glowScale,
                  filter: "drop-shadow(0 0 6px white)",
                }}
              />
            );
          })}
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--brand-foreground)" />
              <stop offset="50%" stopColor="var(--brand-foreground)" />
              <stop offset="100%" stopColor="var(--brand)" />
            </linearGradient>
          </defs>
        </svg>

        {/* Cards */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {data.map((item, i) => {
            const progressStart = i / segments;
            const progressEnd = (i + 1) / segments;

            const opacity = useTransform(
              timelineProgress,
              [progressStart, progressEnd],
              [0.25, 1]
            );

            const scale = useTransform(
              timelineProgress,
              [progressStart, progressEnd],
              [0.94, 1]
            );

            const xPercent = ((i + 1) / segments) * 100;
            const y =
              BASE_Y + ((i + 1) % 2 === 0 ? AMP + offset : -AMP - offset);

            return (
              <motion.div
                key={i}
                style={{
                  left: `${xPercent}%`,
                  top: `${(y / 200) * 100}%`,
                  opacity,
                  scale,
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 w-[260px]"
              >
                {item.content}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
