import type { Metadata } from "next";
import AgenticAIPage from "./AgenticAIPage";
import { CourseJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Agentic AI & Prompt Engineering Course — LangChain, AI Agents",
  description:
    "Master building autonomous AI agents. Learn prompt engineering, LangChain, and agentic workflows to build AI systems that think, plan, and execute. Enroll at Linkway Learning.",
  alternates: { canonical: "https://linkwaylearning.com/courses/agentic-ai" },
  openGraph: {
    title: "Agentic AI & Prompt Engineering Course",
    description: "Build autonomous AI agents with LangChain and agentic workflows.",
    url: "https://linkwaylearning.com/courses/agentic-ai",
  },
};

export default function Page() {
  return (
    <>
      <CourseJsonLd
        name="Agentic AI & Prompt Engineering Course"
        description="Master building autonomous AI agents with prompt engineering, LangChain, and agentic workflows."
        url="https://linkwaylearning.com/courses/agentic-ai"
        duration="P4M"
        skills={["Prompt Engineering", "LangChain", "AI Agents", "LLMs", "Python", "Agentic Workflows"]}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://linkwaylearning.com" },
          { name: "Courses", url: "https://linkwaylearning.com/courses" },
          { name: "Agentic AI", url: "https://linkwaylearning.com/courses/agentic-ai" },
        ]}
      />
      <AgenticAIPage />
    </>
  );
}
