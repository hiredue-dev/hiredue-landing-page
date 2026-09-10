"use client";

import Image from "next/image";
import { SlideButton } from "@/components/site/ui/Button";
import { Eyebrow, Reveal, RevealGroup, RevealItem } from "@/components/site/ui/Primitives";
import { assets } from "@/lib/assets";
import { careerPage } from "@/lib/content";

const { openings, apply } = careerPage;

export function CareerOpenings({ items = openings.items }) {
  return (
    <section className="relative pb-[120px] md:pb-[200px]">
      <div className="mx-auto w-full max-w-[1060px] px-[30px]">
        <div className="flex flex-col items-center gap-[50px]">
          <Reveal className="flex flex-col items-center gap-2.5">
            <Eyebrow>{openings.eyebrow}</Eyebrow>
            <h2 className="t-h2 text-center">{openings.title}</h2>
            <p className="t-body-lg max-w-[520px] text-center">{openings.description}</p>
          </Reveal>

          <RevealGroup step={0.08} className="grid w-full gap-5 md:grid-cols-3">
            {items.map((role) => (
              <RevealItem key={role.title}>
                <RoleCard role={role} />
              </RevealItem>
            ))}
          </RevealGroup>

          {/* how to apply */}
          <div className="relative w-full overflow-hidden rounded-[30px] bg-[linear-gradient(#e2f5ff_0%,#fff_100%)] p-[30px]">
            <div className="relative z-1 flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex flex-1 flex-col gap-2.5">
                <h3 className="t-h5">{apply.title}</h3>
                <p className="t-body-lg max-w-[460px]">{apply.description}</p>
                <p className="t-body-sm">
                  No open role fits?{" "}
                  <a
                    href={`mailto:${apply.fallbackEmail}`}
                    className="font-semibold text-brand underline decoration-brand/30 underline-offset-2"
                  >
                    {apply.fallbackEmail}
                  </a>
                </p>
              </div>
              <SlideButton label={apply.cta.label} href={apply.cta.href} tone="ink" />
            </div>
            <Image
              src={assets.pricing.enterprise}
              alt=""
              width={455}
              height={180}
              className="pointer-events-none absolute -right-[50px] -bottom-[40px] w-[455px] max-w-none"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function RoleCard({ role }) {
  return (
    <div className="flex h-full flex-col gap-5 rounded-[20px] bg-surface p-[26px]">
      <div className="flex flex-wrap items-center gap-2">
        <Badge>{role.team}</Badge>
        <Badge>{role.location}</Badge>
        <Badge>{role.type}</Badge>
      </div>

      <h3 className="t-h5 flex-1">{role.title}</h3>

      <a
        href={role.jdUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-[15px] leading-[1.3] font-semibold text-brand"
      >
        View job description
        <ArrowIcon className="size-3.5" />
      </a>
    </div>
  );
}

function Badge({ children }) {
  return (
    <span className="rounded-full bg-white px-3 py-1 text-[13px] leading-[1.3] font-medium text-dim ring-1 ring-line">
      {children}
    </span>
  );
}

function ArrowIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <path
        d="M7 17 17 7M9 7h8v8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
