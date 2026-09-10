import { ContactHero } from "@/components/site/sections/contact/ContactHero";
import { ContactTeam } from "@/components/site/sections/contact/ContactTeam";
import { ContactFaq } from "@/components/site/sections/contact/ContactFaq";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Contact Support and Sales",
  description:
    "Get in touch with the HireDue team for sales, support, or partnership inquiries.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <ContactTeam />
      <ContactFaq />
    </>
  );
}
