import { AmbassadorHero } from "@/components/site/sections/ambassador/AmbassadorHero";
import { AmbassadorPerks } from "@/components/site/sections/ambassador/AmbassadorPerks";
import { AmbassadorPayouts } from "@/components/site/sections/ambassador/AmbassadorPayouts";
import { AmbassadorSteps } from "@/components/site/sections/ambassador/AmbassadorSteps";
import { AmbassadorWho } from "@/components/site/sections/ambassador/AmbassadorWho";
import { AmbassadorFaq } from "@/components/site/sections/ambassador/AmbassadorFaq";
import { AmbassadorCta } from "@/components/site/sections/ambassador/AmbassadorCta";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Creator Ambassador Program",
  description:
    "Share HireDue with your audience and earn 80% commission on every eligible plan bought through your referral code.",
  path: "/ambassadors",
});

export default function AmbassadorsPage() {
  return (
    <>
      <AmbassadorHero />
      <AmbassadorPerks />
      <AmbassadorPayouts />
      <AmbassadorSteps />
      <AmbassadorWho />
      <AmbassadorFaq />
      <AmbassadorCta />
    </>
  );
}
