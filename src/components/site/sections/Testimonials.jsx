"use client";

import Image from "next/image";
import { ArrowButton } from "@/components/site/ui/Button";
import { Marquee, Reveal } from "@/components/site/ui/Primitives";
import { assets } from "@/lib/assets";
import { testimonials } from "@/lib/content";

export function Testimonials() {
  return (
    <section className="relative isolate overflow-hidden py-[120px] md:py-[200px]">
      <Image
        src={assets.testimonials.bg}
        alt=""
        fill
        sizes="100vw"
        className="-z-10 object-cover"
      />
      <span className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[200px] bg-[linear-gradient(0deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.7)_25%,#fff_50%)]" />
      <span className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[200px] bg-[linear-gradient(rgba(255,255,255,0)_0%,rgba(255,255,255,0.7)_25%,#fff_50%)]" />

      <div className="flex flex-col gap-[50px]">
        <div className="container-page">
          <div className="flex flex-col items-start gap-[30px] lg:flex-row lg:items-end lg:gap-[50px]">
            <Reveal className="flex flex-1 flex-col items-start gap-5">
              <h2 className="t-h2 max-w-[719px]">{testimonials.title}</h2>
              <ul className="flex flex-wrap items-center gap-x-5 gap-y-2.5">
                {testimonials.meta.map((item, i) => (
                  <li key={item.label} className="flex items-center gap-x-5">
                    {i > 0 && <span className="hidden h-[22px] w-px bg-ink sm:block" />}
                    <span className="flex items-center gap-1.5">
                      <Image src={item.icon} alt="" width={24} height={18} className="h-[18px] w-auto" />
                      <span className="t-body">{item.label}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.1}>
              <ArrowButton
                label={testimonials.cta.label}
                href={testimonials.cta.href}
                tone="dark"
              />
            </Reveal>
          </div>
        </div>

        <Reveal y={30}>
          <Marquee duration={70} gap={50} className="w-full">
            {testimonials.items.map((item) => (
              <figure
                key={item.name}
                className="flex h-[300px] w-[400px] shrink-0 flex-col justify-between overflow-hidden rounded-[30px] bg-white p-10"
              >
                <div className="flex flex-col gap-4 pb-10">
                  <Image
                    src={assets.icons.stars5}
                    alt="5 out of 5"
                    width={109}
                    height={18}
                    className="h-[18px] w-auto"
                  />
                  <blockquote className="t-body-lg text-ink">{item.quote}</blockquote>
                </div>
                <figcaption className="flex items-center gap-4">
                  <Image
                    src={item.avatar}
                    alt=""
                    width={50}
                    height={50}
                    className="size-[50px] rounded-full object-cover"
                  />
                  <span className="flex flex-col gap-0.5">
                    <span className="text-[20px] leading-[1.3] font-medium text-ink">
                      {item.name}
                    </span>
                    <span className="t-body-sm">{item.role}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </Marquee>
        </Reveal>
      </div>
    </section>
  );
}
