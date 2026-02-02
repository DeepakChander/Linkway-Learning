"use client";

import { useRef, useCallback } from "react";
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

  ScrollTextReveal,
  CharacterSplit,
  LineMaskReveal,
  ScrollReveal,
  StaggerLines,
} from "@/components/animation";
import TextScramble from "@/components/animation/TextScramble";
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
  { target: 500, suffix: "+", label: "Careers Launched", icon: "rocket" },
  { target: 400, suffix: "+", label: "Hiring Partners", icon: "handshake" },
  { target: 85, suffix: "%", label: "Avg Salary Jump", icon: "trending" },
  { target: 100, suffix: "%", label: "Only 100% Placement", icon: "check" },
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

/* Animated SVG progress ring for stats */
function ProgressRing({ progress, color, size = 140, strokeWidth = 3 }: { progress: number; color: string; size?: number; strokeWidth?: number }) {
  const ref = useRef<SVGCircleElement>(null);
  const isInView = useInView(ref as any, { once: true, margin: "-100px" });
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <svg width={size} height={size} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-90">
      {/* Track */}
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={strokeWidth} />
      {/* Progress */}
      <circle
        ref={ref}
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={isInView ? circumference * (1 - progress / 100) : circumference}
        style={{ transition: "stroke-dashoffset 2s cubic-bezier(0.22, 1, 0.36, 1)" }}
      />
    </svg>
  );
}

/* Animated horizontal line divider */
function AnimatedDivider({ className = "" }: { className?: string }) {
  return (
    <motion.div
      className={`relative h-px overflow-hidden ${className}`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/50 to-transparent"
        initial={{ x: "-100%" }}
        whileInView={{ x: "100%" }}
        viewport={{ once: true }}
        transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
    </motion.div>
  );
}

/* Story Card — Glassmorphism card with reveal animation */
function StoryCard({ t, i }: { t: (typeof testimonials)[0]; i: number }) {
  const logo = companyLogos[t.company];
  const ref = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 80, rotateX: 8 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.9,
        delay: i * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="h-full perspective-[1200px]"
    >
      <div className="ss-story-card-v2 group relative h-full rounded-[24px] overflow-hidden">
        {/* Animated gradient border on hover */}
        <div
          className="absolute inset-0 rounded-[24px] p-px opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          style={{
            background: `linear-gradient(135deg, ${t.color}40, transparent 40%, transparent 60%, ${t.color}20)`,
          }}
        >
          <div className="w-full h-full rounded-[23px] bg-white" />
        </div>

        {/* Inner content */}
        <div className="relative h-full p-7 md:p-8 flex flex-col bg-white rounded-[24px]">
          {/* Top: Company + accent dot */}
          <div className="flex items-center justify-between mb-7">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0 transition-all duration-500"
                style={{ background: `${t.color}08`, border: `1px solid ${t.color}15` }}
              >
                {logo ? (
                  <img src={logo} alt={t.company} width={22} height={22} className={`w-[22px] h-[22px] object-contain ${darkLogos.has(t.company) ? "brightness-0 opacity-40" : "opacity-60"} group-hover:opacity-90 transition-opacity duration-500`} />
                ) : (
                  <span className="text-[9px] font-bold text-navy-900/30 uppercase tracking-wider">{t.company.slice(0, 3)}</span>
                )}
              </div>
              <span className="text-[12px] text-gray-400 font-medium tracking-wide">{t.company}</span>
            </div>
            <div
              className="w-2 h-2 rounded-full opacity-60 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500"
              style={{ background: t.color }}
            />
          </div>

          {/* Name */}
          <h3 className="text-[18px] font-bold text-navy-900 leading-snug mb-2">{t.name}</h3>

          {/* Journey: from → to with animated arrow */}
          <div className="flex items-center gap-2.5 mb-6 flex-wrap">
            <span className="text-[11px] font-medium text-gray-400 bg-gray-50/80 border border-gray-100 rounded-lg px-3 py-1.5 whitespace-nowrap">
              {t.from}
            </span>
            <div className="relative w-8 h-px shrink-0">
              <div className="absolute inset-0" style={{ background: `linear-gradient(90deg, ${t.color}40, ${t.color})` }} />
              <motion.div
                className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
                style={{ background: t.color }}
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
            <span
              className="text-[11px] font-semibold rounded-lg px-3 py-1.5 whitespace-nowrap"
              style={{ background: `${t.color}10`, color: t.color, border: `1px solid ${t.color}18` }}
            >
              {t.to}
            </span>
          </div>

          {/* Quote with decorative mark */}
          <div className="relative flex-1">
            <span
              className="absolute -top-3 -left-1 text-[48px] font-serif leading-none select-none pointer-events-none opacity-[0.06]"
              style={{ color: t.color }}
            >
              &ldquo;
            </span>
            <p className="text-gray-400 leading-[1.8] text-[13.5px] group-hover:text-gray-500 transition-colors duration-500 pl-1">
              {t.desc}
            </p>
          </div>

          {/* Bottom: avatar + arrow */}
          <div className="mt-6 pt-5 border-t border-gray-100/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-[10px] shrink-0 ring-2 ring-offset-2"
                style={{ background: `linear-gradient(135deg, ${t.color}, ${t.color}CC)`, ["--tw-ring-color" as any]: `${t.color}20` }}
              >
                {t.initials}
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] text-gray-300 font-medium">Career Switch</span>
                <span className="text-[10px] text-gray-200 font-normal">via Linkway</span>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center group-hover:border-orange-200 group-hover:bg-orange-50 transition-all duration-500">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-gray-300 group-hover:text-orange-500 transition-colors duration-500 group-hover:translate-x-0.5 transition-transform">
                <path d="M3 7H11M11 7L8 4M11 7L8 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* Stat Item — with SVG progress ring */
function StatItem({ stat, i }: { stat: (typeof stats)[0]; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const ringProgress = stat.suffix === "%" ? stat.target : Math.min((stat.target / 500) * 100, 100);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.8, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="group text-center relative"
    >
      <div className="relative inline-block mb-4">
        <ProgressRing progress={isInView ? ringProgress : 0} color="rgba(245, 130, 32, 0.3)" />
        <div className="relative z-10 w-[140px] h-[140px] flex items-center justify-center">
          <span className="text-5xl md:text-6xl font-black text-white tabular-nums">
            <Counter target={stat.target} suffix={stat.suffix} />
          </span>
        </div>
      </div>
      <p className="text-gray-400 text-sm md:text-base font-medium tracking-wide group-hover:text-gray-300 transition-colors duration-500">
        {stat.label}
      </p>
      {/* Subtle glow on hover */}
      <div className="absolute -inset-4 bg-orange-500/[0.03] rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10 blur-xl" />
    </motion.div>
  );
}

/* Company Logo Card */
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

/* GSAP Infinite Logo Row */
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

/* Floating particle for hero */
function FloatingParticle({ delay, x, y, size, color }: { delay: number; x: string; y: string; size: number; color: string }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ left: x, top: y, width: size, height: size, background: color }}
      animate={{
        y: [0, -30, 0],
        opacity: [0.3, 0.7, 0.3],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 4 + Math.random() * 3,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

/* Interactive story card for featured section - with tilt */
function FeaturedCard({ person }: { person: (typeof testimonials)[0] }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [4, -4]), { stiffness: 300, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-4, 4]), { stiffness: 300, damping: 20 });

  const onMove = useCallback((e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }, [x, y]);

  const onLeave = useCallback(() => { x.set(0); y.set(0); }, [x, y]);

  const logo = companyLogos[person.company];

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX, rotateY, transformPerspective: 1200 }}
      className="h-full"
    >
      <div className="ss-featured-card relative rounded-[28px] overflow-hidden h-full">
        {/* Card dark background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628] via-[#0d1b2a] to-[#0a1628]" />

        {/* Animated mesh gradient overlay */}
        <div className="absolute inset-0 ss-mesh-glow" />

        {/* Subtle grid */}
        <div className="absolute inset-0 about-dark-grid opacity-[0.04]" />

        {/* Top-right glow blob */}
        <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full blur-3xl" style={{ background: `${person.color}10` }} />

        <div className="relative z-10 p-8 md:p-10 flex flex-col h-full">
          {/* Top: Logo + Placed badge */}
          <div className="flex items-center justify-between mb-8">
            {logo && (
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center backdrop-blur-sm">
                  <img src={logo} alt={person.company} width={28} height={28} className="w-7 h-7 object-contain brightness-0 invert opacity-70" />
                </div>
                <div>
                  <span className="text-white/70 font-semibold text-sm">{person.company}</span>
                  <p className="text-white/25 text-[11px]">Hired through Linkway</p>
                </div>
              </div>
            )}
            <span className="ss-placed-badge">
              <span className="relative flex h-2 w-2 mr-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-50" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
              </span>
              Placed
            </span>
          </div>

          {/* Journey timeline - vertical */}
          <div className="relative mb-8 flex-1">
            {/* Before */}
            <motion.div
              className="relative pl-8 pb-8"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.7 }}
            >
              {/* Timeline dot + line */}
              <div className="absolute left-0 top-1 w-4 h-4 rounded-full border-2 border-white/10 bg-white/[0.03]" />
              <div className="absolute left-[7px] top-5 w-px h-[calc(100%-8px)] bg-gradient-to-b from-white/10 to-orange-500/30" />
              <span className="text-[10px] text-white/25 font-semibold tracking-[0.2em] uppercase block mb-1.5">Before Linkway</span>
              <span className="text-white/50 text-base font-medium">{person.from}</span>
            </motion.div>

            {/* After */}
            <motion.div
              className="relative pl-8"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.7 }}
            >
              <div className="absolute left-0 top-1 w-4 h-4 rounded-full border-2 border-orange-500/40 bg-orange-500/20" />
              <span className="text-[10px] font-semibold tracking-[0.2em] uppercase block mb-1.5" style={{ color: `${person.color}80` }}>After Linkway</span>
              <span className="text-base font-bold" style={{ color: person.color }}>{person.to}</span>
            </motion.div>
          </div>

          {/* Key metrics row */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Program", value: "Data Analytics" },
              { label: "Duration", value: "6 Months" },
              { label: "Salary Hike", value: "120%" },
            ].map((m, mi) => (
              <motion.div
                key={m.label}
                className="text-center p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] transition-colors duration-500"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 + mi * 0.1, duration: 0.6 }}
              >
                <span className="text-white/70 font-bold text-sm block">{m.value}</span>
                <span className="text-white/20 text-[10px] font-medium tracking-wider uppercase">{m.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
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

  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);

  // featured = Rehan Siddiqui (Amazon)
  const featured = testimonials[4];
  const remaining = testimonials.filter((_, i) => i !== 4);


  return (
    <ThemeProvider theme="light">
      <div className="ss-page-v4">

        {/* ╔══════════════════════════════════════════════════════════════╗
            ║  SECTION 1 — HERO  (Animated mesh gradient, no image)      ║
            ╚══════════════════════════════════════════════════════════════╝ */}
        <section
          ref={heroRef}
          className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#060d18]"
        >
          {/* Animated mesh gradient background — pure CSS */}
          <div className="absolute inset-0 ss-hero-mesh" />

          {/* Animated gradient orbs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="ss-orb ss-orb-1" />
            <div className="ss-orb ss-orb-2" />
            <div className="ss-orb ss-orb-3" />
          </div>

          {/* Noise texture overlay */}
          <div className="absolute inset-0 ss-noise opacity-[0.03]" />

          {/* Grid pattern */}
          <div className="absolute inset-0 z-[2] about-dark-grid opacity-[0.025]" />

          {/* Floating particles */}
          <div className="absolute inset-0 z-[3] pointer-events-none">
            <FloatingParticle delay={0} x="10%" y="20%" size={4} color="rgba(245,130,32,0.4)" />
            <FloatingParticle delay={1} x="85%" y="30%" size={3} color="rgba(59,130,246,0.3)" />
            <FloatingParticle delay={0.5} x="50%" y="15%" size={2} color="rgba(255,255,255,0.2)" />
            <FloatingParticle delay={2} x="25%" y="70%" size={3} color="rgba(245,130,32,0.3)" />
            <FloatingParticle delay={1.5} x="70%" y="65%" size={4} color="rgba(139,92,246,0.2)" />
            <FloatingParticle delay={0.8} x="40%" y="80%" size={2} color="rgba(255,255,255,0.15)" />
            <FloatingParticle delay={3} x="90%" y="75%" size={3} color="rgba(245,130,32,0.25)" />
            <FloatingParticle delay={2.5} x="15%" y="50%" size={2} color="rgba(16,185,129,0.2)" />
          </div>

          {/* Horizontal line accents */}
          <motion.div
            className="absolute left-0 right-0 top-[30%] h-px bg-gradient-to-r from-transparent via-orange-500/10 to-transparent z-[2]"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.5, duration: 2, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.div
            className="absolute left-0 right-0 bottom-[25%] h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent z-[2]"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 2, duration: 2, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Content */}
          <motion.div
            className="relative z-10 text-center max-w-5xl mx-auto px-6"
            style={{ opacity: heroOpacity, scale: heroScale }}
          >
            {/* Eyebrow badge with scramble text */}
            <SpringReveal distance={30} damping={18} delay={0.1}>
              <span className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/[0.04] border border-white/[0.06] backdrop-blur-xl mb-10">
                <span className="w-2 h-2 rounded-full bg-orange-500 about-pulse-dot" />
                <TextScramble className="text-sm text-gray-300 font-medium" delay={0.5} speed={25}>
                  500+ careers transformed
                </TextScramble>
              </span>
            </SpringReveal>

            {/* Main heading — StaggerLines for dramatic waterfall entry */}
            <StaggerLines
              baseDelay={0.3}
              staggerDelay={0.12}
              skewY={-4}
              distance={120}
            >
              <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-black text-white leading-[0.95] tracking-tight">
                They Did It.
              </h1>
              <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-black hero-gradient-text leading-[0.95] tracking-tight">
                So Can You.
              </h1>
            </StaggerLines>

            {/* Subtitle — staggered line mask */}
            <LineMaskReveal delay={1} staggerDelay={0.2} className="mt-10 max-w-2xl mx-auto">
              <p className="text-lg md:text-xl text-gray-400 leading-relaxed">
                Every name here is a real person who was exactly where you are now.
              </p>
              <p className="text-lg md:text-xl text-white/70 leading-relaxed">
                Here&apos;s where they ended up.
              </p>
            </LineMaskReveal>

            {/* CTA button in hero */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="mt-12"
            >
              <a
                href="#stories"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white/[0.06] border border-white/[0.08] backdrop-blur-sm text-white/80 font-medium text-sm hover:bg-white/[0.1] hover:border-white/[0.12] transition-all duration-500 group"
              >
                Explore Their Stories
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="transition-transform duration-500 group-hover:translate-y-0.5">
                  <path d="M8 3V13M8 13L4 9M8 13L12 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </motion.div>
          </motion.div>
        </section>

        {/* ╔══════════════════════════════════════════════════════════════╗
            ║  SECTION 2 — FEATURED SPOTLIGHT  (White, editorial)        ║
            ╚══════════════════════════════════════════════════════════════╝ */}
        <section className="relative py-28 md:py-40 bg-white overflow-hidden">
          {/* Subtle pattern */}
          <div className="absolute inset-0 about-light-dots opacity-20" />

          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              className="absolute top-[10%] right-[8%] w-[200px] h-[200px] rounded-full border border-orange-100/40"
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            />
            <div className="absolute bottom-[20%] left-[5%] w-[140px] h-[140px] rounded-full bg-orange-50/50 blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-20 items-center">
              {/* Left — Typography & quote */}
              <div>
                <ScrollReveal>
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-200/50 mb-8">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 about-pulse-dot" />
                    <span className="text-orange-600 text-xs font-semibold tracking-[0.2em] uppercase">Featured Story</span>
                  </span>
                </ScrollReveal>

                {/* Oversized quote */}
                <SpringReveal distance={50} damping={14} delay={0.2}>
                  <div className="relative mb-8">
                    <span className="absolute -top-12 -left-4 text-[180px] md:text-[220px] font-serif leading-none text-orange-500/[0.06] select-none pointer-events-none">&ldquo;</span>
                    <blockquote className="relative z-10 text-xl md:text-2xl lg:text-[1.75rem] font-medium text-navy-900 leading-[1.65] pl-2">
                      {featured.desc}
                    </blockquote>
                  </div>
                </SpringReveal>

                {/* Animated gradient line */}
                <motion.div
                  className="h-[2px] mb-8 rounded-full overflow-hidden"
                  initial={{ width: 0 }}
                  whileInView={{ width: 80 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="w-full h-full bg-gradient-to-r from-orange-500 to-orange-300" />
                </motion.div>

                {/* Person info */}
                <SpringReveal distance={20} damping={18} delay={0.5}>
                  <div className="flex items-center gap-4">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-lg"
                      style={{ background: `linear-gradient(135deg, ${featured.color}, ${featured.color}CC)`, boxShadow: `0 8px 24px ${featured.color}25` }}
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

              {/* Right — Immersive card */}
              <SpringReveal distance={60} damping={14} delay={0.3}>
                <FeaturedCard person={featured} />
              </SpringReveal>
            </div>
          </div>
        </section>

        {/* ╔══════════════════════════════════════════════════════════════╗
            ║  SECTION 3 — ALL STORIES  (Light bg, modern grid)          ║
            ╚══════════════════════════════════════════════════════════════╝ */}
        <section id="stories" className="relative py-28 md:py-40 bg-[#FAFBFC] overflow-hidden">
          {/* Subtle gradient accent */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200/60 to-transparent" />

          {/* Decorative */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[10%] right-[10%] w-[300px] h-[300px] bg-orange-50/30 rounded-full blur-3xl" />
            <div className="absolute bottom-[10%] left-[5%] w-[250px] h-[250px] bg-blue-50/20 rounded-full blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            {/* Section header */}
            <ScrollReveal>
              <div className="text-center mb-5">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-navy-900/[0.03] border border-navy-900/[0.06]">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  <span className="text-navy-900/50 text-xs font-semibold tracking-[0.2em] uppercase">
                    All Transformations
                  </span>
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
                Real stories that started with a single decision
              </ScrollTextReveal>
            </div>

            <ScrollReveal delay={0.2}>
              <p className="text-center text-gray-400 text-lg max-w-lg mx-auto mb-16">
                Different backgrounds. Different goals. Same transformation.
              </p>
            </ScrollReveal>

            {/* Modern grid with staggered heights */}
            <div className="ss-stories-grid">
              {remaining.map((t, i) => (
                <StoryCard key={t.name} t={t} i={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ╔══════════════════════════════════════════════════════════════╗
            ║  SECTION 4 — STATS  (Dark, cinematic with progress rings)  ║
            ╚══════════════════════════════════════════════════════════════╝ */}
        <section className="relative py-28 md:py-40 bg-[#060d18] overflow-hidden">
          {/* Animated mesh background */}
          <div className="absolute inset-0 ss-hero-mesh opacity-40" />

          {/* Grid */}
          <div className="absolute inset-0 about-dark-grid opacity-[0.025]" />

          {/* Horizontal accent lines */}
          <div className="absolute top-[20%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/[0.08] to-transparent" />
          <div className="absolute bottom-[20%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" />

          <div className="max-w-6xl mx-auto px-6 relative z-10">
            <ScrollReveal>
              <div className="text-center mb-4">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06]">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  <span className="text-white/40 text-xs font-semibold tracking-[0.2em] uppercase">
                    The Numbers
                  </span>
                </span>
              </div>
            </ScrollReveal>

            <div className="text-center mb-20">
              <CharacterSplit
                className="text-3xl md:text-5xl font-black text-white leading-tight"
                highlightColor="white"
                effect="blur"
                delay={0}
                staggerDelay={0.025}
              >
                Impact That Speaks for Itself
              </CharacterSplit>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
              {stats.map((stat, i) => (
                <StatItem key={stat.label} stat={stat} i={i} />
              ))}
            </div>

            {/* Bottom animated divider */}
            <AnimatedDivider className="mt-20 max-w-md mx-auto" />
          </div>
        </section>

        {/* ╔══════════════════════════════════════════════════════════════╗
            ║  SECTION 5 — HIRING PARTNERS  (White, 3-row logo scroll)   ║
            ╚══════════════════════════════════════════════════════════════╝ */}
        <section className="relative py-28 md:py-36 bg-white overflow-hidden">
          <div className="absolute inset-0 about-light-dots opacity-20" />

          <div className="relative z-10">
            <div className="max-w-6xl mx-auto px-6">
              <ScrollReveal>
                <div className="text-center mb-5">
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-navy-900/[0.03] border border-navy-900/[0.06]">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    <span className="text-navy-900/50 text-xs font-semibold tracking-[0.2em] uppercase">
                      Hiring Partners
                    </span>
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
                <p className="text-center text-gray-400 text-lg max-w-lg mx-auto mb-16">
                  400+ companies actively recruit from Linkway. Here&apos;s a snapshot.
                </p>
              </ScrollReveal>
            </div>

            {/* 3-row infinite logo scroll */}
            <div className="w-full relative">
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
            ║  SECTION 6 — CTA  (Dark, animated gradient border)         ║
            ╚══════════════════════════════════════════════════════════════╝ */}
        <section className="relative py-28 md:py-40 bg-[#060d18] overflow-hidden">
          {/* Background mesh */}
          <div className="absolute inset-0 ss-hero-mesh opacity-30" />
          <div className="absolute inset-0 about-dark-grid opacity-[0.02]" />

          <div className="max-w-3xl mx-auto px-6 relative z-10 text-center">
            <SpringReveal distance={60} damping={14}>
              <div className="ss-cta-card relative rounded-[32px] p-12 md:p-16 overflow-hidden">
                {/* Animated gradient border */}
                <div className="absolute inset-0 rounded-[32px] ss-gradient-border" />

                {/* Inner bg */}
                <div className="absolute inset-px rounded-[31px] bg-[#0a1628]" />

                {/* Top glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-orange-500/[0.05] blur-3xl rounded-full pointer-events-none" />

                {/* Corner accents */}
                <div className="absolute top-6 left-6 w-8 h-8 border-t border-l border-orange-500/20 rounded-tl-lg" />
                <div className="absolute top-6 right-6 w-8 h-8 border-t border-r border-orange-500/20 rounded-tr-lg" />
                <div className="absolute bottom-6 left-6 w-8 h-8 border-b border-l border-orange-500/20 rounded-bl-lg" />
                <div className="absolute bottom-6 right-6 w-8 h-8 border-b border-r border-orange-500/20 rounded-br-lg" />

                <div className="relative z-10">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="w-16 h-16 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-500/5 border border-orange-500/10 flex items-center justify-center"
                  >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-orange-400">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </motion.div>

                  <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight">
                    Ready to Write
                    <br />
                    <span className="hero-gradient-text">Your Story?</span>
                  </h3>
                  <p className="mt-6 text-gray-400 text-lg max-w-md mx-auto leading-relaxed">
                    Join 500+ professionals who transformed their careers with
                    Linkway Learning.
                  </p>
                  <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <a
                      href="/#contact"
                      className="ss-cta-button group/btn inline-flex items-center gap-2.5 px-9 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-lg transition-all duration-500 hover:-translate-y-1"
                    >
                      Start Your Journey
                      <svg
                        width="20" height="20" viewBox="0 0 20 20" fill="none"
                        className="transition-transform duration-300 group-hover/btn:translate-x-1"
                      >
                        <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>
                    <a
                      href="/programs"
                      className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl border border-white/[0.08] text-white/60 font-medium text-base hover:bg-white/[0.04] hover:text-white/80 transition-all duration-500"
                    >
                      View Programs
                    </a>
                  </div>
                </div>
              </div>
            </SpringReveal>
          </div>
        </section>
      </div>
    </ThemeProvider>
  );
}
