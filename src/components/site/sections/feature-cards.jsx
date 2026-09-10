"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { Mark } from "@/components/site/ui/Mark";
import { marks } from "@/lib/assets";
import { features } from "@/lib/content";
import { spring } from "@/lib/motion";

/* ------------------------------------------------------------------ */

/* Wires are drawn in a 300×150 viewBox stretched to the card, so a source's
   `x` percentage and its viewBox coordinate stay in step at any width. */
const GRAPH_W = 300;
const GRAPH_H = 164;
const HUB_X = GRAPH_W / 2;

const sources = [
  { name: "LinkedIn", icon: marks.linkedin, color: "#0a66c2", x: 9, y: 22 },
  { name: "Indeed", icon: marks.indeed, color: "#003a9b", x: 29.5, y: 6 },
  { name: "naukri", x: 50, y: 0 },
  { name: "Monster", icon: marks.monster, color: "#6d4c9f", x: 70.5, y: 6 },
  { name: "Handshake", icon: marks.handshake, color: "#1d1d1d", x: 91, y: 22 },
];

/** One role per source, cycled in the same order as the chips above. */
const feed = [
  { title: "Senior Frontend Engineer", meta: "Bengaluru · 2m ago", match: 96 },
  { title: "Data Analyst", meta: "Remote · just now", match: 91 },
  { title: "Product Designer", meta: "Pune · 4m ago", match: 94 },
  { title: "Marketing Associate", meta: "Mumbai · 6m ago", match: 89 },
  { title: "Backend Engineer", meta: "Hyderabad · 3m ago", match: 93 },
];

/* Each wire drops from its chip and plugs into the feed below, spaced so the
   bundle stays legible instead of pinching into a single point. */
const wire = (x, y, i) => {
  const sx = (x / 100) * GRAPH_W;
  const sy = y + 34;
  const ex = HUB_X + (i - 2) * 22;
  return `M${sx} ${sy}C${sx} ${sy + 54} ${ex} ${GRAPH_H - 54} ${ex} ${GRAPH_H}`;
};

/** Job boards wired into one feed: each wire carries a pulse down to the
    result row, and the source that surfaced the role on screen lights up. */
export function SourceGraph() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((v) => (v + 1) % sources.length), 2400);
    return () => clearInterval(id);
  }, []);

  const job = feed[active];

  return (
    <div className="flex flex-col">
      <div className="relative h-[164px]">
        <svg
          viewBox={`0 0 ${GRAPH_W} ${GRAPH_H}`}
          preserveAspectRatio="none"
          aria-hidden
          className="absolute inset-0 size-full"
        >
          {sources.map((s, i) => {
            const d = wire(s.x, s.y, i);
            return (
              <g key={s.name}>
                <path
                  d={d}
                  fill="none"
                  stroke="#cdd8e3"
                  strokeWidth={1.5}
                  vectorEffect="non-scaling-stroke"
                />
                <motion.path
                  d={d}
                  fill="none"
                  stroke="#406ae4"
                  strokeWidth={2}
                  strokeLinecap="round"
                  pathLength={100}
                  strokeDasharray="9 91"
                  vectorEffect="non-scaling-stroke"
                  animate={{ strokeDashoffset: [100, 0] }}
                  transition={{ duration: 2.4, delay: i * 0.45, repeat: Infinity, ease: "linear" }}
                />
              </g>
            );
          })}
        </svg>

        {sources.map((s, i) => (
          <motion.div
            key={s.name}
            style={{ left: `${s.x}%`, top: s.y, x: "-50%" }}
            animate={{ scale: active === i ? 1.1 : 1 }}
            transition={spring(0.5)}
            className="absolute"
          >
            <span
              className={clsx(
                "flex h-8 items-center justify-center rounded-full bg-white transition-shadow duration-500",
                s.icon ? "w-8" : "px-3",
                active === i
                  ? "shadow-[0_0_0_3px_rgba(64,106,228,0.16),0_4px_12px_rgba(29,29,29,0.1)]"
                  : "shadow-[0_2px_6px_rgba(29,29,29,0.06)]",
              )}
            >
              {s.icon ? (
                <Mark src={s.icon} color={s.color} className="size-[17px]" />
              ) : (
                <span className="text-[12px] leading-none font-semibold text-ink">{s.name}</span>
              )}
            </span>
          </motion.div>
        ))}
      </div>

      {/* the feed every wire lands in */}
      <div className="flex h-[58px] items-center rounded-[14px] bg-white px-3.5 shadow-[0_4px_16px_rgba(29,29,29,0.07)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={job.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={spring(0.4)}
            className="flex min-w-0 flex-1 items-center gap-3"
          >
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[14px] leading-[1.2] font-semibold text-ink">
                {job.title}
              </span>
              <span className="mt-0.5 block truncate text-[12px] leading-[1.2] font-medium text-dim">
                via {sources[active].name} · {job.meta}
              </span>
            </span>
            <span className="shrink-0 rounded-full bg-success-10 px-2 py-1 text-[12px] leading-none font-semibold text-success">
              {job.match}%
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      <p className="mt-3.5 text-center text-[13px] leading-[1.3] font-medium text-dim">
        {features.findJobs.footnote}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */

/* Resume optimization — a scan runs down the page, each line settles into its
   optimized state just behind it, and the ATS score climbs on every pass. */
const SCAN = 3.6;
const SWEEP = 2.4;

const resumeBlocks = [
  { heading: 42, lines: [96, 88] },
  { heading: 34, lines: [92, 100, 74] },
  { heading: 46, lines: [86, 96] },
  { heading: 38, lines: [94, 78] },
];

export function ResumeSheet() {
  const [t, setT] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setT((v) => (v + 1) % 36), (SCAN * 1000) / 36);
    return () => clearInterval(id);
  }, []);

  const score = t < 8 ? 71 : t < 24 ? 71 + Math.round(((t - 8) / 16) * 23) : 94;
  let line = 0;

  return (
    <div className="relative">
      <div className="relative h-[236px] w-[188px] overflow-hidden rounded-[10px] bg-white p-3.5 shadow-[0_10px_30px_rgba(29,29,29,0.12)]">
        <div className="flex items-center gap-2">
          <span className="size-[22px] shrink-0 rounded-full bg-surface" />
          <span className="flex flex-1 flex-col gap-1">
            <span className="block h-[5px] w-[64%] rounded-full bg-ink/70" />
            <span className="block h-[4px] w-[44%] rounded-full bg-line" />
          </span>
        </div>
        <span className="my-3 block h-px w-full bg-line" />

        <div className="flex flex-col gap-[12px]">
          {resumeBlocks.map((block) => (
            <div key={block.heading} className="flex flex-col gap-[5px]">
              <span
                className="block h-[5px] rounded-full bg-ink/45"
                style={{ width: `${block.heading}%` }}
              />
              {block.lines.map((w) => {
                const delay = (line++ / 9) * 1.5;
                return (
                  <motion.span
                    key={`${block.heading}-${w}`}
                    className="block h-[4px] rounded-full"
                    style={{ width: `${w}%` }}
                    animate={{ backgroundColor: ["#e4eaf0", "#bcd0f7", "#bcd0f7", "#e4eaf0"] }}
                    transition={{
                      duration: SCAN,
                      times: [0, 0.18, 0.86, 1],
                      delay,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>

        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[52px] bg-[linear-gradient(rgba(64,106,228,0)_0%,rgba(64,106,228,0.16)_50%,rgba(64,106,228,0)_100%)]"
          animate={{ y: [-52, 236] }}
          transition={{ duration: SWEEP, repeat: Infinity, repeatDelay: SCAN - SWEEP, ease: "easeInOut" }}
        />
      </div>

      <div className="absolute -top-3 -right-5 flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1.5 shadow-[0_6px_18px_rgba(29,29,29,0.14)]">
        <span className="size-1.5 rounded-full bg-success" />
        <span className="text-[12px] leading-none font-semibold tabular-nums text-ink">{score}%</span>
        <span className="text-[11px] leading-none font-medium text-dim">ATS</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

/* Auto apply — profile data drops into the known fields, the agent writes the
   open-ended answer, then the application goes in. */
const profileFields = [
  { label: "Full name", value: "Ananya Sharma", at: 3 },
  { label: "Current CTC", value: "₹18,00,000", at: 6 },
  { label: "Expected CTC", value: "₹28,00,000", at: 9 },
];

const answer =
  "Your platform team ships developer tooling at a scale I want to work at, and that is exactly where I do my best work.";
const answerWords = answer.split(" ");

const TYPE_AT = 13;
const TYPE_FOR = 12;
const SUBMIT_AT = TYPE_AT + TYPE_FOR + 2;
const APPLY_LOOP = SUBMIT_AT + 10;

export function ApplyForm() {
  const [t, setT] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setT((v) => (v + 1) % APPLY_LOOP), 260);
    return () => clearInterval(id);
  }, []);

  const typed = Math.round(
    Math.min(1, Math.max(0, (t - TYPE_AT) / TYPE_FOR)) * answerWords.length,
  );
  const answering = t >= TYPE_AT - 1;
  const writing = answering && t < SUBMIT_AT;
  const submitted = t >= SUBMIT_AT;

  return (
    <div className="flex w-full flex-col gap-3">
      {profileFields.map((f) => (
        <Field
          key={f.label}
          label={f.label}
          badge="Profile"
          on={t >= f.at}
          focused={t >= f.at - 1 && t < f.at + 2}
        >
          <span className="truncate text-[13px] leading-none font-medium text-white">
            {f.value}
          </span>
        </Field>
      ))}

      <Field
        label="Why do you want to join us?"
        badge="AI agent"
        accent
        on={answering}
        focused={writing}
        tall
      >
        <span className="text-[12px] leading-[1.4] font-medium text-white">
          {answerWords.slice(0, typed).join(" ")}
          {writing && typed < answerWords.length && (
            <motion.span
              animate={{ opacity: [1, 0.1, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="ml-px inline-block h-[11px] w-px translate-y-px bg-brand-lighter"
            />
          )}
        </span>
      </Field>

      <motion.span
        animate={{
          backgroundColor: submitted ? "#10b981" : "#ffffff",
          color: submitted ? "#ffffff" : "#000000",
          scale: t === SUBMIT_AT - 1 ? 0.97 : 1,
        }}
        transition={{ duration: 0.25 }}
        className="mt-0.5 flex h-[38px] items-center justify-center gap-1.5 rounded-full text-[14px] leading-none font-semibold"
      >
        {submitted && (
          <motion.svg
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={spring(0.4)}
            viewBox="0 0 16 16"
            aria-hidden
            className="size-3.5"
          >
            <path
              d="M3 8.5l3.2 3.2L13 5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        )}
        {submitted ? "Applied" : "Submit application"}
      </motion.span>
    </div>
  );
}

function Field({
  label,
  badge,
  on,
  focused,
  accent,
  tall,
  children,
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="flex items-center gap-2">
        <span className="text-[11px] leading-none font-medium text-grey">{label}</span>
        <AnimatePresence>
          {on && (
            <motion.span
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={spring(0.35)}
              className={clsx(
                "rounded-full px-1.5 py-[3px] text-[9px] leading-none font-semibold",
                accent
                  ? "bg-[rgba(64,106,228,0.22)] text-[#9dbcff]"
                  : "bg-white/10 text-grey",
              )}
            >
              {badge}
            </motion.span>
          )}
        </AnimatePresence>
      </span>
      <motion.span
        animate={{ boxShadow: focused ? "0 0 0 1px #406ae4" : "0 0 0 1px #262626" }}
        transition={{ duration: 0.25 }}
        className={clsx(
          "flex overflow-hidden rounded-[10px] bg-[#141414] px-3",
          tall ? "h-[66px] py-2.5" : "h-[34px] items-center",
        )}
      >
        <AnimatePresence>
          {on && (
            <motion.span
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={spring(0.35)}
              className="min-w-0"
            >
              {children}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.span>
    </div>
  );
}

/* ------------------------------------------------------------------ */

/* Recruiter outreach — an email and a LinkedIn note get written, then sent. */
const mailBody =
  "Hi Priya — I saw the Frontend Engineer role at Acme. I've shipped design systems in React for four years and would love to be considered.";
const dmBody = "Hi Priya, I just applied for the Frontend Engineer role — happy to share my work.";

const mailWords = mailBody.split(" ");
const dmWords = dmBody.split(" ");
const OUTREACH_LOOP = 34;

export function OutreachDesk() {
  const [t, setT] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setT((v) => (v + 1) % OUTREACH_LOOP), 300);
    return () => clearInterval(id);
  }, []);

  const reveal = (start, span, total) =>
    Math.round(Math.min(1, Math.max(0, (t - start) / span)) * total);

  return (
    <div className="relative flex w-full items-stretch justify-center gap-[30px] pb-7">
      <Draft
        channel="Email"
        icon={marks.gmail}
        color="#ea4335"
        tint="rgba(234,67,53,0.10)"
        to="priya.n@acme.com"
        subject="Frontend Engineer — quick intro"
        text={mailWords.slice(0, reveal(1, 9, mailWords.length)).join(" ")}
        sent={t >= 12 && t < OUTREACH_LOOP - 3}
      />
      <Draft
        className="hidden sm:flex"
        channel="LinkedIn"
        icon={marks.linkedin}
        color="#0a66c2"
        tint="rgba(10,102,194,0.10)"
        to="Priya N · Talent Partner"
        text={dmWords.slice(0, reveal(8, 6, dmWords.length)).join(" ")}
        sent={t >= 16 && t < OUTREACH_LOOP - 3}
      />
    </div>
  );
}

function Draft({
  channel,
  icon,
  color,
  tint,
  to,
  subject,
  text,
  sent,
  className,
}) {
  return (
    <div
      className={clsx(
        "w-full max-w-[330px] flex-1 flex-col gap-2.5 rounded-[16px] bg-white p-4 shadow-[0_10px_30px_rgba(29,29,29,0.10)]",
        className ?? "flex",
      )}
    >
      <div className="flex items-center gap-2">
        <span
          className="grid size-[26px] shrink-0 place-items-center rounded-[8px]"
          style={{ backgroundColor: tint }}
        >
          <Mark src={icon} color={color} className="size-[14px]" />
        </span>
        <span className="flex-1 truncate text-[12px] leading-none font-semibold text-ink">
          {channel}
        </span>
        <AnimatePresence mode="wait">
          <motion.span
            key={sent ? "sent" : "draft"}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={spring(0.3)}
            className={clsx(
              "rounded-full px-2 py-1 text-[10px] leading-none font-semibold",
              sent ? "bg-success-10 text-success" : "bg-surface text-dim",
            )}
          >
            {sent ? "Sent" : "Drafting"}
          </motion.span>
        </AnimatePresence>
      </div>

      <div className="flex flex-col gap-1 border-t border-line pt-2.5">
        <span className="truncate text-[11px] leading-[1.3] font-medium text-dim">To: {to}</span>
        {subject ? (
          <span className="truncate text-[12px] leading-[1.3] font-semibold text-ink">
            {subject}
          </span>
        ) : null}
      </div>

      <div className="min-h-[52px] flex-1">
        {text ? (
          <p className="text-[11px] leading-[1.45] font-medium text-dim">{text}</p>
        ) : (
          <span className="flex items-center gap-1 pt-1.5">
            {[0, 1, 2].map((d) => (
              <motion.span
                key={d}
                className="size-1.5 rounded-full bg-line"
                animate={{ opacity: [0.35, 1, 0.35] }}
                transition={{ duration: 1.1, repeat: Infinity, delay: d * 0.16 }}
              />
            ))}
          </span>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

/* Application tracking — every update lands on WhatsApp and in the inbox. */
const notices = [
  { via: "whatsapp", title: "Application submitted", body: "Frontend Engineer · Acme" },
  { via: "gmail", title: "Recruiter replied", body: "Priya · interview invite" },
  { via: "whatsapp", title: "Interview scheduled", body: "Tomorrow, 3:00 PM" },
  { via: "gmail", title: "Application viewed", body: "Monster · Data Analyst" },
];

const channel = {
  whatsapp: { icon: marks.whatsapp, color: "#25d366", tint: "rgba(37,211,102,0.12)" },
  gmail: { icon: marks.gmail, color: "#ea4335", tint: "rgba(234,67,53,0.10)" },
};

export function NotifyFeed() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setI((v) => v + 1), 2600);
    return () => clearInterval(id);
  }, []);

  const rows = [0, 1].map((k) => ({
    slot: i - k,
    notice: notices[(((i - k) % notices.length) + notices.length) % notices.length],
  }));

  return (
    <div className="flex w-full flex-col gap-2">
      <AnimatePresence initial={false} mode="popLayout">
        {rows.map(({ slot, notice }, k) => {
          const ch = channel[notice.via];
          return (
            <motion.div
              key={slot}
              layout
              initial={{ opacity: 0, y: -16, scale: 0.96 }}
              animate={{ opacity: k === 0 ? 1 : 0.65, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.96 }}
              transition={spring(0.5)}
              className="flex h-[44px] items-center gap-2.5 rounded-[12px] bg-white px-3 shadow-[0_4px_14px_rgba(29,29,29,0.07)]"
            >
              <span
                className="grid size-[26px] shrink-0 place-items-center rounded-[8px]"
                style={{ backgroundColor: ch.tint }}
              >
                <Mark src={ch.icon} color={ch.color} className="size-[14px]" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[12px] leading-[1.2] font-semibold text-ink">
                  {notice.title}
                </span>
                <span className="mt-0.5 block truncate text-[11px] leading-[1.2] font-medium text-dim">
                  {notice.body}
                </span>
              </span>
              <span className="shrink-0 text-[10px] leading-none font-medium text-dim">
                {k === 0 ? "now" : "2m"}
              </span>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

