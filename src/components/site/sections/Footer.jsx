"use client";

import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { ArrowButton, SlideButton } from "@/components/site/ui/Button";
import {
  Reveal,
  RevealGroup,
  RevealItem,
} from "@/components/site/ui/Primitives";
import { assets } from "@/lib/assets";
import { cta, footer } from "@/lib/navigation-content";

export function Footer() {
  /* Same rule as the navbar: hash targets all live on the home page. */
  const pathname = usePathname();
  const to = (href) =>
    pathname === "/" || href === "#" || !href.startsWith("#")
      ? href
      : `/${href}`;

  return (
    <footer className="relative isolate overflow-hidden py-[100px]">
      <Image
        src={assets.footer.bg}
        alt=""
        fill
        sizes="100vw"
        className="-z-10 object-cover"
      />
      <span className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(#fff_0%,#fff_0%,rgba(255,255,255,0.3)_14%,rgba(255,255,255,0)_40%)]" />

      <div className="container-page">
        <div className="flex flex-col gap-[60px] md:gap-[100px]">
          {/* closing call to action */}
          <Reveal className="mx-auto flex max-w-[600px] flex-col items-center gap-10">
            <div className="flex flex-col gap-2.5">
              <h2 className="t-h2 text-center whitespace-pre-line">
                {cta.title}
              </h2>
              <p className="t-body-lg text-center">{cta.description}</p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-5">
              <ArrowButton
                label={cta.primary.label}
                href={to(cta.primary.href)}
                tone="primary"
              />
              <SlideButton
                label={cta.secondary.label}
                href={to(cta.secondary.href)}
                tone="white"
              />
            </div>
          </Reveal>

          {/* site map */}
          <Reveal
            y={30}
            className="rounded-[30px] bg-white p-[30px] md:p-[100px]"
          >
            <div className="flex flex-col gap-[60px]">
              <div className="flex flex-col gap-[50px] lg:flex-row lg:gap-[100px]">
                <div className="flex flex-col gap-10 lg:w-[340px]">
                  <div className="flex flex-col gap-5">
                    <p className="t-body">{footer.description}</p>
                    <p className="font-display text-[28px] leading-none font-bold text-ink">
                      {footer.brand}
                    </p>
                  </div>
                  <SlideButton
                    label={footer.email}
                    href={`mailto:${footer.email}`}
                    tone="ink"
                    className="self-start"
                  />
                </div>

                <RevealGroup
                  step={0.08}
                  className="grid flex-1 gap-[30px] sm:grid-cols-3"
                >
                  {footer.columns.map((column) => (
                    <RevealItem
                      key={column.title}
                      className="flex flex-col gap-5"
                    >
                      <p className="text-[20px] leading-[1.3] font-medium text-ink">
                        {column.title}
                      </p>
                      <ul className="flex flex-col gap-4">
                        {column.links.map((link) => (
                          <li key={link.label}>
                            <FooterLink
                              href={to(link.href)}
                              className={clsx(
                                "t-body transition-colors duration-300",
                                /* the template tints the link for the page
                                   you are currently on */
                                link.href === pathname
                                  ? "text-brand"
                                  : "hover:text-ink",
                              )}
                            >
                              {link.label}
                            </FooterLink>
                          </li>
                        ))}
                      </ul>
                    </RevealItem>
                  ))}
                </RevealGroup>
              </div>

              <div className="flex flex-col gap-5 border-t border-line pt-[30px] sm:flex-row sm:items-center sm:justify-between">
                <p className="t-body">{footer.copyright}</p>
                <ul className="flex items-center gap-4">
                  {footer.socials
                    .filter((social) => Boolean(social.href))
                    .map((social) => (
                      <li key={social.name}>
                        <a
                          href={social.href}
                          target="_blank"
                          rel="noreferrer noopener"
                          aria-label={social.name}
                          className="grid size-8 place-items-center rounded-[10px] bg-surface transition-colors duration-300 hover:bg-line"
                        >
                          <Image
                            src={social.icon}
                            alt=""
                            width={14}
                            height={14}
                            className="size-3.5"
                          />
                        </a>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */

/** Routes go through the router; in-page hashes stay plain anchors. */
function FooterLink({ href, className, children }) {
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}
