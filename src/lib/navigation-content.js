import { assets } from "@/lib/assets";

export const nav = {
  brand: "HireDue",
  links: [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Use Cases", href: "#use-cases" },
    { label: "Pricing", href: "/pricing" },
  ],
  cta: { label: "Get Started Free", href: "/signup" },
};

export const cta = {
  title: "Stop applying.\nStart interviewing.",
  description:
    "HireDue is live. Create your account, install the desktop app, and let it run your job search end to end.",
  primary: { label: "Get Started Free", href: "/signup" },
  secondary: { label: "Download the App", href: "/download" },
};

export const footer = {
  description:
    "Your AI-powered job search automation platform. Spend less time applying, more time preparing.",
  brand: "HireDue",
  email: "support@hiredue.com",
  columns: [
    {
      title: "Quick links",
      links: [
        { label: "Features", href: "#features" },
        { label: "How It Works", href: "#how-it-works" },
        { label: "Use Cases", href: "#use-cases" },
        { label: "Integrations", href: "#integrations" },
      ],
    },
    {
      title: "Pages",
      links: [
        { label: "About", href: "/about" },
        { label: "Feature", href: "/feature" },
        { label: "Ambassadors", href: "/ambassadors" },
        { label: "Blog", href: "/blog" },
        { label: "Career", href: "/career" },
        { label: "Pricing", href: "/pricing" },
        { label: "Download", href: "/download" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "FAQs", href: "#faqs" },
        { label: "Contact", href: "/contact" },
        { label: "Changelog", href: "/changelog" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms & Conditions", href: "/terms" },
      ],
    },
  ],
  copyright: "© 2026 HireDue. All rights reserved.",
  socials: [
    {
      name: "Instagram",
      icon: assets.footer.social[0],
      href: process.env.NEXT_PUBLIC_INSTAGRAM_URL,
    },
    {
      name: "LinkedIn",
      icon: assets.footer.social[1],
      href: process.env.NEXT_PUBLIC_LINKEDIN_URL,
    },
    {
      name: "Facebook",
      icon: assets.footer.social[2],
      href: process.env.NEXT_PUBLIC_FACEBOOK_URL,
    },
    {
      name: "X",
      icon: assets.footer.social[3],
      href: process.env.NEXT_PUBLIC_TWITTER_URL,
    },
  ],
};
