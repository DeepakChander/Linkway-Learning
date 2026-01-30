import type { Metadata } from "next";
import SuccessStoriesPage from "./SuccessStoriesContent";

export const metadata: Metadata = {
  title: "Success Stories",
  description:
    "Real stories from Linkway Learning alumni who transformed their careers in data analytics, data science, and business intelligence.",
};

export default function SuccessStories() {
  return <SuccessStoriesPage />;
}
