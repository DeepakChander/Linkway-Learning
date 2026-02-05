import type { Metadata } from "next";
import HeroSection from "@/components/sections/HeroSection";
import WhyLinkway from "@/components/sections/WhyLinkway";
import CoursePreview from "@/components/sections/CoursePreview";
import MentorsSection from "@/components/sections/MentorsSection";
import HiringPartners from "@/components/sections/HiringPartners";
import Testimonials from "@/components/sections/Testimonials";
import CertificationDisplay from "@/components/sections/CertificationDisplay";
import HomeFAQ from "@/components/sections/HomeFAQ";
import FooterCTA from "@/components/sections/FooterCTA";

export const metadata: Metadata = {
  title: "Linkway Learning - India's #1 Data Analytics & AI Training Institute",
  description:
    "Launch your data career with Linkway Learning. Industry-driven programs in Data Analytics, Data Science, AI, Business Analytics & Investment Banking. 100% placement. Mentors from Google, Amazon & Microsoft.",
  keywords: [
    "data analytics course India",
    "data science course online",
    "AI training institute",
    "business analytics program",
    "100% placement course",
    "Linkway Learning",
    "data analytics placement",
    "learn data science",
    "best data analytics course",
    "online data course with placement",
  ],
  alternates: {
    canonical: "https://linkwaylearning.com",
  },
  openGraph: {
    title: "Linkway Learning - India's #1 Data Analytics & AI Training Institute",
    description:
      "100% placement. Mentors from Google, Amazon & Microsoft. Launch your data career today.",
    url: "https://linkwaylearning.com",
    type: "website",
  },
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <WhyLinkway />
      <CoursePreview />
      <MentorsSection />
      <HiringPartners />
      <Testimonials />
      <CertificationDisplay />
      <HomeFAQ />
      <FooterCTA />
    </>
  );
}
