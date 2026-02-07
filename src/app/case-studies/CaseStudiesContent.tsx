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

/* ═══════════════════════════════════════════════════════════════════
   CASE STUDY DATA - 2026 · Senior Data Scientist Perspective
   ═══════════════════════════════════════════════════════════════════ */

interface CaseStudy {
  company: string;
  initial: string;
  logo: string;
  color: string;
  domain: string;
  title: string;
  description: string;
  technologies: string[];
  impact: string;
  category: string;
}

const caseStudies: CaseStudy[] = [
  {
    company: "Netflix",
    initial: "N",
    logo: "/images/companies/netflix.svg",
    color: "#E50914",
    domain: "Entertainment",
    title: "How Recommendations Drive 80% of What You Watch",
    description:
      "Two-tower neural architecture processes billions of signals daily for 260M+ subscribers, reducing churn by 25% and saving $1B annually.",
    technologies: ["Deep Learning", "Collaborative Filtering", "PyTorch", "A/B Testing"],
    impact: "80% content from recommendations",
    category: "Deep Learning",
  },
  {
    company: "Uber",
    initial: "U",
    logo: "/images/companies/uber.svg",
    color: "#276EF1",
    domain: "Transportation",
    title: "Real-Time Demand Prediction Across 10,000+ Cities",
    description:
      "Ensemble of XGBoost and LSTM networks processes 100M+ data points per minute, cutting passenger wait times by 35% through dynamic surge pricing.",
    technologies: ["XGBoost", "LSTM", "Kafka", "Real-time ML"],
    impact: "35% less wait time",
    category: "Time Series",
  },
  {
    company: "Spotify",
    initial: "S",
    logo: "/images/companies/spotify.svg",
    color: "#1DB954",
    domain: "Audio Streaming",
    title: "AI DJ and Discover Weekly for 600M+ Users",
    description:
      "Hybrid matrix factorization and transformer-based audio analysis generates hyper-personalized playlists with a 40% save rate across 600M+ users.",
    technologies: ["Matrix Factorization", "Transformers", "TensorFlow", "NLP"],
    impact: "40% track save rate",
    category: "ML",
  },
  {
    company: "Tesla",
    initial: "T",
    logo: "/images/companies/tesla.svg",
    color: "#CC0000",
    domain: "Autonomous Vehicles",
    title: "Vision-Only Self-Driving Trained on 10B+ Miles",
    description:
      "HydraNet transformer architecture processes 8 camera feeds to build 3D occupancy networks without LiDAR, trained on fleet-collected real-world data.",
    technologies: ["Computer Vision", "Transformers", "PyTorch", "CUDA"],
    impact: "10B+ miles of training data",
    category: "Computer Vision",
  },
  {
    company: "JPMorgan",
    initial: "JPM",
    logo: "/images/companies/jpmorgan.svg",
    color: "#003A70",
    domain: "Finance",
    title: "Graph Neural Networks Catching $150M in Fraud",
    description:
      "Real-time scoring engine processes 5B+ annual transactions in under 50ms, identifying sophisticated fraud rings that rule-based systems miss.",
    technologies: ["Graph Neural Networks", "Anomaly Detection", "Feature Store", "Kubernetes"],
    impact: "$150M+ saved annually",
    category: "ML",
  },
  {
    company: "Airbnb",
    initial: "A",
    logo: "/images/companies/airbnb.svg",
    color: "#FF5A5F",
    domain: "Travel",
    title: "Smart Pricing That Boosted Host Revenue by 13%",
    description:
      "Gradient-boosted trees trained on 200+ features update nightly for 7M+ listings, balancing booking rates with host earnings through price elasticity modeling.",
    technologies: ["Gradient Boosting", "Feature Engineering", "Spark ML", "Airflow"],
    impact: "13% more host revenue",
    category: "ML",
  },
  {
    company: "Google DeepMind",
    initial: "DM",
    logo: "/images/companies/deepmind.svg",
    color: "#4285F4",
    domain: "Biotech",
    title: "AlphaFold: Predicting 200M+ Protein Structures",
    description:
      "Attention-based architecture solved a 50-year grand challenge in biology, accelerating drug discovery timelines from years to weeks.",
    technologies: ["Attention Mechanisms", "Structure Prediction", "JAX", "TPU"],
    impact: "200M+ structures predicted",
    category: "Deep Learning",
  },
  {
    company: "Zomato",
    initial: "Z",
    logo: "/images/companies/zomato.svg",
    color: "#E23744",
    domain: "Food Delivery",
    title: "95% Accurate Delivery Time Prediction in Real-Time",
    description:
      "Multi-objective optimization balances delivery speed and rider utilization using live traffic, weather, and prep-time signals across 1,000+ cities.",
    technologies: ["Geospatial ML", "Optimization", "Real-time Features", "Python"],
    impact: "95% prediction accuracy",
    category: "Optimization",
  },
  {
    company: "OpenAI",
    initial: "OA",
    logo: "/images/companies/openai.svg",
    color: "#10A37F",
    domain: "Artificial Intelligence",
    title: "Scaling LLMs with RLHF to 200M+ Weekly Users",
    description:
      "Reinforcement learning from human feedback aligns GPT models across reasoning, code, and creative tasks, powering the fastest-growing consumer product in history.",
    technologies: ["RLHF", "Transformers", "Distributed Training", "Triton"],
    impact: "200M+ weekly active users",
    category: "Deep Learning",
  },
];

const categoryColor: Record<string, "orange" | "default" | "glass" | "navy"> = {
  ML: "orange",
  "Deep Learning": "navy",
  "Computer Vision": "glass",
  "Time Series": "default",
  NLP: "orange",
  Optimization: "navy",
};


/* ═══════════════════════════════════════════════════════════════════
   FLOATING COMPANY PILL (hero decoration)
   ═══════════════════════════════════════════════════════════════════ */

function FloatingCompanyPill({
  company,
  className,
  delay = 0,
}: {
  company: CaseStudy;
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
        className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4 + delay, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-10 h-10 rounded-xl bg-white/[0.08] flex items-center justify-center shrink-0 overflow-hidden p-1.5">
          <Image
            src={company.logo}
            alt={company.company}
            width={28}
            height={28}
            className="w-7 h-7 object-contain brightness-0 invert"
          />
        </div>
        <div className="min-w-0">
          <p className="text-white text-sm font-semibold truncate">{company.company}</p>
          <p className="text-white/35 text-[11px] truncate">{company.domain}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   CARD COMPONENT - Clean, compact, modern
   ═══════════════════════════════════════════════════════════════════ */

function CaseStudyCard({ study }: { study: CaseStudy }) {
  return (
    <article className="group relative rounded-2xl p-5 bg-white border border-gray-200/80 hover:border-orange-300/60 hover:shadow-[0_8px_30px_rgba(249,115,22,0.08)] transition-all duration-300 h-full flex flex-col">
      {/* Top accent line on hover */}
      <div className="absolute top-0 left-6 right-6 h-[2px] rounded-full bg-gradient-to-r from-transparent via-orange-500/0 to-transparent group-hover:via-orange-500/50 transition-all duration-500" />

      {/* Company row */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 overflow-hidden p-1.5"
            style={{ background: `${study.color}15` }}
          >
            <Image
              src={study.logo}
              alt={study.company}
              width={24}
              height={24}
              className="w-6 h-6 object-contain"
            />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-navy-900 leading-tight truncate">{study.company}</h3>
            <span className="text-[11px] text-gray-400">{study.domain}</span>
          </div>
        </div>
        <Badge variant={categoryColor[study.category] || "default"}>{study.category}</Badge>
      </div>

      {/* Title */}
      <h2 className="text-[15px] font-bold text-navy-900 group-hover:text-orange-500 transition-colors leading-snug mb-2">
        {study.title}
      </h2>

      {/* Description */}
      <p className="text-gray-500 text-[13px] leading-relaxed flex-1 mb-4">
        {study.description}
      </p>

      {/* Impact + Tech row */}
      <div className="pt-3 border-t border-gray-100 space-y-2.5">
        {/* Impact */}
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
          <span className="text-orange-600 text-xs font-semibold">{study.impact}</span>
        </div>

        {/* Technologies */}
        <div className="flex flex-wrap gap-1">
          {study.technologies.map((tech) => (
            <span
              key={tech}
              className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-500"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════════════ */

export default function CaseStudiesPage() {
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
            ║  HERO - Cinematic dark with floating company pills         ║
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

          {/* Floating company pills - desktop only */}
          <div className="hidden lg:block">
            <FloatingCompanyPill company={caseStudies[0]} className="top-[18%] left-[4%]" delay={2} />
            <FloatingCompanyPill company={caseStudies[2]} className="top-[22%] right-[4%]" delay={2.5} />
            <FloatingCompanyPill company={caseStudies[3]} className="bottom-[24%] left-[6%]" delay={3} />
            <FloatingCompanyPill company={caseStudies[4]} className="bottom-[20%] right-[5%]" delay={3.3} />
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
                  Learn how billion-dollar companies leverage AI
                </span>
              </span>
            </motion.div>

            {/* Main heading */}
            <StaggerLines baseDelay={0.3} staggerDelay={0.14} skewY={-5} distance={140}>
              <h1 className="text-4xl md:text-6xl lg:text-[5.5rem] font-black text-white leading-[0.95] tracking-tight">
                Data Drives
              </h1>
              <h1 className="text-4xl md:text-6xl lg:text-[5.5rem] font-black leading-[0.95] tracking-tight">
                <span className="hero-gradient-text">Everything.</span>
              </h1>
            </StaggerLines>

            {/* Subtitle */}
            <LineMaskReveal delay={1} staggerDelay={0.2} className="mt-6 max-w-2xl mx-auto">
              <p className="text-base md:text-lg text-gray-500 leading-relaxed">
                How the world&apos;s most innovative companies use data science, AI,
              </p>
              <p className="text-base md:text-lg text-white/50 leading-relaxed">
                and machine learning to solve problems that matter.
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
                { value: "20+", label: "Case Studies" },
                { value: "10+", label: "Industries" },
                { value: "$1B+", label: "Impact Documented" },
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
                href="#case-studies"
                className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold text-base shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:shadow-xl transition-all duration-500 hover:-translate-y-0.5"
              >
                Explore Case Studies
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="transition-transform duration-500 group-hover:translate-y-0.5">
                  <path d="M9 3V15M9 15L4 10M9 15L14 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </motion.div>
          </motion.div>
        </section>

        {/* Section Heading */}
        <section id="case-studies" className="pt-20 pb-10 px-6 max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black leading-tight">
              <span className="text-navy-900">Real Impact. </span>
              <span className="text-orange-500">Real Companies.</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <p className="mt-4 text-base md:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
              The breakthroughs shaping tomorrow are powered by data today. Explore how industry
              leaders turn bold ideas into measurable results with AI and machine learning.
            </p>
          </ScrollReveal>
        </section>

        {/* Case Studies Grid */}
        <section className="pb-16 pt-6 px-6 max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {caseStudies.map((cs, i) => (
              <ScrollReveal key={i} delay={i * 0.08}>
                <CaseStudyCard study={cs} />
              </ScrollReveal>
            ))}
          </div>
        </section>

      </div>
    </ThemeProvider>
  );
}
