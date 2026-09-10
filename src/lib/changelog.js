import { client } from "@/lib/sanity/client";
import { urlFor } from "@/lib/sanity/image";
import { CHANGELOG_QUERY } from "@/lib/sanity/queries";

export function formatChangelogDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

const imageUrl = (image) =>
  image ? urlFor(image).width(1200).height(720).fit("crop").url() : null;

export async function getChangelogEntries() {
  const entries = await client.fetch(
    CHANGELOG_QUERY,
    {},
    { next: { revalidate: 60 } },
  );
  return entries.map((entry) => ({ ...entry, image: imageUrl(entry.image) }));
}
