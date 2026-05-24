"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, LogOut, Menu, User, X } from "lucide-react";

import { siteContent } from "@/content/site/index.js";
import Button from "@/components/ui/Button/Button.jsx";
import { useAuth } from "@/features/auth/context/AuthContext.jsx";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();

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
    setUserMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!userMenuOpen) return;
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [userMenuOpen]);

  const handleBrandClick = (event) => {
    if (pathname === "/") {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    router.replace("/");
  };

  const initials = (user?.email || "?").slice(0, 1).toUpperCase();

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
            <Link
              href="/pricing"
              className={`${styles.navLink} ${pathname === "/pricing" ? styles.navLinkActive : ""}`.trim()}
            >
              Pricing
            </Link>
          </div>

          <div className={styles.desktopActions}>
            {isAuthenticated ? (
              <div ref={userMenuRef} style={{ position: "relative" }}>
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((open) => !open)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 14px",
                    borderRadius: 999,
                    border: "1px solid var(--color-border)",
                    background: "var(--color-background)",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                  }}
                >
                  <span
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 999,
                      background: "var(--color-primary)",
                      color: "#fff",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.75rem",
                    }}
                  >
                    {initials}
                  </span>
                  <ChevronDown size={14} />
                </button>
                {userMenuOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 8px)",
                      right: 0,
                      minWidth: 200,
                      background: "var(--color-background)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 14,
                      boxShadow: "0 18px 40px rgba(10,10,11,0.12)",
                      padding: 6,
                      zIndex: 60,
                    }}
                  >
                    <div style={{ padding: "10px 12px", fontSize: "0.75rem", color: "var(--color-muted-foreground)" }}>
                      {user?.email}
                    </div>
                    <Link
                      href="/account"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "10px 12px",
                        borderRadius: 10,
                        color: "var(--color-foreground)",
                        textDecoration: "none",
                        fontSize: "0.875rem",
                      }}
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <User size={16} /> Account
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "10px 12px",
                        borderRadius: 10,
                        background: "transparent",
                        border: 0,
                        color: "var(--color-foreground)",
                        cursor: "pointer",
                        fontSize: "0.875rem",
                      }}
                    >
                      <LogOut size={16} /> Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className={styles.navLink} style={{ marginRight: 4 }}>
                  Log in
                </Link>
                <Button className={styles.waitlistButton} onClick={() => router.push("/signup")}>
                  Sign up
                </Button>
              </>
            )}
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
              <Link
                href="/pricing"
                className={`${styles.mobileLink} ${pathname === "/pricing" ? styles.mobileLinkActive : ""}`.trim()}
                onClick={() => setMobileOpen(false)}
              >
                Pricing
              </Link>
              {isAuthenticated ? (
                <>
                  <Link
                    href="/account"
                    className={styles.mobileLink}
                    onClick={() => setMobileOpen(false)}
                  >
                    Account
                  </Link>
                  <Button
                    className={styles.mobileAction}
                    variant="secondary"
                    onClick={() => {
                      setMobileOpen(false);
                      handleLogout();
                    }}
                  >
                    Log out
                  </Button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className={styles.mobileLink}
                    onClick={() => setMobileOpen(false)}
                  >
                    Log in
                  </Link>
                  <Button
                    className={styles.mobileAction}
                    onClick={() => {
                      setMobileOpen(false);
                      router.push("/signup");
                    }}
                  >
                    Sign up
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
