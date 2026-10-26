"use client";

import Image from "next/image";
import { Button } from "@/components/site/ui/Button";
import { Avatar } from "@/components/site/ui/Avatar";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/ui/Primitives";
import { useAuthModal } from "@/features/auth/components/FloatingAuthModal.jsx";
import { assets } from "@/lib/assets";
import { testimonials } from "@/lib/content";

export function Testimonials({ items = testimonials.items }) {
  const { showModal } = useAuthModal();
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
              <Button onClick={() => showModal({ view: "signup" })}>{testimonials.cta.label}</Button>
            </Reveal>
          </div>
        </div>

        {/* Read, not chased: a still grid from sm up, a swipeable row on
            phones (each card snaps, the next one peeks in at the edge). */}
        <div className="container-page">
          <RevealGroup
            step={0.06}
            className="-mx-[30px] flex snap-x snap-mandatory gap-5 overflow-x-auto px-[30px] pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3 lg:gap-[30px] [&::-webkit-scrollbar]:hidden"
          >
            {items.slice(0, 6).map((item) => (
              <RevealItem key={item.name} className="w-[85%] shrink-0 snap-start sm:w-auto">
                <figure className="flex h-full flex-col justify-between rounded-[30px] bg-white p-7 sm:p-8">
                  <div className="flex flex-col gap-4 pb-8">
                    <Image
                      src={assets.icons.stars5}
                      alt="5 out of 5"
                      width={137}
                      height={27}
                      className="h-[22px] w-auto self-start"
                    />
                    <blockquote className="t-body-lg text-ink">{item.quote}</blockquote>
                  </div>
                  <figcaption className="flex items-center gap-4">
                    <Avatar name={item.name} size={50} />
                    <span className="flex flex-col gap-0.5">
                      <span className="text-[18px] leading-[1.3] font-medium text-ink">{item.name}</span>
                      <span className="t-body-sm">{item.role}</span>
                    </span>
                  </figcaption>
                </figure>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
