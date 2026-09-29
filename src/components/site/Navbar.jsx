"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { ArrowButton } from "@/components/site/ui/Button";
import { useAuth } from "@/features/auth/context/AuthContext.jsx";
import { nav } from "@/lib/navigation-content";
import { spring } from "@/lib/motion";

const sectionIds = ["features", "how-it-works", "overview", "pricing"];

export function Navbar() {
  const [active, setActive] = useState(null);
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();

  /* Every hash target lives on the home page, so off-home the same hashes have
     to be prefixed with `/` to get there first. Real routes pass through. */
  const pathname = usePathname();
  const to = (href) =>
    pathname === "/" || href === "#" || !href.startsWith("#")
      ? href
      : `/${href}`;

  /* Highlight the pill for whichever section owns the middle of the screen. */
  useEffect(() => {
    const targets = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el) => Boolean(el));

    const onScroll = () => {
      const mid = window.innerHeight / 2;
      let current = null;
      for (const el of targets) {
        const { top, bottom } = el.getBoundingClientRect();
        if (top <= mid && bottom >= mid) current = el.id;
      }
      setActive(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  /* close both menus whenever the route changes */
  useEffect(() => {
    setOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!userMenuOpen) return;
    const onClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [userMenuOpen]);

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    setOpen(false);
    router.replace("/");
  };

  const initial = (user?.email || "?").slice(0, 1).toUpperCase();

  return (
    <>
      <motion.header
        initial={{ opacity: 0.001, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={spring(0.6, 0.1)}
        className="fixed inset-x-0 top-0 z-50 py-5"
      >
        <div className="mx-auto w-full max-w-[940px] px-[30px]">
          {/*
           * Logo and the right-side (CTA/avatar) sit in normal flex flow, pushed to
           * the ends by ml-auto on the right side; the nav pill is pulled out of
           * flow and centered on the bar itself. A 1fr/auto/1fr grid looked
           * symmetric in theory, but CSS grows a flex track past its 1fr share once
           * its content's min-width needs it (the CTA button did), which starved
           * the other 1fr column and threw the centered nav off by ~10px.
           *
           * Both end columns also get the same fixed width at lg+ (RIGHT_COL_W),
           * sized to the widest thing that ever sits in either: "Download the
           * App" (~178px). The logo (~103px) is narrower and the signed-in
           * avatar (~70px) narrower still, so without this the right side's
           * footprint — and the whitespace framing the centered nav — visibly
           * changed size depending on sign-in state. Reserving the same slot on
           * both sides regardless of what's inside it keeps the bar's
           * composition constant whether signed in, signed out, or the CTA
           * swaps for the avatar.
           */}
          <div className="relative flex items-center gap-5 rounded-[10px] bg-white p-2.5 shadow-[0_0_0_4px_rgba(221,229,237,0.7)]">
            <Link href="/" className="flex shrink-0 items-center pl-1.5 lg:w-[184px]">
              <Image
                src="/assets/Brand_logos/full_logo_dark.svg"
                alt={nav.brand}
                width={260}
                height={64}
                priority
                className="h-6 w-auto"
              />
            </Link>

            <nav className="hidden items-center gap-0.5 lg:absolute lg:inset-y-0 lg:left-1/2 lg:flex lg:-translate-x-1/2">
              {nav.links.map((link) => {
                const id = link.href.replace("#", "");
                const isActive = link.href.startsWith("#")
                  ? active === id
                  : pathname === link.href;
                return (
                  <NavLink
                    key={link.label}
                    href={to(link.href)}
                    className={clsx(
                      "rounded-full px-3.5 py-2 text-center text-[15px] leading-[1.3] font-semibold whitespace-nowrap transition-colors duration-300",
                      isActive
                        ? "bg-surface text-ink"
                        : "text-dim hover:bg-surface hover:text-ink",
                    )}
                  >
                    {link.label}
                  </NavLink>
                );
              })}
            </nav>

            <div className="ml-auto hidden lg:flex lg:w-[184px] lg:items-center lg:justify-end">
              {isAuthenticated ? (
                <div ref={userMenuRef} className="relative">
                  <button
                    type="button"
                    aria-haspopup="menu"
                    aria-expanded={userMenuOpen}
                    aria-label="Account menu"
                    onClick={() => setUserMenuOpen((v) => !v)}
                    className="flex items-center gap-2 rounded-full bg-surface p-1 pr-3 transition-colors duration-300 hover:bg-line"
                  >
                    <span className="grid size-7 place-items-center rounded-full bg-brand text-[13px] font-semibold text-white">
                      {initial}
                    </span>
                    <Chevron open={userMenuOpen} />
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        role="menu"
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={spring(0.3)}
                        className="absolute top-[calc(100%+10px)] right-0 min-w-[220px] rounded-[10px] bg-white p-1.5 shadow-[0_0_0_4px_rgba(221,229,237,0.7)]"
                      >
                        <p className="truncate px-3 py-2 text-[13px] leading-[1.3] font-medium text-dim">
                          {user?.email}
                        </p>
                        <MenuLink href="/account">Account</MenuLink>
                        <MenuLink href="/download">Download app</MenuLink>
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full rounded-[6px] px-3 py-2 text-left text-[15px] leading-[1.3] font-semibold text-ink transition-colors duration-300 hover:bg-surface"
                        >
                          Log out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <ArrowButton
                  label={nav.cta.label}
                  href={to(nav.cta.href)}
                  tone="dark"
                  size="sm"
                  ring={false}
                />
              )}
            </div>

            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="ml-auto grid size-9 place-items-center rounded-full bg-surface lg:hidden"
            >
              <span className="relative block h-3 w-4">
                <motion.span
                  animate={open ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
                  transition={spring(0.35)}
                  className="absolute inset-x-0 top-0 h-0.5 rounded-full bg-ink"
                />
                <motion.span
                  animate={open ? { opacity: 0 } : { opacity: 1 }}
                  transition={{ duration: 0.15 }}
                  className="absolute inset-x-0 top-[5px] h-0.5 rounded-full bg-ink"
                />
                <motion.span
                  animate={open ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
                  transition={spring(0.35)}
                  className="absolute inset-x-0 top-[10px] h-0.5 rounded-full bg-ink"
                />
              </span>
            </button>
          </div>

          <AnimatePresence>
            {open && (
              <motion.nav
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={spring(0.4)}
                className="mt-2.5 flex flex-col gap-1 rounded-[10px] bg-white p-2.5 shadow-[0_0_0_4px_rgba(221,229,237,0.7)] lg:hidden"
              >
                {nav.links.map((link) => (
                  <NavLink
                    key={link.label}
                    href={to(link.href)}
                    onClick={() => setOpen(false)}
                    className="rounded-full px-4 py-2.5 text-[16px] font-semibold text-dim"
                  >
                    {link.label}
                  </NavLink>
                ))}

                {isAuthenticated ? (
                  <>
                    <NavLink
                      href="/account"
                      onClick={() => setOpen(false)}
                      className="rounded-full px-4 py-2.5 text-[16px] font-semibold text-dim"
                    >
                      Account
                    </NavLink>
                    <NavLink
                      href="/download"
                      onClick={() => setOpen(false)}
                      className="rounded-full px-4 py-2.5 text-[16px] font-semibold text-dim"
                    >
                      Download app
                    </NavLink>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="rounded-full px-4 py-2.5 text-left text-[16px] font-semibold text-dim"
                    >
                      Log out
                    </button>
                  </>
                ) : (
                  <div className="pt-1.5">
                    <ArrowButton
                      label={nav.cta.label}
                      href={to(nav.cta.href)}
                      tone="dark"
                      size="sm"
                      ring={false}
                      className="w-full [&>span]:w-full"
                    />
                  </div>
                )}
              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[10px] lg:hidden"
          />
        )}
      </AnimatePresence>
    </>
  );
}

/* ------------------------------------------------------------------ */

/** Routes go through the router; in-page hashes stay plain anchors. */
function NavLink({ href, className, onClick, children }) {
  if (href.startsWith("#")) {
    return (
      <a href={href} className={className} onClick={onClick}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}

function MenuLink({ href, children }) {
  return (
    <Link
      href={href}
      className="block rounded-[6px] px-3 py-2 text-[15px] leading-[1.3] font-semibold text-ink transition-colors duration-300 hover:bg-surface"
    >
      {children}
    </Link>
  );
}

function Chevron({ open }) {
  return (
    <motion.svg
      width="10"
      height="6"
      viewBox="0 0 10 6"
      fill="none"
      aria-hidden
      animate={{ rotate: open ? 180 : 0 }}
      transition={spring(0.3)}
    >
      <path
        d="M1 1L5 5L9 1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-ink"
      />
    </motion.svg>
  );
}
