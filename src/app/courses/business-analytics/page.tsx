import type { Metadata } from "next";
import BusinessAnalyticsPage from "./BusinessAnalyticsPage";
import { CourseJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Business Analytics Course — BI Tools, Predictive Analytics, AI",
  description:
    "Master BI tools, predictive analytics, and AI-powered decision-making. Designed for professionals, MBAs, and business leaders. Placement support included at Linkway Learning.",
  alternates: { canonical: "https://linkwaylearning.com/courses/business-analytics" },
  openGraph: {
    title: "Business Analytics Course — BI, Predictive Analytics, AI",
    description: "For professionals & MBAs. Master BI tools and AI-powered analytics.",
    url: "https://linkwaylearning.com/courses/business-analytics",
  },
};

export default function Page() {
  return (
    <>
      <CourseJsonLd
        name="Business Analytics Course"
        description="Master BI tools, predictive analytics, and AI-powered decision-making for professionals and MBAs."
        url="https://linkwaylearning.com/courses/business-analytics"
        duration="P5M"
        skills={["Power BI", "Tableau", "Predictive Analytics", "AI Decision Making", "SQL", "Excel"]}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://linkwaylearning.com" },
          { name: "Courses", url: "https://linkwaylearning.com/courses" },
          { name: "Business Analytics", url: "https://linkwaylearning.com/courses/business-analytics" },
        ]}
      />
      <BusinessAnalyticsPage />
    </>
  );
}
