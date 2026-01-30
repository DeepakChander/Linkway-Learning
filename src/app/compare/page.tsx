import type { Metadata } from "next";
import ComparePage from "./CompareContent";

export const metadata: Metadata = {
  title: "Compare Programs",
  description:
    "Compare Linkway Learning's Data Analytics, Business Analytics, Data Science and AI, Agentic AI & Prompt Engineering, and Investment Banking programs side by side.",
};

export default function Compare() {
  return <ComparePage />;
}
