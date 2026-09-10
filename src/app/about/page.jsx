import { AboutStory } from "@/components/site/sections/about/AboutStory";
import { client } from "@/lib/sanity/client";
import { ABOUT_PAGE_QUERY } from "@/lib/sanity/queries";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "About Us",
  description:
    "HireDue is building the AI layer for job seekers — discover, tailor, and apply, while you focus on the interview.",
  path: "/about",
});

export default async function AboutPage() {
  const page = await client.fetch(
    ABOUT_PAGE_QUERY,
    {},
    { next: { revalidate: 60 } },
  );

  return <AboutStory {...page} />;
}
