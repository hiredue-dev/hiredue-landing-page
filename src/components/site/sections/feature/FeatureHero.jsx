"use client";

import { Button } from "@/components/site/ui/Button";
import { FeatureHeroVisual } from "@/components/site/sections/feature/FeatureHeroVisual";
import { SplitHero } from "@/components/site/ui/PageHero";
import { useAuthModal } from "@/features/auth/components/FloatingAuthModal.jsx";
import { featurePage } from "@/lib/content";

const { hero } = featurePage;

export function FeatureHero() {
  const { showModal } = useAuthModal();
  return (
    <SplitHero
      sky
      asideWidth="half"
      title={hero.title}
      description={hero.description}
      aside={<FeatureHeroVisual />}
    >
      <div className="grid w-full grid-cols-2 gap-5 min-[810px]:gap-[30px]">
        {hero.stats.map((stat) => (
          <div key={stat.value} className="flex flex-col gap-1.5">
            <p className="t-h4">{stat.value}</p>
            <p className="t-body">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-5">
        <Button ring onClick={() => showModal({ view: "signup" })}>
          {hero.cta.label}
        </Button>
        {hero.secondaryCta && <Button effect="slide" variant="white" href={hero.secondaryCta.href}>{hero.secondaryCta.label}</Button>}
      </div>
    </SplitHero>
  );
}
