import { notFound } from "next/navigation";
import { LegalPage } from "@/components/site/sections/legal/LegalPage";
import { client } from "@/lib/sanity/client";
import { LEGAL_PAGE_QUERY } from "@/lib/sanity/queries";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Terms of Service",
  description: "The terms that govern your use of HireDue.",
  path: "/terms",
});

export default async function TermsOfServicePage() {
  const page = await client.fetch(
    LEGAL_PAGE_QUERY,
    { slug: "terms" },
    { next: { revalidate: 60 } },
  );

  if (!page) notFound();

  return <LegalPage eyebrow="Legal" {...page} />;
}
