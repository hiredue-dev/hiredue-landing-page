"use client";

import { PageHero } from "@/components/site/ui/PageHero";

export function ChangelogHero() {
  return (
    <PageHero
      eyebrow="Changelog"
      title="Product updates"
      description="Track what's new, improved, and fixed across the HireDue platform."
      className="pb-[60px] min-[1200px]:pb-20"
    />
  );
}
