"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import { ArrowRight, ArrowUpRight, Clock, Users, TrendingUp, Award, ChevronRight, Sparkles, Play } from "lucide-react";
import { ScrollReveal, Counter } from "@/components/animation";
import Button from "@/components/ui/Button";
import { ThemeProvider } from "@/lib/theme";
import { STATS } from "@/lib/constants";
import HiringPartners from "@/components/sections/HiringPartners";
import { useEnquiryModal } from "@/components/forms/EnquiryModal";

/* ─────────────────────────── DATA ─────────────────────────── */

const courses = [
  {
    id: "data-analytics",
    name: "Data Analytics",
    shortName: "DA",
    duration: "6 Months",
    level: "Beginner to Advanced",
    tagline: "Go from spreadsheets to strategic thinking — fast.",
    description:
      "Master Excel, SQL, Python, Tableau, and Power BI by building real analytics projects. Not toy datasets — actual business problems with 100% placement.",
    color: "#4F46E5",
    gradient: "from-indigo-600 via-blue-600 to-cyan-500",
    lightGradient: "from-indigo-50 to-blue-50",
    accentBg: "bg-indigo-500",
    href: "/courses/data-analytics",
    highlights: ["18+ Tools", "4 Portfolio Projects", "100% Placement"],
    tools: ["Excel", "SQL", "Python", "Tableau", "Power BI", "Pandas"],
    salary: "₹6–12 LPA",
    topRole: "Data Analyst",
    bestFor: "Career switchers & fresh graduates",
    projects: 4,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" />
        <path d="M7 16l4-8 4 4 5-9" />
      </svg>
    ),
  },
  {
    id: "business-analytics",
    name: "Business Analytics",
    shortName: "BA",
    duration: "6 Months",
    level: "Beginner to Advanced",
    tagline: "Bridge business strategy and data insights.",
    description:
      "Learn to translate business questions into data-driven answers. Master analytics frameworks, dashboards, and storytelling that executives actually act on.",
    color: "#059669",
    gradient: "from-emerald-600 via-teal-500 to-green-400",
    lightGradient: "from-emerald-50 to-teal-50",
    accentBg: "bg-emerald-500",
    href: "/courses/business-analytics",
    highlights: ["15+ Tools", "5 Projects", "Business Focus"],
    tools: ["Power BI", "Tableau", "SQL", "Python", "Excel", "Looker"],
    salary: "₹6–14 LPA",
    topRole: "Business Analyst",
    bestFor: "Business professionals",
    projects: 5,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 21H3V3" />
        <path d="M7 17V13" />
        <path d="M11 17V9" />
        <path d="M15 17V5" />
        <path d="M19 17V11" />
      </svg>
    ),
  },
  {
    id: "data-science-ai",
    name: "Data Science and AI",
    shortName: "DS",
    duration: "12 Months",
    level: "Zero to Expert",
    tagline: "From your first Python script to production ML models.",
    description:
      "The full journey — Python, neural networks, NLP, generative AI, and deployment. Seven modules that take you from zero to genuinely job-ready in data science.",
    color: "#7C3AED",
    gradient: "from-violet-600 via-purple-600 to-fuchsia-500",
    lightGradient: "from-violet-50 to-purple-50",
    accentBg: "bg-violet-500",
    href: "/courses/data-science-ai",
    highlights: ["36+ Tools", "7 Case Studies", "MLOps Ready"],
    tools: ["Python", "TensorFlow", "PyTorch", "AWS", "Docker", "HuggingFace"],
    salary: "₹8–18 LPA",
    topRole: "Data Scientist",
    bestFor: "Aspiring data scientists & AI engineers",
    projects: 7,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a4 4 0 0 1 4 4c0 1.95-1.4 3.57-3.25 3.92" />
        <path d="M8.24 9.92A4 4 0 0 1 12 2" />
        <circle cx="12" cy="12" r="3" />
        <path d="M12 15v7" />
        <path d="M8 18h8" />
        <path d="M6 8.5L3 10" />
        <path d="M18 8.5L21 10" />
      </svg>
    ),
  },
  {
    id: "agentic-ai",
    name: "Agentic AI & Prompt Engineering",
    shortName: "AI",
    duration: "6 Months",
    level: "Intermediate to Advanced",
    tagline: "Build autonomous AI agents that think and execute.",
    description:
      "Learn to design, build, and deploy AI agents. From prompt engineering to agentic workflows — this is the future of AI, and you'll be building it.",
    color: "#DB2777",
    gradient: "from-pink-600 via-rose-500 to-orange-400",
    lightGradient: "from-pink-50 to-rose-50",
    accentBg: "bg-pink-500",
    href: "/courses/agentic-ai",
    highlights: ["20+ Tools", "AI Agent Projects", "LangChain & OpenAI"],
    tools: ["LangChain", "OpenAI", "Python", "RAG", "Vector DB", "AutoGen"],
    salary: "₹10–20 LPA",
    topRole: "AI Engineer",
    bestFor: "AI builders & developers",
    projects: 6,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    id: "investment-banking",
    name: "Investment Banking",
    shortName: "IB",
    duration: "9 Months",
    level: "Beginner to Advanced",
    tagline: "Break into the world of high-stakes finance.",
    description:
      "Master financial modeling, valuation, M&A, and deal structuring. Built for those who want to land roles at top investment banks and financial institutions.",
    color: "#D97706",
    gradient: "from-amber-600 via-yellow-500 to-orange-400",
    lightGradient: "from-amber-50 to-yellow-50",
    accentBg: "bg-amber-500",
    href: "/courses/investment-banking",
    highlights: ["15+ Tools", "Finance Projects", "100% Placement"],
    tools: ["Excel", "Bloomberg", "Python", "VBA", "SQL", "Argus"],
    salary: "₹8–16 LPA",
    topRole: "IB Analyst",
    bestFor: "Finance aspirants",
    projects: 5,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 20h20" />
        <path d="M5 20V8l7-5 7 5v12" />
        <path d="M9 20v-4h6v4" />
        <path d="M9 12h.01" />
        <path d="M15 12h.01" />
      </svg>
    ),
  },
];

/* ─────────── Company Logo SVGs ─────────── */
const companyLogos: Record<string, React.ReactNode> = {
  Amazon: (<svg viewBox="0 0 24 24" className="w-5 h-5"><path d="M13.23 10.56c0 .43.01.79-.2 1.18-.17.31-.44.51-.74.51-.41 0-.65-.31-.65-.78 0-.92.82-1.08 1.59-1.08v.17zm1.07 2.62c-.07.06-.17.07-.25.02-.35-.29-.41-.43-.6-.71-.58.59-1 .77-1.74.77-.89 0-1.58-.55-1.58-1.65 0-.86.47-1.44 1.13-1.73.58-.25 1.38-.3 2-.37v-.14c0-.25.02-.55-.13-.77-.13-.19-.38-.27-.6-.27-.41 0-.77.21-.86.64-.02.1-.08.19-.17.19l-.95-.1c-.08-.02-.16-.08-.14-.19.21-1.07 1.3-1.45 2.48-1.45.6 0 1.39.16 1.86.62.6.55.55 1.29.55 2.09v1.89c0 .57.24.82.46 1.12.08.11.1.24-.01.32-.26.22-.73.63-.99.86z" fill="#FF9900"/><path d="M14.68 17.16c-2.68 1.98-6.57 3.04-9.91 3.04-4.69 0-8.91-1.74-12.11-4.63-.25-.23-.03-.54.28-.36 3.45 2 7.71 3.21 12.12 3.21 2.97 0 6.24-.62 9.25-1.89.45-.2.83.3.37.63z" fill="#FF9900"/></svg>),
  Google: (<svg viewBox="0 0 24 24" className="w-5 h-5"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>),
  Razorpay: (<svg viewBox="0 0 24 24" className="w-5 h-5"><path d="M8.63 1L2 18.75h4.43l1.72-4.78h5.9L8.63 1z" fill="#3395FF"/><path d="M14.05 13.97l-2.55 6.78h4.44L22 3.25h-4.44l-3.51 10.72z" fill="#072654"/></svg>),
  Accenture: (<svg viewBox="0 0 24 24" className="w-5 h-5"><path d="M1 17l11-14 12 14h-7l-5-6.5L7 17H1z" fill="#A100FF"/></svg>),
  Deloitte: (<svg viewBox="0 0 24 24" className="w-5 h-5"><circle cx="12" cy="12" r="10" fill="#86BC25"/></svg>),
  Wipro: (<svg viewBox="0 0 24 24" className="w-5 h-5"><path d="M2 16l4-12h2l-3 8h4l3-8h2l-4 12h-2l3-8H7l-3 8H2z" fill="#431D7E"/></svg>),
  Paytm: (<svg viewBox="0 0 24 24" className="w-5 h-5"><rect width="24" height="24" rx="4" fill="#00BAF2"/><text x="12" y="16" textAnchor="middle" fill="white" fontSize="8" fontWeight="700" fontFamily="Arial">Paytm</text></svg>),
  Siemens: (<svg viewBox="0 0 24 24" className="w-5 h-5"><rect width="24" height="24" rx="4" fill="#009999"/><text x="12" y="16" textAnchor="middle" fill="white" fontSize="8" fontWeight="700" fontFamily="Arial">S</text></svg>),
  Citi: (<svg viewBox="0 0 24 24" className="w-5 h-5"><rect width="24" height="24" rx="4" fill="#003DA5"/><path d="M6 8c0 0 3-4 6-4s6 4 6 4" fill="none" stroke="#E31837" strokeWidth="2.5"/><text x="12" y="18" textAnchor="middle" fill="white" fontSize="9" fontWeight="700" fontFamily="Arial">citi</text></svg>),
};

function CompanyLogo({ name }: { name: string }) {
  if (companyLogos[name]) return <>{companyLogos[name]}</>;
  const colors = ["#4F46E5","#059669","#DC2626","#7C3AED","#D97706","#0891B2","#DB2777","#2563EB","#1E3A5F","#E31837","#FF6600","#003B71","#6C5CE7","#0052CC","#FF3366","#00008F"];
  const c = colors[name.split("").reduce((a, ch) => a + ch.charCodeAt(0), 0) % colors.length];
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5">
      <rect width="24" height="24" rx="4" fill={c} />
      <text x="12" y="16" textAnchor="middle" fill="white" fontSize={name.length <= 3 ? "9" : "7"} fontWeight="700" fontFamily="Arial">
        {name.length <= 4 ? name : name.split(" ").map(w => w[0]).join("").slice(0, 3)}
      </text>
    </svg>
  );
}

const comparison = [
  { label: "Duration", key: "duration" as const },
  { label: "Best For", key: "bestFor" as const },
  { label: "Top Career Role", key: "topRole" as const },
  { label: "Salary Range", key: "salary" as const },
  { label: "Projects", key: "projects" as const },
];

/* ─────────── Rotating words for the hero ─────────── */
const rotatingWords = ["Data Analytics", "Business Analytics", "Data Science", "Agentic AI", "Investment Banking"];

function RotatingText() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((p) => (p + 1) % rotatingWords.length), 2800);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="relative inline-grid overflow-hidden" style={{ height: "1.2em" }}>
      {/* Invisible sizer — takes the width of the longest word */}
      {rotatingWords.map((w) => (
        <span key={w} className="invisible col-start-1 row-start-1 whitespace-nowrap">{w}</span>
      ))}
      <AnimatePresence mode="wait">
        <motion.span
          key={rotatingWords[index]}
          className="col-start-1 row-start-1 bg-gradient-to-r from-orange-500 via-orange-400 to-amber-400 bg-clip-text text-transparent whitespace-nowrap text-left"
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          {rotatingWords[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/* ─────────── Animated Background Elements ─────────── */
function AnimatedBackgroundElements() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating particles */}
      {Array.from({ length: 25 }).map((_, i) => (
        <motion.div
          key={`p-${i}`}
          className="absolute rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 4 + 2}px`,
            height: `${Math.random() * 4 + 2}px`,
            background: i % 3 === 0 ? "rgba(245,158,11,0.25)" : i % 3 === 1 ? "rgba(99,102,241,0.2)" : "rgba(16,185,129,0.18)",
          }}
          animate={{
            y: [0, -40 - Math.random() * 30, 0],
            x: [0, (Math.random() - 0.5) * 20, 0],
            opacity: [0.15, 0.5, 0.15],
            scale: [1, 1.4, 1],
          }}
          transition={{
            duration: 5 + Math.random() * 5,
            repeat: Infinity,
            delay: Math.random() * 4,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Floating geometric rings */}
      {[
        { size: 120, x: "8%", y: "15%", color: "rgba(245,158,11,0.08)", dur: 18, border: "rgba(245,158,11,0.12)" },
        { size: 80, x: "85%", y: "25%", color: "rgba(99,102,241,0.06)", dur: 22, border: "rgba(99,102,241,0.1)" },
        { size: 60, x: "75%", y: "70%", color: "rgba(16,185,129,0.06)", dur: 15, border: "rgba(16,185,129,0.1)" },
        { size: 100, x: "15%", y: "75%", color: "rgba(168,85,247,0.05)", dur: 20, border: "rgba(168,85,247,0.08)" },
      ].map((ring, i) => (
        <motion.div
          key={`ring-${i}`}
          className="absolute rounded-full"
          style={{
            width: ring.size,
            height: ring.size,
            left: ring.x,
            top: ring.y,
            border: `1.5px solid ${ring.border}`,
            background: ring.color,
          }}
          animate={{
            y: [0, -15, 0, 10, 0],
            x: [0, 8, 0, -8, 0],
            rotate: [0, 360],
            scale: [1, 1.05, 1, 0.97, 1],
          }}
          transition={{
            duration: ring.dur,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Animated dashed orbit paths */}
      <motion.svg
        className="absolute"
        style={{ left: "5%", top: "10%", width: 200, height: 200, opacity: 0.06 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      >
        <circle cx="100" cy="100" r="90" fill="none" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="8 6" />
        <circle cx="100" cy="100" r="60" fill="none" stroke="#6366F1" strokeWidth="1" strokeDasharray="5 8" />
      </motion.svg>

      <motion.svg
        className="absolute"
        style={{ right: "3%", bottom: "15%", width: 160, height: 160, opacity: 0.05 }}
        animate={{ rotate: -360 }}
        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
      >
        <circle cx="80" cy="80" r="70" fill="none" stroke="#10B981" strokeWidth="1.5" strokeDasharray="6 8" />
        <circle cx="80" cy="80" r="40" fill="none" stroke="#F59E0B" strokeWidth="1" strokeDasharray="4 6" />
      </motion.svg>

      {/* Floating hexagon shapes */}
      {[
        { x: "90%", y: "12%", size: 28, rot: 30, color: "rgba(245,158,11,0.12)", dur: 12 },
        { x: "6%", y: "55%", size: 22, rot: 0, color: "rgba(99,102,241,0.1)", dur: 14 },
        { x: "70%", y: "80%", size: 18, rot: 60, color: "rgba(16,185,129,0.1)", dur: 10 },
        { x: "35%", y: "8%", size: 20, rot: 15, color: "rgba(168,85,247,0.08)", dur: 16 },
      ].map((hex, i) => (
        <motion.svg
          key={`hex-${i}`}
          className="absolute"
          style={{ left: hex.x, top: hex.y, width: hex.size, height: hex.size }}
          viewBox="0 0 24 24"
          animate={{
            y: [0, -12, 0, 8, 0],
            rotate: [hex.rot, hex.rot + 90, hex.rot + 180, hex.rot + 270, hex.rot + 360],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{ duration: hex.dur, repeat: Infinity, ease: "easeInOut" }}
        >
          <polygon
            points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5"
            fill="none"
            stroke={hex.color.replace(/[\d.]+\)$/, "1)")}
            strokeWidth="1.5"
          />
        </motion.svg>
      ))}

      {/* Animated cross/plus marks */}
      {[
        { x: "20%", y: "20%", color: "rgba(245,158,11,0.15)", size: 12, dur: 8 },
        { x: "80%", y: "45%", color: "rgba(99,102,241,0.12)", size: 10, dur: 10 },
        { x: "55%", y: "85%", color: "rgba(16,185,129,0.12)", size: 14, dur: 7 },
        { x: "40%", y: "60%", color: "rgba(245,158,11,0.1)", size: 10, dur: 12 },
      ].map((mark, i) => (
        <motion.svg
          key={`cross-${i}`}
          className="absolute"
          style={{ left: mark.x, top: mark.y, width: mark.size, height: mark.size }}
          viewBox="0 0 12 12"
          animate={{
            rotate: [0, 180, 360],
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{ duration: mark.dur, repeat: Infinity, ease: "easeInOut", delay: i * 0.8 }}
        >
          <line x1="6" y1="1" x2="6" y2="11" stroke={mark.color.replace(/[\d.]+\)$/, "1)")} strokeWidth="1.5" strokeLinecap="round" />
          <line x1="1" y1="6" x2="11" y2="6" stroke={mark.color.replace(/[\d.]+\)$/, "1)")} strokeWidth="1.5" strokeLinecap="round" />
        </motion.svg>
      ))}

      {/* Animated diamond shapes */}
      {[
        { x: "62%", y: "10%", size: 16, color: "rgba(245,158,11,0.15)", dur: 9 },
        { x: "12%", y: "40%", size: 12, color: "rgba(99,102,241,0.12)", dur: 11 },
        { x: "92%", y: "60%", size: 14, color: "rgba(168,85,247,0.1)", dur: 13 },
      ].map((d, i) => (
        <motion.div
          key={`diamond-${i}`}
          className="absolute"
          style={{
            left: d.x,
            top: d.y,
            width: d.size,
            height: d.size,
            border: `1.5px solid ${d.color.replace(/[\d.]+\)$/, "1)")}`,
            background: d.color,
            transform: "rotate(45deg)",
            borderRadius: 2,
          }}
          animate={{
            y: [0, -18, 0, 12, 0],
            scale: [1, 1.2, 1, 0.9, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: d.dur, repeat: Infinity, ease: "easeInOut", delay: i * 1.2 }}
        />
      ))}

      {/* Soft flowing gradient waves */}
      <motion.div
        className="absolute left-0 right-0 top-[30%] h-[1px]"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(245,158,11,0.08) 20%, rgba(99,102,241,0.06) 50%, rgba(16,185,129,0.06) 80%, transparent 100%)",
        }}
        animate={{ opacity: [0.3, 0.7, 0.3], scaleX: [0.8, 1.1, 0.8] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-0 right-0 top-[65%] h-[1px]"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(99,102,241,0.06) 25%, rgba(245,158,11,0.08) 55%, rgba(168,85,247,0.05) 85%, transparent 100%)",
        }}
        animate={{ opacity: [0.2, 0.5, 0.2], scaleX: [1.1, 0.85, 1.1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* Glowing accent dots at intersections */}
      {[
        { x: "25%", y: "30%", color: "#F59E0B", dur: 4 },
        { x: "75%", y: "30%", color: "#6366F1", dur: 5 },
        { x: "50%", y: "65%", color: "#10B981", dur: 4.5 },
        { x: "15%", y: "65%", color: "#A855F7", dur: 6 },
        { x: "85%", y: "65%", color: "#F59E0B", dur: 3.5 },
      ].map((dot, i) => (
        <motion.div
          key={`glow-${i}`}
          className="absolute rounded-full"
          style={{
            left: dot.x,
            top: dot.y,
            width: 6,
            height: 6,
            background: dot.color,
            boxShadow: `0 0 12px 3px ${dot.color}30`,
          }}
          animate={{
            scale: [1, 1.8, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{ duration: dot.dur, repeat: Infinity, ease: "easeInOut", delay: i * 0.6 }}
        />
      ))}
    </div>
  );
}

/* ─────────── 3D Tilt Card ─────────── */
function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 30 });

  const handleMove = useCallback((e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }, [x, y]);

  const handleLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
    </motion.div>
  );
}

/* ─────────── Main Component ─────────── */
export default function CoursesOverview() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const { openEnquiry } = useEnquiryModal();

  return (
    <ThemeProvider theme="light">
      <div className="min-h-screen bg-[#FAFAF8] text-navy-900 overflow-x-hidden">

        {/* ═══════════════ HERO SECTION ═══════════════ */}
        <section className="relative pt-28 pb-16 md:pt-32 md:pb-24 lg:pt-36 lg:pb-28 px-6 overflow-hidden min-h-[90vh] flex items-center bg-navy-900">
          {/* Enhanced gradient mesh background for dark theme */}
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-[900px] h-[900px] rounded-full bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-transparent blur-3xl translate-x-1/4 -translate-y-1/4" />
            <div className="absolute bottom-0 left-0 w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-indigo-500/10 via-purple-500/5 to-transparent blur-3xl -translate-x-1/4 translate-y-1/4" />
            <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-emerald-500/5 to-transparent blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-gradient-to-tl from-pink-500/5 to-transparent blur-3xl" />
          </div>

          {/* Subtle grid pattern for dark bg */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: "50px 50px",
            }}
          />

          {/* Noise texture overlay */}
          <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: "url('/images/noise.png')" }} />

          <div className="relative max-w-7xl mx-auto w-full">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left Column - Content */}
              <div className="text-center lg:text-left">
                {/* Top badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="flex justify-center lg:justify-start mb-6"
                >
                  <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm">
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
                    </span>
                    <span className="text-sm font-semibold text-orange-400">New Batch Starting Soon</span>
                  </div>
                </motion.div>

                {/* Main headline */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                >
                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[3.5rem] xl:text-6xl font-bold tracking-tight text-white leading-[1.08]">
                    Transform Your Career in
                    <span className="block mt-2">
                      <RotatingText />
                    </span>
                  </h1>
                </motion.div>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="text-gray-400 text-lg md:text-xl max-w-xl mx-auto lg:mx-0 mt-6 leading-relaxed"
                >
                  5 industry-designed programs. Real projects from day one.
                  <span className="text-white font-semibold"> 100% placement support</span> — because we only succeed when you do.
                </motion.p>

                {/* Trust indicators inline */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-6 text-sm text-gray-400"
                >
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="8" fill="currentColor" opacity="0.15" />
                      <path d="M11 6L7 10.5L5 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>Live mentorship</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="8" fill="currentColor" opacity="0.15" />
                      <path d="M11 6L7 10.5L5 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>400+ hiring partners</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="8" fill="currentColor" opacity="0.15" />
                      <path d="M11 6L7 10.5L5 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>EMI available</span>
                  </div>
                </motion.div>

                {/* CTA button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="flex items-center justify-center lg:justify-start mt-8"
                >
                  <button
                    onClick={openEnquiry}
                    className="group inline-flex items-center gap-2.5 px-8 py-4 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-xl font-semibold text-base hover:from-orange-500 hover:to-orange-400 transition-all duration-300 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5 cursor-pointer"
                  >
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/20">
                      <Play className="w-3 h-3 fill-current ml-0.5" />
                    </span>
                    Free Career Counseling
                  </button>
                </motion.div>

                {/* Compact stats row */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.65 }}
                  className="mt-10 pt-8 border-t border-white/[0.08]"
                >
                  <div className="grid grid-cols-4 gap-4 md:gap-6">
                    {STATS.map((stat, i) => (
                      <div key={i} className="text-center lg:text-left">
                        <div className="text-xl sm:text-2xl md:text-3xl font-bold text-orange-400">
                          <Counter target={stat.number} suffix={stat.suffix} />
                        </div>
                        <div className="text-[10px] sm:text-xs text-gray-500 mt-0.5 font-medium leading-tight">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Right Column - Visual with Girl Image */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="hidden lg:block relative"
              >
                <div className="relative w-full max-w-[580px] mx-auto">
                  {/* Background glow effects */}
                  <div className="absolute -inset-10 bg-gradient-to-br from-orange-500/20 via-transparent to-indigo-500/10 blur-3xl rounded-full" />

                  {/* Main image container */}
                  <div className="relative">
                    {/* Girl image */}
                    <img
                      src="/images/hero-girl.png"
                      alt="Career transformation"
                      className="relative z-10 w-full h-auto object-contain"
                    />

                    {/* Floating course cards around the image - positioned away from face */}
                    {/* Top left - Data Analytics */}
                    <motion.div
                      className="absolute -top-4 -left-4 z-20"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                    >
                      <motion.div
                        className="px-3 py-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl shadow-black/20"
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-lg bg-indigo-500/30 flex items-center justify-center">
                            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-indigo-400" stroke="currentColor" strokeWidth="1.5">
                              <path d="M3 3v18h18" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M7 16l4-8 4 4 5-9" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                          <span className="text-xs font-bold text-white">Data Analytics</span>
                        </div>
                      </motion.div>
                    </motion.div>

                    {/* Top right - Business Analytics */}
                    <motion.div
                      className="absolute -top-2 -right-2 z-20"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.7 }}
                    >
                      <motion.div
                        className="px-3 py-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl shadow-black/20"
                        animate={{ y: [0, 5, 0], x: [0, 3, 0] }}
                        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-lg bg-emerald-500/30 flex items-center justify-center">
                            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-emerald-400" stroke="currentColor" strokeWidth="1.5">
                              <path d="M21 21H3V3" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M7 17V13M11 17V9M15 17V5M19 17V11" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                          <span className="text-xs font-bold text-white">Business Analytics</span>
                        </div>
                      </motion.div>
                    </motion.div>

                    {/* Bottom left - Data Science */}
                    <motion.div
                      className="absolute bottom-[35%] -left-8 z-20"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.8 }}
                    >
                      <motion.div
                        className="px-3 py-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl shadow-black/20"
                        animate={{ y: [0, -5, 0], x: [0, -3, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-lg bg-violet-500/30 flex items-center justify-center">
                            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-violet-400" stroke="currentColor" strokeWidth="1.5">
                              <circle cx="12" cy="12" r="3" />
                              <path d="M12 2a4 4 0 0 1 4 4c0 1.95-1.4 3.57-3.25 3.92M8.24 9.92A4 4 0 0 1 12 2" />
                              <path d="M12 15v7M8 18h8" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                          <span className="text-xs font-bold text-white">Data Science & AI</span>
                        </div>
                      </motion.div>
                    </motion.div>

                    {/* Bottom right - Agentic AI */}
                    <motion.div
                      className="absolute bottom-[20%] -right-6 z-20"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.9 }}
                    >
                      <motion.div
                        className="px-3 py-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl shadow-black/20"
                        animate={{ y: [0, 6, 0] }}
                        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-lg bg-pink-500/30 flex items-center justify-center">
                            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-pink-400" stroke="currentColor" strokeWidth="1.5">
                              <path d="M12 2L2 7l10 5 10-5-10-5z" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                          <span className="text-xs font-bold text-white">Agentic AI</span>
                        </div>
                      </motion.div>
                    </motion.div>

                    {/* Floating accent icons - positioned at edges */}
                    <motion.div
                      className="absolute top-[15%] -right-6 w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500/30 to-emerald-600/20 border border-emerald-400/30 flex items-center justify-center shadow-lg shadow-emerald-500/20 backdrop-blur-sm z-20"
                      animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <TrendingUp className="w-5 h-5 text-emerald-400" />
                    </motion.div>

                    <motion.div
                      className="absolute bottom-[55%] -left-5 w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500/30 to-amber-600/20 border border-amber-400/30 flex items-center justify-center shadow-lg shadow-amber-500/20 backdrop-blur-sm z-20"
                      animate={{ y: [0, 8, 0], rotate: [0, -5, 0] }}
                      transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    >
                      <Award className="w-4 h-4 text-amber-400" />
                    </motion.div>

                    <motion.div
                      className="absolute top-[40%] -right-4 w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500/30 to-blue-600/20 border border-blue-400/30 flex items-center justify-center shadow-md shadow-blue-500/20 backdrop-blur-sm z-20"
                      animate={{ y: [0, -6, 0], x: [0, 4, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
                    >
                      <Sparkles className="w-4 h-4 text-blue-400" />
                    </motion.div>

                    {/* Stats badge - bottom */}
                    <motion.div
                      className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-20"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 1 }}
                    >
                      <motion.div
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500/20 to-amber-500/20 backdrop-blur-md border border-orange-400/30 shadow-xl shadow-orange-500/10"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-orange-500/30 flex items-center justify-center">
                            <Users className="w-4 h-4 text-orange-400" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-white">12,000+</div>
                            <div className="text-[10px] text-gray-400">Careers Transformed</div>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ═══════════════ COURSE CARDS SECTION ═══════════════ */}
        <section id="courses" className="py-20 md:py-28 px-6 relative">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-12">
                <span className="inline-block text-orange-500 text-sm font-semibold tracking-widest uppercase mb-3">Our Programs</span>
                <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                  <span className="text-navy-900">Choose Your </span>
                  <span className="text-orange-500">Path</span>
                </h2>
                <p className="mt-3 text-gray-500 text-base max-w-lg mx-auto">
                  Each program is designed for a specific career goal. Find the one that fits your ambition.
                </p>
              </div>
            </ScrollReveal>

            {/* Course cards grid - 3 columns on large screens */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map((course, i) => (
                <ScrollReveal key={course.id} delay={i * 0.06}>
                  <motion.div
                    className="group relative h-full rounded-xl bg-white border border-gray-200/80 overflow-hidden cursor-pointer hover:border-gray-300 hover:shadow-lg transition-all duration-300"
                    whileHover={{ y: -3 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    onMouseEnter={() => setHoveredCard(i)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    {/* Top accent line */}
                    <div className="h-0.5 w-full" style={{ backgroundColor: course.color }} />

                    <div className="p-4 flex flex-col h-full">
                      {/* Header: Icon + Title + Duration */}
                      <div className="flex items-center gap-2.5 mb-2.5">
                        <div
                          className="w-8 h-8 rounded-md flex items-center justify-center p-1.5 shrink-0"
                          style={{ backgroundColor: `${course.color}15`, color: course.color }}
                        >
                          {course.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-bold text-navy-900 leading-tight truncate">
                            {course.name}
                          </h3>
                        </div>
                      </div>

                      {/* Meta: Level + Duration */}
                      <div className="flex items-center gap-2 mb-2.5">
                        <span
                          className="text-[9px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded"
                          style={{ backgroundColor: `${course.color}12`, color: course.color }}
                        >
                          {course.level.split(" ")[0]}
                        </span>
                        <span className="text-[11px] text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {course.duration}
                        </span>
                      </div>

                      {/* Tagline */}
                      <p className="text-gray-500 text-[13px] leading-relaxed mb-3 line-clamp-2">
                        {course.tagline}
                      </p>

                      {/* Highlights as inline text */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {course.highlights.map((h) => (
                          <span
                            key={h}
                            className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600"
                          >
                            {h}
                          </span>
                        ))}
                      </div>

                      {/* Tools row */}
                      <div className="flex flex-wrap gap-1 mb-3 flex-1">
                        {course.tools.slice(0, 4).map((tool) => (
                          <span
                            key={tool}
                            className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-gray-50 text-gray-400 border border-gray-100"
                          >
                            {tool}
                          </span>
                        ))}
                        {course.tools.length > 4 && (
                          <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-gray-50 text-gray-400 border border-gray-100">
                            +{course.tools.length - 4}
                          </span>
                        )}
                      </div>

                      {/* CTA Button - small, left aligned */}
                      <Link
                        href={course.href}
                        className="group/btn inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-white transition-all duration-200 hover:opacity-90 w-fit"
                        style={{ backgroundColor: course.color }}
                      >
                        Explore
                        <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </motion.div>
                </ScrollReveal>
              ))}

              {/* CTA Card — "Not Sure?" */}
              <ScrollReveal delay={0.3}>
                <motion.div
                  className="group relative h-full rounded-xl bg-navy-900 overflow-hidden border border-navy-700/50 p-4"
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.25 }}
                >
                  {/* Subtle grid */}
                  <div
                    className="absolute inset-0 opacity-5"
                    style={{
                      backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)`,
                      backgroundSize: "16px 16px",
                    }}
                  />

                  <div className="relative flex flex-col h-full">
                    <div className="flex items-center gap-2.5 mb-2.5">
                      <div className="w-8 h-8 rounded-md bg-orange-500/15 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-orange-400" />
                      </div>
                      <h3 className="text-base font-bold text-white">Not Sure Which One?</h3>
                    </div>
                    <p className="text-gray-400 text-[13px] leading-relaxed mb-3 flex-1">
                      Get free career counseling and find the perfect program for you.
                    </p>
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-orange-500 text-white hover:bg-orange-600 transition-colors w-fit"
                    >
                      Get Guidance
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </motion.div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* ═══════════════ HIRING PARTNERS ═══════════════ */}
        <HiringPartners />

        {/* ═══════════════ LEARNING JOURNEY ═══════════════ */}
        <section className="py-20 md:py-28 px-6 bg-[#FAFAF8] relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-purple-50/50 to-transparent blur-3xl -translate-x-1/3 translate-y-1/3 pointer-events-none" />

          <div className="max-w-5xl mx-auto relative">
            <ScrollReveal>
              <div className="text-center mb-16">
                <span className="inline-block text-orange-500 text-sm font-semibold tracking-widest uppercase mb-4">How It Works</span>
                <h2 className="text-3xl md:text-5xl font-bold text-navy-900 leading-tight">Your Learning Journey</h2>
              </div>
            </ScrollReveal>

            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-orange-300 via-orange-400 to-orange-200 md:-translate-x-px" />

              {[
                {
                  step: "01",
                  title: "Choose Your Program",
                  desc: "Pick the course that aligns with your career goals. Our counselors can help you decide.",
                  iconPath: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
                },
                {
                  step: "02",
                  title: "Learn from Practitioners",
                  desc: "Live sessions with industry mentors from Google, Amazon, PwC, and more. Not pre-recorded lectures.",
                  iconPath: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
                },
                {
                  step: "03",
                  title: "Build Real Projects",
                  desc: "Work on industry-grade projects modeled after companies like Tesla, Netflix, and Amazon.",
                  iconPath: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
                },
                {
                  step: "04",
                  title: "Get Placed",
                  desc: "100% placement.",
                  iconPath: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
                },
              ].map((item, i) => (
                <ScrollReveal key={item.step} delay={i * 0.1}>
                  <div className={`relative flex items-center gap-6 md:gap-0 mb-12 last:mb-0 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                    {/* Content */}
                    <div className={`flex-1 pl-16 md:pl-0 ${i % 2 === 0 ? "md:pr-16 md:text-right" : "md:pl-16 md:text-left"}`}>
                      <div className={`inline-flex items-center gap-2 mb-2 ${i % 2 === 0 ? "md:flex-row-reverse" : ""}`}>
                        <span className="text-xs font-bold text-orange-500 tracking-widest uppercase">Step {item.step}</span>
                      </div>
                      <h3 className="text-xl font-bold text-navy-900 mb-2">{item.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed max-w-sm">{item.desc}</p>
                    </div>

                    {/* Center dot */}
                    <div className="absolute left-6 md:left-1/2 w-12 h-12 -translate-x-1/2 rounded-full bg-white border-2 border-orange-400 flex items-center justify-center shadow-md shadow-orange-100 z-10">
                      <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d={item.iconPath} />
                      </svg>
                    </div>

                    {/* Spacer for the other side */}
                    <div className="hidden md:block flex-1" />
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ BOTTOM CTA ═══════════════ */}
        <section className="py-14 md:py-20 px-6 relative overflow-hidden bg-navy-900">
          {/* Background elements */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-orange-500/10 to-transparent blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)`,
                backgroundSize: "28px 28px",
              }}
            />
          </div>

          <div className="relative max-w-2xl mx-auto text-center">
            <ScrollReveal>
              <motion.div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-5"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                <span className="text-xs font-medium text-gray-300">Limited seats per batch</span>
              </motion.div>
            </ScrollReveal>

            <ScrollReveal>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight">
                Your Career Transformation <span className="text-orange-400">Starts Here</span>
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <p className="text-gray-400 text-sm md:text-base mb-6 max-w-lg mx-auto leading-relaxed">
                Join 12,000+ professionals who transformed their careers. Talk to a counselor and find the right path for you.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <button
                onClick={openEnquiry}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-xl font-semibold text-sm hover:from-orange-500 hover:to-orange-400 transition-all duration-300 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 cursor-pointer"
              >
                Start Your Journey
                <ArrowRight className="w-4 h-4" />
              </button>
            </ScrollReveal>

            {/* Trust indicators */}
            <ScrollReveal delay={0.3}>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-emerald-400" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="8" fill="currentColor" opacity="0.15" />
                    <path d="M11 6L7 10.5L5 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  100% Placement
                </div>
                <div className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-emerald-400" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="8" fill="currentColor" opacity="0.15" />
                    <path d="M11 6L7 10.5L5 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  EMI Available
                </div>
                <div className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-emerald-400" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="8" fill="currentColor" opacity="0.15" />
                    <path d="M11 6L7 10.5L5 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Industry Certified
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

      </div>
    </ThemeProvider>
  );
}
