"use client";

import { Eyebrow, Reveal } from "@/components/site/ui/Primitives";

export function ChangelogHero() {
  return (
    <section className="relative pt-[140px] pb-[60px] min-[810px]:pt-[170px] min-[1200px]:pb-20 min-[1200px]:pt-[194px]">
      <div className="mx-auto w-full max-w-[720px] px-[30px]">
        <Reveal className="flex flex-col items-center gap-2.5 text-center">
          <Eyebrow>Changelog</Eyebrow>
          <h1 className="t-h2 text-center">Product updates</h1>
          <p className="t-body-lg max-w-[520px] text-center">
            Track what&apos;s new, improved, and fixed across the HireDue platform.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
