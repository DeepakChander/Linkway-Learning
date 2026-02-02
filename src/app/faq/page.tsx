import type { Metadata } from "next";
import FAQPage from "./FAQContent";
import { FAQJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "FAQ — Frequently Asked Questions",
  description:
    "Frequently asked questions about Linkway Learning's programs, only 100% placement, pricing, certification, and more. Get all your answers here.",
  alternates: { canonical: "https://linkwaylearning.com/faq" },
  openGraph: {
    title: "FAQ — Linkway Learning",
    description: "Get answers about programs, placement, pricing and certification.",
    url: "https://linkwaylearning.com/faq",
  },
};

export default function FAQ() {
  return (
    <>
      <FAQJsonLd
        faqs={[
          { question: "I don't know which course to pick. Help?", answer: "If you're starting fresh, Data Analytics is the move. Want business strategy? Business Analytics. Deep ML/AI? Data Science. Build AI agents? Agentic AI. Finance? Investment Banking. Talk to a counselor for personalized guidance." },
          { question: "Do I need to know coding?", answer: "Not for Data Analytics - we start from absolute zero. For Data Science, some basic familiarity helps, but we teach everything from scratch." },
          { question: "Are classes live or recorded?", answer: "Live, always. With real instructors you can ask questions to. Every session also gets recorded for rewatching." },
          { question: "How does placement work?", answer: "Only 100% placement. No guarantee or assistance." },
          { question: "Which companies hire from Linkway?", answer: "Google, Amazon, TCS, Deloitte, Infosys, Wipro, Flipkart, IBM, Razorpay, Accenture, and 30+ more companies." },
          { question: "What kind of salary can I expect?", answer: "Graduates typically land between ₹6–18 LPA. On average, people see an 85% salary hike after completing the program." },
          { question: "Can I pay in installments?", answer: "Yes, 0% interest EMI starting at ₹5,500/month. No hidden charges." },
          { question: "What certifications do I get?", answer: "Two: a Linkway Learning completion certificate and a Microsoft Azure AI Fundamentals credential." },
        ]}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://linkwaylearning.com" },
          { name: "FAQ", url: "https://linkwaylearning.com/faq" },
        ]}
      />
      <FAQPage />
    </>
  );
}
