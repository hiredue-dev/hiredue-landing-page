"use client";

import clsx from "clsx";
import { Mark } from "@/components/site/ui/Mark";
import {
  Eyebrow,
  Reveal,
  RevealGroup,
  RevealItem,
} from "@/components/site/ui/Primitives";
import { featurePage } from "@/lib/content";

const { integrations } = featurePage;

export function FeatureIntegrations() {
  return (
    <section className="relative pt-[100px] pb-[30px] min-[810px]:pt-[160px] min-[810px]:pb-[60px] min-[1200px]:pt-[200px] min-[1200px]:pb-[100px]">
      <div className="container-page">
        <div className="flex flex-col items-center gap-[30px] min-[810px]:gap-10 min-[1200px]:gap-[50px]">
          <Reveal className="flex max-w-[800px] flex-col items-center gap-2.5">
            <Eyebrow>{integrations.eyebrow}</Eyebrow>
            <h2 className="t-h2-feature text-center min-[810px]:whitespace-pre-line">
              {integrations.title}
            </h2>
            <p className="t-body-lg text-center">{integrations.description}</p>
          </Reveal>

          <RevealGroup
            step={0.06}
            className="grid w-full gap-x-5 gap-y-10 rounded-[30px] bg-surface px-5 py-10 min-[810px]:grid-cols-3 min-[810px]:gap-x-[30px] min-[810px]:gap-y-[50px] min-[810px]:p-[30px] min-[1200px]:gap-[50px] min-[1200px]:p-[100px]"
          >
            {integrations.items.map((item) => (
              <RevealItem
                key={item.name}
                className="flex flex-col items-center gap-5"
              >
                <span
                  className={clsx(
                    "grid size-[50px] shrink-0 place-items-center rounded-full bg-white",
                    !item.icon && "text-[11px] font-bold tracking-[-0.03em]",
                  )}
                  style={!item.icon ? { color: item.color } : undefined}
                >
                  {item.icon ? (
                    <Mark
                      src={item.icon}
                      color={item.color}
                      className="size-6"
                    />
                  ) : (
                    item.name
                  )}
                </span>
                <div className="flex w-full flex-col gap-1.5 text-center">
                  <h3 className="t-h5">{item.name}</h3>
                  <p className="t-body">{item.description}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
