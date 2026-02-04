"use client";

import Link from "next/link";
import KineticText from "@/components/animation/KineticText";
import ScrollReveal from "@/components/animation/ScrollReveal";
import { ScrollTextReveal, BorderGlow, CrossFlicker } from "@/components/animation";
import SectionHeading from "@/components/ui/SectionHeading";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

const courses = [
  {
    name: "Data Analytics",
    slug: "/courses/data-analytics",
    color: "text-blue-400",
    glowColor: "blue" as const,
    bgGrad: "from-blue-500/10 to-blue-500/0",
  },
  {
    name: "Business Analytics",
    slug: "/courses/business-analytics",
    color: "text-emerald-400",
    glowColor: "orange" as const,
    bgGrad: "from-emerald-500/10 to-emerald-500/0",
  },
  {
    name: "Data Science and AI",
    slug: "/courses/data-science-ai",
    color: "text-orange-400",
    glowColor: "orange" as const,
    bgGrad: "from-orange-500/10 to-orange-500/0",
  },
  {
    name: "Agentic AI & Prompt Engineering",
    slug: "/courses/agentic-ai",
    color: "text-purple-400",
    glowColor: "orange" as const,
    bgGrad: "from-purple-500/10 to-purple-500/0",
  },
  {
    name: "Investment Banking",
    slug: "/courses/investment-banking",
    color: "text-amber-400",
    glowColor: "orange" as const,
    bgGrad: "from-amber-500/10 to-amber-500/0",
  },
];

const rows = [
  { label: "Duration", values: ["6 Months", "6 Months", "12 Months", "6 Months", "9 Months"] },
  { label: "Skill Level", values: ["Beginner to Advanced", "Beginner to Advanced", "Zero to Expert", "Intermediate to Advanced", "Beginner to Advanced"] },
  { label: "Best For", values: ["Career switchers, graduates", "Business professionals", "Aspiring data scientists", "AI builders & developers", "Finance aspirants"] },
  { label: "Core Focus", values: ["Analysis & Visualization", "Business Strategy & Dashboards", "Full AI/ML lifecycle", "AI Agents & Prompt Design", "Financial Modeling & Valuation"] },
  { label: "Key Tools", values: ["Excel, SQL, Python, Tableau", "Power BI, Excel, SQL, Tableau", "TensorFlow, PyTorch, Docker, AWS", "LangChain, OpenAI, Python", "Excel, Power BI, SQL, Python"] },
  { label: "Projects", values: ["4+ hands-on", "5+ business cases", "7+ capstones + case studies", "AI agent projects", "Finance projects"] },
  { label: "Top Roles", values: ["Data Analyst, BI Analyst", "Business Analyst", "Data Scientist, ML Engineer", "AI Engineer, Prompt Engineer", "IB Analyst, Financial Analyst"] },
  { label: "Placement", values: ["100% Placement", "100% Placement", "100% Placement", "100% Placement", "100% Placement"] },
];

const choosePaths = [
  {
    label: "Starting from Zero",
    desc: "Data Analytics is your entry point - no coding needed, just curiosity.",
    href: "/courses/data-analytics",
    glowColor: "blue" as const,
  },
  {
    label: "I Want to Go Deep",
    desc: "Data Science & AI takes you from Python basics to deploying ML models.",
    href: "/courses/data-science-ai",
    glowColor: "orange" as const,
  },
  {
    label: "Already Working",
    desc: "Business Intelligence is built for professionals who want to lead with data.",
    href: "/courses/business-intelligence",
    glowColor: "orange" as const,
  },
];

export default function ComparePage() {
  return (
    <div className="min-h-screen bg-navy-900 text-white">
      {/* Hero */}
      <section className="pt-32 pb-16 px-6 text-center max-w-5xl mx-auto">
        {/* UNIQUE: KineticText with fadeUp - subtle fade rise */}
        <KineticText
          text="Compare Our Courses"
          as="h1"
          className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
          animation="fadeUp"
        />
        {/* UNIQUE subtitle: ScrollTextReveal - scroll-scrubbed */}
        <div className="mt-6 max-w-2xl mx-auto">
          <ScrollTextReveal className="text-gray-400 text-lg md:text-xl" tag="p">
            Not sure which one's for you? This side-by-side should help.
          </ScrollTextReveal>
        </div>
        {/* Orange accent line */}
        <div className="mt-8 mx-auto w-24 h-1 rounded-full bg-gradient-to-r from-orange-500 to-orange-400" />
      </section>

      {/* Comparison Table \u2014 Desktop */}
      <section className="py-16 px-6 max-w-6xl mx-auto hidden md:block">
        <ScrollReveal>
          <div className="relative overflow-x-auto rounded-2xl border border-white/[0.08]">
            <CrossFlicker position="top-left" color="orange" size="sm" delay={0.2} />
            <CrossFlicker position="top-right" color="orange" size="sm" delay={0.4} />
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.08]">
                  <th className="text-left p-5 text-gray-400 text-sm font-medium w-1/4">
                    Feature
                  </th>
                  {courses.map((c, i) => (
                    <th key={i} className="p-5 text-center font-bold text-lg">
                      <span
                        className={`bg-gradient-to-b ${c.bgGrad} inline-block px-4 py-2 rounded-lg ${c.color}`}
                      >
                        {c.name}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, ri) => (
                  <tr
                    key={ri}
                    className="border-b border-white/[0.05] hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="p-5 text-white font-medium text-sm">
                      {row.label}
                    </td>
                    {row.values.map((val, vi) => (
                      <td
                        key={vi}
                        className="p-5 text-center text-gray-400 text-sm"
                      >
                        {val}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollReveal>
      </section>

      {/* Comparison Cards \u2014 Mobile */}
      <section className="py-16 px-6 max-w-6xl mx-auto md:hidden">
        <div className="space-y-8">
          {courses.map((course, ci) => (
            <ScrollReveal key={ci} delay={ci * 0.1}>
              <Card>
                <h3 className={`text-xl font-bold mb-6 ${course.color}`}>
                  {course.name}
                </h3>
                <div className="space-y-4">
                  {rows.map((row, ri) => (
                    <div
                      key={ri}
                      className="flex justify-between items-start gap-4"
                    >
                      <span className="text-gray-500 text-sm shrink-0">
                        {row.label}
                      </span>
                      <span className="text-gray-300 text-sm text-right">
                        {row.values[ci]}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <Link href={course.slug}>
                    <Button variant="outline" size="sm" className="w-full">
                      View Course
                    </Button>
                  </Link>
                </div>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Help Me Choose */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <ScrollReveal>
          <SectionHeading
            label="Still Unsure?"
            title="Start Here"
            description="Pick the one that sounds most like you."
          />
        </ScrollReveal>
        <div className="mt-12 grid md:grid-cols-3 gap-8">
          {choosePaths.map((path, i) => (
            <ScrollReveal key={i} delay={i * 0.15}>
              <Link href={path.href}>
                <BorderGlow glowColor={path.glowColor} glowIntensity="subtle">
                  <Card
                    variant="accent"
                    className="h-full text-center cursor-pointer"
                  >
                    <h3 className="text-xl font-bold text-white mb-3">
                      {path.label}
                    </h3>
                    <p className="text-gray-400 text-sm mb-5">{path.desc}</p>
                    <Badge variant="orange">Explore &rarr;</Badge>
                  </Card>
                </BorderGlow>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </div>
  );
}
