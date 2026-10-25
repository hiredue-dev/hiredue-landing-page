import { Clients } from "@/components/site/sections/Clients";
import { FeatureHero } from "@/components/site/sections/feature/FeatureHero";
import { FeatureAbout } from "@/components/site/sections/feature/FeatureAbout";
import { FeatureCapabilities } from "@/components/site/sections/feature/FeatureCapabilities";
import { FeatureSteps } from "@/components/site/sections/feature/FeatureSteps";
import { FeatureIntegrations } from "@/components/site/sections/feature/FeatureIntegrations";
import {
  JobSearchWorkflowVisual,
  ResumeTailoringVisual,
} from "@/components/site/sections/feature/feature-visuals";
import { featurePage } from "@/lib/content";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Automate Job Discovery, Resume Tailoring & Outreach",
  description:
    "Every feature that runs your job search: smart match discovery, resume tailoring, recruiter outreach and auto-apply across every board you use.",
  path: "/feature",
});

export default function FeaturePage() {
  return (
    <>
      <FeatureHero />
      <Clients />
      <FeatureCapabilities />

      <FeatureAbout
        {...featurePage.signals}
        visual={
          <Illustration label="Animated mockup: HireDue finding a role, then sending a LinkedIn message and an email to the hiring team">
            <JobSearchWorkflowVisual />
          </Illustration>
        }
      />

      <FeatureSteps />

      <FeatureAbout
        {...featurePage.depth}
        visual={
          <Illustration label="Animated mockup: a resume being tailored to a job, its ATS score rising from 68 to 96">
            <ResumeTailoringVisual />
          </Illustration>
        }
        reverse
      />

      <FeatureIntegrations />
    </>
  );
}

/* The product mockups are drawn in miniature (7-11px UI text), like a
   screenshot. Read as one image with a description, rather than as dozens
   of tiny fragments. */
function Illustration({ label, children }) {
  return (
    <div role="img" aria-label={label}>
      {children}
    </div>
  );
}
