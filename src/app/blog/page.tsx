import type { Metadata } from "next";
import BlogPage from "./BlogContent";

export const metadata: Metadata = {
  title: "Blog - Data Analytics, AI & Career Growth Insights",
  description:
    "Insights, tips, and guides on data analytics, data science, AI, and career growth from the Linkway Learning team. Stay updated with industry trends.",
  alternates: { canonical: "https://linkwaylearning.com/blog" },
  openGraph: {
    title: "Blog - Data Analytics, AI & Career Insights",
    description: "Tips, guides and industry insights from Linkway Learning.",
    url: "https://linkwaylearning.com/blog",
  },
};

export default function Blog() {
  return <BlogPage />;
}
