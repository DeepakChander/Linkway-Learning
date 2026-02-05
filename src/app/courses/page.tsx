import type { Metadata } from "next";
import CoursesOverview from "./CoursesOverview";

export const metadata: Metadata = {
  title: "Courses - Data Analytics, Data Science, AI & More",
  description:
    "Explore Linkway Learning's job-ready programs: Data Analytics, Business Analytics, Data Science & AI, Agentic AI & Prompt Engineering, and Investment Banking. 100% placement.",
  alternates: { canonical: "https://linkwaylearning.com/courses" },
  openGraph: {
    title: "Courses - Data Analytics, Data Science, AI & More",
    description: "Job-ready programs. 100% placement.",
    url: "https://linkwaylearning.com/courses",
  },
};

export default function CoursesPage() {
  return <CoursesOverview />;
}
