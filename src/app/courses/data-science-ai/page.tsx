import type { Metadata } from "next";
import DataScienceAIPage from "./DataScienceAIPage";

export const metadata: Metadata = {
  title: "Data Science and AI",
  description: "From Python fundamentals to deploying production ML models. Build neural networks, NLP systems, and generative AI applications across 7 comprehensive modules.",
};

export default function Page() {
  return <DataScienceAIPage />;
}
