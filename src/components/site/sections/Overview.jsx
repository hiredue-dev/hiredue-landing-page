"use client";

import Image from "next/image";
import { ArrowButton, SlideButton } from "@/components/site/ui/Button";
import { Eyebrow, Reveal, RevealGroup, RevealItem } from "@/components/site/ui/Primitives";
import { assets } from "@/lib/assets";
import { overview } from "@/lib/content";

export function Overview() {
  return (
    <section className="relative isolate py-[120px] md:py-[200px]">
      <Image
        src={assets.overview.bg}
        alt=""
        fill
        sizes="100vw"
        className="-z-10 object-cover"
      />
      <span className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[200px] bg-[linear-gradient(0deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.7)_25%,#fff_50%)]" />
      <span className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[200px] bg-[linear-gradient(rgba(255,255,255,0)_0%,rgba(255,255,255,0.7)_25%,#fff_50%)]" />

      <div className="container-page">
        <div className="flex flex-col items-center gap-[50px]">
          <Reveal className="flex max-w-[800px] flex-col items-center gap-10">
            <div className="flex flex-col items-center gap-2.5">
              <Eyebrow>{overview.eyebrow}</Eyebrow>
              <h2 className="t-h2 text-center">{overview.title}</h2>
              <p className="t-body-lg text-center">{overview.description}</p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-5">
              <ArrowButton label={overview.primary.label} href={overview.primary.href} tone="primary" />
              <SlideButton label={overview.secondary.label} href={overview.secondary.href} tone="ink" />
            </div>
          </Reveal>

          <div className="flex w-full flex-col gap-[30px]">
            <Reveal y={30} className="rounded-[20px] bg-white p-1.5">
              <Image
                src={assets.overview.dashboard}
                alt="HireDue live dashboard"
                width={1920}
                height={1080}
                unoptimized
                sizes="(max-width: 1260px) 100vw, 1188px"
                className="w-full rounded-[14px]"
              />
            </Reveal>

            <RevealGroup step={0.08} className="grid gap-[30px] md:grid-cols-3">
              {overview.cards.map((card) => (
                <RevealItem
                  key={card.text}
                  className="flex items-start gap-5 rounded-[20px] bg-white p-[30px]"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-[10px] bg-[linear-gradient(135deg,#323232_0%,#000_100%)]">
                    <Image src={card.icon} alt="" width={21} height={20} className="h-5 w-auto" />
                  </span>
                  <p className="t-body">{card.text}</p>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </div>
    </section>
  );
}
