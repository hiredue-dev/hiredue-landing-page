import { JobBoardFallback } from "@/features/jobs/components/JobBoard";

/* The board's own placeholder, plus the progress bar the other routes show. */
export default function Loading() {
  return (
    <div role="status" aria-busy="true" aria-label="Loading jobs">
      <span className="route-progress" aria-hidden />
      <JobBoardFallback />
    </div>
  );
}
