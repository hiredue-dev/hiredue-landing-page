"use client";

import { Button } from "@/components/site/ui/Button";
import { SplitHero } from "@/components/site/ui/PageHero";
import { ambassadorPage } from "@/lib/content";
import { CreatorCard } from "./creator-card";

const { hero, applyUrl, applyLabel } = ambassadorPage;

export function AmbassadorHero() {
  return (
    <SplitHero
      sky
      align="center"
      eyebrow={hero.eyebrow}
      eyebrowTone="white"
      title={hero.title}
      description={hero.description}
      aside={
        <div className="flex justify-center min-[1200px]:justify-end">
          <CreatorCard />
        </div>
      }
    >
      <div className="grid w-full max-w-[600px] grid-cols-2 gap-5 min-[810px]:grid-cols-3 min-[810px]:gap-[30px]">
        {hero.stats.map((stat) => (
          <div key={stat.label} className="flex flex-col gap-1.5">
            <p className="t-h3">{stat.value}</p>
            <p className="t-body">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <Button effect="arrow" ring href={applyUrl}>{applyLabel}</Button>
        <Button effect="slide" variant="white" href={hero.secondary.href}>{hero.secondary.label}</Button>
      </div>
    </SplitHero>
  );
}
