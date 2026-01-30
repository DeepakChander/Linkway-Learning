import type { Metadata } from "next";
import BlogPage from "./BlogContent";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Insights, tips, and guides on data analytics, data science, AI, and career growth from the Linkway Learning team.",
};

export default function Blog() {
  return <BlogPage />;
}
