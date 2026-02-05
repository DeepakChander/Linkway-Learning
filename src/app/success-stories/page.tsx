import type { Metadata } from "next";
import SuccessStoriesPage from "./SuccessStoriesContent";

export const metadata: Metadata = {
  title: "Success Stories - Alumni Who Transformed Their Careers",
  description:
    "Real stories from Linkway Learning alumni who transformed their careers in data analytics, data science, and business intelligence. 8,200+ careers launched.",
  alternates: { canonical: "https://linkwaylearning.com/success-stories" },
  openGraph: {
    title: "Success Stories - Linkway Learning Alumni",
    description: "8,200+ careers launched. Real stories from our alumni.",
    url: "https://linkwaylearning.com/success-stories",
  },
};

export default function SuccessStories() {
  return <SuccessStoriesPage />;
}
