"use client";

import { CharacterSplit } from "@/components/animation";
import { AccordionItem } from "@/components/ui/Accordion";

const sections = [
  {
    title: "Information We Collect",
    content:
      "We collect personal information you provide when enrolling in our courses, including your name, email address, phone number, educational background, and payment details. We also collect usage data such as pages visited, time spent, and interactions with our platform to improve your experience.",
  },
  {
    title: "How We Use Information",
    content:
      "Your information is used to deliver course content, process payments, provide placement support, communicate updates and offers, and improve our services. We may also use anonymized data for analytics and reporting purposes.",
  },
  {
    title: "Data Sharing",
    content:
      "We do not sell your personal information. We may share data with our hiring partners solely for placement purposes and only with your consent. We may also share information with service providers who assist in payment processing, email delivery, and platform hosting.",
  },
  {
    title: "Cookies",
    content:
      "Our website uses cookies and similar technologies to enhance your browsing experience, remember preferences, and analyze site traffic. You can manage cookie preferences through your browser settings at any time.",
  },
  {
    title: "Your Rights",
    content:
      "You have the right to access, update, or delete your personal data at any time. You may also opt out of marketing communications. To exercise any of these rights, contact us at hello@linkwaylearning.com.",
  },
  {
    title: "Contact Us",
    content:
      "If you have any questions about this Privacy Policy, please contact us at hello@linkwaylearning.com or call us at +91-93156-47113.",
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-navy-900 text-white">
      <section className="relative pt-32 pb-8 px-6 text-center max-w-4xl mx-auto overflow-hidden">
        {/* Subtle gradient mesh */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-1/3 w-80 h-80 bg-orange-500/[0.05] rounded-full blur-[120px]" />
          <div className="absolute top-28 right-1/3 w-64 h-64 bg-blue-500/[0.04] rounded-full blur-[100px]" />
        </div>

        <h1 className="text-4xl md:text-5xl font-bold">
          <CharacterSplit delay={0.1} staggerDelay={0.03} highlightColor="orange">
            Privacy Policy
          </CharacterSplit>
        </h1>
        {/* Orange accent line */}
        <div className="mt-6 mx-auto w-20 h-1 rounded-full bg-gradient-to-r from-orange-500 to-orange-400" />
        <p className="mt-4 text-gray-500 text-sm">Last updated: January 2026</p>
      </section>

      <section className="py-12 px-6 max-w-3xl mx-auto">
        <p className="text-gray-400 leading-relaxed mb-10">
          At Linkway Learning, we take your privacy seriously. This policy
          outlines how we collect, use, and protect your personal information
          when you use our website and services.
        </p>
        <div>
          {sections.map((s, i) => (
            <AccordionItem key={i} title={s.title} defaultOpen={i === 0}>
              {s.content}
            </AccordionItem>
          ))}
        </div>
      </section>
    </main>
  );
}
