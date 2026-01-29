"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Badge from "@/components/ui/Badge";
import BorderGlow from "@/components/animation/BorderGlow";
import { ArrowRight, BarChart3, Brain, LineChart, Briefcase, Users, MessageCircle, GraduationCap, Rocket, Target } from "lucide-react";
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
};

const courses = [
  {
    slug: "data-analytics",
    name: "Data Analytics Accelerator",
    duration: "6 Months",
    level: "Beginner to Advanced",
    tagline: "Turn raw data into decisions that move businesses forward.",
    description: "Master Excel, SQL, Python, Tableau, and Power BI by solving real business problems - not textbook exercises. Walk out with a portfolio that proves you can deliver insights, not just run queries.",
    icon: BarChart3,
    tools: ["Python", "SQL", "Tableau", "Power BI", "Excel"],
    accent: "bg-cyan-500",
    accentBorder: "border-cyan-500",
    textAccent: "text-cyan-400",
    usps: [
      { icon: Rocket, label: "25+ Industry Projects" },
      { icon: Briefcase, label: "40+ Hiring Partners" },
      { icon: Users, label: "1:1 Mentorship" },
      { icon: MessageCircle, label: "Daily Doubt Clearing" },
      { icon: Target, label: "100+ Hours of Learning" },
      { icon: GraduationCap, label: "Placement Assistance" },
    ],
    gradientBg: "from-cyan-500/20 via-teal-500/10 to-transparent",
  },
  {
    slug: "data-science-ai",
    name: "Data Science & AI Mastery",
    duration: "12 Months",
    level: "Zero to Expert",
    tagline: "Build, train, and deploy AI that solves real-world problems.",
    description: "The complete journey - from Python fundamentals to neural networks, NLP, generative AI, and production deployment. You won't just learn theory; you'll ship models that work in the real world.",
    icon: Brain,
    tools: ["TensorFlow", "PyTorch", "Docker", "AWS", "BERT"],
    accent: "bg-orange-500",
    accentBorder: "border-orange-500",
    textAccent: "text-orange-400",
    usps: [
      { icon: Rocket, label: "30+ Real-World Projects" },
      { icon: Briefcase, label: "40+ Hiring Partners" },
      { icon: Users, label: "1:1 Expert Sessions" },
      { icon: MessageCircle, label: "Daily Doubt Clearing" },
      { icon: Target, label: "200+ Hours of Learning" },
      { icon: GraduationCap, label: "Career Support & Placement" },
    ],
    gradientBg: "from-orange-500/20 via-red-500/10 to-transparent",
  },
  {
    slug: "business-intelligence",
    name: "Business Intelligence & Strategy",
    duration: "12 Months",
    level: "Professional Upskilling",
    tagline: "Lead with data. Decide with confidence.",
    description: "Designed for professionals and leaders who refuse to guess. Master BI tools, predictive analytics, and AI-driven strategy - then walk into every meeting with the numbers that win arguments.",
    icon: LineChart,
    tools: ["Power BI", "Looker", "SQL", "Python", "Tableau"],
    accent: "bg-emerald-500",
    accentBorder: "border-emerald-500",
    textAccent: "text-emerald-400",
    usps: [
      { icon: Rocket, label: "25+ Capstone Projects" },
      { icon: Briefcase, label: "40+ Hiring Partners" },
      { icon: Users, label: "1:1 Strategy Sessions" },
      { icon: MessageCircle, label: "Daily Doubt Clearing" },
      { icon: Target, label: "Leadership Training" },
      { icon: GraduationCap, label: "Executive Placement" },
    ],
    gradientBg: "from-emerald-500/20 via-teal-500/10 to-transparent",
  },
];

export default function CoursePreview() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [depthOffset, setDepthOffset] = useState({ x: 0, y: 0 });

  const handleDepthHover = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 12;
    setDepthOffset({ x, y });
  }, []);

  const handleDepthLeave = useCallback(() => {
    setDepthOffset({ x: 0, y: 0 });
  }, []);

  return (
    <section className="py-24 md:py-32 px-6 bg-black overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header with masked reveal */}
        <div className="mb-16 md:mb-20 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="overflow-hidden">
              <motion.div
                className="flex items-center gap-3 mb-4"
                initial={{ y: "100%" }}
                whileInView={{ y: "0%" }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
              >
                <span className="w-8 h-[2px] bg-orange-500" />
                <span className="text-orange-400 text-sm font-semibold tracking-widest uppercase">Programs Built for Results</span>
              </motion.div>
            </div>
            <div className="overflow-hidden">
              <motion.h2
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight"
                initial={{ y: "100%" }}
                whileInView={{ y: "0%" }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
              >
                Choose Your Path.
              </motion.h2>
            </div>
            <div className="overflow-hidden">
              <motion.h2
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-orange-400 leading-tight"
                initial={{ y: "100%" }}
                whileInView={{ y: "0%" }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
              >
                Own Your Future.
              </motion.h2>
            </div>
          </div>
          <div className="overflow-hidden">
            <motion.p
              className="text-gray-300 text-lg max-w-sm md:text-right"
              initial={{ y: "100%", opacity: 0 }}
              whileInView={{ y: "0%", opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
            >
              Every program is engineered to take you from where you are to where the industry needs you. No fluff - just skills that get you hired.
            </motion.p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

          {/* Left: Numbered course accordion */}
          <div className="lg:col-span-7 flex flex-col">
            {courses.map((course, i) => {
              const isActive = activeIndex === i;
              const Icon = course.icon;
              return (
                <motion.div
                  key={course.slug}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                >
                  <div
                    className={cn(
                      "group relative border-t border-white/[0.08] py-8 cursor-pointer transition-all duration-500",
                      isActive && "py-10"
                    )}
                    onClick={() => setActiveIndex(i)}
                    onMouseEnter={() => setActiveIndex(i)}
                    role="button"
                    tabIndex={0}
                    aria-expanded={isActive}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveIndex(i); } }}
                  >
                    <div className="flex items-start gap-6">
                      {/* Number */}
                      <span className={cn(
                        "text-sm font-mono font-bold mt-2 transition-colors duration-500 shrink-0",
                        isActive ? course.textAccent : "text-gray-600"
                      )}>
                        0{i + 1}
                      </span>

                      <div className="flex-1 min-w-0">
                        {/* Title row */}
                        <div className="flex items-center justify-between gap-4 mb-1">
                          <div className="overflow-hidden">
                            <h3 className={cn(
                              "text-xl md:text-2xl lg:text-3xl font-bold transition-colors duration-500",
                              isActive ? "text-white" : "text-gray-500 group-hover:text-gray-300"
                            )}>
                              {course.name}
                            </h3>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className={cn(
                              "hidden md:inline text-xs font-medium px-3 py-1 rounded-full border transition-all duration-500",
                              isActive
                                ? `${course.textAccent} ${course.accentBorder} bg-white/5`
                                : "text-gray-500 border-white/10"
                            )}>
                              {course.duration}
                            </span>
                            <motion.div
                              animate={{ rotate: isActive ? -45 : 0 }}
                              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                            >
                              <ArrowRight className={cn(
                                "w-5 h-5 transition-colors duration-300",
                                isActive ? "text-white" : "text-gray-600 group-hover:text-gray-400"
                              )} />
                            </motion.div>
                          </div>
                        </div>

                        <p className={cn(
                          "text-base transition-colors duration-300 mb-1",
                          isActive ? course.textAccent : "text-gray-600"
                        )}>
                          {course.tagline}
                        </p>

                        {/* Expanded content */}
                        <AnimatePresence initial={false}>
                          {isActive && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                              className="overflow-hidden"
                            >
                              <p className="text-gray-400 leading-relaxed mt-4 mb-6 max-w-xl">
                                {course.description}
                              </p>

                              {/* Tool chips */}
                              <div className="flex flex-wrap gap-2 mb-6">
                                {course.tools.map((tool, idx) => (
                                  <motion.span
                                    key={tool}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.05 + idx * 0.05, duration: 0.3 }}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs text-gray-300 hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300 cursor-default"
                                  >
                                    {toolLogos[tool] && (
                                      <img src={toolLogos[tool]} alt={tool} width={14} height={14} className="w-3.5 h-3.5 object-contain" />
                                    )}
                                    {tool}
                                  </motion.span>
                                ))}
                              </div>

                              <Link href={`/courses/${course.slug}`}>
                                <motion.span
                                  className="inline-flex items-center gap-2 text-white font-semibold text-sm group/link"
                                  whileHover={{ x: 4 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  View Full Syllabus
                                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1" />
                                </motion.span>
                              </Link>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
            {/* Bottom border */}
            <div className="border-t border-white/[0.08]" />
          </div>

          {/* Right: Sticky Preview Card */}
          <div className="lg:col-span-5 hidden lg:block relative">
            <div className="sticky top-32">
              <AnimatePresence mode="wait">
                {courses.map((course, i) => (
                  activeIndex === i && (
                    <motion.div
                      key={course.slug}
                      initial={{ opacity: 0, y: 20, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.97, transition: { duration: 0.2 } }}
                      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                      className="relative depth-hover"
                      onMouseMove={handleDepthHover}
                      onMouseLeave={handleDepthLeave}
                    >
                      <BorderGlow glowColor="white" glowIntensity="subtle">
                        <div
                          className={cn("depth-hover-inner relative aspect-[4/5] rounded-3xl overflow-hidden bg-[#0a0a0f] border shadow-2xl", course.accentBorder + "/30 border-opacity-30")}
                          style={{
                            transform: `rotateY(${depthOffset.x}deg) rotateX(${-depthOffset.y}deg) translateZ(10px)`,
                          }}
                        >
                          {/* Animated gradient bg */}
                          <motion.div
                            className={cn("absolute inset-0 bg-gradient-to-br opacity-40", course.gradientBg)}
                            animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                            style={{ backgroundSize: '200% 200%' }}
                          />
                          <motion.div
                            className={cn("absolute w-64 h-64 rounded-full blur-3xl opacity-20", course.accent)}
                            animate={{ x: [0, 30, -20, 0], y: [0, -20, 30, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            style={{ top: '10%', right: '-10%' }}
                          />

                          {/* Content */}
                          <div className="absolute inset-0 p-10 flex flex-col justify-between">
                            {/* Top: icon + badge */}
                            <div className="flex justify-between items-start">
                              <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/10", course.textAccent)}>
                                <course.icon className="w-8 h-8" />
                              </div>
                              <Badge variant="glass">{course.duration}</Badge>
                            </div>

                            {/* Middle: course info */}
                            <div>
                              <motion.h3
                                className="text-2xl font-bold text-white mb-2 leading-tight"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1, duration: 0.4 }}
                              >
                                {course.name}
                              </motion.h3>
                              <motion.p
                                className={cn("text-sm font-medium mb-3", course.textAccent)}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.4 }}
                              >
                                {course.tagline}
                              </motion.p>
                              <motion.span
                                className="inline-block text-xs text-gray-400 px-3 py-1 rounded-full border border-white/10 bg-white/5"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3, duration: 0.4 }}
                              >
                                {course.level}
                              </motion.span>
                            </div>

                            {/* Bottom: USPs grid */}
                            <div className="grid grid-cols-2 gap-2.5">
                              {course.usps.map((usp, idx) => (
                                <motion.div
                                  key={usp.label}
                                  initial={{ opacity: 0, y: 12 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.1 + idx * 0.06, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                                  className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.06] backdrop-blur-sm border border-white/[0.08]"
                                >
                                  <usp.icon className={cn("w-4 h-4 shrink-0", course.textAccent)} />
                                  <span className="text-white font-medium text-xs leading-tight">{usp.label}</span>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </BorderGlow>
                    </motion.div>
                  )
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
