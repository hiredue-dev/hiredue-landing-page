import CTA from "@/components/sections/cta/default";
import FAQ from "@/components/sections/faq/default";
import Footer from "@/components/sections/footer/default";
import Hero from "@/components/sections/hero-aboutus/default";
// import Logos from "@/components/sections/logos/default";
import Navbar from "@/components/sections/navbar/default";
import Pricing from "@/components/sections/pricing/default";
import Why from "@/components/sections/why/default";
import Metrics from "@/components/sections/metrics/default";
import Bento from "@/components/sections/bento/default";

export default function Home() {
  return (
    <main className="min-h-screen w-full overflow-hidden bg-background text-foreground">
      {/* <Navbar /> */}
      <Hero className="mt-15 md:mt-0 md:py-24"/>
      <CTA />
      <Footer />
    </main>
  );
}
