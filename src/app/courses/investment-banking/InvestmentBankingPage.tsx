"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Counter from "@/components/animation/Counter";
import ScrollReveal from "@/components/animation/ScrollReveal";
import ToolLogo from "@/components/ui/ToolLogo";
import { useEnquiryModal } from "@/components/forms/EnquiryModal";
import { usePurchaseModal } from "@/components/forms/PurchaseModal";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/lib/theme";
import FooterCTA from "@/components/sections/FooterCTA";
import CertificationDisplay from "@/components/sections/CertificationDisplay";

gsap.registerPlugin(ScrollTrigger);

const BRAND_ORANGE = "#F58220";
const BRAND_NAVY = "#0D1B2A";
const ACCENT_BLUE = "#3B82F6";
const ACCENT_CYAN = "#06B6D4";
const ACCENT_GOLD = "#F59E0B";
const DARK_BG = "#0a0e18";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

/* ── Utility Components ── */

function TypeWriter({ words, className }: { words: string[]; className?: string }) {
  const [wordIdx, setWordIdx] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const word = words[wordIdx]; const timeout = deleting ? 40 : 80;
    if (!deleting && text === word) { const pause = setTimeout(() => setDeleting(true), 2000); return () => clearTimeout(pause); }
    if (deleting && text === "") { setDeleting(false); setWordIdx((prev) => (prev + 1) % words.length); return; }
    const timer = setTimeout(() => { setText(deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1)); }, timeout);
    return () => clearTimeout(timer);
  }, [text, deleting, wordIdx, words]);
  return (<span className={className}>{text}<span className="inline-block w-[3px] h-[1em] ml-1 align-middle animate-pulse" style={{ backgroundColor: ACCENT_GOLD }} /></span>);
}

function Magnetic({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null); const x = useMotionValue(0); const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 20 }); const springY = useSpring(y, { stiffness: 200, damping: 20 });
  return (<motion.div ref={ref} className={className} style={{ x: springX, y: springY }} onMouseMove={(e) => { if (!ref.current) return; const rect = ref.current.getBoundingClientRect(); x.set((e.clientX - rect.left - rect.width / 2) * 0.12); y.set((e.clientY - rect.top - rect.height / 2) * 0.12); }} onMouseLeave={() => { x.set(0); y.set(0); }}>{children}</motion.div>);
}

function SlideIn({ children, direction = "up", delay = 0, className }: { children: React.ReactNode; direction?: "up" | "down" | "left" | "right"; delay?: number; className?: string }) {
  const offsets = { up: { y: 40 }, down: { y: -40 }, left: { x: -50 }, right: { x: 50 } };
  return (<motion.div className={className} initial={{ opacity: 0, x: 0, y: 0, ...offsets[direction] }} whileInView={{ opacity: 1, x: 0, y: 0 }} viewport={{ once: true, margin: "-8%" }} transition={{ duration: 0.6, delay, ease }}>{children}</motion.div>);
}

function Card({ children, className, accent = ACCENT_GOLD }: { children: React.ReactNode; className?: string; accent?: string }) {
  const [pos, setPos] = useState({ x: 0, y: 0 }); const ref = useRef<HTMLDivElement>(null);
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
  return (<div className={cn("flex items-center gap-3 mb-4", center && "justify-center")}><span className={cn("inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-[0.15em] uppercase", light ? "bg-white/10 text-white/70 border border-white/10" : "bg-amber-50 border border-amber-100")} style={!light ? { color: ACCENT_GOLD } : undefined}><span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: light ? "#fff" : ACCENT_GOLD, opacity: light ? 0.5 : 1 }} />{children}</span></div>);
}

function StatCard({ value, suffix, label, icon: Icon, delay = 0, accent = ACCENT_GOLD }: { value: number; suffix: string; label: string; icon: React.FC<{ className?: string; style?: React.CSSProperties }>; delay?: number; accent?: string }) {
  return (<SlideIn direction="up" delay={delay}><div className="relative bg-white rounded-2xl border border-gray-100 p-6 text-center overflow-hidden group hover:border-gray-200 transition-colors duration-300"><div className="absolute top-3 right-3 opacity-[0.06] group-hover:opacity-[0.1] transition-opacity duration-500"><Icon className="w-14 h-14" style={{ color: accent }} /></div><div className="text-4xl md:text-5xl font-bold mb-1.5" style={{ color: BRAND_NAVY }}><Counter target={value} suffix={suffix} duration={2} /></div><p className="text-sm text-gray-500 font-medium">{label}</p></div></SlideIn>);
}

function Divider({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null); const inView = useInView(ref, { once: true });
  return (<div ref={ref} className={cn("relative h-px w-full overflow-hidden", className)}><motion.div className="absolute inset-0" style={{ background: `linear-gradient(90deg, transparent, ${ACCENT_GOLD}30, ${ACCENT_BLUE}30, transparent)` }} initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}} transition={{ duration: 1.2, ease }} /></div>);
}

function WaveDivider({ flip = false, from = "#f9fafb", to = "#ffffff" }: { flip?: boolean; from?: string; to?: string }) {
  return (<div className={cn("w-full overflow-hidden leading-[0]", flip && "rotate-180")} style={{ backgroundColor: from }}><svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-[40px] md:h-[60px]"><path d="M0,30 C360,60 720,0 1080,30 C1260,45 1380,35 1440,30 L1440,60 L0,60 Z" fill={to} /></svg></div>);
}

function JourneyPhaseCard({ mod, index, isOpen, onToggle, codeLines }: {
  mod: { phase: string; title: string; duration: string; color: string; topics: string[]; skills: string[] }; index: number; isOpen: boolean; onToggle: () => void; codeLines: { text: string; color: string }[];
}) {
  const ref = useRef<HTMLDivElement>(null); const inView = useInView(ref, { once: true, margin: "-5%" });
  return (
    <motion.div ref={ref} className="relative" initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: index * 0.15, ease }}>
      <div className={cn("relative rounded-2xl border overflow-hidden transition-all duration-500 cursor-pointer", isOpen ? "bg-white shadow-[0_12px_40px_rgba(0,0,0,0.08)] border-gray-200" : "bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] border-gray-100 hover:border-gray-200 hover:shadow-[0_6px_20px_rgba(0,0,0,0.06)]")} onClick={onToggle}>
        <motion.div className="h-1 w-full" initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}} transition={{ duration: 0.8, delay: index * 0.15 + 0.3, ease }} style={{ transformOrigin: "left", backgroundColor: mod.color }} />
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative"><motion.div className="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg font-mono text-white" style={{ backgroundColor: mod.color }} whileHover={{ scale: 1.08, rotate: -3 }} transition={{ type: "spring", stiffness: 400, damping: 15 }}>{mod.phase}</motion.div><div className="absolute inset-0 rounded-2xl blur-lg opacity-30" style={{ backgroundColor: mod.color }} /></div>
            <div><h3 className="text-xl font-bold text-navy-900">{mod.title}</h3><p className="text-sm text-gray-400 font-mono mt-0.5">{mod.duration}</p></div>
          </div>
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center shrink-0"><ChevronIcon className="w-4 h-4 text-gray-400" /></motion.div>
        </div>
        <div className="px-6 pb-4 flex flex-wrap gap-1.5">
          {mod.skills.map((skill, j) => (<motion.span key={skill} className="px-2.5 py-1 rounded-lg text-xs font-medium border" style={{ color: mod.color, borderColor: `${mod.color}25`, backgroundColor: `${mod.color}08` }} initial={{ opacity: 0, scale: 0.8 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.3, delay: index * 0.15 + 0.4 + j * 0.05 }}>{skill}</motion.span>))}
        </div>
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease }} className="overflow-hidden">
              <div className="px-6 pb-6"><div className="h-px bg-gray-100 mb-5" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <div className="space-y-3"><p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">What you&apos;ll learn</p>
                    {mod.topics.map((topic, j) => (<motion.div key={j} className="flex items-start gap-3 p-3.5 rounded-xl bg-gray-50 border border-gray-100" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: j * 0.08 }}><CheckCircleIcon className="w-4 h-4 mt-0.5 shrink-0" style={{ color: mod.color }} /><span className="text-sm text-gray-700 leading-relaxed">{topic}</span></motion.div>))}
                  </div>
                  <motion.div className="rounded-xl overflow-hidden border border-gray-200" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.15 }}>
                    <div className="flex items-center gap-1.5 px-3 py-2 bg-[#1a1e2e] border-b border-white/[0.06]"><span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" /><span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" /><span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" /><span className="text-[10px] font-mono text-gray-500 ml-2">preview</span></div>
                    <div className="bg-[#0d1117] p-4 font-mono text-[12px] leading-[1.8]">{codeLines.map((line, j) => (<motion.div key={j} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2, delay: 0.2 + j * 0.06 }} className="whitespace-pre" style={{ color: line.color }}>{line.text}</motion.div>))}</div>
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
      <button onClick={onClick} className="flex items-center justify-between w-full py-5 text-left group cursor-pointer"><span className="text-base md:text-lg font-medium text-navy-900 group-hover:text-amber-500 transition-colors pr-4" style={{ '--tw-hover-color': ACCENT_GOLD } as React.CSSProperties}>{question}</span><motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }}><ChevronIcon className="w-5 h-5 text-gray-400 group-hover:text-amber-500 transition-colors" /></motion.span></button>
      <AnimatePresence initial={false}>{isOpen && (<motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease }} className="overflow-hidden"><p className="pb-5 text-gray-600 leading-relaxed text-[15px]">{answer}</p></motion.div>)}</AnimatePresence>
    </motion.div>
  );
}

function Terminal({ title, lines, className }: { title: string; lines: { text: string; color?: string; delay?: number }[]; className?: string }) {
  const ref = useRef<HTMLDivElement>(null); const inView = useInView(ref, { once: true, margin: "-10%" }); const [visibleLines, setVisibleLines] = useState(0);
  useEffect(() => { if (!inView) return; if (visibleLines >= lines.length) return; const delay = lines[visibleLines]?.delay ?? 120; const timer = setTimeout(() => setVisibleLines((v) => v + 1), delay); return () => clearTimeout(timer); }, [inView, visibleLines, lines]);
  return (
    <div ref={ref} className={cn("rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl", className)}>
      <div className="flex items-center gap-2 px-4 py-2.5 bg-[#1a1e2e] border-b border-white/[0.06]"><div className="flex gap-1.5"><span className="w-3 h-3 rounded-full bg-[#ff5f57]" /><span className="w-3 h-3 rounded-full bg-[#febc2e]" /><span className="w-3 h-3 rounded-full bg-[#28c840]" /></div><span className="text-xs font-mono text-gray-500 ml-2">{title}</span></div>
      <div className="bg-[#0d1117] p-5 font-mono text-[13px] leading-[1.7] min-h-[200px] overflow-hidden">
        {lines.slice(0, visibleLines).map((line, i) => (<motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.15 }} className="whitespace-pre" style={{ color: line.color || "#e6edf3" }}>{line.text}</motion.div>))}
        {visibleLines < lines.length && <span className="inline-block w-2 h-4 bg-green-400 animate-pulse ml-0.5" />}
      </div>
    </div>
  );
}

function DashboardMock({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null); const inView = useInView(ref, { once: true, margin: "-10%" });
  const bars = [
    { label: "IB Analyst", value: 85, color: ACCENT_GOLD },
    { label: "Financial Analyst", value: 80, color: ACCENT_BLUE },
    { label: "Equity Research", value: 72, color: ACCENT_CYAN },
    { label: "PE Associate", value: 68, color: ACCENT_GOLD },
    { label: "Corp Finance", value: 62, color: ACCENT_BLUE },
  ];
  const metrics = [
    { label: "Avg. Salary", value: "₹11 LPA", delta: "+30%" },
    { label: "Placed", value: "350+", delta: "+78%" },
    { label: "Hiring Partners", value: "60+", delta: "+55%" },
  ];
  return (
    <div ref={ref} className={cn("rounded-2xl overflow-hidden border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.06)]", className)}>
      <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-100"><div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-400" /><span className="text-xs font-mono text-gray-500">placement_analytics.dashboard</span></div><span className="text-[10px] font-mono text-gray-400">LIVE</span></div>
      <div className="bg-white p-5">
        <div className="grid grid-cols-3 gap-3 mb-5">{metrics.map((m, i) => (<motion.div key={i} className="text-center p-3 rounded-xl bg-gray-50 border border-gray-100" initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.3, delay: 0.2 + i * 0.1 }}><p className="text-lg font-bold text-navy-900">{m.value}</p><p className="text-[10px] text-gray-500">{m.label}</p><span className="text-[10px] font-mono text-green-500">{m.delta}</span></motion.div>))}</div>
        <div className="space-y-2.5">{bars.map((bar, i) => (<div key={i} className="flex items-center gap-3"><span className="text-xs text-gray-500 w-28 shrink-0 text-right">{bar.label}</span><div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden"><motion.div className="h-full rounded-full" style={{ backgroundColor: bar.color }} initial={{ width: 0 }} animate={inView ? { width: `${bar.value}%` } : {}} transition={{ duration: 0.8, delay: 0.4 + i * 0.1, ease }} /></div><span className="text-xs font-mono text-gray-400 w-8">{bar.value}%</span></div>))}</div>
      </div>
    </div>
  );
}

function ToolMarquee({ tools }: { tools: string[] }) {
  const doubled = [...tools, ...tools];
  return (<div className="relative overflow-hidden py-2"><div className="absolute left-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-r from-white to-transparent pointer-events-none" /><div className="absolute right-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-l from-white to-transparent pointer-events-none" /><motion.div className="flex gap-4 w-max" animate={{ x: ["0%", "-50%"] }} transition={{ duration: 30, ease: "linear", repeat: Infinity }}>{doubled.map((tool, i) => (<div key={`${tool}-${i}`} className="shrink-0"><ToolLogo name={tool} /></div>))}</motion.div></div>);
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
function TrendingIcon({ className, style }: { className?: string; style?: React.CSSProperties }) { return <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>; }

const learnerTestimonials = [
  { name: "Rohan Kapoor", from: "Commerce Graduate", to: "IB Analyst", company: "JP Morgan", exp: "1 yr exp.", accentFrom: "#F59E0B", accentTo: "#f59e0b", gradientBg: "linear-gradient(135deg, #fefce8, #fef9c3 40%, #ffffff)", desc: "The financial modeling training was incredibly rigorous. I went from zero Excel skills to building full DCF models. The placement team connected me directly with JP Morgan recruiters." },
  { name: "Simran Kaur", from: "CA Inter", to: "Analyst", company: "Goldman Sachs", exp: "1.5 yrs exp.", accentFrom: "#3B82F6", accentTo: "#60a5fa", gradientBg: "linear-gradient(135deg, #eff6ff, #dbeafe 40%, #ffffff)", desc: "Coming from a CA background, this program filled every gap - LBO modeling, M&A analysis, pitch books. The case studies were based on real Indian deals which made all the difference." },
  { name: "Aryan Joshi", from: "Engineering", to: "PE Associate", company: "KKR", exp: "2 yrs exp.", accentFrom: "#06B6D4", accentTo: "#22d3ee", gradientBg: "linear-gradient(135deg, #ecfeff, #cffafe 40%, #ffffff)", desc: "I switched from software engineering to private equity. The LBO and deal structuring modules gave me exactly the technical skills PE firms look for. Landed my dream role within 2 months." },
  { name: "Nisha Reddy", from: "MBA Finance", to: "M&A Analyst", company: "Kotak IB", exp: "2 yrs exp.", accentFrom: "#F59E0B", accentTo: "#fbbf24", gradientBg: "linear-gradient(135deg, #fff7ed, #fed7aa 40%, #ffffff)", desc: "Even with an MBA, I lacked hands-on modeling skills. This program's project-based approach changed everything. Built 5 real models and used them in my Kotak interview." },
  { name: "Vikram Singh", from: "BBA Student", to: "Equity Research", company: "IIFL", exp: "1 yr exp.", accentFrom: "#10b981", accentTo: "#34d399", gradientBg: "linear-gradient(135deg, #ecfdf5, #d1fae5 40%, #ffffff)", desc: "Started as a BBA student with no finance experience. The step-by-step curriculum from accounting basics to advanced valuation was perfect. Now analyzing stocks professionally at IIFL." },
  { name: "Priya Mehta", from: "CFA L1", to: "Credit Analyst", company: "ICICI Bank", exp: "1.5 yrs exp.", accentFrom: "#f43f5e", accentTo: "#fb7185", gradientBg: "linear-gradient(135deg, #fff1f2, #fecdd3 40%, #ffffff)", desc: "The program complemented my CFA prep perfectly. Real-world modeling skills plus certification prep - I got placed at ICICI before even completing the full program." },
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

function HeroImageCarousel({ className }: { className?: string }) {
  const images = [
    { src: "/courses/investment-banking/hero-1.png", alt: "Investment Banking Trading Floor" },
    { src: "/courses/investment-banking/hero-2.png", alt: "Financial Modeling & DCF Valuation" },
    { src: "/courses/investment-banking/hero-3.png", alt: "M&A Deal Room Presentation" },
    { src: "/courses/investment-banking/hero-4.png", alt: "Private Equity LBO Analysis" },
  ];
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [images.length]);

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
        style={{ background: `radial-gradient(ellipse at center, ${ACCENT_GOLD}40, transparent 70%)` }}
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
            src={images[current].src}
            alt={images[current].alt}
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
          style={{ background: `linear-gradient(90deg, ${ACCENT_GOLD}, ${ACCENT_CYAN})` }}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 4, ease: "linear" }}
        />
      </div>
      <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 rounded-tl-sm pointer-events-none" style={{ borderColor: `${ACCENT_GOLD}80` }} />
      <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 rounded-br-sm pointer-events-none" style={{ borderColor: `${ACCENT_GOLD}80` }} />
    </div>
  );
}

function DealValuationDashboard({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const kpis = [
    { label: "Enterprise Value", value: "₹4,850 Cr", delta: "+28%", color: ACCENT_GOLD },
    { label: "EV/EBITDA", value: "12.5x", delta: "vs 14x median", color: ACCENT_BLUE },
    { label: "IRR", value: "24.3%", delta: "5Y horizon", color: ACCENT_CYAN },
    { label: "MOIC", value: "2.8x", delta: "Base case", color: ACCENT_GOLD },
  ];
  // Waterfall chart data
  const waterfall = [
    { label: "Revenue", value: 100, cumStart: 0, color: ACCENT_GOLD },
    { label: "COGS", value: -35, cumStart: 100, color: "#ef4444" },
    { label: "OpEx", value: -25, cumStart: 65, color: "#ef4444" },
    { label: "D&A", value: -8, cumStart: 40, color: "#ef4444" },
    { label: "EBITDA", value: 32, cumStart: 0, color: ACCENT_BLUE },
    { label: "Net Inc", value: 22, cumStart: 0, color: ACCENT_CYAN },
  ];
  // Football field valuation range
  const methods = [
    { label: "DCF", low: 35, high: 70, mid: 52, color: ACCENT_GOLD },
    { label: "Comps", low: 30, high: 62, mid: 46, color: ACCENT_BLUE },
    { label: "Precedent", low: 40, high: 75, mid: 58, color: ACCENT_CYAN },
    { label: "LBO", low: 28, high: 55, mid: 42, color: BRAND_ORANGE },
  ];
  return (
    <div ref={ref} className={cn("rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl", className)} style={{ backgroundColor: "#0d1117" }}>
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06]" style={{ backgroundColor: "#1a1e2e" }}>
        <div className="flex items-center gap-2"><div className="flex gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" /><span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" /><span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" /></div><span className="text-xs font-mono text-gray-500 ml-2">deal_valuation_model.xlsx</span></div>
        <div className="flex gap-2">{["DCF", "Comps", "LBO"].map(tab => (<span key={tab} className="px-2.5 py-1 rounded text-[10px] font-mono text-gray-500 border border-white/[0.06] hover:border-white/20 cursor-pointer transition-colors">{tab}</span>))}</div>
      </div>
      <div className="p-5">
        <div className="grid grid-cols-4 gap-3 mb-5">
          {kpis.map((kpi, i) => (
            <motion.div key={i} className="text-center p-3 rounded-xl border border-white/[0.06]" style={{ backgroundColor: `${kpi.color}08` }} initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.3, delay: 0.2 + i * 0.1 }}>
              <p className="text-lg font-bold font-mono" style={{ color: kpi.color }}>{kpi.value}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">{kpi.label}</p>
              <span className="text-[10px] font-mono text-green-400">{kpi.delta}</span>
            </motion.div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          {/* Waterfall chart */}
          <div className="rounded-xl border border-white/[0.06] p-4" style={{ backgroundColor: "#141820" }}>
            <p className="text-[10px] font-mono text-gray-500 mb-3 uppercase tracking-wider">Income Waterfall (₹ Cr)</p>
            <svg viewBox="0 0 260 120" className="w-full">
              {waterfall.map((bar, i) => {
                const barW = 32; const gap = (260 - barW * 6) / 7; const xPos = gap + i * (barW + gap);
                const maxH = 90; const absVal = Math.abs(bar.value);
                const barH = (absVal / 100) * maxH;
                const yPos = bar.value > 0 ? (maxH - (bar.cumStart / 100) * maxH - barH) : ((bar.cumStart / 100) * maxH === 0 ? maxH - barH : (bar.cumStart / 100) * maxH);
                const finalY = i === 4 ? maxH - barH : i === 5 ? maxH - barH : yPos;
                return (
                  <g key={i}>
                    <motion.rect x={xPos} y={10 + finalY} width={barW} height={barH} rx={3} fill={bar.color} opacity={0.85} initial={{ height: 0, y: 10 + maxH }} animate={inView ? { height: barH, y: 10 + finalY } : {}} transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }} />
                    <text x={xPos + barW / 2} y={108} textAnchor="middle" className="text-[7px] fill-gray-500 font-mono">{bar.label}</text>
                  </g>
                );
              })}
            </svg>
          </div>
          {/* Football field */}
          <div className="rounded-xl border border-white/[0.06] p-4" style={{ backgroundColor: "#141820" }}>
            <p className="text-[10px] font-mono text-gray-500 mb-3 uppercase tracking-wider">Valuation Range (₹/share)</p>
            <div className="space-y-3 mt-2">
              {methods.map((m, i) => (
                <motion.div key={i} className="flex items-center gap-2" initial={{ opacity: 0, x: -10 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}>
                  <span className="text-[9px] font-mono text-gray-400 w-14 text-right shrink-0">{m.label}</span>
                  <div className="flex-1 h-5 relative rounded-full bg-white/[0.04]">
                    <motion.div className="absolute top-0 h-full rounded-full" style={{ left: `${m.low}%`, width: `${m.high - m.low}%`, backgroundColor: `${m.color}30` }} initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}} transition={{ duration: 0.6, delay: 0.6 + i * 0.1 }} />
                    <motion.div className="absolute top-0 w-1.5 h-full rounded-full" style={{ left: `${m.mid}%`, backgroundColor: m.color }} initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.3, delay: 0.9 + i * 0.1 }} />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Module Data & Components ── */

const MODULE_DATA = [
  { title: "Financial Foundations", color: "#059669", iconImg: "/images/tools/excel.png", topics: ["Accounting fundamentals - P&L, balance sheet, cash flow", "Financial ratios - liquidity, profitability, leverage", "Corporate finance - time value of money, NPV, IRR", "Capital structure & cost of capital", "Financial statement analysis & benchmarking", "Excel for finance - advanced formulas & shortcuts"] },
  { title: "Valuation Methods", color: "#3b82f6", iconImg: "/images/tools/excel.png", topics: ["DCF modeling - free cash flow projection", "WACC calculation & terminal value", "Comparable company analysis - selecting peers", "Valuation multiples - EV/EBITDA, P/E, EV/Revenue", "Precedent transaction analysis", "Sum-of-the-parts & football field valuation"] },
  { title: "M&A & Deal Structuring", color: "#d97706", iconImg: "/images/tools/excel.png", topics: ["M&A process - origination to closing", "Due diligence frameworks & checklists", "Merger model - accretion/dilution analysis", "Deal structuring - stock vs cash, earnouts", "Synergy analysis & pro forma financials", "Regulatory & compliance considerations"] },
  { title: "LBO Modeling", color: "#7c3aed", iconImg: "/images/tools/excel.png", topics: ["LBO fundamentals - structure & rationale", "Debt schedules - term loans, bonds, mezz", "Operating model & cash flow waterfall", "Returns analysis - IRR, MOIC, cash yield", "Sensitivity analysis & scenario planning", "Exit strategies - IPO, strategic sale, recap"] },
  { title: "Sector Analysis", color: "#db2777", iconImg: "/images/tools/power-bi.png", topics: ["Technology sector - SaaS metrics, unit economics", "Healthcare & pharma - pipeline valuation", "Financial services - bank valuation methods", "Consumer & retail - comparable metrics", "Energy & infrastructure - project finance", "Cross-sector deal case studies"] },
  { title: "Career Preparation", color: "#0891b2", iconImg: "/images/tools/excel.png", topics: ["Pitch book creation - company profiles, recommendations", "Technical interview prep - valuation questions", "Behavioral interview prep - fit questions, deal walk-throughs", "Market sizing & brain teasers", "Networking strategy & informational interviews", "Capstone project - full deal analysis & presentation"] },
];

function ModuleCard({ mod, index }: { mod: typeof MODULE_DATA[number]; index: number }) {
  return (
    <SlideIn direction="up" delay={index * 0.08}>
      <Card accent={mod.color} className="h-full">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden" style={{ backgroundColor: `${mod.color}12` }}>
            <Image src={mod.iconImg} alt={mod.title} width={24} height={24} />
          </div>
          <div>
            <span className="text-[10px] font-mono font-semibold uppercase tracking-widest" style={{ color: mod.color }}>Module {index + 1}</span>
            <h3 className="text-base font-bold text-navy-900 leading-tight">{mod.title}</h3>
          </div>
        </div>
        <ul className="space-y-2">
          {mod.topics.map((topic, j) => (
            <li key={j} className="flex items-start gap-2 text-sm text-gray-600 leading-relaxed">
              <CheckCircleIcon className="w-4 h-4 mt-0.5 shrink-0" style={{ color: mod.color }} />
              <span>{topic}</span>
            </li>
          ))}
        </ul>
      </Card>
    </SlideIn>
  );
}

function ModulesSection({ openEnquiry }: { openEnquiry: () => void }) {
  return (
    <section className="relative py-16 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <SectionLabel center>Modules</SectionLabel>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy-900 leading-tight text-center">
            What You&apos;ll{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${ACCENT_GOLD}, ${ACCENT_BLUE})` }}>Learn</span>
          </h2>
          <p className="mt-3 text-gray-500 text-base max-w-xl mx-auto text-center">
            A comprehensive, hands-on curriculum covering every aspect of investment banking.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
          {MODULE_DATA.map((mod, i) => (
            <ModuleCard key={i} mod={mod} index={i} />
          ))}
        </div>

        <motion.div className="mt-10 flex flex-col items-center gap-4" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}>
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-gray-500 font-medium">
            <span>6 Modules</span><span className="text-gray-300">·</span>
            <span>36+ Topics</span><span className="text-gray-300">·</span>
            <span>36 Weeks</span><span className="text-gray-300">·</span>
            <span>10+ Tools</span>
          </div>
          <Magnetic>
            <motion.button onClick={openEnquiry} className="group px-6 py-3 rounded-xl font-bold text-sm overflow-hidden cursor-pointer text-white" style={{ backgroundColor: ACCENT_GOLD }} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <span className="flex items-center gap-2">Download Full Syllabus <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
            </motion.button>
          </Magnetic>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════ */

export default function InvestmentBankingPage() {
  const { openEnquiry } = useEnquiryModal();
  const { openPurchase } = usePurchaseModal();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  const [openFaq, setOpenFaq] = useState(0);
  const [activeTab, setActiveTab] = useState(0);

  const personas = [
    { icon: GraduationIcon, title: "Finance Graduates", desc: "You studied finance but college didn't teach you how to build a real DCF model or structure a deal. This will.", color: ACCENT_GOLD },
    { icon: RocketIcon, title: "Career Switchers", desc: "Coming from engineering, consulting, or operations? IB firms love diverse backgrounds - you just need the technical finance skills.", color: ACCENT_BLUE },
    { icon: BriefcaseIcon, title: "CA/CFA Aspirants", desc: "Complement your accounting or CFA prep with hands-on modeling and valuation skills that make you immediately employable.", color: ACCENT_CYAN },
    { icon: UserIcon, title: "Working Professionals", desc: "Already in finance but want to move to the buy-side or advisory? Level up your modeling and deal skills.", color: ACCENT_GOLD },
  ];

  const curriculum = [
    { phase: "01", title: "Financial Foundations", duration: "Weeks 1–5", color: ACCENT_GOLD, skills: ["Accounting", "Excel", "Corporate Finance", "Ratios"], topics: [
      "Accounting fundamentals - P&L, balance sheet, cash flow statement, financial ratios",
      "Excel for finance - advanced formulas, financial functions, keyboard shortcuts, modeling best practices",
      "Corporate finance essentials - time value of money, cost of capital, capital structure",
      "Financial statement analysis - ratio analysis, trend analysis, peer benchmarking",
    ], code: [
      { text: "// DCF Model - Excel Formula", color: "#8b949e" },
      { text: "= NPV(WACC, FCF_Year1:FCF_Year5)", color: "#e6edf3" },
      { text: "  + Terminal_Value / (1+WACC)^5", color: "#e6edf3" },
      { text: "", color: "#e6edf3" },
      { text: "WACC = 10.2%", color: "#79c0ff" },
      { text: "Terminal Growth = 3.0%", color: "#79c0ff" },
      { text: "", color: "#e6edf3" },
      { text: ">>> Enterprise Value: ₹4,850 Cr", color: "#7ee787" },
      { text: ">>> Equity Value/Share: ₹1,247", color: "#7ee787" },
    ]},
    { phase: "02", title: "Valuation & Financial Modeling", duration: "Weeks 6–11", color: ACCENT_BLUE, skills: ["DCF", "Comps", "LBO", "Sensitivity"], topics: [
      "DCF modeling - free cash flow projection, WACC calculation, terminal value, sensitivity analysis",
      "Comparable company analysis - selecting comps, normalizing financials, valuation multiples",
      "Precedent transactions - deal sourcing, premium analysis, synergy valuation",
      "LBO modeling - deal structure, debt schedules, returns analysis, exit scenarios",
    ], code: [
      { text: "// LBO Returns Analysis", color: "#8b949e" },
      { text: "Entry EV/EBITDA    = 8.0x", color: "#e6edf3" },
      { text: "Exit  EV/EBITDA    = 8.0x", color: "#e6edf3" },
      { text: "Holding Period     = 5 years", color: "#e6edf3" },
      { text: "Debt / Equity      = 60/40", color: "#e6edf3" },
      { text: "", color: "#e6edf3" },
      { text: ">>> IRR: 24.3%", color: "#7ee787" },
      { text: ">>> MOIC: 2.8x", color: "#7ee787" },
    ]},
    { phase: "03", title: "M&A and Deal Structuring", duration: "Weeks 12–17", color: ACCENT_CYAN, skills: ["M&A", "Merger Model", "Due Diligence", "PE"], topics: [
      "M&A process - deal origination, due diligence, negotiation, closing",
      "Merger models - accretion/dilution analysis, pro forma financials, synergy modeling",
      "Deal structuring - stock vs cash, earnouts, contingent consideration",
      "Private equity fundamentals - fund structure, portfolio management, value creation",
    ], code: [
      { text: "// Merger Accretion/Dilution", color: "#8b949e" },
      { text: "Acquirer EPS (pre)  = ₹42.50", color: "#e6edf3" },
      { text: "Pro Forma EPS       = ₹45.80", color: "#e6edf3" },
      { text: "Synergies           = ₹120 Cr", color: "#e6edf3" },
      { text: "", color: "#e6edf3" },
      { text: ">>> Accretive by 7.8%", color: "#7ee787" },
      { text: ">>> Breakeven synergies: ₹85 Cr", color: "#7ee787" },
    ]},
    { phase: "04", title: "Sector Analysis & Data Skills", duration: "Weeks 18–27", color: ACCENT_GOLD, skills: ["Sector Analysis", "SQL", "Python", "Power BI"], topics: [
      "Technology sector - SaaS metrics, unit economics, growth vs profitability analysis",
      "Healthcare & pharma - pipeline valuation, regulatory analysis, DCF adjustments",
      "SQL for financial data - querying financial databases, building data pipelines",
      "Python for finance - quantitative analysis, portfolio optimization, risk modeling",
    ], code: [
      { text: "# Python - Portfolio risk analysis", color: "#8b949e" },
      { text: "import numpy as np", color: "#79c0ff" },
      { text: "", color: "#e6edf3" },
      { text: "returns = portfolio.pct_change()", color: "#e6edf3" },
      { text: "var_95 = np.percentile(returns, 5)", color: "#e6edf3" },
      { text: "sharpe = returns.mean() / returns.std()", color: "#e6edf3" },
      { text: "", color: "#e6edf3" },
      { text: ">>> VaR (95%): -2.3%", color: "#7ee787" },
      { text: ">>> Sharpe Ratio: 1.84", color: "#7ee787" },
    ]},
    { phase: "05", title: "Career Preparation", duration: "Weeks 28–36", color: BRAND_ORANGE, skills: ["Pitch Books", "Interviews", "Networking", "Capstone"], topics: [
      "Pitch book creation - company profiles, market overviews, deal recommendations",
      "Technical interview prep - valuation questions, brain teasers, market sizing",
      "Behavioral interview prep - fit questions, deal walk-throughs, why IB",
      "Capstone project - full deal analysis and pitch presentation",
    ], code: [
      { text: "// Pitch Book - Deal Summary", color: "#8b949e" },
      { text: "Transaction: Strategic Acquisition", color: "#e6edf3" },
      { text: "Target: TechCorp India Ltd.", color: "#e6edf3" },
      { text: "EV: ₹2,400 Cr | 12.5x EBITDA", color: "#e6edf3" },
      { text: "Premium: 28% to undisturbed", color: "#e6edf3" },
      { text: "", color: "#e6edf3" },
      { text: ">>> Recommendation: BUY", color: "#7ee787" },
      { text: ">>> Target Price: ₹1,450 (+32%)", color: "#7ee787" },
    ]},
  ];

  const tools = ["Excel", "Power BI", "SQL", "Python", "Tableau", "Capital IQ", "Bloomberg Terminal", "Refinitiv", "PitchBook", "Git"];

  const projects = [
    { title: "Full DCF Valuation Model", desc: "Build a comprehensive DCF model for a publicly traded company with scenario analysis, sensitivity tables, and football field valuation.", tags: ["Excel", "DCF", "Valuation"], color: ACCENT_GOLD, complexity: 4, outcome: "Production-grade DCF model used in actual interview", icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><path d="M12 2v20M2 12h20" strokeLinecap="round" /><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>) },
    { title: "M&A Deal Analysis", desc: "Analyze a real M&A transaction - build merger model, assess accretion/dilution, and present strategic rationale.", tags: ["M&A", "Excel", "Finance"], color: ACCENT_BLUE, complexity: 3, outcome: "Complete merger model with synergy analysis", icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><circle cx="8" cy="12" r="5" /><circle cx="16" cy="12" r="5" /></svg>) },
    { title: "LBO Model", desc: "Structure and model a leveraged buyout with multiple debt tranches, management rollover, and exit analysis.", tags: ["LBO", "PE", "Excel"], color: ACCENT_CYAN, complexity: 4, outcome: "Multi-tranche LBO with IRR sensitivity", icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><path d="M2 20h20M6 20V8l4-4v16M14 20V10l4-4v14" strokeLinecap="round" strokeLinejoin="round" /></svg>) },
    { title: "Investment Pitch Book", desc: "Create a full pitch book recommending a strategic transaction to a client, including valuation, deal structure, and risk analysis.", tags: ["Pitch Book", "PowerPoint", "Research"], color: ACCENT_GOLD, complexity: 3, outcome: "42-page pitch book presentation", icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 3v18" strokeLinecap="round" /></svg>) },
  ];

  const roles = [
    { title: "IB Analyst", range: "8–14 LPA" },
    { title: "Financial Analyst", range: "6–12 LPA" },
    { title: "Equity Research Associate", range: "8–15 LPA" },
    { title: "PE Associate", range: "10–18 LPA" },
    { title: "Corporate Finance Analyst", range: "7–13 LPA" },
    { title: "M&A Analyst", range: "9–16 LPA" },
  ];

  const faqs = [
    { question: "Do I need a finance background?", answer: "No. We start from accounting fundamentals and build up. Many of our top performers come from engineering, commerce, or even non-finance backgrounds." },
    { question: "Is this program relevant for Indian IB roles?", answer: "Absolutely. The curriculum covers both global and India-specific deal structures, regulations, and market dynamics. Our hiring partners include Indian and international banks." },
    { question: "How hands-on is the program?", answer: "Extremely. You'll build 5+ full financial models, analyze real deals, and create pitch books. By the end, your portfolio demonstrates you can do the actual work of an IB analyst." },
    { question: "What kind of placement support do you offer?", answer: "100% placement." },
    { question: "Can I do this alongside a full-time job?", answer: "Yes. We offer flexible scheduling with evening and weekend sessions. All classes are recorded, and you can work through the material at your own pace." },
  ];

  const highlights = [
    { icon: ShieldIcon, label: "100% Placement", sub: "Personalized Path to Employment", color: ACCENT_GOLD },
    { icon: CurrencyIcon, label: "Flexible Payment", sub: "EMI options available", color: ACCENT_BLUE },
    { icon: SparklesIcon, label: "CFA Prep Included", sub: "Level 1 exam prep", color: ACCENT_CYAN },
    { icon: ClockIcon, label: "Flexible Schedule", sub: "Weekday & weekend batches", color: ACCENT_GOLD },
  ];

  return (
    <ThemeProvider theme="light">
    <div className="min-h-screen bg-white text-navy-900 selection:bg-amber-500/20 overflow-x-hidden">

      {/* ═══════ HERO ═══════ */}
      <section ref={heroRef} className="relative min-h-[88vh] flex items-center overflow-hidden" style={{ backgroundColor: DARK_BG }}>
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 60% 45% at 20% 25%, ${ACCENT_GOLD}12 0%, transparent 55%), radial-gradient(ellipse 45% 35% at 80% 65%, ${ACCENT_BLUE}0c 0%, transparent 50%), linear-gradient(180deg, ${DARK_BG} 0%, #0c1220 50%, ${DARK_BG} 100%)` }} />
        <motion.div className="absolute w-[600px] h-[600px] -top-48 -right-48 rounded-full blur-[120px] pointer-events-none" animate={{ scale: [1, 1.12, 1], opacity: [0.2, 0.35, 0.2] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} style={{ background: `radial-gradient(circle, ${ACCENT_GOLD}20, transparent 70%)` }} />

        {[
          { text: "=NPV(WACC,)", x: "8%", y: "15%", dur: 18, delay: 0 },
          { text: "EV/EBITDA", x: "85%", y: "22%", dur: 22, delay: 2 },
          { text: "DCF model", x: "72%", y: "75%", dur: 20, delay: 4 },
          { text: "IRR: 24.3%", x: "15%", y: "70%", dur: 24, delay: 1 },
          { text: "WACC: 10.2%", x: "55%", y: "12%", dur: 19, delay: 3 },
          { text: "LBO returns", x: "90%", y: "55%", dur: 21, delay: 5 },
          { text: "M&A synergies", x: "30%", y: "85%", dur: 23, delay: 2 },
          { text: "EqV: ₹4,850Cr", x: "45%", y: "90%", dur: 17, delay: 6 },
        ].map((frag, i) => (
          <motion.span key={i} className="absolute font-mono text-[11px] pointer-events-none select-none" style={{ left: frag.x, top: frag.y, color: `${ACCENT_GOLD}18` }}
            animate={{ y: [0, -15, 0, 10, 0], x: [0, 8, -5, 3, 0], opacity: [0.15, 0.3, 0.15, 0.25, 0.15] }}
            transition={{ duration: frag.dur, repeat: Infinity, delay: frag.delay, ease: "easeInOut" }}>{frag.text}</motion.span>
        ))}

        <div className="absolute inset-0 pointer-events-none overflow-hidden"><svg className="w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="dotGrid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse"><circle cx="30" cy="30" r="1" fill="white" /></pattern></defs><rect width="100%" height="100%" fill="url(#dotGrid)" /></svg></div>

        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="flowGrad1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor={ACCENT_GOLD} stopOpacity="0" /><stop offset="50%" stopColor={ACCENT_GOLD} stopOpacity="0.12" /><stop offset="100%" stopColor={ACCENT_GOLD} stopOpacity="0" /></linearGradient>
            <linearGradient id="flowGrad2" x1="100%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor={ACCENT_BLUE} stopOpacity="0" /><stop offset="50%" stopColor={ACCENT_BLUE} stopOpacity="0.08" /><stop offset="100%" stopColor={ACCENT_BLUE} stopOpacity="0" /></linearGradient>
            <linearGradient id="flowGrad3" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor={ACCENT_CYAN} stopOpacity="0" /><stop offset="50%" stopColor={ACCENT_CYAN} stopOpacity="0.06" /><stop offset="100%" stopColor={ACCENT_CYAN} stopOpacity="0" /></linearGradient>
          </defs>
          <motion.path d="M-100,200 C200,100 400,350 700,180 S1100,300 1500,150" fill="none" stroke="url(#flowGrad1)" strokeWidth="1.5" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 3, delay: 0.5, ease: "easeInOut" }} />
          <motion.path d="M-50,400 C250,300 500,500 800,350 S1200,450 1500,380" fill="none" stroke="url(#flowGrad2)" strokeWidth="1" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 3.5, delay: 1, ease: "easeInOut" }} />
          <motion.path d="M-80,550 C180,480 420,600 720,500 S1050,580 1500,520" fill="none" stroke="url(#flowGrad3)" strokeWidth="1" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 4, delay: 1.5, ease: "easeInOut" }} />
          <motion.circle r="3" fill={ACCENT_GOLD} opacity="0.4" animate={{ cx: [0, 350, 700, 1100, 1500], cy: [200, 150, 250, 200, 150] }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} />
          <motion.circle r="2.5" fill={ACCENT_BLUE} opacity="0.3" animate={{ cx: [0, 400, 800, 1200, 1500], cy: [400, 350, 450, 380, 380] }} transition={{ duration: 10, repeat: Infinity, ease: "linear", delay: 2 }} />
        </svg>

        <div className="noise-overlay absolute inset-0 pointer-events-none opacity-[0.02]" />

        <motion.div className="relative z-10 max-w-6xl mx-auto px-6 w-full" style={{ opacity: heroOpacity, y: heroY }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-24 lg:py-0">
            <div>
              <motion.div className="flex items-center gap-2 mb-6 flex-wrap" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono tracking-wide border border-white/[0.1] bg-white/[0.04] text-gray-400"><span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />Now Enrolling</span>
                <span className="px-3 py-1.5 rounded-full text-xs font-mono tracking-wide border border-white/[0.1] bg-white/[0.04] text-gray-400">9 Months</span>
              </motion.div>
              <motion.h1 className="text-5xl sm:text-6xl lg:text-[4.5rem] font-bold leading-[1.05] tracking-tight" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15, ease }}>
                <span className="text-white">Break Into</span><br />
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${ACCENT_GOLD}, #f59e0b)` }}>Investment Banking</span>
              </motion.h1>
              <motion.div className="mt-5 h-8 flex items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.5 }}>
                <span className="text-gray-500 text-base">Master</span>
                <TypeWriter words={["Financial Modeling", "DCF Valuation", "M&A Analysis", "LBO Modeling", "Pitch Books"]} className="text-base font-mono font-semibold text-white" />
              </motion.div>
              <motion.p className="mt-5 text-base md:text-lg text-gray-400 leading-relaxed max-w-lg" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35 }}>
                Master financial modeling, valuation, M&A, and deal structuring. Built for those who want to land roles at top investment banks and PE firms.
              </motion.p>
              <motion.div className="mt-8 flex flex-wrap items-center gap-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.55 }}>
                <Magnetic><motion.button onClick={() => openPurchase("Investment Banking")} className="group relative px-7 py-3.5 rounded-xl font-semibold text-sm overflow-hidden cursor-pointer" style={{ backgroundColor: ACCENT_GOLD }} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}><span className="relative z-10 flex items-center gap-2 text-white">Enroll Now <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span></motion.button></Magnetic>
                <Magnetic><motion.button onClick={openEnquiry} className="px-7 py-3.5 rounded-xl font-semibold text-sm border border-white/[0.12] text-white/80 hover:text-white hover:border-white/25 hover:bg-white/[0.04] transition-all duration-300 cursor-pointer" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>Download Curriculum</motion.button></Magnetic>
              </motion.div>
            </div>
            <motion.div className="relative hidden lg:block" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.4, ease }}>
              <HeroImageCarousel className="rounded-2xl shadow-2xl" />
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-12 rounded-full blur-3xl" style={{ background: `${ACCENT_GOLD}15` }} />
            </motion.div>
          </div>
        </motion.div>
      </section>

      <div className="lg:hidden relative" style={{ backgroundColor: DARK_BG }}>
        <div className="px-6 pb-10">
          <HeroImageCarousel className="rounded-2xl shadow-2xl" />
        </div>
      </div>

      {/* ═══════ HIGHLIGHTS BAR ═══════ */}
      <section className="relative py-5 px-6" style={{ backgroundColor: BRAND_NAVY }}>
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {highlights.map((h, i) => (<motion.div key={i} className="flex items-center gap-3 py-2" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.06 }}><h.icon className="w-5 h-5 shrink-0" style={{ color: h.color }} /><div><p className="text-sm font-semibold text-white">{h.label}</p><p className="text-xs text-white/50">{h.sub}</p></div></motion.div>))}
        </div>
      </section>

      {/* ═══════ STATS ═══════ */}
      <section className="relative py-16 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard value={350} suffix="+" label="Students Placed" icon={UserIcon} delay={0} accent={ACCENT_GOLD} />
          <StatCard value={10} suffix="" label="Industry Tools" icon={LayersIcon} delay={0.08} accent={ACCENT_BLUE} />
          <StatCard value={9} suffix="" label="Month Program" icon={ClockIcon} delay={0.16} accent={ACCENT_CYAN} />
          <StatCard value={5} suffix="" label="Deal Projects" icon={TrendingIcon} delay={0.24} accent={ACCENT_GOLD} />
        </div>
      </section>

      {/* ═══════ WHO IS THIS FOR - Interactive spotlight reveal ═══════ */}
      <section className="relative py-24 px-6 bg-[#0a0e18] overflow-hidden">
        {/* Animated background grid */}
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />
        {/* Floating gradient orbs */}
        <motion.div
          className="absolute top-20 -left-32 w-[400px] h-[400px] rounded-full blur-[120px]"
          style={{ background: `radial-gradient(circle, ${ACCENT_GOLD}30, transparent 70%)` }}
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
                  <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${ACCENT_GOLD}, #FF6B6B, ${ACCENT_BLUE})` }}>You</span>
                  <motion.span
                    className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full"
                    style={{ background: `linear-gradient(90deg, ${ACCENT_GOLD}, ${ACCENT_BLUE})` }}
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
                For ambitious professionals who want to break into high-stakes finance.
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
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${ACCENT_GOLD}, ${ACCENT_BLUE})` }}>Linkway Learning</span>?
            </h2>
            <p className="mt-3 text-gray-500 text-base max-w-xl mx-auto text-center">
              Upskilling from Linkway gives you an unfair advantage by placing you ahead of the curve.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
            {[
              { icon: SparklesIcon, title: "AI-First Curriculum", desc: "Specially designed curriculum keeping AI in focus to boost efficiency, and inculcate deep subject understanding.", color: ACCENT_GOLD },
              { icon: UserIcon, title: "Real-World Interviews", desc: "On demand mock interviews with actual finance company hiring managers to prepare you for the toughest questions.", color: ACCENT_BLUE },
              { icon: LayersIcon, title: "Industry Vetted Curriculum", desc: "Targeted training for Financial Modeling, Valuation, and M&A at the standards expected by top investment banks.", color: ACCENT_CYAN },
              { icon: GraduationIcon, title: "Expert Mentors & Instructorship", desc: "Get trained by industry experts from top investment banks globally, tailored to your career goals.", color: ACCENT_GOLD },
              { icon: TargetIcon, title: "360° Career Support", desc: "From technical skills to salary negotiation - we guide you every step, with 400+ recruiter connections.", color: ACCENT_BLUE },
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

      {/* ═══════ CURRICULUM - Immersive Bento Journey ═══════ */}
      <section className="relative py-24 px-6 overflow-hidden bg-[#070b14]">
        {/* ── Mesh gradient background ── */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: `
            radial-gradient(ellipse 70% 50% at 0% 0%, #2d1f0a 0%, transparent 50%),
            radial-gradient(ellipse 60% 50% at 100% 100%, #0c1a3a 0%, transparent 50%),
            radial-gradient(ellipse 50% 40% at 50% 30%, #1a1408 0%, transparent 50%)
          `
        }} />

        {/* ── Floating animated orbs ── */}
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full pointer-events-none blur-[120px]"
          style={{ top: "5%", left: "-10%", background: `radial-gradient(circle, ${ACCENT_GOLD}18, transparent 70%)` }}
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
            <linearGradient id="currAurora1IB" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={ACCENT_GOLD} stopOpacity="0" />
              <stop offset="30%" stopColor={ACCENT_GOLD} stopOpacity="0.06" />
              <stop offset="70%" stopColor={ACCENT_BLUE} stopOpacity="0.04" />
              <stop offset="100%" stopColor={ACCENT_BLUE} stopOpacity="0" />
            </linearGradient>
            <linearGradient id="currAurora2IB" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={ACCENT_CYAN} stopOpacity="0" />
              <stop offset="40%" stopColor={ACCENT_CYAN} stopOpacity="0.05" />
              <stop offset="60%" stopColor={ACCENT_GOLD} stopOpacity="0.03" />
              <stop offset="100%" stopColor={ACCENT_GOLD} stopOpacity="0" />
            </linearGradient>
          </defs>
          <motion.path d="M-100,150 C200,50 500,300 800,120 S1200,250 1600,100" fill="none" stroke="url(#currAurora1IB)" strokeWidth="2" initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 3, ease: "easeInOut" }} />
          <motion.path d="M-50,350 C300,250 600,450 900,300 S1300,400 1600,320" fill="none" stroke="url(#currAurora2IB)" strokeWidth="1.5" initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 3.5, delay: 0.5, ease: "easeInOut" }} />
        </svg>

        {/* ── Animated particle dots ── */}
        {[
          { x: "12%", y: "18%", size: 3, dur: 6, delay: 0 },
          { x: "88%", y: "25%", size: 2, dur: 8, delay: 1 },
          { x: "25%", y: "75%", size: 2.5, dur: 7, delay: 2 },
          { x: "72%", y: "65%", size: 2, dur: 9, delay: 3 },
        ].map((p, i) => (
          <motion.div key={`part-${i}`} className="absolute rounded-full pointer-events-none" style={{ left: p.x, top: p.y, width: p.size, height: p.size, backgroundColor: i % 3 === 0 ? ACCENT_GOLD : i % 3 === 1 ? ACCENT_BLUE : ACCENT_CYAN }} animate={{ opacity: [0, 0.5, 0], y: [0, -20, 0], scale: [0.5, 1, 0.5] }} transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: "easeInOut" }} />
        ))}

        <div className="relative z-10 max-w-6xl mx-auto">
          <ScrollReveal>
            <SectionLabel center light>Curriculum</SectionLabel>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight text-center">Your Learning{" "}<span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${ACCENT_GOLD}, ${ACCENT_CYAN})` }}>Journey</span></h2>
            <p className="mt-3 text-gray-500 text-base max-w-lg mx-auto text-center">36 weeks of intensive, hands-on training. Click each phase to explore.</p>
          </ScrollReveal>

          {/* ── Horizontal Phase Selector ── */}
          <div className="mt-14 flex items-center justify-center">
            <div className="relative flex items-center gap-0 bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-1.5 overflow-x-auto">
              <motion.div className="absolute top-1.5 bottom-1.5 rounded-xl" style={{ backgroundColor: curriculum[activeTab >= 0 ? activeTab : 0]?.color || ACCENT_GOLD }} animate={{ left: `${(activeTab >= 0 ? activeTab : 0) * 20 + 0.5}%`, width: "20%", opacity: 0.15 }} transition={{ type: "spring", stiffness: 300, damping: 30 }} />
              {curriculum.map((mod, i) => (
                <button key={i} onClick={() => setActiveTab(i)} className={cn("relative z-10 flex items-center gap-2.5 px-4 py-3 rounded-xl transition-all duration-300 cursor-pointer shrink-0", activeTab === i ? "text-white" : "text-gray-500 hover:text-gray-300")}>
                  <span className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold font-mono shrink-0 transition-all duration-300" style={{ backgroundColor: activeTab === i ? mod.color : `${mod.color}15`, color: activeTab === i ? "#fff" : mod.color }}>{mod.phase}</span>
                  <span className="text-sm font-semibold hidden lg:block">{mod.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Progress Rail ── */}
          <div className="mt-8 max-w-3xl mx-auto">
            <div className="flex items-center gap-1">
              {curriculum.map((mod, i) => (
                <div key={i} className="flex-1 flex items-center gap-1">
                  <motion.div className="flex-1 h-1 rounded-full overflow-hidden" style={{ backgroundColor: `${mod.color}15` }}>
                    <motion.div className="h-full rounded-full" style={{ backgroundColor: mod.color }} initial={{ width: "0%" }} animate={{ width: activeTab >= i ? "100%" : "0%" }} transition={{ duration: 0.6, delay: activeTab >= i ? i * 0.15 : 0, ease: [0.22, 1, 0.36, 1] }} />
                  </motion.div>
                  {i < curriculum.length - 1 && (<motion.div className="w-2 h-2 rounded-full shrink-0 border-2" style={{ borderColor: activeTab > i ? curriculum[i + 1].color : `${curriculum[i + 1].color}30`, backgroundColor: activeTab > i ? curriculum[i + 1].color : "transparent" }} animate={{ scale: activeTab === i + 1 ? [1, 1.3, 1] : 1 }} transition={{ duration: 1.5, repeat: activeTab === i + 1 ? Infinity : 0, ease: "easeInOut" }} />)}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2">{curriculum.map((mod, i) => (<span key={i} className="text-[10px] font-mono" style={{ color: activeTab >= i ? mod.color : `${mod.color}40` }}>{mod.duration}</span>))}</div>
          </div>

          {/* ── Bento Content Area ── */}
          <AnimatePresence mode="wait">
            {curriculum.map((mod, i) => activeTab === i && (
              <motion.div key={mod.phase} className="mt-12" initial={{ opacity: 0, y: 30, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20, scale: 0.97 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
                {/* Phase header card */}
                <div className="flex items-center gap-4 mb-8">
                  <motion.div className="w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-2xl font-mono text-white relative overflow-hidden" style={{ backgroundColor: mod.color }} whileHover={{ scale: 1.05, rotate: -3 }} transition={{ type: "spring", stiffness: 400, damping: 15 }}>
                    <motion.div className="absolute inset-0" style={{ background: `linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%)` }} animate={{ x: ["-150%", "150%"] }} transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }} />
                    <span className="relative">{mod.phase}</span>
                  </motion.div>
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-white">{mod.title}</h3>
                    <p className="text-sm font-mono mt-1" style={{ color: `${mod.color}90` }}>{mod.duration}</p>
                  </div>
                  <div className="hidden md:flex flex-1 justify-end">
                    <div className="flex flex-wrap gap-2 justify-end">
                      {mod.skills.map((skill, j) => (<motion.span key={skill} className="px-2.5 py-1 rounded-lg text-xs font-medium border" style={{ color: mod.color, borderColor: `${mod.color}25`, backgroundColor: `${mod.color}08` }} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: 0.2 + j * 0.06 }}>{skill}</motion.span>))}
                    </div>
                  </div>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                  {/* Topics - Left large card */}
                  <motion.div className="lg:col-span-7 relative group rounded-2xl overflow-hidden" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
                    <div className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[1px]" style={{ background: `linear-gradient(135deg, ${mod.color}40, transparent 50%, ${mod.color}20)` }} />
                    <div className="relative bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-7 h-full group-hover:bg-white/[0.06] transition-all duration-500">
                      <div className="flex items-center gap-2.5 mb-6">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${mod.color}15` }}><GraduationIcon className="w-4 h-4" style={{ color: mod.color }} /></div>
                        <p className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: mod.color }}>What you&apos;ll learn</p>
                      </div>
                      <div className="space-y-3">
                        {mod.topics.map((topic, j) => (
                          <motion.div key={j} className="group/topic relative rounded-xl bg-white/[0.02] border border-white/[0.05] p-4 hover:bg-white/[0.05] hover:border-white/[0.1] transition-all duration-300 overflow-hidden" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.3 + j * 0.12 }}>
                            <div className="absolute inset-0 opacity-0 group-hover/topic:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: `radial-gradient(200px circle at 0% 50%, ${mod.color}0a, transparent 60%)` }} />
                            <div className="relative flex items-start gap-3.5">
                              <div className="mt-0.5 shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold font-mono border" style={{ color: mod.color, borderColor: `${mod.color}30`, backgroundColor: `${mod.color}08` }}>{String(j + 1).padStart(2, "0")}</div>
                              <div className="flex-1 min-w-0"><p className="text-[14px] font-semibold text-white/90 group-hover/topic:text-white transition-colors duration-300">{topic}</p></div>
                              <motion.div className="shrink-0 mt-1 opacity-0 group-hover/topic:opacity-100 transition-opacity duration-300"><ArrowRightIcon className="w-4 h-4" style={{ color: mod.color }} /></motion.div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>

                  {/* Code Preview - Right card */}
                  <motion.div className="lg:col-span-5 relative group" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.25 }}>
                    <div className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[1px]" style={{ background: `linear-gradient(135deg, transparent 50%, ${mod.color}30, ${mod.color}15)` }} />
                    <div className="relative rounded-2xl overflow-hidden border border-white/[0.08] h-full group-hover:border-white/[0.12] transition-colors duration-500">
                      <div className="flex items-center justify-between px-4 py-3 bg-[#1a1e2e] border-b border-white/[0.06]">
                        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" /><span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" /><span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" /></div>
                        <span className="text-[10px] font-mono text-gray-500">phase_{mod.phase}.xlsx</span>
                        <div className="flex items-center gap-1.5"><motion.div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: mod.color }} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} /><span className="text-[9px] font-mono" style={{ color: `${mod.color}80` }}>LIVE</span></div>
                      </div>
                      <div className="bg-[#0d1117] p-5 font-mono text-[12px] leading-[2]">
                        {mod.code.map((line, j) => (<motion.div key={j} className="flex items-start gap-4 group/line hover:bg-white/[0.02] -mx-5 px-5 transition-colors duration-200" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2, delay: 0.4 + j * 0.05 }}><span className="text-gray-600 select-none w-4 text-right shrink-0 text-[11px]">{j + 1}</span><span className="whitespace-pre" style={{ color: line.color }}>{line.text}</span></motion.div>))}
                        <motion.div className="flex items-center gap-4 mt-0.5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}><span className="text-gray-600 select-none w-4 text-right shrink-0 text-[11px]">{mod.code.length + 1}</span><motion.span className="w-[7px] h-[15px] rounded-[1px]" style={{ backgroundColor: mod.color }} animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }} /></motion.div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Phase stats row */}
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {[
                    { label: "Topics Covered", value: mod.topics.length.toString(), suffix: " modules", icon: <LayersIcon className="w-5 h-5" style={{ color: mod.color }} /> },
                    { label: "Tools Used", value: mod.skills.length.toString(), suffix: " tools", icon: <TrendingIcon className="w-5 h-5" style={{ color: mod.color }} /> },
                    { label: "Duration", value: mod.duration.split(" ")[1]?.split("–")[1] || "5", suffix: " weeks", icon: <ClockIcon className="w-5 h-5" style={{ color: mod.color }} /> },
                  ].map((stat, j) => (
                    <motion.div key={j} className="relative group/stat rounded-xl bg-white/[0.03] border border-white/[0.06] p-4 hover:bg-white/[0.05] transition-all duration-300 overflow-hidden flex items-center gap-3" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.5 + j * 0.08 }}>
                      <div className="absolute inset-0 opacity-0 group-hover/stat:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: `radial-gradient(120px circle at 50% 50%, ${mod.color}08, transparent 60%)` }} />
                      <div className="relative w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${mod.color}12` }}>{stat.icon}</div>
                      <div className="relative"><p className="text-xl font-bold text-white">{stat.value}<span className="text-sm font-normal text-gray-500">{stat.suffix}</span></p><p className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">{stat.label}</p></div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Bottom completion badge */}
          <motion.div className="mt-14 flex items-center justify-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}>
            <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-white/[0.04] backdrop-blur-sm border border-white/[0.08]">
              <div className="flex -space-x-1.5">{curriculum.map((mod, j) => (<motion.div key={j} className="w-4 h-4 rounded-full border-2" style={{ backgroundColor: mod.color, borderColor: DARK_BG }} initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 + j * 0.1, type: "spring" }} />))}</div>
              <span className="text-xs font-semibold text-gray-400">5 phases</span><span className="text-xs text-gray-600">·</span><span className="text-xs font-mono text-gray-500">36 weeks</span><span className="text-xs text-gray-600">·</span>
              <motion.span className="text-xs font-bold" style={{ color: ACCENT_GOLD }} animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>Deal ready</motion.span>
            </div>
          </motion.div>
        </div>
      </section>

      <ModulesSection openEnquiry={openEnquiry} />

      {/* ═══════ TOOLS - Two-row marquee ═══════ */}
      <section className="relative py-20 px-6 bg-white overflow-hidden">
        <Divider />
        <div className="max-w-6xl mx-auto pt-12">
          <ScrollReveal>
            <SectionLabel center>Tech Stack</SectionLabel>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy-900 leading-tight text-center">
              {tools.length}+ Tools You&apos;ll{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${ACCENT_BLUE}, ${ACCENT_GOLD})` }}>Master</span>
            </h2>
          </ScrollReveal>

          {/* Two-row scrolling marquee */}
          <div className="mt-14 space-y-4">
            {[tools.slice(0, 5), tools.slice(5, 10)].map((row, ri) => (
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

      {/* ═══════ PROJECTS - Compact premium grid ═══════ */}
      <section className="relative py-16 px-6 overflow-hidden" style={{ backgroundColor: DARK_BG }}>
        {/* Circuit board traces background */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <defs>
            <linearGradient id="circuit1IB" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor={ACCENT_GOLD} stopOpacity="0" /><stop offset="50%" stopColor={ACCENT_GOLD} stopOpacity="0.12" /><stop offset="100%" stopColor={ACCENT_GOLD} stopOpacity="0" /></linearGradient>
            <linearGradient id="circuit2IB" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor={ACCENT_CYAN} stopOpacity="0" /><stop offset="50%" stopColor={ACCENT_CYAN} stopOpacity="0.08" /><stop offset="100%" stopColor={ACCENT_CYAN} stopOpacity="0" /></linearGradient>
            <filter id="circuitGlowIB"><feGaussianBlur stdDeviation="2" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          </defs>
          <motion.path d="M100,100 L300,100 L300,250 L500,250 L500,150 L800,150" fill="none" stroke="url(#circuit1IB)" strokeWidth="1" filter="url(#circuitGlowIB)" initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 2.5 }} />
          <motion.path d="M200,350 L400,350 L400,200 L650,200 L650,400 L900,400" fill="none" stroke="url(#circuit2IB)" strokeWidth="1" filter="url(#circuitGlowIB)" initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 3, delay: 0.5 }} />
          <motion.path d="M50,500 L250,500 L250,380 L550,380 L550,480 L1100,480" fill="none" stroke="url(#circuit1IB)" strokeWidth="0.8" filter="url(#circuitGlowIB)" initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 3.5, delay: 1 }} />
          {[{ cx: 300, cy: 100, color: ACCENT_GOLD }, { cx: 500, cy: 250, color: ACCENT_CYAN }, { cx: 400, cy: 350, color: ACCENT_BLUE }, { cx: 650, cy: 200, color: ACCENT_GOLD }, { cx: 550, cy: 480, color: ACCENT_CYAN }].map((n, i) => (
            <motion.circle key={i} cx={n.cx} cy={n.cy} r="4" fill={n.color} opacity="0.3" filter="url(#circuitGlowIB)" animate={{ r: [4, 6, 4], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 3, repeat: Infinity, delay: i * 0.5, ease: "easeInOut" }} />
          ))}
        </svg>

        {/* Rising finance symbols */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[{ char: "₹", x: "10%", delay: 0, dur: 12, size: 11 }, { char: "$", x: "20%", delay: 3, dur: 14, size: 10 }, { char: "%", x: "30%", delay: 1, dur: 11, size: 10 }, { char: "→", x: "40%", delay: 5, dur: 13, size: 11 }, { char: "↑", x: "50%", delay: 2, dur: 15, size: 10 }, { char: "∑", x: "60%", delay: 4, dur: 12, size: 12 }, { char: "×", x: "70%", delay: 1, dur: 14, size: 10 }, { char: "÷", x: "80%", delay: 6, dur: 11, size: 10 }, { char: "€", x: "90%", delay: 3, dur: 13, size: 10 }].map((p, i) => (
            <motion.span key={`ember-${i}`} className="absolute font-mono select-none" style={{ left: p.x, bottom: "-5%", fontSize: p.size, color: i % 3 === 0 ? ACCENT_GOLD : i % 3 === 1 ? ACCENT_BLUE : ACCENT_CYAN }} animate={{ y: [0, -800], opacity: [0, 0.25, 0.15, 0], rotate: [0, i % 2 === 0 ? 45 : -30] }} transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: "linear" }}>{p.char}</motion.span>
          ))}
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <ScrollReveal>
            <SectionLabel light>Hands-On</SectionLabel>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">Deals You&apos;ll{" "}<span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${ACCENT_CYAN}, ${ACCENT_GOLD})` }}>Analyze</span></h2>
            <p className="mt-3 text-gray-500 text-base max-w-md">Production-grade deal analysis projects that become your portfolio.</p>
          </ScrollReveal>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-3">
            {projects.map((project, i) => (
              <motion.div key={i} className="group relative rounded-xl overflow-hidden cursor-default" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-5%" }} transition={{ duration: 0.5, delay: i * 0.08, ease }} whileHover={{ y: -3 }}>
                <div className="absolute inset-0 rounded-xl border border-white/[0.06] group-hover:border-white/[0.14] transition-colors duration-500 pointer-events-none z-20" />
                <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: `radial-gradient(300px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${project.color}10, transparent 60%)` }} />
                <div className="relative z-10 p-5" style={{ backgroundColor: "rgba(255,255,255,0.02)" }} onMouseMove={(e) => { const rect = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`); e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`); }}>
                  <div className="flex gap-4">
                    <div className="shrink-0 w-12 h-12 rounded-lg flex items-center justify-center p-1.5" style={{ backgroundColor: `${project.color}08`, border: `1px solid ${project.color}15`, color: project.color }}>{project.icon}</div>
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
            <DealValuationDashboard />
          </motion.div>
        </div>
      </section>

      {/* ═══════ CAREER OUTCOMES ═══════ */}
      <section className="relative py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal><SectionLabel>Outcomes</SectionLabel><h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy-900 leading-tight">Where You&apos;ll{" "}<span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${ACCENT_GOLD}, ${ACCENT_BLUE})` }}>End Up</span></h2></ScrollReveal>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-12">
            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {roles.map((role, i) => (<SlideIn key={i} direction="up" delay={i * 0.05}><Card accent={ACCENT_GOLD}><div className="flex items-center justify-between"><div><h4 className="text-sm font-semibold text-navy-900">{role.title}</h4><p className="text-xs text-gray-500 mt-0.5 font-mono">{role.range}</p></div><TargetIcon className="w-4 h-4 text-gray-300" /></div></Card></SlideIn>))}
            </div>
            <div className="lg:col-span-2 space-y-5 flex flex-col justify-center">
              <SlideIn direction="right"><div className="bg-gray-50 rounded-2xl border border-gray-100 p-6"><p className="text-xs font-mono text-gray-400 tracking-widest uppercase mb-2">Expected Salary Range</p><p className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${ACCENT_GOLD}, ${ACCENT_BLUE})` }}>₹8–16 LPA</p></div></SlideIn>
              <SlideIn direction="right" delay={0.1}><div className="flex items-center gap-3 px-5 py-3.5 rounded-xl border border-gray-200 bg-gray-50"><ShieldIcon className="w-5 h-5 shrink-0" style={{ color: ACCENT_GOLD }} /><div><p className="text-sm text-navy-900 font-semibold">100% Placement</p><p className="text-xs text-gray-500">Personalized Path to Employment</p></div></div></SlideIn>
              <SlideIn direction="right" delay={0.2}><div className="flex items-center gap-3 px-5 py-3.5 rounded-xl border border-gray-200 bg-gray-50"><SparklesIcon className="w-5 h-5 shrink-0" style={{ color: ACCENT_BLUE }} /><div><p className="text-sm text-navy-900 font-semibold">CFA Level 1 Prep Included</p><p className="text-xs text-gray-500">Industry-recognized certification prep</p></div></div></SlideIn>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ CERTIFICATION DISPLAY ═══════ */}
      <CertificationDisplay
        cert1Image="/images/certificates/Microsoft.jpeg"
        cert1Alt="Microsoft Certificate"
        cert1Label="Microsoft Certified"
        cert1Sub="Azure AI (AI-900)"
        cert2Image="/images/certificates/Simple-Demo.jpeg"
        cert2Alt="Linkway Learning Certificate of Completion"
        cert2Label="Linkway Learning"
        cert2Sub="Completion Certificate"
      />

      <WaveDivider from="#ffffff" to="#f9fafb" />

      {/* ═══════ FAQ ═══════ */}
      <section className="relative py-16 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal><SectionLabel center>FAQ</SectionLabel><h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy-900 leading-tight text-center">Common{" "}<span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${ACCENT_GOLD}, ${ACCENT_BLUE})` }}>Questions</span></h2></ScrollReveal>
          <div className="mt-10 bg-white rounded-2xl border border-gray-100 px-6 md:px-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">{faqs.map((faq, i) => (<FAQItem key={i} question={faq.question} answer={faq.answer} isOpen={openFaq === i} onClick={() => setOpenFaq(openFaq === i ? -1 : i)} index={i} />))}</div>
        </div>
      </section>

      {/* ═══════ TESTIMONIALS - Premium carousel with floating orbs ═══════ */}
      <section className="relative py-24 px-6 overflow-hidden" style={{ background: 'linear-gradient(180deg, #f9fafb 0%, #f1f5f9 50%, #f9fafb 100%)' }}>
        <motion.div className="absolute top-20 left-[10%] w-72 h-72 rounded-full blur-[100px] pointer-events-none" style={{ backgroundColor: `${ACCENT_GOLD}08` }} animate={{ x: [0, 40, 0], y: [0, -20, 0] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div className="absolute bottom-20 right-[10%] w-80 h-80 rounded-full blur-[120px] pointer-events-none" style={{ backgroundColor: `${ACCENT_BLUE}06` }} animate={{ x: [0, -30, 0], y: [0, 25, 0] }} transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }} />
        <div className="max-w-6xl mx-auto relative z-10">
          <ScrollReveal>
            <SectionLabel center>Success Stories</SectionLabel>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy-900 leading-tight text-center">
              What Learners Say{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${ACCENT_GOLD}, ${ACCENT_BLUE})` }}>About Us</span>
            </h2>
            <p className="text-center text-gray-500 mt-4 max-w-xl mx-auto text-sm leading-relaxed">
              Join hundreds of professionals who&apos;ve broken into investment banking with Linkway Learning.
            </p>
          </ScrollReveal>
        </div>
        <TestimonialCarousel />
      </section>

      {/* ═══════ CAREER GROWTH ROADMAP - Animated SVG path ═══════ */}
      <section className="relative py-24 px-6 bg-white overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] rounded-full pointer-events-none" style={{ background: `radial-gradient(ellipse, ${ACCENT_BLUE}05, transparent 70%)` }} />
        <div className="max-w-6xl mx-auto relative z-10">
          <ScrollReveal>
            <SectionLabel center>Your Journey</SectionLabel>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy-900 leading-tight text-center">
              Your Career Growth{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${ACCENT_GOLD}, ${ACCENT_BLUE})` }}>Roadmap</span>
            </h2>
            <p className="text-center text-gray-500 mt-4 max-w-xl mx-auto text-sm leading-relaxed">
              A proven 4-step path to take you from upskilling to your dream job
            </p>
          </ScrollReveal>

          <div className="mt-20 relative">
            <svg className="hidden lg:block absolute top-[56px] left-0 w-full h-[50px] pointer-events-none" viewBox="0 0 1152 50" fill="none" preserveAspectRatio="none">
              <motion.path d="M 100 25 C 220 25, 240 8, 330 8 C 420 8, 430 42, 520 42 C 610 42, 620 8, 710 8 C 800 8, 810 42, 900 42 C 940 42, 960 25, 1052 25" stroke="url(#rmGrad)" strokeWidth="2.5" strokeDasharray="10 7" strokeLinecap="round" fill="none" initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 2.5, ease: "easeOut" }} />
              <defs><linearGradient id="rmGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor={ACCENT_BLUE} stopOpacity={0.35} /><stop offset="50%" stopColor={ACCENT_GOLD} stopOpacity={0.4} /><stop offset="100%" stopColor={ACCENT_BLUE} stopOpacity={0.35} /></linearGradient></defs>
              <motion.circle r="5" fill={ACCENT_GOLD} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 2 }}><animateMotion dur="5s" repeatCount="indefinite" path="M 100 25 C 220 25, 240 8, 330 8 C 420 8, 430 42, 520 42 C 610 42, 620 8, 710 8 C 800 8, 810 42, 900 42 C 940 42, 960 25, 1052 25" /></motion.circle>
              <motion.circle r="12" fill={ACCENT_GOLD} opacity={0.15} initial={{ opacity: 0 }} whileInView={{ opacity: 0.15 }} viewport={{ once: true }} transition={{ delay: 2 }}><animateMotion dur="5s" repeatCount="indefinite" path="M 100 25 C 220 25, 240 8, 330 8 C 420 8, 430 42, 520 42 C 610 42, 620 8, 710 8 C 800 8, 810 42, 900 42 C 940 42, 960 25, 1052 25" /></motion.circle>
            </svg>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
              {([
                { title: "Profile Power-Up", desc: "Stand out with a sharp resume, optimized LinkedIn, and a strong personal brand.", color: "#3B82F6", icon: (<svg viewBox="0 0 48 48" fill="none" className="w-full h-full"><circle cx="18" cy="16" r="5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M7 38c0-6.075 4.925-11 11-11s11 4.925 11 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><circle cx="35" cy="18" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M29 38c0-4.418 2.686-8 6-8s6 3.582 6 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><motion.path d="M32 10l2-2 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 1 }} /></svg>) },
                { title: "Interview Readiness", desc: "Ace every round with 1:1 mock interviews, role-specific training, and actionable feedback.", color: "#8B5CF6", icon: (<svg viewBox="0 0 48 48" fill="none" className="w-full h-full"><rect x="8" y="6" width="32" height="36" rx="4" stroke="currentColor" strokeWidth="2" /><circle cx="24" cy="18" r="5" stroke="currentColor" strokeWidth="2" /><path d="M16 34c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><motion.path d="M30 14l3 3 5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 1.2 }} /></svg>) },
                { title: "Hiring Rounds", desc: "Apply to 200+ hiring partners and clear technical interview rounds with confidence.", color: "#0EA5E9", icon: (<svg viewBox="0 0 48 48" fill="none" className="w-full h-full"><rect x="10" y="8" width="28" height="32" rx="3" stroke="currentColor" strokeWidth="2" /><path d="M16 16h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M16 22h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M16 28h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><motion.rect x="16" y="34" rx="1.5" height="3" fill="currentColor" opacity={0.6} animate={{ width: [8, 16, 8] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} /></svg>) },
                { title: "Offer Unlocked!", desc: "Land a high paying job offer from top investment banks and PE firms.", color: "#F97316", icon: (<svg viewBox="0 0 48 48" fill="none" className="w-full h-full"><motion.path d="M24 34V14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" animate={{ y: [0, -2, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} /><motion.path d="M17 21l7-7 7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" animate={{ y: [0, -2, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} /><path d="M10 40h28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><motion.circle cx="24" cy="8" r="2.5" fill="currentColor" animate={{ scale: [0.8, 1.3, 0.8], opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }} /></svg>) },
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

      {/* ═══════ FINAL CTA - Join 8000+ professionals ═══════ */}
      <FooterCTA />
    </div>
    </ThemeProvider>
  );
}
