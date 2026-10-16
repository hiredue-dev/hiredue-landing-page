import { Suspense } from "react";
import { DownloadStarted } from "@/features/jobs/components/DownloadStarted";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Your download has started",
  description: "The HireDue desktop app is downloading. Open it, sign in, and it applies to jobs for you.",
  path: "/download/started",
  noIndex: true,
});

export default function DownloadStartedPage() {
  // useSearchParams (for ?job=) needs a Suspense boundary.
  return (
    <Suspense fallback={null}>
      <DownloadStarted />
    </Suspense>
  );
}
