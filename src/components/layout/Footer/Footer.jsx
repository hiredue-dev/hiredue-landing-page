import Link from "next/link";
import { Linkedin, Twitter } from "lucide-react";
import { siteContent } from "@/content/site/index.js";
import Button from "@/components/ui/Button/Button.jsx";
import styles from "./Footer.module.css";

const Footer = () => (
  <footer className={styles.footer}>
    <div className={styles.container}>
      <div className={styles.grid}>
        <div className={styles.brandBlock}>
          <span className={styles.brand}>{siteContent.siteConfig.name}</span>
          <p className={styles.description}>
            {siteContent.siteConfig.description}
          </p>
          <div className={styles.socials}>
            <a href="#" className={styles.socialLink} aria-label="Twitter">
              <Twitter size={18} />
            </a>
            <a href="#" className={styles.socialLink} aria-label="LinkedIn">
              <Linkedin size={18} />
            </a>
          </div>
          <p className={styles.support}>Support: {siteContent.contactConfig.supportEmail}</p>
          <Button as={Link} href="/contact" className={styles.waitlistCta}>
            Contact Us
          </Button>
        </div>

        {siteContent.footerLinks.map((group) => (
          <div key={group.title}>
            <h4 className={styles.columnTitle}>{group.title}</h4>
            <div className={styles.linkColumn}>
              {group.links.map((link) => (
                <Link key={link.href} href={link.href} className={styles.link}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.bottomBar}>
        <p className={styles.copyright}>© {new Date().getFullYear()} {siteContent.siteConfig.name}. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
