import { Suspense } from "react";
import { JobBoard, JobBoardFallback } from "@/features/jobs/components/JobBoard";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Jobs",
  description:
    "Browse fresh job openings from LinkedIn, Indeed, Greenhouse, Lever and more. Filter by role, location and date, and apply with a free HireDue account.",
  path: "/jobs",
});

// The board's data comes from the API host; open that connection (DNS + TLS,
// ~0.3 s measured) while the page's JavaScript is still loading.
const API_ORIGIN = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_BACKEND_API_URL).origin;
  } catch {
    return null;
  }
})();

export default function JobsPage() {
  return (
    <>
      {API_ORIGIN && <link rel="preconnect" href={API_ORIGIN} crossOrigin="anonymous" />}
      {/* The board reads filters from the URL (useSearchParams), which needs a Suspense boundary. */}
      <Suspense fallback={<JobBoardFallback />}>
        <JobBoard />
      </Suspense>
    </>
  );
}
