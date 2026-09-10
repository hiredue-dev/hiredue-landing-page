import { ChangelogHero } from "@/components/site/sections/changelog/ChangelogHero";
import { ChangelogTimeline } from "@/components/site/sections/changelog/ChangelogTimeline";
import { getChangelogEntries } from "@/lib/changelog";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Changelog",
  description:
    "Track what's new, improved, and fixed across the HireDue platform.",
  path: "/changelog",
});

export default async function ChangelogPage() {
  const entries = await getChangelogEntries();

  return (
    <>
      <ChangelogHero />
      <ChangelogTimeline entries={entries} />
    </>
  );
}
