import { Bricolage_Grotesque } from "next/font/google";
import localFont from "next/font/local";
import { GoogleAnalytics } from "@next/third-parties/google";

import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/sections/Footer";
import { JsonLd } from "@/components/site/seo/JsonLd";
import { WhatsAppFloatingButton } from "@/components/site/ui/WhatsAppFloatingButton";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_OPEN_GRAPH_IMAGE,
  DEFAULT_TITLE,
  DEFAULT_TWITTER_IMAGE,
  getOrganizationJsonLd,
  SITE_NAME,
  SITE_URL,
} from "@/lib/seo";
import Providers from "./providers.jsx";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-bricolage",
  display: "swap",
});

const interDisplay = localFont({
  variable: "--font-inter-display",
  display: "swap",
  fallback: ["Inter", "system-ui", "sans-serif"],
  src: [
    {
      path: "../../public/fonts/InterDisplay-500.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/InterDisplay-600.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/InterDisplay-700.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/InterDisplay-900.woff2",
      weight: "900",
      style: "normal",
    },
  ],
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  category: "technology",
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    url: SITE_URL,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: DEFAULT_OPEN_GRAPH_IMAGE,
        width: 1200,
        height: 630,
        alt: DEFAULT_TITLE,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [{ url: DEFAULT_TWITTER_IMAGE, alt: DEFAULT_TITLE }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({ children }) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${interDisplay.variable}`}
    >
      <body className="antialiased">
        <JsonLd data={getOrganizationJsonLd()} />
        <Providers>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <WhatsAppFloatingButton />
        </Providers>
        {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
      </body>
    </html>
  );
}
