import type { Metadata } from "next";
import ComparePage from "./CompareContent";

export const metadata: Metadata = {
  title: "Compare Programs",
  description:
    "Compare Linkway Learning's Data Analytics, Data Science & AI, and Business Intelligence programs side by side.",
};

export default function Compare() {
  return <ComparePage />;
}
