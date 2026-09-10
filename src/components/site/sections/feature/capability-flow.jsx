"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import clsx from "clsx";
import { featurePage } from "@/lib/content";

const { flow } = featurePage.capabilities;

/* ------------------------------------------------------------------ */
/*  Icons                                                              */
/* ------------------------------------------------------------------ */

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

const icons = {
  /* board listings behind a magnifier — scanning portals for openings */
  discover: (
    <svg {...iconProps}>
      <rect x="3" y="3.5" width="13" height="10.5" rx="2" />
      <path d="M6.2 7h6.6M6.2 10.4h3.6" />
      <circle cx="15.6" cy="15.6" r="4.4" />
      <path d="M18.9 18.9L21.5 21.5" />
    </svg>
  ),
  /* person + plus — the connection request */
  connect: (
    <svg {...iconProps}>
      <circle cx="9.5" cy="8" r="3.5" />
      <path d="M3.5 20c0-3.3 2.7-5.5 6-5.5 1.3 0 2.4.3 3.4.9" />
      <path d="M17.5 14v6M20.5 17h-6" />
    </svg>
  ),
  /* chat bubble — the LinkedIn follow-up */
  message: (
    <svg {...iconProps}>
      <path d="M20.5 12.2c0 4-3.8 7.2-8.5 7.2-1 0-2-.15-2.9-.42L4 20.5l1.7-3.6A6.9 6.9 0 013.5 12.2C3.5 8.2 7.3 5 12 5s8.5 3.2 8.5 7.2z" />
      <path d="M8.8 11.4h6.4M8.8 14.2h3.8" />
    </svg>
  ),
  /* envelope with a rising send-path */
  mail: (
    <svg {...iconProps}>
      <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
      <path d="M3.8 7.2l7.1 5.1a2 2 0 002.2 0l7.1-5.1" />
    </svg>
  ),
  /* form on a career portal, signed off */
  apply: (
    <svg {...iconProps}>
      <path d="M15 3.5H7a2 2 0 00-2 2v13a2 2 0 002 2h10a2 2 0 002-2v-8" />
      <path d="M8.6 8.2h5.2M8.6 11.6h3.4" />
      <path d="M12.4 17l2 2 4.6-5.4" />
    </svg>
  ),
  /* the payoff */
  done: (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.3 12.3l2.6 2.6 4.8-5.6" />
    </svg>
  ),
};

function CheckMark({ className }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <path
        d="M6 12.4l4 4L18 7.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Connector                                                          */
/* ------------------------------------------------------------------ */

/* Connectors span the grid gap exactly: 30px across, 40px down — the row gap is
   the wider of the two so the vertical hand-off has room to read. */
const LINK_X = 30;
const LINK_Y = 40;
const DOT = 6;

const dots = (color, vertical) => ({
  backgroundImage: `radial-gradient(circle, ${color} 1.35px, transparent 1.5px)`,
  backgroundSize: vertical ? "3px 8px" : "8px 3px",
  backgroundRepeat: vertical ? "repeat-y" : "repeat-x",
});

/**
 * A dotted line that lives in the grid gap between two cards. The grey track is
 * always there; the blue run fills it from the sending card outwards, chased by
 * a travelling pulse, so the eye is handed from one step to the next.
 */
function Connector({
  dir,
  state,
  className,
}) {
  const vertical = dir === "down";
  const filled = state !== "pending";
  const len = vertical ? LINK_Y : LINK_X;

  /* the run always grows away from the card that owns this connector */
  const anchor = vertical
    ? { top: 0, left: "50%", marginLeft: -1.5, width: 3, backgroundPosition: "center top" }
    : {
        top: "50%",
        marginTop: -1.5,
        height: 3,
        [dir === "right" ? "left" : "right"]: 0,
        backgroundPosition: dir === "right" ? "left center" : "right center",
      };

  return (
    <span
      aria-hidden
      className={clsx(
        "pointer-events-none absolute",
        vertical && "left-1/2 top-full h-10 w-3 -translate-x-1/2",
        dir === "right" && "left-full top-1/2 h-3 w-[30px] -translate-y-1/2",
        dir === "left" && "right-full top-1/2 h-3 w-[30px] -translate-y-1/2",
        className,
      )}
    >
      {/* a soft white rail so the dots stay readable over the photo backdrop */}
      <span
        className="absolute rounded-full bg-white/65"
        style={
          vertical
            ? { left: "50%", marginLeft: -4, width: 8, top: 0, height: len }
            : { top: "50%", marginTop: -4, height: 8, left: 0, width: len }
        }
      />

      <span
        className="absolute"
        style={{
          ...anchor,
          ...(vertical ? { height: len } : { width: len }),
          ...dots("#9db1c5", vertical),
        }}
      />

      <motion.span
        className="absolute"
        style={{ ...anchor, ...dots("#406ae4", vertical) }}
        initial={false}
        animate={vertical ? { height: filled ? len : 0 } : { width: filled ? len : 0 }}
        transition={
          state === "running" ? { duration: 0.75, ease: "easeInOut" } : { duration: 0.25 }
        }
      />

      <AnimatePresence>
        {state === "running" && (
          <motion.span
            className="absolute rounded-full bg-brand"
            style={
              vertical
                ? { width: DOT, height: DOT, left: "50%", marginLeft: -DOT / 2, top: 0 }
                : { width: DOT, height: DOT, top: "50%", marginTop: -DOT / 2, left: 0 }
            }
            initial={{
              opacity: 0,
              ...(vertical ? { y: 0 } : { x: dir === "right" ? 0 : len - DOT }),
            }}
            animate={{
              opacity: [0, 1, 1, 0],
              ...(vertical
                ? { y: len - DOT }
                : { x: dir === "right" ? len - DOT : 0 }),
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.75, ease: "easeInOut" }}
          />
        )}
      </AnimatePresence>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Layout                                                             */
/* ------------------------------------------------------------------ */

/**
 * The six cards snake through the grid so the flow never has to jump a line:
 * three across then back at ≥1200px, two across then back at ≥810px, and a
 * single column below that. Each entry places its card and declares which
 * connector shape reaches the next one at each of those widths.
 */
const layout = [
  {
    place: "min-[810px]:col-start-1 min-[810px]:row-start-1 min-[1200px]:col-start-1 min-[1200px]:row-start-1",
    links: [
      { dir: "down", show: "min-[810px]:hidden" },
      { dir: "right", show: "hidden min-[810px]:block" },
    ],
  },
  {
    place: "min-[810px]:col-start-2 min-[810px]:row-start-1 min-[1200px]:col-start-2 min-[1200px]:row-start-1",
    links: [
      { dir: "down", show: "min-[1200px]:hidden" },
      { dir: "right", show: "hidden min-[1200px]:block" },
    ],
  },
  {
    place: "min-[810px]:col-start-2 min-[810px]:row-start-2 min-[1200px]:col-start-3 min-[1200px]:row-start-1",
    links: [
      { dir: "down", show: "min-[810px]:hidden min-[1200px]:block" },
      { dir: "left", show: "hidden min-[810px]:block min-[1200px]:hidden" },
    ],
  },
  {
    place: "min-[810px]:col-start-1 min-[810px]:row-start-2 min-[1200px]:col-start-3 min-[1200px]:row-start-2",
    links: [
      { dir: "down", show: "min-[1200px]:hidden" },
      { dir: "left", show: "hidden min-[1200px]:block" },
    ],
  },
  {
    place: "min-[810px]:col-start-1 min-[810px]:row-start-3 min-[1200px]:col-start-2 min-[1200px]:row-start-2",
    links: [
      { dir: "down", show: "min-[810px]:hidden" },
      { dir: "right", show: "hidden min-[810px]:block min-[1200px]:hidden" },
      { dir: "left", show: "hidden min-[1200px]:block" },
    ],
  },
  {
    place: "min-[810px]:col-start-2 min-[810px]:row-start-3 min-[1200px]:col-start-1 min-[1200px]:row-start-2",
    links: [],
  },
];

/* ------------------------------------------------------------------ */
/*  Sequence                                                           */
/* ------------------------------------------------------------------ */

/* Phases alternate card, connector, card … so an even phase lights step
   `phase / 2` and an odd phase runs the connector that follows it. */
const PHASES = flow.length * 2 - 1;
const CARD_MS = 620;
const LINK_MS = 820;
const HOLD_MS = 2600;

export function CapabilityFlow() {
  const ref = useRef(null);
  const visible = useInView(ref, { amount: 0.25 });
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    /* the run pauses off-screen and picks up where it left off */
    if (reduced || !visible) return;
    const last = phase === PHASES - 1;
    const ms = last ? HOLD_MS : phase % 2 === 0 ? CARD_MS : LINK_MS;
    const id = setTimeout(() => setPhase(last ? 0 : phase + 1), ms);
    return () => clearTimeout(id);
  }, [phase, visible, reduced]);

  /* with reduced motion the whole run is simply shown finished */
  const at = reduced ? PHASES - 1 : phase;

  return (
    <div
      ref={ref}
      className="grid w-full gap-x-[30px] gap-y-10 min-[810px]:grid-cols-2 min-[1200px]:grid-cols-3"
    >
      {flow.map((card, i) => {
        const state = at > i * 2 ? "done" : at === i * 2 ? "active" : "pending";
        const lit = state !== "pending";
        const finish = i === flow.length - 1;
        const linkState =
          at > i * 2 + 1 ? "done" : at === i * 2 + 1 ? "running" : "pending";

        return (
          <motion.div
            key={card.title}
            className={clsx(
              "relative rounded-[30px] p-[26px] min-[810px]:p-[30px]",
              layout[i].place,
              finish && lit && "bg-[linear-gradient(133deg,#406ae4_0%,#3b82f6_100%)]",
            )}
            initial={false}
            animate={{
              y: state === "active" ? -4 : 0,
              backgroundColor:
                finish && lit ? "rgba(64,106,228,0)" : lit ? "#ffffff" : "rgba(255,255,255,0.94)",
              boxShadow: lit
                ? "0px 16px 36px rgba(29,29,29,0.12)"
                : "0px 2px 10px rgba(29,29,29,0.04)",
            }}
            /* the card has to land solid as the pulse arrives, so this is a
               short tween rather than the slower entrance spring */
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {layout[i].links.map((link) => (
              <Connector
                key={link.dir}
                dir={link.dir}
                state={linkState}
                className={link.show}
              />
            ))}

            <div className="flex flex-col items-start gap-5">
              <div className="flex w-full items-start justify-between gap-3">
                <span className="relative grid size-[50px] shrink-0 place-items-center rounded-full bg-[linear-gradient(133deg,#406ae4_0%,#3b82f6_100%)]">
                  {/* the un-run state is a flat surface disc that peels away */}
                  <motion.span
                    className={clsx(
                      "absolute inset-0 rounded-full",
                      finish && lit ? "bg-white/15" : "bg-surface",
                    )}
                    initial={false}
                    animate={{ opacity: lit ? 0 : 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  {state === "active" && (
                    <motion.span
                      className="absolute inset-0 rounded-full ring-2 ring-brand/40"
                      initial={{ scale: 1, opacity: 0.7 }}
                      animate={{ scale: 1.45, opacity: 0 }}
                      transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
                    />
                  )}
                  <span
                    className={clsx(
                      "relative size-[26px] transition-colors duration-500",
                      lit ? "text-white" : "text-dim",
                    )}
                  >
                    {icons[card.icon]}
                  </span>
                </span>

                <span
                  className={clsx(
                    "grid h-[26px] min-w-[26px] place-items-center rounded-full px-2 text-[12px] leading-none font-semibold transition-colors duration-500",
                    finish && lit
                      ? "bg-white/20 text-white"
                      : state === "done"
                        ? "bg-brand/10 text-brand"
                        : "bg-surface text-dim",
                  )}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={state === "done" ? "check" : "num"}
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.6 }}
                      transition={{ duration: 0.2 }}
                      className="block"
                    >
                      {state === "done" ? (
                        <CheckMark className="size-3.5" />
                      ) : (
                        card.step
                      )}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                <h3
                  className={clsx(
                    "t-h5 transition-colors duration-300",
                    finish && lit ? "text-white" : !lit && "text-ink/85",
                  )}
                >
                  {card.title}
                </h3>
                <p
                  className={clsx(
                    "t-body transition-colors duration-300",
                    finish && lit ? "text-white/80" : !lit && "text-dim/85",
                  )}
                >
                  {card.description}
                </p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
