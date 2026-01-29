import type { Metadata } from "next";
import CoursesOverview from "./CoursesOverview";

export const metadata: Metadata = {
  title: "Courses",
  description: "Explore Linkway Learning's courses in Data Analytics, Data Science & AI, and Business Intelligence.",
};

export default function CoursesPage() {
  return <CoursesOverview />;
}
