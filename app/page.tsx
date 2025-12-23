import CTA from "@/components/sections/cta/default";
import FAQ from "@/components/sections/faq/default";
import Footer from "@/components/sections/footer/default";
import Hero from "@/components/sections/hero/default";
import Platforms from "@/components/sections/platforms/default";

import Why from "@/components/sections/why/default";
import Metrics from "@/components/sections/metrics/default";
import Bento from "@/components/sections/bento/default";
import How from "@/components/sections/how/defualt";

export default function Home() {
  return (
    <main className="min-h-screen w-full overflow-hidden bg-background text-foreground">
      <Hero />
      <Bento />
      <Platforms />
      <Why />
      <Metrics />
			<How/>
      <FAQ />
      <CTA/>
      <Footer />
    </main>
  );
}
