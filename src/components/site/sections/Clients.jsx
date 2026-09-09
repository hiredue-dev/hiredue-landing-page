"use client";

import Image from "next/image";
import { Eyebrow, Marquee, Reveal } from "@/components/site/ui/Primitives";
import { clients } from "@/lib/content";

export function Clients() {
  return (
    <section className="relative bg-white">
      <div className="container-page">
        <Reveal className="relative flex flex-col gap-[30px] pb-[30px]">
          {/* label sitting on a hairline that fades out at both ends */}
          <div className="relative flex items-center justify-center">
            <span className="absolute inset-x-0 top-1/2 h-px bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,#dde5ed_50%,rgba(255,255,255,0)_100%)]" />
            <Eyebrow className="relative">{clients.label}</Eyebrow>
          </div>

          <div className="relative">
            <Marquee duration={38} gap={56} className="h-8">
              {clients.logos.map((logo, i) => (
                <span
                  key={`${logo.name}-${i}`}
                  className="flex shrink-0 items-center gap-2.5 text-dim"
                >
                  {logo.icon && (
                    <Image
                      src={logo.icon}
                      alt=""
                      width={28}
                      height={28}
                      className="size-7 shrink-0 object-contain"
                    />
                  )}
                  <span className="text-[19px] leading-none font-semibold whitespace-nowrap">
                    {logo.name}
                  </span>
                </span>
              ))}
            </Marquee>
            <span className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-[linear-gradient(90deg,#fff_0%,rgba(255,255,255,0)_100%)]" />
            <span className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-[linear-gradient(270deg,#fff_0%,rgba(255,255,255,0)_100%)]" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
