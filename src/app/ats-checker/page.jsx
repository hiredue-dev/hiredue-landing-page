import { TrackPageView } from "@/components/site/analytics/TrackPageView";
import { JsonLd } from "@/components/site/seo/JsonLd";
import { AtsChecker } from "@/features/ats/components/AtsChecker";
import { AtsGuide } from "@/features/ats/components/AtsGuide";
import { EVENTS } from "@/lib/analytics";
import { atsChecker } from "@/lib/content";
import { createPageMetadata, getAtsCheckerJsonLd } from "@/lib/seo";

const TITLE = "Free ATS Resume Checker – Instant ATS Score & Fixes";
const DESCRIPTION =
  "Check your resume against ATS for free. Get an instant ATS score, the fixes that matter most, and one-click tailoring to any job description. No sign-up.";

export const metadata = {
  ...createPageMetadata({
    title: TITLE,
    description: DESCRIPTION,
    path: "/ats-checker",
    absoluteTitle: true,
    image: "/ats-checker/opengraph-image",
    imageAlt: "Free ATS Resume Checker by HireDue",
  }),
  keywords: [
    "ATS resume checker",
    "ATS score",
    "free ATS checker",
    "resume checker",
    "ATS friendly resume",
    "resume score",
    "tailor resume to job description",
  ],
};

const jsonLd = getAtsCheckerJsonLd({
  title: "Free ATS Resume Checker",
  description: DESCRIPTION,
  features: [
    "Instant ATS score out of 100",
    "Score breakdown: impact, formatting, sections, skills & keywords, contact info",
    "Top issues ranked by points lost",
    "AI resume optimization",
    "Tailor your resume to a job description",
    "Download the improved resume as a PDF",
    "Matching job search",
  ],
  faq: atsChecker.guide.faq.items,
});

export default function AtsCheckerPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <TrackPageView event={EVENTS.atsPageViewed} />
      <AtsChecker />
      <AtsGuide />
    </>
  );
}
