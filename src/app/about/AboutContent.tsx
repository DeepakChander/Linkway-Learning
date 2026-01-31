"use client";

import { useRef, useCallback, useState, useEffect } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { SpringReveal, LineMaskReveal } from "@/components/animation";
import ScrollOdometer from "@/components/animation/ScrollOdometer";
import Marquee from "@/components/animation/Marquee";

gsap.registerPlugin(ScrollTrigger);

/* ─── DATA ─── */
const values = [
  {
    title: "Careers First, Always",
    desc: "We don't count certificates — we count people who actually got hired and stayed hired.",
    image: "/images/sections/value-careers.png",
    icon: "🎯",
  },
  {
    title: "Learn by Shipping",
    desc: "You won't just watch lectures. You'll build real things, break them, fix them, and ship them.",
    image: "/images/sections/value-shipping.png",
    icon: "🚀",
  },
  {
    title: "Mentors, Not Teachers",
    desc: "Everyone who teaches here works in the industry. They know what hiring managers actually care about.",
    image: "/images/sections/value-mentors.png",
    icon: "🧭",
  },
  {
    title: "No Hidden Agendas",
    desc: "Our pricing is upfront, our placement numbers are real, and our student stories are verifiable.",
    image: "/images/sections/value-agendas.png",
    icon: "🔍",
  },
];

const instructors = [
  {
    name: "Akshat Khandelwal",
    experience: "5+ years",
    title: "Senior Finance BI Developer at Autodesk",
    bio: "Akshat has spent 5+ years turning messy financial data into dashboards that executives actually use. He's worked at Allen Digital and now leads BI at Autodesk.",
    tags: ["Power BI", "Python", "SQL", "Finance BI"],
    image: "/images/instructors/akshat-khandelwal.jpeg",
  },
  {
    name: "Prabhat Sinha",
    experience: "9+ years",
    title: "Data Scientist at Cognizant",
    bio: "Nine years at Cognizant taught Prabhat how to take chaotic datasets and turn them into something a business can actually act on.",
    tags: ["Python", "EDA", "Advanced Analytics"],
    image: "/images/instructors/prabhat-sinha.jpeg",
  },
  {
    name: "Heena Arora",
    experience: "3+ years",
    title: "Associate Data Scientist at PwC (ex-Amazon)",
    bio: "Heena went from handling international ops at Amazon to building image analytics pipelines at PwC. She knows what it takes to switch lanes.",
    tags: ["Data Science", "Image Analytics", "Python"],
    image: "/images/instructors/heena-arora.jpeg",
  },
  {
    name: "Anand Tripathi",
    experience: "1+ year",
    title: "Data Analyst at Google",
    bio: "Anand works at Google, where he analyzes data that shapes real product decisions. He brings that same structured thinking to Linkway.",
    tags: ["Data Analytics", "Big Data", "Google"],
    image: "/images/instructors/anand-tripathi.jpeg",
  },
];

const stats = [
  { target: 8200, suffix: "+", label: "Careers Launched" },
  { target: 400, suffix: "+", label: "Hiring Partners" },
  { target: 85, suffix: "%", label: "Avg Salary Jump" },
  { target: 100, suffix: "%", label: "Placement Rate" },
];

const milestones = [
  { year: "2019", title: "The Spark", desc: "Started with 12 students in a small room, one laptop, and a whiteboard." },
  { year: "2020", title: "Going Online", desc: "Pandemic hit — we went fully online and reached students across India." },
  { year: "2021", title: "500+ Placed", desc: "Crossed 500 successful placements with top companies hiring our grads." },
  { year: "2022", title: "Industry Mentors", desc: "Brought on mentors from Google, PwC, Cognizant, and Autodesk." },
  { year: "2023", title: "8,200+ Careers", desc: "Became one of India's most trusted data career platforms." },
  { year: "2024", title: "AI & Beyond", desc: "Launched AI/ML tracks and expanded to full-stack data engineering." },
];

/* ─── MAGNETIC 3D TILT CARD ─── */
function MagneticCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 20 });

  const handleMouse = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
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
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── MOUSE-FOLLOWING GLOW CARD ─── */
function GlowCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--glow-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--glow-y", `${e.clientY - rect.top}px`);
  }, []);

  return (
    <div ref={ref} onMouseMove={handleMouseMove} className={`about-glow-card ${className}`}>
      {children}
    </div>
  );
}

/* ─── FLOATING PARTICLES ─── */
function FloatingParticles() {
  const [particles] = useState(() =>
    Array.from({ length: 25 }, (_, i) => ({
      id: i,
      left: `${(i * 37 + 13) % 100}%`,
      top: `${(i * 53 + 7) % 100}%`,
      delay: `${(i * 0.4) % 8}s`,
      duration: `${6 + (i % 5) * 2}s`,
      size: i % 3 === 0 ? "w-1.5 h-1.5" : "w-1 h-1",
    }))
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className={`absolute ${p.size} rounded-full bg-orange-500/20 about-particle-float`}
          style={{
            left: p.left,
            top: p.top,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}
    </div>
  );
}

/* ─── SCROLL TO TOP ─── */
function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-orange-500 text-white shadow-[0_0_30px_rgba(245,130,32,0.4)] hover:shadow-[0_0_50px_rgba(245,130,32,0.6)] hover:scale-110 transition-all duration-300 flex items-center justify-center"
          aria-label="Scroll to top"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 16V4M4 10l6-6 6 6" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN ABOUT PAGE COMPONENT
   ═══════════════════════════════════════════════════ */
export default function AboutPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);

  return (
    <div className="min-h-screen bg-navy-900 text-white overflow-x-hidden">

      {/* ═══════════════════════════════════════════════
          HERO — Immersive full-screen cinematic
          ═══════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0">
          <div className="hero-aurora-1" />
          <div className="hero-aurora-2" />
          <div className="hero-aurora-3" />
          <div className="absolute inset-0 about-dark-grid opacity-[0.04]" />
        </div>

        <FloatingParticles />

        <motion.div style={{ y: heroY, opacity: heroOpacity, scale: heroScale }} className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          {/* Overline badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-orange-500/20 bg-orange-500/5 text-orange-400 text-sm font-medium tracking-wider uppercase mb-8">
              <span className="w-2 h-2 rounded-full bg-orange-500 about-pulse-dot" />
              About Linkway Learning
            </span>
          </motion.div>

          {/* Main heading with gradient */}
          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight"
          >
            <span className="text-white">We Build </span>
            <br className="hidden md:block" />
            <span className="hero-gradient-text">Data Careers.</span>
            <br />
            <span className="text-white/30 text-4xl md:text-5xl lg:text-6xl font-light mt-2 inline-block">Not Just Courses.</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-8 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
          >
            Bridging the gap between ambition and industry — with skills, projects, mentorship, and placement support that actually work.
          </motion.p>

          {/* Stats pills */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="mt-10 flex flex-wrap justify-center gap-3"
          >
            {[
              { label: "8,200+ Careers Launched", icon: "⚡" },
              { label: "100% Placement Rate*", icon: "✦" },
              { label: "400+ Hiring Partners", icon: "🤝" },
            ].map((pill, i) => (
              <div key={i} className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm text-sm text-gray-300 hover:bg-white/[0.08] hover:border-orange-500/30 transition-all duration-300 cursor-default">
                <span>{pill.icon}</span>
                <span>{pill.label}</span>
              </div>
            ))}
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute -bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <span className="text-xs text-gray-600 tracking-widest uppercase">Scroll to explore</span>
            <div className="w-5 h-8 rounded-full border border-gray-700 flex items-start justify-center p-1">
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-orange-500"
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════
          PHOTO STRIP — Cinematic image marquee
          ═══════════════════════════════════════════════ */}
      <section className="py-4 relative z-10">
        <Marquee speed={50} pauseOnHover direction="left" gap={3}>
          {[
            { src: "/images/about/about-hero-1.png", label: "Data Collaboration" },
            { src: "/images/sections/classroom-workshop.png", label: "Live Workshops" },
            { src: "/images/about/about-hero-3.png", label: "1:1 Mentoring" },
            { src: "/images/sections/campus-office.png", label: "Our Campus" },
            { src: "/images/about/about-hero-4.png", label: "Data Workspace" },
            { src: "/images/sections/team-working.png", label: "Team Work" },
            { src: "/images/about/about-hero-2.png", label: "Student Presentations" },
          ].map((img, i) => (
            <div key={i} className="relative w-[320px] h-[190px] rounded-xl overflow-hidden shrink-0 group">
              <Image src={img.src} alt={img.label} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-navy-900/20 to-transparent" />
              <div className="absolute bottom-3 left-3">
                <span className="text-xs font-medium text-white/70 tracking-wider uppercase">{img.label}</span>
              </div>
            </div>
          ))}
        </Marquee>
      </section>

      {/* ═══════════════════════════════════════════════
          OUR STORY — Split layout with large typography
          ═══════════════════════════════════════════════ */}
      <section className="py-32 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-500/[0.02] to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left — Text */}
          <div className="relative">
            <SpringReveal distance={60} damping={14}>
              <span className="text-orange-500 text-sm font-semibold tracking-[0.2em] uppercase mb-4 block">Our Story</span>
            </SpringReveal>
            <SpringReveal distance={80} damping={12} delay={0.1}>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white mb-8">
                How This <span className="hero-gradient-text">Started</span>
              </h2>
            </SpringReveal>
            <LineMaskReveal delay={0.2} staggerDelay={0.15}>
              <p className="text-gray-400 text-lg md:text-xl leading-relaxed">
                We kept seeing the same thing: smart people finishing college, picking up a degree, and then sitting at home wondering why nobody would hire them for a data role. It wasn&apos;t a knowledge problem — it was a <span className="text-orange-400 font-medium">gap between what colleges teach</span> and what companies need.
              </p>
              <p className="text-gray-400 text-lg md:text-xl leading-relaxed mt-6">
                So we built Linkway to close that gap. Live classes from industry professionals, projects that mirror real business problems, and a placement team that doesn&apos;t stop until you&apos;re hired. <span className="text-orange-400 font-medium">Over 8,200 people</span> have made the switch through us so far.
              </p>
            </LineMaskReveal>
          </div>

          {/* Right — Stacked images with 3D tilt */}
          <div className="relative h-[500px] lg:h-[600px]">
            <SpringReveal delay={0.2} distance={80} damping={12}>
              <MagneticCard className="absolute top-0 right-0 w-[70%] h-[55%] rounded-2xl overflow-hidden shadow-2xl shadow-black/40 border border-white/[0.06] z-10">
                <Image src="/images/about/about-hero-1.png" alt="Students collaborating" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/40 to-transparent" />
              </MagneticCard>
            </SpringReveal>
            <SpringReveal delay={0.4} distance={100} damping={10}>
              <MagneticCard className="absolute top-[20%] left-0 w-[50%] h-[45%] rounded-2xl overflow-hidden shadow-2xl shadow-black/40 border border-white/[0.06] z-20">
                <Image src="/images/about/about-hero-3.png" alt="Mentoring session" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/40 to-transparent" />
              </MagneticCard>
            </SpringReveal>
            <SpringReveal delay={0.5} distance={100} damping={10}>
              <MagneticCard className="absolute bottom-0 right-[5%] w-[55%] h-[40%] rounded-2xl overflow-hidden shadow-2xl shadow-black/40 border border-white/[0.06] z-30">
                <Image src="/images/about/about-hero-4.png" alt="Data workspace" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/40 to-transparent" />
              </MagneticCard>
            </SpringReveal>
            {/* Decorative glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-orange-500/[0.06] blur-[80px] pointer-events-none" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          MISSION & VISION — Large cinematic cards
          ═══════════════════════════════════════════════ */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-24 bg-gradient-to-b from-transparent via-orange-500/40 to-transparent" />

        <div className="max-w-6xl mx-auto">
          <SpringReveal distance={60} damping={14}>
            <div className="text-center mb-16">
              <span className="text-orange-500 text-sm font-semibold tracking-[0.2em] uppercase mb-4 block">Purpose</span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
                Mission & <span className="hero-gradient-text">Vision</span>
              </h2>
            </div>
          </SpringReveal>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Mission */}
            <SpringReveal delay={0.1} distance={80} damping={12}>
              <GlowCard className="h-full">
                <div className="relative h-full rounded-2xl p-8 md:p-10 bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm overflow-hidden group hover:border-orange-500/20 transition-all duration-500">
                  {/* Corner accents */}
                  <div className="absolute top-0 left-0 w-20 h-20">
                    <div className="absolute top-4 left-4 w-8 h-[1px] bg-orange-500/40" />
                    <div className="absolute top-4 left-4 w-[1px] h-8 bg-orange-500/40" />
                  </div>

                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-6 group-hover:bg-orange-500/20 transition-colors duration-300">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-orange-500">
                        <path d="M12 2L2 7l10 5 10-5-10-5z" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M2 17l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <h3 className="text-orange-400 text-sm font-semibold tracking-[0.15em] uppercase mb-4">Our Mission</h3>
                    <p className="text-gray-300 text-xl md:text-2xl leading-relaxed font-light">
                      Give people <span className="text-white font-medium">real skills</span> that actually get them hired — regardless of where they went to college or what they studied before.
                    </p>
                  </div>

                  <span className="absolute bottom-4 right-6 text-[8rem] font-bold text-white/[0.02] leading-none select-none pointer-events-none">01</span>
                </div>
              </GlowCard>
            </SpringReveal>

            {/* Vision */}
            <SpringReveal delay={0.2} distance={80} damping={12}>
              <GlowCard className="h-full">
                <div className="relative h-full rounded-2xl p-8 md:p-10 bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm overflow-hidden group hover:border-orange-500/20 transition-all duration-500">
                  <div className="absolute top-0 right-0 w-20 h-20">
                    <div className="absolute top-4 right-4 w-8 h-[1px] bg-orange-500/40" />
                    <div className="absolute top-4 right-4 w-[1px] h-8 bg-orange-500/40" />
                  </div>

                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-6 group-hover:bg-orange-500/20 transition-colors duration-300">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-orange-500">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10 15 15 0 0 1 4-10z" />
                        <path d="M2 12h20" />
                      </svg>
                    </div>
                    <h3 className="text-orange-400 text-sm font-semibold tracking-[0.15em] uppercase mb-4">Our Vision</h3>
                    <p className="text-gray-300 text-xl md:text-2xl leading-relaxed font-light">
                      If you&apos;re curious enough and willing to put in the work, your background <span className="text-white font-medium">shouldn&apos;t decide your future</span>. We want to make that true for data and AI careers.
                    </p>
                  </div>

                  <span className="absolute bottom-4 right-6 text-[8rem] font-bold text-white/[0.02] leading-none select-none pointer-events-none">02</span>
                </div>
              </GlowCard>
            </SpringReveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          STATS — Glassmorphism floating bar
          ═══════════════════════════════════════════════ */}
      <section className="py-16 px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <SpringReveal distance={60} damping={14}>
            <div className="relative rounded-3xl p-[1px] about-stats-border-glow">
              <div className="rounded-3xl bg-navy-900/80 backdrop-blur-xl border border-white/[0.05] overflow-hidden">
                <div className="grid grid-cols-2 md:grid-cols-4">
                  {stats.map((stat, i) => (
                    <div
                      key={i}
                      className={`relative text-center py-10 px-6 group ${i < stats.length - 1 ? "border-r border-white/[0.05]" : ""}`}
                    >
                      <div className="absolute inset-0 bg-orange-500/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="relative z-10">
                        <div className="w-8 h-[2px] bg-gradient-to-r from-orange-500 to-orange-400 rounded-full mx-auto mb-5" />
                        <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                          <ScrollOdometer value={stat.target} suffix={stat.suffix} animateSuffix duration={2} delay={0.2 + i * 0.15} />
                        </div>
                        <p className="text-gray-500 text-sm tracking-wider uppercase">{stat.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SpringReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          VALUES — Bento Grid Layout
          ═══════════════════════════════════════════════ */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 about-dark-grid opacity-[0.03]" />
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-orange-500/[0.04] blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-blue-500/[0.03] blur-[100px] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative">
          <SpringReveal distance={60} damping={14}>
            <div className="text-center mb-16">
              <span className="text-orange-500 text-sm font-semibold tracking-[0.2em] uppercase mb-4 block">What We Stand For</span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
                Our <span className="hero-gradient-text">Values</span>
              </h2>
            </div>
          </SpringReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {values.map((v, i) => (
              <SpringReveal key={i} delay={0.1 * i} distance={60} damping={14}>
                <GlowCard className="h-full">
                  <div className="relative rounded-2xl overflow-hidden border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm group hover:border-orange-500/20 transition-all duration-500">
                    {/* Image section */}
                    <div className="relative h-48 overflow-hidden">
                      <Image src={v.image} alt={v.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/60 to-transparent" />
                      <span className="absolute top-4 left-5 text-6xl font-bold text-white/[0.08] leading-none select-none pointer-events-none">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="absolute top-4 right-4 w-10 h-10 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center text-lg">
                        {v.icon}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors duration-300">{v.title}</h3>
                      <p className="text-gray-400 leading-relaxed">{v.desc}</p>
                    </div>
                  </div>
                </GlowCard>
              </SpringReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          TIMELINE — Journey milestones
          ═══════════════════════════════════════════════ */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-500/[0.015] to-transparent pointer-events-none" />

        <div className="max-w-5xl mx-auto">
          <SpringReveal distance={60} damping={14}>
            <div className="text-center mb-20">
              <span className="text-orange-500 text-sm font-semibold tracking-[0.2em] uppercase mb-4 block">Our Journey</span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
                The <span className="hero-gradient-text">Timeline</span>
              </h2>
            </div>
          </SpringReveal>

          <div className="relative">
            {/* Central vertical line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-orange-500/30 to-transparent md:-translate-x-[0.5px]" />

            {milestones.map((m, i) => (
              <SpringReveal key={i} delay={0.1 * i} distance={60} direction={i % 2 === 0 ? "left" : "right"} damping={14}>
                <div className={`relative flex items-center mb-12 last:mb-0 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                  <div className={`ml-16 md:ml-0 md:w-[45%] ${i % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12 md:text-left"}`}>
                    <GlowCard>
                      <div className="rounded-xl p-6 bg-white/[0.03] border border-white/[0.06] hover:border-orange-500/20 transition-all duration-500">
                        <span className="text-orange-500 text-sm font-bold tracking-wider">{m.year}</span>
                        <h3 className="text-xl font-bold text-white mt-1 mb-2">{m.title}</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">{m.desc}</p>
                      </div>
                    </GlowCard>
                  </div>

                  {/* Timeline dot */}
                  <div className="absolute left-6 md:left-1/2 w-3 h-3 -translate-x-1/2 rounded-full bg-orange-500 shadow-[0_0_12px_rgba(245,130,32,0.5)] z-10" />

                  <div className="hidden md:block md:w-[45%]" />
                </div>
              </SpringReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          INSTRUCTORS — Premium cards with 3D tilt
          ═══════════════════════════════════════════════ */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 about-dark-grid opacity-[0.03]" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-orange-500/[0.04] blur-[100px] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative">
          <SpringReveal distance={60} damping={14}>
            <div className="text-center mb-6">
              <span className="text-orange-500 text-sm font-semibold tracking-[0.2em] uppercase mb-4 block">Mentors</span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                The People Who <span className="hero-gradient-text">Teach Here</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                They work at Google, PwC, Cognizant, and Autodesk during the day — and teach at Linkway because they genuinely care about helping people break in.
              </p>
            </div>
          </SpringReveal>

          <div className="mt-16 grid md:grid-cols-2 gap-6">
            {instructors.map((inst, i) => (
              <SpringReveal key={i} delay={0.1 + i * 0.1} distance={80} damping={12}>
                <MagneticCard className="h-full">
                  <GlowCard className="h-full">
                    <div className="relative h-full rounded-2xl p-6 md:p-8 bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm group hover:border-orange-500/20 transition-all duration-500 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      <div className="relative z-10 flex items-start gap-5">
                        <div className="shrink-0">
                          <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-white/[0.1] shadow-lg group-hover:border-orange-500/30 transition-all duration-300">
                            <Image src={inst.image} alt={inst.name} width={80} height={80} className="w-full h-full object-cover" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors duration-300">{inst.name}</h3>
                          <p className="text-orange-400/80 text-sm mt-0.5">{inst.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            <span className="text-gray-500 text-xs">{inst.experience} experience</span>
                          </div>
                        </div>
                      </div>

                      <p className="relative z-10 text-gray-400 text-sm leading-relaxed mt-5 mb-5">{inst.bio}</p>

                      <div className="relative z-10 flex flex-wrap gap-2">
                        {inst.tags.map((tag) => (
                          <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium bg-orange-500/10 text-orange-400 border border-orange-500/15">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </GlowCard>
                </MagneticCard>
              </SpringReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          CTA — Full width closing section
          ═══════════════════════════════════════════════ */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-orange-500/[0.06] via-transparent to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-orange-500/[0.08] blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <SpringReveal distance={80} damping={12}>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-tight">
              Ready to Build Your
              <br />
              <span className="hero-gradient-text">Data Career?</span>
            </h2>
          </SpringReveal>
          <SpringReveal distance={40} damping={14} delay={0.2}>
            <p className="mt-6 text-lg md:text-xl text-gray-400 max-w-xl mx-auto">
              Join 8,200+ professionals who transformed their careers through Linkway Learning.
            </p>
          </SpringReveal>
          <SpringReveal distance={30} damping={14} delay={0.4}>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <a
                href="/courses"
                className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-full bg-orange-500 text-white font-semibold text-lg overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(245,130,32,0.4)]"
              >
                <span className="relative z-10">Explore Courses</span>
                <svg className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </a>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-white/[0.15] text-white font-semibold text-lg hover:bg-white/[0.05] hover:border-orange-500/30 transition-all duration-300"
              >
                Talk to Us
              </a>
            </div>
          </SpringReveal>
        </div>
      </section>

      <ScrollToTop />
    </div>
  );
}
