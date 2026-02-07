"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";

import Badge from "@/components/ui/Badge";
import {
  ScrollReveal,
  StaggerLines,
  LineMaskReveal,
} from "@/components/animation";
import { ThemeProvider } from "@/lib/theme";

const posts = [
  {
    title: "Data Analyst vs Data Scientist - What's the Actual Difference?",
    category: "Career Tips",
    excerpt:
      "Everyone confuses these two roles. Here's a no-nonsense breakdown of what each one does, what they earn, and which one might suit you better.",
    readTime: "8 min read",
    date: "Jan 2026",
    image: "/images/sections/career-transition.png",
  },
  {
    title: "10 Python Libraries You'll Use Every Single Day in Data",
    category: "Data Science",
    excerpt:
      "Pandas, NumPy, Scikit-learn, PyTorch - these aren't optional anymore. Here's what each one does and why you need to know them.",
    readTime: "10 min read",
    date: "Dec 2025",
    image: "/images/blog/data-science-trends.png",
  },
  {
    title: "Your Portfolio Is Your Resume Now - Here's How to Build One",
    category: "Career Tips",
    excerpt:
      "Recruiters don't care about your coursework. They want to see what you've built. Here's how to put together a portfolio that actually lands interviews.",
    readTime: "7 min read",
    date: "Nov 2025",
    image: "/images/blog/learning-tips.png",
  },
  {
    title: "So You Want to Be an AI Engineer - Here's the Honest Roadmap",
    category: "AI",
    excerpt:
      "Linear algebra, transformers, deployment pipelines - it's a lot. We mapped out the full journey so you know exactly what to learn and in what order.",
    readTime: "12 min read",
    date: "Oct 2025",
    image: "/images/sections/abstract-data-flow.png",
  },
  {
    title: "Why Every Company Is Suddenly Hiring BI Analysts",
    category: "Business Intelligence",
    excerpt:
      "Business Intelligence isn't a buzzword anymore - it's a hiring priority. Here's why companies are investing in BI and what that means for your career.",
    readTime: "6 min read",
    date: "Sep 2025",
    image: "/images/courses/business-intelligence.png",
  },
  {
    title: "SQL Is Not Dead - Why It's Still the #1 Skill Employers Want",
    category: "Data Science",
    excerpt:
      "Every shiny new tool still talks to a database. Here's why SQL remains the most in-demand skill and how to go from basics to writing production queries.",
    readTime: "9 min read",
    date: "Aug 2025",
    image: "/images/courses/data-analytics.png",
  },
];

const categoryColor: Record<string, "orange" | "default" | "glass" | "navy"> = {
  "Career Tips": "orange",
  "Data Science": "navy",
  AI: "glass",
  "Business Intelligence": "default",
};

/* ═══════════════════════════════════════════════════════════════════
   FLOATING TOPIC PILL (hero decoration)
   ═══════════════════════════════════════════════════════════════════ */

const floatingTopics = [
  { label: "Data Science", icon: "📊" },
  { label: "Career Tips", icon: "🚀" },
  { label: "AI & ML", icon: "🤖" },
  { label: "Python", icon: "🐍" },
];

function FloatingTopicPill({
  topic,
  className,
  delay = 0,
}: {
  topic: { label: string; icon: string };
  className: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={`absolute z-20 ${className}`}
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 1, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4 + delay, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="text-xl">{topic.icon}</span>
        <span className="text-white text-sm font-semibold">{topic.label}</span>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════════════ */

export default function BlogPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.98]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <ThemeProvider theme="light">
      <div className="min-h-screen bg-white text-navy-900">
        {/* ╔══════════════════════════════════════════════════════════════╗
            ║  HERO - Cinematic dark with floating topic pills           ║
            ╚══════════════════════════════════════════════════════════════╝ */}
        <section
          ref={heroRef}
          className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-[#050a14] py-24 md:py-28"
        >
          {/* Animated mesh gradient */}
          <div className="absolute inset-0 ss-stripe-gradient" />

          {/* Gradient orbs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="ss-orb ss-orb-1" />
            <div className="ss-orb ss-orb-2" />
            <div className="ss-orb ss-orb-3" />
            <div className="ss-orb ss-orb-4" />
          </div>

          {/* Grid + noise + vignette */}
          <div className="absolute inset-0 ss-noise opacity-[0.025]" />
          <div className="absolute inset-0 z-[2] ss-grid-pattern" />
          <div className="absolute inset-0 z-[3] bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,transparent_30%,#050a14_100%)]" />

          {/* Scan lines */}
          <div className="absolute inset-0 z-[2] pointer-events-none">
            <div className="ss-scanline ss-scanline-1" />
            <div className="ss-scanline ss-scanline-2" />
          </div>

          {/* Floating topic pills - desktop only */}
          <div className="hidden lg:block">
            <FloatingTopicPill topic={floatingTopics[0]} className="top-[18%] left-[5%]" delay={2} />
            <FloatingTopicPill topic={floatingTopics[1]} className="top-[22%] right-[5%]" delay={2.5} />
            <FloatingTopicPill topic={floatingTopics[2]} className="bottom-[24%] left-[6%]" delay={3} />
            <FloatingTopicPill topic={floatingTopics[3]} className="bottom-[20%] right-[6%]" delay={3.3} />
          </div>

          {/* Content */}
          <motion.div
            className="relative z-10 text-center max-w-5xl mx-auto px-6"
            style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
          >
            {/* Eyebrow badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] backdrop-blur-xl mb-6">
                <span className="w-2 h-2 rounded-full bg-orange-500 about-pulse-dot" />
                <span className="text-sm text-gray-300 font-medium">
                  Your shortcut to staying ahead in data & AI
                </span>
              </span>
            </motion.div>

            {/* Main heading */}
            <StaggerLines baseDelay={0.3} staggerDelay={0.14} skewY={-5} distance={140}>
              <h1 className="text-4xl md:text-6xl lg:text-[5.5rem] font-black text-white leading-[0.95] tracking-tight">
                Read. Learn.
              </h1>
              <h1 className="text-4xl md:text-6xl lg:text-[5.5rem] font-black leading-[0.95] tracking-tight">
                <span className="hero-gradient-text">Build.</span>
              </h1>
            </StaggerLines>

            {/* Subtitle */}
            <LineMaskReveal delay={1} staggerDelay={0.2} className="mt-6 max-w-2xl mx-auto">
              <p className="text-base md:text-lg text-gray-500 leading-relaxed">
                No-fluff guides on data science, AI careers, and the tools
              </p>
              <p className="text-base md:text-lg text-white/50 leading-relaxed">
                that top professionals use every day.
              </p>
            </LineMaskReveal>

            {/* Hero stats row */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="mt-10 flex items-center justify-center gap-8 md:gap-14 flex-wrap"
            >
              {[
                { value: "50+", label: "Articles" },
                { value: "10+", label: "Topics" },
                { value: "Free", label: "Always" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <span className="text-2xl md:text-3xl font-black text-white">{s.value}</span>
                  <p className="text-[10px] text-white/25 font-medium mt-0.5 tracking-wider uppercase">{s.label}</p>
                </div>
              ))}
            </motion.div>

            {/* Scroll CTA */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="mt-10"
            >
              <a
                href="#blog-posts"
                className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold text-base shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:shadow-xl transition-all duration-500 hover:-translate-y-0.5"
              >
                Start Reading
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="transition-transform duration-500 group-hover:translate-y-0.5">
                  <path d="M9 3V15M9 15L4 10M9 15L14 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </motion.div>
          </motion.div>
        </section>

        {/* Section Heading */}
        <section id="blog-posts" className="pt-20 pb-10 px-6 max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black leading-tight">
              <span className="text-navy-900">Fresh Perspectives. </span>
              <span className="text-orange-500">Real Skills.</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <p className="mt-4 text-base md:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Actionable insights from industry practitioners to help you master the tools,
              land the roles, and build a career that stands out.
            </p>
          </ScrollReveal>
        </section>

        {/* Blog Grid */}
        <section className="pb-16 pt-6 px-6 max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                  <article className="group rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-[0_2px_16px_rgba(0,0,0,0.06)] hover:border-orange-300 hover:shadow-[0_8px_30px_rgba(249,115,22,0.1)] transition-all duration-300 h-full flex flex-col">
                    <div className="relative w-full aspect-[16/10] overflow-hidden">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                      <div className="absolute top-3 left-3">
                        <Badge variant={categoryColor[post.category] || "default"}>
                          {post.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <h2 className="text-lg font-bold text-navy-900 group-hover:text-orange-500 transition-colors mb-3 leading-snug">
                        {post.title}
                      </h2>
                      <p className="text-gray-600 text-sm leading-relaxed flex-1">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2 text-gray-400 text-xs">
                          <span>{post.date}</span>
                          <span>&middot;</span>
                          <span>{post.readTime}</span>
                        </div>
                        <span className="text-orange-500 text-xs font-semibold group-hover:underline">
                          Read more
                        </span>
                      </div>
                    </div>
                  </article>
              </ScrollReveal>
            ))}
          </div>
        </section>
      </div>
    </ThemeProvider>
  );
}
