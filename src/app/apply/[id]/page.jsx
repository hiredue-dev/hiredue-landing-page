import { ApplyPage } from "@/features/apply/components/ApplyPage";
import { fetchCompanyJobForMetadata } from "@/features/apply/services/applyService";
import { jobTitleLine } from "@/features/apply/format";
import { createPageMetadata } from "@/lib/seo";

/*
 * A job a company posted on HireDue, shared as /apply/<id>?utm_… on LinkedIn,
 * Naukri, WhatsApp and the like. The server fetches the public job for the
 * title, link previews and first paint; the client page fetches it again with
 * the visitor's session and runs the application.
 */

// The API host serves the job; open that connection while the page's JavaScript loads.
const API_ORIGIN = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_BACKEND_API_URL).origin;
  } catch {
    return null;
  }
})();

function describe(job) {
  if (!job) return "Apply to this role with your free HireDue account.";
  const company = job.company?.name;
  const where = job.location ? ` in ${job.location}` : "";
  return `${company ? `${company} is hiring` : "Hiring"}: ${job.title}${where}. Apply in a minute with your free HireDue account.`;
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const job = await fetchCompanyJobForMetadata(id);
  return createPageMetadata({
    title: jobTitleLine(job),
    description: describe(job),
    path: `/apply/${encodeURIComponent(id)}`,
    // Closed, paused or unknown jobs shouldn't sit in search results.
    noIndex: job?.status !== "open",
  });
}

export default async function ApplyRoute({ params }) {
  const { id } = await params;
  const job = await fetchCompanyJobForMetadata(id);
  return (
    <>
      {API_ORIGIN && <link rel="preconnect" href={API_ORIGIN} crossOrigin="anonymous" />}
      {/* key: a new id is a new page, with its own state. */}
      <ApplyPage key={id} id={id} initialJob={job} />
    </>
  );
}
