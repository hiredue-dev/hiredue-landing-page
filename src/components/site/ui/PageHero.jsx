"use client";

import Image from "next/image";
import clsx from "clsx";
import { CloudStage } from "@/components/site/ui/Cloud";
import { Eyebrow } from "@/components/site/ui/Primitives";
import { assets } from "@/lib/assets";
import { HERO_TOP } from "@/lib/layout";
import { appear } from "@/lib/motion";

/*
 * The two page-hero layouts every page but home is built from:
 *   PageHero   centred copy over a narrow (or wide) column — about, career,
 *              changelog, legal, download, 404;
 *   SplitHero  copy on the left, a form or visual on the right from 1200px
 *              up — contact, onboarding call, ambassadors, feature.
 * Both share one top padding, one page-title size and the same eyebrow /
 * description / actions slots, and load in with the CSS `appear` (visible
 * in the server HTML, no JS needed).
 */
/** Eyebrow, h1, description and actions — centred or left-aligned. */
function Heading({ eyebrow, eyebrowTone, title, titleClassName, description, actions, align }) {
  const center = align === "center";
  return (
    <div className={clsx("flex flex-col gap-2.5", center ? "items-center text-center" : "items-start")}>
      {eyebrow && <Eyebrow tone={eyebrowTone}>{eyebrow}</Eyebrow>}
      <h1 className={clsx("t-page-title", titleClassName)}>{title}</h1>
      {typeof description === "string" ? (
        <p
          className={
            center
              ? "t-body-lg max-w-[560px]"
              : "max-w-[600px] text-[18px] leading-[1.3] font-medium text-dim min-[810px]:text-[20px]"
          }
        >
          {description}
        </p>
      ) : (
        description
      )}
      {actions && (
        <div className={clsx("mt-5 flex flex-wrap items-center gap-3", center && "justify-center")}>{actions}</div>
      )}
    </div>
  );
}

/**
 * Centred hero. Whatever follows the heading (a quote, platform cards, the
 * legal text) goes in `children`, 50px below it and the full column wide.
 */
export function PageHero({ eyebrow, title, titleClassName, description, actions, width = "narrow", className, children }) {
  return (
    <section className={clsx("relative", HERO_TOP, className)}>
      <div className={width === "wide" ? "container-wide" : "container-narrow"}>
        <div style={appear(0.1)} className="appear">
          <Heading
            eyebrow={eyebrow}
            title={title}
            titleClassName={titleClassName}
            description={description}
            actions={actions}
            align="center"
          />
        </div>
        {children && <div className="mt-[50px] flex flex-col gap-[50px]">{children}</div>}
      </div>
    </section>
  );
}

/**
 * Split hero. `children` continue the copy column under the heading (stats,
 * bullet points, buttons); `aside` is the right-hand form or visual. `sky`
 * paints the home page's sky and clouds behind it, fading into the page.
 * `asideWidth` "fixed" is a 520px column (forms, cards); "half" splits evenly.
 */
export function SplitHero({
  eyebrow,
  eyebrowTone,
  title,
  titleClassName,
  description,
  aside,
  sky = false,
  asideWidth = "fixed",
  align = "start",
  children,
}) {
  return (
    <section
      className={clsx(
        "relative isolate flex flex-col overflow-hidden bg-white pb-[100px] min-[810px]:pb-[160px] min-[1200px]:pb-[200px]",
        HERO_TOP,
      )}
    >
      {sky && (
        <>
          <Image src={assets.hero.sky} alt="" fill priority sizes="100vw" className="-z-10 object-cover object-top" />
          <CloudStage cloud01={assets.hero.cloud01} cloud02={assets.hero.cloud02} cloud03={assets.hero.cloud03} />
        </>
      )}

      <div className="container-page relative z-[2]">
        <div
          className={clsx(
            "grid gap-[60px] min-[1200px]:gap-[50px]",
            asideWidth === "half" ? "min-[1200px]:grid-cols-2" : "min-[1200px]:grid-cols-[1fr_520px]",
            align === "center" ? "min-[1200px]:items-center" : "min-[1200px]:items-start",
          )}
        >
          <div style={appear(0.1)} className="appear flex flex-col items-start gap-5 min-[1200px]:gap-10">
            <Heading
              eyebrow={eyebrow}
              eyebrowTone={eyebrowTone}
              title={title}
              titleClassName={titleClassName}
              description={description}
              align="start"
            />
            {children}
          </div>

          <div style={appear(0.25)} className="appear w-full">
            {aside}
          </div>
        </div>
      </div>

      {/* fade the sky into the page */}
      {sky && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[100px] bg-[linear-gradient(rgba(255,255,255,0)_0%,rgba(255,255,255,0.7)_25%,#fff_50%)] min-[810px]:h-[160px] min-[1200px]:h-[200px]" />
      )}
    </section>
  );
}
