"use client";

import Image from "next/image";
import clsx from "clsx";
import { Eyebrow, Reveal, RevealGroup, RevealItem } from "@/components/site/ui/Primitives";
import { stats } from "@/lib/content";

const tones = {
  light: {
    card: "bg-[linear-gradient(135deg,#edf1f4_0%,#edf1f4_100%)]",
    label: "text-dim",
    value: "text-ink",
    body: "text-dim",
    icon: "bg-[linear-gradient(133deg,#406ae4_0%,#3b82f6_100%)]",
  },
  dark: {
    card: "bg-[linear-gradient(135deg,#323232_0%,#000_100%)]",
    label: "text-white",
    value: "text-white",
    body: "text-[#edf1f4]",
    icon: "bg-white",
  },
  primary: {
    card: "bg-[linear-gradient(90deg,#406ae4_0%,#3b82f6_100%)]",
    label: "text-white",
    value: "text-white",
    body: "text-[#edf1f4]",
    icon: "bg-black",
  },
};

export function Stats() {
  return (
    <section className="relative pt-[100px]">
      <div className="container-page">
        {/* ---- large screens: cards scattered around the headline ---- */}
        <div className="relative hidden h-[1080px] w-full xl:block">
          <RevealGroup step={0.08} className="absolute inset-0">
            {stats.cards.map((card) => (
              /* placement copied from the original 1200 × 1080 stage */
              <RevealItem key={card.label} className="absolute" style={{ left: card.x, top: card.y }}>
                <StatCard {...card} />
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal className="absolute top-1/2 left-1/2 flex w-[700px] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2.5">
            <Eyebrow>{stats.eyebrow}</Eyebrow>
            <h2 className="t-h2 text-center">{stats.title}</h2>
            <p className="t-body-lg text-center">{stats.description}</p>
          </Reveal>
        </div>

        {/* ---- everything else: headline, then a plain grid ---- */}
        <div className="flex flex-col items-center gap-[50px] xl:hidden">
          <Reveal className="flex max-w-[700px] flex-col items-center gap-2.5">
            <Eyebrow>{stats.eyebrow}</Eyebrow>
            <h2 className="t-h2 text-center">{stats.title}</h2>
            <p className="t-body-lg text-center">{stats.description}</p>
          </Reveal>
          <RevealGroup
            step={0.08}
            className="grid w-full grid-cols-1 justify-items-center gap-[30px] sm:grid-cols-2 lg:grid-cols-3"
          >
            {stats.cards.map((card) => (
              <RevealItem key={card.label}>
                <StatCard {...card} />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}

function StatCard({ label, value, description, icon, tone }) {
  const t = tones[tone];
  return (
    <div
      className={clsx(
        "flex size-[280px] flex-col justify-between overflow-hidden rounded-[30px] p-[30px]",
        t.card,
      )}
    >
      <div className="flex items-start gap-2.5 pb-[30px]">
        <p className={clsx("flex-1 text-[16px] leading-[1.3] font-medium", t.label)}>{label}</p>
        <span className={clsx("grid size-10 shrink-0 place-items-center rounded-full", t.icon)}>
          <Image src={icon} alt="" width={20} height={20} className="size-5" />
        </span>
      </div>
      <div className="flex flex-col gap-1.5">
        <p className={clsx("t-h3", t.value)}>{value}</p>
        <p className={clsx("text-[16px] leading-[1.3] font-medium", t.body)}>{description}</p>
      </div>
    </div>
  );
}
