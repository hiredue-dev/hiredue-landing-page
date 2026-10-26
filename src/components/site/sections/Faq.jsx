"use client";

import Image from "next/image";
import clsx from "clsx";
import { Button } from "@/components/site/ui/Button";
import { FaqAccordion } from "@/components/site/ui/FaqAccordion";
import { Reveal } from "@/components/site/ui/Primitives";
import { assets } from "@/lib/assets";
import { faq } from "@/lib/content";

export function Faq({ items = faq.items }) {
  return (
    <section id="faqs" className="relative pb-[100px]">
      <div className="container-page">
        <div className="flex flex-col gap-[50px] lg:flex-row lg:gap-[70px]">
          <Reveal className="flex flex-col gap-[50px] lg:w-[424px] lg:shrink-0 lg:gap-20">
            <div className="flex flex-col gap-2.5">
              <h2 className="t-h2">{faq.title}</h2>
              <p className="t-body-lg">{faq.description}</p>
            </div>

            <div className="flex flex-col gap-5 rounded-[30px] bg-surface p-10">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center pr-2.5">
                  {assets.faq.avatars.map((avatar, i) => (
                    <Image
                      key={avatar}
                      src={avatar}
                      alt=""
                      width={40}
                      height={40}
                      className={clsx(
                        "size-10 rounded-full object-cover ring-2 ring-surface",
                        i > 0 && "-ml-2.5",
                      )}
                    />
                  ))}
                </div>
                <span className="text-[20px] leading-[1.3] font-medium text-ink">+</span>
                <span className="grid size-10 place-items-center rounded-full bg-[linear-gradient(312deg,#3b82f6_0%,#406ae4_100%)] text-[14px] leading-[1.3] font-medium text-white">
                  You
                </span>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <h3 className="t-h5">{faq.aside.title}</h3>
                  <p className="t-body">{faq.aside.description}</p>
                </div>
                <Button effect="arrow" ring variant="dark" href={faq.aside.cta.href}>{faq.aside.cta.label}</Button>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="flex flex-1 flex-col gap-5">
            <FaqAccordion items={items} answerClassName="max-w-[500px]" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
