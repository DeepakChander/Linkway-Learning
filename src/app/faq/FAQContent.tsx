"use client";

import KineticText from "@/components/animation/KineticText";
import ScrollReveal from "@/components/animation/ScrollReveal";
import { CharacterSplit, CrossFlicker } from "@/components/animation";
import { AccordionItem } from "@/components/ui/Accordion";

const faqCategories = [
  {
    category: "General",
    items: [
      {
        q: "What exactly is Linkway Learning?",
        a: "We're a training company that gets people hired in data, AI, and finance roles. We run five programs - Data Analytics, Business Analytics, Data Science and AI, Agentic AI & Prompt Engineering, and Investment Banking - with live classes, real projects, and 100% placement.",
      },
      {
        q: "How is this different from Coursera or Udemy?",
        a: "Those are video libraries. We're live, instructor-led, and project-heavy. You get a mentor, portfolio projects, mock interviews, and a team that actively pushes your resume to hiring partners. It's a completely different experience.",
      },
      {
        q: "Who teaches here?",
        a: "Working professionals from companies like Google, PwC, Amazon, and Cognizant. They have 3–9+ years of experience and teach because they want to - not because it's their only job.",
      },
      {
        q: "Do you have any accreditation?",
        a: "You get two certifications: one from Linkway and one from Microsoft (Azure AI Fundamentals). The Microsoft cert is recognized worldwide.",
      },
    ],
  },
  {
    category: "Courses",
    items: [
      {
        q: "I don't know which course to pick. Help?",
        a: "If you're starting fresh or switching careers, Data Analytics is the move. Want to understand business strategy through data? Go with Business Analytics. If you want to go deep into ML and AI, pick Data Science and AI. Want to build AI agents? Agentic AI & Prompt Engineering is for you. Interested in finance? Investment Banking is the path. Still unsure? Talk to a counselor - they'll sort it out in 15 minutes.",
      },
      {
        q: "Do I need to know coding?",
        a: "Not for Data Analytics - we start from absolute zero. For Data Science, some basic familiarity helps, but honestly we teach everything from scratch there too.",
      },
      {
        q: "Are classes live or recorded?",
        a: "Live, always. With real instructors you can ask questions to. Every session also gets recorded, so you can rewatch anything you missed.",
      },
      {
        q: "How much time do I need per week?",
        a: "Budget about 15–20 hours - that includes classes, assignments, and project work. It's serious, but that's what makes the outcome real.",
      },
    ],
  },
  {
    category: "Placement",
    items: [
      {
        q: "How does placement work?",
        a: "100% placement.",
      },
      {
        q: "Which companies hire from Linkway?",
        a: "Google, Amazon, TCS, Deloitte, Infosys, Wipro, Flipkart, IBM, Razorpay, Accenture, Nykaa, Meesho - and about 30 more. The list keeps growing.",
      },
      {
        q: "What kind of salary can I expect?",
        a: "It depends on the program and your background, but graduates typically land between \u20B96–18 LPA. On average, people see an 82.7% salary hike after completing the program.",
      },
    ],
  },
  {
    category: "Pricing",
    items: [
      {
        q: "How much does it cost?",
        a: "Pricing varies by batch. Reach out to us for exact numbers - we keep it competitive and offer flexible payment plans so cost isn't the thing that stops you.",
      },
      {
        q: "Can I pay in installments?",
        a: "Absolutely. We offer 0% interest EMI starting at \u20B95,500/month. No hidden charges, no surprise fees.",
      },
      {
        q: "What if I want to drop out?",
        a: "Cancel before the course starts and you get a full refund, no questions asked. Within the first 14 days, we offer a pro-rata refund. We don't make it difficult.",
      },
      {
        q: "Any scholarships?",
        a: "We run merit-based scholarships and early-bird discounts for select batches. Ask your counselor - they'll tell you what's currently available.",
      },
    ],
  },
  {
    category: "Certification",
    items: [
      {
        q: "What certifications do I walk away with?",
        a: "Two: a Linkway Learning completion certificate and a Microsoft Azure AI Fundamentals credential (after passing the exam).",
      },
      {
        q: "Do employers actually care about these certs?",
        a: "The Microsoft cert is globally recognized - Fortune 500 companies know it. And the Linkway cert is backed by our 400+ hiring partners who actively recruit our grads. So yes, they carry weight.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-navy-900 text-white">
      {/* Hero */}
      <section className="relative pt-32 pb-16 px-6 text-center max-w-5xl mx-auto overflow-hidden">
        {/* Gradient mesh background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-16 left-1/3 w-96 h-96 bg-orange-500/[0.07] rounded-full blur-[120px]" />
          <div className="absolute top-32 right-1/3 w-80 h-80 bg-blue-500/[0.05] rounded-full blur-[100px]" />
        </div>

        {/* UNIQUE: KineticText with slideUp + splitBy chars - char-by-char slide */}
        <KineticText
          text="Frequently Asked Questions"
          as="h1"
          className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
          animation="slideUp"
          splitBy="chars"
          stagger={0.03}
        />
        {/* UNIQUE subtitle: CharacterSplit with blur effect */}
        <div className="mt-6 max-w-2xl mx-auto">
          <p className="text-gray-400 text-lg md:text-xl">
            <CharacterSplit delay={0.6} staggerDelay={0.015} effect="blur">
              Straight answers. No corporate fluff.
            </CharacterSplit>
          </p>
        </div>
        {/* Orange accent line */}
        <div className="mt-8 mx-auto w-24 h-1 rounded-full bg-gradient-to-r from-orange-500 to-orange-400" />
      </section>

      {/* FAQ Sections */}
      <section className="py-16 px-6 max-w-3xl mx-auto">
        {faqCategories.map((cat, ci) => (
          <ScrollReveal key={ci} delay={ci * 0.1}>
            <div className="mb-12 relative">
              <CrossFlicker
                position={ci % 2 === 0 ? "top-left" : "top-right"}
                color="orange"
                size="sm"
                delay={ci * 0.15}
              />
              <h2 className="text-xl font-bold text-orange-400 uppercase tracking-widest mb-2">
                {cat.category}
              </h2>
              <div className="w-16 h-0.5 rounded-full bg-gradient-to-r from-orange-500 to-orange-400/0 mb-6" />
              <div>
                {cat.items.map((item, i) => (
                  <AccordionItem
                    key={i}
                    title={item.q}
                    defaultOpen={false}
                  >
                    {item.a}
                  </AccordionItem>
                ))}
              </div>
            </div>
          </ScrollReveal>
        ))}
      </section>
    </div>
  );
}
