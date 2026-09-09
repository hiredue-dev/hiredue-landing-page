import { AmbassadorHero } from "@/components/site/sections/ambassador/AmbassadorHero";
import { AmbassadorPerks } from "@/components/site/sections/ambassador/AmbassadorPerks";
import { AmbassadorPayouts } from "@/components/site/sections/ambassador/AmbassadorPayouts";
import { AmbassadorSteps } from "@/components/site/sections/ambassador/AmbassadorSteps";
import { AmbassadorWho } from "@/components/site/sections/ambassador/AmbassadorWho";
import { AmbassadorFaq } from "@/components/site/sections/ambassador/AmbassadorFaq";
import { AmbassadorCta } from "@/components/site/sections/ambassador/AmbassadorCta";

export const metadata = {
  title: "Creator Ambassador Program — HireDue",
  description:
    "Make content about HireDue and get paid for it: monthly payouts scaled to your views, plus 80% commission on every plan bought with your referral code.",
};

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
