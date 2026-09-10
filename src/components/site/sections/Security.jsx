"use client";

import Image from "next/image";
import { ArrowButton } from "@/components/site/ui/Button";
import { Eyebrow, Reveal } from "@/components/site/ui/Primitives";
import { SecurityDiagram } from "@/components/site/sections/security-diagram";
import { assets } from "@/lib/assets";
import { security } from "@/lib/content";

export function Security() {
  return (
    <section className="relative">
      <div className="container-page">
        <div className="flex flex-col items-center gap-[50px] lg:flex-row lg:items-start lg:gap-[70px]">
          <Reveal className="w-full lg:w-[628px] lg:shrink-0">
            <div className="flex justify-center rounded-[30px] bg-surface px-6 py-[50px] sm:px-[60px]">
              <SecurityDiagram />
            </div>
          </Reveal>

          <Reveal delay={0.1} className="flex flex-1 flex-col gap-10">
            <div className="flex flex-col items-start gap-2.5">
              <Eyebrow>{security.eyebrow}</Eyebrow>
              <h2 className="t-h2">{security.title}</h2>
              <p className="t-body-lg">{security.description}</p>
              <div className="pt-2.5">
                <ArrowButton label={security.cta.label} href={security.cta.href} tone="dark" />
              </div>
            </div>

            <ul className="flex flex-col gap-2.5">
              {security.points.map((point) => (
                <li key={point} className="flex items-start gap-1.5">
                  <Image
                    src={assets.icons.chevron}
                    alt=""
                    width={9}
                    height={14}
                    className="mt-[6px] w-[6px] shrink-0"
                  />
                  <span className="t-body-lg">{point}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
