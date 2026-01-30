import type { Metadata } from "next";
import ContactPage from "./ContactContent";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Linkway Learning. Enquire about our Data Analytics, Business Analytics, Data Science and AI, Agentic AI & Prompt Engineering, and Investment Banking programs.",
};

export default function Contact() {
  return <ContactPage />;
}
