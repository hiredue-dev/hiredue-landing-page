import Link from "next/link";
import { Button } from "@/components/site/ui/Button";
import { PageHero } from "@/components/site/ui/PageHero";

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
    <PageHero
      eyebrow="404"
      title="We couldn't find that page"
      description="The link may be old, or the page may have moved. Here are the places people usually look for."
      actions={
        <>
          <Button effect="arrow" ring href="/">Back to home</Button>
          <Button effect="slide" variant="outline" href="/jobs">Browse jobs</Button>
        </>
      }
      className="pb-[100px]"
    >
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
    </PageHero>
  );
}
