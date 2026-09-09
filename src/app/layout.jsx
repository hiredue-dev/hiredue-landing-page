import { Bricolage_Grotesque } from "next/font/google";
import localFont from "next/font/local";

import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/sections/Footer";
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
    { path: "../../public/fonts/InterDisplay-500.woff2", weight: "500", style: "normal" },
    { path: "../../public/fonts/InterDisplay-600.woff2", weight: "600", style: "normal" },
    { path: "../../public/fonts/InterDisplay-700.woff2", weight: "700", style: "normal" },
    { path: "../../public/fonts/InterDisplay-900.woff2", weight: "900", style: "normal" },
  ],
});

export const metadata = {
  /* absolute URLs for the Open Graph images the blog posts declare */
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://hiredue.com"),
  title: "HireDue — AI job search automation",
  description:
    "HireDue discovers relevant roles, tailors your resume, applies faster, and reaches recruiters automatically — so you can focus on interviews.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${bricolage.variable} ${interDisplay.variable}`}>
      <body className="antialiased">
        <Providers>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
