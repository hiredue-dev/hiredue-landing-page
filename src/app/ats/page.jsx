import { AtsLanding } from "@/features/ats/components/AtsLanding";
import { ats } from "@/lib/content";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: ats.page.meta.title,
  description: ats.page.meta.description,
  path: "/ats",
});

export default function AtsPage() {
  return <AtsLanding />;
}