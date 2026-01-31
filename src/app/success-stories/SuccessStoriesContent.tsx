"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useInView,
} from "framer-motion";
import Counter from "@/components/animation/Counter";
import {
  SpringReveal,
  KineticText,
  ScrollTextReveal,
  CharacterSplit,
  LineMaskReveal,
  ScrollReveal,
  BorderGlow,
} from "@/components/animation";
import { ThemeProvider } from "@/lib/theme";

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════════════ */
const testimonials = [
  { name: "Aditya Srivastava", from: "Full-Stack Developer", to: "Junior Data Scientist", company: "Globussoft", desc: "I could build apps, but I didn't know ML. Linkway filled that gap with real projects — computer vision, forecasting, the works. Now I'm doing data science full-time.", initials: "AS", color: "#F59E0B" },
  { name: "Arpit Jain", from: "Hospitality Professional", to: "Business Analyst", company: "EaseMyTrip", desc: "Hospitality was all I knew. I picked up SQL and analytics from scratch, and now I'm analyzing booking trends at EaseMyTrip. Completely different life.", initials: "AJ", color: "#3B82F6" },
  { name: "Junaid Khan", from: "Operations & Banking", to: "Business Analyst", company: "Razorpay", desc: "Banking ops had no growth path for me. Six months of focused learning later, I'm a business analyst at Razorpay doing work that actually excites me.", initials: "JK", color: "#10B981" },
  { name: "Rajeev Chauhan", from: "Operations Executive", to: "Business Research Analyst", company: "EXL", desc: "I was stuck in operations. The program taught me how to think analytically and back decisions with data. Now I do exactly that at EXL.", initials: "RC", color: "#8B5CF6" },
  { name: "Rehan Siddiqui", from: "Non-Tech Background", to: "Data Analyst", company: "Amazon", desc: "Zero tech background. Linkway taught me Tableau, Power BI, and how to actually think with data. Now I'm at Amazon solving real business problems.", initials: "RS", color: "#F58220" },
  { name: "Shivani Rawat", from: "Operations & Product", to: "Business Analyst", company: "Booking.com", desc: "Operations felt like a dead end. The program gave me the technical edge I needed, and now I'm doing requirement analysis at Booking.com.", initials: "SR", color: "#EC4899" },
  { name: "Shalendra Gupta", from: "Sales Executive", to: "Business Analyst", company: "Vishal Mega Mart", desc: "Went from selling on the floor to analyzing what sells. Excel and Power BI changed how I see business — and my career.", initials: "SG", color: "#06B6D4" },
  { name: "Syed Nehal", from: "HR & Accounting", to: "Data Analyst", company: "Safegraph", desc: "HR and accounting weren't going anywhere for me. Project-based learning made the switch possible. Now I'm a data analyst working globally.", initials: "SN", color: "#6366F1" },
  { name: "Vansh Pathak", from: "Accounting Intern", to: "Reporting Analyst", company: "Accenture", desc: "From crunching numbers in spreadsheets to building real SQL reports at Accenture. The jump felt huge, but the mentors made it doable.", initials: "VP", color: "#14B8A6" },
];

const stats = [
  { target: 500, suffix: "+", label: "Careers Launched" },
  { target: 400, suffix: "+", label: "Hiring Partners" },
  { target: 85, suffix: "%", label: "Avg Salary Jump" },
  { target: 100, suffix: "%", label: "Placement Rate" },
];

/* Company logos mapping */
const companyLogos: Record<string, string> = {
  Google: "/images/companies/google.svg",
  Amazon: "/images/companies/amazon.svg",
  Microsoft: "/images/companies/microsoft.svg",
  Deloitte: "/images/companies/deloitte.svg",
  TCS: "/images/companies/tcs.svg",
  "Tech Mahindra": "/images/companies/tech-mahindra.svg",
  "Saint-Gobain": "/images/companies/saint-gobain.svg",
  "BNY Mellon": "/images/companies/bny-mellon.svg",
  Turing: "/images/companies/turing.svg",
  "IDFC First Bank": "/images/companies/idfc-first-bank.svg",
  AXA: "/images/companies/axa.svg",
  "Juniper Networks": "/images/companies/juniper.svg",
  iOPEX: "/images/companies/iopex.svg",
  Fractal: "/images/companies/fractal.svg",
  "Sony Pictures": "/images/companies/sony.svg",
  "AT&T": "/images/companies/att.svg",
  SpringWorks: "/images/companies/springworks.svg",
  "Uptime AI": "/images/companies/uptime-ai.svg",
  MUFG: "/images/companies/mufg.svg",
  MiQ: "/images/companies/miq.svg",
  HUL: "/images/companies/hul.svg",
  Genpact: "/images/companies/genpact.svg",
  Sprinklr: "/images/companies/sprinklr.svg",
  "Bandhan Bank": "/images/companies/bandhan-bank.svg",
  GlobalLogic: "/images/companies/globallogic.svg",
  Wipro: "/images/companies/wipro.svg",
  Accenture: "/images/companies/accenture.svg",
  Infosys: "/images/companies/infosys.svg",
  IBM: "/images/companies/ibm.svg",
  Capgemini: "/images/companies/capgemini.svg",
};

/* Logos that need inversion on white bg */
const darkLogos = new Set(["Amazon", "Microsoft", "IBM", "Wipro"]);

const partnerRow1 = [
  "Google", "Amazon", "Accenture", "Deloitte", "TCS",
  "Tech Mahindra", "Saint-Gobain", "BNY Mellon", "Infosys", "Microsoft",
];

const partnerRow2 = [
  "Turing", "IDFC First Bank", "AXA", "Juniper Networks",
  "iOPEX", "Fractal", "Sony Pictures", "AT&T", "SpringWorks", "Capgemini",
];

const partnerRow3 = [
  "Uptime AI", "MUFG", "MiQ", "HUL",
  "Genpact", "Sprinklr", "Bandhan Bank", "GlobalLogic", "Wipro", "IBM",
];

/* ═══════════════════════════════════════════════════════════════════
   MICRO-COMPONENTS
   ═══════════════════════════════════════════════════════════════════ */

/* 3D Magnetic Tilt Card — mouse-following perspective rotation */
function MagneticCard({
  children,
  className = "",
  index = 0,
}: {
  children: React.ReactNode;
  className?: string;
  index?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 300, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { stiffness: 300, damping: 20 });

  const onMove = useCallback(
    (e: React.MouseEvent) => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      x.set((e.clientX - rect.left) / rect.width - 0.5);
      y.set((e.clientY - rect.top) / rect.height - 0.5);
    },
    [x, y]
  );

  const onLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX, rotateY, transformPerspective: 1200 }}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.8,
        delay: index * 0.07,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* Story Card — white editorial card with accent stripe, company logo, hover depth */
function StoryCard({ t, i }: { t: (typeof testimonials)[0]; i: number }) {
  const logo = companyLogos[t.company];

  return (
    <MagneticCard index={i} className="h-full">
      <div className="ss-story-card group relative h-full rounded-[20px] overflow-hidden bg-white">
        {/* Left accent stripe */}
        <div
          className="absolute top-0 left-0 w-[3px] h-full origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ background: `linear-gradient(180deg, ${t.color}, ${t.color}40)` }}
        />

        {/* Hover background gradient — very subtle */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{ background: `linear-gradient(135deg, ${t.color}04, transparent 60%)` }}
        />

        <div className="relative h-full p-6 md:p-7 flex flex-col">
          {/* Top: company logo (large) + number */}
          <div className="flex items-center justify-between mb-6">
            <div className="w-11 h-11 rounded-xl border border-gray-100 bg-gray-50/80 flex items-center justify-center shrink-0 group-hover:border-gray-200 transition-colors duration-500">
              {logo ? (
                <img src={logo} alt={t.company} width={24} height={24} className={`w-6 h-6 object-contain ${darkLogos.has(t.company) ? "brightness-0 opacity-40" : "opacity-60"} group-hover:opacity-90 transition-opacity duration-500`} />
              ) : (
                <span className="text-[10px] font-bold text-navy-900/25 uppercase tracking-wider">{t.company.slice(0, 3)}</span>
              )}
            </div>
            <span className="text-[11px] font-bold text-navy-900/[0.06] tracking-wider select-none">
              {String(i + 1).padStart(2, "0")}
            </span>
          </div>

          {/* Name + company */}
          <div className="mb-4">
            <h3 className="text-[17px] font-bold text-navy-900 leading-snug mb-1">{t.name}</h3>
            <span className="text-[12px] text-gray-400 font-medium">{t.company}</span>
          </div>

          {/* Journey pills with arrow */}
          <div className="flex items-center gap-2 mb-5 flex-wrap">
            <span className="text-[11px] font-medium text-gray-400 bg-gray-50 border border-gray-100 rounded-md px-2.5 py-1 whitespace-nowrap">{t.from}</span>
            <svg width="20" height="8" viewBox="0 0 20 8" fill="none" className="shrink-0 opacity-40">
              <path d="M0 4H18" stroke={t.color} strokeWidth="1" strokeDasharray="2 2" />
              <path d="M14 1L18 4L14 7" stroke={t.color} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span
              className="text-[11px] font-semibold rounded-md px-2.5 py-1 whitespace-nowrap"
              style={{ background: `${t.color}10`, color: t.color, border: `1px solid ${t.color}20` }}
            >
              {t.to}
            </span>
          </div>

          {/* Quote */}
          <p className="text-gray-400 leading-[1.75] text-[13px] flex-1 group-hover:text-gray-500 transition-colors duration-500">
            &ldquo;{t.desc}&rdquo;
          </p>

          {/* Bottom: avatar + read more hint */}
          <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-[10px] shrink-0"
                style={{ background: t.color }}
              >
                {t.initials}
              </div>
              <span className="text-[11px] text-gray-300 font-medium">Career switch</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gray-200 group-hover:text-orange-400 transition-colors duration-500 group-hover:translate-x-1 transition-transform">
              <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </MagneticCard>
  );
}

/* Stat Item — for dark section */
function StatItem({ stat, i }: { stat: (typeof stats)[0]; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="ss-stat-item group text-center px-4"
    >
      {/* Orbital ring decoration */}
      <div className="relative inline-block mb-3">
        <div className="ss-stat-ring" />
        <div className="text-5xl md:text-6xl lg:text-7xl font-black text-white tabular-nums relative z-10">
          <Counter target={stat.target} suffix={stat.suffix} />
        </div>
      </div>
      <p className="text-gray-400 text-sm md:text-base font-medium tracking-wide">
        {stat.label}
      </p>
    </motion.div>
  );
}

/* Company Logo Card — premium white card with real SVG logo */
function CompanyLogoCard({ name }: { name: string }) {
  const logo = companyLogos[name];
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2);

  return (
    <div className="ss-logo-card group">
      <div className="ss-logo-icon">
        {logo ? (
          <img
            src={logo}
            alt={name}
            width={28}
            height={28}
            className={`w-7 h-7 object-contain ${darkLogos.has(name) ? "brightness-0" : ""}`}
          />
        ) : (
          <span className="text-xs font-bold text-navy-900/40">{initials}</span>
        )}
      </div>
      <span className="text-sm font-medium text-navy-900/70 group-hover:text-navy-900 transition-colors duration-300 truncate">
        {name}
      </span>
    </div>
  );
}

/* GSAP Infinite Logo Row — smooth auto-scroll with duplicated items */
function InfiniteLogoRow({
  items,
  direction = "left",
  speed = 55,
  className = "",
}: {
  items: string[];
  direction?: "left" | "right";
  speed?: number;
  className?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useGSAP(() => {
    const track = trackRef.current;
    if (!track) return;

    requestAnimationFrame(() => {
      const oneSetWidth = track.scrollWidth / 2;
      tweenRef.current = gsap.fromTo(
        track,
        { x: direction === "left" ? 0 : -oneSetWidth },
        {
          x: direction === "left" ? -oneSetWidth : 0,
          duration: speed,
          ease: "none",
          repeat: -1,
        }
      );
    });

    return () => { tweenRef.current?.kill(); };
  }, { scope: trackRef });

  return (
    <div className={`overflow-hidden ${className}`}>
      <div ref={trackRef} className="flex gap-4 w-max" style={{ willChange: "transform" }}>
        {[...items, ...items].map((name, i) => (
          <CompanyLogoCard key={`${name}-${i}`} name={name} />
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════════════════════════ */
export default function SuccessStoriesPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);

  // featured = Rehan Siddiqui (Amazon, most dramatic: non-tech → Amazon)
  const featured = testimonials[4];
  const remaining = testimonials.filter((_, i) => i !== 4);

  return (
    <ThemeProvider theme="light">
      <div className="ss-page-v3">

        {/* ╔══════════════════════════════════════════════════════════════╗
            ║  SECTION 1 — HERO  (Navy dark, full viewport)              ║
            ╚══════════════════════════════════════════════════════════════╝ */}
        <section
          ref={heroRef}
          className="relative min-h-screen flex items-center justify-center overflow-hidden bg-navy-900"
        >
          {/* Background image + overlay */}
          <div className="absolute inset-0">
            <Image
              src="/images/sections/success-stories-hero.png"
              alt=""
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-navy-900/80" />
          </div>

          {/* Aurora ambient blobs */}
          <div className="absolute inset-0 pointer-events-none z-[1]">
            <div className="hero-aurora-1" />
            <div className="hero-aurora-2" />
          </div>

          {/* Dot grid */}
          <div className="absolute inset-0 z-[2] about-dark-grid opacity-[0.035]" />

          {/* Parallax floating shapes */}
          <motion.div
            className="absolute inset-0 z-[3] pointer-events-none"
            style={{ y: heroY }}
          >
            <div className="absolute top-[18%] left-[10%] w-16 h-16 border border-orange-500/15 rounded-lg about-float-rotate opacity-50" />
            <div className="absolute bottom-[22%] right-[12%] w-24 h-24 bg-blue-500/[0.06] rounded-full about-float-blob blur-2xl" />
            <div className="absolute top-[50%] right-[30%] w-6 h-6 border border-white/[0.08] rounded about-float-rotate-reverse opacity-30" />
            <div className="absolute top-[30%] left-[55%] w-3 h-3 bg-orange-500/20 rounded-full about-float-particle" />
          </motion.div>

          {/* Content */}
          <motion.div
            className="relative z-10 text-center max-w-5xl mx-auto px-6"
            style={{ opacity: heroOpacity, scale: heroScale }}
          >
            {/* Eyebrow badge */}
            <SpringReveal distance={30} damping={18} delay={0.1}>
              <span className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/[0.05] border border-white/[0.08] backdrop-blur-md mb-8">
                <span className="w-2 h-2 rounded-full bg-orange-500 about-pulse-dot" />
                <span className="text-sm text-gray-300 font-medium">
                  500+ careers transformed
                </span>
              </span>
            </SpringReveal>

            {/* Main heading — GSAP kinetic flip */}
            <KineticText
              text="They Did It."
              as="h1"
              className="text-5xl md:text-7xl lg:text-[5.5rem] font-black text-white leading-[0.95] tracking-tight"
              animation="flipUp"
              splitBy="words"
              delay={0.3}
              stagger={0.15}
            />
            <div className="mt-2">
              <KineticText
                text="So Can You."
                as="h1"
                className="text-5xl md:text-7xl lg:text-[5.5rem] font-black hero-gradient-text leading-[0.95] tracking-tight"
                animation="flipUp"
                splitBy="words"
                delay={0.7}
                stagger={0.15}
              />
            </div>

            {/* Subtitle — staggered line mask */}
            <LineMaskReveal delay={1.2} staggerDelay={0.2} className="mt-8 max-w-2xl mx-auto">
              <p className="text-lg md:text-xl text-gray-400 leading-relaxed">
                Every name here is a real person who was exactly where you are now.
              </p>
              <p className="text-lg md:text-xl text-white/70 leading-relaxed">
                Here&apos;s where they ended up.
              </p>
            </LineMaskReveal>

            {/* Decorative SVG underline */}
            <SpringReveal delay={1.6} distance={20} damping={20}>
              <svg className="mx-auto mt-10" width="120" height="8" viewBox="0 0 120 8" fill="none">
                <path
                  d="M2 6C20 2 40 2 60 4C80 6 100 6 118 2"
                  stroke="#F58220"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </SpringReveal>

            {/* Scroll mouse indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 0.8 }}
              className="mt-16 flex flex-col items-center gap-2 text-white/20"
            >
              <span className="text-[10px] tracking-[0.3em] uppercase font-medium">
                Scroll
              </span>
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <svg width="14" height="22" viewBox="0 0 14 22" fill="none">
                  <rect x="1" y="1" width="12" height="20" rx="6" stroke="currentColor" strokeWidth="1.2" />
                  <motion.circle
                    cx="7"
                    r="1.5"
                    fill="currentColor"
                    animate={{ cy: [7, 13, 7] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                </svg>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        {/* ╔══════════════════════════════════════════════════════════════╗
            ║  SECTION 2 — FEATURED SPOTLIGHT  (White, editorial)        ║
            ╚══════════════════════════════════════════════════════════════╝ */}
        <section className="relative py-28 md:py-40 bg-white overflow-hidden">
          {/* Subtle dot pattern */}
          <div className="absolute inset-0 about-light-dots opacity-30" />

          {/* Decorative floating elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[10%] right-[8%] w-[200px] h-[200px] rounded-full border border-orange-200/30 about-float-rotate" />
            <div className="absolute bottom-[20%] left-[5%] w-[120px] h-[120px] rounded-full bg-orange-50/60 about-float-blob blur-2xl" />
            <div className="absolute top-[50%] left-[50%] w-[300px] h-[1px] -translate-x-1/2 bg-gradient-to-r from-transparent via-gray-200/50 to-transparent" />
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            {/* Editorial asymmetric layout */}
            <div className="grid lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-20 items-center">

              {/* Left column — oversized typography & metadata */}
              <div>
                <ScrollReveal>
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-200/50 mb-8">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 about-pulse-dot" />
                    <span className="text-orange-600 text-xs font-semibold tracking-[0.2em] uppercase">Featured Story</span>
                  </span>
                </ScrollReveal>

                {/* Giant oversized quote mark */}
                <SpringReveal distance={40} damping={16} delay={0.2}>
                  <div className="relative mb-6">
                    <span className="absolute -top-10 -left-4 text-[160px] md:text-[200px] font-serif leading-none text-orange-500/[0.07] select-none pointer-events-none">&ldquo;</span>
                    <blockquote className="relative z-10 text-xl md:text-2xl lg:text-[1.7rem] font-medium text-navy-900 leading-[1.6] pl-2">
                      {featured.desc}
                    </blockquote>
                  </div>
                </SpringReveal>

                {/* Horizontal divider with gradient */}
                <SpringReveal distance={20} damping={18} delay={0.4}>
                  <div className="w-20 h-[2px] bg-gradient-to-r from-orange-500 to-orange-300 mb-8" />
                </SpringReveal>

                {/* Person info — editorial style */}
                <SpringReveal distance={20} damping={18} delay={0.5}>
                  <div className="flex items-center gap-4">
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0"
                      style={{ background: `linear-gradient(135deg, ${featured.color}, ${featured.color}CC)` }}
                    >
                      {featured.initials}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-navy-900">{featured.name}</h3>
                      <p className="text-sm text-gray-400">{featured.to} at {featured.company}</p>
                    </div>
                  </div>
                </SpringReveal>
              </div>

              {/* Right column — immersive card with journey visualization */}
              <div>
                <MagneticCard className="h-full">
                  <motion.div
                    className="ss-spotlight-card relative rounded-[28px] overflow-hidden"
                    whileHover={{ y: -6 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    {/* Card background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900" />

                    {/* Decorative grid inside card */}
                    <div className="absolute inset-0 about-dark-grid opacity-[0.04]" />

                    {/* Ambient glow */}
                    <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full blur-3xl" style={{ background: `${featured.color}12` }} />

                    <div className="relative z-10 p-8 md:p-10">
                      {/* Top row: company logo + badge */}
                      <div className="flex items-center justify-between mb-10">
                        {companyLogos[featured.company] && (
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center backdrop-blur-sm">
                              <img src={companyLogos[featured.company]} alt={featured.company} width={28} height={28} className="w-7 h-7 object-contain brightness-0 invert opacity-70" />
                            </div>
                            <div>
                              <span className="text-white/70 font-semibold text-sm">{featured.company}</span>
                              <p className="text-white/25 text-[11px]">Hired through Linkway</p>
                            </div>
                          </div>
                        )}
                        <span className="px-3 py-1 rounded-full bg-green-500/15 border border-green-500/20 text-green-400 text-[10px] font-bold tracking-wider uppercase">Placed</span>
                      </div>

                      {/* Visual journey — horizontal stepped timeline */}
                      <div className="relative mb-10">
                        <div className="flex items-stretch gap-0">
                          {/* Step 1: Before */}
                          <div className="flex-1 relative">
                            <div className="ss-journey-step-before rounded-l-2xl p-5 border border-white/[0.06] border-r-0 h-full">
                              <span className="text-[10px] text-white/25 font-semibold tracking-widest uppercase block mb-2">Before</span>
                              <span className="text-white/50 text-sm font-medium leading-snug block">{featured.from}</span>
                            </div>
                          </div>

                          {/* Arrow connector */}
                          <div className="flex items-center z-10 -mx-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-orange-400 flex items-center justify-center shadow-lg shadow-orange-500/20">
                              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M3 7H11M11 7L8 4M11 7L8 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </div>
                          </div>

                          {/* Step 2: After */}
                          <div className="flex-1 relative">
                            <div className="ss-journey-step-after rounded-r-2xl p-5 border border-white/[0.06] border-l-0 h-full" style={{ background: `${featured.color}08` }}>
                              <span className="text-[10px] font-semibold tracking-widest uppercase block mb-2" style={{ color: `${featured.color}80` }}>After</span>
                              <span className="text-sm font-bold block" style={{ color: featured.color }}>{featured.to}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Key metrics row */}
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { label: "Program", value: "Data Analytics" },
                          { label: "Duration", value: "6 Months" },
                          { label: "Salary Hike", value: "120%" },
                        ].map((m) => (
                          <div key={m.label} className="text-center p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                            <span className="text-white/60 font-bold text-sm block">{m.value}</span>
                            <span className="text-white/20 text-[10px] font-medium tracking-wider uppercase">{m.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </MagneticCard>
              </div>
            </div>
          </div>
        </section>

        {/* ╔══════════════════════════════════════════════════════════════╗
            ║  SECTION 3 — ALL STORIES  (White, bento masonry)           ║
            ╚══════════════════════════════════════════════════════════════╝ */}
        <section className="relative py-28 md:py-40 bg-gray-50 overflow-hidden">
          {/* Subtle pattern */}
          <div className="absolute inset-0 about-light-dots opacity-20" />

          {/* Decorative */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[8%] right-[12%] w-10 h-10 border border-orange-200/40 rounded about-float-rotate opacity-30" />
            <div className="absolute bottom-[15%] left-[8%] w-20 h-20 bg-orange-50/50 rounded-full about-float-blob blur-xl" />
          </div>

          <div className="max-w-6xl mx-auto px-6 relative z-10">
            <ScrollReveal>
              <div className="text-center mb-6">
                <span className="text-orange-500 text-xs font-semibold tracking-[0.25em] uppercase">
                  All Transformations
                </span>
              </div>
            </ScrollReveal>

            <div className="text-center mb-4">
              <ScrollTextReveal
                className="text-3xl md:text-5xl font-black text-navy-900 leading-tight"
                tag="h2"
                mode="word"
                scrub={1.5}
              >
                More real stories that started with a single decision
              </ScrollTextReveal>
            </div>

            <ScrollReveal delay={0.2}>
              <p className="text-center text-gray-400 text-lg max-w-lg mx-auto mb-16">
                Different backgrounds. Different goals. Same result.
              </p>
            </ScrollReveal>

            {/* Bento grid — first 2 cards are wide, rest are normal */}
            <div className="ss-bento-grid">
              {remaining.map((t, i) => (
                <StoryCard key={t.name} t={t} i={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ╔══════════════════════════════════════════════════════════════╗
            ║  SECTION 4 — STATS  (Navy dark, cinematic)                 ║
            ╚══════════════════════════════════════════════════════════════╝ */}
        <section className="relative py-28 md:py-36 bg-navy-900 overflow-hidden">
          {/* Ambient aurora */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="hero-aurora-1 opacity-60" />
            <div className="hero-aurora-2 opacity-40" />
          </div>
          <div className="absolute inset-0 about-dark-grid opacity-[0.035]" />

          {/* Floating shapes */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[15%] right-[10%] w-12 h-12 border border-orange-500/15 rounded about-float-rotate opacity-40" />
            <div className="absolute bottom-[20%] left-[8%] w-16 h-16 border border-white/[0.06] rounded-lg about-float-rotate-reverse opacity-30" />
          </div>

          <div className="max-w-6xl mx-auto px-6 relative z-10">
            <ScrollReveal>
              <div className="text-center mb-4">
                <span className="text-orange-500 text-xs font-semibold tracking-[0.25em] uppercase">
                  The Numbers
                </span>
              </div>
            </ScrollReveal>

            <div className="text-center mb-16">
              <CharacterSplit
                className="text-3xl md:text-5xl font-black text-white leading-tight"
                highlightColor="white"
                effect="blur"
                delay={0}
                staggerDelay={0.025}
              >
                Impact That Speaks
              </CharacterSplit>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
              {stats.map((stat, i) => (
                <StatItem key={stat.label} stat={stat} i={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ╔══════════════════════════════════════════════════════════════╗
            ║  SECTION 5 — HIRING PARTNERS  (White, 3-row logo scroll)   ║
            ╚══════════════════════════════════════════════════════════════╝ */}
        <section className="relative py-28 md:py-36 bg-white overflow-hidden">
          <div className="absolute inset-0 about-light-dots opacity-30" />

          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[8%] left-[15%] w-10 h-10 border border-gray-200 rounded about-float-rotate opacity-30" />
            <div className="absolute bottom-[15%] right-[10%] w-16 h-16 bg-orange-50 rounded-full about-float-blob blur-xl" />
          </div>

          <div className="relative z-10">
            <div className="max-w-6xl mx-auto px-6">
              <ScrollReveal>
                <div className="text-center mb-4">
                  <span className="text-orange-500 text-xs font-semibold tracking-[0.25em] uppercase">
                    Hiring Partners
                  </span>
                </div>
              </ScrollReveal>

              <div className="text-center mb-4">
                <ScrollTextReveal
                  className="text-3xl md:text-5xl font-black text-navy-900 leading-tight"
                  tag="h2"
                  mode="word"
                  scrub={1.5}
                >
                  Where our graduates build their careers
                </ScrollTextReveal>
              </div>

              <ScrollReveal delay={0.2}>
                <p className="text-center text-gray-400 text-lg max-w-lg mx-auto mb-14">
                  400+ companies actively recruit from Linkway. Here&apos;s a snapshot.
                </p>
              </ScrollReveal>
            </div>

            {/* 3-row infinite logo scroll — full width */}
            <div className="w-full relative">
              {/* Edge fade gradients */}
              <div className="absolute left-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

              <div className="space-y-4">
                <InfiniteLogoRow items={partnerRow1} direction="left" speed={60} />
                <InfiniteLogoRow items={partnerRow2} direction="right" speed={50} />
                <InfiniteLogoRow items={partnerRow3} direction="left" speed={55} />
              </div>
            </div>
          </div>
        </section>

        {/* ╔══════════════════════════════════════════════════════════════╗
            ║  SECTION 6 — CTA  (Navy dark, gradient accent)             ║
            ╚══════════════════════════════════════════════════════════════╝ */}
        <section className="relative py-28 md:py-36 bg-navy-900 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="hero-aurora-1 opacity-40" />
          </div>
          <div className="absolute inset-0 about-dark-grid opacity-[0.03]" />

          <div className="max-w-3xl mx-auto px-6 relative z-10 text-center">
            <SpringReveal distance={60} damping={14}>
              <div className="ss-cta-dark rounded-[28px] p-12 md:p-16 relative overflow-hidden">
                {/* Corner brackets */}
                <div className="absolute top-5 left-5 w-6 h-6 border-t-2 border-l-2 border-orange-500/25 rounded-tl-sm" />
                <div className="absolute top-5 right-5 w-6 h-6 border-t-2 border-r-2 border-orange-500/25 rounded-tr-sm" />
                <div className="absolute bottom-5 left-5 w-6 h-6 border-b-2 border-l-2 border-orange-500/25 rounded-bl-sm" />
                <div className="absolute bottom-5 right-5 w-6 h-6 border-b-2 border-r-2 border-orange-500/25 rounded-br-sm" />

                {/* Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-40 bg-orange-500/[0.06] blur-3xl rounded-full pointer-events-none" />

                <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight relative z-10">
                  Ready to Write
                  <br />
                  <span className="hero-gradient-text">Your Story?</span>
                </h3>
                <p className="mt-5 text-gray-400 text-lg max-w-md mx-auto relative z-10">
                  Join 500+ professionals who transformed their careers with
                  Linkway Learning.
                </p>
                <a
                  href="/#contact"
                  className="inline-flex items-center gap-2.5 mt-10 px-9 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-lg relative z-10 group/btn transition-all duration-300 shadow-[0_4px_24px_rgba(245,130,32,0.3)] hover:shadow-[0_8px_40px_rgba(245,130,32,0.45)] hover:-translate-y-0.5"
                >
                  Start Your Journey
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    className="transition-transform duration-300 group-hover/btn:translate-x-1"
                  >
                    <path
                      d="M4 10H16M16 10L11 5M16 10L11 15"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </div>
            </SpringReveal>
          </div>
        </section>
      </div>
    </ThemeProvider>
  );
}
