import { notFound } from "next/navigation";
import { LegalPage } from "@/components/site/sections/legal/LegalPage";
import { client } from "@/lib/sanity/client";
import { LEGAL_PAGE_QUERY } from "@/lib/sanity/queries";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Privacy Policy",
  description:
    "How HireDue collects, uses, stores, and safeguards your personal information.",
  path: "/privacy",
});

export default async function PrivacyPolicyPage() {
  const page = await client.fetch(
    LEGAL_PAGE_QUERY,
    { slug: "privacy" },
    { next: { revalidate: 60 } },
  );

  if (!page) notFound();

  return <LegalPage eyebrow="Legal" {...page} />;
}
