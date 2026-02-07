import type { Metadata } from "next";
import CaseStudiesPage from "./CaseStudiesContent";

export const metadata: Metadata = {
  title: "Case Studies - Real-World Data Science & AI Success Stories",
  description:
    "Explore how companies like Netflix, Uber, Tesla, and JPMorgan use data science, AI, and machine learning to solve real business problems. Learn from the best.",
  alternates: { canonical: "https://linkwaylearning.com/case-studies" },
  openGraph: {
    title: "Case Studies - Real-World Data Science & AI Applications",
    description:
      "How top companies leverage data science and AI to drive business outcomes.",
    url: "https://linkwaylearning.com/case-studies",
  },
};

export default function CaseStudies() {
  return <CaseStudiesPage />;
}
