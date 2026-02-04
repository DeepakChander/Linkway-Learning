import type { Metadata } from "next";
import InvestmentBankingPage from "./InvestmentBankingPage";
import { CourseJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Investment Banking Course — Financial Modeling, Valuation, M&A",
  description:
    "Master financial modeling, valuation, M&A, and deal structuring. Built for those who want to land roles at top investment banks. 100% placement. Linkway Learning.",
  alternates: { canonical: "https://linkwaylearning.com/courses/investment-banking" },
  openGraph: {
    title: "Investment Banking Course — Financial Modeling, M&A",
    description: "Master financial modeling, valuation & deal structuring.",
    url: "https://linkwaylearning.com/courses/investment-banking",
  },
};

export default function Page() {
  return (
    <>
      <CourseJsonLd
        name="Investment Banking Course"
        description="Master financial modeling, valuation, M&A, and deal structuring for top investment bank roles."
        url="https://linkwaylearning.com/courses/investment-banking"
        duration="P5M"
        skills={["Financial Modeling", "Valuation", "M&A", "Deal Structuring", "Excel", "DCF Analysis"]}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://linkwaylearning.com" },
          { name: "Courses", url: "https://linkwaylearning.com/courses" },
          { name: "Investment Banking", url: "https://linkwaylearning.com/courses/investment-banking" },
        ]}
      />
      <InvestmentBankingPage />
    </>
  );
}
