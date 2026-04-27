"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { siteContent } from "@/content/site/index.js";
import Button from "@/components/ui/Button/Button.jsx";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const desktopLinks = useMemo(() => siteContent.desktopPrimaryNav, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 36);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleBrandClick = (event) => {
    if (pathname === "/") {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <nav className={`${styles.nav} ${isScrolled ? styles.navScrolled : ""}`.trim()}>
      <motion.div
        className={`${styles.shell} ${isScrolled ? styles.shellScrolled : styles.shellTop}`.trim()}
        initial={false}
        animate={{
          y: isScrolled ? 12 : 0,
          borderRadius: isScrolled ? 999 : 0,
          boxShadow: isScrolled
            ? "0 14px 34px rgba(10, 10, 11, 0.08)"
            : "0 0 0 rgba(10, 10, 11, 0)",
        }}
        transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className={`${styles.container} ${isScrolled ? styles.containerScrolled : ""}`.trim()}>
          <Link href="/" className={styles.brand} onClick={handleBrandClick}>
            <img
              src="/assets/HireDue_Text_Logo.png"
              alt={siteContent.siteConfig.name}
              className={styles.brandLogo}
            />
          </Link>

          <div className={styles.desktopNav}>
            {desktopLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.navLink} ${pathname === link.href ? styles.navLinkActive : ""}`.trim()}
              >
                  {link.label}
              </Link>
            ))}
          </div>

          <div className={styles.desktopActions}>
            <Button className={styles.waitlistButton} onClick={() => router.push("/contact")}>
              Contact Us
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            className={styles.mobileToggle}
            aria-label="Toggle navigation"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className={styles.mobileMenu}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className={styles.mobileMenuInner}>
              {siteContent.navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${styles.mobileLink} ${pathname === link.href ? styles.mobileLinkActive : ""}`.trim()}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Button
                className={styles.mobileAction}
                onClick={() => {
                  setMobileOpen(false);
                  router.push("/contact");
                }}
              >
                Contact Us
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
