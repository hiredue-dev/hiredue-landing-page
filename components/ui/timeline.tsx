"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

const BASE_Y = 100;
const AMP = 60;

const START_PAD = 20;
const END_PAD = 20;

export function Timeline({ data }: { data: TimelineEntry[] }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);

  const segments = data.length + 1;
  const offset = 100;
  const SVG_WIDTH = 1200;
  const EFFECTIVE_WIDTH = SVG_WIDTH - START_PAD - END_PAD;

  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
  }, []);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start 60%", "end 25%"],
  });

  const dashOffset = useTransform(scrollYProgress, [0, 0.36], [pathLength, 0]);

  const timelineProgress = useTransform(scrollYProgress, [0, 0.36], [0, 1], {
    clamp: true,
  });

  const wavePath = useMemo(() => {
    const segmentWidth = EFFECTIVE_WIDTH / segments;
    let d = `M ${START_PAD} ${BASE_Y}`;

    for (let i = 1; i <= segments; i++) {
      const x = START_PAD + segmentWidth * i;
      const cx = x - segmentWidth / 2;
      const cy = BASE_Y + (i % 2 === 0 ? AMP : -AMP);
      d += ` Q ${cx} ${cy} ${x} ${BASE_Y}`;
    }

    return d;
  }, [segments]);

  return (
    <section
      ref={wrapperRef}
      className="relative w-full py-40 overflow-visible bg-transparent"
    >
      <div className="relative w-full max-w-7xl mx-auto overflow-visible bg-transparent">
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

          {/* Start dot */}
          <motion.circle
            cx={START_PAD}
            cy={BASE_Y}
            r="3"
            fill="var(--brand-foreground)"
            style={{
              opacity: useTransform(timelineProgress, [0, 0.1], [0.2, 1]),
              scale: useTransform(timelineProgress, [0, 0.1], [0.6, 1.4]),
              filter: "drop-shadow(0 0 6px white)",
            }}
          />

          {/* Middle dots — ON CRESTS / TROUGHS */}
          {Array.from({ length: data.length }).map((_, i) => {
            const segmentWidth = EFFECTIVE_WIDTH / segments;
            const cx = START_PAD + segmentWidth * (i + 0.50);
            const cy = BASE_Y + (i % 2 === 0 ? -AMP + offset/3.5 : AMP - offset/3.5);

            const progressStart = i / segments;
            const progressEnd = (i + 1) / segments;

            return (
              <motion.circle
                key={i}
                cx={cx}
                cy={cy}
                r="3"
                fill="var(--brand-foreground)"
                style={{
                  opacity: useTransform(
                    timelineProgress,
                    [progressStart, progressEnd],
                    [0.2, 1]
                  ),
                  scale: useTransform(
                    timelineProgress,
                    [progressStart, progressEnd],
                    [0.6, 1.4]
                  ),
                  filter: "drop-shadow(0 0 6px white)",
                }}
              />
            );
          })}

          {/* End dot */}
          <motion.circle
            cx={START_PAD + EFFECTIVE_WIDTH}
            cy={BASE_Y}
            r="3"
            fill="var(--brand-foreground)"
            style={{
              opacity: useTransform(timelineProgress, [0.9, 1], [0.2, 1]),
              scale: useTransform(timelineProgress, [0.9, 1], [0.6, 1.4]),
              filter: "drop-shadow(0 0 6px white)",
            }}
          />

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
            const segmentWidth = EFFECTIVE_WIDTH / segments;
            const x = START_PAD + segmentWidth * (i + 1);

            const y =
              BASE_Y + ((i + 1) % 2 === 0 ? AMP + offset : -AMP - offset);

            const progressStart = i / segments;
            const progressEnd = (i + 1) / segments;

            return (
              <motion.div
                key={i}
                style={{
                  left: `${(x / (SVG_WIDTH)) * 107}%`,
                  top: `${(y / 200) * 100}%`,
                  opacity: useTransform(
                    timelineProgress,
                    [progressStart, progressEnd],
                    [0.25, 1]
                  ),
                  scale: useTransform(
                    timelineProgress,
                    [progressStart, progressEnd],
                    [0.94, 1]
                  ),
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 w-[265px]"
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
