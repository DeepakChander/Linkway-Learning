"use client";

import { useRef, useCallback, useState, useEffect } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";
import {
  SpringReveal,
  LineMaskReveal,
  CrossFlicker,
} from "@/components/animation";

import ScrollOdometer from "@/components/animation/ScrollOdometer";
import Marquee from "@/components/animation/Marquee";
import Badge from "@/components/ui/Badge";

gsap.registerPlugin(ScrollTrigger);

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   DATA
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const values = [
  {
    title: "Careers First, Always",
    desc: "We don't count certificates \u2014 we count people who actually got hired and stayed hired.",
    image: "/images/sections/value-careers.png",
    color: "orange",
  },
  {
    title: "Learn by Shipping",
    desc: "You won't just watch lectures. You'll build real things, break them, fix them, and ship them.",
    image: "/images/sections/value-shipping.png",
    color: "blue",
  },
  {
    title: "Mentors, Not Teachers",
    desc: "Everyone who teaches here works in the industry. They know what hiring managers actually care about.",
    image: "/images/sections/value-mentors.png",
    color: "emerald",
  },
  {
    title: "No Hidden Agendas",
    desc: "Our pricing is upfront, our placement numbers are real, and our student stories are verifiable.",
    image: "/images/sections/value-agendas.png",
    color: "purple",
  },
];

const instructors = [
  {
    name: "Akshat Khandelwal",
    experience: "5+ years",
    title: "Senior Finance BI Developer at Autodesk",
    bio: "Akshat has spent 5+ years turning messy financial data into dashboards that executives actually use. He's worked at Allen Digital and now leads BI at Autodesk \u2014 and he teaches the way he works: practical, no fluff, straight to the point.",
    tags: ["Power BI", "Python", "SQL", "Finance BI"],
    image: "/images/instructors/akshat-khandelwal.jpeg",
  },
  {
    name: "Prabhat Sinha",
    experience: "9+ years",
    title: "Data Scientist at Cognizant",
    bio: "Nine years at Cognizant taught Prabhat how to take chaotic datasets and turn them into something a business can actually act on. He specializes in Python and EDA, and he's particularly good at making complex analytics feel approachable.",
    tags: ["Python", "EDA", "Advanced Analytics"],
    image: "/images/instructors/prabhat-sinha.jpeg",
  },
  {
    name: "Heena Arora",
    experience: "3+ years",
    title: "Associate Data Scientist at PwC (ex-Amazon)",
    bio: "Heena went from handling international ops at Amazon to building image analytics pipelines at PwC. She knows what it takes to switch lanes in your career \u2014 because she did it herself.",
    tags: ["Data Science", "Image Analytics", "Python"],
    image: "/images/instructors/heena-arora.jpeg",
  },
  {
    name: "Anand Tripathi",
    experience: "1+ year",
    title: "Data Analyst at Google",
    bio: "Anand works at Google, where he analyzes data that shapes real product decisions. He brings that same structured thinking to Linkway \u2014 helping students learn how to ask the right questions before jumping into the data.",
    tags: ["Data Analytics", "Big Data", "Google"],
    image: "/images/instructors/anand-tripathi.jpeg",
  },
];

const stats = [
  { target: 8200, suffix: "+", label: "Careers Launched", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg> },
  { target: 400, suffix: "+", label: "Hiring Partners", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg> },
  { target: 85, suffix: "%", label: "Avg Salary Jump", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg> },
  { target: 100, suffix: "%", label: "Placement Rate", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg> },
];

const milestones = [
  { year: "2019", title: "The Spark", desc: "Started with 12 students in a small room, one laptop, and a whiteboard." },
  { year: "2020", title: "Going Online", desc: "Pandemic hit \u2014 we went fully online and reached students across India." },
  { year: "2021", title: "500+ Placed", desc: "Crossed 500 successful placements with top companies hiring our grads." },
  { year: "2022", title: "Industry Mentors", desc: "Brought on mentors from Google, PwC, Cognizant, and Autodesk." },
  { year: "2023", title: "8,200+ Careers", desc: "Became one of India\u2019s most trusted data career platforms." },
  { year: "2026", title: "AI & Beyond", desc: "Launched AI/ML tracks and expanded to full-stack data engineering." },
];

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   MICRO COMPONENTS
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/* 3D tilt card */
function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rx = useSpring(useTransform(y, [-0.5, 0.5], [5, -5]), { stiffness: 300, damping: 30 });
  const ry = useSpring(useTransform(x, [-0.5, 0.5], [-5, 5]), { stiffness: 300, damping: 30 });

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  }, [x, y]);

  const onLeave = useCallback(() => { x.set(0); y.set(0); }, [x, y]);

  return (
    <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }} className={className}>
      {children}
    </motion.div>
  );
}

/* Scroll to top */
function ScrollToTop() {
  const [v, setV] = useState(false);
  useEffect(() => {
    const fn = () => setV(window.scrollY > 500);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <AnimatePresence>
      {v && (
        <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-24 right-6 z-40 w-12 h-12 rounded-full bg-orange-500 text-white shadow-lg hover:bg-orange-600 transition-colors duration-300 flex items-center justify-center lg:bottom-8 lg:right-8"
          aria-label="Scroll to top">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 16V4M4 10l6-6 6 6" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   MAIN ABOUT PAGE
   Background pattern: Navy Hero -> Warm Beige -> White -> Orange Accent -> Beige -> Navy -> White -> Orange CTA
   Matches the existing site's warm, premium aesthetic
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export default function AboutPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  /* GSAP scroll progress */
  const progressRef = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    if (!progressRef.current) return;
    gsap.to(progressRef.current, {
      scaleX: 1, ease: "none",
      scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 0.3 },
    });
  });

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f2f1ee]">
      {/* Scroll progress */}
      <div ref={progressRef} className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-orange-500 via-orange-400 to-orange-600 z-[60] origin-left" style={{ transform: "scaleX(0)" }} />

      {/* ══════════════════════════════════════════════════════════
          SECTION 1 — HERO (Dark Navy, matches site hero pattern)
          ══════════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden bg-navy-900">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="hero-aurora-1" />
          <div className="hero-aurora-2" />
          <div className="hero-aurora-3" />
          <div className="hero-aurora-4" />
        </div>
        <div className="absolute inset-0 hero-grid-overlay opacity-[0.02]" />

        {/* Floating animated geometric shapes */}
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute top-[12%] right-[8%] w-20 h-20 border border-orange-500/15 rounded-xl pointer-events-none" />
        <motion.div animate={{ rotate: -360 }} transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[18%] left-[5%] w-14 h-14 border border-blue-400/10 rounded-lg pointer-events-none" />
        <motion.div animate={{ y: [-20, 20, -20], x: [-10, 10, -10] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[30%] right-[15%] w-3 h-3 rounded-full bg-orange-500/20 pointer-events-none" />
        <motion.div animate={{ y: [15, -15, 15], x: [8, -8, 8] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[35%] left-[12%] w-2 h-2 rounded-full bg-blue-400/15 pointer-events-none" />
        <motion.div animate={{ y: [-12, 18, -12] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[55%] right-[35%] w-1.5 h-1.5 rounded-full bg-orange-400/25 pointer-events-none" />

        {/* Animated grid lines */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div initial={{ x: "-100%" }} animate={{ x: "200%" }} transition={{ duration: 8, repeat: Infinity, ease: "linear", repeatDelay: 4 }}
            className="absolute top-[25%] w-[300px] h-[1px] bg-gradient-to-r from-transparent via-orange-500/20 to-transparent" />
          <motion.div initial={{ x: "200%" }} animate={{ x: "-100%" }} transition={{ duration: 10, repeat: Infinity, ease: "linear", repeatDelay: 3 }}
            className="absolute top-[70%] w-[400px] h-[1px] bg-gradient-to-r from-transparent via-blue-400/10 to-transparent" />
          <motion.div initial={{ y: "-100%" }} animate={{ y: "200%" }} transition={{ duration: 12, repeat: Infinity, ease: "linear", repeatDelay: 5 }}
            className="absolute left-[20%] w-[1px] h-[300px] bg-gradient-to-b from-transparent via-orange-500/10 to-transparent" />
          <motion.div initial={{ y: "200%" }} animate={{ y: "-100%" }} transition={{ duration: 9, repeat: Infinity, ease: "linear", repeatDelay: 6 }}
            className="absolute right-[30%] w-[1px] h-[250px] bg-gradient-to-b from-transparent via-blue-400/8 to-transparent" />
        </div>

        {/* Corner decorative plus signs */}
        <motion.div animate={{ opacity: [0.1, 0.3, 0.1] }} transition={{ duration: 3, repeat: Infinity }}
          className="absolute top-12 left-12 text-orange-500/30 text-2xl font-light pointer-events-none select-none">+</motion.div>
        <motion.div animate={{ opacity: [0.15, 0.35, 0.15] }} transition={{ duration: 4, repeat: Infinity }}
          className="absolute bottom-12 right-12 text-orange-500/30 text-2xl font-light pointer-events-none select-none">+</motion.div>
        <motion.div animate={{ opacity: [0.08, 0.25, 0.08] }} transition={{ duration: 3.5, repeat: Infinity }}
          className="absolute top-[40%] left-6 text-blue-400/20 text-lg font-light pointer-events-none select-none">+</motion.div>

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 w-full max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center py-32">
          {/* Left: Text */}
          <div>
            {/* About Linkway Learning — compact badge */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full border border-orange-500/20 bg-orange-500/[0.06]">
                <motion.svg
                  width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F58220" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  animate={{ rotate: [0, 8, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </motion.svg>
                <span className="text-orange-400 text-xs font-semibold tracking-[0.15em] uppercase">
                  About Linkway Learning
                </span>
              </div>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.05] tracking-tight text-white">
              We Build
              <br />
              <span className="hero-gradient-text">Data Careers</span>
              <span className="text-orange-500">.</span>
              <br />
              <span className="text-gray-300 text-3xl md:text-4xl lg:text-[2.8rem] font-light italic">Not Just Courses.</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.7 }}
              className="mt-6 text-base md:text-lg text-gray-300 max-w-lg leading-relaxed">
              Bridging the gap between ambition and industry &mdash; with skills, projects, mentorship, and placement support that actually work.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.95 }}
              className="mt-8 flex flex-wrap gap-6 text-sm font-medium">
              <span className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-orange-500/15 bg-orange-500/[0.05] text-white">
                <motion.svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F58220" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  animate={{ y: [0, -2, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </motion.svg>
                <span className="font-bold text-orange-400">8,200+</span> Careers Launched
              </span>
              <span className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-orange-500/15 bg-orange-500/[0.05] text-white">
                <motion.svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F58220" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                </motion.svg>
                <span className="font-bold text-orange-400">100%</span> Placement Rate*
              </span>
            </motion.div>
          </div>

          {/* Right: Overlapping image collage */}
          <div className="relative h-[420px] md:h-[500px] lg:h-[540px]">
            <motion.div initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.4 }}>
              <TiltCard className="absolute top-0 right-0 w-[72%] h-[62%] rounded-2xl overflow-hidden shadow-2xl shadow-black/30 border border-white/[0.06] z-10">
                <Image src="/images/about/about-hero-1.png" alt="Students collaborating with data dashboards" fill className="object-cover object-top" />
              </TiltCard>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: -40, y: 30 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }}>
              <TiltCard className="absolute top-[18%] left-0 w-[45%] h-[48%] rounded-2xl overflow-hidden shadow-2xl shadow-black/30 border-2 border-white/10 z-20">
                <Image src="/images/about/about-hero-3.png" alt="One-on-one mentoring session" fill className="object-cover object-top" />
              </TiltCard>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.8 }}>
              <TiltCard className="absolute bottom-0 right-[5%] w-[54%] h-[42%] rounded-2xl overflow-hidden shadow-2xl shadow-black/30 border-2 border-white/10 z-30">
                <Image src="/images/about/about-hero-4.png" alt="Birds-eye view of data workspace" fill className="object-cover object-center" />
              </TiltCard>
            </motion.div>
            {/* Glow */}
            <div className="absolute inset-0 bg-orange-500/[0.04] rounded-3xl blur-3xl -z-10 pointer-events-none" />
          </div>
        </motion.div>

      </section>

      {/* ══════════════════════════════════════════════════════════
          IMAGE MARQUEE STRIP
          ══════════════════════════════════════════════════════════ */}
      <section className="bg-navy-900 py-4">
        <Marquee speed={45} pauseOnHover direction="left" gap={3} fadeEdges>
          {[
            { src: "/images/about/about-hero-1.png", label: "Data Collaboration" },
            { src: "/images/sections/classroom-workshop.png", label: "Live Workshops" },
            { src: "/images/about/about-hero-3.png", label: "1:1 Mentoring" },
            { src: "/images/sections/campus-office.png", label: "Our Campus" },
            { src: "/images/about/about-hero-4.png", label: "Data Workspace" },
            { src: "/images/sections/team-working.png", label: "Team Collaboration" },
            { src: "/images/about/about-hero-2.png", label: "Presentations" },
          ].map((img, i) => (
            <div key={i} className="relative w-[280px] h-[170px] rounded-xl overflow-hidden shrink-0 group">
              <Image src={img.src} alt={img.label} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <span className="absolute bottom-3 left-3 text-[10px] font-semibold text-white/70 tracking-wider uppercase">{img.label}</span>
            </div>
          ))}
        </Marquee>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 2 — OUR STORY (Warm Beige #f2f1ee, matches WhyLinkway)
          ══════════════════════════════════════════════════════════ */}
      <section className="relative py-28 md:py-36 px-6 overflow-hidden" style={{ background: "#f2f1ee" }}>
        {/* Decorative blobs */}
        <div className="absolute -top-32 right-[10%] w-[400px] h-[400px] rounded-full bg-orange-200/20 blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-32 left-[5%] w-[350px] h-[350px] rounded-full bg-orange-100/30 blur-[80px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          {/* Left: Image */}
          <SpringReveal delay={0.1} distance={80} damping={12}>
            <TiltCard>
              <div className="relative rounded-3xl overflow-hidden shadow-xl shadow-gray-300/50 border border-gray-200/60 aspect-[4/3]">
                <Image src="/images/sections/team-working.png" alt="Linkway Learning team" fill className="object-cover object-top" />
                <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-transparent" />
              </div>
            </TiltCard>
          </SpringReveal>

          {/* Right: Text */}
          <div>
            <SpringReveal distance={40} damping={14}>
              <span className="inline-block text-orange-500 text-xs font-bold tracking-[0.2em] uppercase mb-4 border border-orange-200 bg-orange-50 px-3 py-1.5 rounded-full">Our Story</span>
            </SpringReveal>
            <SpringReveal distance={50} damping={12} delay={0.1}>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-navy-900 mb-6">
                How This{" "}
                <span className="relative inline-block">
                  Started
                  <svg className="absolute -bottom-1.5 left-0 w-full" height="6" viewBox="0 0 200 6" fill="none"><path d="M1 4C30 1.5 60 0.5 100 2.5C140 4.5 170 3.5 199 1.5" stroke="#F58220" strokeWidth="2.5" strokeLinecap="round" /></svg>
                </span>
              </h2>
            </SpringReveal>

            <div className="space-y-4">
              <SpringReveal distance={30} damping={14} delay={0.2}>
                <p className="text-navy-800/60 text-base md:text-lg leading-relaxed">
                  We kept seeing the same thing: smart people finishing college, picking up a degree, and then sitting at home wondering why nobody would hire them for a data role. It was not a knowledge problem it was a gap between what colleges teach and what companies need.
                </p>
              </SpringReveal>
              <SpringReveal distance={30} damping={14} delay={0.35}>
                <p className="text-navy-800/60 text-base md:text-lg leading-relaxed">
                  So we built Linkway to close that gap. Live classes from industry professionals, projects that mirror real business problems, and a placement team that does not stop until you are hired. Over 8200 people have made the switch through us so far.
                </p>
              </SpringReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 3 — MISSION & VISION (White with orange accents)
          ══════════════════════════════════════════════════════════ */}
      <section className="relative py-28 md:py-36 px-6 overflow-hidden bg-white">
        <CrossFlicker position="top-left" color="orange" size="sm" />
        <CrossFlicker position="top-right" color="orange" size="sm" delay={0.4} />

        <div className="max-w-6xl mx-auto relative z-10">
          <SpringReveal distance={40} damping={14}>
            <div className="text-center mb-14">
              <span className="inline-block text-orange-500 text-xs font-bold tracking-[0.2em] uppercase mb-4 border border-orange-200 bg-orange-50 px-3 py-1.5 rounded-full">Purpose</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy-900">Mission &amp; Vision</h2>
            </div>
          </SpringReveal>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Mission */}
            <SpringReveal delay={0.1} distance={60} damping={12}>
              <TiltCard className="h-full">
                <div className="relative h-full rounded-2xl p-7 md:p-9 bg-gradient-to-br from-orange-50 to-white border border-orange-100 shadow-xl shadow-orange-100/50 overflow-hidden group hover:shadow-2xl hover:shadow-orange-200/50 hover:-translate-y-1 transition-all duration-500">
                  {/* Corner accents */}
                  <div className="absolute top-4 left-4 w-6 h-6"><div className="absolute top-0 left-0 w-full h-[2px] bg-orange-400" /><div className="absolute top-0 left-0 h-full w-[2px] bg-orange-400" /></div>
                  <div className="absolute bottom-4 right-4 w-6 h-6"><div className="absolute bottom-0 right-0 w-full h-[2px] bg-orange-200" /><div className="absolute bottom-0 right-0 h-full w-[2px] bg-orange-200" /></div>

                  <span className="absolute top-3 right-5 text-[7rem] font-black text-orange-500/[0.04] leading-none select-none pointer-events-none">01</span>

                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center mb-5 shadow-lg shadow-orange-500/25 group-hover:scale-110 transition-transform duration-300">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z" strokeLinecap="round" strokeLinejoin="round" /><path d="M2 17l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" /><path d="M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </div>
                    <h3 className="text-orange-500 text-xs font-bold tracking-[0.2em] uppercase mb-3">Our Mission</h3>
                    <p className="text-navy-800 text-lg md:text-xl leading-relaxed">
                      Give people <span className="font-bold text-navy-900">real skills</span> that actually get them hired &mdash; regardless of where they went to college or what they studied before.
                    </p>
                  </div>
                </div>
              </TiltCard>
            </SpringReveal>

            {/* Vision */}
            <SpringReveal delay={0.2} distance={60} damping={12}>
              <TiltCard className="h-full">
                <div className="relative h-full rounded-2xl p-7 md:p-9 bg-gradient-to-br from-navy-100/60 to-white border border-navy-200/40 shadow-xl shadow-navy-100/50 overflow-hidden group hover:shadow-2xl hover:shadow-navy-200/50 hover:-translate-y-1 transition-all duration-500">
                  <div className="absolute top-4 right-4 w-6 h-6"><div className="absolute top-0 right-0 w-full h-[2px] bg-navy-400" /><div className="absolute top-0 right-0 h-full w-[2px] bg-navy-400" /></div>
                  <div className="absolute bottom-4 left-4 w-6 h-6"><div className="absolute bottom-0 left-0 w-full h-[2px] bg-navy-200" /><div className="absolute bottom-0 left-0 h-full w-[2px] bg-navy-200" /></div>

                  <span className="absolute top-3 right-5 text-[7rem] font-black text-navy-600/[0.04] leading-none select-none pointer-events-none">02</span>

                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-navy-800 flex items-center justify-center mb-5 shadow-lg shadow-navy-800/25 group-hover:scale-110 transition-transform duration-300">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10 15 15 0 0 1 4-10z" /><path d="M2 12h20" /></svg>
                    </div>
                    <h3 className="text-navy-600 text-xs font-bold tracking-[0.2em] uppercase mb-3">Our Vision</h3>
                    <p className="text-navy-800 text-lg md:text-xl leading-relaxed">
                      If you are curious enough and willing to put in the work, your background <span className="font-bold text-navy-900">should not decide your future</span>. We want to make that true for data and AI careers.
                    </p>
                  </div>
                </div>
              </TiltCard>
            </SpringReveal>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 4 — STATS (Split: left label, right numbers)
          ══════════════════════════════════════════════════════════ */}
      <section className="relative py-12 md:py-16 px-6 overflow-hidden bg-navy-900">
        <div className="absolute inset-0 hero-grid-overlay opacity-[0.015]" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid md:grid-cols-[1fr_2fr] gap-8 md:gap-16 items-center">
            {/* Left: label */}
            <SpringReveal distance={30} damping={14}>
              <div>
                <span className="inline-flex items-center gap-2 text-orange-400 text-xs font-bold tracking-[0.2em] uppercase">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
                  Our Impact
                </span>
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mt-3 leading-snug">
                  Numbers that<br />
                  <span className="relative inline-block text-orange-400">
                    speak for us.
                    <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 200 8" fill="none" preserveAspectRatio="none"><path d="M2 5C30 2 70 2 100 4C130 6 170 5 198 3" stroke="#F58220" strokeWidth="2.5" strokeLinecap="round" /></svg>
                  </span>
                </h3>
              </div>
            </SpringReveal>

            {/* Right: stat cards */}
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {stats.map((stat, i) => (
                <SpringReveal key={i} delay={0.08 * i} distance={30} damping={14}>
                  <div className="group relative rounded-xl p-5 md:p-6 border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-orange-500/20 transition-all duration-500 overflow-hidden">
                    {/* Hover glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative z-10">
                      <div className="text-orange-500/60 mb-3 group-hover:text-orange-400 transition-colors duration-400">
                        {stat.icon}
                      </div>
                      <div className="text-3xl md:text-4xl font-bold text-white leading-none group-hover:text-orange-400 transition-colors duration-400">
                        <ScrollOdometer value={stat.target} suffix={stat.suffix} duration={2} delay={0.3 + i * 0.15} />
                      </div>
                      <p className="text-gray-500 text-[10px] md:text-xs tracking-[0.12em] uppercase font-medium mt-2">{stat.label}</p>
                    </div>

                    {/* Bottom accent line */}
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-orange-500 to-orange-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  </div>
                </SpringReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 5 — VALUES (Warm Beige #f4f2ed, matches CoursePreview)
          ══════════════════════════════════════════════════════════ */}
      <section className="relative py-28 md:py-36 px-6 overflow-hidden" style={{ background: "#f4f2ed" }}>
        <div className="absolute -top-20 right-[10%] w-[300px] h-[300px] rounded-full bg-orange-100/40 blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-20 left-[15%] w-[250px] h-[250px] rounded-full bg-orange-100/30 blur-[60px] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <SpringReveal distance={40} damping={14}>
            <div className="text-center mb-14">
              <span className="inline-block text-orange-500 text-xs font-bold tracking-[0.2em] uppercase mb-4 border border-orange-200 bg-orange-50 px-3 py-1.5 rounded-full">What We Stand For</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy-900">
                Our{" "}
                <span className="relative inline-block">
                  Values
                  <svg className="absolute -bottom-1.5 left-0 w-full" height="6" viewBox="0 0 200 6" fill="none"><path d="M1 4C30 1.5 60 0.5 100 2.5C140 4.5 170 3.5 199 1.5" stroke="#F58220" strokeWidth="2.5" strokeLinecap="round" /></svg>
                </span>
              </h2>
            </div>
          </SpringReveal>

          <div className="space-y-14 md:space-y-20">
            {values.map((v, i) => (
              <SpringReveal key={i} delay={0.05 * i} distance={60} damping={14}>
                <div className={`flex flex-col md:flex-row items-center gap-8 md:gap-12 ${i % 2 !== 0 ? "md:flex-row-reverse" : ""}`}>
                  {/* Image */}
                  <div className="w-full md:w-1/2">
                    <TiltCard>
                      <div className="relative w-full h-[260px] md:h-[300px] rounded-2xl overflow-hidden shadow-xl shadow-gray-300/40 border border-gray-200/60 group">
                        <Image src={v.image} alt={v.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                        <span className="absolute top-4 left-5 text-6xl font-black text-white/25 leading-none select-none drop-shadow-lg">{String(i + 1).padStart(2, "0")}</span>
                      </div>
                    </TiltCard>
                  </div>

                  {/* Card */}
                  <div className="w-full md:w-1/2">
                    <div className="relative">
                      <CrossFlicker position={i % 2 === 0 ? "top-left" : "top-right"} color="orange" size="sm" delay={i * 0.15} />
                      <div className="rounded-2xl p-6 md:p-8 bg-white border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-orange-100/50 hover:-translate-y-1 transition-all duration-500">
                        <h3 className="text-xl font-bold text-navy-900 mb-2">{v.title}</h3>
                        <p className="text-gray-500 text-base leading-relaxed">{v.desc}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </SpringReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 6 — TIMELINE (Dark Navy, vertical cascade)
          ══════════════════════════════════════════════════════════ */}
      <section className="relative bg-navy-900 overflow-hidden py-16 md:py-20">
        {/* Animated background */}
        <div className="absolute inset-0 hero-grid-overlay opacity-[0.02]" />
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[10%] left-[5%] w-[400px] h-[400px] rounded-full bg-orange-500/[0.03] blur-[100px] about-float-blob" />
          <div className="absolute bottom-[20%] right-[10%] w-[300px] h-[300px] rounded-full bg-blue-500/[0.025] blur-[80px] about-float-blob" style={{ animationDelay: "3s" }} />
          <div className="absolute top-[15%] right-[8%] w-16 h-16 border border-orange-500/10 rounded-lg about-float-rotate opacity-40" />
          <div className="absolute bottom-[25%] left-[6%] w-10 h-10 border border-white/[0.06] rounded about-float-rotate-reverse opacity-30" />
          <div className="absolute top-[60%] right-[25%] w-3 h-3 bg-orange-500/15 rounded-full about-float-particle" />
          <div className="absolute top-[30%] left-[40%] w-2 h-2 bg-white/[0.06] rounded-full about-float-particle" style={{ animationDelay: "2s" }} />
        </div>

        <div className="max-w-5xl mx-auto px-6 relative z-10">
          {/* Section heading */}
          <div className="text-center mb-10">
            <SpringReveal distance={40} damping={14}>
              <span className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 about-pulse-dot" />
                <span className="text-gray-300 text-xs font-semibold tracking-[0.2em] uppercase">Our Journey</span>
              </span>
            </SpringReveal>
            <SpringReveal distance={50} damping={12} delay={0.1}>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
                The <span className="hero-gradient-text">Timeline</span>
              </h2>
            </SpringReveal>
            <SpringReveal distance={30} damping={14} delay={0.2}>
              <p className="text-gray-500 text-sm md:text-base max-w-md mx-auto">
                From a small room with 12 students to 500+ careers transformed.
              </p>
            </SpringReveal>
          </div>

          {/* Vertical timeline with center line */}
          <div className="about-timeline-vertical relative">
            {/* Center connecting line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[2px] md:-translate-x-[1px] bg-gradient-to-b from-orange-500/40 via-white/[0.08] to-orange-500/40" />

            {milestones.map((m, i) => {
              const isLeft = i % 2 === 0;
              return (
                <div key={i} className={`relative flex items-start gap-6 md:gap-0 mb-8 last:mb-0 ${isLeft ? "md:flex-row" : "md:flex-row-reverse"}`}>
                  {/* Content card */}
                  <div className={`flex-1 pl-14 md:pl-0 ${isLeft ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                    <SpringReveal distance={isLeft ? -60 : 60} direction={isLeft ? "right" : "left"} delay={i * 0.08}>
                      <div className="group relative rounded-xl p-4 md:p-5 bg-white/[0.03] border border-white/[0.07] hover:border-orange-500/20 hover:bg-white/[0.06] transition-all duration-500 overflow-hidden backdrop-blur-sm hover:-translate-y-1">
                        {/* Accent line top */}
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-orange-500 to-transparent origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out" />

                        {/* Year badge */}
                        <span className="inline-flex items-center gap-1.5 text-orange-400 text-xs font-bold tracking-[0.15em] uppercase mb-1.5">
                          <span className="w-1 h-1 rounded-full bg-orange-500/60" />
                          {m.year}
                        </span>

                        <h3 className="text-lg md:text-xl font-bold text-white mb-1 group-hover:text-orange-100 transition-colors duration-300">
                          {m.title}
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed">{m.desc}</p>

                        {/* Watermark year */}
                        <span className="absolute -bottom-2 -right-2 text-[3.5rem] font-black text-white/[0.015] leading-none select-none pointer-events-none group-hover:text-white/[0.04] transition-colors duration-700">
                          {m.year}
                        </span>

                        {/* Hover glow */}
                        <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-orange-500/[0.03] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                      </div>
                    </SpringReveal>
                  </div>

                  {/* Center dot — always visible */}
                  <div className="absolute left-6 md:left-1/2 top-2 -translate-x-1/2 z-10">
                    <div className="about-timeline-dot group/dot relative">
                      <div className="w-4 h-4 rounded-full bg-navy-900 border-2 border-orange-500/50 group-hover/dot:border-orange-500 transition-colors duration-300" />
                      <div className="absolute inset-0 rounded-full bg-orange-500/20 animate-ping" style={{ animationDuration: "3s", animationDelay: `${i * 0.5}s` }} />
                    </div>
                  </div>

                  {/* Empty spacer for opposite side */}
                  <div className="hidden md:block flex-1" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 7 — INSTRUCTORS (White, matches site card pattern)
          ══════════════════════════════════════════════════════════ */}
      <section className="relative py-28 md:py-36 px-6 overflow-hidden bg-white">
        <div className="absolute -top-20 left-[15%] w-[300px] h-[300px] rounded-full bg-orange-100/30 blur-[80px] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <SpringReveal distance={40} damping={14}>
            <div className="text-center mb-5">
              <span className="inline-block text-orange-500 text-xs font-bold tracking-[0.2em] uppercase mb-4 border border-orange-200 bg-orange-50 px-3 py-1.5 rounded-full">Mentors</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy-900 mb-3">
                The People Who{" "}
                <span className="relative inline-block">
                  Teach Here
                  <svg className="absolute -bottom-1.5 left-0 w-full" height="6" viewBox="0 0 200 6" fill="none"><path d="M1 4C30 1.5 60 0.5 100 2.5C140 4.5 170 3.5 199 1.5" stroke="#F58220" strokeWidth="2.5" strokeLinecap="round" /></svg>
                </span>
              </h2>
              <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto mt-3">
                They work at Google, PwC, Cognizant, and Autodesk during the day &mdash; and teach at Linkway because they genuinely care.
              </p>
            </div>
          </SpringReveal>

          <div className="mt-12 grid md:grid-cols-2 gap-6">
            {instructors.map((inst, i) => (
              <SpringReveal key={i} delay={0.08 + i * 0.08} distance={50} damping={14}>
                <TiltCard className="h-full">
                  <div className="relative h-full rounded-2xl p-6 bg-white border border-gray-100 shadow-xl shadow-gray-200/50 group hover:shadow-2xl hover:shadow-orange-100/50 hover:-translate-y-1 transition-all duration-500 overflow-hidden">
                    {/* Hover gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-50/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative z-10 flex items-start gap-4">
                      <div className="shrink-0">
                        <div className="relative w-[68px] h-[68px] rounded-xl overflow-hidden border-2 border-gray-100 shadow-md group-hover:border-orange-300 transition-all duration-300">
                          <Image src={inst.image} alt={inst.name} width={68} height={68} className="w-full h-full object-cover" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-navy-900 group-hover:text-orange-500 transition-colors duration-300">{inst.name}</h3>
                        <p className="text-orange-500 text-xs mt-0.5 font-medium">{inst.title}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span className="text-gray-400 text-[11px]">{inst.experience} experience</span>
                        </div>
                      </div>
                    </div>

                    <p className="relative z-10 text-gray-500 text-sm leading-relaxed mt-4 mb-4">{inst.bio}</p>

                    <div className="relative z-10 flex flex-wrap gap-1.5">
                      {inst.tags.map((tag) => (
                        <span key={tag} className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-orange-50 text-orange-600 border border-orange-100">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Bottom accent */}
                    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-orange-500 to-orange-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  </div>
                </TiltCard>
              </SpringReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 8 — CTA (Navy compact with glass card)
          ══════════════════════════════════════════════════════════ */}
      <section className="relative py-16 md:py-20 px-6 overflow-hidden bg-navy-900">
        {/* Subtle animated gradient orbs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-orange-500/10 via-transparent to-blue-500/10 blur-[120px] pointer-events-none animate-pulse" />
        <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-orange-500/5 blur-[80px] pointer-events-none" />
        <div className="absolute inset-0 hero-grid-overlay opacity-[0.02]" />

        <div className="max-w-4xl mx-auto relative z-10">
          <SpringReveal distance={40} damping={14}>
            <div className="relative rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-8 md:p-12 overflow-hidden">
              {/* Inner glow */}
              <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-orange-500/10 blur-[60px] pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-blue-500/10 blur-[60px] pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                {/* Left: Text */}
                <div className="max-w-md">
                  <span className="inline-block text-orange-400 text-[10px] font-bold tracking-[0.25em] uppercase mb-3">Start Your Journey</span>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">
                    Ready to Build Your Data Career?
                  </h2>
                  <p className="mt-3 text-sm md:text-base text-gray-400 leading-relaxed">
                    Join 8,200+ professionals who transformed their careers through Linkway Learning.
                  </p>
                </div>

                {/* Right: Buttons */}
                <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
                  <a href="/courses" className="group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-400 text-white font-bold text-sm hover:shadow-[0_0_30px_rgba(245,130,32,0.3)] hover:scale-[1.03] transition-all duration-300">
                    <span>Explore Courses</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </a>
                  <a href="/contact" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-white/70 font-semibold text-sm hover:bg-white/[0.05] hover:text-white hover:border-white/20 transition-all duration-300">
                    Talk to Us
                  </a>
                </div>
              </div>

              {/* Top-right corner accent */}
              <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden pointer-events-none">
                <div className="absolute top-3 right-3 w-[1px] h-8 bg-gradient-to-b from-orange-500/40 to-transparent" />
                <div className="absolute top-3 right-3 h-[1px] w-8 bg-gradient-to-l from-orange-500/40 to-transparent" />
              </div>
              {/* Bottom-left corner accent */}
              <div className="absolute bottom-0 left-0 w-20 h-20 overflow-hidden pointer-events-none">
                <div className="absolute bottom-3 left-3 w-[1px] h-8 bg-gradient-to-t from-orange-500/40 to-transparent" />
                <div className="absolute bottom-3 left-3 h-[1px] w-8 bg-gradient-to-r from-orange-500/40 to-transparent" />
              </div>
            </div>
          </SpringReveal>
        </div>
      </section>

      <ScrollToTop />
    </div>
  );
}
