import type { Metadata } from "next";
import AboutPage from "./AboutContent";

export const metadata: Metadata = {
  title: "About Us - Our Mission, Mentors & Vision",
  description:
    "Linkway Learning bridges the gap between ambition and industry. Learn about our mission, FAANG mentors from Google, Amazon & Deloitte, 100% placement, and how we've transformed 8,200+ careers in data analytics and AI.",
  alternates: {
    canonical: "https://linkwaylearning.com/about",
  },
  openGraph: {
    title: "About Linkway Learning - Our Mission, Mentors & Vision",
    description:
      "8,200+ careers transformed. Mentors from Google, Amazon & Microsoft. Discover our mission to make India job-ready in data & AI.",
    url: "https://linkwaylearning.com/about",
  },
};

export default function About() {
  return <AboutPage />;
}
