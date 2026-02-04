"use client";

import { useRef, useState, useCallback } from "react";
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
  useMotionTemplate,
} from "framer-motion";
import Counter from "@/components/animation/Counter";
import {
  SpringReveal,
  CharacterSplit,
  LineMaskReveal,
  ScrollReveal,
  StaggerLines,
} from "@/components/animation";
import TextScramble from "@/components/animation/TextScramble";
import { ThemeProvider } from "@/lib/theme";
import Image from "next/image";
import { ArrowRight, Star, StarHalf, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════════════ */
const testimonials = [
  { name: "Aditya Srivastava", from: "Full-Stack Developer", to: "Junior Data Scientist", company: "Globussoft", desc: "I could build apps, but I didn't know ML. Linkway filled that gap with real projects — computer vision, forecasting, the works. Now I'm doing data science full-time.", initials: "AS", color: "#F59E0B", category: "tech", avatar: "/images/avatars/avatar-1.svg" },
  { name: "Arpit Jain", from: "Hospitality Professional", to: "Business Analyst", company: "EaseMyTrip", desc: "Hospitality was all I knew. I picked up SQL and analytics from scratch, and now I'm analyzing booking trends at EaseMyTrip. Completely different life.", initials: "AJ", color: "#3B82F6", category: "career-switch", avatar: "/images/avatars/avatar-2.svg" },
  { name: "Junaid Khan", from: "Operations & Banking", to: "Business Analyst", company: "Razorpay", desc: "Banking ops had no growth path for me. Six months of focused learning later, I'm a business analyst at Razorpay doing work that actually excites me.", initials: "JK", color: "#10B981", category: "career-switch", avatar: "/images/avatars/avatar-3.svg" },
  { name: "Rajeev Chauhan", from: "Operations Executive", to: "Business Research Analyst", company: "EXL", desc: "I was stuck in operations. The program taught me how to think analytically and back decisions with data. Now I do exactly that at EXL.", initials: "RC", color: "#8B5CF6", category: "upskill", avatar: "/images/avatars/avatar-4.svg" },
  { name: "Rehan Siddiqui", from: "Non-Tech Background", to: "Data Analyst", company: "Amazon", desc: "Zero tech background. Linkway taught me Tableau, Power BI, and how to actually think with data. Now I'm at Amazon solving real business problems.", initials: "RS", color: "#F58220", category: "career-switch", avatar: "/images/avatars/avatar-5.svg" },
  { name: "Shivani Rawat", from: "Operations & Product", to: "Business Analyst", company: "Booking.com", desc: "Operations felt like a dead end. The program gave me the technical edge I needed, and now I'm doing requirement analysis at Booking.com.", initials: "SR", color: "#EC4899", category: "upskill", avatar: "/images/avatars/avatar-1.svg" },
  { name: "Shalendra Gupta", from: "Sales Executive", to: "Business Analyst", company: "Vishal Mega Mart", desc: "Went from selling on the floor to analyzing what sells. Excel and Power BI changed how I see business — and my career.", initials: "SG", color: "#06B6D4", category: "career-switch", avatar: "/images/avatars/avatar-2.svg" },
  { name: "Syed Nehal", from: "HR & Accounting", to: "Data Analyst", company: "Safegraph", desc: "HR and accounting weren't going anywhere for me. Project-based learning made the switch possible. Now I'm a data analyst working globally.", initials: "SN", color: "#6366F1", category: "career-switch", avatar: "/images/avatars/avatar-3.svg" },
  { name: "Vansh Pathak", from: "Accounting Intern", to: "Reporting Analyst", company: "Accenture", desc: "From crunching numbers in spreadsheets to building real SQL reports at Accenture. The jump felt huge, but the mentors made it doable.", initials: "VP", color: "#14B8A6", category: "upskill", avatar: "/images/avatars/avatar-4.svg" },
];

const stats = [
  { target: 8200, suffix: "+", label: "Careers Launched", icon: "rocket", description: "Professionals placed in top companies" },
  { target: 400, suffix: "+", label: "Hiring Partners", icon: "building", description: "Companies actively recruiting from us" },
  { target: 85, suffix: "%", label: "Avg Salary Jump", icon: "trending", description: "Average increase in compensation" },
  { target: 100, suffix: "%", label: "Placement Rate", icon: "target", description: "Of committed learners get placed" },
];


const journeySteps = [
  { step: "01", title: "Apply & Get Assessed", desc: "Take a quick aptitude test. We identify your strengths and craft a personalized path.", icon: "clipboard" },
  { step: "02", title: "Learn by Building", desc: "No passive lectures. You build 12+ real projects with industry datasets from day one.", icon: "code" },
  { step: "03", title: "Get Mentored", desc: "Weekly 1-on-1 sessions with industry mentors from Amazon, Google, and Deloitte.", icon: "users" },
  { step: "04", title: "Land Your Dream Role", desc: "Dedicated placement team preps you with mock interviews, resume reviews, and direct referrals.", icon: "briefcase" },
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
  Globussoft: "/images/companies/globussoft.svg",
  EaseMyTrip: "/images/companies/easemytrip.svg",
  Razorpay: "/images/companies/razorpay.svg",
  EXL: "/images/companies/exl.svg",
  "Booking.com": "/images/companies/booking.svg",
  "Vishal Mega Mart": "/images/companies/vishal-mega-mart.svg",
  Safegraph: "/images/companies/safegraph.svg",
  Accenture: "/images/companies/accenture.svg",
  HUL: "/images/companies/hul.svg",
  Genpact: "/images/companies/genpact.svg",
  Sprinklr: "/images/companies/sprinklr.svg",
  "Bandhan Bank": "/images/companies/bandhan-bank.svg",
  GlobalLogic: "/images/companies/globallogic.svg",
  Wipro: "/images/companies/wipro.svg",
  Infosys: "/images/companies/infosys.svg",
  IBM: "/images/companies/ibm.svg",
  Capgemini: "/images/companies/capgemini.svg",
};

const darkLogos = new Set(["Amazon", "Microsoft", "IBM", "Wipro"]);

const partnerRow1 = ["Google", "Amazon", "Accenture", "Deloitte", "TCS", "Tech Mahindra", "Saint-Gobain", "BNY Mellon", "Infosys", "Microsoft"];
const partnerRow2 = ["Turing", "IDFC First Bank", "AXA", "Juniper Networks", "iOPEX", "Fractal", "Sony Pictures", "AT&T", "SpringWorks", "Capgemini"];
const partnerRow3 = ["Uptime AI", "MUFG", "MiQ", "HUL", "Genpact", "Sprinklr", "Bandhan Bank", "GlobalLogic", "Wipro", "IBM"];

/* ═══════════════════════════════════════════════════════════════════
   MICRO-COMPONENTS
   ═══════════════════════════════════════════════════════════════════ */

/* ── Mouse-tracking Spotlight Card ── */
function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(245, 130, 32, 0.07)",
  borderRadius = "24px",
}: {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  borderRadius?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    },
    [mouseX, mouseY]
  );

  const spotlightBg = useMotionTemplate`radial-gradient(350px circle at ${mouseX}px ${mouseY}px, ${spotlightColor}, transparent 80%)`;

  return (
    <div ref={ref} onMouseMove={handleMouseMove} className={`relative group ${className}`}>
      <motion.div
        className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-[1]`}
        style={{ background: spotlightBg, borderRadius }}
      />
      <motion.div
        className={`absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
        style={{
          background: useMotionTemplate`radial-gradient(300px circle at ${mouseX}px ${mouseY}px, ${spotlightColor}, transparent 70%)`,
          borderRadius,
        }}
      />
      {children}
    </div>
  );
}

/* ── Floating Testimonial Pill (for hero) ── */
function FloatingPill({
  person,
  className,
  delay = 0,
}: {
  person: (typeof testimonials)[0];
  className: string;
  delay?: number;
}) {
  const logo = companyLogos[person.company];
  return (
    <motion.div
      className={`absolute z-20 ${className}`}
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 1, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="ss2-floating-pill flex items-center gap-3 px-4 py-3 rounded-2xl"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4 + delay, repeat: Infinity, ease: "easeInOut" }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${person.color}, ${person.color}BB)` }}
        >
          <Image
            src={person.avatar}
            alt={person.name}
            width={40}
            height={40}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="min-w-0">
          <p className="text-white text-sm font-semibold truncate">{person.name}</p>
          <div className="flex items-center gap-1.5">
            {logo && (
              <img src={logo} alt="" width={12} height={12} className="w-3 h-3 object-contain brightness-0 invert opacity-40" />
            )}
            <p className="text-white/40 text-[11px] truncate">{person.to} at {person.company}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Bento Story Card ── */
function BentoStoryCard({ person }: { person: (typeof testimonials)[0] }) {
  const logo = companyLogos[person.company];

  return (
    <motion.div
      className="h-full rounded-2xl p-6 bg-[#F2F1EE] border border-[#e5e4e0] hover:border-[#d5d4d0] hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300 hover:-translate-y-1 flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
    >
      {/* Transformation journey */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-gray-500 font-medium">{person.from}</span>
          <ArrowRight className="w-3 h-3 text-gray-400" />
          <span className="text-[11px] text-orange-600 font-semibold">{person.to}</span>
        </div>
        {logo && (
          <img src={logo} alt={person.company} width={20} height={20} className={`w-5 h-5 object-contain ${darkLogos.has(person.company) ? "brightness-0 opacity-60" : "opacity-70"}`} />
        )}
      </div>

      {/* Quote */}
      <p className="text-gray-600 leading-relaxed text-[13px] mb-6 flex-1">
        &ldquo;{person.desc}&rdquo;
      </p>

      {/* Bottom - Avatar + Name + Company */}
      <div className="flex items-center gap-3 pt-4 border-t border-black/[0.06]">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-xs shrink-0"
          style={{ background: `linear-gradient(135deg, ${person.color}, ${person.color}CC)` }}
        >
          {person.initials}
        </div>
        <div className="min-w-0">
          <h4 className="font-medium text-gray-900 text-sm leading-tight truncate">{person.name}</h4>
          <span className="text-[11px] text-gray-500">{person.company}</span>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Journey Step Card ── */
function JourneyStepCard({ step, index }: { step: (typeof journeySteps)[0]; index: number }) {
  const icons: Record<string, React.ReactNode> = {
    clipboard: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
      </svg>
    ),
    code: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    users: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
    briefcase: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
      </svg>
    ),
  };

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
    >
      <SpotlightCard spotlightColor="rgba(245, 130, 32, 0.06)" borderRadius="24px">
        <div className="ss2-journey-card relative rounded-[24px] p-8 h-full overflow-hidden group">
          {/* Step number watermark */}
          <span className="absolute top-4 right-6 text-[80px] font-black text-navy-900/[0.03] leading-none select-none pointer-events-none">{step.step}</span>

          {/* Animated top line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-orange-500/0 to-transparent group-hover:via-orange-500/40 transition-all duration-700" />

          <div className="relative z-10">
            {/* Icon */}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100/50 border border-orange-200/30 flex items-center justify-center text-orange-500 mb-6 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-orange-500/10 transition-all duration-500">
              {icons[step.icon]}
            </div>

            {/* Step label */}
            <span className="text-[11px] font-bold text-orange-500/60 tracking-[0.2em] uppercase block mb-2">Step {step.step}</span>

            <h3 className="text-xl font-bold text-navy-900 mb-3 group-hover:text-orange-600 transition-colors duration-500">{step.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
          </div>
        </div>
      </SpotlightCard>
    </motion.div>
  );
}

/* ── Stat Card (Cinematic) ── */
function StatCard({ stat, index }: { stat: (typeof stats)[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const icons: Record<string, React.ReactNode> = {
    rocket: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z" />
        <path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z" />
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
      </svg>
    ),
    building: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2" ry="2" /><path d="M9 22v-4h6v4" /><path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01" />
      </svg>
    ),
    trending: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
      </svg>
    ),
    target: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
      </svg>
    ),
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
    >
      <SpotlightCard spotlightColor="rgba(245, 130, 32, 0.05)" borderRadius="24px">
        <div className="ss2-stat-card relative rounded-[20px] p-6 md:p-7 overflow-hidden group h-full">
          <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-orange-500/[0.03] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          <div className="relative z-10">
            <div className="w-11 h-11 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-orange-400/60 mb-5 group-hover:border-orange-500/20 group-hover:text-orange-400 transition-all duration-500 [&>svg]:w-5 [&>svg]:h-5">
              {icons[stat.icon]}
            </div>

            <div className="mb-2">
              <span className="text-3xl md:text-4xl font-black text-white tabular-nums">
                <Counter target={stat.target} suffix={stat.suffix} />
              </span>
            </div>

            <h3 className="text-white/80 text-sm font-semibold mb-1">{stat.label}</h3>
            <p className="text-white/25 text-xs leading-relaxed">{stat.description}</p>
          </div>
        </div>
      </SpotlightCard>
    </motion.div>
  );
}

/* ── Company Logo Card ── */
function CompanyLogoCard({ name }: { name: string }) {
  const logo = companyLogos[name];
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2);

  return (
    <div className="ss2-logo-card group">
      <div className="ss2-logo-icon">
        {logo ? (
          <img src={logo} alt={name} width={28} height={28} className={`w-7 h-7 object-contain ${darkLogos.has(name) ? "brightness-0 invert" : ""}`} />
        ) : (
          <span className="text-xs font-bold text-white/30">{initials}</span>
        )}
      </div>
      <span className="text-sm font-medium text-white/40 group-hover:text-white/70 transition-colors duration-300 truncate">{name}</span>
    </div>
  );
}

/* ── GSAP Infinite Logo Row ── */
function InfiniteLogoRow({ items, direction = "left", speed = 55, className = "" }: { items: string[]; direction?: "left" | "right"; speed?: number; className?: string }) {
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
        { x: direction === "left" ? -oneSetWidth : 0, duration: speed, ease: "none", repeat: -1 }
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

/* ── Horizontal Scroll Stats Section ── */
function HorizontalStats() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const x = useTransform(scrollYProgress, [0, 1], ["5%", "-15%"]);

  return (
    <div ref={containerRef} className="overflow-hidden">
      <motion.div ref={scrollRef} className="flex gap-6 md:gap-8 px-6" style={{ x }}>
        {stats.map((stat, i) => (
          <div key={stat.label} className="min-w-[280px] md:min-w-[320px] flex-shrink-0">
            <StatCard stat={stat} index={i} />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* ── Brand Logos (inline JSX — same as home page) ── */
function GoogleLogo() {
  return (
    <span className="text-xl font-semibold tracking-tight" style={{ fontFamily: "Product Sans, Arial, sans-serif" }}>
      <span style={{ color: "#4285F4" }}>G</span><span style={{ color: "#EA4335" }}>o</span><span style={{ color: "#FBBC05" }}>o</span><span style={{ color: "#4285F4" }}>g</span><span style={{ color: "#34A853" }}>l</span><span style={{ color: "#EA4335" }}>e</span>
    </span>
  );
}
function FlipkartLogo() { return <span className="text-xl font-bold tracking-tight" style={{ color: "#F7D02C", fontFamily: "Arial, sans-serif" }}>Flipkart</span>; }
function MicrosoftLogo() {
  return (
    <span className="flex items-center gap-1.5">
      <svg width="18" height="18" viewBox="0 0 18 18"><rect x="0" y="0" width="8.5" height="8.5" fill="#F25022" /><rect x="9.5" y="0" width="8.5" height="8.5" fill="#7FBA00" /><rect x="0" y="9.5" width="8.5" height="8.5" fill="#00A4EF" /><rect x="9.5" y="9.5" width="8.5" height="8.5" fill="#FFB900" /></svg>
      <span className="text-lg font-normal text-white/80" style={{ fontFamily: "Segoe UI, Arial, sans-serif" }}>Microsoft</span>
    </span>
  );
}
function DeloitteLogo() {
  return <span className="flex items-center gap-0.5"><span className="text-xl font-bold text-white" style={{ fontFamily: "Arial, sans-serif" }}>Deloitte</span><span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: "#86BC25" }} /></span>;
}
function AccentureLogo() { return <span className="text-xl font-semibold" style={{ color: "#A100FF", fontFamily: "Arial, sans-serif" }}>&gt; accenture</span>; }
function InfosysLogo() { return <span className="text-xl font-bold" style={{ color: "#007CC3", fontFamily: "Arial, sans-serif" }}>Infosys</span>; }

const brandLogos = [
  { name: "Google", component: GoogleLogo },
  { name: "Flipkart", component: FlipkartLogo },
  { name: "Microsoft", component: MicrosoftLogo },
  { name: "Deloitte", component: DeloitteLogo },
  { name: "Accenture", component: AccentureLogo },
  { name: "Infosys", component: InfosysLogo },
];

/* ── Inline Lead Form (same as home page) ── */
function SSLeadForm() {
  const [formState, setFormState] = useState<"idle" | "loading" | "success">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    designation: "",
    experience: "",
    company: "",
    course: "",
  });

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Name is required";
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Valid email required";
    if (!formData.phone.trim() || !/^\+?\d{10,15}$/.test(formData.phone.replace(/\s/g, "")))
      newErrors.phone = "Valid phone number required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setFormState("loading");
    try {
      const res = await fetch("https://formspree.io/f/xpwdzgkl", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setFormState("success");
      } else {
        setFormState("idle");
        setErrors({ email: "Submission failed. Please try again." });
      }
    } catch {
      setFormState("idle");
      setErrors({ email: "Network error. Please try again." });
    }
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  if (formState === "success") {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-xl flex flex-col items-center justify-center text-center min-h-[480px]">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-5">
          <CheckCircle2 className="w-8 h-8 text-green-500" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">We&apos;ve Got Your Details!</h3>
        <p className="text-gray-500 text-sm">Our counselor will reach out within 24 hours to help you get started.</p>
      </div>
    );
  }

  const inputClass = (field: string) =>
    `w-full bg-white border rounded-lg px-4 py-3 text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none transition-colors ${
      errors[field] ? "border-red-400 focus:border-red-400" : "border-gray-200 focus:border-orange-500"
    }`;

  const selectClass =
    "w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-900 text-sm focus:outline-none focus:border-orange-500 transition-colors appearance-none cursor-pointer";

  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl">
      <h3 className="text-lg md:text-xl font-bold text-gray-900 text-center mb-6">
        Ready to Write Your Success Story?
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Full Name</label>
          <input type="text" placeholder="John Doe" value={formData.fullName} onChange={(e) => handleChange("fullName", e.target.value)} className={inputClass("fullName")} />
          {errors.fullName && <p className="text-xs text-red-400 flex items-center gap-1 mt-1"><AlertCircle className="w-3 h-3" /> {errors.fullName}</p>}
        </div>

        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Email Address</label>
          <input type="email" placeholder="abc@gmail.com" value={formData.email} onChange={(e) => handleChange("email", e.target.value)} className={inputClass("email")} />
          {errors.email && <p className="text-xs text-red-400 flex items-center gap-1 mt-1"><AlertCircle className="w-3 h-3" /> {errors.email}</p>}
        </div>

        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Contact Number</label>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg px-3 py-3 text-sm text-gray-700 shrink-0">
              <span>IN</span><span>+91</span><span className="text-gray-300">&middot;</span>
            </div>
            <input type="tel" placeholder="81234 56789" value={formData.phone} onChange={(e) => handleChange("phone", e.target.value)} className={inputClass("phone")} />
          </div>
          {errors.phone && <p className="text-xs text-red-400 flex items-center gap-1 mt-1"><AlertCircle className="w-3 h-3" /> {errors.phone}</p>}
        </div>

        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Program preference</label>
          <select value={formData.course} onChange={(e) => handleChange("course", e.target.value)} className={selectClass}>
            <option value="">Select</option>
            <option value="Data Analytics">Data Analytics</option>
            <option value="Business Analytics">Business Analytics</option>
            <option value="Data Science and AI">Data Science and AI</option>
            <option value="Agentic AI & Prompt Engineering">Agentic AI &amp; Prompt Engineering</option>
            <option value="Investment Banking">Investment Banking</option>
            <option value="Not Sure">Not Sure Yet</option>
          </select>
        </div>

        <button type="submit" disabled={formState === "loading"} className="w-full bg-[#0D1B2A] hover:bg-[#162d45] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
          {formState === "loading" ? <Loader2 className="w-5 h-5 animate-spin" /> : "Start My Transformation"}
        </button>
      </form>
    </div>
  );
}

/* ── Success Stories CTA Section (home page style) ── */
function SuccessStoriesCTA() {
  return (
    <section className="relative overflow-hidden bg-[#0D1B2A]">

      {/* ── Orbital Rings System ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="ss2-orbit-system">
          {/* Concentric rotating rings */}
          <div className="ss2-orbit-ring ss2-ring-1">
            <div className="ss2-orbit-node ss2-node-orange" />
          </div>
          <div className="ss2-orbit-ring ss2-ring-2">
            <div className="ss2-orbit-node ss2-node-blue" />
            <div className="ss2-orbit-node ss2-node-blue-2" />
          </div>
          <div className="ss2-orbit-ring ss2-ring-3">
            <div className="ss2-orbit-node ss2-node-purple" />
          </div>
          {/* Center pulse */}
          <div className="ss2-orbit-center" />
        </div>
      </div>

      {/* ── Morphing Gradient Blob ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="ss2-morph-blob" />
      </div>

      {/* ── Star Field ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="ss2-star"
            style={{
              left: `${(i * 3.37) % 100}%`,
              top: `${(i * 7.13) % 100}%`,
              animationDelay: `${(i * 0.4) % 5}s`,
              animationDuration: `${3 + (i % 3) * 1.5}s`,
            }}
          />
        ))}
      </div>

      {/* ── Diagonal Light Streaks ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="ss2-streak ss2-streak-1" />
        <div className="ss2-streak ss2-streak-2" />
        <div className="ss2-streak ss2-streak-3" />
      </div>

      {/* Noise + vignette */}
      <div className="absolute inset-0 ss-noise opacity-[0.018] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,transparent_20%,#0D1B2A_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2">

          {/* Left Side */}
          <div className="relative px-6 md:px-10 lg:px-12 pt-10 md:pt-14 pb-8 flex flex-col justify-center">
            <ScrollReveal>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-8 text-white">
                8200+ learners already{" "}
                <span className="text-orange-400">wrote their success story</span>
                {" "}with us. Your turn to join{" "}
                <span className="text-orange-400">world-class companies.</span>
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="mb-0">
                <h3 className="text-white/60 font-semibold text-sm uppercase tracking-widest mb-5">Our graduates work at</h3>

                <div className="flex flex-wrap gap-3">
                  {brandLogos.map((logo) => (
                    <div key={logo.name} className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl px-5 py-3.5 flex items-center justify-center hover:bg-white/15 transition-colors">
                      <logo.component />
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Side — Form */}
          <div className="px-6 md:px-10 lg:px-12 py-10 md:py-14 flex items-start lg:items-center justify-center bg-[#0D1B2A]">
            <div className="w-full max-w-md">
              <SSLeadForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════════ */
export default function SuccessStoriesPage() {
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
      <div className="ss2-page">

        {/* ╔══════════════════════════════════════════════════════════════╗
            ║  SECTION 1 — HERO (Cinematic with floating cards)          ║
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

          {/* Floating testimonial pills - desktop only */}
          <div className="hidden lg:block">
            <FloatingPill person={testimonials[4]} className="top-[18%] left-[5%]" delay={2} />
            <FloatingPill person={testimonials[2]} className="top-[25%] right-[4%]" delay={2.5} />
            <FloatingPill person={testimonials[7]} className="bottom-[22%] left-[8%]" delay={3} />
            <FloatingPill person={testimonials[0]} className="bottom-[18%] right-[6%]" delay={3.3} />
          </div>

          {/* Content */}
          <motion.div
            className="relative z-10 text-center max-w-5xl mx-auto px-6"
            style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
          >
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] backdrop-blur-xl mb-6">
                <span className="w-2 h-2 rounded-full bg-orange-500 about-pulse-dot" />
                <span className="text-sm text-gray-300 font-medium">8200+ careers transformed and counting</span>
              </span>
            </motion.div>

            {/* Main heading */}
            <StaggerLines baseDelay={0.3} staggerDelay={0.14} skewY={-5} distance={140}>
              <h1 className="text-4xl md:text-6xl lg:text-[5.5rem] font-black text-white leading-[0.95] tracking-tight">
                They Were You.
              </h1>
              <h1 className="text-4xl md:text-6xl lg:text-[5.5rem] font-black leading-[0.95] tracking-tight">
                <span className="hero-gradient-text">Now They&apos;re Here.</span>
              </h1>
            </StaggerLines>

            {/* Subtitle */}
            <LineMaskReveal delay={1} staggerDelay={0.2} className="mt-6 max-w-2xl mx-auto">
              <p className="text-base md:text-lg text-gray-500 leading-relaxed">
                Real people. Real career transformations.
              </p>
              <p className="text-base md:text-lg text-white/50 leading-relaxed">
                From zero tech background to top companies.
              </p>
            </LineMaskReveal>

            {/* Hero stats row */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 flex items-center justify-center gap-8 md:gap-12 flex-wrap"
            >
              {[
                { value: "8200+", label: "Placed" },
                { value: "85%", label: "Salary Jump" },
                { value: "400+", label: "Partners" },
              ].map((s, i) => (
                <div key={s.label} className="text-center">
                  <span className="text-2xl md:text-3xl font-black text-white">{s.value}</span>
                  <p className="text-[10px] text-white/25 font-medium mt-0.5 tracking-wider uppercase">{s.label}</p>
                </div>
              ))}
            </motion.div>

            {/* Dual CTA */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 flex items-center justify-center gap-4 flex-wrap"
            >
              <a
                href="#stories"
                className="ss-hero-cta group inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl text-white font-semibold text-base transition-all duration-500 hover:-translate-y-0.5"
              >
                Explore Stories
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="transition-transform duration-500 group-hover:translate-y-0.5">
                  <path d="M9 3V15M9 15L4 10M9 15L14 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <a
                href="/#contact"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl border border-white/[0.08] text-white/50 font-medium text-base hover:bg-white/[0.04] hover:text-white/70 transition-all duration-500"
              >
                Start Your Journey
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </motion.div>

          </motion.div>
        </section>

        {/* ╔══════════════════════════════════════════════════════════════╗
            ║  SECTION 3 — ALL STORIES (Bento Grid)                       ║
            ╚══════════════════════════════════════════════════════════════╝ */}
        <section id="stories" className="relative overflow-hidden" style={{ backgroundColor: "#f2f1ee" }}>
          {/* Header */}
          <div className="pt-16 md:pt-20 pb-10 max-w-7xl mx-auto px-6 relative z-10">
            <ScrollReveal>
              <div className="text-center max-w-2xl mx-auto">
                <span className="inline-block py-1.5 px-4 rounded-full bg-orange-100 text-orange-600 font-semibold text-xs mb-5 tracking-widest uppercase">
                  Success Stories
                </span>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-navy-900 leading-tight">
                  They Were Where <span className="text-orange-500">You Are</span> Right Now.
                </h2>
              </div>
            </ScrollReveal>
          </div>

          {/* Cards Grid */}
          <div className="max-w-7xl mx-auto px-6 relative z-10 pb-16 md:pb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {testimonials.map((person) => (
                <BentoStoryCard key={person.name} person={person} />
              ))}
            </div>
          </div>
        </section>

        {/* ╔══════════════════════════════════════════════════════════════╗
            ║  SECTION 4 — IMPACT NUMBERS (Cinematic stat cards)         ║
            ╚══════════════════════════════════════════════════════════════╝ */}
        <section className="relative py-16 md:py-24 bg-[#050a14] overflow-hidden">
          <div className="absolute inset-0 ss-stripe-gradient opacity-30" />
          <div className="absolute inset-0 ss-grid-pattern" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,transparent_20%,#050a14_80%)]" />

          <div className="max-w-6xl mx-auto px-6 relative z-10">
            <ScrollReveal>
              <div className="text-center mb-3">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.05]">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  <span className="text-white/30 text-[11px] font-semibold tracking-[0.2em] uppercase">The Numbers</span>
                </span>
              </div>
            </ScrollReveal>

            <div className="text-center mb-12">
              <CharacterSplit
                className="text-2xl md:text-4xl font-black text-white leading-tight"
                highlightColor="white"
                effect="blur"
                delay={0}
                staggerDelay={0.025}
              >
                Impact that speaks for itself
              </CharacterSplit>
            </div>

            {/* Stat cards grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              {stats.map((stat, i) => (
                <StatCard key={stat.label} stat={stat} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ╔══════════════════════════════════════════════════════════════╗
            ║  SECTION 5 — YOUR JOURNEY (Step-by-step visualization)     ║
            ╚══════════════════════════════════════════════════════════════╝ */}
        <section className="relative py-28 md:py-40 bg-white overflow-hidden">
          <div className="absolute inset-0 about-light-dots opacity-15" />

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            {/* Header */}
            <div className="text-center mb-20">
              <ScrollReveal>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-200/50 mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 about-pulse-dot" />
                  <span className="text-orange-600 text-xs font-semibold tracking-[0.2em] uppercase">How It Works</span>
                </span>
              </ScrollReveal>

              <SpringReveal distance={40} damping={14} delay={0.1}>
                <h2 className="text-3xl md:text-5xl font-black text-navy-900 leading-tight mb-4">
                  Your transformation in four steps
                </h2>
              </SpringReveal>

              <ScrollReveal delay={0.2}>
                <p className="text-gray-400 text-lg max-w-lg mx-auto">
                  A clear, proven path from where you are to where you want to be.
                </p>
              </ScrollReveal>
            </div>

            {/* Journey steps grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
              {journeySteps.map((step, i) => (
                <JourneyStepCard key={step.step} step={step} index={i} />
              ))}
            </div>

            {/* Connecting line - desktop */}
            <div className="hidden lg:block relative -mt-[calc(50%+1rem)] mb-[calc(50%+1rem)] mx-12 pointer-events-none">
              <motion.div
                className="h-[2px] bg-gradient-to-r from-orange-200/40 via-orange-400/40 to-orange-200/40"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformOrigin: "left" }}
              />
            </div>
          </div>
        </section>

        {/* ╔══════════════════════════════════════════════════════════════╗
            ║  SECTION 6 — HIRING PARTNERS (Dark theme with glow)        ║
            ╚══════════════════════════════════════════════════════════════╝ */}
        <section className="relative py-28 md:py-36 bg-[#050a14] overflow-hidden">
          <div className="absolute inset-0 ss-stripe-gradient opacity-15" />
          <div className="absolute inset-0 ss-grid-pattern" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,transparent_20%,#050a14_80%)]" />

          <div className="relative z-10">
            <div className="max-w-6xl mx-auto px-6">
              <ScrollReveal>
                <div className="text-center mb-5">
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.05]">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    <span className="text-white/30 text-xs font-semibold tracking-[0.2em] uppercase">Hiring Partners</span>
                  </span>
                </div>
              </ScrollReveal>

              <div className="text-center mb-4">
                <CharacterSplit
                  className="text-3xl md:text-5xl font-black text-white leading-tight"
                  highlightColor="white"
                  effect="blur"
                  delay={0}
                  staggerDelay={0.025}
                >
                  Where our graduates build careers
                </CharacterSplit>
              </div>

              <ScrollReveal delay={0.2}>
                <p className="text-center text-white/25 text-lg max-w-lg mx-auto mb-16">
                  400+ companies actively recruit from Linkway. Here&apos;s a snapshot.
                </p>
              </ScrollReveal>
            </div>

            <div className="w-full relative">
              <div className="absolute left-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-r from-[#050a14] to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-l from-[#050a14] to-transparent z-10 pointer-events-none" />

              <div className="space-y-4">
                <InfiniteLogoRow items={partnerRow1} direction="left" speed={60} />
                <InfiniteLogoRow items={partnerRow2} direction="right" speed={50} />
                <InfiniteLogoRow items={partnerRow3} direction="left" speed={55} />
              </div>
            </div>
          </div>
        </section>

        {/* ╔══════════════════════════════════════════════════════════════╗
            ║  SECTION 7 — CTA (Lead Capture — same style as home page)  ║
            ╚══════════════════════════════════════════════════════════════╝ */}
        <SuccessStoriesCTA />
      </div>
    </ThemeProvider>
  );
}
