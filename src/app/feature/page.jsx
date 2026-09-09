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

export const metadata = {
  title: "Features — HireDue",
  description:
    "Every feature that runs your job search: smart match discovery, resume tailoring, recruiter outreach and auto-apply across every board you use.",
};

export default function FeaturePage() {
  return (
    <>
      <FeatureHero />
      <Clients />
      <FeatureCapabilities />

      <FeatureAbout
        {...featurePage.signals}
        visual={<JobSearchWorkflowVisual />}
      />

      <FeatureSteps />

      <FeatureAbout
        {...featurePage.depth}
        visual={<ResumeTailoringVisual />}
        reverse
      />

      <FeatureIntegrations />
    </>
  );
}
