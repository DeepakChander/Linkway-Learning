"use client";

import { LineMaskReveal } from "@/components/animation";
import { AccordionItem } from "@/components/ui/Accordion";

const sections = [
  {
    title: "Acceptance of Terms",
    content:
      "By accessing or using Linkway Learning\u2019s website and services, you agree to be bound by these Terms & Conditions. If you do not agree with any part of these terms, please do not use our services.",
  },
  {
    title: "Use of Services",
    content:
      "Our courses and materials are provided for personal educational use only. You may not reproduce, distribute, or share course content, recordings, or materials without written permission. You agree to participate in good faith and comply with all program requirements.",
  },
  {
    title: "Payment & Refunds",
    content:
      "Course fees are due as per the selected payment plan. EMI options are available through our financing partners. We offer a pro-rata refund within 14 days of course commencement. Cancellations made before the course start date are eligible for a full refund. Processing may take up to 10 business days.",
  },
  {
    title: "Intellectual Property",
    content:
      "All course content, branding, logos, and materials are the intellectual property of Linkway Learning. Unauthorized use, reproduction, or distribution of any content is strictly prohibited and may result in legal action.",
  },
  {
    title: "Limitation of Liability",
    content:
      "Linkway Learning provides education and placement assistance but does not guarantee specific employment outcomes or salary figures. Placement statistics (e.g., placement rates) reflect outcomes among eligible graduates who completed all program requirements. While we offer dedicated placement assistance, final hiring decisions rest with employers. We are not liable for indirect, incidental, or consequential damages arising from use of our services.",
  },
  {
    title: "User Account Responsibilities",
    content:
      "You are responsible for maintaining the confidentiality of your login credentials and for all activities under your account. You must notify us immediately of any unauthorized access. Account sharing is not permitted, and each enrollment is valid for a single individual only.",
  },
  {
    title: "Code of Conduct",
    content:
      "Students are expected to maintain professional conduct during live classes, group projects, and interactions with mentors and peers. Harassment, plagiarism, sharing of copyrighted course materials, or any disruptive behavior may result in suspension or termination of access without refund.",
  },
  {
    title: "Termination",
    content:
      "Linkway Learning reserves the right to suspend or terminate your access to services for violation of these terms, non-payment, or conduct detrimental to other students or staff. Upon termination, your access to course materials will be revoked.",
  },
  {
    title: "Dispute Resolution",
    content:
      "Any disputes arising from these terms shall first be attempted to be resolved through mediation. If mediation is unsuccessful, the dispute shall be referred to arbitration under the Arbitration and Conciliation Act, 1996. The seat of arbitration shall be Noida, Uttar Pradesh.",
  },
  {
    title: "Governing Law & Jurisdiction",
    content:
      "These terms shall be governed by and construed in accordance with the laws of India. Any legal proceedings shall be subject to the exclusive jurisdiction of the courts in Noida, Uttar Pradesh.",
  },
  {
    title: "Modifications to Terms",
    content:
      "Linkway Learning reserves the right to modify these terms at any time. Changes will be posted on this page with an updated revision date. Continued use of our services after any changes constitutes your acceptance of the revised terms.",
  },
  {
    title: "Severability & Entire Agreement",
    content:
      "If any provision of these terms is found to be invalid or unenforceable, the remaining provisions shall remain in full force and effect. These terms, together with our Privacy Policy, constitute the entire agreement between you and Linkway Learning regarding use of our services.",
  },
  {
    title: "Contact",
    content:
      "For questions about these terms, please contact us at hello@linkwaylearning.com or call +91-93156-47113. Office: D-23, Sector-59, Noida, 201301, UP. Our team will respond within 2 business days.",
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-navy-900 text-white">
      <section className="relative pt-32 pb-8 px-6 text-center max-w-4xl mx-auto overflow-hidden">
        {/* Subtle gradient mesh */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-1/3 w-80 h-80 bg-orange-500/[0.05] rounded-full blur-[120px]" />
          <div className="absolute top-28 right-1/3 w-64 h-64 bg-blue-500/[0.04] rounded-full blur-[100px]" />
        </div>

        {/* UNIQUE: LineMaskReveal wrapping heading - line-by-line slide reveal */}
        <LineMaskReveal delay={0.1} staggerDelay={0.2}>
          <h1 className="text-4xl md:text-5xl font-bold">
            Terms &amp; Conditions
          </h1>
        </LineMaskReveal>
        {/* Orange accent line */}
        <div className="mt-6 mx-auto w-20 h-1 rounded-full bg-gradient-to-r from-orange-500 to-orange-400" />
        <p className="mt-4 text-gray-500 text-sm">Last updated: January 2026</p>
      </section>

      <section className="py-12 px-6 max-w-3xl mx-auto">
        <p className="text-gray-400 leading-relaxed mb-10">
          Please read these terms carefully before using Linkway Learning&apos;s
          website and services. These terms govern your use of our platform and
          educational programs.
        </p>
        <div>
          {sections.map((s, i) => (
            <AccordionItem key={i} title={s.title} defaultOpen={i === 0}>
              {s.content}
            </AccordionItem>
          ))}
        </div>
      </section>
    </div>
  );
}
