"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Counter from "@/components/animation/Counter";
import ScrollReveal from "@/components/animation/ScrollReveal";
import ToolLogo from "@/components/ui/ToolLogo";
import { useEnquiryModal } from "@/components/forms/EnquiryModal";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/lib/theme";
import FooterCTA from "@/components/sections/FooterCTA";

gsap.registerPlugin(ScrollTrigger);

const BRAND_ORANGE = "#F58220";
const BRAND_NAVY = "#0D1B2A";
const ACCENT_BLUE = "#3B82F6";
const ACCENT_PURPLE = "#8B5CF6";
const ACCENT_CYAN = "#06B6D4";
const DARK_BG = "#0a0e18";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

/* ── Utility Components ── */

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

function Magnetic({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 20 });
  const springY = useSpring(y, { stiffness: 200, damping: 20 });
  return (
    <motion.div ref={ref} className={className} style={{ x: springX, y: springY }}
      onMouseMove={(e) => { if (!ref.current) return; const rect = ref.current.getBoundingClientRect(); x.set((e.clientX - rect.left - rect.width / 2) * 0.12); y.set((e.clientY - rect.top - rect.height / 2) * 0.12); }}
      onMouseLeave={() => { x.set(0); y.set(0); }}>{children}</motion.div>
  );
}

function SlideIn({ children, direction = "up", delay = 0, className }: { children: React.ReactNode; direction?: "up" | "down" | "left" | "right"; delay?: number; className?: string }) {
  const offsets = { up: { y: 40 }, down: { y: -40 }, left: { x: -50 }, right: { x: 50 } };
  return (
    <motion.div className={className} initial={{ opacity: 0, x: 0, y: 0, ...offsets[direction] }} whileInView={{ opacity: 1, x: 0, y: 0 }} viewport={{ once: true, margin: "-8%" }} transition={{ duration: 0.6, delay, ease }}>
      {children}
    </motion.div>
  );
}

function Card({ children, className, accent = ACCENT_BLUE }: { children: React.ReactNode; className?: string; accent?: string }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);
  const onMove = useCallback((e: React.MouseEvent) => { if (!ref.current) return; const r = ref.current.getBoundingClientRect(); setPos({ x: e.clientX - r.left, y: e.clientY - r.top }); }, []);
  return (
    <motion.div ref={ref} className={cn("relative group rounded-2xl overflow-hidden", className)} onMouseMove={onMove} whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}>
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: `radial-gradient(350px circle at ${pos.x}px ${pos.y}px, ${accent}14, transparent 60%)` }} />
      <div className="absolute inset-0 rounded-2xl border border-gray-200 group-hover:border-gray-300 transition-colors duration-300 pointer-events-none" />
      <div className="relative bg-white rounded-2xl p-6 shadow-[0_1px_8px_rgba(0,0,0,0.04)] group-hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-shadow duration-300">{children}</div>
    </motion.div>
  );
}

function SectionLabel({ children, center = false, light = false }: { children: React.ReactNode; center?: boolean; light?: boolean }) {
  return (
    <div className={cn("flex items-center gap-3 mb-4", center && "justify-center")}>
      <span className={cn("inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-[0.15em] uppercase", light ? "bg-white/10 text-white/70 border border-white/10" : "bg-orange-50 border border-orange-100")} style={!light ? { color: BRAND_ORANGE } : undefined}>
        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: light ? "#fff" : BRAND_ORANGE, opacity: light ? 0.5 : 1 }} />
        {children}
      </span>
    </div>
  );
}

function StatCard({ value, suffix, label, icon: Icon, delay = 0, accent = BRAND_ORANGE }: { value: number; suffix: string; label: string; icon: React.FC<{ className?: string; style?: React.CSSProperties }>; delay?: number; accent?: string }) {
  return (
    <SlideIn direction="up" delay={delay}>
      <div className="relative bg-white rounded-2xl border border-gray-100 p-6 text-center overflow-hidden group hover:border-gray-200 transition-colors duration-300">
        <div className="absolute top-3 right-3 opacity-[0.06] group-hover:opacity-[0.1] transition-opacity duration-500"><Icon className="w-14 h-14" style={{ color: accent }} /></div>
        <div className="text-4xl md:text-5xl font-bold mb-1.5" style={{ color: BRAND_NAVY }}><Counter target={value} suffix={suffix} duration={2} /></div>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
      </div>
    </SlideIn>
  );
}

function Divider({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className={cn("relative h-px w-full overflow-hidden", className)}>
      <motion.div className="absolute inset-0" style={{ background: `linear-gradient(90deg, transparent, ${BRAND_ORANGE}30, ${ACCENT_BLUE}30, transparent)` }} initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}} transition={{ duration: 1.2, ease }} />
    </div>
  );
}

function WaveDivider({ flip = false, from = "#f9fafb", to = "#ffffff" }: { flip?: boolean; from?: string; to?: string }) {
  return (
    <div className={cn("w-full overflow-hidden leading-[0]", flip && "rotate-180")} style={{ backgroundColor: from }}>
      <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-[40px] md:h-[60px]">
        <path d="M0,30 C360,60 720,0 1080,30 C1260,45 1380,35 1440,30 L1440,60 L0,60 Z" fill={to} />
      </svg>
    </div>
  );
}

function JourneyPhaseCard({ mod, index, isOpen, onToggle, codeLines }: {
  mod: { phase: string; title: string; duration: string; color: string; topics: string[]; skills: string[] };
  index: number; isOpen: boolean; onToggle: () => void;
  codeLines: { text: string; color: string }[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-5%" });
  return (
    <motion.div ref={ref} className="relative" initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: index * 0.15, ease }}>
      <div className={cn("relative rounded-2xl border overflow-hidden transition-all duration-500 cursor-pointer", isOpen ? "bg-white shadow-[0_12px_40px_rgba(0,0,0,0.08)] border-gray-200" : "bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] border-gray-100 hover:border-gray-200 hover:shadow-[0_6px_20px_rgba(0,0,0,0.06)]")} onClick={onToggle}>
        <motion.div className="h-1 w-full" initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}} transition={{ duration: 0.8, delay: index * 0.15 + 0.3, ease }} style={{ transformOrigin: "left", backgroundColor: mod.color }} />
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <motion.div className="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg font-mono text-white" style={{ backgroundColor: mod.color }} whileHover={{ scale: 1.08, rotate: -3 }} transition={{ type: "spring", stiffness: 400, damping: 15 }}>{mod.phase}</motion.div>
              <div className="absolute inset-0 rounded-2xl blur-lg opacity-30" style={{ backgroundColor: mod.color }} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-navy-900">{mod.title}</h3>
              <p className="text-sm text-gray-400 font-mono mt-0.5">{mod.duration}</p>
            </div>
          </div>
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center shrink-0">
            <ChevronIcon className="w-4 h-4 text-gray-400" />
          </motion.div>
        </div>
        <div className="px-6 pb-4 flex flex-wrap gap-1.5">
          {mod.skills.map((skill, j) => (
            <motion.span key={skill} className="px-2.5 py-1 rounded-lg text-xs font-medium border" style={{ color: mod.color, borderColor: `${mod.color}25`, backgroundColor: `${mod.color}08` }} initial={{ opacity: 0, scale: 0.8 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.3, delay: index * 0.15 + 0.4 + j * 0.05 }}>{skill}</motion.span>
          ))}
        </div>
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease }} className="overflow-hidden">
              <div className="px-6 pb-6">
                <div className="h-px bg-gray-100 mb-5" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <div className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">What you&apos;ll learn</p>
                    {mod.topics.map((topic, j) => (
                      <motion.div key={j} className="flex items-start gap-3 p-3.5 rounded-xl bg-gray-50 border border-gray-100" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: j * 0.08 }}>
                        <CheckCircleIcon className="w-4 h-4 mt-0.5 shrink-0" style={{ color: mod.color }} />
                        <span className="text-sm text-gray-700 leading-relaxed">{topic}</span>
                      </motion.div>
                    ))}
                  </div>
                  <motion.div className="rounded-xl overflow-hidden border border-gray-200" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.15 }}>
                    <div className="flex items-center gap-1.5 px-3 py-2 bg-[#1a1e2e] border-b border-white/[0.06]">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" /><span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" /><span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                      <span className="text-[10px] font-mono text-gray-500 ml-2">preview</span>
                    </div>
                    <div className="bg-[#0d1117] p-4 font-mono text-[12px] leading-[1.8]">
                      {codeLines.map((line, j) => (
                        <motion.div key={j} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2, delay: 0.2 + j * 0.06 }} className="whitespace-pre" style={{ color: line.color }}>{line.text}</motion.div>
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

function FAQItem({ question, answer, isOpen, onClick, index }: { question: string; answer: string; isOpen: boolean; onClick: () => void; index: number }) {
  return (
    <motion.div className="border-b border-gray-200 last:border-b-0" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35, delay: index * 0.04 }}>
      <button onClick={onClick} className="flex items-center justify-between w-full py-5 text-left group cursor-pointer">
        <span className="text-base md:text-lg font-medium text-navy-900 group-hover:text-orange-500 transition-colors pr-4">{question}</span>
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }}><ChevronIcon className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" /></motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease }} className="overflow-hidden">
            <p className="pb-5 text-gray-600 leading-relaxed text-[15px]">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

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
      <div className="flex items-center gap-2 px-4 py-2.5 bg-[#1a1e2e] border-b border-white/[0.06]">
        <div className="flex gap-1.5"><span className="w-3 h-3 rounded-full bg-[#ff5f57]" /><span className="w-3 h-3 rounded-full bg-[#febc2e]" /><span className="w-3 h-3 rounded-full bg-[#28c840]" /></div>
        <span className="text-xs font-mono text-gray-500 ml-2">{title}</span>
      </div>
      <div className="bg-[#0d1117] p-5 font-mono text-[13px] leading-[1.7] min-h-[200px] overflow-hidden">
        {lines.slice(0, visibleLines).map((line, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.15 }} className="whitespace-pre" style={{ color: line.color || "#e6edf3" }}>{line.text}</motion.div>
        ))}
        {visibleLines < lines.length && <span className="inline-block w-2 h-4 bg-green-400 animate-pulse ml-0.5" />}
      </div>
    </div>
  );
}

function DashboardMock({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const bars = [
    { label: "Business Analyst", value: 82, color: BRAND_ORANGE },
    { label: "BI Analyst", value: 75, color: ACCENT_BLUE },
    { label: "Analytics Manager", value: 70, color: ACCENT_CYAN },
    { label: "Strategy Consultant", value: 68, color: BRAND_ORANGE },
    { label: "BI Developer", value: 60, color: ACCENT_BLUE },
  ];
  const metrics = [
    { label: "Avg. Salary", value: "₹10 LPA", delta: "+28%" },
    { label: "Placed", value: "400+", delta: "+85%" },
    { label: "Hiring Partners", value: "100+", delta: "+42%" },
  ];
  return (
    <div ref={ref} className={cn("rounded-2xl overflow-hidden border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.06)]", className)}>
      <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-100">
        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-400" /><span className="text-xs font-mono text-gray-500">placement_analytics.dashboard</span></div>
        <span className="text-[10px] font-mono text-gray-400">LIVE</span>
      </div>
      <div className="bg-white p-5">
        <div className="grid grid-cols-3 gap-3 mb-5">
          {metrics.map((m, i) => (
            <motion.div key={i} className="text-center p-3 rounded-xl bg-gray-50 border border-gray-100" initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.3, delay: 0.2 + i * 0.1 }}>
              <p className="text-lg font-bold text-navy-900">{m.value}</p>
              <p className="text-[10px] text-gray-500">{m.label}</p>
              <span className="text-[10px] font-mono text-green-500">{m.delta}</span>
            </motion.div>
          ))}
        </div>
        <div className="space-y-2.5">
          {bars.map((bar, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-xs text-gray-500 w-28 shrink-0 text-right">{bar.label}</span>
              <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                <motion.div className="h-full rounded-full" style={{ backgroundColor: bar.color }} initial={{ width: 0 }} animate={inView ? { width: `${bar.value}%` } : {}} transition={{ duration: 0.8, delay: 0.4 + i * 0.1, ease }} />
              </div>
              <span className="text-xs font-mono text-gray-400 w-8">{bar.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ToolMarquee({ tools }: { tools: string[] }) {
  const doubled = [...tools, ...tools];
  return (
    <div className="relative overflow-hidden py-2">
      <div className="absolute left-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-r from-white to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-l from-white to-transparent pointer-events-none" />
      <motion.div className="flex gap-4 w-max" animate={{ x: ["0%", "-50%"] }} transition={{ duration: 30, ease: "linear", repeat: Infinity }}>
        {doubled.map((tool, i) => (<div key={`${tool}-${i}`} className="shrink-0"><ToolLogo name={tool} /></div>))}
      </motion.div>
    </div>
  );
}

/* ── SVG Icons ── */
function ArrowRightIcon({ className, style }: { className?: string; style?: React.CSSProperties }) { return <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>; }
function UserIcon({ className, style }: { className?: string; style?: React.CSSProperties }) { return <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M20 21a8 8 0 10-16 0" /></svg>; }
function BriefcaseIcon({ className, style }: { className?: string; style?: React.CSSProperties }) { return <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" /></svg>; }
function GraduationIcon({ className, style }: { className?: string; style?: React.CSSProperties }) { return <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10l-10-5L2 10l10 5 10-5z" /><path d="M6 12v5c0 2 3 3 6 3s6-1 6-3v-5" /><path d="M22 10v6" /></svg>; }
function RocketIcon({ className, style }: { className?: string; style?: React.CSSProperties }) { return <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z" /><path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" /></svg>; }
function TargetIcon({ className, style }: { className?: string; style?: React.CSSProperties }) { return <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>; }
function CheckCircleIcon({ className, style }: { className?: string; style?: React.CSSProperties }) { return <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="9 12 11 14 15 10" /></svg>; }
function ShieldIcon({ className, style }: { className?: string; style?: React.CSSProperties }) { return <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" /></svg>; }
function CurrencyIcon({ className, style }: { className?: string; style?: React.CSSProperties }) { return <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>; }
function SparklesIcon({ className, style }: { className?: string; style?: React.CSSProperties }) { return <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L13.09 8.26L18 6L14.74 10.91L21 12L14.74 13.09L18 18L13.09 15.74L12 22L10.91 15.74L6 18L9.26 13.09L3 12L9.26 10.91L6 6L10.91 8.26L12 2Z" /></svg>; }
function ChevronIcon({ className }: { className?: string }) { return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>; }
function LayersIcon({ className, style }: { className?: string; style?: React.CSSProperties }) { return <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>; }
function ClockIcon({ className, style }: { className?: string; style?: React.CSSProperties }) { return <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>; }
function ChartIcon({ className, style }: { className?: string; style?: React.CSSProperties }) { return <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>; }

/* ── Learner Testimonials ── */
const learnerTestimonials = [
  { name: "Meera Kapoor", from: "Marketing Exec", to: "Business Analyst", company: "Flipkart", exp: "2 yrs exp.", accentFrom: "#10b981", accentTo: "#34d399", gradientBg: "linear-gradient(135deg, #ecfdf5, #d1fae5 40%, #ffffff)", desc: "Marketing taught me to ask the right questions. Linkway taught me how to answer them with data. Now I'm building dashboards at Flipkart that drive actual product decisions." },
  { name: "Rohit Sharma", from: "Operations Manager", to: "Analytics Manager", company: "Deloitte", exp: "3 yrs exp.", accentFrom: "#eab308", accentTo: "#facc15", gradientBg: "linear-gradient(135deg, #fefce8, #fef9c3 40%, #ffffff)", desc: "I was managing people but not data. The Business Analytics program gave me Power BI, SQL, and the strategic thinking to move into consulting at Deloitte." },
  { name: "Ananya Reddy", from: "HR Coordinator", to: "People Analytics Lead", company: "Infosys", exp: "1.5 yrs exp.", accentFrom: "#0ea5e9", accentTo: "#38bdf8", gradientBg: "linear-gradient(135deg, #f0f9ff, #bae6fd 40%, #ffffff)", desc: "HR gave me people skills, Linkway gave me data skills. Now I'm building workforce analytics dashboards at Infosys and loving every second." },
  { name: "Karan Malhotra", from: "Sales Rep", to: "BI Analyst", company: "Razorpay", exp: "2 yrs exp.", accentFrom: "#f43f5e", accentTo: "#fb7185", gradientBg: "linear-gradient(135deg, #fff1f2, #fecdd3 40%, #ffffff)", desc: "Selling taught me to understand customers. Analytics taught me to predict them. Razorpay hired me to do exactly that." },
  { name: "Priyanka Nair", from: "Finance Associate", to: "Strategy Consultant", company: "McKinsey", exp: "2.5 yrs exp.", accentFrom: "#8b5cf6", accentTo: "#a78bfa", gradientBg: "linear-gradient(135deg, #f5f3ff, #ddd6fe 40%, #ffffff)", desc: "Finance gave me the numbers. Linkway gave me the tools to tell stories with them. Landing McKinsey felt surreal but completely earned." },
  { name: "Arjun Mehta", from: "Retail Manager", to: "Business Analyst", company: "Amazon", exp: "1 yr exp.", accentFrom: "#f97316", accentTo: "#fb923c", gradientBg: "linear-gradient(135deg, #fff7ed, #fed7aa 40%, #ffffff)", desc: "Retail taught me supply chains. Linkway taught me how to optimize them with data. Amazon was the perfect next step." },
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
    <motion.div ref={cardRef} className="shrink-0 w-[340px] md:w-[400px]" style={{ perspective: 1200 }} onMouseMove={handleMouse} onMouseLeave={() => { rotateX.set(0); rotateY.set(0); glowX.set(50); glowY.set(50); }}>
      <motion.div className="relative h-full rounded-3xl overflow-hidden border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:shadow-[0_24px_64px_rgba(0,0,0,0.15)] transition-shadow duration-700" style={{ rotateX: smoothX, rotateY: smoothY, transformStyle: "preserve-3d", background: t.gradientBg }}>
        <motion.div className="absolute -top-10 -right-10 w-36 h-36 rounded-full blur-3xl pointer-events-none" style={{ backgroundColor: t.accentFrom, opacity: 0.12 }} animate={{ scale: [1, 1.3, 1], x: [0, 8, 0], y: [0, -5, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: index * 0.4 }} />
        <motion.div className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full blur-3xl pointer-events-none" style={{ backgroundColor: t.accentTo, opacity: 0.1 }} animate={{ scale: [1.2, 0.9, 1.2], x: [0, -6, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: index * 0.6 }} />
        <div className="relative p-7 pb-6" style={{ transform: "translateZ(40px)" }}>
          <svg className="absolute top-2 right-4 w-20 h-20 pointer-events-none" viewBox="0 0 64 64" fill="none"><path d="M20 34c0-6.627 5.373-12 12-12v-6c-9.941 0-18 8.059-18 18v12h18V34H20zm24 0c0-6.627 5.373-12 12-12v-6c-9.941 0-18 8.059-18 18v12h18V34H44z" fill={t.accentFrom} opacity="0.06" /></svg>
          <div className="flex items-center gap-3 mb-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase backdrop-blur-md" style={{ backgroundColor: `${t.accentFrom}10`, color: t.accentFrom, border: `1.5px solid ${t.accentFrom}20`, boxShadow: `0 0 12px ${t.accentFrom}08` }}>
              <motion.span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: t.accentFrom }} animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }} transition={{ duration: 2, repeat: Infinity }} />{t.exp}
            </span>
            <motion.div className="flex-1 h-[1.5px] rounded-full origin-left" style={{ background: `linear-gradient(90deg, ${t.accentFrom}35, ${t.accentTo}15, transparent)` }} initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.3 }} />
          </div>
          <p className="text-[14px] text-gray-700 leading-[1.8] mb-7 relative z-10 font-[450]">&ldquo;{t.desc}&rdquo;</p>
          <div className="h-[1.5px] mb-5 rounded-full" style={{ background: `linear-gradient(90deg, ${t.accentFrom}20, ${t.accentTo}12, transparent)` }} />
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <motion.div className="absolute -inset-[2.5px] rounded-full" style={{ background: `conic-gradient(from 0deg, ${t.accentFrom}, ${t.accentTo}, transparent, ${t.accentFrom})` }} animate={{ rotate: 360 }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }} />
              <div className="relative w-11 h-11 rounded-full flex items-center justify-center text-[13px] font-bold text-white shadow-lg" style={{ background: `linear-gradient(135deg, ${t.accentFrom}, ${t.accentTo})` }}>{t.name.split(" ").map(n => n[0]).join("")}</div>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-gray-900 text-[15px] leading-tight truncate">{t.name}</h4>
              <p className="text-[11.5px] text-gray-500 mt-0.5 font-medium">{t.from} <motion.span className="inline-block" style={{ color: t.accentFrom }} animate={{ x: [0, 3, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>&rarr;</motion.span> {t.to}, <span className="font-semibold text-gray-600">{t.company}</span></p>
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
          {[...learnerTestimonials, ...learnerTestimonials].map((t, i) => (<TestimonialCard3D key={`${t.name}-${i}`} t={t} index={i} />))}
        </div>
      </div>
    </div>
  );
}

/* ─── Hero Image Carousel ─── */
/* IMAGE PROMPT: A modern corporate office environment with a large curved monitor displaying a colorful Power BI dashboard with bar charts, KPI cards, and pie charts. The desk has a sleek keyboard, wireless mouse, and a small potted plant. Warm ambient lighting with blue-orange accent tones. Professional business analytics workspace. Hyper-realistic, cinematic lighting, shallow depth of field, 4K quality. */
const heroImages = [
  "/images/courses/business-analytics/hero-1.png",
  "/images/courses/business-analytics/hero-2.png",
  "/images/courses/business-analytics/hero-3.png",
  "/images/courses/business-analytics/hero-4.png",
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
      {/* Ambient glow behind image */}
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
            alt="Business Analytics professional"
            fill
            className="object-cover"
            priority={current === 0}
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </motion.div>
      </AnimatePresence>
      {/* Animated progress bar at bottom */}
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
      {/* Corner accent frame lines */}
      <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 rounded-tl-sm pointer-events-none" style={{ borderColor: `${BRAND_ORANGE}80` }} />
      <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 rounded-br-sm pointer-events-none" style={{ borderColor: `${BRAND_ORANGE}80` }} />
    </div>
  );
}

/* ─── Interactive BI Strategy Dashboard Preview ─── */
function BIDashboardPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const [activeTab, setActiveTab] = useState(0);
  const tabs = ["Strategy", "Revenue", "Forecast"];

  const kpis = [
    { label: "Total Pipeline", value: "$4.2M", change: "+18.6%", up: true },
    { label: "Win Rate", value: "67.3%", change: "+5.1%", up: true },
    { label: "Avg Deal Size", value: "$124K", change: "+8.4%", up: true },
    { label: "NPS Score", value: "72", change: "+4.2", up: true },
  ];

  // Funnel data
  const funnel = [
    { stage: "Leads", value: 2840, pct: 100, color: BRAND_ORANGE },
    { stage: "Qualified", value: 1420, pct: 50, color: ACCENT_BLUE },
    { stage: "Proposal", value: 710, pct: 25, color: ACCENT_CYAN },
    { stage: "Won", value: 284, pct: 10, color: "#7ee787" },
  ];

  // Gauge chart data
  const gaugeValue = 67.3;

  return (
    <div ref={ref} className="rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl bg-[#0d1117]">
      <div className="flex items-center justify-between px-5 py-3 bg-[#1a1e2e] border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5"><span className="w-3 h-3 rounded-full bg-[#ff5f57]" /><span className="w-3 h-3 rounded-full bg-[#febc2e]" /><span className="w-3 h-3 rounded-full bg-[#28c840]" /></div>
          <span className="text-xs font-mono text-gray-500">bi_strategy_dashboard.py</span>
        </div>
        <div className="flex gap-1">
          {tabs.map((tab, i) => (
            <button key={tab} onClick={() => setActiveTab(i)} className={`px-3 py-1 rounded-md text-[11px] font-medium transition-all duration-200 ${activeTab === i ? "bg-white/[0.1] text-white" : "text-gray-500 hover:text-gray-300"}`}>{tab}</button>
          ))}
        </div>
      </div>
      <div className="p-5 space-y-5">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {kpis.map((kpi, i) => (
            <motion.div key={kpi.label} initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4, delay: i * 0.1 }} className="rounded-xl bg-white/[0.04] border border-white/[0.06] p-3.5 hover:border-white/[0.12] transition-colors duration-300">
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">{kpi.label}</p>
              <p className="text-xl font-bold text-white mt-1 font-mono">{kpi.value}</p>
              <span className={`text-[11px] font-mono font-medium ${kpi.up ? "text-[#7ee787]" : "text-[#ff7b72]"}`}>{kpi.change}</span>
            </motion.div>
          ))}
        </div>
        {/* Charts Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Sales Funnel — 2 cols */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.4 }} className="md:col-span-2 rounded-xl bg-white/[0.03] border border-white/[0.06] p-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-medium text-gray-400">Sales Funnel</p>
              <span className="text-[10px] text-gray-600 font-mono">Q4 2024</span>
            </div>
            <div className="space-y-3">
              {funnel.map((stage, i) => (
                <div key={stage.stage} className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-16 shrink-0 text-right">{stage.stage}</span>
                  <div className="flex-1 h-7 bg-white/[0.03] rounded overflow-hidden relative">
                    <motion.div className="h-full rounded flex items-center pl-3" style={{ backgroundColor: `${stage.color}30` }} initial={{ width: 0 }} animate={inView ? { width: `${stage.pct}%` } : {}} transition={{ duration: 0.8, delay: 0.5 + i * 0.15, ease: "easeOut" }}>
                      <span className="text-[10px] font-mono text-white/80">{stage.value.toLocaleString()}</span>
                    </motion.div>
                  </div>
                  <span className="text-[10px] font-mono text-gray-500 w-10">{stage.pct}%</span>
                </div>
              ))}
            </div>
          </motion.div>
          {/* Win Rate Gauge */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.6 }} className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4">
            <p className="text-xs font-medium text-gray-400 mb-3">Win Rate</p>
            <div className="flex justify-center">
              <svg viewBox="0 0 120 80" className="w-32 h-20">
                <path d="M10 70 A50 50 0 0 1 110 70" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" strokeLinecap="round" />
                <motion.path d="M10 70 A50 50 0 0 1 110 70" fill="none" stroke={BRAND_ORANGE} strokeWidth="10" strokeLinecap="round" strokeDasharray="157" initial={{ strokeDashoffset: 157 }} animate={inView ? { strokeDashoffset: 157 - (gaugeValue / 100) * 157 } : {}} transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }} />
                <text x="60" y="65" textAnchor="middle" fill="white" fontSize="18" fontFamily="monospace" fontWeight="bold">{gaugeValue}%</text>
                <text x="60" y="78" textAnchor="middle" fill="#6b7280" fontSize="8">conversion</text>
              </svg>
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 mt-3">
              {[{ label: "Target", value: "70%", color: "#7ee787" }, { label: "Last Q", value: "62.2%", color: ACCENT_BLUE }, { label: "Industry", value: "45%", color: ACCENT_CYAN }, { label: "Growth", value: "+5.1%", color: BRAND_ORANGE }].map((item) => (
                <div key={item.label} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-[10px] text-gray-500">{item.label}</span>
                  <span className="text-[10px] text-gray-400 font-mono ml-auto">{item.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
        {/* Bottom stats */}
        <div className="flex flex-wrap items-center justify-center gap-5 pt-2 border-t border-white/[0.04]">
          {[
            { label: "Dashboards", value: "4", color: BRAND_ORANGE },
            { label: "KPIs", value: "12+", color: ACCENT_BLUE },
            { label: "Data Points", value: "5K+", color: ACCENT_CYAN },
            { label: "Portfolio", value: "100%", color: "#7ee787" },
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

/* ── Module Data for Business Analytics ── */
const MODULE_DATA = [
  {
    id: 1,
    title: "Excel for Business Analytics",
    subtitle: "Master the world's most-used analytics tool",
    gradient: "from-emerald-400 to-teal-500",
    bgGradient: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
    iconBg: "linear-gradient(135deg, #10b981, #059669)",
    color: "#059669",
    lightBg: "#ecfdf5",
    topics: [
      "Advanced formulas — VLOOKUP, INDEX-MATCH, array formulas",
      "PivotTables & PivotCharts — dynamic reporting & analysis",
      "Conditional formatting & data validation — at scale",
      "What-If analysis — Goal Seek & Scenario Manager",
      "Dashboard design — sparklines, slicers, KPI tiles",
      "Power Query — automated ETL & data transformation",
    ],
    icon: (<img src="/images/tools/excel.png" alt="Excel" className="w-7 h-7 object-contain drop-shadow-sm" />),
  },
  {
    id: 2,
    title: "SQL & Database Management",
    subtitle: "Query, manage & scale your data infrastructure",
    gradient: "from-blue-400 to-indigo-500",
    bgGradient: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
    iconBg: "linear-gradient(135deg, #3b82f6, #4f46e5)",
    color: "#3b82f6",
    lightBg: "#eff6ff",
    topics: [
      "SQL fundamentals — SELECT, JOINs, CTEs",
      "Database design — normalization & ER modeling",
      "Window functions — stored procedures & optimization",
      "Complex subqueries — performance tuning techniques",
      "Data warehousing — concepts & architecture",
      "SQL for business reporting — actionable insights",
    ],
    icon: (<img src="/images/tools/sql.png" alt="SQL" className="w-7 h-7 object-contain drop-shadow-sm" />),
  },
  {
    id: 3,
    title: "Power BI",
    subtitle: "Enterprise-grade business intelligence",
    gradient: "from-amber-400 to-orange-500",
    bgGradient: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
    iconBg: "linear-gradient(135deg, #f59e0b, #ea580c)",
    color: "#d97706",
    lightBg: "#fffbeb",
    topics: [
      "Power BI Desktop — data modeling & DAX formulas",
      "Building multi-page interactive reports",
      "Power Query M language — ETL pipelines",
      "Row-level security — workspace governance",
      "Dataflows — incremental refresh & performance tuning",
      "Publishing & sharing — via Power BI Service",
    ],
    icon: (<img src="/images/tools/power-bi.png" alt="Power BI" className="w-7 h-7 object-contain drop-shadow-sm" />),
  },
  {
    id: 4,
    title: "Tableau",
    subtitle: "Turn raw data into visual stories",
    gradient: "from-violet-400 to-purple-600",
    bgGradient: "linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)",
    iconBg: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
    color: "#7c3aed",
    lightBg: "#f5f3ff",
    topics: [
      "Connecting to data sources — live & extract",
      "Interactive dashboards — storyboards & navigation",
      "Calculated fields — LOD expressions & table calcs",
      "Geospatial mapping — custom geocoding",
      "Publishing to Tableau Server — Tableau Public",
      "Visual design — best practices & storytelling",
    ],
    icon: (<img src="/images/tools/tableau.png" alt="Tableau" className="w-7 h-7 object-contain drop-shadow-sm" />),
  },
  {
    id: 5,
    title: "Statistics & Analytics",
    subtitle: "Build a rock-solid analytical foundation",
    gradient: "from-pink-400 to-rose-500",
    bgGradient: "linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)",
    iconBg: "linear-gradient(135deg, #ec4899, #db2777)",
    color: "#db2777",
    lightBg: "#fdf2f8",
    topics: [
      "Descriptive statistics — distributions & central tendency",
      "Probability theory — Bayes theorem & applications",
      "Hypothesis testing — A/B testing & significance",
      "Regression analysis — linear & logistic models",
      "Time series analysis — trends & seasonality",
      "Business forecasting — methods & best practices",
    ],
    icon: (<img src="/images/tools/python.png" alt="Statistics" className="w-7 h-7 object-contain drop-shadow-sm" />),
  },
  {
    id: 6,
    title: "Python for Analytics",
    subtitle: "Automate, analyze & visualize with code",
    gradient: "from-cyan-400 to-sky-500",
    bgGradient: "linear-gradient(135deg, #cffafe 0%, #a5f3fc 100%)",
    iconBg: "linear-gradient(135deg, #06b6d4, #0284c7)",
    color: "#0891b2",
    lightBg: "#ecfeff",
    topics: [
      "Python fundamentals — variables, loops, functions, OOP",
      "NumPy & Pandas — data manipulation at scale",
      "Matplotlib & Seaborn — publication-quality visualizations",
      "Statistical analysis — SciPy for inference & testing",
      "Web scraping — BeautifulSoup & automation",
      "Automation & reporting — scripts & scheduled jobs",
    ],
    icon: (<img src="/images/tools/python.png" alt="Python" className="w-7 h-7 object-contain drop-shadow-sm" />),
  },
];

/* ── Module Card with glassmorphism + bento hover ── */
function ModuleCard({ mod, index, onEnquiry }: { mod: typeof MODULE_DATA[0]; index: number; onEnquiry: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      ref={cardRef}
      className="group relative"
      initial={{ opacity: 0, y: 60, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Spotlight follow cursor */}
      <motion.div
        className="absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0"
        style={{
          background: useTransform(
            [mouseX, mouseY],
            ([x, y]) => `radial-gradient(400px circle at ${x}px ${y}px, ${mod.color}18, transparent 60%)`
          ),
        }}
      />

      {/* Card body — glassmorphism */}
      <div
        className="relative z-10 rounded-3xl border border-white/60 overflow-hidden cursor-pointer transition-all duration-500"
        style={{
          background: "rgba(255,255,255,0.65)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          boxShadow: isHovered
            ? `0 20px 60px -15px ${mod.color}25, 0 0 0 1px ${mod.color}20`
            : "0 4px 24px -8px rgba(0,0,0,0.08), 0 0 0 1px rgba(255,255,255,0.6)",
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* Top colored accent bar with shimmer */}
        <div className="relative h-1.5 overflow-hidden" style={{ background: mod.iconBg }}>
          <motion.div
            className="absolute inset-0"
            style={{ background: "linear-gradient(90deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)" }}
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
          />
        </div>

        <div className="p-6">
          {/* Header row */}
          <div className="flex items-start gap-4">
            {/* Icon with gradient bg */}
            <motion.div
              className="shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg border border-white/80"
              style={{ background: mod.lightBg }}
              whileHover={{ scale: 1.1, rotate: -5 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              {mod.icon}
            </motion.div>

            <div className="flex-1 min-w-0">
              {/* Module badge */}
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full tracking-wider"
                  style={{ color: mod.color, backgroundColor: mod.lightBg }}
                >
                  MODULE {mod.id}
                </span>
                <span className="text-[10px] text-gray-400 font-mono">{mod.topics.length} topics</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-gray-800">
                {mod.title}
              </h3>
              <p className="mt-0.5 text-sm text-gray-500">{mod.subtitle}</p>
            </div>

            {/* Expand toggle */}
            <motion.div
              className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center mt-0.5 border border-gray-200 group-hover:border-gray-300 transition-colors"
              style={{ backgroundColor: isOpen ? mod.lightBg : "white" }}
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke={isOpen ? mod.color : "#9ca3af"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
            </motion.div>
          </div>

          {/* Progress bar indicator */}
          <div className="mt-4 flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: mod.iconBg }}
                initial={{ width: "0%" }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.3 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <span className="text-[10px] font-mono font-semibold" style={{ color: mod.color }}>
              {mod.topics.length} lessons
            </span>
          </div>

          {/* Expandable topics — Accordion */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="mt-5 pt-5 border-t border-gray-100">
                  <div className="grid gap-2">
                    {mod.topics.map((topic, tIdx) => {
                      const parts = topic.split(" — ");
                      return (
                        <motion.div
                          key={tIdx}
                          className="flex items-start gap-3 p-3 rounded-xl transition-all duration-300 hover:bg-gray-50/80"
                          style={{ backgroundColor: `${mod.lightBg}60` }}
                          initial={{ opacity: 0, x: -15 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: tIdx * 0.05 }}
                        >
                          <motion.div
                            className="shrink-0 mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold font-mono"
                            style={{ color: mod.color, backgroundColor: mod.lightBg, border: `1px solid ${mod.color}20` }}
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.15 + tIdx * 0.05, type: "spring", stiffness: 400 }}
                          >
                            {tIdx + 1}
                          </motion.div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-semibold text-gray-800">
                              {parts[0]}
                            </p>
                            {parts[1] && (
                              <p className="text-[12px] text-gray-500 mt-0.5 leading-relaxed">
                                {parts[1]}
                              </p>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Footer CTA */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      {[...Array(mod.topics.length)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: mod.color }}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.3 + i * 0.04, type: "spring" }}
                        />
                      ))}
                    </div>
                    <motion.button
                      onClick={(e) => { e.stopPropagation(); onEnquiry(); }}
                      className="text-[11px] font-semibold flex items-center gap-1.5 px-3.5 py-2 rounded-xl shadow-sm transition-all duration-300 text-white cursor-pointer"
                      style={{ background: mod.iconBg }}
                      whileHover={{ scale: 1.05, boxShadow: `0 4px 15px ${mod.color}40` }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Get Detailed Syllabus
                      <ArrowRightIcon className="w-3 h-3" />
                    </motion.button>
                  </div>
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
          <linearGradient id="ba-mod-lg1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#f59e0b" stopOpacity="0.15" /><stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.08" /></linearGradient>
          <linearGradient id="ba-mod-lg2" x1="100%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#06b6d4" stopOpacity="0.12" /><stop offset="100%" stopColor="#ec4899" stopOpacity="0.06" /></linearGradient>
        </defs>
        {[
          { x1: "10%", y1: "15%", x2: "35%", y2: "25%", g: "url(#ba-mod-lg1)", d: 0.5 },
          { x1: "35%", y1: "25%", x2: "25%", y2: "55%", g: "url(#ba-mod-lg1)", d: 0.8 },
          { x1: "25%", y1: "55%", x2: "10%", y2: "75%", g: "url(#ba-mod-lg2)", d: 1.1 },
          { x1: "65%", y1: "10%", x2: "80%", y2: "35%", g: "url(#ba-mod-lg2)", d: 0.6 },
          { x1: "80%", y1: "35%", x2: "70%", y2: "60%", g: "url(#ba-mod-lg1)", d: 0.9 },
          { x1: "70%", y1: "60%", x2: "90%", y2: "80%", g: "url(#ba-mod-lg2)", d: 1.2 },
          { x1: "35%", y1: "25%", x2: "65%", y2: "10%", g: "url(#ba-mod-lg2)", d: 1.0 },
          { x1: "25%", y1: "55%", x2: "70%", y2: "60%", g: "url(#ba-mod-lg1)", d: 1.3 },
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
            {/* Floating badge */}
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
              <span className="text-xs font-semibold text-gray-600 tracking-wide">6 Modules · 36+ Topics · 28 Weeks · 10+ Tools</span>
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
              Each module builds on the last — from spreadsheets to Python analytics. Click any module to explore what&apos;s inside.
            </p>
          </div>
        </ScrollReveal>

        {/* ── Bento Grid of Module Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {MODULE_DATA.map((mod, idx) => (
            <ModuleCard key={mod.id} mod={mod} index={idx} onEnquiry={openEnquiry} />
          ))}
        </div>

        {/* ── Bottom Stats Bar ── */}
        <motion.div
          className="mt-14 flex justify-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 px-8 py-5 rounded-2xl bg-white/60 backdrop-blur-md border border-white/80 shadow-lg">
            {[
              { value: "6", label: "Modules", color: BRAND_ORANGE },
              { value: "36+", label: "Topics", color: "#7c3aed" },
              { value: "28", label: "Weeks", color: "#0891b2" },
              { value: "10+", label: "Tools", color: "#059669" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                className="text-center"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + i * 0.1 }}
              >
                <motion.p
                  className="text-3xl md:text-4xl font-bold"
                  style={{ color: stat.color }}
                  initial={{ scale: 0.5 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 + i * 0.1, type: "spring", stiffness: 200 }}
                >
                  {stat.value}
                </motion.p>
                <p className="text-xs text-gray-500 font-medium mt-0.5 uppercase tracking-wider">{stat.label}</p>
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

export default function BusinessAnalyticsPage() {
  const { openEnquiry } = useEnquiryModal();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  const [openFaq, setOpenFaq] = useState(0);
  const [activeTab, setActiveTab] = useState(0);

  const personas = [
    { icon: BriefcaseIcon, title: "Working Professionals", desc: "You've seen decisions made on gut feelings and it frustrates you. This program makes you the person your team turns to when they need answers backed by data.", color: BRAND_ORANGE },
    { icon: GraduationIcon, title: "MBA Graduates", desc: "Your business sense is sharp, but your data skills aren't. Add Power BI, SQL, and predictive analytics to your MBA and watch how fast doors open.", color: ACCENT_BLUE },
    { icon: UserIcon, title: "Managers & Team Leads", desc: "Stop relying on hunches. Learn to build dashboards, track KPIs, and present data stories that actually change how your company operates.", color: ACCENT_CYAN },
    { icon: RocketIcon, title: "Career Pivoters", desc: "Coming from ops, marketing, or finance? This is analytics for business people - no one expects you to become an engineer.", color: BRAND_ORANGE },
  ];

  const curriculum = [
    { phase: "01", title: "Data Foundations for Business", duration: "Weeks 1–6", color: BRAND_ORANGE, skills: ["Excel", "Power BI", "Python", "KPI Design"], topics: [
      "Excel power-user mastery — advanced formulas, pivot tables, macros, business modeling",
      "Business dashboards — designing KPI frameworks, executive scorecards, real-time reporting",
      "Python for business automation — data extraction, report generation, email automation",
      "KPI design & metrics strategy — defining, measuring, and tracking business outcomes",
    ], code: [
      { text: "# Revenue KPI dashboard in Python", color: "#8b949e" },
      { text: "import pandas as pd", color: "#79c0ff" },
      { text: "", color: "#e6edf3" },
      { text: 'df = pd.read_csv("quarterly_revenue.csv")', color: "#e6edf3" },
      { text: "kpi = df.groupby('department')['revenue'].sum()", color: "#e6edf3" },
      { text: "growth = kpi.pct_change() * 100", color: "#e6edf3" },
      { text: "", color: "#e6edf3" },
      { text: ">>> Marketing: +18.4% | Sales: +24.1%", color: "#7ee787" },
    ]},
    { phase: "02", title: "Business Data Management", duration: "Weeks 7–11", color: ACCENT_BLUE, skills: ["CRM", "EDA", "Data Quality", "Reporting"], topics: [
      "CRM data cleaning — standardizing customer records, deduplication, data quality audits",
      "Market trend EDA — exploratory analysis of industry data, competitor benchmarking",
      "Automated reporting pipelines — scheduled reports, alert systems, stakeholder dashboards",
      "Data governance basics — data cataloging, quality standards, access policies",
    ], code: [
      { text: "# CRM data quality audit", color: "#8b949e" },
      { text: "duplicates = df.duplicated(subset='email')", color: "#e6edf3" },
      { text: "missing = df.isnull().sum()", color: "#e6edf3" },
      { text: "", color: "#e6edf3" },
      { text: 'print(f"Duplicates: {duplicates.sum()}")', color: "#e6edf3" },
      { text: ">>> Duplicates: 847", color: "#7ee787" },
      { text: ">>> Missing values cleaned: 1,204", color: "#7ee787" },
    ]},
    { phase: "03", title: "Predictive Business Analytics", duration: "Weeks 12–17", color: ACCENT_CYAN, skills: ["Forecasting", "Churn", "A/B Testing", "ROI"], topics: [
      "Sales forecasting — time series models, seasonal adjustment, pipeline prediction",
      "Customer churn prediction — logistic regression, survival analysis, retention modeling",
      "Market segmentation — RFM analysis, clustering, persona development",
      "A/B testing & experimentation — statistical significance, test design, ROI measurement",
    ], code: [
      { text: "# Churn prediction model", color: "#8b949e" },
      { text: "from sklearn.linear_model import LogisticRegression", color: "#79c0ff" },
      { text: "", color: "#e6edf3" },
      { text: "model = LogisticRegression()", color: "#e6edf3" },
      { text: "model.fit(X_train, y_train)", color: "#e6edf3" },
      { text: 'print(f"Churn risk accuracy: {model.score(X_test, y_test):.1%}")', color: "#e6edf3" },
      { text: ">>> Churn risk accuracy: 88.7%", color: "#7ee787" },
    ]},
    { phase: "04", title: "AI for Business Leaders", duration: "Weeks 18–24", color: BRAND_ORANGE, skills: ["Neural Networks", "Gen AI", "Ethics", "Cloud BI"], topics: [
      "Neural networks — conceptual understanding for non-engineers, business applications",
      "AI in marketing & operations — recommendation engines, demand forecasting, process automation",
      "Generative AI for business — ChatGPT integration, content automation, AI-powered workflows",
      "Cloud BI platforms — AWS QuickSight, Power BI Service, Google Looker Studio",
    ], code: [
      { text: "# AI-powered demand forecast", color: "#8b949e" },
      { text: "from prophet import Prophet", color: "#79c0ff" },
      { text: "", color: "#e6edf3" },
      { text: "model = Prophet(seasonality_mode='multiplicative')", color: "#e6edf3" },
      { text: "model.fit(sales_df)", color: "#e6edf3" },
      { text: "forecast = model.predict(future_dates)", color: "#e6edf3" },
      { text: "", color: "#e6edf3" },
      { text: ">>> Q4 forecast: ₹2.8Cr (+22% YoY)", color: "#7ee787" },
    ]},
  ];

  const tools = ["Power BI", "Tableau", "Looker", "Excel", "SQL", "Python", "R", "Google Analytics", "AWS QuickSight", "Azure", "NumPy", "Pandas", "Matplotlib", "Jupyter", "Git"];

  const projects = [
    {
      title: "Revenue Optimization Dashboard",
      desc: "Design a C-suite-ready Power BI dashboard that tracks revenue streams, identifies growth levers, and provides automated weekly insights.",
      tags: ["Power BI", "SQL", "Python"],
      color: BRAND_ORANGE,
      complexity: 2,
      outcome: "Live dashboard tracking $4.2M pipeline across 3 business units",
      icon: (
        <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
          <rect x="4" y="28" width="8" height="14" rx="2" fill="#F5822040" stroke="#F58220" strokeWidth="1.5"/>
          <rect x="16" y="18" width="8" height="24" rx="2" fill="#F5822060" stroke="#F58220" strokeWidth="1.5"/>
          <rect x="28" y="8" width="8" height="34" rx="2" fill="#F5822080" stroke="#F58220" strokeWidth="1.5"/>
          <path d="M8 24L20 14L32 8L42 12" stroke="#F58220" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="42" cy="12" r="3" fill="#F58220"/>
        </svg>
      ),
    },
    {
      title: "Customer Churn Reduction Strategy",
      desc: "Build a predictive churn model, identify at-risk segments, and present a data-backed retention strategy with projected ROI.",
      tags: ["Python", "Scikit-learn", "Tableau"],
      color: ACCENT_BLUE,
      complexity: 3,
      outcome: "Identified 234 at-risk customers, projected 23% retention improvement",
      icon: (
        <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
          <circle cx="24" cy="24" r="18" stroke="#3B82F620" strokeWidth="1"/>
          <circle cx="18" cy="18" r="8" fill="#3B82F630" stroke="#3B82F6" strokeWidth="1.5"/>
          <circle cx="32" cy="18" r="6" fill="#60A5FA30" stroke="#60A5FA" strokeWidth="1.5"/>
          <circle cx="22" cy="32" r="7" fill="#93C5FD30" stroke="#93C5FD" strokeWidth="1.5"/>
          <circle cx="34" cy="30" r="5" fill="#3B82F620" stroke="#3B82F6" strokeWidth="1.5"/>
        </svg>
      ),
    },
    {
      title: "Supply Chain Analytics Platform",
      desc: "Create an end-to-end analytics platform tracking supplier performance, delivery timelines, and inventory costs with anomaly detection.",
      tags: ["SQL", "Python", "Power BI"],
      color: ACCENT_CYAN,
      complexity: 3,
      outcome: "Reduced supply delays by 18% through predictive anomaly detection",
      icon: (
        <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
          <rect x="2" y="18" width="12" height="12" rx="3" fill="#06B6D420" stroke="#06B6D4" strokeWidth="1.5"/>
          <rect x="18" y="18" width="12" height="12" rx="3" fill="#06B6D440" stroke="#06B6D4" strokeWidth="1.5"/>
          <rect x="34" y="18" width="12" height="12" rx="3" fill="#06B6D460" stroke="#06B6D4" strokeWidth="1.5"/>
          <path d="M14 24H18" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round"/>
          <path d="M30 24H34" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round"/>
          <path d="M8 18V10H24V18" stroke="#06B6D450" strokeWidth="1" strokeLinecap="round" strokeDasharray="2 2"/>
          <path d="M24 30V38H40V30" stroke="#06B6D450" strokeWidth="1" strokeLinecap="round" strokeDasharray="2 2"/>
        </svg>
      ),
    },
    {
      title: "Executive KPI Dashboard",
      desc: "Build a multi-department KPI tracking system with drill-down capabilities, trend analysis, and automated alerting for metric deviations.",
      tags: ["Power BI", "Excel", "SQL"],
      color: BRAND_ORANGE,
      complexity: 4,
      outcome: "Automated 12 KPI alerts serving 5 department heads daily",
      icon: (
        <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
          <rect x="4" y="4" width="18" height="18" rx="4" fill="#F5822020" stroke="#F58220" strokeWidth="1.5"/>
          <rect x="26" y="4" width="18" height="18" rx="4" fill="#F5822030" stroke="#F58220" strokeWidth="1.5"/>
          <rect x="4" y="26" width="18" height="18" rx="4" fill="#F5822030" stroke="#F58220" strokeWidth="1.5"/>
          <rect x="26" y="26" width="18" height="18" rx="4" fill="#F5822020" stroke="#F58220" strokeWidth="1.5"/>
          <path d="M10 16L14 10L18 13" stroke="#F58220" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="35" cy="13" r="5" stroke="#F58220" strokeWidth="1.5"/>
          <rect x="10" y="32" width="8" height="2" rx="1" fill="#F58220" opacity="0.5"/>
          <rect x="10" y="36" width="6" height="2" rx="1" fill="#F58220" opacity="0.3"/>
          <path d="M32 32L35 36L38 34L41 38" stroke="#F58220" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
  ];

  const roles = [
    { title: "Business Analyst", range: "7–12 LPA" },
    { title: "BI Analyst", range: "6–10 LPA" },
    { title: "Analytics Manager", range: "12–18 LPA" },
    { title: "Strategy Consultant", range: "10–16 LPA" },
    { title: "Data Analyst", range: "6–10 LPA" },
    { title: "BI Developer", range: "8–14 LPA" },
  ];

  const faqs = [
    { question: "Do I need a technical background?", answer: "Not at all. This was built for business people. You'll learn SQL and Python, but always in a business context — think querying sales data or automating reports, not writing backend systems." },
    { question: "How is this different from an MBA analytics elective?", answer: "An MBA elective scratches the surface. This is months of building real dashboards, working with real datasets, and mastering production-grade BI tools. You'll graduate with a portfolio, not just theory." },
    { question: "Can I do this while working full-time?", answer: "That's exactly who it's designed for. Evening and weekend sessions, recorded classes, flexible deadlines. Most of our learners work full-time throughout the program." },
    { question: "What tools will I actually know?", answer: "Power BI, Tableau, Looker, advanced Excel, SQL, and Python for analytics. Plus cloud BI platforms like AWS QuickSight and Google Looker Studio." },
    { question: "What kind of career support do I get?", answer: "Career coaching, LinkedIn optimization, mock case study interviews, and direct intros to hiring partners in analytics, consulting, and strategy. We don't stop until you land the right role." },
  ];

  const highlights = [
    { icon: ShieldIcon, label: "100% Placement", sub: "Dedicated career support", color: BRAND_ORANGE },
    { icon: CurrencyIcon, label: "0% EMI Available", sub: "Starting ₹5,500/mo", color: ACCENT_BLUE },
    { icon: SparklesIcon, label: "BI Certification", sub: "Power BI + Tableau", color: ACCENT_CYAN },
    { icon: ClockIcon, label: "Flexible Schedule", sub: "Weekday & weekend batches", color: BRAND_ORANGE },
  ];

  return (
    <ThemeProvider theme="light">
    <div className="min-h-screen bg-white text-navy-900 selection:bg-orange-500/20 overflow-x-hidden">

      {/* ═══════ HERO ═══════ */}
      <section ref={heroRef} className="relative min-h-[88vh] flex items-center overflow-hidden" style={{ backgroundColor: DARK_BG }}>
        <div className="absolute inset-0" style={{
          background: `radial-gradient(ellipse 60% 45% at 20% 25%, ${BRAND_ORANGE}12 0%, transparent 55%), radial-gradient(ellipse 45% 35% at 80% 65%, ${ACCENT_BLUE}0c 0%, transparent 50%), linear-gradient(180deg, ${DARK_BG} 0%, #0c1220 50%, ${DARK_BG} 100%)`
        }} />
        <motion.div className="absolute w-[600px] h-[600px] -top-48 -right-48 rounded-full blur-[120px] pointer-events-none" animate={{ scale: [1, 1.12, 1], opacity: [0.2, 0.35, 0.2] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} style={{ background: `radial-gradient(circle, ${ACCENT_BLUE}20, transparent 70%)` }} />

        {[
          { text: "KPI.track()", x: "8%", y: "15%", dur: 18, delay: 0 },
          { text: "SELECT SUM(*)", x: "85%", y: "22%", dur: 22, delay: 2 },
          { text: "import powerbi", x: "72%", y: "75%", dur: 20, delay: 4 },
          { text: ".pivot_table()", x: "15%", y: "70%", dur: 24, delay: 1 },
          { text: "ROI: +34%", x: "55%", y: "12%", dur: 19, delay: 3 },
          { text: "forecast()", x: "90%", y: "55%", dur: 21, delay: 5 },
          { text: "churn_rate", x: "30%", y: "85%", dur: 23, delay: 2 },
          { text: "revenue: ₹2.8Cr", x: "45%", y: "90%", dur: 17, delay: 6 },
        ].map((frag, i) => (
          <motion.span key={i} className="absolute font-mono text-[11px] pointer-events-none select-none" style={{ left: frag.x, top: frag.y, color: `${ACCENT_BLUE}18` }}
            animate={{ y: [0, -15, 0, 10, 0], x: [0, 8, -5, 3, 0], opacity: [0.15, 0.3, 0.15, 0.25, 0.15] }}
            transition={{ duration: frag.dur, repeat: Infinity, delay: frag.delay, ease: "easeInOut" }}>{frag.text}</motion.span>
        ))}

        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <svg className="w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
            <defs><pattern id="dotGrid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse"><circle cx="30" cy="30" r="1" fill="white" /></pattern></defs>
            <rect width="100%" height="100%" fill="url(#dotGrid)" />
          </svg>
        </div>

        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="flowGrad1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor={BRAND_ORANGE} stopOpacity="0" /><stop offset="50%" stopColor={BRAND_ORANGE} stopOpacity="0.12" /><stop offset="100%" stopColor={BRAND_ORANGE} stopOpacity="0" /></linearGradient>
            <linearGradient id="flowGrad2" x1="100%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor={ACCENT_BLUE} stopOpacity="0" /><stop offset="50%" stopColor={ACCENT_BLUE} stopOpacity="0.08" /><stop offset="100%" stopColor={ACCENT_BLUE} stopOpacity="0" /></linearGradient>
            <linearGradient id="flowGrad3" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor={ACCENT_CYAN} stopOpacity="0" /><stop offset="50%" stopColor={ACCENT_CYAN} stopOpacity="0.06" /><stop offset="100%" stopColor={ACCENT_CYAN} stopOpacity="0" /></linearGradient>
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
            <div>
              <motion.div className="flex items-center gap-2 mb-6 flex-wrap" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono tracking-wide border border-white/[0.1] bg-white/[0.04] text-gray-400"><span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />Now Enrolling</span>
                <span className="px-3 py-1.5 rounded-full text-xs font-mono tracking-wide border border-white/[0.1] bg-white/[0.04] text-gray-400">6 Months</span>
              </motion.div>
              <motion.h1 className="text-5xl sm:text-6xl lg:text-[4.5rem] font-bold leading-[1.05] tracking-tight" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15, ease }}>
                <span className="text-white">Become a</span><br />
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${BRAND_ORANGE}, #f59e0b)` }}>Business Analyst</span>
              </motion.h1>
              <motion.div className="mt-5 h-8 flex items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.5 }}>
                <span className="text-gray-500 text-base">Master</span>
                <TypeWriter words={["Power BI & Tableau", "SQL & Python", "Predictive Analytics", "AI for Business", "Data Storytelling"]} className="text-base font-mono font-semibold text-white" />
              </motion.div>
              <motion.p className="mt-5 text-base md:text-lg text-gray-400 leading-relaxed max-w-lg" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35 }}>
                You don&apos;t need a CS degree to lead with data. BI tools, predictive analytics, and AI-powered decision-making — all designed for business leaders.
              </motion.p>
              <motion.div className="mt-8 flex flex-wrap items-center gap-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.55 }}>
                <Magnetic><motion.button onClick={openEnquiry} className="group relative px-7 py-3.5 rounded-xl font-semibold text-sm overflow-hidden cursor-pointer" style={{ backgroundColor: BRAND_ORANGE }} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}><span className="relative z-10 flex items-center gap-2 text-white">Start Learning <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span></motion.button></Magnetic>
                <Magnetic><motion.button onClick={openEnquiry} className="px-7 py-3.5 rounded-xl font-semibold text-sm border border-white/[0.12] text-white/80 hover:text-white hover:border-white/25 hover:bg-white/[0.04] transition-all duration-300 cursor-pointer" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>Download Syllabus</motion.button></Magnetic>
              </motion.div>
            </div>
            <motion.div className="relative hidden lg:block" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.4, ease }}>
              <HeroImageCarousel />
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-12 rounded-full blur-3xl" style={{ background: `${ACCENT_BLUE}15` }} />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Mobile hero image */}
      <div className="lg:hidden relative" style={{ backgroundColor: DARK_BG }}>
        <div className="px-6 pb-10">
          <HeroImageCarousel />
        </div>
      </div>

      {/* ═══════ HIGHLIGHTS BAR ═══════ */}
      <section className="relative py-5 px-6" style={{ backgroundColor: BRAND_NAVY }}>
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {highlights.map((h, i) => (
            <motion.div key={i} className="flex items-center gap-3 py-2" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.06 }}>
              <h.icon className="w-5 h-5 shrink-0" style={{ color: h.color }} />
              <div><p className="text-sm font-semibold text-white">{h.label}</p><p className="text-xs text-white/50">{h.sub}</p></div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════ STATS ═══════ */}
      <section className="relative py-16 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard value={400} suffix="+" label="Students Placed" icon={UserIcon} delay={0} accent={BRAND_ORANGE} />
          <StatCard value={15} suffix="" label="Industry Tools" icon={LayersIcon} delay={0.08} accent={ACCENT_BLUE} />
          <StatCard value={6} suffix="" label="Month Program" icon={ClockIcon} delay={0.16} accent={ACCENT_CYAN} />
          <StatCard value={6} suffix="" label="Capstone Projects" icon={RocketIcon} delay={0.24} accent={BRAND_ORANGE} />
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
                Designed for business leaders who want to make decisions with data, not guesswork.
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
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${ACCENT_PURPLE}, ${ACCENT_BLUE})` }}>Linkway Learning</span>?
            </h2>
            <p className="mt-3 text-gray-500 text-base max-w-xl mx-auto text-center">
              Upskilling from Linkway gives you an unfair advantage by placing you ahead of the curve.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
            {[
              { icon: SparklesIcon, title: "AI-First Curriculum", desc: "Specially designed curriculum keeping AI in focus to boost efficiency, and inculcate deep subject understanding.", color: ACCENT_PURPLE },
              { icon: UserIcon, title: "Real-World Interviews", desc: "On demand mock interviews with actual tech company hiring managers to prepare you for the toughest questions.", color: ACCENT_BLUE },
              { icon: LayersIcon, title: "Industry Vetted Curriculum", desc: "Targeted training for Business Analytics, Strategy, and AI models at the standards expected by top companies.", color: ACCENT_CYAN },
              { icon: GraduationIcon, title: "Expert Mentors & Instructorship", desc: "Get trained by industry experts from top tech companies globally, tailored to your career goals.", color: ACCENT_PURPLE },
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
                  left: `${(activeTab >= 0 ? activeTab : 0) * 25 + 0.5}%`,
                  width: "25%",
                  opacity: 0.15,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
              {curriculum.map((mod, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTab(i)}
                  className={cn(
                    "relative z-10 flex items-center gap-2.5 px-4 py-3 rounded-xl transition-all duration-300 cursor-pointer",
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
                    { label: "Duration", value: mod.duration.split(" ")[1]?.split("–")[1] || "6", suffix: " weeks", icon: <ClockIcon className="w-5 h-5" style={{ color: mod.color }} /> },
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
                    style={{ backgroundColor: mod.color, borderColor: "#070b14" }}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + j * 0.1, type: "spring" }}
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-gray-400">4 phases</span>
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

      <ModulesSection openEnquiry={openEnquiry} />

      {/* ═══════ TOOLS — Two-row marquee ═══════ */}
      <section className="relative py-20 px-6 bg-white overflow-hidden">
        <Divider />
        <div className="max-w-6xl mx-auto pt-12">
          <ScrollReveal>
            <SectionLabel center>Tech Stack</SectionLabel>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy-900 leading-tight text-center">
              {tools.length}+ Tools You&apos;ll{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${ACCENT_BLUE}, ${BRAND_ORANGE})` }}>Master</span>
            </h2>
          </ScrollReveal>

          {/* Two-row scrolling marquee */}
          <div className="mt-14 space-y-4">
            {[tools.slice(0, Math.ceil(tools.length / 2)), tools.slice(Math.ceil(tools.length / 2))].map((row, ri) => (
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

      {/* ═══════ PROJECTS — Compact premium grid ═══════ */}
      <section className="relative py-16 px-6 overflow-hidden" style={{ backgroundColor: DARK_BG }}>
        {/* ── 1. AURORA SILK RIBBONS — flowing morphing gradient paths ── */}
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
            <linearGradient id="ribbonC" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={ACCENT_CYAN} stopOpacity="0" />
              <stop offset="40%" stopColor="#06b6d4" stopOpacity="0.08" />
              <stop offset="70%" stopColor={BRAND_ORANGE} stopOpacity="0.06" />
              <stop offset="100%" stopColor={BRAND_ORANGE} stopOpacity="0" />
            </linearGradient>
            <filter id="ribbonGlow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          {/* Ribbon 1 — top flowing silk */}
          <motion.path
            d="M-100,120 C150,40 350,200 600,80 S950,180 1200,60 1500,140"
            fill="none" stroke="url(#ribbonA)" strokeWidth="2" filter="url(#ribbonGlow)"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
          />
          <motion.path
            d="M-100,125 C160,50 340,210 610,90 S940,190 1210,70 1500,150"
            fill="none" stroke="url(#ribbonA)" strokeWidth="1" opacity="0.5"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2.8, delay: 0.2, ease: "easeInOut" }}
          />
          {/* Ribbon 2 — middle flowing silk */}
          <motion.path
            d="M-50,320 C200,250 450,400 700,280 S1050,380 1300,300 1600,350"
            fill="none" stroke="url(#ribbonB)" strokeWidth="2" filter="url(#ribbonGlow)"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 3, delay: 0.4, ease: "easeInOut" }}
          />
          <motion.path
            d="M-50,326 C210,258 440,408 710,288 S1040,388 1310,308 1600,358"
            fill="none" stroke="url(#ribbonB)" strokeWidth="0.8" opacity="0.4"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 3.2, delay: 0.6, ease: "easeInOut" }}
          />
          {/* Ribbon 3 — bottom flowing silk */}
          <motion.path
            d="M-80,500 C180,440 400,550 680,460 S1000,530 1250,480 1600,520"
            fill="none" stroke="url(#ribbonC)" strokeWidth="1.5" filter="url(#ribbonGlow)"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 3.5, delay: 0.8, ease: "easeInOut" }}
          />

          {/* Glowing orbs traveling along ribbons */}
          <motion.circle r="4" fill={BRAND_ORANGE} opacity="0.6" filter="url(#ribbonGlow)"
            animate={{ cx: [-100, 150, 600, 1200, 1500], cy: [120, 40, 80, 60, 140] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
          <motion.circle r="3" fill={ACCENT_BLUE} opacity="0.5" filter="url(#ribbonGlow)"
            animate={{ cx: [-50, 200, 700, 1300, 1600], cy: [320, 250, 280, 300, 350] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear", delay: 2 }}
          />
          <motion.circle r="3.5" fill={ACCENT_CYAN} opacity="0.4" filter="url(#ribbonGlow)"
            animate={{ cx: [-80, 180, 680, 1250, 1600], cy: [500, 440, 460, 480, 520] }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear", delay: 4 }}
          />
        </svg>

        {/* ── 2. RISING DATA PARTICLES — business symbols floating up like embers ── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[
            { char: "KPI", x: "8%", delay: 0, dur: 12, size: 11 },
            { char: "ROI", x: "15%", delay: 2, dur: 14, size: 10 },
            { char: "$", x: "22%", delay: 5, dur: 11, size: 12 },
            { char: "↑", x: "32%", delay: 1, dur: 13, size: 11 },
            { char: "%", x: "42%", delay: 4, dur: 15, size: 10 },
            { char: "Σ", x: "52%", delay: 3, dur: 12, size: 11 },
            { char: "→", x: "60%", delay: 6, dur: 14, size: 10 },
            { char: "Δ", x: "68%", delay: 2, dur: 11, size: 10 },
            { char: "∞", x: "76%", delay: 5, dur: 13, size: 10 },
            { char: "μ", x: "84%", delay: 1, dur: 15, size: 11 },
            { char: "€", x: "91%", delay: 4, dur: 12, size: 10 },
            { char: "P&L", x: "18%", delay: 7, dur: 16, size: 9 },
            { char: "YoY", x: "48%", delay: 3, dur: 11, size: 10 },
            { char: "+34%", x: "72%", delay: 6, dur: 14, size: 9 },
            { char: "NPS", x: "38%", delay: 8, dur: 13, size: 10 },
            { char: "CAGR", x: "88%", delay: 2, dur: 12, size: 9 },
          ].map((p, i) => (
            <motion.span
              key={`ember-${i}`}
              className="absolute font-mono select-none"
              style={{
                left: p.x,
                bottom: "-5%",
                fontSize: p.size,
                color: i % 3 === 0 ? `${BRAND_ORANGE}` : i % 3 === 1 ? `${ACCENT_BLUE}` : `${ACCENT_CYAN}`,
              }}
              animate={{
                y: [0, -800],
                opacity: [0, 0.25, 0.15, 0],
                rotate: [0, i % 2 === 0 ? 45 : -30],
                x: [0, i % 2 === 0 ? 30 : -20],
              }}
              transition={{
                duration: p.dur,
                repeat: Infinity,
                delay: p.delay,
                ease: "linear",
              }}
            >
              {p.char}
            </motion.span>
          ))}
        </div>

        {/* ── 3. WIREFRAME GEOMETRIC SHAPES — 3D-perspective rotating ── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Rotating diamond/rhombus — top right */}
          <motion.div
            className="absolute"
            style={{ top: "8%", right: "12%", width: 60, height: 60 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          >
            <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <motion.path
                d="M30 5 L55 30 L30 55 L5 30Z"
                stroke={BRAND_ORANGE}
                strokeWidth="0.8"
                strokeOpacity="0.15"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 2 }}
              />
              <motion.path
                d="M30 12 L48 30 L30 48 L12 30Z"
                stroke={BRAND_ORANGE}
                strokeWidth="0.5"
                strokeOpacity="0.08"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 2, delay: 0.3 }}
              />
            </svg>
          </motion.div>

          {/* Rotating hexagon — bottom left */}
          <motion.div
            className="absolute"
            style={{ bottom: "12%", left: "8%", width: 80, height: 80 }}
            animate={{ rotate: -360 }}
            transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
          >
            <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <motion.path
                d="M40 5 L70 20 L70 50 L40 65 L10 50 L10 20Z"
                stroke={ACCENT_CYAN}
                strokeWidth="0.8"
                strokeOpacity="0.12"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 2.5, delay: 0.5 }}
              />
              {/* Inner hexagon */}
              <motion.path
                d="M40 15 L60 25 L60 45 L40 55 L20 45 L20 25Z"
                stroke={ACCENT_CYAN}
                strokeWidth="0.5"
                strokeOpacity="0.07"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 2, delay: 0.8 }}
              />
              {/* Center dot */}
              <circle cx="40" cy="35" r="2" fill={ACCENT_CYAN} opacity="0.15" />
            </svg>
          </motion.div>

          {/* Rotating triangle — middle right */}
          <motion.div
            className="absolute"
            style={{ top: "45%", right: "5%", width: 50, height: 50 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          >
            <svg viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <motion.path
                d="M25 5 L45 40 L5 40Z"
                stroke={ACCENT_BLUE}
                strokeWidth="0.8"
                strokeOpacity="0.12"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 2, delay: 1 }}
              />
              <motion.path
                d="M25 12 L40 36 L10 36Z"
                stroke={ACCENT_BLUE}
                strokeWidth="0.5"
                strokeOpacity="0.06"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 2, delay: 1.2 }}
              />
            </svg>
          </motion.div>
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <ScrollReveal>
            <SectionLabel light>Hands-On</SectionLabel>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Projects You&apos;ll{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${ACCENT_CYAN}, ${BRAND_ORANGE})` }}>Ship</span>
            </h2>
            <p className="mt-3 text-gray-500 text-base max-w-md">Real-world business projects that become your portfolio.</p>
          </ScrollReveal>

          {/* 2×2 compact grid */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-3">
            {projects.map((project, i) => (
              <motion.div key={i} className="group relative rounded-xl overflow-hidden cursor-default" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-5%" }} transition={{ duration: 0.5, delay: i * 0.08, ease }} whileHover={{ y: -3 }}>
                <div className="absolute inset-0 rounded-xl border border-white/[0.06] group-hover:border-white/[0.14] transition-colors duration-500 pointer-events-none z-20" />
                <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: `radial-gradient(300px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${project.color}10, transparent 60%)` }} />
                <div className="relative z-10 p-5" style={{ backgroundColor: "rgba(255,255,255,0.02)" }} onMouseMove={(e) => { const rect = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`); e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`); }}>
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
                      <div className="flex flex-wrap gap-1.5">
                        {project.tags.map((tag) => (<span key={tag} className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium border" style={{ color: `${project.color}bb`, borderColor: `${project.color}18`, backgroundColor: `${project.color}06` }}>{tag}</span>))}
                      </div>
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

          {/* Interactive Dashboard Preview */}
          <motion.div className="mt-10 relative max-w-4xl mx-auto" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <BIDashboardPreview />
          </motion.div>
        </div>
      </section>

      {/* ═══════ CAREER OUTCOMES ═══════ */}
      <section className="relative py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <SectionLabel>Outcomes</SectionLabel>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy-900 leading-tight">Where You&apos;ll{" "}<span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${BRAND_ORANGE}, ${ACCENT_BLUE})` }}>End Up</span></h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-12">
            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {roles.map((role, i) => (
                <SlideIn key={i} direction="up" delay={i * 0.05}>
                  <Card accent={ACCENT_BLUE}><div className="flex items-center justify-between"><div><h4 className="text-sm font-semibold text-navy-900">{role.title}</h4><p className="text-xs text-gray-500 mt-0.5 font-mono">{role.range}</p></div><TargetIcon className="w-4 h-4 text-gray-300" /></div></Card>
                </SlideIn>
              ))}
            </div>
            <div className="lg:col-span-2 space-y-5 flex flex-col justify-center">
              <SlideIn direction="right">
                <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6">
                  <p className="text-xs font-mono text-gray-400 tracking-widest uppercase mb-2">Expected Salary Range</p>
                  <p className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${BRAND_ORANGE}, ${ACCENT_BLUE})` }}>₹7–15 LPA</p>
                </div>
              </SlideIn>
              <SlideIn direction="right" delay={0.1}>
                <div className="flex items-center gap-3 px-5 py-3.5 rounded-xl border border-gray-200 bg-gray-50">
                  <ShieldIcon className="w-5 h-5 shrink-0" style={{ color: BRAND_ORANGE }} />
                  <div><p className="text-sm text-navy-900 font-semibold">100% Placement</p><p className="text-xs text-gray-500">Dedicated career support</p></div>
                </div>
              </SlideIn>
              <SlideIn direction="right" delay={0.2}>
                <div className="flex items-center gap-3 px-5 py-3.5 rounded-xl border border-gray-200 bg-gray-50">
                  <SparklesIcon className="w-5 h-5 shrink-0" style={{ color: ACCENT_BLUE }} />
                  <div><p className="text-sm text-navy-900 font-semibold">Power BI & Tableau Certification</p><p className="text-xs text-gray-500">Industry-recognized credentials</p></div>
                </div>
              </SlideIn>
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
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy-900 leading-tight text-center">Common{" "}<span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${BRAND_ORANGE}, ${ACCENT_BLUE})` }}>Questions</span></h2>
          </ScrollReveal>
          <div className="mt-10 bg-white rounded-2xl border border-gray-100 px-6 md:px-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
            {faqs.map((faq, i) => (<FAQItem key={i} question={faq.question} answer={faq.answer} isOpen={openFaq === i} onClick={() => setOpenFaq(openFaq === i ? -1 : i)} index={i} />))}
          </div>
        </div>
      </section>

      <WaveDivider from="#f9fafb" to="#f9fafb" />

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

      {/* ═══════ CAREER GROWTH ROADMAP — Animated SVG path ═══════ */}
      <section className="relative py-24 px-6 bg-white overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] rounded-full pointer-events-none" style={{ background: `radial-gradient(ellipse, ${ACCENT_BLUE}05, transparent 70%)` }} />
        <div className="max-w-6xl mx-auto relative z-10">
          <ScrollReveal>
            <SectionLabel center>Your Journey</SectionLabel>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy-900 leading-tight text-center">
              Your Career Growth{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${ACCENT_PURPLE}, ${ACCENT_BLUE})` }}>Roadmap</span>
            </h2>
            <p className="text-center text-gray-500 mt-4 max-w-xl mx-auto text-sm leading-relaxed">
              A proven 4-step path to take you from upskilling to your dream job
            </p>
          </ScrollReveal>

          <div className="mt-20 relative">
            <svg className="hidden lg:block absolute top-[56px] left-0 w-full h-[50px] pointer-events-none" viewBox="0 0 1152 50" fill="none" preserveAspectRatio="none">
              <motion.path d="M 100 25 C 220 25, 240 8, 330 8 C 420 8, 430 42, 520 42 C 610 42, 620 8, 710 8 C 800 8, 810 42, 900 42 C 940 42, 960 25, 1052 25" stroke="url(#rmGrad)" strokeWidth="2.5" strokeDasharray="10 7" strokeLinecap="round" fill="none" initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 2.5, ease: "easeOut" }} />
              <defs><linearGradient id="rmGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor={ACCENT_BLUE} stopOpacity={0.35} /><stop offset="50%" stopColor={ACCENT_PURPLE} stopOpacity={0.4} /><stop offset="100%" stopColor={ACCENT_BLUE} stopOpacity={0.35} /></linearGradient></defs>
              <motion.circle r="5" fill={ACCENT_PURPLE} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 2 }}><animateMotion dur="5s" repeatCount="indefinite" path="M 100 25 C 220 25, 240 8, 330 8 C 420 8, 430 42, 520 42 C 610 42, 620 8, 710 8 C 800 8, 810 42, 900 42 C 940 42, 960 25, 1052 25" /></motion.circle>
              <motion.circle r="12" fill={ACCENT_PURPLE} opacity={0.15} initial={{ opacity: 0 }} whileInView={{ opacity: 0.15 }} viewport={{ once: true }} transition={{ delay: 2 }}><animateMotion dur="5s" repeatCount="indefinite" path="M 100 25 C 220 25, 240 8, 330 8 C 420 8, 430 42, 520 42 C 610 42, 620 8, 710 8 C 800 8, 810 42, 900 42 C 940 42, 960 25, 1052 25" /></motion.circle>
            </svg>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
              {([
                { title: "Profile Power-Up", desc: "Stand out with a sharp resume, optimized LinkedIn/GitHub, and a strong personal brand.", color: "#3B82F6", icon: (<svg viewBox="0 0 48 48" fill="none" className="w-full h-full"><circle cx="18" cy="16" r="5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M7 38c0-6.075 4.925-11 11-11s11 4.925 11 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><circle cx="35" cy="18" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M29 38c0-4.418 2.686-8 6-8s6 3.582 6 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><motion.path d="M32 10l2-2 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 1 }} /></svg>) },
                { title: "Interview Readiness", desc: "Ace every round with 1:1 mock interviews, role-specific training, and actionable feedback.", color: "#8B5CF6", icon: (<svg viewBox="0 0 48 48" fill="none" className="w-full h-full"><rect x="8" y="6" width="32" height="36" rx="4" stroke="currentColor" strokeWidth="2" /><circle cx="24" cy="18" r="5" stroke="currentColor" strokeWidth="2" /><path d="M16 34c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><motion.path d="M30 14l3 3 5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 1.2 }} /></svg>) },
                { title: "Hiring Rounds", desc: "Apply to 200+ hiring partners and clear technical interview rounds with confidence.", color: "#0EA5E9", icon: (<svg viewBox="0 0 48 48" fill="none" className="w-full h-full"><rect x="10" y="8" width="28" height="32" rx="3" stroke="currentColor" strokeWidth="2" /><path d="M16 16h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M16 22h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M16 28h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><motion.rect x="16" y="34" rx="1.5" height="3" fill="currentColor" opacity={0.6} animate={{ width: [8, 16, 8] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} /></svg>) },
                { title: "Offer Unlocked!", desc: "Land a high paying job offer from top product-based companies.", color: "#F97316", icon: (<svg viewBox="0 0 48 48" fill="none" className="w-full h-full"><motion.path d="M24 34V14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" animate={{ y: [0, -2, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} /><motion.path d="M17 21l7-7 7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" animate={{ y: [0, -2, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} /><path d="M10 40h28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><motion.circle cx="24" cy="8" r="2.5" fill="currentColor" animate={{ scale: [0.8, 1.3, 0.8], opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }} /></svg>) },
              ]).map((step, i) => (
                <motion.div key={step.title} className="flex flex-col items-center text-center group" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-5%" }} transition={{ duration: 0.6, delay: i * 0.18, ease }}>
                  <motion.div className="relative mb-7" whileHover={{ scale: 1.1, rotate: [0, -3, 3, 0] }} transition={{ duration: 0.4 }}>
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

      {/* ═══════ FINAL CTA — Join 8000+ professionals ═══════ */}
      <FooterCTA />
    </div>
    </ThemeProvider>
  );
}
