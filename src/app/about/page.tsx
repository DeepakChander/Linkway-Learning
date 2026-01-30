import type { Metadata } from "next";
import AboutPage from "./AboutContent";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Linkway Learning's mission to bridge the gap between ambition and industry with data career programs, expert mentors, and placement support.",
};

export default function About() {
  return <AboutPage />;
}
