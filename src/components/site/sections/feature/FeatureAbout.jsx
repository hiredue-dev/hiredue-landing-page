"use client";

import Image from "next/image";
import clsx from "clsx";
import { ArrowButton } from "@/components/site/ui/Button";
import { Eyebrow, Reveal } from "@/components/site/ui/Primitives";
import { assets } from "@/lib/assets";

/**
 * The "Under the hood" split: a framed visual on one side, a headline with a
 * green-chevron checklist on the other. The template uses it twice on this
 * route, mirrored the second time.
 */
export function FeatureAbout({
  eyebrow,
  title,
  description,
  items,
  image,
  imageAlt,
  visual,
  cta,
  reverse = false,
  className,
}) {
  const visualPanel = (
    <Reveal
      delay={reverse ? 0.1 : 0}
      className="flex w-full rounded-[30px] bg-surface p-5 min-[810px]:p-[30px] min-[1200px]:p-[50px]"
    >
      {visual ?? (
        <Image
          src={image}
          alt={imageAlt}
          width={1040}
          height={700}
          sizes="(max-width: 810px) 100vw, 465px"
          className="w-full rounded-[20px] object-cover shadow-[0_4px_8px_0_rgba(0,0,0,0.1)]"
        />
      )}
    </Reveal>
  );

  const copy = (
    <Reveal
      delay={reverse ? 0 : 0.1}
      className="flex flex-col items-start gap-5 min-[810px]:gap-10"
    >
      <div className="flex flex-col items-start gap-2.5">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="t-h2-feature min-[810px]:whitespace-pre-line">
          {title}
        </h2>
        {description && <p className="t-body-lg">{description}</p>}

        <ul className="flex flex-col items-start gap-2.5 pt-2.5">
          {items.map((item) => (
            <li key={item} className="flex items-start gap-1.5">
              <span className="flex h-[22px] shrink-0 items-center">
                <Image
                  src={assets.icons.chevron}
                  alt=""
                  width={9}
                  height={14}
                  className="h-2.5 w-auto"
                />
              </span>
              <span className="t-body">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {cta && <ArrowButton label={cta.label} href={cta.href} tone="dark" />}
    </Reveal>
  );

  return (
    <section className={clsx("relative", className)}>
      <div className="container-page">
        {/* Equal halves. A grid, not flex: `flex-1` resolves to `flex-basis: 0`
            and would hand the padded visual an extra 100px over the copy.
            DOM order carries both the columns and the stacking order, so the
            half the template puts on the left always comes first. */}
        <div className="grid items-start gap-[30px] min-[810px]:grid-cols-2 min-[1200px]:gap-[70px]">
          {reverse ? (
            <>
              {copy}
              {visualPanel}
            </>
          ) : (
            <>
              {visualPanel}
              {copy}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
