"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import clsx from "clsx";
import { ArrowButton } from "@/components/site/ui/Button";
import { Mark } from "@/components/site/ui/Mark";
import { Eyebrow, Reveal } from "@/components/site/ui/Primitives";
import { assets, marks } from "@/lib/assets";
import { integrations } from "@/lib/content";

/* The job boards HireDue searches, and the ATS providers it submits through —
   named logos where a safe brand SVG exists, a plain wordmark where it doesn't
   (naukri, Instahyre, and most enterprise ATS platforms aren't in the open
   icon sets), so nothing here is a fabricated mark. */
const jobBoards = [
  { name: "LinkedIn", icon: marks.linkedin, color: "#0a66c2" },
  { name: "Indeed", icon: marks.indeed, color: "#003a9b" },
  { name: "naukri" },
  { name: "Wellfound", icon: marks.wellfound, color: "#000000" },
  { name: "Instahyre" },
  { name: "Monster", icon: marks.monster, color: "#6d4c9f" },
  { name: "Handshake", icon: marks.handshake, color: "#1d1d1d" },
];

const atsProviders = [
  { name: "Greenhouse", icon: marks.greenhouse, color: "#24a47f" },
  { name: "Workday" },
  { name: "Lever" },
  { name: "Ashby" },
  { name: "SmartRecruiters" },
];

/* Each unique logo appears twice, at opposite points on the ring, so the
   visible arc stays dense even though most of the circle is cropped away. */
const UNIQUE = [...jobBoards, ...atsProviders];
const ORBIT = [...UNIQUE, ...UNIQUE];
const RING = 940;

export function Integrations() {
  return (
    <section id="integrations" className="relative">
      <div className="container-page">
        <div className="relative flex flex-col items-center gap-[50px] overflow-hidden rounded-[30px] bg-surface px-6 pt-[60px] pb-[120px] md:px-[100px] md:pt-[100px] md:pb-[239px]">
          <Reveal className="flex max-w-[520px] flex-col items-center gap-[30px]">
            <div className="flex flex-col items-center gap-2.5">
              <Eyebrow tone="white">{integrations.eyebrow}</Eyebrow>
              <h2 className="t-h2 text-center">{integrations.title}</h2>
              <p className="t-body-lg text-center">{integrations.description}</p>
            </div>
            <ArrowButton
              label={integrations.cta.label}
              href={integrations.cta.href}
              tone="primary"
            />
          </Reveal>

          {/* orbiting logos */}
          <div className="relative h-[220px] w-full max-w-[1000px] overflow-hidden md:mb-[-416px] md:h-[505px]">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
              className="absolute top-0 left-1/2 -translate-x-1/2"
              style={{ width: RING, height: RING }}
            >
              {ORBIT.map((item, i) => {
                const angle = (360 / ORBIT.length) * i;
                return (
                  <div
                    key={`${item.name}-${i}`}
                    className="absolute top-0 left-1/2 h-1/2 origin-bottom"
                    style={{ transform: `translateX(-50%) rotate(${angle}deg)` }}
                  >
                    {/* undo the ring spin, then undo this spoke's angle, so logos stay upright */}
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
                    >
                      <span
                        className={clsx(
                          "flex h-11 items-center gap-2 rounded-full bg-white shadow-[0_4px_14px_rgba(29,29,29,0.08)]",
                          item.icon ? "pl-3 pr-4" : "px-4",
                        )}
                        style={{ transform: `rotate(${-angle}deg)` }}
                      >
                        {item.icon && (
                          <Mark src={item.icon} color={item.color} className="size-[18px]" />
                        )}
                        <span className="text-[13px] leading-none font-semibold whitespace-nowrap text-ink">
                          {item.name}
                        </span>
                      </span>
                    </motion.div>
                  </div>
                );
              })}
            </motion.div>
          </div>

          <Reveal className="relative z-10 flex max-w-[520px] flex-col items-center gap-[30px]">
            <span className="grid size-[130px] place-items-center rounded-full bg-[linear-gradient(135deg,#323232_0%,#000_100%)] btn-emboss">
              <Image src={assets.integrations.hub} alt="" width={53} height={40} className="w-[53px]" />
            </span>
            <h3 className="t-h4 text-center">{integrations.footnote}</h3>
          </Reveal>

          <Image
            src={assets.integrations.hills}
            alt=""
            width={1220}
            height={321}
            sizes="1220px"
            className="pointer-events-none absolute bottom-0 left-0 z-0 w-full max-w-none md:-bottom-[79px] md:-left-[10px] md:w-[1220px]"
          />
        </div>
      </div>
    </section>
  );
}
