import { OnboardingCallHero } from "@/components/site/sections/onboarding-call/OnboardingCallHero";
import { OnboardingCallFaq } from "@/components/site/sections/onboarding-call/OnboardingCallFaq";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Live Onboarding Call",
  description:
    "Join our live onboarding call, every day at 9:30 PM IST, for a live demo and to optimize your profile with the HireDue team.",
  path: "/onboarding-call",
  noIndex: true,
});

export default function OnboardingCallPage() {
  return (
    <>
      <OnboardingCallHero />
      <OnboardingCallFaq />
    </>
  );
}
