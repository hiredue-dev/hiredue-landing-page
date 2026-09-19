import { AtsDashboard } from "@/features/ats/components/AtsDashboard";
import { ats } from "@/lib/content";
import { createPageMetadata } from "@/lib/seo";

const path = "/ats/dashboard";

export const metadata = createPageMetadata({
  title: ats.dashboard.meta.title,
  description: ats.dashboard.meta.description,
  path,
  // Results are only meaningful after a scan; keep the results route out of
  // search indexes so crawlers don't surface an empty dashboard.
  noIndex: true,
});

export default function AtsDashboardPage() {
  return <AtsDashboard />;
}