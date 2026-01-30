"use client";

import SectionHeading from "@/components/ui/SectionHeading";
import { AccordionItem } from "@/components/ui/Accordion";
import { ThemeProvider } from "@/lib/theme";

const faqs = [
  {
    q: "What exactly is Linkway Learning?",
    a: "We're a training company that gets people hired in data, AI, and finance roles. We run five programs - Data Analytics, Business Analytics, Data Science and AI, Agentic AI & Prompt Engineering, and Investment Banking - with live classes, real projects, and placement support baked in from day one.",
  },
  {
    q: "How is this different from Coursera or Udemy?",
    a: "Those are video libraries. We're live, instructor-led, and project-heavy. You get a mentor, portfolio projects, mock interviews, and a team that actively pushes your resume to hiring partners.",
  },
  {
    q: "Do I need to know coding?",
    a: "Not for Data Analytics - we start from absolute zero. For Data Science, some basic familiarity helps, but we teach everything from scratch there too.",
  },
  {
    q: "How does placement assistance work?",
    a: "If you complete everything - assignments, projects, assessments - we guarantee up to 10 interview opportunities with our hiring partners. Our team works with you until something sticks.",
  },
  {
    q: "Which companies hire from Linkway?",
    a: "Google, Amazon, TCS, Deloitte, Infosys, Wipro, Flipkart, IBM, Razorpay, Accenture, Nykaa, Meesho - and about 30 more. The list keeps growing.",
  },
  {
    q: "Can I pay in installments?",
    a: "Absolutely. We offer 0% interest EMI starting at \u20B95,500/month. No hidden charges, no surprise fees.",
  },
  {
    q: "What certifications do I get?",
    a: "Two: a Linkway Learning completion certificate and a Microsoft Azure AI Fundamentals credential. The Microsoft cert is globally recognized by Fortune 500 companies.",
  },
  {
    q: "Are classes live or recorded?",
    a: "Live, always. With real instructors you can ask questions to. Every session also gets recorded, so you can rewatch anything you missed.",
  },
];

export default function HomeFAQ() {
  return (
    <ThemeProvider theme="light">
      <section className="py-24 md:py-32 bg-[#f2f1ee]">
        <div className="max-w-3xl mx-auto px-6">
          <SectionHeading
            label="Got Questions?"
            title="Frequently Asked Questions"
            description="Straight answers. No corporate fluff."
            align="center"
          />

          <div className="mt-12">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} title={faq.q}>
                {faq.a}
              </AccordionItem>
            ))}
          </div>
        </div>
      </section>
    </ThemeProvider>
  );
}
