import type { Metadata } from "next";
import DataAnalyticsPage from "./DataAnalyticsPage";
import { CourseJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Data Analytics Course - Master Excel, SQL, Python, Power BI",
  description:
    "Master Excel, SQL, Python, Tableau, Power BI, and ML fundamentals in 6 intensive months. 100% placement. Mentors from top companies. Enroll now at Linkway Learning.",
  alternates: { canonical: "https://linkwaylearning.com/courses/data-analytics" },
  openGraph: {
    title: "Data Analytics Course - Excel, SQL, Python, Power BI",
    description: "6-month intensive program. 100% placement. Enroll now.",
    url: "https://linkwaylearning.com/courses/data-analytics",
  },
};

export default function Page() {
  return (
    <>
      <CourseJsonLd
        name="Data Analytics Course"
        description="Master Excel, SQL, Python, Tableau, Power BI, and ML fundamentals in 6 intensive months . 100% placement."
        url="https://linkwaylearning.com/courses/data-analytics"
        duration="P6M"
        skills={["Excel", "SQL", "Python", "Tableau", "Power BI", "Machine Learning"]}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://linkwaylearning.com" },
          { name: "Courses", url: "https://linkwaylearning.com/courses" },
          { name: "Data Analytics", url: "https://linkwaylearning.com/courses/data-analytics" },
        ]}
      />
      <DataAnalyticsPage />
    </>
  );
}
