"use client";

import clsx from "clsx";
import { Reveal } from "@/components/site/ui/Primitives";
import { contactPage } from "@/lib/content";

const { team } = contactPage;

const TONE = {
  light: {
    card: "bg-surface",
    badge: "bg-brand text-white",
    title: "text-ink",
    body: "text-dim",
    link: "text-brand",
  },
  dark: {
    card: "bg-[linear-gradient(132deg,#323232_0%,#000_100%)]",
    badge: "bg-white text-ink",
    title: "text-white",
    body: "text-[#c7ccd1]",
    link: "text-white underline decoration-white/40 underline-offset-2",
  },
  brand: {
    card: "bg-[linear-gradient(132deg,#3b82f6_0%,#406ae4_100%)]",
    badge: "bg-ink text-white",
    title: "text-white",
    body: "text-white/80",
    link: "text-white underline decoration-white/40 underline-offset-2",
  },
};

const ICONS = [SalesIcon, SupportIcon, PartnersIcon];

export function ContactTeam() {
  return (
    <section className="relative pb-[100px] min-[810px]:pb-[160px] min-[1200px]:pb-[200px]">
      <div className="container-page">
        <div className="flex flex-col items-center gap-[50px]">
          <Reveal>
            <h2 className="t-h2 text-center">{team.title}</h2>
          </Reveal>

          <div className="grid w-full gap-5 md:grid-cols-3">
            {team.cards.map((card, i) => {
              const tone = TONE[card.tone] ?? TONE.light;
              const Icon = ICONS[i % ICONS.length];
              return (
                <Reveal key={card.title} delay={i * 0.08} className="h-full">
                  <div
                    className={clsx(
                      "flex h-full flex-col gap-6 rounded-[20px] p-[30px]",
                      tone.card,
                    )}
                  >
                    <span
                      className={clsx(
                        "grid size-11 shrink-0 place-items-center rounded-full",
                        tone.badge,
                      )}
                    >
                      <Icon className="size-5" />
                    </span>
                    <div className="flex flex-col gap-1.5">
                      <h3 className={clsx("t-h5", tone.title)}>{card.title}</h3>
                      <p className={clsx("text-[15px] leading-[1.4] font-medium", tone.body)}>
                        {card.description}
                      </p>
                    </div>
                    <a
                      href={`mailto:${card.email}`}
                      className={clsx("mt-auto text-[15px] font-semibold", tone.link)}
                    >
                      {card.email}
                    </a>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function SalesIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path
        d="M4 4h16v12H7l-3 3V4Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M8 10l2.5 2.5L16 7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SupportIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M5.5 5.5l3.2 3.2M18.5 5.5l-3.2 3.2M5.5 18.5l3.2-3.2M18.5 18.5l-3.2-3.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function PartnersIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 12h18M12 3c2.5 2.5 3.8 5.7 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.7-3.8-9S9.5 5.5 12 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}
