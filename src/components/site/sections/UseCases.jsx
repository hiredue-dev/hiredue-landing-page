"use client";

import Image from "next/image";
import { Eyebrow, Marquee, Reveal } from "@/components/site/ui/Primitives";
import { useCases } from "@/lib/content";

export function UseCases() {
  return (
    <section id="use-cases" className="relative py-[120px] md:py-[200px]">
      <div className="flex flex-col items-center gap-[50px]">
        <Reveal className="flex w-full max-w-[860px] flex-col items-center gap-2.5 px-[30px]">
          <Eyebrow>{useCases.eyebrow}</Eyebrow>
          <h2 className="t-h2 text-center">{useCases.title}</h2>
        </Reveal>

        <Reveal y={30} className="w-full">
          <Marquee duration={55} gap={10} className="h-[420px] w-full">
            {useCases.items.map((item) => (
              <div key={item.title} className="flex shrink-0 items-center gap-2.5">
                {/* candid photo */}
                <Image
                  src={item.photo}
                  alt=""
                  width={380}
                  height={420}
                  className="h-[420px] w-[380px] rounded-[30px] object-cover"
                />

                {/* frosted content card */}
                <div className="relative h-[420px] w-[380px] shrink-0 overflow-hidden rounded-[30px] p-2.5">
                  <Image
                    src={item.card}
                    alt=""
                    fill
                    sizes="380px"
                    className="object-cover"
                  />
                  <div className="relative flex h-full flex-col justify-between rounded-[20px] bg-white/30 p-[30px] backdrop-blur-[2px]">
                    <div className="flex max-w-[300px] flex-col gap-1.5 pb-[30px]">
                      <h3 className="t-h4">{item.title}</h3>
                      <p className="t-body-lg">{item.description}</p>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <h4 className="t-h5">{item.statValue}</h4>
                      <p className="t-body">{item.statLabel}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Marquee>
        </Reveal>

        <Reveal delay={0.1} className="flex w-full max-w-[860px] flex-col items-center gap-[30px] px-[30px]">
          <ul className="flex flex-wrap items-center justify-center gap-2.5">
            {useCases.chips.map((chip) => (
              <li
                key={chip}
                className="rounded-full bg-surface px-3.5 pt-1 pb-1.5 text-[14px] leading-[1.3] font-medium text-ink"
              >
                {chip}
              </li>
            ))}
          </ul>

          <figure className="flex max-w-[500px] flex-col items-center gap-4">
            <blockquote className="text-center text-[18px] leading-[1.3] font-medium text-ink">
              {useCases.quote.text}
            </blockquote>
            <figcaption className="flex items-center gap-1.5">
              <Image
                src={useCases.quote.avatar}
                alt=""
                width={30}
                height={30}
                className="size-[30px] rounded-full object-cover"
              />
              <span className="t-body-sm">{useCases.quote.author}</span>
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
