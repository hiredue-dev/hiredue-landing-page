import { CareerHero } from "@/components/site/sections/career/CareerHero";
import { CareerOpenings } from "@/components/site/sections/career/CareerOpenings";
import { client } from "@/lib/sanity/client";
import { JOB_OPENINGS_QUERY } from "@/lib/sanity/queries";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Careers",
  description: "Join HireDue and help build the AI layer for job seekers.",
  path: "/career",
});

export default async function CareerPage() {
  const jobOpenings = await client.fetch(
    JOB_OPENINGS_QUERY,
    {},
    { next: { revalidate: 60 } },
  );

  return (
    <>
      <CareerHero />
      <CareerOpenings items={jobOpenings?.length ? jobOpenings : undefined} />
    </>
  );
}
