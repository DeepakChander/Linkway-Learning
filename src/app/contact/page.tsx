import type { Metadata } from "next";
import ContactPage from "./ContactContent";

export const metadata: Metadata = {
  title: "Contact Us - Get in Touch with Linkway Learning",
  description:
    "Get in touch with Linkway Learning. Enquire about our Data Analytics, Business Analytics, Data Science, AI, and Investment Banking programs. Book a free counselling session.",
  alternates: { canonical: "https://linkwaylearning.com/contact" },
  openGraph: {
    title: "Contact Linkway Learning",
    description: "Enquire about programs. Book a free counselling session.",
    url: "https://linkwaylearning.com/contact",
  },
};

export default function Contact() {
  return <ContactPage />;
}
