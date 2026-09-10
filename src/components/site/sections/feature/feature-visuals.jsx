"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import clsx from "clsx";
import { Mark } from "@/components/site/ui/Mark";
import { marks } from "@/lib/assets";

const outreachStatuses = [
  "Researching the role",
  "Tailoring LinkedIn message",
  "LinkedIn message sent",
  "Tailoring email",
  "Email sent from your inbox",
];

const resumeChanges = [
  {
    keyword: "REST APIs",
    prefix: "Built",
    before: "APIs",
    after: "scalable REST APIs",
    suffix: "for internal products",
  },
  {
    keyword: "AWS",
    prefix: "Deployed services using",
    before: "cloud tools",
    after: "AWS and Docker",
    suffix: "",
  },
  {
    keyword: "cross-functional",
    prefix: "",
    before: "Worked with",
    after: "Led cross-functional delivery with",
    suffix: "product and design",
  },
];

const resumeStatuses = [
  "Scanning your resume",
  "Reading the job description",
  "Finding keyword opportunities",
  "Updating resume language",
  "Updating resume language",
  "Updating resume language",
  "Resume tailored",
];

function useAnimatedPhase(length, delay) {
  const ref = useRef(null);
  const visible = useInView(ref, { amount: 0.35 });
  const reducedMotion = useReducedMotion();
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!visible || reducedMotion) return;

    const id = setTimeout(
      () => setPhase((current) => (current + 1) % length),
      phase === length - 1 ? delay * 1.8 : delay,
    );
    return () => clearTimeout(id);
  }, [delay, length, phase, reducedMotion, visible]);

  return { ref, phase: reducedMotion ? length - 1 : phase };
}

export function JobSearchWorkflowVisual() {
  const { ref, phase } = useAnimatedPhase(outreachStatuses.length, 1450);
  const linkedInReady = phase >= 1;
  const linkedInSent = phase >= 2;
  const emailReady = phase >= 3;
  const emailSent = phase >= 4;

  return (
    <div
      ref={ref}
      role="img"
      aria-label="HireDue tailoring a LinkedIn message and email to a hiring manager, then sending both from the user's connected accounts"
      className="relative w-full overflow-hidden rounded-[20px] border border-white bg-white p-4 shadow-[0_16px_50px_rgba(29,29,29,0.10)] min-[810px]:p-5"
    >
      <div className="pointer-events-none absolute -top-20 -right-16 size-52 rounded-full bg-brand/10 blur-3xl" />

      <div className="relative mb-4 flex items-center justify-between gap-3 border-b border-line pb-4">
        <div className="flex items-center gap-2.5">
          <span className="relative grid size-8 place-items-center rounded-full bg-brand text-white">
            <SparkIcon />
            <motion.span
              className="absolute inset-0 rounded-full ring-2 ring-brand/35"
              animate={{ scale: [1, 1.45], opacity: [0.7, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
            />
          </span>
          <div>
            <p className="text-[13px] leading-none font-semibold text-ink">
              Personal outreach agent
            </p>
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={outreachStatuses[phase]}
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                className="mt-1 text-[10px] leading-none font-semibold text-brand min-[810px]:text-[11px]"
              >
                {outreachStatuses[phase]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
        <span className="rounded-full bg-success-10 px-2.5 py-1.5 text-[10px] leading-none font-semibold text-success">
          IN YOUR VOICE
        </span>
      </div>

      <div className="mb-3 flex items-center gap-2 rounded-[12px] bg-surface px-3 py-2.5">
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-ink text-[9px] font-bold text-white">
          MC
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[11px] font-semibold text-ink min-[810px]:text-[12px]">
            Maya Chen · Hiring Manager
          </p>
          <p className="truncate text-[9px] font-medium text-dim min-[810px]:text-[10px]">
            Senior Product Designer at Northstar
          </p>
        </div>
        <motion.span
          animate={{ opacity: phase === 0 ? [0.45, 1, 0.45] : 1 }}
          transition={{ duration: 1.1, repeat: phase === 0 ? Infinity : 0 }}
          className="rounded-full bg-brand/10 px-2 py-1 text-[8px] font-bold text-brand"
        >
          PROFILE MATCHED
        </motion.span>
      </div>

      <div className="relative flex flex-col gap-2.5">
        <OutreachCard
          channel="LinkedIn"
          account="Your LinkedIn · Riley Shah"
          icon={marks.linkedin}
          color="#0a66c2"
          active={phase === 1}
          sent={linkedInSent}
          ready={linkedInReady}
        >
          Hi Maya — I loved Northstar&apos;s focus on{" "}
          <Personalized active={linkedInReady}>
            accessible design systems
          </Personalized>
          . I&apos;ve led similar work across 3 product teams and would love to
          connect.
        </OutreachCard>

        <OutreachCard
          channel="Email"
          account="From your inbox · riley@gmail.com"
          icon={marks.gmail}
          color="#ea4335"
          active={phase === 3}
          sent={emailSent}
          ready={emailReady}
          subject="Senior Product Designer — design systems experience"
        >
          Hi Maya, your opening calls for someone who can{" "}
          <Personalized active={emailReady}>
            scale accessible component libraries
          </Personalized>
          . At Acme, I increased design-to-dev velocity by 32% doing exactly
          that.
        </OutreachCard>
      </div>
    </div>
  );
}

function OutreachCard({
  channel,
  account,
  icon,
  color,
  active,
  sent,
  ready,
  subject,
  children,
}) {
  return (
    <motion.div
      animate={{
        borderColor: active ? color : sent ? "#8bbba4" : "#e5e9f2",
        boxShadow: active
          ? `0 10px 28px ${color}20`
          : "0 1px 0 rgba(29,29,29,0)",
        y: active ? -2 : 0,
      }}
      transition={{ duration: 0.35 }}
      className="rounded-[14px] border bg-white p-3"
    >
      <div className="mb-2.5 flex items-center gap-2 border-b border-line pb-2.5">
        <span className="grid size-7 shrink-0 place-items-center rounded-full bg-surface">
          <Mark src={icon} color={color} className="size-3.5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] leading-none font-bold text-ink min-[810px]:text-[11px]">
            {channel}
          </p>
          <p className="mt-1 truncate text-[8px] leading-none font-medium text-dim min-[810px]:text-[9px]">
            {account}
          </p>
        </div>
        <span
          className={clsx(
            "rounded-full px-2 py-1 text-[8px] font-bold",
            sent
              ? "bg-success-10 text-success"
              : active
                ? "bg-brand/10 text-brand"
                : "bg-surface text-dim",
          )}
        >
          {sent ? "SENT" : active ? "CUSTOMIZING…" : "QUEUED"}
        </span>
      </div>

      {subject && (
        <p className="mb-1.5 truncate text-[8px] font-semibold text-ink min-[810px]:text-[9px]">
          <span className="text-dim">Subject: </span>
          {subject}
        </p>
      )}
      <motion.p
        animate={{ opacity: ready ? 1 : 0.38 }}
        transition={{ duration: 0.45 }}
        className="text-[9px] leading-[1.55] font-medium text-dim min-[810px]:text-[10px]"
      >
        {children}
      </motion.p>
    </motion.div>
  );
}

function Personalized({ active, children }) {
  return (
    <motion.span
      animate={{
        backgroundColor: active
          ? "rgba(64,106,228,0.12)"
          : "rgba(64,106,228,0)",
        color: active ? "#406ae4" : "#4d585f",
      }}
      transition={{ duration: 0.4 }}
      className="rounded px-0.5 font-semibold"
    >
      {children}
    </motion.span>
  );
}

export function ResumeTailoringVisual() {
  const { ref, phase } = useAnimatedPhase(resumeStatuses.length, 1350);
  const scores = [68, 68, 68, 78, 87, 94, 96];

  return (
    <div
      ref={ref}
      role="img"
      aria-label="HireDue scanning a resume, reading a job description, identifying missing keywords, and tailoring the resume"
      className="relative w-full overflow-hidden rounded-[20px] border border-white bg-white p-4 shadow-[0_16px_50px_rgba(29,29,29,0.10)] min-[810px]:p-5"
    >
      <div className="mb-3 flex items-center justify-between gap-3 border-b border-line pb-3">
        <div className="flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-full bg-[linear-gradient(135deg,#406ae4,#3b82f6)] text-white">
            <DocumentIcon />
          </span>
          <div>
            <p className="text-[13px] leading-none font-semibold text-ink">
              Resume tailor
            </p>
            <motion.p
              animate={{ opacity: 1, y: 0 }}
              className={clsx(
                "mt-1 text-[10px] leading-none font-semibold",
                phase === resumeStatuses.length - 1
                  ? "text-success"
                  : "text-brand",
              )}
            >
              {resumeStatuses[phase]}
            </motion.p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[9px] leading-none font-semibold tracking-[0.08em] text-dim uppercase">
            Match
          </p>
          <motion.p
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 text-[16px] leading-none font-bold text-brand"
          >
            {scores[phase]}%
          </motion.p>
        </div>
      </div>

      <div className="mb-3 grid grid-cols-[1fr_18px_1fr] items-stretch gap-1.5">
        <div
          className={clsx(
            "relative min-h-[122px] overflow-hidden rounded-[12px] border bg-white p-2.5 transition-colors duration-300",
            phase === 0 ? "border-brand/40" : "border-line",
          )}
        >
          <div className="mb-2 flex items-center gap-1.5 border-b border-line pb-2">
            <span className="grid size-5 place-items-center rounded-full bg-ink text-[6px] font-bold text-white">
              RS
            </span>
            <div>
              <p className="text-[7px] leading-none font-bold text-ink">
                Riley Shah
              </p>
              <p className="mt-1 text-[6px] leading-none text-dim">
                Backend Engineer
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="h-1.5 w-11/12 rounded-full bg-line" />
            <span className="h-1.5 w-4/5 rounded-full bg-line" />
            <span className="h-1.5 w-full rounded-full bg-line" />
            <span className="h-1.5 w-3/4 rounded-full bg-line" />
            <span className="h-1.5 w-5/6 rounded-full bg-line" />
          </div>

          {phase === 0 && (
            <motion.span
              className="absolute inset-x-1.5 top-8 h-5 border-y border-brand/30 bg-[linear-gradient(180deg,rgba(64,106,228,0),rgba(64,106,228,0.18),rgba(64,106,228,0))]"
              animate={{ y: [0, 68, 0] }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )}

          <span className="absolute right-2 bottom-2 text-[6px] font-bold tracking-[0.08em] text-dim uppercase">
            Your resume
          </span>
        </div>

        <div className="flex items-center justify-center">
          <motion.span
            animate={{
              x: phase >= 2 ? [0, 2, 0] : 0,
              opacity: phase >= 2 ? 1 : 0.3,
            }}
            transition={{
              duration: 0.8,
              repeat: phase >= 2 ? Infinity : 0,
            }}
            className="text-[15px] font-semibold text-brand"
          >
            ↔
          </motion.span>
        </div>

        <div
          className={clsx(
            "relative min-h-[122px] overflow-hidden rounded-[12px] border bg-surface p-2.5 transition-colors duration-300",
            phase === 1 || phase === 2 ? "border-brand/40" : "border-line",
          )}
        >
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[7px] leading-none font-bold text-ink">
              Backend Engineer
            </p>
            <span className="rounded-full bg-white px-1.5 py-1 text-[6px] font-bold text-dim">
              JD
            </span>
          </div>
          <div className="mb-2 flex flex-col gap-1.5">
            <span className="h-1.5 w-full rounded-full bg-white" />
            <span className="h-1.5 w-5/6 rounded-full bg-white" />
            <span className="h-1.5 w-11/12 rounded-full bg-white" />
          </div>
          <div className="flex flex-wrap gap-1">
            {resumeChanges.map((change, index) => (
              <motion.span
                key={change.keyword}
                animate={{
                  backgroundColor: phase >= 2 ? "#406ae4" : "#ffffff",
                  color: phase >= 2 ? "#ffffff" : "#4d585f",
                  scale: phase === 2 ? [1, 1.08, 1] : 1,
                }}
                transition={{
                  duration: 0.35,
                  delay: phase >= 2 ? index * 0.15 : 0,
                }}
                className="rounded-full px-1.5 py-1 text-[6px] font-semibold shadow-sm"
              >
                {change.keyword}
              </motion.span>
            ))}
          </div>

          {phase === 1 && (
            <motion.span
              className="absolute inset-x-1.5 top-6 h-5 border-y border-brand/30 bg-[linear-gradient(180deg,rgba(64,106,228,0),rgba(64,106,228,0.16),rgba(64,106,228,0))]"
              animate={{ y: [0, 68, 0] }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )}

          <span className="absolute right-2 bottom-2 text-[6px] font-bold tracking-[0.08em] text-dim uppercase">
            Job description
          </span>
        </div>
      </div>

      <div className="rounded-[14px] border border-line p-3">
        <div className="mb-2.5 flex items-center justify-between">
          <p className="text-[8px] font-semibold tracking-[0.08em] text-dim uppercase">
            Resume changes
          </p>
          <div className="flex gap-1">
            {resumeChanges.map((change, index) => (
              <span
                key={change.keyword}
                className={clsx(
                  "h-1 w-3 rounded-full transition-colors duration-300",
                  phase >= index + 3 ? "bg-success" : "bg-line",
                )}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {resumeChanges.map((change, index) => {
            const changed = phase >= index + 3;
            const active = phase === index + 3;

            return (
              <motion.div
                key={change.keyword}
                animate={{
                  backgroundColor: active
                    ? "rgba(64,106,228,0.07)"
                    : "rgba(255,255,255,0)",
                  x: active ? [0, 2, 0] : 0,
                }}
                className="flex min-h-[31px] items-center gap-2 rounded-[8px] px-2 py-1.5"
              >
                <span
                  className={clsx(
                    "size-1.5 shrink-0 rounded-full",
                    changed ? "bg-success" : active ? "bg-brand" : "bg-line",
                  )}
                />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[7px] leading-[1.4] font-medium text-dim min-[810px]:text-[8px]">
                    {change.prefix && `${change.prefix} `}
                    <motion.span
                      animate={
                        active
                          ? { scale: [1, 0.92, 1], opacity: [1, 0.65, 1] }
                          : { scale: 1, opacity: 1 }
                      }
                      transition={{ duration: 0.4 }}
                      className={clsx(
                        "inline-block rounded px-1 py-0.5 font-semibold",
                        changed
                          ? "bg-success-10 text-success"
                          : active
                            ? "bg-brand/10 text-brand"
                            : "bg-surface text-dim",
                      )}
                    >
                      {changed ? change.after : change.before}
                    </motion.span>
                    {change.suffix && ` ${change.suffix}`}
                  </div>
                </div>
                <span className="w-10 text-right text-[6px] font-bold text-brand">
                  {changed ? "✓ DONE" : active ? "REPLACE" : ""}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SparkIcon() {
  return (
    <Icon
      path={
        <>
          <path d="m12 3 1.4 4.4L18 9l-4.6 1.6L12 15l-1.4-4.4L6 9l4.6-1.6L12 3Z" />
          <path d="m18.5 15 .7 2.1 2.1.7-2.1.7-.7 2.1-.7-2.1-2.1-.7 2.1-.7.7-2.1Z" />
        </>
      }
    />
  );
}

function DocumentIcon() {
  return (
    <Icon
      path={
        <>
          <path d="M7 3h7l4 4v14H7V3Z" />
          <path d="M14 3v5h4M10 12h5M10 16h5" />
        </>
      }
    />
  );
}

function Icon({ path }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="size-[18px]"
    >
      {path}
    </svg>
  );
}
