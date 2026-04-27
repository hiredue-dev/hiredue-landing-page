import { assetMap } from "@/content/site/assets.js";

export const heroContent = {
  announcement: {
    tag: "New",
    text: " Version 1 Coming Soon... ",
  },
  headingPrefix: "Automate the",
  headingHighlight: "complete job hunt",
  description:
    "HireDue discovers relevant roles, tailors your resume, applies faster, and reaches recruiters automatically so you can focus on interviews.",
  inlineCtaLabel: "Get Early Access",
  microTrustLine: "Early access for the first beta cohort.",
  trustBadge: {
    prefix: "Trusted by",
    highlight: "300+",
    suffix: "Beta users",
    avatars: [
      { src: "/assets/AboutUs/RishabhBagaria.png", alt: "Community member 1" },
      { src: "/assets/AboutUs/SanglapKundu.png", alt: "Community member 2" },
      { src: "/assets/AboutUs/ShivamKasera.png", alt: "Community member 3" },
    ],
  },
  emailPlaceholder: "Enter your email",
  visual: {
    splineScene: assetMap.hero.splineScene,
    waves: [
      { rx: 318, ry: 74, duration: 11.2, delay: 0, opacity: 0.2 },
      { rx: 254, ry: 58, duration: 9.8, delay: 0.25, opacity: 0.26 },
      { rx: 198, ry: 44, duration: 8.4, delay: 0.5, opacity: 0.3 },
    ],
  },
};
