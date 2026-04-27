import styles from "./HomePage.module.css";
import HeroSection from "@/components/sections/Hero/HeroSection.jsx";
import DashboardTiltShowcaseSection from "@/components/sections/DashboardTiltShowcase/DashboardTiltShowcaseSection.jsx";
import TrustCarouselSection from "@/components/sections/TrustCarousel/TrustCarouselSection.jsx";
import ProblemSection from "@/components/sections/Problem/ProblemSection.jsx";
import HowItWorksSection from "@/components/sections/HowItWorks/HowItWorksSection.jsx";
import FeaturesGridSection from "@/components/sections/FeaturesGrid/FeaturesGridSection.jsx";
import PlatformMetricsSection from "@/components/sections/PlatformMetrics/PlatformMetricsSection.jsx";
import TestimonialsSection from "@/components/sections/Testimonials/TestimonialsSection.jsx";
import FeatureVotingSection from "@/components/sections/FeatureVoting/FeatureVotingSection.jsx";
import FAQSection from "@/components/sections/FAQ/FAQSection.jsx";

const HomePage = () => (
  <div className={styles.page}>
    <HeroSection />
    <DashboardTiltShowcaseSection />
    <TrustCarouselSection />
    <ProblemSection />
    <FeaturesGridSection />
    <PlatformMetricsSection />
    <HowItWorksSection />
    <FeatureVotingSection />
    <TestimonialsSection />
    <FAQSection />
  </div>
);

export default HomePage;
