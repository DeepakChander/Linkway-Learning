import type { Metadata } from "next";
import CoursesOverview from "./CoursesOverview";

export const metadata: Metadata = {
  title: "Courses",
  description: "Explore Linkway Learning's courses in Data Analytics, Business Analytics, Data Science and AI, Agentic AI & Prompt Engineering, and Investment Banking.",
};

export default function CoursesPage() {
  return <CoursesOverview />;
}
