import type { Metadata } from "next";
import DataScienceAIPage from "./DataScienceAIPage";
import { CourseJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Data Science & AI Course — Python, ML, Deep Learning, NLP",
  description:
    "From Python fundamentals to deploying production ML models. Build neural networks, NLP systems, and generative AI applications. 100% placement support at Linkway Learning.",
  alternates: { canonical: "https://linkwaylearning.com/courses/data-science-ai" },
  openGraph: {
    title: "Data Science & AI Course — Python, ML, Deep Learning",
    description: "Build neural networks, NLP systems, and generative AI apps. 100% placement support.",
    url: "https://linkwaylearning.com/courses/data-science-ai",
  },
};

export default function Page() {
  return (
    <>
      <CourseJsonLd
        name="Data Science & AI Course"
        description="From Python fundamentals to deploying production ML models. Build neural networks, NLP systems, and generative AI applications."
        url="https://linkwaylearning.com/courses/data-science-ai"
        duration="P7M"
        skills={["Python", "Machine Learning", "Deep Learning", "NLP", "Generative AI", "TensorFlow"]}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://linkwaylearning.com" },
          { name: "Courses", url: "https://linkwaylearning.com/courses" },
          { name: "Data Science & AI", url: "https://linkwaylearning.com/courses/data-science-ai" },
        ]}
      />
      <DataScienceAIPage />
    </>
  );
}
