import type { Metadata } from "next";
import AgenticAIPage from "./AgenticAIPage";

export const metadata: Metadata = {
  title: "Agentic AI & Prompt Engineering",
  description: "Master the art of building autonomous AI agents. Learn prompt engineering, LangChain, and agentic workflows to build AI systems that think, plan, and execute.",
};

export default function Page() {
  return <AgenticAIPage />;
}
