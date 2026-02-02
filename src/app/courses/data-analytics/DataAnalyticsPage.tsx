"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Counter from "@/components/animation/Counter";
import ScrollReveal from "@/components/animation/ScrollReveal";
import ToolLogo from "@/components/ui/ToolLogo";
import { useEnquiryModal } from "@/components/forms/EnquiryModal";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/lib/theme";

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════════
   COLOR SYSTEM — Linkway brand
   ═══════════════════════════════════════════════════════ */

const BRAND_ORANGE = "#F58220";
const BRAND_NAVY = "#0D1B2A";
const ACCENT_BLUE = "#3B82F6";
const ACCENT_CYAN = "#06B6D4";
const DARK_BG = "#0a0e18";

/* ─── Easing ─── */
const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

/* ═══════════════════════════════════════════════════════
   UTILITY COMPONENTS
   ═══════════════════════════════════════════════════════ */

/* Typing animation — inspired by Codecademy */
function TypeWriter({ words, className }: { words: string[]; className?: string }) {
  const [wordIdx, setWordIdx] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[wordIdx];
    const timeout = deleting ? 40 : 80;

    if (!deleting && text === word) {
      const pause = setTimeout(() => setDeleting(true), 2000);
      return () => clearTimeout(pause);
    }
    if (deleting && text === "") {
      setDeleting(false);
      setWordIdx((prev) => (prev + 1) % words.length);
      return;
    }

    const timer = setTimeout(() => {
      setText(deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1));
    }, timeout);
    return () => clearTimeout(timer);
  }, [text, deleting, wordIdx, words]);

  return (
    <span className={className}>
      {text}
      <span className="inline-block w-[3px] h-[1em] ml-1 align-middle animate-pulse" style={{ backgroundColor: BRAND_ORANGE }} />
    </span>
  );
}

/* Magnetic hover */
function Magnetic({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 20 });
  const springY = useSpring(y, { stiffness: 200, damping: 20 });

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: springX, y: springY }}
      onMouseMove={(e) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        x.set((e.clientX - rect.left - rect.width / 2) * 0.12);
        y.set((e.clientY - rect.top - rect.height / 2) * 0.12);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
    >
      {children}
    </motion.div>
  );
}

/* Slide-in from direction — Panorama-inspired */
function SlideIn({ children, direction = "up", delay = 0, className }: { children: React.ReactNode; direction?: "up" | "down" | "left" | "right"; delay?: number; className?: string }) {
  const offsets = { up: { y: 40 }, down: { y: -40 }, left: { x: -50 }, right: { x: 50 } };
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x: 0, y: 0, ...offsets[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.6, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

/* Card with subtle mouse-track glow */
function Card({ children, className, accent = ACCENT_BLUE }: { children: React.ReactNode; className?: string; accent?: string }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);
  const onMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
  }, []);

  return (
    <motion.div
      ref={ref}
      className={cn("relative group rounded-2xl overflow-hidden", className)}
      onMouseMove={onMove}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(350px circle at ${pos.x}px ${pos.y}px, ${accent}14, transparent 60%)` }}
      />
      <div className="absolute inset-0 rounded-2xl border border-gray-200 group-hover:border-gray-300 transition-colors duration-300 pointer-events-none" />
      <div className="relative bg-white rounded-2xl p-6 shadow-[0_1px_8px_rgba(0,0,0,0.04)] group-hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-shadow duration-300">
        {children}
      </div>
    </motion.div>
  );
}

/* Section label pill */
function SectionLabel({ children, center = false, light = false }: { children: React.ReactNode; center?: boolean; light?: boolean }) {
  return (
    <div className={cn("flex items-center gap-3 mb-4", center && "justify-center")}>
      <span className={cn(
        "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-[0.15em] uppercase",
        light ? "bg-white/10 text-white/70 border border-white/10" : "bg-orange-50 border border-orange-100"
      )} style={!light ? { color: BRAND_ORANGE } : undefined}>
        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: light ? "#fff" : BRAND_ORANGE, opacity: light ? 0.5 : 1 }} />
        {children}
      </span>
    </div>
  );
}

/* Stat card — Panorama-inspired */
function StatCard({ value, suffix, label, icon: Icon, delay = 0, accent = BRAND_ORANGE }: { value: number; suffix: string; label: string; icon: React.FC<{ className?: string; style?: React.CSSProperties }>; delay?: number; accent?: string }) {
  return (
    <SlideIn direction="up" delay={delay}>
      <div className="relative bg-white rounded-2xl border border-gray-100 p-6 text-center overflow-hidden group hover:border-gray-200 transition-colors duration-300">
        <div className="absolute top-3 right-3 opacity-[0.06] group-hover:opacity-[0.1] transition-opacity duration-500">
          <Icon className="w-14 h-14" style={{ color: accent }} />
        </div>
        <div className="text-4xl md:text-5xl font-bold mb-1.5" style={{ color: BRAND_NAVY }}>
          <Counter target={value} suffix={suffix} duration={2} />
        </div>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
      </div>
    </SlideIn>
  );
}

/* Horizontal divider line */
function Divider({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className={cn("relative h-px w-full overflow-hidden", className)}>
      <motion.div
        className="absolute inset-0"
        style={{ background: `linear-gradient(90deg, transparent, ${BRAND_ORANGE}30, ${ACCENT_BLUE}30, transparent)` }}
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.2, ease }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   TESTIMONIAL CAROUSEL — Premium 3D tilt glassmorphism
   ═══════════════════════════════════════════════════════ */
const learnerTestimonials = [
  { name: "Rehan Siddiqui", from: "Non-Tech", to: "Data Analyst", company: "Amazon", exp: "1.5 yrs exp.", accentFrom: "#10b981", accentTo: "#34d399", gradientBg: "linear-gradient(135deg, #ecfdf5, #d1fae5 40%, #ffffff)", desc: "I had zero tech background. Linkway taught me Tableau, Power BI, and how to actually think with data. Now I'm at Amazon solving real business problems every day." },
  { name: "Junaid Khan", from: "Banking Ops", to: "Business Analyst", company: "Razorpay", exp: "2 yrs exp.", accentFrom: "#eab308", accentTo: "#facc15", gradientBg: "linear-gradient(135deg, #fefce8, #fef9c3 40%, #ffffff)", desc: "I was stuck in banking ops with no clear growth path. Six months later, I'm a business analyst at Razorpay working on things that actually excite me." },
  { name: "Shivani Rawat", from: "Operations", to: "Business Analyst", company: "Booking.com", exp: "2 yrs exp.", accentFrom: "#0ea5e9", accentTo: "#38bdf8", gradientBg: "linear-gradient(135deg, #f0f9ff, #bae6fd 40%, #ffffff)", desc: "Operations felt like a dead end. The program gave me the technical skills I was missing, and now I'm doing requirement analysis at Booking.com." },
  { name: "Vansh Pathak", from: "Accounting", to: "Reporting Analyst", company: "Accenture", exp: "1 yr exp.", accentFrom: "#f43f5e", accentTo: "#fb7185", gradientBg: "linear-gradient(135deg, #fff1f2, #fecdd3 40%, #ffffff)", desc: "Went from crunching numbers in spreadsheets to building actual reports with SQL at Accenture. The mentors made the jump doable." },
  { name: "Aditya Srivastava", from: "Full-Stack Dev", to: "Data Scientist", company: "Globussoft", exp: "3 yrs exp.", accentFrom: "#8b5cf6", accentTo: "#a78bfa", gradientBg: "linear-gradient(135deg, #f5f3ff, #ddd6fe 40%, #ffffff)", desc: "I could code, but I didn't know ML. Linkway filled that gap with real projects — computer vision, forecasting, the works." },
  { name: "Priya Mehta", from: "Graphic Designer", to: "Data Scientist", company: "Meesho", exp: "2 yrs exp.", accentFrom: "#f97316", accentTo: "#fb923c", gradientBg: "linear-gradient(135deg, #fff7ed, #fed7aa 40%, #ffffff)", desc: "From design to data, Linkway taught me how to think analytically. I learned Python, ML, and dashboarding. My fashion image classification project clicked with Meesho." },
];

function TestimonialCard3D({ t, index }: { t: typeof learnerTestimonials[number]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const smoothX = useSpring(rotateX, { stiffness: 150, damping: 20 });
  const smoothY = useSpring(rotateY, { stiffness: 150, damping: 20 });
  const glowX = useMotionValue(50);
  const glowY = useMotionValue(50);

  const handleMouse = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    rotateX.set((py - 0.5) * -10);
    rotateY.set((px - 0.5) * 10);
    glowX.set(px * 100);
    glowY.set(py * 100);
  }, [rotateX, rotateY, glowX, glowY]);

  return (
    <motion.div
      ref={cardRef}
      className="shrink-0 w-[340px] md:w-[400px]"
      style={{ perspective: 1200 }}
      onMouseMove={handleMouse}
      onMouseLeave={() => { rotateX.set(0); rotateY.set(0); glowX.set(50); glowY.set(50); }}
    >
      <motion.div
        className="relative h-full rounded-3xl overflow-hidden border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:shadow-[0_24px_64px_rgba(0,0,0,0.15)] transition-shadow duration-700"
        style={{ rotateX: smoothX, rotateY: smoothY, transformStyle: "preserve-3d", background: t.gradientBg }}
      >
        {/* Floating orb top-right */}
        <motion.div
          className="absolute -top-10 -right-10 w-36 h-36 rounded-full blur-3xl pointer-events-none"
          style={{ backgroundColor: t.accentFrom, opacity: 0.12 }}
          animate={{ scale: [1, 1.3, 1], x: [0, 8, 0], y: [0, -5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: index * 0.4 }}
        />
        {/* Floating orb bottom-left */}
        <motion.div
          className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full blur-3xl pointer-events-none"
          style={{ backgroundColor: t.accentTo, opacity: 0.1 }}
          animate={{ scale: [1.2, 0.9, 1.2], x: [0, -6, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: index * 0.6 }}
        />

        {/* 3D pushed content */}
        <div className="relative p-7 pb-6" style={{ transform: "translateZ(40px)" }}>
          {/* Large SVG quote watermark */}
          <svg className="absolute top-2 right-4 w-20 h-20 pointer-events-none" viewBox="0 0 64 64" fill="none">
            <path d="M20 34c0-6.627 5.373-12 12-12v-6c-9.941 0-18 8.059-18 18v12h18V34H20zm24 0c0-6.627 5.373-12 12-12v-6c-9.941 0-18 8.059-18 18v12h18V34H44z" fill={t.accentFrom} opacity="0.06" />
          </svg>

          {/* Experience badge */}
          <div className="flex items-center gap-3 mb-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase backdrop-blur-md" style={{ backgroundColor: `${t.accentFrom}10`, color: t.accentFrom, border: `1.5px solid ${t.accentFrom}20`, boxShadow: `0 0 12px ${t.accentFrom}08` }}>
              <motion.span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: t.accentFrom }} animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }} transition={{ duration: 2, repeat: Infinity }} />
              {t.exp}
            </span>
            <motion.div className="flex-1 h-[1.5px] rounded-full origin-left" style={{ background: `linear-gradient(90deg, ${t.accentFrom}35, ${t.accentTo}15, transparent)` }} initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.3 }} />
          </div>

          {/* Testimonial text */}
          <p className="text-[14px] text-gray-700 leading-[1.8] mb-7 relative z-10 font-[450]">
            &ldquo;{t.desc}&rdquo;
          </p>

          {/* Gradient divider */}
          <div className="h-[1.5px] mb-5 rounded-full" style={{ background: `linear-gradient(90deg, ${t.accentFrom}20, ${t.accentTo}12, transparent)` }} />

          {/* Author row with spinning ring avatar */}
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <motion.div className="absolute -inset-[2.5px] rounded-full" style={{ background: `conic-gradient(from 0deg, ${t.accentFrom}, ${t.accentTo}, transparent, ${t.accentFrom})` }} animate={{ rotate: 360 }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }} />
              <div className="relative w-11 h-11 rounded-full flex items-center justify-center text-[13px] font-bold text-white shadow-lg" style={{ background: `linear-gradient(135deg, ${t.accentFrom}, ${t.accentTo})` }}>
                {t.name.split(" ").map(n => n[0]).join("")}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-gray-900 text-[15px] leading-tight truncate">{t.name}</h4>
              <p className="text-[11.5px] text-gray-500 mt-0.5 font-medium">
                {t.from} <motion.span className="inline-block" style={{ color: t.accentFrom }} animate={{ x: [0, 3, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>&rarr;</motion.span> {t.to}, <span className="font-semibold text-gray-600">{t.company}</span>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function TestimonialCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    requestAnimationFrame(() => {
      const oneSetWidth = track.scrollWidth / 2;
      tweenRef.current = gsap.fromTo(track, { x: 0 }, { x: -oneSetWidth, duration: 50, ease: "none", repeat: -1 });
    });
    return () => { tweenRef.current?.kill(); };
  }, []);

  return (
    <div className="mt-16 relative" onMouseEnter={() => tweenRef.current?.pause()} onMouseLeave={() => tweenRef.current?.resume()}>
      {/* Gradient fades matching parent bg */}
      <div className="absolute left-0 top-0 bottom-0 w-16 md:w-44 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, #f9fafb, transparent)' }} />
      <div className="absolute right-0 top-0 bottom-0 w-16 md:w-44 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, #f9fafb, transparent)' }} />

      <div className="overflow-hidden py-6">
        <div ref={trackRef} className="flex gap-7 w-max" style={{ willChange: "transform" }}>
          {[...learnerTestimonials, ...learnerTestimonials].map((t, i) => (
            <TestimonialCard3D key={`${t.name}-${i}`} t={t} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* SVG wave section divider — Clever-inspired */
function WaveDivider({ flip = false, from = "#f9fafb", to = "#ffffff" }: { flip?: boolean; from?: string; to?: string }) {
  return (
    <div className={cn("w-full overflow-hidden leading-[0]", flip && "rotate-180")} style={{ backgroundColor: from }}>
      <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-[40px] md:h-[60px]">
        <path d="M0,30 C360,60 720,0 1080,30 C1260,45 1380,35 1440,30 L1440,60 L0,60 Z" fill={to} />
      </svg>
    </div>
  );
}

/* Journey Phase Card — interactive expandable card with code preview */
function JourneyPhaseCard({ mod, index, isOpen, onToggle, codeLines }: {
  mod: { phase: string; title: string; duration: string; color: string; topics: string[]; skills: string[] };
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  codeLines: { text: string; color: string }[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-5%" });

  return (
    <motion.div
      ref={ref}
      className="relative"
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* Main card */}
      <div
        className={cn(
          "relative rounded-2xl border overflow-hidden transition-all duration-500 cursor-pointer",
          isOpen
            ? "bg-white shadow-[0_12px_40px_rgba(0,0,0,0.08)] border-gray-200"
            : "bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] border-gray-100 hover:border-gray-200 hover:shadow-[0_6px_20px_rgba(0,0,0,0.06)]"
        )}
        onClick={onToggle}
      >
        {/* Top accent bar */}
        <motion.div
          className="h-1 w-full"
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8, delay: index * 0.15 + 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          style={{ transformOrigin: "left", backgroundColor: mod.color }}
        />

        {/* Header */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Animated phase number */}
            <div className="relative">
              <motion.div
                className="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg font-mono text-white"
                style={{ backgroundColor: mod.color }}
                whileHover={{ scale: 1.08, rotate: -3 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                {mod.phase}
              </motion.div>
              {/* Glow behind */}
              <div className="absolute inset-0 rounded-2xl blur-lg opacity-30" style={{ backgroundColor: mod.color }} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-navy-900">{mod.title}</h3>
              <p className="text-sm text-gray-400 font-mono mt-0.5">{mod.duration}</p>
            </div>
          </div>

          {/* Expand indicator */}
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center shrink-0"
          >
            <ChevronIcon className="w-4 h-4 text-gray-400" />
          </motion.div>
        </div>

        {/* Skill tags — always visible */}
        <div className="px-6 pb-4 flex flex-wrap gap-1.5">
          {mod.skills.map((skill, j) => (
            <motion.span
              key={skill}
              className="px-2.5 py-1 rounded-lg text-xs font-medium border"
              style={{ color: mod.color, borderColor: `${mod.color}25`, backgroundColor: `${mod.color}08` }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.3, delay: index * 0.15 + 0.4 + j * 0.05 }}
            >
              {skill}
            </motion.span>
          ))}
        </div>

        {/* Expandable content */}
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6">
                <div className="h-px bg-gray-100 mb-5" />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {/* Topics */}
                  <div className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">What you&apos;ll learn</p>
                    {mod.topics.map((topic, j) => (
                      <motion.div
                        key={j}
                        className="flex items-start gap-3 p-3.5 rounded-xl bg-gray-50 border border-gray-100"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: j * 0.08 }}
                      >
                        <CheckCircleIcon className="w-4 h-4 mt-0.5 shrink-0" style={{ color: mod.color }} />
                        <span className="text-sm text-gray-700 leading-relaxed">{topic}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Mini code preview */}
                  <motion.div
                    className="rounded-xl overflow-hidden border border-gray-200"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.15 }}
                  >
                    <div className="flex items-center gap-1.5 px-3 py-2 bg-[#1a1e2e] border-b border-white/[0.06]">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                      <span className="text-[10px] font-mono text-gray-500 ml-2">preview</span>
                    </div>
                    <div className="bg-[#0d1117] p-4 font-mono text-[12px] leading-[1.8]">
                      {codeLines.map((line, j) => (
                        <motion.div
                          key={j}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.2, delay: 0.2 + j * 0.06 }}
                          className="whitespace-pre"
                          style={{ color: line.color }}
                        >
                          {line.text}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* FAQ Item */
function FAQItem({ question, answer, isOpen, onClick, index }: { question: string; answer: string; isOpen: boolean; onClick: () => void; index: number }) {
  return (
    <motion.div
      className="border-b border-gray-200 last:border-b-0"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
    >
      <button onClick={onClick} className="flex items-center justify-between w-full py-5 text-left group cursor-pointer">
        <span className="text-base md:text-lg font-medium text-navy-900 group-hover:text-orange-500 transition-colors pr-4">{question}</span>
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
          <ChevronIcon className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-gray-600 leading-relaxed text-[15px]">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Animated Terminal ─── */
function Terminal({ title, lines, className }: { title: string; lines: { text: string; color?: string; delay?: number }[]; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (visibleLines >= lines.length) return;
    const delay = lines[visibleLines]?.delay ?? 120;
    const timer = setTimeout(() => setVisibleLines((v) => v + 1), delay);
    return () => clearTimeout(timer);
  }, [inView, visibleLines, lines]);

  return (
    <div ref={ref} className={cn("rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl", className)}>
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-[#1a1e2e] border-b border-white/[0.06]">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <span className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>
        <span className="text-xs font-mono text-gray-500 ml-2">{title}</span>
      </div>
      {/* Code area */}
      <div className="bg-[#0d1117] p-5 font-mono text-[13px] leading-[1.7] min-h-[200px] overflow-hidden">
        {lines.slice(0, visibleLines).map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.15 }}
            className="whitespace-pre"
            style={{ color: line.color || "#e6edf3" }}
          >
            {line.text}
          </motion.div>
        ))}
        {visibleLines < lines.length && (
          <span className="inline-block w-2 h-4 bg-green-400 animate-pulse ml-0.5" />
        )}
      </div>
    </div>
  );
}

/* ─── Hero Image Carousel ─── */
const heroImages = [
  "/images/1.png",
  "/images/2.png",
  "/images/3.png",
  "/images/4.png",
  "/images/5.png",
];

function HeroImageCarousel({ className }: { className?: string }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroImages.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={cn("relative rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl aspect-[4/3]", className)}>
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <Image
            src={heroImages[current]}
            alt="Data Analytics professional"
            fill
            className="object-cover"
            priority={current === 0}
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </motion.div>
      </AnimatePresence>
      {/* Dot indicators */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {heroImages.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              i === current ? "bg-orange-500 w-5" : "bg-white/40 hover:bg-white/60"
            )}
          />
        ))}
      </div>
      {/* Bottom gradient overlay for dots visibility */}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
    </div>
  );
}


/* Infinite scrolling tool marquee — modern touch */
function ToolMarquee({ tools }: { tools: string[] }) {
  const doubled = [...tools, ...tools];
  return (
    <div className="relative overflow-hidden py-2">
      <div className="absolute left-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-r from-white to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-l from-white to-transparent pointer-events-none" />
      <motion.div
        className="flex gap-4 w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 30, ease: "linear", repeat: Infinity }}
      >
        {doubled.map((tool, i) => (
          <div key={`${tool}-${i}`} className="shrink-0">
            <ToolLogo name={tool} />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* ─── SVG Icons ─── */

function ArrowRightIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>;
}
function UserIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M20 21a8 8 0 10-16 0" /></svg>;
}
function BriefcaseIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" /></svg>;
}
function GraduationIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10l-10-5L2 10l10 5 10-5z" /><path d="M6 12v5c0 2 3 3 6 3s6-1 6-3v-5" /><path d="M22 10v6" /></svg>;
}
function RocketIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z" /><path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" /></svg>;
}
function TargetIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>;
}
function CheckCircleIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="9 12 11 14 15 10" /></svg>;
}
function ShieldIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" /></svg>;
}
function CurrencyIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>;
}
function SparklesIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L13.09 8.26L18 6L14.74 10.91L21 12L14.74 13.09L18 18L13.09 15.74L12 22L10.91 15.74L6 18L9.26 13.09L3 12L9.26 10.91L6 6L10.91 8.26L12 2Z" /></svg>;
}
function ChevronIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>;
}
function LayersIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>;
}
function ClockIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
}

/* ═══════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════ */

export default function DataAnalyticsPage() {
  const { openEnquiry } = useEnquiryModal();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  const [openFaq, setOpenFaq] = useState(0);
  const [activeTab, setActiveTab] = useState(0);

  /* ── Data ── */
  const personas = [
    { icon: UserIcon, title: "Career Switchers", desc: "Coming from a non-tech background? That's exactly who this was built for. We start from scratch.", color: BRAND_ORANGE },
    { icon: GraduationIcon, title: "Fresh Graduates", desc: "College didn't teach you what companies actually need. This will. No coding required.", color: ACCENT_BLUE },
    { icon: BriefcaseIcon, title: "Working Professionals", desc: "Learn without quitting your job. Weekend batches, flexible deadlines, all classes recorded.", color: ACCENT_CYAN },
    { icon: RocketIcon, title: "Entrepreneurs", desc: "Stop guessing and start knowing. Read your own numbers and make smarter business calls.", color: BRAND_ORANGE },
  ];

  const curriculum = [
    { phase: "01", title: "Foundations", duration: "Weeks 1–8", color: BRAND_ORANGE, skills: ["Excel", "Tableau", "Power BI", "Python", "R"], topics: [
      "Excel for Analytics — functions, charts, dashboards, forecasting models",
      "Tableau & Power BI — interactive dashboards, storyboards, business reports",
      "Python & R Programming — basics, data structures, functions, libraries",
    ], code: [
      { text: "# Excel-style analysis in Python", color: "#8b949e" },
      { text: "import pandas as pd", color: "#79c0ff" },
      { text: "", color: "#e6edf3" },
      { text: 'df = pd.read_csv("sales.csv")', color: "#e6edf3" },
      { text: "pivot = df.pivot_table(", color: "#e6edf3" },
      { text: "  values='revenue',", color: "#e6edf3" },
      { text: "  index='region',", color: "#e6edf3" },
      { text: "  aggfunc='sum'", color: "#e6edf3" },
      { text: ")", color: "#e6edf3" },
      { text: ">>> ₹12.4Cr total revenue", color: "#7ee787" },
    ]},
    { phase: "02", title: "Core Analysis", duration: "Weeks 9–16", color: ACCENT_BLUE, skills: ["NumPy", "Pandas", "Matplotlib", "Seaborn", "Statistics"], topics: [
      "Statistics & Hypothesis Testing — descriptive, probability, inferential, ANOVA",
      "Data Analysis & Visualization — NumPy, Pandas, Matplotlib, Seaborn",
      "Data Cleaning & Feature Engineering — missing values, outliers, encoding",
    ], code: [
      { text: "# Statistical hypothesis test", color: "#8b949e" },
      { text: "from scipy import stats", color: "#79c0ff" },
      { text: "", color: "#e6edf3" },
      { text: "t_stat, p_value = stats.ttest_ind(", color: "#e6edf3" },
      { text: "  group_a, group_b", color: "#e6edf3" },
      { text: ")", color: "#e6edf3" },
      { text: 'print(f"p-value: {p_value:.4f}")', color: "#e6edf3" },
      { text: ">>> p-value: 0.0023", color: "#7ee787" },
      { text: ">>> Result: Statistically significant", color: "#7ee787" },
    ]},
    { phase: "03", title: "Machine Learning", duration: "Weeks 17–24", color: ACCENT_CYAN, skills: ["Scikit-learn", "PySpark", "MySQL", "ARIMA", "Clustering"], topics: [
      "Supervised Learning — regression, classification, decision trees, random forests",
      "Unsupervised Learning — K-means, hierarchical clustering, PCA",
      "Time Series & Big Data — ARIMA, SARIMA, MySQL, Spark, PySpark",
    ], code: [
      { text: "# Train a prediction model", color: "#8b949e" },
      { text: "from sklearn.ensemble import RandomForestClassifier", color: "#79c0ff" },
      { text: "", color: "#e6edf3" },
      { text: "model = RandomForestClassifier(n_estimators=100)", color: "#e6edf3" },
      { text: "model.fit(X_train, y_train)", color: "#e6edf3" },
      { text: "score = model.score(X_test, y_test)", color: "#e6edf3" },
      { text: "", color: "#e6edf3" },
      { text: 'print(f"Accuracy: {score:.1%}")', color: "#e6edf3" },
      { text: ">>> Accuracy: 94.2%", color: "#7ee787" },
    ]},
  ];

  const tools = ["Excel", "MySQL", "Tableau", "Power BI", "Python", "R", "NumPy", "Pandas", "Matplotlib", "Seaborn", "Jupyter", "Google Colab", "Scikit-learn", "Git", "SQL", "PySpark", "Statsmodels", "SciPy", "TensorFlow", "Keras", "Apache Spark", "MongoDB", "PostgreSQL", "Looker", "dbt", "Airflow", "BigQuery", "Snowflake", "Hadoop", "Docker"];

  const projects = [
    { title: "Sales Performance Dashboard", desc: "Interactive Excel + Power BI dashboard analyzing multi-channel sales data with forecasting.", tags: ["Excel", "Power BI", "SQL"], color: BRAND_ORANGE },
    { title: "Customer Segmentation Analysis", desc: "Use Python + Tableau to segment e-commerce customers by behavior, value, and demographics.", tags: ["Python", "Tableau", "Pandas"], color: ACCENT_BLUE },
    { title: "Predictive Analytics Model", desc: "Build a Scikit-learn model to predict customer churn using real telecom industry data.", tags: ["Python", "Scikit-learn", "NumPy"], color: ACCENT_CYAN },
    { title: "End-to-End Data Pipeline", desc: "Complete pipeline from SQL data extraction through Python cleaning to visual dashboard output.", tags: ["SQL", "Python", "Tableau"], color: BRAND_ORANGE },
  ];

  const roles = [
    { title: "Data Analyst", range: "6–10 LPA" },
    { title: "Business Analyst", range: "7–12 LPA" },
    { title: "BI Analyst", range: "6–10 LPA" },
    { title: "Data Engineer", range: "8–15 LPA" },
    { title: "Database Administrator", range: "6–12 LPA" },
    { title: "Analytics Consultant", range: "8–14 LPA" },
  ];

  const faqs = [
    { question: "Do I need to know coding?", answer: "Nope. We start from the basics — Excel, then SQL, then Python. Everything is taught step by step with exercises, so you're never lost." },
    { question: "What's the schedule like?", answer: "Both weekday and weekend batches are available. Everything is live with a real instructor, and every session gets recorded in case you miss one." },
    { question: "How does placement assistance work?", answer: "Finish the assignments and projects, and we guarantee up to 10 interviews with companies from our hiring network. We don't stop until you're placed." },
    { question: "Can I pay in EMIs?", answer: "Yes — 0% interest EMI starting at ₹5,500/month. We want cost to be the last thing holding you back." },
    { question: "What certifications do I get?", answer: "A Linkway Learning completion certificate plus prep for the Microsoft Azure AI Fundamentals certification exam." },
  ];

  const highlights = [
    { icon: ShieldIcon, label: "Placement Guarantee", sub: "Up to 10 interviews", color: BRAND_ORANGE },
    { icon: CurrencyIcon, label: "0% EMI Available", sub: "Starting ₹5,500/mo", color: ACCENT_BLUE },
    { icon: SparklesIcon, label: "Azure AI Certification", sub: "Exam prep included", color: ACCENT_CYAN },
    { icon: ClockIcon, label: "Flexible Schedule", sub: "Weekday & weekend batches", color: BRAND_ORANGE },
  ];

  return (
    <ThemeProvider theme="light">
    <div className="min-h-screen bg-white text-navy-900 selection:bg-orange-500/20 overflow-x-hidden">

      {/* ═══════ HERO — Dark section ═══════ */}
      <section ref={heroRef} className="relative min-h-[88vh] flex items-center overflow-hidden" style={{ backgroundColor: DARK_BG }}>
        {/* Decorative gradient orbs */}
        <div className="absolute inset-0" style={{
          background: `
            radial-gradient(ellipse 60% 45% at 20% 25%, ${BRAND_ORANGE}12 0%, transparent 55%),
            radial-gradient(ellipse 45% 35% at 80% 65%, ${ACCENT_BLUE}0c 0%, transparent 50%),
            linear-gradient(180deg, ${DARK_BG} 0%, #0c1220 50%, ${DARK_BG} 100%)
          `
        }} />
        <motion.div
          className="absolute w-[600px] h-[600px] -top-48 -right-48 rounded-full blur-[120px] pointer-events-none"
          animate={{ scale: [1, 1.12, 1], opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          style={{ background: `radial-gradient(circle, ${ACCENT_BLUE}20, transparent 70%)` }}
        />

        {/* ── Animated background elements ── */}

        {/* Floating code fragments */}
        {[
          { text: "df.head()", x: "8%", y: "15%", dur: 18, delay: 0 },
          { text: "SELECT *", x: "85%", y: "22%", dur: 22, delay: 2 },
          { text: "import pandas", x: "72%", y: "75%", dur: 20, delay: 4 },
          { text: ".groupby()", x: "15%", y: "70%", dur: 24, delay: 1 },
          { text: "plt.show()", x: "55%", y: "12%", dur: 19, delay: 3 },
          { text: "model.fit()", x: "90%", y: "55%", dur: 21, delay: 5 },
          { text: "np.array()", x: "30%", y: "85%", dur: 23, delay: 2 },
          { text: "accuracy: 94%", x: "45%", y: "90%", dur: 17, delay: 6 },
        ].map((frag, i) => (
          <motion.span
            key={i}
            className="absolute font-mono text-[11px] pointer-events-none select-none"
            style={{ left: frag.x, top: frag.y, color: `${ACCENT_BLUE}18` }}
            animate={{
              y: [0, -15, 0, 10, 0],
              x: [0, 8, -5, 3, 0],
              opacity: [0.15, 0.3, 0.15, 0.25, 0.15],
            }}
            transition={{ duration: frag.dur, repeat: Infinity, delay: frag.delay, ease: "easeInOut" }}
          >
            {frag.text}
          </motion.span>
        ))}

        {/* Animated grid dots */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <svg className="w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dotGrid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <circle cx="30" cy="30" r="1" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dotGrid)" />
          </svg>
        </div>

        {/* Animated data flow lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="flowGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={BRAND_ORANGE} stopOpacity="0" />
              <stop offset="50%" stopColor={BRAND_ORANGE} stopOpacity="0.12" />
              <stop offset="100%" stopColor={BRAND_ORANGE} stopOpacity="0" />
            </linearGradient>
            <linearGradient id="flowGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={ACCENT_BLUE} stopOpacity="0" />
              <stop offset="50%" stopColor={ACCENT_BLUE} stopOpacity="0.08" />
              <stop offset="100%" stopColor={ACCENT_BLUE} stopOpacity="0" />
            </linearGradient>
            <linearGradient id="flowGrad3" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={ACCENT_CYAN} stopOpacity="0" />
              <stop offset="50%" stopColor={ACCENT_CYAN} stopOpacity="0.06" />
              <stop offset="100%" stopColor={ACCENT_CYAN} stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Flowing curve 1 */}
          <motion.path
            d="M-100,200 C200,100 400,350 700,180 S1100,300 1500,150"
            fill="none"
            stroke="url(#flowGrad1)"
            strokeWidth="1.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 3, delay: 0.5, ease: "easeInOut" }}
          />
          {/* Flowing curve 2 */}
          <motion.path
            d="M-50,400 C250,300 500,500 800,350 S1200,450 1500,380"
            fill="none"
            stroke="url(#flowGrad2)"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 3.5, delay: 1, ease: "easeInOut" }}
          />
          {/* Flowing curve 3 */}
          <motion.path
            d="M-80,550 C180,480 420,600 720,500 S1050,580 1500,520"
            fill="none"
            stroke="url(#flowGrad3)"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 4, delay: 1.5, ease: "easeInOut" }}
          />
          {/* Animated pulse dots traveling along curves */}
          <motion.circle
            r="3"
            fill={BRAND_ORANGE}
            opacity="0.4"
            animate={{
              cx: [0, 350, 700, 1100, 1500],
              cy: [200, 150, 250, 200, 150],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
          <motion.circle
            r="2.5"
            fill={ACCENT_BLUE}
            opacity="0.3"
            animate={{
              cx: [0, 400, 800, 1200, 1500],
              cy: [400, 350, 450, 380, 380],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear", delay: 2 }}
          />
          <motion.circle
            r="2"
            fill={ACCENT_CYAN}
            opacity="0.25"
            animate={{
              cx: [0, 300, 600, 1000, 1500],
              cy: [550, 500, 560, 520, 520],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear", delay: 3 }}
          />
        </svg>

        <div className="noise-overlay absolute inset-0 pointer-events-none opacity-[0.02]" />

        <motion.div className="relative z-10 max-w-6xl mx-auto px-6 w-full" style={{ opacity: heroOpacity, y: heroY }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-24 lg:py-0">
            {/* Left: Text */}
            <div>
              <motion.div className="flex items-center gap-2 mb-6 flex-wrap" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono tracking-wide border border-white/[0.1] bg-white/[0.04] text-gray-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  Now Enrolling
                </span>
                <span className="px-3 py-1.5 rounded-full text-xs font-mono tracking-wide border border-white/[0.1] bg-white/[0.04] text-gray-400">6 Months</span>
              </motion.div>

              <motion.h1
                className="text-5xl sm:text-6xl lg:text-[4.5rem] font-bold leading-[1.05] tracking-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15, ease }}
              >
                <span className="text-white">Become a</span><br />
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${BRAND_ORANGE}, #f59e0b)` }}>
                  Data Analyst
                </span>
              </motion.h1>

              {/* Typing animation — Codecademy-inspired */}
              <motion.div
                className="mt-5 h-8 flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <span className="text-gray-500 text-base">Master</span>
                <TypeWriter
                  words={["Excel & Power BI", "SQL & Python", "Tableau & Seaborn", "Machine Learning", "Data Storytelling"]}
                  className="text-base font-mono font-semibold text-white"
                />
              </motion.div>

              <motion.p className="mt-5 text-base md:text-lg text-gray-400 leading-relaxed max-w-lg" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35 }}>
                Go from spreadsheets to strategic thinking in 6 months. Real tools, real projects, real placement support.
              </motion.p>

              <motion.div className="mt-8 flex flex-wrap items-center gap-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.55 }}>
                <Magnetic>
                  <motion.button onClick={openEnquiry} className="group relative px-7 py-3.5 rounded-xl font-semibold text-sm overflow-hidden cursor-pointer" style={{ backgroundColor: BRAND_ORANGE }} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <span className="relative z-10 flex items-center gap-2 text-white">Start Learning <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
                  </motion.button>
                </Magnetic>
                <Magnetic>
                  <motion.button onClick={openEnquiry} className="px-7 py-3.5 rounded-xl font-semibold text-sm border border-white/[0.12] text-white/80 hover:text-white hover:border-white/25 hover:bg-white/[0.04] transition-all duration-300 cursor-pointer" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    Download Syllabus
                  </motion.button>
                </Magnetic>
              </motion.div>
            </div>

            {/* Right: Animated Image Carousel */}
            <motion.div className="relative hidden lg:block" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.4, ease }}>
              <HeroImageCarousel />
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-12 rounded-full blur-3xl" style={{ background: `${ACCENT_BLUE}15` }} />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Mobile image carousel */}
      <div className="lg:hidden relative" style={{ backgroundColor: DARK_BG }}>
        <div className="px-6 pb-10">
          <HeroImageCarousel />
        </div>
      </div>

      {/* ═══════ HIGHLIGHTS BAR — Cambly-inspired alternating colored strip ═══════ */}
      <section className="relative py-5 px-6" style={{ backgroundColor: BRAND_NAVY }}>
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {highlights.map((h, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-3 py-2"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <h.icon className="w-5 h-5 shrink-0" style={{ color: h.color }} />
              <div>
                <p className="text-sm font-semibold text-white">{h.label}</p>
                <p className="text-xs text-white/50">{h.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>


      {/* ═══════ WHO IS THIS FOR — Interactive spotlight reveal ═══════ */}
      <section className="relative py-24 px-6 bg-[#0a0e18] overflow-hidden">
        {/* Animated background grid */}
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />
        {/* Floating gradient orbs */}
        <motion.div
          className="absolute top-20 -left-32 w-[400px] h-[400px] rounded-full blur-[120px]"
          style={{ background: `radial-gradient(circle, ${BRAND_ORANGE}30, transparent 70%)` }}
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-10 -right-32 w-[350px] h-[350px] rounded-full blur-[120px]"
          style={{ background: `radial-gradient(circle, ${ACCENT_BLUE}25, transparent 70%)` }}
          animate={{ x: [0, -30, 0], y: [0, 25, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative max-w-6xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <SectionLabel center light>Built For</SectionLabel>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Is This{" "}
                <motion.span
                  className="relative inline-block"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3, type: "spring", stiffness: 200 }}
                >
                  <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${BRAND_ORANGE}, #FF6B6B, ${ACCENT_BLUE})` }}>You</span>
                  <motion.span
                    className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full"
                    style={{ background: `linear-gradient(90deg, ${BRAND_ORANGE}, ${ACCENT_BLUE})` }}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  />
                </motion.span>
                ?
              </h2>
              <motion.p
                className="mt-4 text-gray-400 text-lg max-w-md mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Designed for people who want real skills, not just another certificate.
              </motion.p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {personas.map((p, i) => (
              <motion.div
                key={i}
                className="group relative"
                initial={{ opacity: 0, y: 60, rotateX: 15 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: "-5%" }}
                transition={{ duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Glow border on hover */}
                <div
                  className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[1px]"
                  style={{ background: `linear-gradient(135deg, ${p.color}60, transparent 50%, ${p.color}30)` }}
                />
                <div className="relative bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-7 group-hover:bg-white/[0.07] transition-all duration-500">
                  {/* Spotlight follow effect */}
                  <div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: `radial-gradient(300px circle at 50% 50%, ${p.color}08, transparent 60%)` }}
                  />

                  <div className="relative flex items-start gap-5">
                    {/* Animated icon container */}
                    <motion.div
                      className="relative w-14 h-14 rounded-xl flex items-center justify-center shrink-0 overflow-hidden"
                      style={{ backgroundColor: `${p.color}15` }}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    >
                      {/* Shimmer effect */}
                      <motion.div
                        className="absolute inset-0"
                        style={{ background: `linear-gradient(105deg, transparent 40%, ${p.color}20 50%, transparent 60%)` }}
                        animate={{ x: ["-100%", "200%"] }}
                        transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
                      />
                      <p.icon className="relative w-6 h-6" style={{ color: p.color }} />
                    </motion.div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-bold text-white">{p.title}</h3>
                        <motion.div
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: p.color }}
                          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
                        />
                      </div>
                      <p className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">{p.desc}</p>
                    </div>

                    {/* Arrow indicator */}
                    <motion.div
                      className="shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M7 4l6 6-6 6" stroke={p.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ WHY CHOOSE LINKWAY LEARNING ═══════ */}
      <section className="relative py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <SectionLabel center>Why Us</SectionLabel>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy-900 leading-tight text-center">
              Why Choose{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${BRAND_ORANGE}, ${ACCENT_BLUE})` }}>Linkway Learning</span>?
            </h2>
            <p className="mt-3 text-gray-500 text-base max-w-xl mx-auto text-center">
              Upskilling from Linkway gives you an unfair advantage by placing you ahead of the curve.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
            {[
              { icon: SparklesIcon, title: "AI-First Curriculum", desc: "Specially designed curriculum keeping AI in focus to boost efficiency, and inculcate deep subject understanding.", color: BRAND_ORANGE },
              { icon: UserIcon, title: "Real-World Interviews", desc: "On demand mock interviews with actual tech company hiring managers to prepare you for the toughest questions.", color: ACCENT_BLUE },
              { icon: LayersIcon, title: "Industry Vetted Curriculum", desc: "Targeted training for Data Analysis, Statistics, and AI models at the standards expected by top tech giants.", color: ACCENT_CYAN },
              { icon: GraduationIcon, title: "Expert Mentors & Instructorship", desc: "Get trained by industry experts from top tech companies globally, tailored to your career goals.", color: BRAND_ORANGE },
              { icon: TargetIcon, title: "360° Career Support", desc: "From technical skills to salary negotiation — we guide you every step, with 400+ recruiter connections.", color: ACCENT_BLUE },
              { icon: ShieldIcon, title: "Small Batches, Better Learning", desc: "Learn in a limited batch size for focused preparation & understanding with personalised attention.", color: ACCENT_CYAN },
            ].map((item, i) => (
              <SlideIn key={i} direction="up" delay={i * 0.08}>
                <Card accent={item.color} className="h-full">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${item.color}12` }}>
                    <item.icon className="w-6 h-6" style={{ color: item.color }} />
                  </div>
                  <h3 className="text-lg font-bold text-navy-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                </Card>
              </SlideIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ CURRICULUM — Immersive Bento Journey ═══════ */}
      <section className="relative py-24 px-6 overflow-hidden bg-[#070b14]">
        {/* ── Mesh gradient background ── */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: `
            radial-gradient(ellipse 70% 50% at 0% 0%, #1e1145 0%, transparent 50%),
            radial-gradient(ellipse 60% 50% at 100% 100%, #0c1a3a 0%, transparent 50%),
            radial-gradient(ellipse 50% 40% at 50% 30%, #120e2a 0%, transparent 50%)
          `
        }} />

        {/* ── Floating animated orbs ── */}
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full pointer-events-none blur-[120px]"
          style={{ top: "5%", left: "-10%", background: `radial-gradient(circle, ${BRAND_ORANGE}18, transparent 70%)` }}
          animate={{ x: [0, 60, 0], y: [0, 40, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-[450px] h-[450px] rounded-full pointer-events-none blur-[100px]"
          style={{ bottom: "0%", right: "-8%", background: `radial-gradient(circle, ${ACCENT_BLUE}14, transparent 70%)` }}
          animate={{ x: [0, -50, 0], y: [0, -35, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />
        <motion.div
          className="absolute w-[350px] h-[350px] rounded-full pointer-events-none blur-[90px]"
          style={{ top: "40%", left: "40%", background: `radial-gradient(circle, ${ACCENT_CYAN}0c, transparent 70%)` }}
          animate={{ x: [0, 30, -20, 0], y: [0, -30, 20, 0], scale: [1, 1.1, 0.95, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 6 }}
        />

        {/* ── Animated aurora streaks ── */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="aurora1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={BRAND_ORANGE} stopOpacity="0" />
              <stop offset="30%" stopColor={BRAND_ORANGE} stopOpacity="0.06" />
              <stop offset="70%" stopColor={ACCENT_BLUE} stopOpacity="0.04" />
              <stop offset="100%" stopColor={ACCENT_BLUE} stopOpacity="0" />
            </linearGradient>
            <linearGradient id="aurora2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={ACCENT_CYAN} stopOpacity="0" />
              <stop offset="40%" stopColor={ACCENT_CYAN} stopOpacity="0.05" />
              <stop offset="60%" stopColor={BRAND_ORANGE} stopOpacity="0.03" />
              <stop offset="100%" stopColor={BRAND_ORANGE} stopOpacity="0" />
            </linearGradient>
          </defs>
          <motion.path
            d="M-100,150 C200,50 500,300 800,120 S1200,250 1600,100"
            fill="none"
            stroke="url(#aurora1)"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 3, ease: "easeInOut" }}
          />
          <motion.path
            d="M-50,350 C300,250 600,450 900,300 S1300,400 1600,320"
            fill="none"
            stroke="url(#aurora2)"
            strokeWidth="1.5"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 3.5, delay: 0.5, ease: "easeInOut" }}
          />
        </svg>

        {/* ── Animated particle dots ── */}
        {[
          { x: "12%", y: "18%", size: 3, dur: 6, delay: 0 },
          { x: "88%", y: "25%", size: 2, dur: 8, delay: 1 },
          { x: "25%", y: "75%", size: 2.5, dur: 7, delay: 2 },
          { x: "72%", y: "65%", size: 2, dur: 9, delay: 3 },
          { x: "50%", y: "15%", size: 1.5, dur: 10, delay: 1.5 },
          { x: "35%", y: "85%", size: 2, dur: 8, delay: 4 },
          { x: "80%", y: "80%", size: 3, dur: 7, delay: 2.5 },
          { x: "15%", y: "45%", size: 1.5, dur: 11, delay: 5 },
        ].map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{ left: p.x, top: p.y, width: p.size, height: p.size, backgroundColor: i % 3 === 0 ? BRAND_ORANGE : i % 3 === 1 ? ACCENT_BLUE : ACCENT_CYAN }}
            animate={{ opacity: [0, 0.5, 0], y: [0, -20, 0], scale: [0.5, 1, 0.5] }}
            transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
          />
        ))}

        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Header */}
          <ScrollReveal>
            <SectionLabel center light>Curriculum</SectionLabel>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight text-center">
              Your Learning{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${BRAND_ORANGE}, ${ACCENT_CYAN})` }}>Journey</span>
            </h2>
            <p className="mt-3 text-gray-500 text-base max-w-lg mx-auto text-center">24 weeks of intensive, hands-on training. Click each phase to explore.</p>
          </ScrollReveal>

          {/* ── Horizontal Phase Selector ── */}
          <div className="mt-14 flex items-center justify-center">
            <div className="relative flex items-center gap-0 bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-1.5">
              {/* Animated slider background */}
              <motion.div
                className="absolute top-1.5 bottom-1.5 rounded-xl"
                style={{ backgroundColor: curriculum[activeTab >= 0 ? activeTab : 0]?.color || BRAND_ORANGE }}
                animate={{
                  left: `${(activeTab >= 0 ? activeTab : 0) * 33.33 + 0.5}%`,
                  width: "33.33%",
                  opacity: 0.15,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
              {curriculum.map((mod, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTab(i)}
                  className={cn(
                    "relative z-10 flex items-center gap-2.5 px-5 py-3 rounded-xl transition-all duration-300 cursor-pointer",
                    activeTab === i ? "text-white" : "text-gray-500 hover:text-gray-300"
                  )}
                >
                  <span
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold font-mono shrink-0 transition-all duration-300"
                    style={{
                      backgroundColor: activeTab === i ? mod.color : `${mod.color}15`,
                      color: activeTab === i ? "#fff" : mod.color,
                    }}
                  >
                    {mod.phase}
                  </span>
                  <span className="text-sm font-semibold hidden sm:block">{mod.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Progress Rail ── */}
          <div className="mt-8 max-w-2xl mx-auto">
            <div className="flex items-center gap-1">
              {curriculum.map((mod, i) => (
                <div key={i} className="flex-1 flex items-center gap-1">
                  <motion.div
                    className="flex-1 h-1 rounded-full overflow-hidden"
                    style={{ backgroundColor: `${mod.color}15` }}
                  >
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: mod.color }}
                      initial={{ width: "0%" }}
                      animate={{ width: activeTab >= i ? "100%" : "0%" }}
                      transition={{ duration: 0.6, delay: activeTab >= i ? i * 0.15 : 0, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </motion.div>
                  {i < curriculum.length - 1 && (
                    <motion.div
                      className="w-2 h-2 rounded-full shrink-0 border-2"
                      style={{
                        borderColor: activeTab > i ? curriculum[i + 1].color : `${curriculum[i + 1].color}30`,
                        backgroundColor: activeTab > i ? curriculum[i + 1].color : "transparent",
                      }}
                      animate={{ scale: activeTab === i + 1 ? [1, 1.3, 1] : 1 }}
                      transition={{ duration: 1.5, repeat: activeTab === i + 1 ? Infinity : 0, ease: "easeInOut" }}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2">
              {curriculum.map((mod, i) => (
                <span key={i} className="text-[10px] font-mono" style={{ color: activeTab >= i ? mod.color : `${mod.color}40` }}>
                  {mod.duration}
                </span>
              ))}
            </div>
          </div>

          {/* ── Bento Content Area ── */}
          <AnimatePresence mode="wait">
            {curriculum.map((mod, i) => activeTab === i && (
              <motion.div
                key={mod.phase}
                className="mt-12"
                initial={{ opacity: 0, y: 30, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.97 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Phase header card */}
                <div className="flex items-center gap-4 mb-8">
                  <motion.div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-2xl font-mono text-white relative overflow-hidden"
                    style={{ backgroundColor: mod.color }}
                    whileHover={{ scale: 1.05, rotate: -3 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  >
                    <motion.div
                      className="absolute inset-0"
                      style={{ background: `linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%)` }}
                      animate={{ x: ["-150%", "150%"] }}
                      transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
                    />
                    <span className="relative">{mod.phase}</span>
                  </motion.div>
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-white">{mod.title}</h3>
                    <p className="text-sm font-mono mt-1" style={{ color: `${mod.color}90` }}>{mod.duration}</p>
                  </div>
                  <div className="hidden md:flex flex-1 justify-end">
                    <div className="flex flex-wrap gap-2 justify-end">
                      {mod.skills.map((skill, j) => (
                        <motion.div
                          key={skill}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: 0.2 + j * 0.06 }}
                        >
                          <ToolLogo name={skill} />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Mobile skills */}
                <div className="flex flex-wrap gap-2 mb-6 md:hidden">
                  {mod.skills.map((skill, j) => (
                    <motion.div
                      key={skill}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.2 + j * 0.06 }}
                    >
                      <ToolLogo name={skill} />
                    </motion.div>
                  ))}
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                  {/* Topics — Left large card */}
                  <motion.div
                    className="lg:col-span-7 relative group rounded-2xl overflow-hidden"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                  >
                    {/* Glow border */}
                    <div
                      className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[1px]"
                      style={{ background: `linear-gradient(135deg, ${mod.color}40, transparent 50%, ${mod.color}20)` }}
                    />
                    <div className="relative bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-7 h-full group-hover:bg-white/[0.06] transition-all duration-500">
                      {/* Header with icon */}
                      <div className="flex items-center gap-2.5 mb-6">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${mod.color}15` }}>
                          <GraduationIcon className="w-4 h-4" style={{ color: mod.color }} />
                        </div>
                        <p className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: mod.color }}>What you&apos;ll learn</p>
                      </div>

                      <div className="space-y-3">
                        {mod.topics.map((topic, j) => {
                          const parts = topic.split(" — ");
                          return (
                            <motion.div
                              key={j}
                              className="group/topic relative rounded-xl bg-white/[0.02] border border-white/[0.05] p-4 hover:bg-white/[0.05] hover:border-white/[0.1] transition-all duration-300 overflow-hidden"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.4, delay: 0.3 + j * 0.12 }}
                            >
                              {/* Hover glow */}
                              <div
                                className="absolute inset-0 opacity-0 group-hover/topic:opacity-100 transition-opacity duration-500 pointer-events-none"
                                style={{ background: `radial-gradient(200px circle at 0% 50%, ${mod.color}0a, transparent 60%)` }}
                              />
                              <div className="relative flex items-start gap-3.5">
                                {/* Numbered badge */}
                                <div
                                  className="mt-0.5 shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold font-mono border"
                                  style={{ color: mod.color, borderColor: `${mod.color}30`, backgroundColor: `${mod.color}08` }}
                                >
                                  {String(j + 1).padStart(2, "0")}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-[14px] font-semibold text-white/90 group-hover/topic:text-white transition-colors duration-300">
                                    {parts[0]}
                                  </p>
                                  {parts[1] && (
                                    <p className="text-[13px] text-gray-500 mt-1 leading-relaxed group-hover/topic:text-gray-400 transition-colors duration-300">
                                      {parts[1]}
                                    </p>
                                  )}
                                </div>
                                {/* Arrow on hover */}
                                <motion.div
                                  className="shrink-0 mt-1 opacity-0 group-hover/topic:opacity-100 transition-opacity duration-300"
                                >
                                  <ArrowRightIcon className="w-4 h-4" style={{ color: mod.color }} />
                                </motion.div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>

                  {/* Code Preview — Right card */}
                  <motion.div
                    className="lg:col-span-5 relative group"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.25 }}
                  >
                    <div
                      className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[1px]"
                      style={{ background: `linear-gradient(135deg, transparent 50%, ${mod.color}30, ${mod.color}15)` }}
                    />
                    <div className="relative rounded-2xl overflow-hidden border border-white/[0.08] h-full group-hover:border-white/[0.12] transition-colors duration-500">
                      {/* Editor header */}
                      <div className="flex items-center justify-between px-4 py-3 bg-[#1a1e2e] border-b border-white/[0.06]">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                          <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                          <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                        </div>
                        <span className="text-[10px] font-mono text-gray-500">phase_{mod.phase}.py</span>
                        <div className="flex items-center gap-1.5">
                          <motion.div
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: mod.color }}
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          />
                          <span className="text-[9px] font-mono" style={{ color: `${mod.color}80` }}>LIVE</span>
                        </div>
                      </div>

                      {/* Code content with line numbers */}
                      <div className="bg-[#0d1117] p-5 font-mono text-[12px] leading-[2]">
                        {mod.code.map((line, j) => (
                          <motion.div
                            key={j}
                            className="flex items-start gap-4 group/line hover:bg-white/[0.02] -mx-5 px-5 transition-colors duration-200"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2, delay: 0.4 + j * 0.05 }}
                          >
                            <span className="text-gray-600 select-none w-4 text-right shrink-0 text-[11px]">{j + 1}</span>
                            <span className="whitespace-pre" style={{ color: line.color }}>{line.text}</span>
                          </motion.div>
                        ))}
                        {/* Blinking cursor */}
                        <motion.div
                          className="flex items-center gap-4 mt-0.5"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.9 }}
                        >
                          <span className="text-gray-600 select-none w-4 text-right shrink-0 text-[11px]">{mod.code.length + 1}</span>
                          <motion.span
                            className="w-[7px] h-[15px] rounded-[1px]"
                            style={{ backgroundColor: mod.color }}
                            animate={{ opacity: [1, 0, 1] }}
                            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                          />
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Phase stats row */}
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {[
                    { label: "Topics Covered", value: mod.topics.length.toString(), suffix: " modules", icon: <LayersIcon className="w-5 h-5" style={{ color: mod.color }} /> },
                    { label: "Tools Used", value: mod.skills.length.toString(), suffix: " tools", icon: <svg className="w-5 h-5" style={{ color: mod.color }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" /></svg> },
                    { label: "Duration", value: mod.duration.split(" ")[1].split("–")[1] || "8", suffix: " weeks", icon: <ClockIcon className="w-5 h-5" style={{ color: mod.color }} /> },
                  ].map((stat, j) => (
                    <motion.div
                      key={j}
                      className="relative group/stat rounded-xl bg-white/[0.03] border border-white/[0.06] p-4 hover:bg-white/[0.05] transition-all duration-300 overflow-hidden flex items-center gap-3"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.5 + j * 0.08 }}
                    >
                      <div
                        className="absolute inset-0 opacity-0 group-hover/stat:opacity-100 transition-opacity duration-500 pointer-events-none"
                        style={{ background: `radial-gradient(120px circle at 50% 50%, ${mod.color}08, transparent 60%)` }}
                      />
                      <div className="relative w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${mod.color}12` }}>
                        {stat.icon}
                      </div>
                      <div className="relative">
                        <p className="text-xl font-bold text-white">{stat.value}<span className="text-sm font-normal text-gray-500">{stat.suffix}</span></p>
                        <p className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">{stat.label}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Bottom completion badge */}
          <motion.div
            className="mt-14 flex items-center justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-white/[0.04] backdrop-blur-sm border border-white/[0.08]">
              <div className="flex -space-x-1.5">
                {curriculum.map((mod, j) => (
                  <motion.div
                    key={j}
                    className="w-4 h-4 rounded-full border-2"
                    style={{ backgroundColor: mod.color, borderColor: DARK_BG }}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + j * 0.1, type: "spring" }}
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-gray-400">3 phases</span>
              <span className="text-xs text-gray-600">·</span>
              <span className="text-xs font-mono text-gray-500">24 weeks</span>
              <span className="text-xs text-gray-600">·</span>
              <motion.span
                className="text-xs font-bold"
                style={{ color: BRAND_ORANGE }}
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                Job ready
              </motion.span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════ TOOLS — Auto-scroll marquee ═══════ */}
      <section className="relative py-16 px-6 bg-white">
        <Divider />
        <div className="max-w-6xl mx-auto pt-12">
          <ScrollReveal>
            <SectionLabel center>Tech Stack</SectionLabel>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy-900 leading-tight text-center">
              30+ Tools You&apos;ll{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${ACCENT_BLUE}, ${BRAND_ORANGE})` }}>Master</span>
            </h2>
          </ScrollReveal>
          <div className="mt-8 space-y-3 relative">
            <div className="absolute left-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-r from-white to-transparent pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-l from-white to-transparent pointer-events-none" />
            {/* Row 1 — scroll left */}
            <div className="overflow-hidden">
              <motion.div
                className="flex gap-3 w-max"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ duration: 25, ease: "linear", repeat: Infinity }}
              >
                {[...tools.slice(0, 15), ...tools.slice(0, 15)].map((tool, i) => (
                  <ToolLogo key={`r1-${tool}-${i}`} name={tool} className="!px-3 !py-1.5 !rounded-lg !gap-2 [&_img]:!w-5 [&_img]:!h-5 [&_span]:!text-xs [&>span]:!w-5 [&>span]:!h-5 [&>span]:!text-[10px]" />
                ))}
              </motion.div>
            </div>
            {/* Row 2 — scroll right */}
            <div className="overflow-hidden">
              <motion.div
                className="flex gap-3 w-max"
                animate={{ x: ["-50%", "0%"] }}
                transition={{ duration: 28, ease: "linear", repeat: Infinity }}
              >
                {[...tools.slice(15), ...tools.slice(15)].map((tool, i) => (
                  <ToolLogo key={`r2-${tool}-${i}`} name={tool} className="!px-3 !py-1.5 !rounded-lg !gap-2 [&_img]:!w-5 [&_img]:!h-5 [&_span]:!text-xs [&>span]:!w-5 [&>span]:!h-5 [&>span]:!text-[10px]" />
                ))}
              </motion.div>
            </div>
          </div>
        </div>
        <div className="mt-12"><Divider /></div>
      </section>

      {/* ═══════ PROJECTS — Compact stacked cards with spotlight hover ═══════ */}
      <section className="relative py-20 px-6 overflow-hidden" style={{ backgroundColor: DARK_BG }}>
        {/* Subtle mesh bg */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: `radial-gradient(ellipse 80% 50% at 50% 0%, ${BRAND_ORANGE}08, transparent)`
        }} />

        <div className="max-w-5xl mx-auto relative z-10">
          <ScrollReveal>
            <SectionLabel light>Hands-On</SectionLabel>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Projects You&apos;ll{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${ACCENT_CYAN}, ${BRAND_ORANGE})` }}>Ship</span>
            </h2>
            <p className="mt-3 text-gray-500 text-base max-w-md">Real-world projects that become your portfolio.</p>
          </ScrollReveal>

          {/* Project cards — stacked rows with spotlight hover */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((project, i) => (
              <motion.div
                key={i}
                className="group relative rounded-2xl overflow-hidden cursor-default"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-5%" }}
                transition={{ duration: 0.5, delay: i * 0.1, ease }}
                whileHover={{ y: -4 }}
              >
                {/* Border */}
                <div className="absolute inset-0 rounded-2xl border border-white/[0.06] group-hover:border-white/[0.14] transition-colors duration-500 pointer-events-none z-20" />

                {/* Spotlight cursor glow — tracks mouse position */}
                <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(300px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${project.color}12, transparent 60%)` }}
                />

                {/* Card body */}
                <div
                  className="relative z-10 p-6"
                  style={{ backgroundColor: "rgba(255,255,255,0.02)" }}
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
                    e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
                  }}
                >
                  {/* Top row: number badge + colored line */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold font-mono shrink-0"
                      style={{ color: project.color, backgroundColor: `${project.color}15`, border: `1px solid ${project.color}20` }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <motion.div
                      className="h-px flex-1 origin-left"
                      style={{ background: `linear-gradient(90deg, ${project.color}35, transparent)` }}
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.7, delay: 0.2 + i * 0.08 }}
                    />
                  </div>

                  {/* Title */}
                  <h4 className="text-base font-bold text-white/90 group-hover:text-white transition-colors duration-300 mb-2 leading-snug">
                    {project.title}
                  </h4>

                  {/* Description */}
                  <p className="text-sm text-gray-500 group-hover:text-gray-400 transition-colors duration-300 leading-relaxed mb-4">
                    {project.desc}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span key={tag}
                        className="px-2 py-0.5 rounded text-[11px] font-mono font-medium border"
                        style={{ color: `${project.color}cc`, borderColor: `${project.color}20`, backgroundColor: `${project.color}08` }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pipeline terminal */}
          <motion.div className="mt-16 relative max-w-3xl mx-auto" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <Terminal
              title="pipeline.sh — bash"
              lines={[
                { text: "$ python run_pipeline.py --env production", color: "#e6edf3", delay: 400 },
                { text: "", delay: 100 },
                { text: "[1/5] Extracting data from MySQL...", color: "#f0883e", delay: 300 },
                { text: "  ✓ 12,847 rows fetched from sales_db", color: "#7ee787", delay: 500 },
                { text: "[2/5] Cleaning & transforming...", color: "#f0883e", delay: 300 },
                { text: "  ✓ Removed 23 duplicates, filled 156 nulls", color: "#7ee787", delay: 400 },
                { text: "[3/5] Feature engineering...", color: "#f0883e", delay: 300 },
                { text: "  ✓ Created 8 new features (revenue_per_unit, month_trend...)", color: "#7ee787", delay: 400 },
                { text: "[4/5] Training model (RandomForest)...", color: "#f0883e", delay: 300 },
                { text: "  ✓ Accuracy: 94.2% | F1: 0.91 | AUC: 0.96", color: "#7ee787", delay: 600 },
                { text: "[5/5] Exporting to Tableau...", color: "#f0883e", delay: 300 },
                { text: "  ✓ Dashboard published → analytics.linkway.io/sales", color: "#7ee787", delay: 500 },
                { text: "", delay: 100 },
                { text: "Pipeline completed in 4.2s", color: "#79c0ff", delay: 400 },
              ]}
            />
          </motion.div>
        </div>
      </section>

      {/* ═══════ CAREER OUTCOMES ═══════ */}
      <section className="relative py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <SectionLabel>Outcomes</SectionLabel>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy-900 leading-tight">
              Where You&apos;ll{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${BRAND_ORANGE}, ${ACCENT_BLUE})` }}>End Up</span>
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-12">
            {/* Roles — 3 columns */}
            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {roles.map((role, i) => (
                <SlideIn key={i} direction="up" delay={i * 0.05}>
                  <Card accent={ACCENT_BLUE}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-semibold text-navy-900">{role.title}</h4>
                        <p className="text-xs text-gray-500 mt-0.5 font-mono">{role.range}</p>
                      </div>
                      <TargetIcon className="w-4 h-4 text-gray-300" />
                    </div>
                  </Card>
                </SlideIn>
              ))}
            </div>

            {/* Right side — salary + guarantees */}
            <div className="lg:col-span-2 space-y-5 flex flex-col justify-center">
              <SlideIn direction="right">
                <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6">
                  <p className="text-xs font-mono text-gray-400 tracking-widest uppercase mb-2">Expected Salary Range</p>
                  <p className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${BRAND_ORANGE}, ${ACCENT_BLUE})` }}>₹6–15 LPA</p>
                </div>
              </SlideIn>

              <SlideIn direction="right" delay={0.1}>
                <div className="flex items-center gap-3 px-5 py-3.5 rounded-xl border border-gray-200 bg-gray-50">
                  <ShieldIcon className="w-5 h-5 shrink-0" style={{ color: BRAND_ORANGE }} />
                  <div>
                    <p className="text-sm text-navy-900 font-semibold">Dedicated Placement Assistance</p>
                    <p className="text-xs text-gray-500">Up to 10 guaranteed interviews</p>
                  </div>
                </div>
              </SlideIn>

              <SlideIn direction="right" delay={0.2}>
                <div className="flex items-center gap-3 px-5 py-3.5 rounded-xl border border-gray-200 bg-gray-50">
                  <SparklesIcon className="w-5 h-5 shrink-0" style={{ color: ACCENT_BLUE }} />
                  <div>
                    <p className="text-sm text-navy-900 font-semibold">Microsoft Azure AI Certification</p>
                    <p className="text-xs text-gray-500">Exam preparation included</p>
                  </div>
                </div>
              </SlideIn>
            </div>
          </div>

        </div>
      </section>

      <WaveDivider from="#ffffff" to="#f9fafb" />

      {/* ═══════ TESTIMONIALS — Auto-scroll carousel ═══════ */}
      <section className="relative py-20 px-6 overflow-hidden bg-gray-50">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `radial-gradient(${BRAND_ORANGE} 1px, transparent 1px)`, backgroundSize: '32px 32px' }} />

        <div className="max-w-6xl mx-auto relative z-10">
          <ScrollReveal>
            <SectionLabel center>Success Stories</SectionLabel>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy-900 leading-tight text-center">
              What Learners Say{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${BRAND_ORANGE}, ${ACCENT_BLUE})` }}>About Us</span>
            </h2>
            <p className="text-center text-gray-500 mt-3 max-w-xl mx-auto text-sm">
              Join hundreds of professionals who&apos;ve transformed their careers with Linkway Learning.
            </p>
          </ScrollReveal>
        </div>

        <TestimonialCarousel />
      </section>

      {/* ═══════ CAREER GROWTH ROADMAP ═══════ */}
      <section className="relative py-20 px-6 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <SectionLabel center>Your Journey</SectionLabel>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy-900 leading-tight text-center">
              Your Career Growth{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${BRAND_ORANGE}, ${ACCENT_BLUE})` }}>Roadmap</span>
            </h2>
            <p className="text-center text-gray-500 mt-3 max-w-xl mx-auto text-sm">
              A proven 4-step path to take you from upskilling to your dream job
            </p>
          </ScrollReveal>

          <div className="mt-16 relative">
            {/* Connecting dashed line */}
            <motion.div
              className="hidden lg:block absolute top-[60px] left-[12%] right-[12%] h-0 border-t-2 border-dashed"
              style={{ borderColor: `${ACCENT_BLUE}40` }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease }}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6">
              {[
                { icon: <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>, title: "Profile Power-Up", desc: "Stand out with a sharp resume, optimized LinkedIn/GitHub, and a strong personal brand." },
                { icon: <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>, title: "Interview Readiness", desc: "Ace every round with 1:1 mock interviews, role-specific training, and actionable feedback." },
                { icon: <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>, title: "Hiring Rounds", desc: "Apply to 200+ hiring partners and clear technical interview rounds with confidence." },
                { icon: <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.58-5.84a14.927 14.927 0 00-2.58 5.84m2.58-5.84L18 2.25l-3.107 3.107" /></svg>, title: "Offer Unlocked!", desc: "Land a high paying job offer from top product-based companies." },
              ].map((step, i) => (
                <motion.div
                  key={step.title}
                  className="flex flex-col items-center text-center group"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15, ease }}
                >
                  {/* Icon circle with pulse */}
                  <motion.div
                    className="relative mb-5"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="absolute inset-0 rounded-full scale-[1.6] opacity-[0.08]" style={{ backgroundColor: ACCENT_BLUE }} />
                    <div className="relative w-[72px] h-[72px] rounded-full flex items-center justify-center border-2 bg-white shadow-sm" style={{ borderColor: `${ACCENT_BLUE}30`, color: ACCENT_BLUE }}>
                      {step.icon}
                    </div>
                    {/* Step number badge */}
                    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center text-white" style={{ backgroundColor: BRAND_ORANGE }}>
                      {i + 1}
                    </div>
                  </motion.div>

                  <h4 className="text-base font-bold text-navy-900 mb-2">{step.title}</h4>
                  <p className="text-sm text-gray-500 leading-relaxed max-w-[220px]">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <WaveDivider from="#ffffff" to="#f9fafb" />

      {/* ═══════ FAQ ═══════ */}
      <section className="relative py-16 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal>
            <SectionLabel center>FAQ</SectionLabel>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy-900 leading-tight text-center">
              Common{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${BRAND_ORANGE}, ${ACCENT_BLUE})` }}>Questions</span>
            </h2>
          </ScrollReveal>

          <div className="mt-10 bg-white rounded-2xl border border-gray-100 px-6 md:px-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
            {faqs.map((faq, i) => (
              <FAQItem key={i} question={faq.question} answer={faq.answer} isOpen={openFaq === i} onClick={() => setOpenFaq(openFaq === i ? -1 : i)} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ FINAL CTA — Dark section ═══════ */}
      <section id="enroll" className="relative py-24 px-6 overflow-hidden" style={{ backgroundColor: DARK_BG }}>
        <div className="absolute inset-0" style={{
          background: `radial-gradient(ellipse 50% 50% at 50% 50%, ${BRAND_ORANGE}0c 0%, transparent 60%)`
        }} />
        <div className="noise-overlay absolute inset-0 pointer-events-none opacity-[0.02]" />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <SectionLabel center light>Get Started</SectionLabel>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mt-4">
              Ready to{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${BRAND_ORANGE}, ${ACCENT_BLUE})` }}>Start</span>?
            </h2>
            <p className="mt-5 text-gray-400 text-base max-w-xl mx-auto leading-relaxed">
              500+ people have already made the switch through Linkway. The next batch is filling up — your seat won&apos;t hold itself.
            </p>
          </motion.div>

          <motion.div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.15 }}>
            <Magnetic>
              <motion.button onClick={openEnquiry} className="group relative px-8 py-4 rounded-xl font-bold text-base overflow-hidden cursor-pointer" style={{ backgroundColor: BRAND_ORANGE }} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <span className="relative z-10 flex items-center gap-2 text-white">Enroll Now <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
              </motion.button>
            </Magnetic>
            <Magnetic>
              <motion.a href="/contact" className="px-8 py-4 rounded-xl font-semibold text-base border border-white/[0.12] text-white/80 hover:text-white hover:border-white/25 hover:bg-white/[0.04] transition-all duration-300 cursor-pointer" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                Talk to a Counselor
              </motion.a>
            </Magnetic>
          </motion.div>

          <motion.p className="mt-8 text-xs text-gray-600 font-mono" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
            No spam. No hidden fees. Just your future, accelerated.
          </motion.p>
        </div>
      </section>
    </div>
    </ThemeProvider>
  );
}
