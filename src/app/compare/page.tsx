import type { Metadata } from "next";
import ComparePage from "./CompareContent";

export const metadata: Metadata = {
  title: "Compare Programs — Find Your Perfect Course",
  description:
    "Compare Linkway Learning's Data Analytics, Business Analytics, Data Science & AI, Agentic AI, and Investment Banking programs side by side. Find the right fit for your career.",
  alternates: { canonical: "https://linkwaylearning.com/compare" },
  openGraph: {
    title: "Compare Programs — Linkway Learning",
    description: "Compare all programs side by side. Find your perfect course.",
    url: "https://linkwaylearning.com/compare",
  },
};

export default function Compare() {
  return <ComparePage />;
}
