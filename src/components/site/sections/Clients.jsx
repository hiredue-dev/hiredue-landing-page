"use client";

import Image from "next/image";
import { Eyebrow, Reveal } from "@/components/site/ui/Primitives";
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

          {/* a still, wrapping row: a scrolling strip is hard to read and
              never shows every name at once */}
          <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5 md:gap-x-14">
            {clients.logos.map((logo, i) => (
              <li
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
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
