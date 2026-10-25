import Link from "next/link";
import { ArrowButton, SlideButton } from "@/components/site/ui/Button";
import { Eyebrow } from "@/components/site/ui/Primitives";

export const metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

/* Where a lost visitor most likely meant to go. */
const DESTINATIONS = [
  { label: "Features", body: "What HireDue does for your search", href: "/feature" },
  { label: "Jobs", body: "Fresh roles from every major board", href: "/jobs" },
  { label: "ATS checker", body: "Score your resume in seconds, free", href: "/ats-checker" },
  { label: "Blog", body: "Guides and comparisons", href: "/blog" },
  { label: "Contact", body: "Talk to the team", href: "/contact" },
];

export default function NotFound() {
  return (
    <section className="relative pt-[140px] pb-[100px] min-[810px]:pt-[170px] min-[1200px]:pt-[194px]">
      <div className="mx-auto w-full max-w-[860px] px-[30px]">
        <div className="flex flex-col items-center gap-[50px]">
          <div className="flex flex-col items-center gap-2.5">
            <Eyebrow>404</Eyebrow>
            <h1 className="t-h2 text-center">We couldn&apos;t find that page</h1>
            <p className="t-body-lg max-w-[560px] text-center">
              The link may be old, or the page may have moved. Here are the places people usually look
              for.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <ArrowButton label="Back to home" href="/" />
              <SlideButton label="Browse jobs" href="/jobs" tone="outline" />
            </div>
          </div>

          <ul className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {DESTINATIONS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex h-full flex-col gap-1 rounded-[20px] bg-surface p-5 transition-colors duration-300 hover:bg-line"
                >
                  <span className="text-[17px] leading-[1.3] font-semibold text-ink">{item.label}</span>
                  <span className="t-body-sm">{item.body}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
