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
  { name: "Aditya Srivastava", from: "Full-Stack Dev", to: "Data Scientist", company: "Globussoft", exp: "3 yrs exp.", accentFrom: "#8b5cf6", accentTo: "#a78bfa", gradientBg: "linear-gradient(135deg, #f5f3ff, #ddd6fe 40%, #ffffff)", desc: "I could code, but I didn't know ML. Linkway filled that gap with real projects — computer vision, forecasting, the works." },
  { name: "Priya Mehta", from: "Graphic Designer", to: "Data Scientist", company: "Meesho", exp: "2 yrs exp.", accentFrom: "#f97316", accentTo: "#fb923c", gradientBg: "linear-gradient(135deg, #fff7ed, #fed7aa 40%, #ffffff)", desc: "From design to data, Linkway taught me how to think analytically. I learned Python, ML, and dashboarding. My fashion image classification project clicked with Meesho." },
  { name: "Sameer Joshi", from: "Mechanical Eng.", to: "ML Engineer", company: "TCS Research", exp: "2 yrs exp.", accentFrom: "#10b981", accentTo: "#34d399", gradientBg: "linear-gradient(135deg, #ecfdf5, #d1fae5 40%, #ffffff)", desc: "Engineering taught me problem-solving. Linkway taught me to solve problems with neural networks. Now I'm building predictive maintenance models at TCS." },
  { name: "Neha Gupta", from: "BCA Graduate", to: "AI Engineer", company: "Fractal Analytics", exp: "1.5 yrs exp.", accentFrom: "#0ea5e9", accentTo: "#38bdf8", gradientBg: "linear-gradient(135deg, #f0f9ff, #bae6fd 40%, #ffffff)", desc: "Fresh out of BCA, I had no idea what ML actually was. 12 months later, I'm deploying NLP models in production at Fractal. The projects made all the difference." },
  { name: "Vikram Rathore", from: "Pharmacist", to: "Data Scientist", company: "Novartis", exp: "2 yrs exp.", accentFrom: "#eab308", accentTo: "#facc15", gradientBg: "linear-gradient(135deg, #fefce8, #fef9c3 40%, #ffffff)", desc: "Pharmacy + data science is an unusual combo, but Linkway helped me see the connection. Now I'm doing drug discovery analytics at Novartis." },
  { name: "Riya Patel", from: "Stats Grad", to: "MLOps Engineer", company: "PhonePe", exp: "1 yr exp.", accentFrom: "#f43f5e", accentTo: "#fb7185", gradientBg: "linear-gradient(135deg, #fff1f2, #fecdd3 40%, #ffffff)", desc: "Statistics was my strength. Linkway taught me to deploy those stats as ML pipelines. PhonePe hired me for exactly that skill set." },
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
        <motion.div
          className="absolute -top-10 -right-10 w-36 h-36 rounded-full blur-3xl pointer-events-none"
          style={{ backgroundColor: t.accentFrom, opacity: 0.12 }}
          animate={{ scale: [1, 1.3, 1], x: [0, 8, 0], y: [0, -5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: index * 0.4 }}
        />
        <motion.div
          className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full blur-3xl pointer-events-none"
          style={{ backgroundColor: t.accentTo, opacity: 0.1 }}
          animate={{ scale: [1.2, 0.9, 1.2], x: [0, -6, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: index * 0.6 }}
        />

        <div className="relative p-7 pb-6" style={{ transform: "translateZ(40px)" }}>
          <svg className="absolute top-2 right-4 w-20 h-20 pointer-events-none" viewBox="0 0 64 64" fill="none">
            <path d="M20 34c0-6.627 5.373-12 12-12v-6c-9.941 0-18 8.059-18 18v12h18V34H20zm24 0c0-6.627 5.373-12 12-12v-6c-9.941 0-18 8.059-18 18v12h18V34H44z" fill={t.accentFrom} opacity="0.06" />
          </svg>

          <div className="flex items-center gap-3 mb-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase backdrop-blur-md" style={{ backgroundColor: `${t.accentFrom}10`, color: t.accentFrom, border: `1.5px solid ${t.accentFrom}20`, boxShadow: `0 0 12px ${t.accentFrom}08` }}>
              <motion.span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: t.accentFrom }} animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }} transition={{ duration: 2, repeat: Infinity }} />
              {t.exp}
            </span>
            <motion.div className="flex-1 h-[1.5px] rounded-full origin-left" style={{ background: `linear-gradient(90deg, ${t.accentFrom}35, ${t.accentTo}15, transparent)` }} initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.3 }} />
          </div>

          <p className="text-[14px] text-gray-700 leading-[1.8] mb-7 relative z-10 font-[450]">
            &ldquo;{t.desc}&rdquo;
          </p>

          <div className="h-[1.5px] mb-5 rounded-full" style={{ background: `linear-gradient(90deg, ${t.accentFrom}20, ${t.accentTo}12, transparent)` }} />

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
      <div className="absolute left-0 top-0 bottom-0 w-16 md:w-44 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, #f1f5f9, transparent)' }} />
      <div className="absolute right-0 top-0 bottom-0 w-16 md:w-44 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, #f1f5f9, transparent)' }} />

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
      <div
        className={cn(
          "relative rounded-2xl border overflow-hidden transition-all duration-500 cursor-pointer",
          isOpen
            ? "bg-white shadow-[0_12px_40px_rgba(0,0,0,0.08)] border-gray-200"
            : "bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] border-gray-100 hover:border-gray-200 hover:shadow-[0_6px_20px_rgba(0,0,0,0.06)]"
        )}
        onClick={onToggle}
      >
        <motion.div
          className="h-1 w-full"
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8, delay: index * 0.15 + 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          style={{ transformOrigin: "left", backgroundColor: mod.color }}
        />

        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <motion.div
                className="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg font-mono text-white"
                style={{ backgroundColor: mod.color }}
                whileHover={{ scale: 1.08, rotate: -3 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                {mod.phase}
              </motion.div>
              <div className="absolute inset-0 rounded-2xl blur-lg opacity-30" style={{ backgroundColor: mod.color }} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-navy-900">{mod.title}</h3>
              <p className="text-sm text-gray-400 font-mono mt-0.5">{mod.duration}</p>
            </div>
          </div>

          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center shrink-0"
          >
            <ChevronIcon className="w-4 h-4 text-gray-400" />
          </motion.div>
        </div>

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

/* ─── Hero Image Carousel ─── */
const heroImages = [
  "/images/data-science-ai/hero-1.png",
  "/images/data-science-ai/hero-2.png",
  "/images/data-science-ai/hero-3.png",
  "/images/data-science-ai/hero-4.png",
];

function HeroImageCarousel({ className }: { className?: string }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const variants = {
    enter: (dir: number) => ({
      clipPath: dir > 0
        ? "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)"
        : "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
      scale: 1.1,
    }),
    center: {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      scale: 1,
    },
    exit: (dir: number) => ({
      clipPath: dir > 0
        ? "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)"
        : "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)",
      scale: 1.05,
    }),
  };

  return (
    <div className={cn("relative rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl aspect-[4/3] group", className)}>
      <motion.div
        className="absolute -inset-4 rounded-3xl opacity-40 blur-2xl -z-10"
        style={{ background: `radial-gradient(ellipse at center, ${BRAND_ORANGE}40, transparent 70%)` }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <AnimatePresence initial={false} custom={direction} mode="sync">
        <motion.div
          key={current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 1, ease: [0.77, 0, 0.175, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={heroImages[current]}
            alt="Data Science AI professional"
            fill
            className="object-cover"
            priority={current === 0}
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </motion.div>
      </AnimatePresence>
      <div className="absolute bottom-0 inset-x-0 h-[3px] bg-white/10 z-10">
        <motion.div
          key={current}
          className="h-full"
          style={{ background: `linear-gradient(90deg, ${BRAND_ORANGE}, ${ACCENT_CYAN})` }}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 4, ease: "linear" }}
        />
      </div>
      <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 rounded-tl-sm pointer-events-none" style={{ borderColor: `${BRAND_ORANGE}80` }} />
      <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 rounded-br-sm pointer-events-none" style={{ borderColor: `${BRAND_ORANGE}80` }} />
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

/* ─── Interactive Dashboard Preview ─── */
function DashboardPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const [activeTab, setActiveTab] = useState(0);

  const kpis = [
    { label: "Model Accuracy", value: "96.3%", change: "+2.1%", up: true },
    { label: "F1 Score", value: "0.94", change: "+0.05", up: true },
    { label: "Training Loss", value: "0.003", change: "-0.012", up: false },
    { label: "Inference", value: "12ms", change: "-3ms", up: false },
  ];

  const tabs = ["Training", "Metrics", "Deploy"];

  const bars = [
    { label: "Jan", h: 40 }, { label: "Feb", h: 55 }, { label: "Mar", h: 45 },
    { label: "Apr", h: 70 }, { label: "May", h: 62 }, { label: "Jun", h: 85 },
    { label: "Jul", h: 78 }, { label: "Aug", h: 90 }, { label: "Sep", h: 72 },
    { label: "Oct", h: 95 }, { label: "Nov", h: 88 }, { label: "Dec", h: 100 },
  ];

  const donutData = [
    { label: "CNN", pct: 38, color: BRAND_ORANGE },
    { label: "Transformer", pct: 28, color: ACCENT_BLUE },
    { label: "RNN", pct: 20, color: ACCENT_CYAN },
    { label: "Other", pct: 14, color: "#7ee787" },
  ];

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  let cumulativeOffset = 0;

  return (
    <div ref={ref} className="rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl bg-[#0d1117]">
      <div className="flex items-center justify-between px-5 py-3 bg-[#1a1e2e] border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <span className="text-xs font-mono text-gray-500">ml_training_monitor.py</span>
        </div>
        <div className="flex gap-1">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`px-3 py-1 rounded-md text-[11px] font-medium transition-all duration-200 ${
                activeTab === i
                  ? "bg-white/[0.1] text-white"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5 space-y-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {kpis.map((kpi, i) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="rounded-xl bg-white/[0.04] border border-white/[0.06] p-3.5 hover:border-white/[0.12] transition-colors duration-300"
            >
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">{kpi.label}</p>
              <p className="text-xl font-bold text-white mt-1 font-mono">{kpi.value}</p>
              <span className={`text-[11px] font-mono font-medium ${kpi.up ? "text-[#7ee787]" : "text-[#7ee787]"}`}>
                {kpi.change}
              </span>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="md:col-span-2 rounded-xl bg-white/[0.03] border border-white/[0.06] p-4"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-medium text-gray-400">Training Progress</p>
              <span className="text-[10px] text-gray-600 font-mono">50 epochs</span>
            </div>
            <div className="flex items-end gap-[6px] h-32">
              {bars.map((bar, i) => (
                <div key={bar.label} className="flex-1 flex flex-col items-center h-full justify-end">
                  <motion.div
                    className="w-full rounded-t-sm min-h-[2px]"
                    style={{
                      background: i >= 9
                        ? `linear-gradient(180deg, ${BRAND_ORANGE}, ${BRAND_ORANGE}80)`
                        : `linear-gradient(180deg, ${ACCENT_BLUE}90, ${ACCENT_BLUE}40)`,
                      height: 0,
                    }}
                    initial={{ height: 0 }}
                    animate={inView ? { height: `${bar.h}%` } : { height: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 + i * 0.05, ease: "easeOut" }}
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-[6px] mt-1">
              {bars.map((bar) => (
                <span key={bar.label} className="flex-1 text-center text-[8px] text-gray-600">{bar.label}</span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4"
          >
            <p className="text-xs font-medium text-gray-400 mb-3">Model Architecture</p>
            <div className="flex justify-center">
              <svg viewBox="0 0 100 100" className="w-28 h-28">
                {donutData.map((seg) => {
                  const dashLength = (seg.pct / 100) * circumference;
                  const offset = cumulativeOffset;
                  cumulativeOffset += dashLength;
                  return (
                    <motion.circle
                      key={seg.label}
                      cx="50" cy="50" r={radius}
                      fill="none"
                      stroke={seg.color}
                      strokeWidth="10"
                      strokeDasharray={`${dashLength} ${circumference - dashLength}`}
                      strokeDashoffset={-offset}
                      strokeLinecap="round"
                      initial={{ opacity: 0 }}
                      animate={inView ? { opacity: 1 } : {}}
                      transition={{ duration: 0.5, delay: 0.8 }}
                      className="origin-center -rotate-90"
                      style={{ transformOrigin: "50px 50px" }}
                    />
                  );
                })}
              </svg>
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 mt-3">
              {donutData.map((seg) => (
                <div key={seg.label} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
                  <span className="text-[10px] text-gray-500">{seg.label}</span>
                  <span className="text-[10px] text-gray-400 font-mono ml-auto">{seg.pct}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-5 pt-2 border-t border-white/[0.04]">
          {[
            { label: "Models", value: "5", color: BRAND_ORANGE },
            { label: "Datasets", value: "10+", color: ACCENT_BLUE },
            { label: "Parameters", value: "1M+", color: ACCENT_CYAN },
            { label: "Deployed", value: "100%", color: "#7ee787" },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-1.5">
              <span className="text-sm font-bold font-mono" style={{ color: s.color }}>{s.value}</span>
              <span className="text-[10px] text-gray-600">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MODULES — Bento-Grid Glassmorphism (Light Theme)
   ═══════════════════════════════════════════════════════ */

const MODULE_DATA = [
  {
    id: 1,
    title: "Python Programming",
    subtitle: "Master Python from zero to hero",
    gradient: "from-emerald-400 to-teal-500",
    bgGradient: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
    iconBg: "linear-gradient(135deg, #10b981, #059669)",
    color: "#059669",
    lightBg: "#ecfdf5",
    topics: [
      "Python fundamentals — variables, loops, functions, OOP",
      "NumPy arrays & vectorized operations",
      "Pandas DataFrames — cleaning, merging, grouping",
      "File I/O, error handling & modules",
      "List comprehensions & generators",
      "Working with APIs & JSON data",
    ],
    icon: (<img src="/images/tools/python.png" alt="Python" className="w-7 h-7 object-contain drop-shadow-sm" />),
  },
  {
    id: 2,
    title: "Statistics & Mathematics",
    subtitle: "Build the mathematical foundation for ML",
    gradient: "from-blue-400 to-indigo-500",
    bgGradient: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
    iconBg: "linear-gradient(135deg, #3b82f6, #4f46e5)",
    color: "#3b82f6",
    lightBg: "#eff6ff",
    topics: [
      "Descriptive statistics & data distributions",
      "Probability theory & Bayes theorem",
      "Hypothesis testing — t-test, chi-square, ANOVA",
      "Linear algebra — matrices, eigenvalues, SVD",
      "Calculus — gradients, partial derivatives",
      "Statistical modeling & inference",
    ],
    icon: (<img src="/images/tools/python.png" alt="Statistics" className="w-7 h-7 object-contain drop-shadow-sm" />),
  },
  {
    id: 3,
    title: "Machine Learning",
    subtitle: "Build predictive models that drive decisions",
    gradient: "from-amber-400 to-orange-500",
    bgGradient: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
    iconBg: "linear-gradient(135deg, #f59e0b, #ea580c)",
    color: "#d97706",
    lightBg: "#fffbeb",
    topics: [
      "Supervised Learning — linear & logistic regression",
      "Decision Trees, Random Forests & XGBoost",
      "Unsupervised Learning — K-Means, DBSCAN, PCA",
      "Model evaluation — cross-validation, ROC curves",
      "Feature engineering & selection",
      "Ensemble methods & model stacking",
    ],
    icon: (<img src="/images/tools/scikit-learn.png" alt="Machine Learning" className="w-7 h-7 object-contain drop-shadow-sm" />),
  },
  {
    id: 4,
    title: "Deep Learning",
    subtitle: "Neural networks from scratch to production",
    gradient: "from-violet-400 to-purple-600",
    bgGradient: "linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)",
    iconBg: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
    color: "#7c3aed",
    lightBg: "#f5f3ff",
    topics: [
      "Neural network fundamentals — perceptrons to DNNs",
      "CNNs — image classification & object detection",
      "RNNs & LSTMs — sequence modeling",
      "Transfer learning with pre-trained models",
      "Model optimization — batch norm, dropout, learning rate",
      "PyTorch & TensorFlow implementation",
    ],
    icon: (<img src="/images/tools/tensorflow.png" alt="Deep Learning" className="w-7 h-7 object-contain drop-shadow-sm" />),
  },
  {
    id: 5,
    title: "NLP & Generative AI",
    subtitle: "Build AI that understands language",
    gradient: "from-pink-400 to-rose-500",
    bgGradient: "linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)",
    iconBg: "linear-gradient(135deg, #ec4899, #db2777)",
    color: "#db2777",
    lightBg: "#fdf2f8",
    topics: [
      "Text preprocessing — tokenization, stemming, TF-IDF",
      "Word embeddings — Word2Vec, GloVe, FastText",
      "Transformer architecture — attention mechanism",
      "LLMs — GPT, BERT, fine-tuning strategies",
      "Prompt engineering & RAG systems",
      "LangChain for AI applications",
    ],
    icon: (<img src="/images/tools/python.png" alt="NLP" className="w-7 h-7 object-contain drop-shadow-sm" />),
  },
  {
    id: 6,
    title: "MLOps & Deployment",
    subtitle: "Take models from notebook to production",
    gradient: "from-cyan-400 to-sky-500",
    bgGradient: "linear-gradient(135deg, #cffafe 0%, #a5f3fc 100%)",
    iconBg: "linear-gradient(135deg, #06b6d4, #0284c7)",
    color: "#0891b2",
    lightBg: "#ecfeff",
    topics: [
      "ML pipeline design & automation",
      "Model versioning with MLflow & DVC",
      "Docker containerization for ML",
      "Cloud deployment — AWS SageMaker, GCP Vertex AI",
      "CI/CD for ML pipelines",
      "Monitoring, A/B testing & model drift",
    ],
    icon: (<img src="/images/tools/docker.png" alt="MLOps" className="w-7 h-7 object-contain drop-shadow-sm" />),
  },
];

/* ── Module Card ── */
function ModuleCard({ mod, index, onEnquiry }: { mod: typeof MODULE_DATA[0]; index: number; onEnquiry: () => void }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      className="group relative"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <div
        className="relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border border-white/60 hover:shadow-xl hover:-translate-y-0.5"
        style={{
          background: "rgba(255,255,255,0.75)",
          backdropFilter: "blur(12px)",
          boxShadow: "0 4px 24px -8px rgba(0,0,0,0.1)",
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="h-1" style={{ background: mod.iconBg }} />

        <div className="p-5">
          <div className="flex items-start gap-4">
            <div
              className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center border border-white/80"
              style={{ background: mod.lightBg, boxShadow: "0 2px 8px -2px rgba(0,0,0,0.1)" }}
            >
              {mod.icon}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide"
                  style={{ color: mod.color, backgroundColor: mod.lightBg }}
                >
                  Module {mod.id}
                </span>
                <span className="text-[10px] text-gray-400">{mod.topics.length} topics</span>
              </div>

              <h3 className="text-lg font-bold text-gray-900 leading-tight">{mod.title}</h3>
              <p className="mt-0.5 text-sm text-gray-500">{mod.subtitle}</p>
            </div>

            <motion.div
              className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.25 }}
            >
              <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </motion.div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: mod.iconBg }}
                initial={{ width: "0%" }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
              />
            </div>
            <span className="text-[11px] font-medium" style={{ color: mod.color }}>
              {mod.topics.length} lessons
            </span>
          </div>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="space-y-2">
                    {mod.topics.map((topic, tIdx) => {
                      const parts = topic.split(" — ");
                      return (
                        <motion.div
                          key={tIdx}
                          className="flex items-start gap-3 p-2.5 rounded-lg transition-colors hover:bg-white/60"
                          style={{ backgroundColor: `${mod.lightBg}80` }}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: tIdx * 0.03 }}
                        >
                          <div
                            className="shrink-0 w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold mt-0.5"
                            style={{ backgroundColor: mod.lightBg, color: mod.color }}
                          >
                            {tIdx + 1}
                          </div>
                          <div className="flex-1">
                            <p className="text-[13px] font-medium text-gray-800">{parts[0]}</p>
                            {parts[1] && <p className="text-[11px] text-gray-500 mt-0.5">{parts[1]}</p>}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  <motion.button
                    onClick={(e) => { e.stopPropagation(); onEnquiry(); }}
                    className="mt-4 w-full py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer transition-transform"
                    style={{ background: mod.iconBg }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Get Detailed Syllabus
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

function ModulesSection({ openEnquiry }: { openEnquiry: () => void }) {
  return (
    <section className="relative py-28 px-6 overflow-hidden" style={{
      background: `
        linear-gradient(135deg, #fefce8 0%, #fef9ef 20%, #fdf2f8 40%, #f0f9ff 60%, #ecfeff 80%, #f0fdf4 100%)
      `
    }}>
      {/* ── Morphing aurora blobs with conic gradients ── */}
      <motion.div className="absolute w-[600px] h-[600px] pointer-events-none" style={{ top: "-15%", left: "-10%", background: "conic-gradient(from 0deg, rgba(251,191,36,0.12), rgba(236,72,153,0.08), rgba(139,92,246,0.1), rgba(251,191,36,0.12))", borderRadius: "40% 60% 55% 45% / 55% 40% 60% 45%", filter: "blur(80px)" }}
        animate={{ borderRadius: ["40% 60% 55% 45% / 55% 40% 60% 45%", "55% 45% 40% 60% / 40% 55% 45% 60%", "45% 55% 60% 40% / 60% 45% 55% 40%", "40% 60% 55% 45% / 55% 40% 60% 45%"], rotate: [0, 120, 240, 360] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="absolute w-[500px] h-[500px] pointer-events-none" style={{ top: "30%", right: "-5%", background: "conic-gradient(from 180deg, rgba(6,182,212,0.1), rgba(59,130,246,0.08), rgba(139,92,246,0.1), rgba(6,182,212,0.1))", borderRadius: "60% 40% 45% 55% / 45% 60% 40% 55%", filter: "blur(80px)" }}
        animate={{ borderRadius: ["60% 40% 45% 55% / 45% 60% 40% 55%", "40% 60% 55% 45% / 60% 40% 55% 45%", "55% 45% 40% 60% / 40% 55% 45% 60%", "60% 40% 45% 55% / 45% 60% 40% 55%"], rotate: [0, -90, -180, -360] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="absolute w-[450px] h-[450px] pointer-events-none" style={{ bottom: "-10%", left: "20%", background: "conic-gradient(from 90deg, rgba(245,130,32,0.08), rgba(16,185,129,0.1), rgba(59,130,246,0.06), rgba(245,130,32,0.08))", borderRadius: "45% 55% 60% 40% / 55% 45% 55% 45%", filter: "blur(70px)" }}
        animate={{ borderRadius: ["45% 55% 60% 40% / 55% 45% 55% 45%", "55% 45% 45% 55% / 45% 55% 60% 40%", "40% 60% 55% 45% / 60% 40% 45% 55%", "45% 55% 60% 40% / 55% 45% 55% 45%"], rotate: [0, 60, 180, 360], scale: [1, 1.15, 0.95, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }} />

      {/* ── Floating constellation SVG ── */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="mod-lg1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#f59e0b" stopOpacity="0.15" /><stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.08" /></linearGradient>
          <linearGradient id="mod-lg2" x1="100%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#06b6d4" stopOpacity="0.12" /><stop offset="100%" stopColor="#ec4899" stopOpacity="0.06" /></linearGradient>
        </defs>
        {[
          { x1: "10%", y1: "15%", x2: "35%", y2: "25%", g: "url(#mod-lg1)", d: 0.5 },
          { x1: "35%", y1: "25%", x2: "25%", y2: "55%", g: "url(#mod-lg1)", d: 0.8 },
          { x1: "25%", y1: "55%", x2: "10%", y2: "75%", g: "url(#mod-lg2)", d: 1.1 },
          { x1: "65%", y1: "10%", x2: "80%", y2: "35%", g: "url(#mod-lg2)", d: 0.6 },
          { x1: "80%", y1: "35%", x2: "70%", y2: "60%", g: "url(#mod-lg1)", d: 0.9 },
          { x1: "70%", y1: "60%", x2: "90%", y2: "80%", g: "url(#mod-lg2)", d: 1.2 },
          { x1: "35%", y1: "25%", x2: "65%", y2: "10%", g: "url(#mod-lg2)", d: 1.0 },
          { x1: "25%", y1: "55%", x2: "70%", y2: "60%", g: "url(#mod-lg1)", d: 1.3 },
        ].map((l, i) => (
          <motion.line key={`cl${i}`} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke={l.g} strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }} transition={{ duration: 2, delay: l.d }} />
        ))}
        {[
          { cx: "10%", cy: "15%", c: "#f59e0b", r: 4, d: 0 },
          { cx: "35%", cy: "25%", c: "#8b5cf6", r: 5, d: 1 },
          { cx: "25%", cy: "55%", c: "#ec4899", r: 4, d: 2 },
          { cx: "10%", cy: "75%", c: "#10b981", r: 3.5, d: 3 },
          { cx: "65%", cy: "10%", c: "#06b6d4", r: 4, d: 0.5 },
          { cx: "80%", cy: "35%", c: "#3b82f6", r: 5, d: 1.5 },
          { cx: "70%", cy: "60%", c: "#d97706", r: 4, d: 2.5 },
          { cx: "90%", cy: "80%", c: "#7c3aed", r: 3.5, d: 3.5 },
        ].map((dot, i) => (
          <motion.circle key={`nd${i}`} cx={dot.cx} cy={dot.cy} r={dot.r} fill={dot.c} opacity={0.2}
            animate={{ r: [dot.r, dot.r + 2, dot.r], opacity: [0.15, 0.3, 0.15] }}
            transition={{ duration: 3, repeat: Infinity, delay: dot.d, ease: "easeInOut" }} />
        ))}
        {[0, 2.5, 5].map((d, i) => (
          <motion.circle key={`tp${i}`} r="1.5" fill={["#f59e0b", "#8b5cf6", "#06b6d4"][i]} opacity={0.2}
            animate={{ cx: ["10%", "35%", "25%", "70%", "90%", "65%", "10%"], cy: ["15%", "25%", "55%", "60%", "80%", "10%", "15%"] }}
            transition={{ duration: 9 + i, repeat: Infinity, delay: d, ease: "linear" }} />
        ))}
      </svg>

      {/* ── Floating geometric shapes ── */}
      {[
        { top: "8%", left: "5%", sz: 40, rot: 45, c: "rgba(245,130,32,0.06)", bc: "rgba(245,130,32,0.15)", dur: 15, br: "6px" },
        { top: "20%", right: "8%", sz: 55, rot: 0, c: "rgba(139,92,246,0.05)", bc: "rgba(139,92,246,0.12)", dur: 20, br: "25% 10%" },
        { top: "60%", left: "3%", sz: 35, rot: 30, c: "rgba(6,182,212,0.06)", bc: "rgba(6,182,212,0.15)", dur: 18, br: "0 50% 50%" },
        { top: "75%", right: "6%", sz: 45, rot: 0, c: "rgba(236,72,153,0.05)", bc: "rgba(236,72,153,0.12)", dur: 16, br: "50%" },
        { top: "45%", left: "50%", sz: 28, rot: 60, c: "rgba(16,185,129,0.05)", bc: "rgba(16,185,129,0.12)", dur: 22, br: "4px" },
      ].map((s, i) => (
        <motion.div key={`geo-${i}`} className="absolute pointer-events-none"
          style={{ top: s.top, ...("left" in s ? { left: s.left } : {}), ...("right" in s ? { right: (s as unknown as Record<string, string>).right } : {}), width: s.sz, height: s.sz, border: `1.5px solid ${s.bc}`, backgroundColor: s.c, borderRadius: s.br, transform: `rotate(${s.rot}deg)` }}
          animate={{ y: [0, -20, 10, -15, 0], rotate: [s.rot, s.rot + 90, s.rot + 180, s.rot + 270, s.rot + 360], scale: [1, 1.1, 0.95, 1.05, 1] }}
          transition={{ duration: s.dur, repeat: Infinity, ease: "easeInOut" }} />
      ))}

      {/* ── Animated light streaks ── */}
      <motion.div className="absolute top-[18%] left-0 w-full h-px pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent, rgba(245,130,32,0.08) 20%, rgba(139,92,246,0.06) 50%, rgba(6,182,212,0.08) 80%, transparent)" }}
        animate={{ opacity: [0, 0.6, 0], x: ["-10%", "5%", "-10%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="absolute top-[52%] left-0 w-full h-px pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent, rgba(6,182,212,0.06) 30%, rgba(236,72,153,0.08) 60%, transparent)" }}
        animate={{ opacity: [0, 0.5, 0], x: ["5%", "-8%", "5%"] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 3 }} />
      <motion.div className="absolute top-[82%] left-0 w-full h-px pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.08) 40%, rgba(245,130,32,0.06) 70%, transparent)" }}
        animate={{ opacity: [0, 0.4, 0], x: ["-5%", "8%", "-5%"] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 5 }} />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* ── Section Header ── */}
        <ScrollReveal>
          <div className="text-center mb-16">
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200/80 bg-white/70 backdrop-blur-sm shadow-sm mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="flex items-center gap-1.5">
                {MODULE_DATA.slice(0, 6).map((m, i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full"
                    style={{ background: m.iconBg }}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.06, type: "spring" }}
                  />
                ))}
              </span>
              <span className="text-xs font-semibold text-gray-600 tracking-wide">6 Modules · 36+ Topics · 32 Weeks</span>
            </motion.div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              What You&apos;ll{" "}
              <span className="relative inline-block">
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${BRAND_ORANGE}, #e11d48, #7c3aed, #0891b2)` }}>
                  Master
                </span>
                <motion.svg
                  className="absolute -bottom-2 left-0 w-full h-3"
                  viewBox="0 0 200 12"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <motion.path
                    d="M2 8 C30 3, 60 11, 100 6 S160 2, 198 7"
                    stroke={BRAND_ORANGE}
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                  />
                </motion.svg>
              </span>
            </h2>
            <p className="mt-5 text-gray-500 text-lg max-w-xl mx-auto leading-relaxed">
              Each module builds on the last — from Python basics to production AI. Click any module to explore what&apos;s inside.
            </p>
          </div>
        </ScrollReveal>

        {/* ── Bento Grid of Module Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {MODULE_DATA.map((mod, idx) => (
            <ModuleCard key={mod.id} mod={mod} index={idx} onEnquiry={openEnquiry} />
          ))}
        </div>

        {/* ── Bottom Stats Cards ── */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
            {[
              { value: "6", label: "Modules", color: BRAND_ORANGE, gradient: "from-orange-500 to-amber-400", icon: (<svg viewBox="0 0 24 24" fill="none" className="w-6 h-6"><rect x="3" y="3" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="2"/><rect x="14" y="3" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="2"/><rect x="3" y="14" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="2"/><rect x="14" y="14" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="2"/></svg>) },
              { value: "36+", label: "Topics", color: "#7c3aed", gradient: "from-violet-500 to-purple-400", icon: (<svg viewBox="0 0 24 24" fill="none" className="w-6 h-6"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><rect x="9" y="3" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="2"/><path d="M9 12h6M9 16h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>) },
              { value: "32", label: "Weeks", color: "#0891b2", gradient: "from-cyan-500 to-teal-400", icon: (<svg viewBox="0 0 24 24" fill="none" className="w-6 h-6"><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M3 10h18" stroke="currentColor" strokeWidth="2"/><path d="M8 2v4M16 2v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>) },
              { value: "25+", label: "Tools", color: "#059669", gradient: "from-emerald-500 to-green-400", icon: (<svg viewBox="0 0 24 24" fill="none" className="w-6 h-6"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>) },
            ].map((stat, i) => (
              <motion.div
                key={i}
                className="group relative"
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + i * 0.1, type: "spring", stiffness: 200 }}
              >
                <div className="relative overflow-hidden rounded-2xl p-5 md:p-6 bg-white/70 backdrop-blur-sm border border-white/80 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                  <div className={`absolute -top-8 -right-8 w-24 h-24 rounded-full bg-gradient-to-br ${stat.gradient} opacity-20 blur-2xl group-hover:opacity-30 transition-opacity`} />
                  <div className="relative w-12 h-12 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: `${stat.color}15` }}>
                    <div style={{ color: stat.color }}>{stat.icon}</div>
                  </div>
                  <motion.p className="relative text-3xl md:text-4xl font-bold" style={{ color: stat.color }} initial={{ scale: 0.5 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.6 + i * 0.1, type: "spring", stiffness: 200 }}>{stat.value}</motion.p>
                  <p className="relative text-sm text-gray-600 font-medium mt-1 uppercase tracking-wide">{stat.label}</p>
                  <div className="absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: `linear-gradient(90deg, ${stat.color}, ${stat.color}80)` }} />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════ */

export default function DataScienceAIPage() {
  const { openEnquiry } = useEnquiryModal();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  const [openFaq, setOpenFaq] = useState(0);
  const [activeTab, setActiveTab] = useState(0);

  /* ── Data ── */
  const personas = [
    { icon: RocketIcon, title: "Future Data Scientists", desc: "You know data is where the world is heading. This program takes you from the fundamentals all the way to building production AI systems.", color: BRAND_ORANGE },
    { icon: BriefcaseIcon, title: "Developers Who Want AI Skills", desc: "You can already code. Now add ML, deep learning, and MLOps to your toolkit and become the person companies fight to hire.", color: ACCENT_BLUE },
    { icon: UserIcon, title: "Career Changers", desc: "Doesn't matter what you did before. This 12-month program teaches everything from scratch — no prior ML experience needed.", color: ACCENT_CYAN },
    { icon: GraduationIcon, title: "AI Enthusiasts", desc: "If you're fascinated by neural networks, NLP, and generative AI, this is where you go from reading about it to actually building it.", color: BRAND_ORANGE },
  ];

  const curriculum = [
    { phase: "01", title: "Foundations", duration: "Weeks 1–10", color: BRAND_ORANGE, skills: ["Python", "NumPy", "Pandas", "Statistics", "Visualization"], topics: [
      "Python fundamentals — variables, loops, functions, OOP",
      "NumPy & Pandas — data manipulation at scale",
      "Statistics & probability — distributions, hypothesis testing",
      "Data visualization — Matplotlib, Seaborn, Plotly",
    ], code: [
      { text: "# Statistical analysis in Python", color: "#8b949e" },
      { text: "import numpy as np", color: "#79c0ff" },
      { text: "from scipy import stats", color: "#79c0ff" },
      { text: "", color: "#e6edf3" },
      { text: "data = np.random.normal(100, 15, 1000)", color: "#e6edf3" },
      { text: "ci = stats.norm.interval(0.95, np.mean(data))", color: "#e6edf3" },
      { text: "", color: "#e6edf3" },
      { text: ">>> 95% CI: (99.1, 101.8)", color: "#7ee787" },
    ]},
    { phase: "02", title: "Machine Learning", duration: "Weeks 11–18", color: ACCENT_BLUE, skills: ["Scikit-learn", "XGBoost", "SHAP", "Feature Engineering"], topics: [
      "Supervised learning — regression, classification, trees",
      "Unsupervised learning — clustering, dimensionality reduction",
      "Model evaluation — cross-validation, hyperparameter tuning",
      "Feature engineering & explainability with SHAP",
    ], code: [
      { text: "# XGBoost with SHAP explainability", color: "#8b949e" },
      { text: "import xgboost as xgb", color: "#79c0ff" },
      { text: "import shap", color: "#79c0ff" },
      { text: "", color: "#e6edf3" },
      { text: "model = xgb.XGBClassifier(n_estimators=200)", color: "#e6edf3" },
      { text: "model.fit(X_train, y_train)", color: "#e6edf3" },
      { text: "explainer = shap.TreeExplainer(model)", color: "#e6edf3" },
      { text: "", color: "#e6edf3" },
      { text: ">>> Accuracy: 96.3% | AUC: 0.98", color: "#7ee787" },
    ]},
    { phase: "03", title: "Deep Learning & NLP", duration: "Weeks 19–28", color: ACCENT_CYAN, skills: ["TensorFlow", "PyTorch", "BERT", "GPT", "LangChain"], topics: [
      "Neural networks — CNNs, RNNs, LSTMs, Transformers",
      "NLP — tokenization, embeddings, BERT, GPT fine-tuning",
      "Computer vision — image classification, object detection",
      "Generative AI — prompt engineering, RAG, LangChain",
    ], code: [
      { text: "# BERT sentiment analysis", color: "#8b949e" },
      { text: "from transformers import pipeline", color: "#79c0ff" },
      { text: "", color: "#e6edf3" },
      { text: 'classifier = pipeline("sentiment-analysis")', color: "#e6edf3" },
      { text: 'result = classifier("This product is amazing!")', color: "#e6edf3" },
      { text: "", color: "#e6edf3" },
      { text: '>>> [{"label": "POSITIVE", "score": 0.9998}]', color: "#7ee787" },
    ]},
  ];

  const tools = ["Python", "NumPy", "Pandas", "Matplotlib", "Seaborn", "Scikit-learn", "TensorFlow", "PyTorch", "Keras", "XGBoost", "LightGBM", "NLTK", "SpaCy", "HuggingFace", "OpenCV", "Docker", "MLflow", "FastAPI", "Flask", "AWS", "GCP", "Jupyter", "Git", "SQL", "MongoDB", "Tableau", "Power BI", "Plotly", "Streamlit", "LangChain"];

  const projects = [
    { title: "Credit Scoring Model", desc: "Build an XGBoost-powered credit risk model with SHAP explainability and production-ready API.", tags: ["XGBoost", "SHAP", "FastAPI"], color: BRAND_ORANGE, complexity: 2, outcome: "96.3% accuracy", icon: (<svg viewBox="0 0 48 48" fill="none" className="w-full h-full"><rect x="4" y="28" width="8" height="14" rx="2" fill="#F5822040" stroke="#F58220" strokeWidth="1.5"/><rect x="16" y="18" width="8" height="24" rx="2" fill="#F5822060" stroke="#F58220" strokeWidth="1.5"/><rect x="28" y="10" width="8" height="32" rx="2" fill="#F5822080" stroke="#F58220" strokeWidth="1.5"/><path d="M8 24L20 14L32 18L42 6" stroke="#F58220" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="42" cy="6" r="3" fill="#F58220"/></svg>) },
    { title: "Fraud Detection System", desc: "Real-time anomaly detection using ensemble methods and automated alerting pipeline.", tags: ["Scikit-learn", "Kafka", "Docker"], color: ACCENT_BLUE, complexity: 3, outcome: "Real-time alerts", icon: (<svg viewBox="0 0 48 48" fill="none" className="w-full h-full"><circle cx="24" cy="24" r="18" stroke="#3B82F620" strokeWidth="1"/><circle cx="18" cy="18" r="8" fill="#3B82F630" stroke="#3B82F6" strokeWidth="1.5"/><circle cx="32" cy="18" r="6" fill="#60A5FA30" stroke="#60A5FA" strokeWidth="1.5"/><circle cx="22" cy="32" r="7" fill="#93C5FD30" stroke="#93C5FD" strokeWidth="1.5"/><circle cx="34" cy="30" r="5" fill="#3B82F620" stroke="#3B82F6" strokeWidth="1.5"/></svg>) },
    { title: "NLP Sentiment Pipeline", desc: "BERT-based sentiment analysis with HuggingFace Transformers and production Flask API.", tags: ["BERT", "HuggingFace", "Flask"], color: ACCENT_CYAN, complexity: 3, outcome: "Production API", icon: (<svg viewBox="0 0 48 48" fill="none" className="w-full h-full"><path d="M6 38C6 38 14 34 20 22C26 10 34 8 42 12" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round"/><path d="M6 38C6 38 14 36 22 30C30 24 38 26 42 12" stroke="#06B6D440" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 3"/><circle cx="20" cy="22" r="3" fill="#06B6D4" opacity="0.8"/><circle cx="34" cy="14" r="3" fill="#06B6D4" opacity="0.6"/><circle cx="14" cy="34" r="2.5" fill="#06B6D4" opacity="0.4"/><rect x="30" y="30" width="14" height="12" rx="2" fill="#06B6D415" stroke="#06B6D4" strokeWidth="1"/><text x="37" y="38" textAnchor="middle" fill="#06B6D4" fontSize="7" fontFamily="monospace" fontWeight="bold">API</text></svg>) },
    { title: "End-to-End ML Deployment", desc: "Complete MLOps pipeline: Docker, FastAPI, CI/CD with GitHub Actions, MLflow monitoring.", tags: ["Docker", "FastAPI", "MLflow"], color: BRAND_ORANGE, complexity: 4, outcome: "12ms latency", icon: (<svg viewBox="0 0 48 48" fill="none" className="w-full h-full"><rect x="2" y="18" width="12" height="12" rx="3" fill="#F5822020" stroke="#F58220" strokeWidth="1.5"/><rect x="18" y="18" width="12" height="12" rx="3" fill="#F5822040" stroke="#F58220" strokeWidth="1.5"/><rect x="34" y="18" width="12" height="12" rx="3" fill="#F5822060" stroke="#F58220" strokeWidth="1.5"/><path d="M14 24H18" stroke="#F58220" strokeWidth="2" strokeLinecap="round"/><path d="M30 24H34" stroke="#F58220" strokeWidth="2" strokeLinecap="round"/><path d="M8 18V10H24V18" stroke="#F5822050" strokeWidth="1" strokeLinecap="round" strokeDasharray="2 2"/><path d="M24 30V38H40V30" stroke="#F5822050" strokeWidth="1" strokeLinecap="round" strokeDasharray="2 2"/></svg>) },
  ];

  const roles = [
    { title: "Data Scientist", range: "8–15 LPA", icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M21 12V7H5a2 2 0 010-4h14v4"/><path d="M3 5v14a2 2 0 002 2h16v-5"/><path d="M18 12a2 2 0 000 4h4v-4h-4z"/></svg>) },
    { title: "ML Engineer", range: "10–18 LPA", icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M2 20h20"/><path d="M5 20V10l4-4 4 4 4-8 4 4v14"/></svg>) },
    { title: "AI Engineer", range: "10–20 LPA", icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>) },
    { title: "NLP Engineer", range: "9–16 LPA", icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"/></svg>) },
    { title: "MLOps Engineer", range: "10–18 LPA", icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><circle cx="6" cy="6" r="1" fill="currentColor"/><circle cx="6" cy="18" r="1" fill="currentColor"/></svg>) },
    { title: "Data Architect", range: "12–20 LPA", icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 000 20 14.5 14.5 0 000-20"/><path d="M2 12h20"/></svg>) },
  ];

  const faqs = [
    { question: "Can a complete beginner do this?", answer: "Yes. Module 1 starts with Python basics. No prior ML or programming experience needed. By month 3, you'll be building real ML models." },
    { question: "How is this different from Data Analytics?", answer: "Data Analytics focuses on visualization and reporting. This goes way deeper — deep learning, NLP, generative AI, MLOps, cloud deployment. It's for people who want to build AI, not just look at dashboards." },
    { question: "What's the capstone project like?", answer: "You build a full ML system end-to-end: define the problem, collect data, train models, deploy a production API, and set up monitoring. Past students have built fraud detectors, medical image classifiers, and chatbots." },
    { question: "Do you cover generative AI?", answer: "Yes — GANs, LLMs, prompt engineering, fine-tuning with HuggingFace. You'll build actual generative AI applications, not just talk about them." },
    { question: "What about placement support?", answer: "Only 100% placement. No guarantee or assistance." },
  ];

  const highlights = [
    { icon: ShieldIcon, label: "Only 100% Placement", sub: "No guarantee or assistance", color: BRAND_ORANGE },
    { icon: CurrencyIcon, label: "0% EMI Available", sub: "Starting ₹8,000/mo", color: ACCENT_BLUE },
    { icon: SparklesIcon, label: "AI Certifications", sub: "AWS + Azure ML prep", color: ACCENT_CYAN },
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

        {/* Floating code fragments */}
        {[
          { text: "model.fit()", x: "8%", y: "15%", dur: 18, delay: 0 },
          { text: "import torch", x: "85%", y: "22%", dur: 22, delay: 2 },
          { text: "neural_net()", x: "72%", y: "75%", dur: 20, delay: 4 },
          { text: ".predict()", x: "15%", y: "70%", dur: 24, delay: 1 },
          { text: "loss: 0.003", x: "55%", y: "12%", dur: 19, delay: 3 },
          { text: "transformers", x: "90%", y: "55%", dur: 21, delay: 5 },
          { text: "epoch: 50/50", x: "30%", y: "85%", dur: 23, delay: 2 },
          { text: "accuracy: 96.3%", x: "45%", y: "90%", dur: 17, delay: 6 },
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
          <motion.path d="M-100,200 C200,100 400,350 700,180 S1100,300 1500,150" fill="none" stroke="url(#flowGrad1)" strokeWidth="1.5" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 3, delay: 0.5, ease: "easeInOut" }} />
          <motion.path d="M-50,400 C250,300 500,500 800,350 S1200,450 1500,380" fill="none" stroke="url(#flowGrad2)" strokeWidth="1" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 3.5, delay: 1, ease: "easeInOut" }} />
          <motion.path d="M-80,550 C180,480 420,600 720,500 S1050,580 1500,520" fill="none" stroke="url(#flowGrad3)" strokeWidth="1" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 4, delay: 1.5, ease: "easeInOut" }} />
          <motion.circle r="3" fill={BRAND_ORANGE} opacity="0.4" animate={{ cx: [0, 350, 700, 1100, 1500], cy: [200, 150, 250, 200, 150] }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} />
          <motion.circle r="2.5" fill={ACCENT_BLUE} opacity="0.3" animate={{ cx: [0, 400, 800, 1200, 1500], cy: [400, 350, 450, 380, 380] }} transition={{ duration: 10, repeat: Infinity, ease: "linear", delay: 2 }} />
          <motion.circle r="2" fill={ACCENT_CYAN} opacity="0.25" animate={{ cx: [0, 300, 600, 1000, 1500], cy: [550, 500, 560, 520, 520] }} transition={{ duration: 12, repeat: Infinity, ease: "linear", delay: 3 }} />
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
                <span className="px-3 py-1.5 rounded-full text-xs font-mono tracking-wide border border-white/[0.1] bg-white/[0.04] text-gray-400">12 Months</span>
              </motion.div>

              <motion.h1
                className="text-5xl sm:text-6xl lg:text-[4.5rem] font-bold leading-[1.05] tracking-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15, ease }}
              >
                <span className="text-white">Become a</span><br />
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${BRAND_ORANGE}, #f59e0b)` }}>
                  Data Scientist
                </span>
              </motion.h1>

              <motion.div
                className="mt-5 h-8 flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <span className="text-gray-500 text-base">Master</span>
                <TypeWriter
                  words={["Python & TensorFlow", "Deep Learning & NLP", "MLOps & Deployment", "Generative AI", "Computer Vision"]}
                  className="text-base font-mono font-semibold text-white"
                />
              </motion.div>

              <motion.p className="mt-5 text-base md:text-lg text-gray-400 leading-relaxed max-w-lg" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35 }}>
                From your first Python script to deploying ML in production. 12 months of intensive, hands-on AI training. Only 100% placement. No guarantee or assistance.
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

      {/* ═══════ HIGHLIGHTS BAR ═══════ */}
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
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />
        <motion.div className="absolute top-20 -left-32 w-[400px] h-[400px] rounded-full blur-[120px]" style={{ background: `radial-gradient(circle, ${BRAND_ORANGE}30, transparent 70%)` }} animate={{ x: [0, 40, 0], y: [0, -30, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div className="absolute bottom-10 -right-32 w-[350px] h-[350px] rounded-full blur-[120px]" style={{ background: `radial-gradient(circle, ${ACCENT_BLUE}25, transparent 70%)` }} animate={{ x: [0, -30, 0], y: [0, 25, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} />

        <div className="relative max-w-6xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <SectionLabel center light>Built For</SectionLabel>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Is This{" "}
                <motion.span className="relative inline-block" initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3, type: "spring", stiffness: 200 }}>
                  <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${BRAND_ORANGE}, #FF6B6B, ${ACCENT_BLUE})` }}>You</span>
                  <motion.span className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full" style={{ background: `linear-gradient(90deg, ${BRAND_ORANGE}, ${ACCENT_BLUE})` }} initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }} />
                </motion.span>
                ?
              </h2>
              <motion.p className="mt-4 text-gray-400 text-lg max-w-md mx-auto" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.4 }}>
                Designed for people who want real AI skills, not just another certificate.
              </motion.p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {personas.map((p, i) => (
              <motion.div key={i} className="group relative" initial={{ opacity: 0, y: 60, rotateX: 15 }} whileInView={{ opacity: 1, y: 0, rotateX: 0 }} viewport={{ once: true, margin: "-5%" }} transition={{ duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}>
                <div className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[1px]" style={{ background: `linear-gradient(135deg, ${p.color}60, transparent 50%, ${p.color}30)` }} />
                <div className="relative bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-7 group-hover:bg-white/[0.07] transition-all duration-500">
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: `radial-gradient(300px circle at 50% 50%, ${p.color}08, transparent 60%)` }} />
                  <div className="relative flex items-start gap-5">
                    <motion.div className="relative w-14 h-14 rounded-xl flex items-center justify-center shrink-0 overflow-hidden" style={{ backgroundColor: `${p.color}15` }} whileHover={{ scale: 1.1, rotate: 5 }} transition={{ type: "spring", stiffness: 400, damping: 15 }}>
                      <motion.div className="absolute inset-0" style={{ background: `linear-gradient(105deg, transparent 40%, ${p.color}20 50%, transparent 60%)` }} animate={{ x: ["-100%", "200%"] }} transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }} />
                      <p.icon className="relative w-6 h-6" style={{ color: p.color }} />
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-bold text-white">{p.title}</h3>
                        <motion.div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p.color }} animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }} />
                      </div>
                      <p className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">{p.desc}</p>
                    </div>
                    <motion.div className="shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300" animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7 4l6 6-6 6" stroke={p.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
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
              { icon: LayersIcon, title: "Industry Vetted Curriculum", desc: "Targeted training for Data Science, Machine Learning, and AI at the standards expected by top tech giants.", color: ACCENT_CYAN },
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

      {/* ═══════ CURRICULUM — Timeline with JourneyPhaseCard ═══════ */}
      <section className="relative py-16 px-6 bg-white overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <SectionLabel center>Curriculum</SectionLabel>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy-900 leading-tight text-center">
              Your Learning{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${BRAND_ORANGE}, ${ACCENT_CYAN})` }}>Journey</span>
            </h2>
            <p className="mt-3 text-gray-500 text-base max-w-lg mx-auto text-center">
              12 months of intensive training — from Python basics to production AI. Click each phase to explore.
            </p>
          </ScrollReveal>

          <div className="relative mt-14">
            <div className="absolute left-7 top-0 bottom-0 w-px bg-gray-200 hidden md:block">
              <motion.div className="w-full bg-gradient-to-b from-orange-400 via-blue-400 to-cyan-400" initial={{ height: "0%" }} whileInView={{ height: "100%" }} viewport={{ once: true }} transition={{ duration: 1.5, delay: 0.3, ease }} />
            </div>
            <div className="space-y-6 md:pl-20 relative">
              {curriculum.map((mod, i) => (
                <div key={i} className="relative">
                  <div className="hidden md:flex absolute -left-20 top-8 items-center">
                    <motion.div className="w-[14px] h-[14px] rounded-full border-[3px] border-white shadow-md z-10" style={{ backgroundColor: mod.color }} initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.15 + 0.3, type: "spring", stiffness: 300 }} />
                    <div className="w-[30px] h-px" style={{ backgroundColor: `${mod.color}40` }} />
                  </div>
                  <JourneyPhaseCard mod={mod} index={i} isOpen={activeTab === i} onToggle={() => setActiveTab(activeTab === i ? -1 : i)} codeLines={mod.code} />
                </div>
              ))}
            </div>
          </div>

          <motion.div className="mt-10 flex items-center justify-center gap-3" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.6 }}>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm">
              <div className="flex -space-x-1">
                {curriculum.map((mod, i) => (<motion.div key={i} className="w-3 h-3 rounded-full border-2 border-white" style={{ backgroundColor: mod.color }} initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.8 + i * 0.1, type: "spring" }} />))}
              </div>
              <span className="text-xs font-semibold text-gray-600">3 phases</span>
              <span className="text-xs text-gray-400">·</span>
              <span className="text-xs font-mono text-gray-400">12 months</span>
              <span className="text-xs text-gray-400">·</span>
              <span className="text-xs font-semibold" style={{ color: BRAND_ORANGE }}>AI ready</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════ MODULES ═══════ */}
      <ModulesSection openEnquiry={openEnquiry} />

      {/* ═══════ TOOLS — Two-row marquee ═══════ */}
      <section className="relative py-20 px-6 bg-white overflow-hidden">
        <Divider />
        <div className="max-w-6xl mx-auto pt-12">
          <ScrollReveal>
            <SectionLabel center>Tech Stack</SectionLabel>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy-900 leading-tight text-center">
              {tools.length} Tools You&apos;ll{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${ACCENT_BLUE}, ${BRAND_ORANGE})` }}>Master</span>
            </h2>
          </ScrollReveal>

          <div className="mt-14 space-y-4">
            {[tools.slice(0, 15), tools.slice(15, 30)].map((row, ri) => (
              <div key={ri} className="relative overflow-hidden" style={{ maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)", WebkitMaskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)" }}>
                <motion.div
                  className="flex gap-4 w-max"
                  animate={{ x: ri === 0 ? ["0%", "-50%"] : ["-50%", "0%"] }}
                  transition={{ duration: ri === 0 ? 35 : 40, repeat: Infinity, ease: "linear" }}
                >
                  {[...row, ...row].map((tool, i) => (
                    <div key={`${tool}-${i}`} className="shrink-0">
                      <ToolLogo name={tool} />
                    </div>
                  ))}
                </motion.div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4"><Divider /></div>
      </section>

      {/* ═══════ PROJECTS ═══════ */}
      <section className="relative py-16 px-6 overflow-hidden" style={{ backgroundColor: DARK_BG }}>
        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <defs>
            <linearGradient id="ribbonA" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={BRAND_ORANGE} stopOpacity="0" />
              <stop offset="20%" stopColor={BRAND_ORANGE} stopOpacity="0.15" />
              <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.08" />
              <stop offset="80%" stopColor={ACCENT_CYAN} stopOpacity="0.12" />
              <stop offset="100%" stopColor={ACCENT_CYAN} stopOpacity="0" />
            </linearGradient>
            <linearGradient id="ribbonB" x1="100%" y1="0%" x2="0%" y2="0%">
              <stop offset="0%" stopColor={ACCENT_BLUE} stopOpacity="0" />
              <stop offset="30%" stopColor={ACCENT_BLUE} stopOpacity="0.1" />
              <stop offset="60%" stopColor="#8b5cf6" stopOpacity="0.07" />
              <stop offset="100%" stopColor={ACCENT_BLUE} stopOpacity="0" />
            </linearGradient>
            <filter id="ribbonGlow"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          </defs>
          <motion.path d="M-100,120 C150,40 350,200 600,80 S950,180 1200,60 1500,140" fill="none" stroke="url(#ribbonA)" strokeWidth="2" filter="url(#ribbonGlow)" initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 2.5, ease: "easeInOut" }} />
          <motion.path d="M-50,320 C200,250 450,400 700,280 S1050,380 1300,300 1600,350" fill="none" stroke="url(#ribbonB)" strokeWidth="2" filter="url(#ribbonGlow)" initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 3, delay: 0.4, ease: "easeInOut" }} />
          <motion.circle r="4" fill={BRAND_ORANGE} opacity="0.6" filter="url(#ribbonGlow)" animate={{ cx: [-100, 150, 600, 1200, 1500], cy: [120, 40, 80, 60, 140] }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} />
          <motion.circle r="3" fill={ACCENT_BLUE} opacity="0.5" filter="url(#ribbonGlow)" animate={{ cx: [-50, 200, 700, 1300, 1600], cy: [320, 250, 280, 300, 350] }} transition={{ duration: 10, repeat: Infinity, ease: "linear", delay: 2 }} />
        </svg>

        <div className="max-w-5xl mx-auto relative z-10">
          <ScrollReveal>
            <SectionLabel light>Hands-On</SectionLabel>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Projects You&apos;ll{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${ACCENT_CYAN}, ${BRAND_ORANGE})` }}>Ship</span>
            </h2>
            <p className="mt-3 text-gray-500 text-base max-w-md">Production-grade AI projects that become your portfolio.</p>
          </ScrollReveal>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-3">
            {projects.map((project, i) => (
              <motion.div key={i} className="group relative rounded-xl overflow-hidden cursor-default" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-5%" }} transition={{ duration: 0.5, delay: i * 0.08, ease }} whileHover={{ y: -3 }}>
                <div className="absolute inset-0 rounded-xl border border-white/[0.06] group-hover:border-white/[0.14] transition-colors duration-500 pointer-events-none z-20" />
                <div className="relative z-10 p-5" style={{ backgroundColor: "rgba(255,255,255,0.02)" }}>
                  <div className="flex gap-4">
                    <div className="shrink-0 w-12 h-12 rounded-lg flex items-center justify-center p-1.5" style={{ backgroundColor: `${project.color}08`, border: `1px solid ${project.color}15` }}>{project.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-bold font-mono" style={{ color: `${project.color}90` }}>{String(i + 1).padStart(2, "0")}</span>
                        <div className="flex gap-0.5">{[0, 1, 2, 3].map((j) => (<div key={j} className="w-1 h-1 rounded-full" style={{ backgroundColor: j < project.complexity ? project.color : "rgba(255,255,255,0.08)" }} />))}</div>
                        <span className="text-[9px] text-gray-600 uppercase tracking-wider">{["Beginner", "Intermediate", "Advanced", "Capstone"][project.complexity - 1]}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white/90 group-hover:text-white transition-colors duration-300 mb-1 leading-snug">{project.title}</h4>
                      <p className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors duration-300 leading-relaxed mb-2.5">{project.desc}</p>
                      <div className="flex flex-wrap gap-1.5">{project.tags.map((tag) => (<span key={tag} className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium border" style={{ color: `${project.color}bb`, borderColor: `${project.color}18`, backgroundColor: `${project.color}06` }}>{tag}</span>))}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 mt-3 pt-2.5 border-t border-white/[0.04]">
                    <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3 shrink-0" style={{ color: project.color }}><path d="M2 8.5L6 12.5L14 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <span className="text-[11px] text-gray-500 truncate">{project.outcome}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div className="mt-10 relative max-w-4xl mx-auto" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <DashboardPreview />
          </motion.div>
        </div>
      </section>

      {/* ═══════ CAREER OUTCOMES ═══════ */}
      <section className="relative py-20 px-6 bg-white overflow-hidden">
        <motion.div className="absolute -top-20 -right-20 w-80 h-80 rounded-full blur-[120px] pointer-events-none" style={{ backgroundColor: `${BRAND_ORANGE}0A` }} animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full blur-[140px] pointer-events-none" style={{ backgroundColor: `${ACCENT_BLUE}08` }} animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} />

        <div className="max-w-6xl mx-auto relative z-10">
          <ScrollReveal>
            <SectionLabel>Outcomes</SectionLabel>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy-900 leading-tight">
              Where You&apos;ll{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${BRAND_ORANGE}, ${ACCENT_BLUE})` }}>End Up</span>
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-14">
            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {roles.map((role, i) => (
                <SlideIn key={i} direction="up" delay={i * 0.08}>
                  <motion.div className="group relative rounded-2xl border border-gray-100 bg-white p-5 cursor-default overflow-hidden" whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(0,0,0,0.08)" }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                    <motion.div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ background: `linear-gradient(135deg, ${BRAND_ORANGE}15, ${ACCENT_BLUE}15)` }} />
                    <div className="relative flex items-center gap-4">
                      <motion.div className="flex items-center justify-center w-11 h-11 rounded-xl shrink-0" style={{ backgroundColor: `${i % 2 === 0 ? BRAND_ORANGE : ACCENT_BLUE}12` }} whileHover={{ rotate: 8, scale: 1.1 }} transition={{ type: "spring", stiffness: 300, damping: 15 }}>
                        <span style={{ color: i % 2 === 0 ? BRAND_ORANGE : ACCENT_BLUE }}>{role.icon}</span>
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900">{role.title}</h4>
                        <p className="text-xs text-gray-500 mt-0.5 font-mono tracking-wide">{role.range}</p>
                      </div>
                      <motion.div className="opacity-0 group-hover:opacity-100 transition-opacity" initial={false} whileHover={{ x: 3 }}>
                        <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                      </motion.div>
                    </div>
                  </motion.div>
                </SlideIn>
              ))}
            </div>

            <div className="lg:col-span-2 space-y-5 flex flex-col justify-center">
              <SlideIn direction="right">
                <motion.div className="relative rounded-2xl border border-gray-100 p-7 overflow-hidden" style={{ background: "linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)" }} whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                  <motion.div className="absolute inset-0 pointer-events-none" style={{ background: `linear-gradient(105deg, transparent 40%, ${BRAND_ORANGE}08 50%, transparent 60%)` }} animate={{ x: ["-100%", "200%"] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }} />
                  <p className="text-xs font-mono text-gray-400 tracking-widest uppercase mb-3 relative">Expected Salary Range</p>
                  <motion.p className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent relative" style={{ backgroundImage: `linear-gradient(135deg, ${BRAND_ORANGE}, ${ACCENT_BLUE})` }} initial={{ backgroundSize: "100%" }}>₹8–20 LPA</motion.p>
                </motion.div>
              </SlideIn>

              <SlideIn direction="right" delay={0.1}>
                <motion.div className="flex items-center gap-4 px-5 py-4 rounded-xl border border-gray-100 bg-gradient-to-r from-gray-50 to-white" whileHover={{ x: 4, boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                  <motion.div className="flex items-center justify-center w-10 h-10 rounded-full shrink-0" style={{ backgroundColor: `${BRAND_ORANGE}15` }} animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
                    <ShieldIcon className="w-5 h-5" style={{ color: BRAND_ORANGE }} />
                  </motion.div>
                  <div>
                    <p className="text-sm text-gray-900 font-semibold">Only 100% Placement</p>
                    <p className="text-xs text-gray-500">No guarantee or assistance</p>
                  </div>
                </motion.div>
              </SlideIn>

              <SlideIn direction="right" delay={0.2}>
                <motion.div className="flex items-center gap-4 px-5 py-4 rounded-xl border border-gray-100 bg-gradient-to-r from-gray-50 to-white" whileHover={{ x: 4, boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                  <motion.div className="flex items-center justify-center w-10 h-10 rounded-full shrink-0" style={{ backgroundColor: `${ACCENT_BLUE}15` }} animate={{ rotate: [0, 10, 0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", type: "tween" }}>
                    <SparklesIcon className="w-5 h-5" style={{ color: ACCENT_BLUE }} />
                  </motion.div>
                  <div>
                    <p className="text-sm text-gray-900 font-semibold">AWS & Azure ML Certifications</p>
                    <p className="text-xs text-gray-500">Cloud AI certification prep included</p>
                  </div>
                </motion.div>
              </SlideIn>
            </div>
          </div>
        </div>
      </section>

      <WaveDivider from="#ffffff" to="#f9fafb" />

      {/* ═══════ TESTIMONIALS ═══════ */}
      <section className="relative py-24 px-6 overflow-hidden" style={{ background: 'linear-gradient(180deg, #f9fafb 0%, #f1f5f9 50%, #f9fafb 100%)' }}>
        <motion.div className="absolute top-20 left-[10%] w-72 h-72 rounded-full blur-[100px] pointer-events-none" style={{ backgroundColor: `${BRAND_ORANGE}08` }} animate={{ x: [0, 40, 0], y: [0, -20, 0] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div className="absolute bottom-20 right-[10%] w-80 h-80 rounded-full blur-[120px] pointer-events-none" style={{ backgroundColor: `${ACCENT_BLUE}06` }} animate={{ x: [0, -30, 0], y: [0, 25, 0] }} transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }} />

        <div className="max-w-6xl mx-auto relative z-10">
          <ScrollReveal>
            <SectionLabel center>Success Stories</SectionLabel>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy-900 leading-tight text-center">
              What Learners Say{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${BRAND_ORANGE}, ${ACCENT_BLUE})` }}>About Us</span>
            </h2>
            <p className="text-center text-gray-500 mt-4 max-w-xl mx-auto text-sm leading-relaxed">
              Join hundreds of professionals who&apos;ve transformed their careers with Linkway Learning.
            </p>
          </ScrollReveal>
        </div>

        <TestimonialCarousel />
      </section>

      {/* ═══════ CAREER GROWTH ROADMAP ═══════ */}
      <section className="relative py-24 px-6 bg-white overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] rounded-full pointer-events-none" style={{ background: `radial-gradient(ellipse, ${ACCENT_BLUE}05, transparent 70%)` }} />
        <div className="max-w-6xl mx-auto relative z-10">
          <ScrollReveal>
            <SectionLabel center>Your Journey</SectionLabel>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy-900 leading-tight text-center">
              Your Career Growth{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${BRAND_ORANGE}, ${ACCENT_BLUE})` }}>Roadmap</span>
            </h2>
            <p className="text-center text-gray-500 mt-4 max-w-xl mx-auto text-sm leading-relaxed">A proven 4-step path to take you from upskilling to your dream job</p>
          </ScrollReveal>

          <div className="mt-20 relative">
            <svg className="hidden lg:block absolute top-[56px] left-0 w-full h-[50px] pointer-events-none" viewBox="0 0 1152 50" fill="none" preserveAspectRatio="none">
              <motion.path d="M 100 25 C 220 25, 240 8, 330 8 C 420 8, 430 42, 520 42 C 610 42, 620 8, 710 8 C 800 8, 810 42, 900 42 C 940 42, 960 25, 1052 25" stroke="url(#rmGrad)" strokeWidth="2.5" strokeDasharray="10 7" strokeLinecap="round" fill="none" initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 2.5, ease: "easeOut" }} />
              <defs><linearGradient id="rmGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor={ACCENT_BLUE} stopOpacity={0.35} /><stop offset="50%" stopColor={BRAND_ORANGE} stopOpacity={0.4} /><stop offset="100%" stopColor={ACCENT_BLUE} stopOpacity={0.35} /></linearGradient></defs>
              <motion.circle r="5" fill={BRAND_ORANGE} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 2 }}><animateMotion dur="5s" repeatCount="indefinite" path="M 100 25 C 220 25, 240 8, 330 8 C 420 8, 430 42, 520 42 C 610 42, 620 8, 710 8 C 800 8, 810 42, 900 42 C 940 42, 960 25, 1052 25" /></motion.circle>
              <motion.circle r="12" fill={BRAND_ORANGE} opacity={0.15} initial={{ opacity: 0 }} whileInView={{ opacity: 0.15 }} viewport={{ once: true }} transition={{ delay: 2 }}><animateMotion dur="5s" repeatCount="indefinite" path="M 100 25 C 220 25, 240 8, 330 8 C 420 8, 430 42, 520 42 C 610 42, 620 8, 710 8 C 800 8, 810 42, 900 42 C 940 42, 960 25, 1052 25" /></motion.circle>
            </svg>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
              {([
                { title: "Profile Power-Up", desc: "Stand out with a sharp resume, optimized LinkedIn/GitHub, and a strong personal brand.", color: "#3B82F6", icon: (<svg viewBox="0 0 48 48" fill="none" className="w-full h-full"><circle cx="18" cy="16" r="5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M7 38c0-6.075 4.925-11 11-11s11 4.925 11 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><circle cx="35" cy="18" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M29 38c0-4.418 2.686-8 6-8s6 3.582 6 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><motion.path d="M32 10l2-2 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 1 }} /></svg>) },
                { title: "Interview Readiness", desc: "Ace every round with 1:1 mock interviews, role-specific training, and actionable feedback.", color: "#8B5CF6", icon: (<svg viewBox="0 0 48 48" fill="none" className="w-full h-full"><rect x="8" y="6" width="32" height="36" rx="4" stroke="currentColor" strokeWidth="2" /><circle cx="24" cy="18" r="5" stroke="currentColor" strokeWidth="2" /><path d="M16 34c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><motion.path d="M30 14l3 3 5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 1.2 }} /></svg>) },
                { title: "Hiring Rounds", desc: "Apply to 200+ hiring partners and clear technical interview rounds with confidence.", color: "#0EA5E9", icon: (<svg viewBox="0 0 48 48" fill="none" className="w-full h-full"><rect x="10" y="8" width="28" height="32" rx="3" stroke="currentColor" strokeWidth="2" /><path d="M16 16h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M16 22h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M16 28h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><motion.rect x="16" y="34" rx="1.5" height="3" fill="currentColor" opacity={0.6} animate={{ width: [8, 16, 8] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} /></svg>) },
                { title: "Offer Unlocked!", desc: "Land a high paying job offer from top product-based companies.", color: "#F97316", icon: (<svg viewBox="0 0 48 48" fill="none" className="w-full h-full"><motion.path d="M24 34V14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" animate={{ y: [0, -2, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} /><motion.path d="M17 21l7-7 7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" animate={{ y: [0, -2, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} /><path d="M10 40h28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><motion.circle cx="24" cy="8" r="2.5" fill="currentColor" animate={{ scale: [0.8, 1.3, 0.8], opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }} /></svg>) },
              ]).map((step, i) => (
                <motion.div key={step.title} className="flex flex-col items-center text-center group" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-5%" }} transition={{ duration: 0.6, delay: i * 0.18, ease }}>
                  <motion.div className="relative mb-7" whileHover={{ scale: 1.1, rotate: [0, -3, 3, 0] }} transition={{ type: "spring", stiffness: 300 }}>
                    <motion.div className="absolute inset-0 rounded-full scale-[1.6] blur-xl" style={{ backgroundColor: step.color }} animate={{ opacity: [0.05, 0.12, 0.05], scale: [1.4, 1.7, 1.4] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }} />
                    <motion.div className="absolute -inset-[3px] rounded-full" style={{ background: `conic-gradient(from ${i * 90}deg, ${step.color}50, transparent 25%, transparent 75%, ${step.color}50)` }} animate={{ rotate: 360 }} transition={{ duration: 10 + i * 2, repeat: Infinity, ease: "linear" }} />
                    <div className="relative w-[82px] h-[82px] rounded-full flex items-center justify-center bg-white shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-gray-100 p-[18px]" style={{ color: step.color }}>{step.icon}</div>
                    <motion.div className="absolute -top-1.5 -right-1.5 w-7 h-7 rounded-full text-[11px] font-bold flex items-center justify-center text-white shadow-lg" style={{ background: `linear-gradient(135deg, ${step.color}, ${step.color}bb)` }} animate={{ scale: [1, 1.12, 1] }} transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3 }}>{i + 1}</motion.div>
                  </motion.div>
                  <h4 className="text-lg font-bold text-navy-900 mb-2">{step.title}</h4>
                  <p className="text-[13px] text-gray-500 leading-relaxed max-w-[230px]">{step.desc}</p>
                  <motion.div className="h-[3px] rounded-full mt-5" style={{ backgroundColor: step.color }} initial={{ width: 0, opacity: 0 }} whileInView={{ width: 48, opacity: 0.5 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.6 + i * 0.15 }} />
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
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 50% 50% at 50% 50%, ${BRAND_ORANGE}0c 0%, transparent 60%)` }} />
        <div className="noise-overlay absolute inset-0 pointer-events-none opacity-[0.02]" />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <SectionLabel center light>Get Started</SectionLabel>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mt-4">
              Ready to{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${BRAND_ORANGE}, ${ACCENT_BLUE})` }}>Start</span>?
            </h2>
            <p className="mt-5 text-gray-400 text-base max-w-xl mx-auto leading-relaxed">
              600+ people have already launched AI careers through Linkway. The next batch is filling up — your seat won&apos;t hold itself.
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
