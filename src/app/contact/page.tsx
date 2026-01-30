import type { Metadata } from "next";
import ContactPage from "./ContactContent";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Linkway Learning. Enquire about our Data Analytics, Data Science & AI, and Business Intelligence programs.",
};

export default function Contact() {
  return <ContactPage />;
}
