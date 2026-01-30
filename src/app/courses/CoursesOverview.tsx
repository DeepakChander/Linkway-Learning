"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BarChart3, Brain, LineChart, ArrowRight } from "lucide-react";
import { SpringReveal } from "@/components/animation";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import SectionHeading from "@/components/ui/SectionHeading";
import { ThemeProvider } from "@/lib/theme";

const courses = [
  {
    name: "Data Analytics",
    duration: "6 Months",
    level: "Beginner to Advanced",
    tagline: "Go from spreadsheets to strategic thinking — fast.",
    description:
      "You'll learn Excel, SQL, Python, Tableau, and Power BI by building real analytics projects. Not toy datasets — actual business problems. Comes with dedicated placement assistance.",
    bg: "#3B82F6",
    icon: BarChart3,
    href: "/courses/data-analytics",
    highlights: ["18+ Tools", "4 Portfolio Projects", "Placement Assistance"],
  },
  {
    name: "Business Analytics",
    duration: "6 Months",
    level: "Beginner to Advanced",
    tagline: "Bridge business strategy and data insights.",
    description:
      "Learn to translate business questions into data-driven answers. Master analytics frameworks, dashboards, and storytelling that executives actually act on.",
    bg: "#10B981",
    icon: LineChart,
    href: "/courses/business-analytics",
    highlights: ["15+ Tools", "5 Projects", "Business Focus"],
  },
  {
    name: "Data Science and AI",
    duration: "12 Months",
    level: "Zero to Expert",
    tagline: "From your first Python script to production ML models.",
    description:
      "This is the full journey — Python, neural networks, NLP, generative AI, and deployment. Seven modules that take you from zero to genuinely job-ready in data science.",
    bg: "#0F172A",
    icon: Brain,
    href: "/courses/data-science-ai",
    highlights: ["36+ Tools", "7 Case Studies", "MLOps Ready"],
  },
  {
    name: "Agentic AI & Prompt Engineering",
    duration: "6 Months",
    level: "Intermediate to Advanced",
    tagline: "Build autonomous AI agents that think and execute.",
    description:
      "Learn to design, build, and deploy AI agents. From prompt engineering to agentic workflows — this is the future of AI, and you'll be building it.",
    bg: "#8B5CF6",
    icon: Brain,
    href: "/courses/agentic-ai",
    highlights: ["20+ Tools", "AI Agent Projects", "LangChain & OpenAI"],
  },
  {
    name: "Investment Banking",
    duration: "9 Months",
    level: "Beginner to Advanced",
    tagline: "Break into the world of high-stakes finance.",
    description:
      "Master financial modeling, valuation, M&A, and deal structuring. Built for those who want to land roles at top investment banks and financial institutions.",
    bg: "#F59E0B",
    icon: LineChart,
    href: "/courses/investment-banking",
    highlights: ["15+ Tools", "Finance Projects", "Placement Assistance"],
  },
];

const comparison = [
  { label: "Duration", values: ["6 Months", "6 Months", "12 Months", "6 Months", "9 Months"] },
  { label: "Best For", values: ["Career switchers & fresh graduates", "Business professionals", "Aspiring data scientists & AI engineers", "AI builders & developers", "Finance aspirants"] },
  { label: "Key Focus", values: ["Analytics & Visualization", "Business Strategy & Dashboards", "ML, Deep Learning & AI", "AI Agents & Prompt Design", "Financial Modeling & Valuation"] },
  { label: "Tools Covered", values: ["18+", "15+", "36+", "20+", "15+"] },
  { label: "Projects", values: ["4 Portfolio Projects", "5 Business Projects", "7 Case Studies + Projects", "AI Agent Projects", "Finance Projects"] },
  { label: "Top Career Role", values: ["Data Analyst", "Business Analyst", "Data Scientist / ML Engineer", "AI Engineer", "Investment Banking Analyst"] },
  { label: "Salary Range", values: ["₹6–12 LPA", "₹6–14 LPA", "₹8–18 LPA", "₹10–20 LPA", "₹8–16 LPA"] },
  { label: "Certification", values: ["Azure AI Fundamentals", "AWS ML Specialty Prep", "Power BI Data Analyst Prep"] },
];

export default function CoursesOverview() {
  const [active, setActive] = useState(0);

  return (
    <ThemeProvider theme="light">
    <div className="min-h-screen bg-white orano-scroll text-navy-900">
      {/* Courses Header */}
      <section className="pt-32 pb-16 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <Badge variant="orange">3 Programs · 1 Goal: Get You Hired</Badge>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-navy-900 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
          >
            Our Courses
          </motion.h1>

          <motion.p
            className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            Pick the one that matches where you are right now. Every program comes with real projects, real mentors, and dedicated placement assistance.
          </motion.p>
        </div>
      </section>

      {/* Course Accordion Cards — all 3 visible, hovered one expands */}
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-3 lg:h-[340px]">
          {courses.map((course, i) => {
            const Icon = course.icon;
            const isActive = active === i;

            return (
              <motion.div
                key={i}
                className="relative rounded-2xl overflow-hidden cursor-pointer min-h-[80px] lg:h-full"
                style={{ backgroundColor: course.bg }}
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
                animate={{ flex: isActive ? 5 : 1 }}
                transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
              >
                {/* Collapsed state — horizontal on mobile, vertical on desktop */}
                <motion.div
                  className="absolute inset-0 flex flex-row lg:flex-col items-center justify-center gap-2 py-4 lg:py-6 px-4 lg:px-3"
                  animate={{ opacity: isActive ? 0 : 1 }}
                  transition={{ duration: 0.3 }}
                  style={{ pointerEvents: isActive ? "none" : "auto" }}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
                  >
                    <Icon className="w-4 h-4 text-white/80" />
                  </div>
                  <h3
                    className="text-white/90 font-bold text-sm lg:text-[11px] tracking-wide lg:[writing-mode:vertical-lr] lg:[text-orientation:mixed]"
                  >
                    {course.name}
                  </h3>
                </motion.div>

                {/* Expanded state — compact content, two columns */}
                <motion.div
                  className="h-full p-5 md:p-6 lg:p-8 flex flex-col justify-center"
                  animate={{ opacity: isActive ? 1 : 0 }}
                  transition={{ duration: 0.4, delay: isActive ? 0.15 : 0 }}
                  style={{ pointerEvents: isActive ? "auto" : "none" }}
                >
                  <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 lg:items-center">
                    {/* Left column */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-white/50">
                          {course.duration}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-white/30" />
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-white/50">
                          {course.level}
                        </span>
                      </div>

                      <h2 className="text-xl md:text-2xl font-bold text-white mb-1.5 leading-tight">
                        {course.name}
                      </h2>

                      <p className="text-white/70 text-xs mb-2 font-medium">{course.tagline}</p>

                      <p className="text-white/45 text-xs leading-relaxed max-w-sm">{course.description}</p>
                    </div>

                    {/* Right column — highlights + CTA */}
                    <div className="lg:w-56 flex-shrink-0">
                      <ul className="space-y-1.5 mb-4">
                        {course.highlights.map((h) => (
                          <li key={h} className="flex items-center gap-2 text-white/90 text-xs">
                            <svg className="w-3.5 h-3.5 text-white/50 flex-shrink-0" viewBox="0 0 16 16" fill="none">
                              <path d="M13.5 4.5L6 12L2.5 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            {h}
                          </li>
                        ))}
                      </ul>

                      <Link
                        href={course.href}
                        className="inline-flex items-center gap-2 bg-white text-gray-900 font-semibold px-4 py-2 rounded-xl hover:bg-white/90 transition-colors text-xs"
                      >
                        Explore Course
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Comparison - Pioneer: SVG Draw separator + staggered rows */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <SpringReveal skewY={-5} distance={120} damping={12}>
            <SectionHeading label="Compare" title="Side by Side" description="Here's how the three programs differ at a glance." />
          </SpringReveal>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
            className="mt-8"
          >
            <div className="overflow-x-auto orano-scroll">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-4 text-gray-500 text-sm font-medium w-1/4" />
                    {courses.map((c, i) => (
                      <th key={i} className="text-left py-4 px-4">
                        <Link href={c.href} className="underline-expand font-bold text-sm" style={{ color: c.bg }}>
                          {c.name}
                        </Link>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((row, ri) => (
                    <motion.tr
                      key={ri}
                      className="border-b border-gray-100 orano-panel"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: ri * 0.08, ease: [0.19, 1, 0.22, 1] }}
                    >
                      <td className="py-4 px-4 text-orange-400 text-sm font-semibold">{row.label}</td>
                      {row.values.map((val, j) => (
                        <td key={j} className="py-4 px-4 text-gray-600 text-sm">{val}</td>
                      ))}
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA - Pioneer: Noise overlay + gradient shimmer + magnetic buttons */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto text-center relative">
          <SpringReveal distance={100} stiffness={100} damping={12}>
            <h2 className="text-3xl md:text-5xl font-bold text-navy-900 mb-4">Not Sure Which One?</h2>
          </SpringReveal>
          <motion.p
            className="text-gray-600 text-lg mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
          >
            Compare them in detail, or just talk to a counselor - they'll figure out the right fit
            for you in 15 minutes.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Button variant="primary" size="lg" href="/contact" className="orano-focus">
              Talk to a Counselor
              <ArrowRight className="w-5 h-5 ml-1" />
            </Button>
            <Button variant="outline" size="lg" href="/compare" className="orano-focus">
              Compare Programs
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
    </ThemeProvider>
  );
}
