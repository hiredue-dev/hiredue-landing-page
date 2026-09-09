"use client";

import clsx from "clsx";
import { Eyebrow, Reveal, RevealGroup, RevealItem } from "@/components/site/ui/Primitives";
import { featurePage } from "@/lib/content";

const { steps } = featurePage;

/* Surface / primary / dark, in that order — the template alternates them. */
const card = {
  surface: "bg-surface",
  primary: "bg-[linear-gradient(135deg,#406ae4_0%,#5290f4_100%)]",
  dark: "bg-[linear-gradient(135deg,#323232_0%,#000_100%)]",
};

const badge = {
  surface: "bg-[linear-gradient(133deg,#406ae4_0%,#3b82f6_100%)] text-white",
  primary: "bg-ink text-white",
  dark: "bg-white text-ink",
};

const title = {
  surface: "text-ink",
  primary: "text-white",
  dark: "text-white",
};

const body = {
  surface: "text-dim",
  primary: "text-surface",
  dark: "text-grey",
};

export function FeatureSteps() {
  return (
    <section className="relative pb-[100px] min-[810px]:pb-[160px] min-[1200px]:pb-[200px]">
      <div className="container-page">
        <div className="flex flex-col items-center gap-[30px] min-[810px]:gap-10 min-[1200px]:gap-[50px]">
          <Reveal className="flex max-w-[800px] flex-col items-center gap-2.5">
            <Eyebrow>{steps.eyebrow}</Eyebrow>
            <h2 className="t-h2-feature text-center">{steps.title}</h2>
            <p className="t-body-lg text-center">{steps.description}</p>
          </Reveal>

          <RevealGroup
            step={0.08}
            className="grid w-full gap-5 min-[810px]:grid-cols-3 min-[810px]:gap-[30px]"
          >
            {steps.items.map((step) => (
              <RevealItem
                key={step.number}
                className={clsx(
                  "flex flex-col items-center gap-5 rounded-[30px] p-[30px]",
                  card[step.tone],
                )}
              >
                <span
                  className={clsx(
                    "grid size-[50px] shrink-0 place-items-center rounded-full",
                    "font-display text-[22px] leading-[1.2] font-semibold",
                    badge[step.tone],
                  )}
                >
                  {step.number}
                </span>
                <div className="flex flex-col items-center gap-1.5 text-center">
                  <h3 className={clsx("t-h5", title[step.tone])}>{step.title}</h3>
                  <p className={clsx("text-[16px] leading-[1.3] font-medium", body[step.tone])}>
                    {step.description}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
