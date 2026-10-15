import { AtsChecker } from "@/features/ats/components/AtsChecker";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Free ATS Resume Checker",
  description:
    "Upload your resume for an instant ATS score and the fixes that matter most. Optimize it, tailor it to a job description, and find jobs that match — free.",
  path: "/ats-checker",
});

export default function AtsCheckerPage() {
  return <AtsChecker />;
}
