"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, BarChart3, Brain, LineChart, Clock, Zap, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const toolLogos: Record<string, string> = {
  Python: "/images/tools/python.png",
  SQL: "/images/tools/sql.png",
  Tableau: "/images/tools/tableau.png",
  "Power BI": "/images/tools/power-bi.png",
  Excel: "/images/tools/excel.png",
  TensorFlow: "/images/tools/tensorflow.png",
  PyTorch: "/images/tools/pytorch.png",
  Docker: "/images/tools/docker.png",
  AWS: "/images/tools/aws.png",
  BERT: "/images/tools/huggingface.svg",
  Looker: "/images/tools/looker.png",
  LangChain: "/images/tools/python.png",
  OpenAI: "/images/tools/python.png",
};

const courses = [
  {
    slug: "data-analytics",
    name: "Data Analytics",
    duration: "6 Months",
    level: "Beginner to Advanced",
    category: "Data tools & visualization",
    tagline: "Turn raw data into decisions that move businesses forward.",
    description: "Master Excel, SQL, Python, Tableau, and Power BI by solving real business problems. Walk out with a portfolio that proves you can deliver insights, not just run queries.",
    icon: BarChart3,
    tools: ["Python", "SQL", "Tableau", "Power BI", "Excel"],
    gradient: "from-orange-400/20 via-amber-300/10 to-orange-100/30",
    orbColor: "bg-orange-300/30",
  },
  {
    slug: "business-analytics",
    name: "Business Analytics",
    duration: "6 Months",
    level: "Beginner to Advanced",
    category: "Business strategy & insights",
    tagline: "Bridge the gap between business strategy and data insights.",
    description: "Learn to translate business questions into data-driven answers. Master analytics frameworks, dashboards, and storytelling that executives actually act on.",
    icon: LineChart,
    tools: ["Power BI", "Excel", "SQL", "Tableau", "Python"],
    gradient: "from-emerald-400/15 via-teal-300/10 to-orange-100/20",
    orbColor: "bg-emerald-300/25",
  },
  {
    slug: "data-science-ai",
    name: "Data Science and AI",
    duration: "12 Months",
    level: "Zero to Expert",
    category: "AI & machine learning",
    tagline: "Build, train, and deploy AI that solves real-world problems.",
    description: "The complete journey — from Python fundamentals to neural networks, NLP, generative AI, and production deployment. Ship models that work in the real world.",
    icon: Brain,
    tools: ["TensorFlow", "PyTorch", "Docker", "AWS", "BERT"],
    gradient: "from-violet-400/15 via-purple-300/10 to-orange-100/20",
    orbColor: "bg-violet-300/25",
  },
  {
    slug: "agentic-ai",
    name: "Agentic AI & Prompt Engineering",
    duration: "6 Months",
    level: "Intermediate to Advanced",
    category: "AI agents & automation",
    tagline: "Master the art of building autonomous AI agents.",
    description: "Learn to design, build, and deploy AI agents that think, plan, and execute. From prompt engineering to agentic workflows — the future of AI.",
    icon: Brain,
    tools: ["Python", "LangChain", "OpenAI", "AWS", "Docker"],
    gradient: "from-blue-400/15 via-indigo-300/10 to-orange-100/20",
    orbColor: "bg-blue-300/25",
  },
  {
    slug: "investment-banking",
    name: "Investment Banking",
    duration: "9 Months",
    level: "Beginner to Advanced",
    category: "Finance & valuation",
    tagline: "Break into the world of high-stakes finance.",
    description: "Master financial modeling, valuation, M&A, and deal structuring. Built for those who want to land roles at top investment banks and financial institutions.",
    icon: LineChart,
    tools: ["Excel", "Power BI", "SQL", "Python", "Tableau"],
    gradient: "from-amber-400/20 via-yellow-300/10 to-orange-100/25",
    orbColor: "bg-amber-300/30",
  },
];

export default function CoursePreview() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeCourse = courses[activeIndex];
  const ActiveIcon = activeCourse.icon;

  return (
    <section className="bg-[#f4f2ed]">
      {/* Top separator */}
      <div className="w-full h-px bg-gray-300/50" />

      <div className="py-24 md:py-32 px-6">
        <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-12 md:mb-14">
          <div className="overflow-hidden">
            <motion.div
              className="flex items-center gap-3 mb-4"
              initial={{ y: "100%" }}
              whileInView={{ y: "0%" }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            >
              <span className="w-8 h-[2px] bg-orange-500" />
              <span className="text-orange-500 text-sm font-semibold tracking-widest uppercase">Programs</span>
            </motion.div>
          </div>
          <div className="overflow-hidden">
            <motion.h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight"
              initial={{ y: "100%" }}
              whileInView={{ y: "0%" }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
            >
              Choose Your Path. <span className="text-orange-500">Own Your Future.</span>
            </motion.h2>
          </div>
        </div>

        {/* Two-column: Left list + Right card */}
        <div className="flex flex-col lg:flex-row bg-white rounded-3xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.06)]">

          {/* Left: Course list */}
          <div className="w-full lg:w-[360px] xl:w-[400px] shrink-0 lg:border-r border-gray-100">
            {courses.map((course, i) => {
              const isActive = activeIndex === i;
              return (
                <motion.div
                  key={course.slug}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                  className={cn(
                    "group cursor-pointer transition-colors duration-200 border-b border-gray-100 last:border-b-0",
                    isActive ? "bg-orange-50/70" : "hover:bg-gray-50/60"
                  )}
                  onMouseEnter={() => setActiveIndex(i)}
                  role="button"
                  tabIndex={0}
                  aria-expanded={isActive}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveIndex(i); } }}
                >
                  <div className="flex items-center justify-between px-6 py-5">
                    <h3 className={cn(
                      "text-[16px] font-semibold transition-colors duration-200",
                      isActive ? "text-gray-900" : "text-gray-400 group-hover:text-gray-600"
                    )}>
                      {course.name}
                    </h3>
                    <ArrowRight className={cn(
                      "w-[18px] h-[18px] shrink-0 ml-3 transition-all duration-200",
                      isActive ? "text-orange-500 translate-x-0.5" : "text-gray-300 group-hover:text-gray-400"
                    )} />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right: Detail card */}
          <div className="hidden lg:block flex-1 min-w-0 relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCourse.slug}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.12 } }}
                transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                className="relative h-full"
              >
                {/* Base white-to-orange gradient */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(135deg, #ffffff 0%, #fff9f2 35%, #fff0e0 70%, #ffe4c8 100%)",
                  }}
                />

                {/* Dynamic color gradient orb — top right */}
                <motion.div
                  className={cn("absolute -top-20 -right-20 w-80 h-80 rounded-full blur-3xl", activeCourse.orbColor)}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />

                {/* Subtle mesh gradient overlay */}
                <div className={cn("absolute inset-0 bg-gradient-to-br opacity-60", activeCourse.gradient)} />

                {/* Decorative floating ring — top right */}
                <motion.div
                  className="absolute top-8 right-8 w-28 h-28 rounded-full border border-orange-200/40"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                />
                <motion.div
                  className="absolute top-14 right-14 w-16 h-16 rounded-full border border-orange-300/30"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                />

                {/* Decorative icon watermark — bottom right */}
                <motion.div
                  className="absolute bottom-6 right-8 opacity-[0.06]"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 0.06, scale: 1 }}
                  transition={{ delay: 0.15, duration: 0.5 }}
                >
                  <ActiveIcon className="w-40 h-40 text-gray-900" strokeWidth={0.8} />
                </motion.div>

                {/* Updated badge — top right */}
                <motion.div
                  className="absolute top-6 right-6 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full border border-orange-200/60 bg-white/70 backdrop-blur-sm"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-orange-500" />
                  <span className="text-[11px] font-semibold text-orange-600">Updated in 2025</span>
                </motion.div>

                {/* Content */}
                <div className="relative z-10 px-10 py-8 flex flex-col h-full">

                  {/* Duration */}
                  <motion.div
                    className="flex items-center gap-1.5 text-gray-500 mb-5"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.06, duration: 0.3 }}
                  >
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">{activeCourse.duration} part-time</span>
                  </motion.div>

                  {/* Course title */}
                  <motion.h3
                    className="text-3xl md:text-[2.4rem] font-bold text-gray-900 leading-[1.15] mb-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08, duration: 0.4 }}
                  >
                    {activeCourse.name}
                  </motion.h3>

                  {/* Category badge */}
                  <motion.div
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-orange-400 text-white mb-6 w-fit shadow-sm"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.12, duration: 0.3 }}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span className="text-xs font-semibold capitalize">{activeCourse.category}</span>
                  </motion.div>

                  {/* Description */}
                  <motion.p
                    className="text-gray-600 text-[15px] leading-relaxed mb-7 max-w-md"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.16, duration: 0.35 }}
                  >
                    {activeCourse.description}
                  </motion.p>

                  {/* Tool chips */}
                  <motion.div
                    className="flex flex-wrap gap-2 mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.35 }}
                  >
                    {activeCourse.tools.map((tool) => (
                      <span
                        key={tool}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/80 backdrop-blur-sm border border-gray-200/60 text-xs text-gray-600 font-medium shadow-sm"
                      >
                        {toolLogos[tool] && (
                          <img src={toolLogos[tool]} alt={tool} width={14} height={14} className="w-3.5 h-3.5 object-contain" />
                        )}
                        {tool}
                      </span>
                    ))}
                  </motion.div>

                  {/* Spacer */}
                  <div className="flex-1" />

                  {/* Bottom row */}
                  <motion.div
                    className="flex items-end justify-between"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.26, duration: 0.35 }}
                  >
                    <span className="text-xs text-gray-400 font-medium">{activeCourse.level}</span>
                    <Link href={`/courses/${activeCourse.slug}`}>
                      <span className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full border border-gray-900 text-gray-900 text-sm font-semibold hover:bg-gray-900 hover:text-white transition-colors duration-200 group/cta">
                        Discover program
                        <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/cta:translate-x-0.5" />
                      </span>
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Mobile card */}
          <div className="lg:hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCourse.slug}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                className="border-t border-gray-100 relative overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, #ffffff 0%, #fff9f2 35%, #fff0e0 70%, #ffe4c8 100%)",
                }}
              >
                <div className={cn("absolute inset-0 bg-gradient-to-br opacity-40", activeCourse.gradient)} />
                <div className="relative z-10 px-6 py-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="text-sm font-medium">{activeCourse.duration}</span>
                    </div>
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-orange-200/60 bg-white/70">
                      <CheckCircle2 className="w-3 h-3 text-orange-500" />
                      <span className="text-[10px] font-semibold text-orange-600">Updated in 2025</span>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{activeCourse.name}</h3>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-400 text-white mb-4">
                    <Zap className="w-3 h-3" />
                    <span className="text-[11px] font-semibold capitalize">{activeCourse.category}</span>
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed mb-5">{activeCourse.description}</p>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {activeCourse.tools.map((tool) => (
                      <span key={tool} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/80 border border-gray-200/60 text-[11px] text-gray-600 font-medium shadow-sm">
                        {toolLogos[tool] && (
                          <img src={toolLogos[tool]} alt={tool} width={12} height={12} className="w-3 h-3 object-contain" />
                        )}
                        {tool}
                      </span>
                    ))}
                  </div>

                  <div className="flex justify-end">
                    <Link href={`/courses/${activeCourse.slug}`}>
                      <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-900 text-gray-900 text-sm font-semibold">
                        Discover program
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        </div>
      </div>

      {/* Bottom separator */}
      <div className="w-full h-px bg-gray-300/50" />
    </section>
  );
}
