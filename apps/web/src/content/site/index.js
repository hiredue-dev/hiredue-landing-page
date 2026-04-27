import { contactConfig, footerLinks, navigationLinks, siteConfig } from "@hiredue/config";
import { assetMap } from "./assets.js";

const desktopPrimaryNavOrder = ["/", "/changelog", "/about", "/contact", "/career"];
const desktopPrimaryNav = desktopPrimaryNavOrder
  .map((href) => navigationLinks.find((link) => link.href === href))
  .filter(Boolean);

export const siteContent = {
  siteConfig,
  desktopPrimaryNav,
  navigationLinks,
  footerLinks,
  contactConfig,
  assetMap,
};
