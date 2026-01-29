import HeroSection from "@/components/sections/HeroSection";
import WhyLinkway from "@/components/sections/WhyLinkway";
import CoursePreview from "@/components/sections/CoursePreview";
import MentorsSection from "@/components/sections/MentorsSection";
import HiringPartners from "@/components/sections/HiringPartners";
import Testimonials from "@/components/sections/Testimonials";
import LeadCaptureSection from "@/components/sections/LeadCaptureSection";
import CertificationDisplay from "@/components/sections/CertificationDisplay";
import HomeFAQ from "@/components/sections/HomeFAQ";
import FooterCTA from "@/components/sections/FooterCTA";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <WhyLinkway />
      <CoursePreview />
      <MentorsSection />
      <HiringPartners />
      <Testimonials />
      <LeadCaptureSection />
      <CertificationDisplay />
      <HomeFAQ />
      <FooterCTA />
    </>
  );
}
