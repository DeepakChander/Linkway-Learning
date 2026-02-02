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
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/lib/theme";

gsap.registerPlugin(ScrollTrigger);

const BRAND_ORANGE = "#F58220";
const BRAND_NAVY = "#0D1B2A";
const ACCENT_BLUE = "#3B82F6";
const ACCENT_CYAN = "#06B6D4";
const ACCENT_PURPLE = "#8B5CF6";
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
  return (<span className={className}>{text}<span className="inline-block w-[3px] h-[1em] ml-1 align-middle animate-pulse" style={{ backgroundColor: ACCENT_PURPLE }} /></span>);
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

function Card({ children, className, accent = ACCENT_PURPLE }: { children: React.ReactNode; className?: string; accent?: string }) {
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
  return (<div className={cn("flex items-center gap-3 mb-4", center && "justify-center")}><span className={cn("inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-[0.15em] uppercase", light ? "bg-white/10 text-white/70 border border-white/10" : "bg-purple-50 border border-purple-100")} style={!light ? { color: ACCENT_PURPLE } : undefined}><span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: light ? "#fff" : ACCENT_PURPLE, opacity: light ? 0.5 : 1 }} />{children}</span></div>);
}

function StatCard({ value, suffix, label, icon: Icon, delay = 0, accent = ACCENT_PURPLE }: { value: number; suffix: string; label: string; icon: React.FC<{ className?: string; style?: React.CSSProperties }>; delay?: number; accent?: string }) {
  return (<SlideIn direction="up" delay={delay}><div className="relative bg-white rounded-2xl border border-gray-100 p-6 text-center overflow-hidden group hover:border-gray-200 transition-colors duration-300"><div className="absolute top-3 right-3 opacity-[0.06] group-hover:opacity-[0.1] transition-opacity duration-500"><Icon className="w-14 h-14" style={{ color: accent }} /></div><div className="text-4xl md:text-5xl font-bold mb-1.5" style={{ color: BRAND_NAVY }}><Counter target={value} suffix={suffix} duration={2} /></div><p className="text-sm text-gray-500 font-medium">{label}</p></div></SlideIn>);
}

function Divider({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null); const inView = useInView(ref, { once: true });
  return (<div ref={ref} className={cn("relative h-px w-full overflow-hidden", className)}><motion.div className="absolute inset-0" style={{ background: `linear-gradient(90deg, transparent, ${ACCENT_PURPLE}30, ${ACCENT_BLUE}30, transparent)` }} initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}} transition={{ duration: 1.2, ease }} /></div>);
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
      <button onClick={onClick} className="flex items-center justify-between w-full py-5 text-left group cursor-pointer"><span className="text-base md:text-lg font-medium text-navy-900 group-hover:text-purple-500 transition-colors pr-4">{question}</span><motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }}><ChevronIcon className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors" /></motion.span></button>
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
    { label: "AI Engineer", value: 90, color: ACCENT_PURPLE },
    { label: "Prompt Engineer", value: 85, color: ACCENT_BLUE },
    { label: "LLM Developer", value: 78, color: ACCENT_CYAN },
    { label: "AI Solutions Arch.", value: 72, color: ACCENT_PURPLE },
    { label: "AI Product Manager", value: 65, color: ACCENT_BLUE },
  ];
  const metrics = [
    { label: "Avg. Salary", value: "₹14 LPA", delta: "+45%" },
    { label: "Placed", value: "300+", delta: "+120%" },
    { label: "Hiring Partners", value: "80+", delta: "+65%" },
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
function ArrowRightIcon({ className }: { className?: string }) { return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>; }
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
function CodeIcon({ className, style }: { className?: string; style?: React.CSSProperties }) { return <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>; }

/* ═══════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════ */

export default function AgenticAIPage() {
  const { openEnquiry } = useEnquiryModal();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  const [openFaq, setOpenFaq] = useState(0);
  const [activeTab, setActiveTab] = useState(0);

  const personas = [
    { icon: CodeIcon, title: "Software Developers", desc: "You already code. Now learn to build AI agents that automate complex workflows, reason through problems, and interact with APIs autonomously.", color: ACCENT_PURPLE },
    { icon: RocketIcon, title: "Data Scientists", desc: "Take your ML skills to the next level. Build agents that combine your models with real-world decision-making and tool usage.", color: ACCENT_BLUE },
    { icon: GraduationIcon, title: "AI Enthusiasts", desc: "You've used ChatGPT. Now learn to build systems like it. From prompt engineering to multi-agent orchestration.", color: ACCENT_CYAN },
    { icon: BriefcaseIcon, title: "Product Managers", desc: "Understand what's possible with agentic AI so you can design better products and lead AI-first teams.", color: ACCENT_PURPLE },
  ];

  const curriculum = [
    { phase: "01", title: "Prompt Engineering Foundations", duration: "Weeks 1–4", color: ACCENT_PURPLE, skills: ["Prompt Design", "OpenAI API", "Few-shot", "CoT"], topics: [
      "Prompt design principles — zero-shot, few-shot, chain-of-thought, role-based prompting",
      "LLM fundamentals — tokens, temperature, context windows, model selection",
      "OpenAI API mastery — completions, chat, embeddings, function calling",
      "Prompt optimization — iterative refinement, evaluation metrics, A/B testing prompts",
    ], code: [
      { text: "# Chain-of-thought prompting", color: "#8b949e" },
      { text: "from openai import OpenAI", color: "#79c0ff" },
      { text: "", color: "#e6edf3" },
      { text: "client = OpenAI()", color: "#e6edf3" },
      { text: "response = client.chat.completions.create(", color: "#e6edf3" },
      { text: '  model="gpt-4",', color: "#e6edf3" },
      { text: '  messages=[{"role": "system",', color: "#e6edf3" },
      { text: '    "content": "Think step by step..."}]', color: "#e6edf3" },
      { text: ")", color: "#e6edf3" },
      { text: ">>> Reasoning: 3 steps identified", color: "#7ee787" },
    ]},
    { phase: "02", title: "Building with LangChain", duration: "Weeks 5–9", color: ACCENT_BLUE, skills: ["LangChain", "RAG", "Vector DB", "Memory"], topics: [
      "LangChain fundamentals — chains, agents, memory, callbacks",
      "RAG systems — retrieval augmented generation, vector databases, document loaders",
      "Tool usage — building custom tools, API integration, web browsing agents",
      "Memory systems — conversation memory, entity memory, summary memory",
    ], code: [
      { text: "# RAG with LangChain", color: "#8b949e" },
      { text: "from langchain.vectorstores import Chroma", color: "#79c0ff" },
      { text: "from langchain.chains import RetrievalQA", color: "#79c0ff" },
      { text: "", color: "#e6edf3" },
      { text: "vectordb = Chroma.from_documents(docs, embeddings)", color: "#e6edf3" },
      { text: "qa = RetrievalQA.from_chain_type(llm, retriever)", color: "#e6edf3" },
      { text: "", color: "#e6edf3" },
      { text: '>>> Answer found in 3 documents (0.94 confidence)', color: "#7ee787" },
    ]},
    { phase: "03", title: "Agentic AI Architecture", duration: "Weeks 10–14", color: ACCENT_CYAN, skills: ["ReAct", "Multi-Agent", "Guardrails", "Orchestration"], topics: [
      "Agent design patterns — ReAct, Plan-and-Execute, Tree of Thought",
      "Multi-agent systems — orchestration, delegation, agent communication",
      "Autonomous workflows — task decomposition, self-correction, goal-driven agents",
      "Safety and guardrails — output validation, content filtering, rate limiting",
    ], code: [
      { text: "# Multi-agent orchestration", color: "#8b949e" },
      { text: "from langchain.agents import AgentExecutor", color: "#79c0ff" },
      { text: "", color: "#e6edf3" },
      { text: "researcher = create_agent(tools=[search, wiki])", color: "#e6edf3" },
      { text: "writer = create_agent(tools=[summarize])", color: "#e6edf3" },
      { text: "orchestrator = MultiAgentSystem([researcher, writer])", color: "#e6edf3" },
      { text: "", color: "#e6edf3" },
      { text: ">>> Task delegated to researcher → 5 sources found", color: "#7ee787" },
      { text: ">>> Writer generated 1,200-word report", color: "#7ee787" },
    ]},
    { phase: "04", title: "Advanced Applications", duration: "Weeks 15–19", color: ACCENT_PURPLE, skills: ["Code Gen", "Data Agents", "Support Bots", "Research"], topics: [
      "Code generation agents — automated coding, testing, and debugging workflows",
      "Data analysis agents — autonomous data exploration, visualization, and reporting",
      "Customer support agents — multi-turn conversations, escalation, knowledge base integration",
      "Research agents — web search, document synthesis, fact-checking workflows",
    ], code: [
      { text: "# Autonomous coding agent", color: "#8b949e" },
      { text: "agent = CodeAgent(llm=gpt4, tools=[", color: "#e6edf3" },
      { text: "    file_reader, code_executor,", color: "#e6edf3" },
      { text: "    test_runner, git_tool", color: "#e6edf3" },
      { text: "])", color: "#e6edf3" },
      { text: '', color: "#e6edf3" },
      { text: 'result = agent.run("Fix the auth bug")', color: "#e6edf3" },
      { text: ">>> Identified bug in auth.py:142", color: "#7ee787" },
      { text: ">>> Fix applied | All 23 tests passing ✓", color: "#7ee787" },
    ]},
    { phase: "05", title: "Production Deployment", duration: "Weeks 20–24", color: BRAND_ORANGE, skills: ["Docker", "LangSmith", "Monitoring", "Capstone"], topics: [
      "Deployment strategies — Docker, cloud hosting, serverless architectures",
      "Monitoring and observability — LangSmith, logging, performance tracking",
      "Cost optimization — token management, caching, model routing",
      "Capstone project — end-to-end agentic AI system for a real business problem",
    ], code: [
      { text: "# Deploy agent with monitoring", color: "#8b949e" },
      { text: "from langsmith import Client", color: "#79c0ff" },
      { text: "", color: "#e6edf3" },
      { text: "client = Client()", color: "#e6edf3" },
      { text: "with client.trace('production'):", color: "#e6edf3" },
      { text: "    result = agent.invoke(query)", color: "#e6edf3" },
      { text: "", color: "#e6edf3" },
      { text: ">>> Latency: 2.3s | Tokens: 1,847 | Cost: $0.04", color: "#7ee787" },
      { text: ">>> Agent deployed → agents.linkway.io/v1", color: "#7ee787" },
    ]},
  ];

  const tools = ["Python", "LangChain", "OpenAI", "Docker", "AWS", "Pinecone", "ChromaDB", "FastAPI", "Streamlit", "LangSmith", "Git", "VS Code", "Jupyter"];

  const projects = [
    { title: "Intelligent Research Agent", desc: "Build an autonomous research agent that searches the web, synthesizes information from multiple sources, and generates comprehensive reports.", tags: ["LangChain", "OpenAI", "RAG"], color: ACCENT_PURPLE },
    { title: "AI-Powered Code Assistant", desc: "Create a coding agent that understands codebases, generates code, writes tests, and debugs issues autonomously.", tags: ["Python", "GPT-4", "LangChain"], color: ACCENT_BLUE },
    { title: "Multi-Agent Support System", desc: "Design a multi-agent system with specialized agents for routing, answering, and escalating customer queries.", tags: ["Multi-Agent", "RAG", "FastAPI"], color: ACCENT_CYAN },
    { title: "RAG-Powered Knowledge Base", desc: "Build a retrieval-augmented generation system that answers questions from company documents with cited sources.", tags: ["ChromaDB", "LangChain", "OpenAI"], color: ACCENT_PURPLE },
  ];

  const roles = [
    { title: "AI Engineer", range: "10–20 LPA" },
    { title: "Prompt Engineer", range: "8–16 LPA" },
    { title: "LLM Developer", range: "12–22 LPA" },
    { title: "AI Solutions Architect", range: "15–25 LPA" },
    { title: "ML Engineer", range: "10–18 LPA" },
    { title: "AI Product Manager", range: "12–20 LPA" },
  ];

  const faqs = [
    { question: "Do I need prior AI experience?", answer: "You should be comfortable with Python programming. Some exposure to ML concepts helps but isn't required — we cover the AI fundamentals you need." },
    { question: "What makes this different from a generic AI course?", answer: "This is entirely focused on building autonomous AI agents — not just using APIs. You'll learn architecture patterns, multi-agent orchestration, and production deployment that most courses don't cover." },
    { question: "Will I build real projects?", answer: "Absolutely. Every module includes hands-on projects, and the capstone is a full production-grade agentic AI system you can showcase to employers." },
    { question: "How current is the curriculum?", answer: "We update the curriculum monthly. You'll learn the latest tools and frameworks — LangChain, OpenAI function calling, multi-agent patterns — as the field evolves." },
    { question: "What career support is provided?", answer: "Portfolio reviews, mock technical interviews, LinkedIn optimization, and direct introductions to companies hiring AI engineers. We work with you until you land the right role." },
  ];

  const highlights = [
    { icon: ShieldIcon, label: "Only 100% Placement", sub: "No guarantee or assistance", color: ACCENT_PURPLE },
    { icon: CurrencyIcon, label: "0% EMI Available", sub: "Starting ₹7,000/mo", color: ACCENT_BLUE },
    { icon: SparklesIcon, label: "AI Certifications", sub: "LangChain + OpenAI", color: ACCENT_CYAN },
    { icon: ClockIcon, label: "Flexible Schedule", sub: "Weekday & weekend batches", color: ACCENT_PURPLE },
  ];

  return (
    <ThemeProvider theme="light">
    <div className="min-h-screen bg-white text-navy-900 selection:bg-purple-500/20 overflow-x-hidden">

      {/* ═══════ HERO ═══════ */}
      <section ref={heroRef} className="relative min-h-[88vh] flex items-center overflow-hidden" style={{ backgroundColor: DARK_BG }}>
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 60% 45% at 20% 25%, ${ACCENT_PURPLE}12 0%, transparent 55%), radial-gradient(ellipse 45% 35% at 80% 65%, ${ACCENT_BLUE}0c 0%, transparent 50%), linear-gradient(180deg, ${DARK_BG} 0%, #0c1220 50%, ${DARK_BG} 100%)` }} />
        <motion.div className="absolute w-[600px] h-[600px] -top-48 -right-48 rounded-full blur-[120px] pointer-events-none" animate={{ scale: [1, 1.12, 1], opacity: [0.2, 0.35, 0.2] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} style={{ background: `radial-gradient(circle, ${ACCENT_PURPLE}20, transparent 70%)` }} />

        {[
          { text: "agent.run()", x: "8%", y: "15%", dur: 18, delay: 0 },
          { text: "chain.invoke()", x: "85%", y: "22%", dur: 22, delay: 2 },
          { text: "from langchain", x: "72%", y: "75%", dur: 20, delay: 4 },
          { text: "ReAct loop", x: "15%", y: "70%", dur: 24, delay: 1 },
          { text: "tokens: 1847", x: "55%", y: "12%", dur: 19, delay: 3 },
          { text: "RAG.query()", x: "90%", y: "55%", dur: 21, delay: 5 },
          { text: "tool_call()", x: "30%", y: "85%", dur: 23, delay: 2 },
          { text: "confidence: 0.94", x: "45%", y: "90%", dur: 17, delay: 6 },
        ].map((frag, i) => (
          <motion.span key={i} className="absolute font-mono text-[11px] pointer-events-none select-none" style={{ left: frag.x, top: frag.y, color: `${ACCENT_PURPLE}18` }}
            animate={{ y: [0, -15, 0, 10, 0], x: [0, 8, -5, 3, 0], opacity: [0.15, 0.3, 0.15, 0.25, 0.15] }}
            transition={{ duration: frag.dur, repeat: Infinity, delay: frag.delay, ease: "easeInOut" }}>{frag.text}</motion.span>
        ))}

        <div className="absolute inset-0 pointer-events-none overflow-hidden"><svg className="w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="dotGrid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse"><circle cx="30" cy="30" r="1" fill="white" /></pattern></defs><rect width="100%" height="100%" fill="url(#dotGrid)" /></svg></div>

        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="flowGrad1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor={ACCENT_PURPLE} stopOpacity="0" /><stop offset="50%" stopColor={ACCENT_PURPLE} stopOpacity="0.12" /><stop offset="100%" stopColor={ACCENT_PURPLE} stopOpacity="0" /></linearGradient>
            <linearGradient id="flowGrad2" x1="100%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor={ACCENT_BLUE} stopOpacity="0" /><stop offset="50%" stopColor={ACCENT_BLUE} stopOpacity="0.08" /><stop offset="100%" stopColor={ACCENT_BLUE} stopOpacity="0" /></linearGradient>
            <linearGradient id="flowGrad3" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor={ACCENT_CYAN} stopOpacity="0" /><stop offset="50%" stopColor={ACCENT_CYAN} stopOpacity="0.06" /><stop offset="100%" stopColor={ACCENT_CYAN} stopOpacity="0" /></linearGradient>
          </defs>
          <motion.path d="M-100,200 C200,100 400,350 700,180 S1100,300 1500,150" fill="none" stroke="url(#flowGrad1)" strokeWidth="1.5" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 3, delay: 0.5, ease: "easeInOut" }} />
          <motion.path d="M-50,400 C250,300 500,500 800,350 S1200,450 1500,380" fill="none" stroke="url(#flowGrad2)" strokeWidth="1" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 3.5, delay: 1, ease: "easeInOut" }} />
          <motion.path d="M-80,550 C180,480 420,600 720,500 S1050,580 1500,520" fill="none" stroke="url(#flowGrad3)" strokeWidth="1" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 4, delay: 1.5, ease: "easeInOut" }} />
          <motion.circle r="3" fill={ACCENT_PURPLE} opacity="0.4" animate={{ cx: [0, 350, 700, 1100, 1500], cy: [200, 150, 250, 200, 150] }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} />
          <motion.circle r="2.5" fill={ACCENT_BLUE} opacity="0.3" animate={{ cx: [0, 400, 800, 1200, 1500], cy: [400, 350, 450, 380, 380] }} transition={{ duration: 10, repeat: Infinity, ease: "linear", delay: 2 }} />
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
                <span className="text-white">Master</span><br />
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${ACCENT_PURPLE}, ${ACCENT_CYAN})` }}>Agentic AI</span>
              </motion.h1>
              <motion.div className="mt-5 h-8 flex items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.5 }}>
                <span className="text-gray-500 text-base">Build</span>
                <TypeWriter words={["Autonomous Agents", "RAG Systems", "Multi-Agent Apps", "LangChain Pipelines", "Production AI"]} className="text-base font-mono font-semibold text-white" />
              </motion.div>
              <motion.p className="mt-5 text-base md:text-lg text-gray-400 leading-relaxed max-w-lg" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35 }}>
                Learn to design, build, and deploy AI agents that think, plan, and execute. From prompt engineering to multi-agent orchestration.
              </motion.p>
              <motion.div className="mt-8 flex flex-wrap items-center gap-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.55 }}>
                <Magnetic><motion.button onClick={openEnquiry} className="group relative px-7 py-3.5 rounded-xl font-semibold text-sm overflow-hidden cursor-pointer" style={{ backgroundColor: ACCENT_PURPLE }} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}><span className="relative z-10 flex items-center gap-2 text-white">Start Learning <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span></motion.button></Magnetic>
                <Magnetic><motion.button onClick={openEnquiry} className="px-7 py-3.5 rounded-xl font-semibold text-sm border border-white/[0.12] text-white/80 hover:text-white hover:border-white/25 hover:bg-white/[0.04] transition-all duration-300 cursor-pointer" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>Download Syllabus</motion.button></Magnetic>
              </motion.div>
            </div>
            <motion.div className="relative hidden lg:block" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.4, ease }}>
              <Terminal title="agent.py — Python 3.12" lines={[
                { text: "from langchain.agents import AgentExecutor", color: "#79c0ff", delay: 300 },
                { text: "from langchain.tools import tool", color: "#79c0ff", delay: 150 },
                { text: "from langchain_openai import ChatOpenAI", color: "#79c0ff", delay: 150 },
                { text: "", delay: 80 },
                { text: "# Define autonomous research agent", color: "#8b949e", delay: 200 },
                { text: 'llm = ChatOpenAI(model="gpt-4")', color: "#e6edf3", delay: 150 },
                { text: "agent = create_react_agent(llm, tools=[", color: "#e6edf3", delay: 120 },
                { text: "    web_search, document_reader, summarizer", color: "#e6edf3", delay: 150 },
                { text: "])", color: "#e6edf3", delay: 80 },
                { text: "", delay: 80 },
                { text: "# Execute multi-step research task", color: "#8b949e", delay: 200 },
                { text: 'result = agent.invoke("Analyze AI market trends")', color: "#e6edf3", delay: 150 },
                { text: "", delay: 80 },
                { text: ">>> Step 1: Searching 5 sources...", color: "#f0883e", delay: 400 },
                { text: ">>> Step 2: Extracting key insights...", color: "#f0883e", delay: 300 },
                { text: ">>> Step 3: Generating report...", color: "#f0883e", delay: 300 },
                { text: ">>> ✓ Report generated (1,847 tokens)", color: "#7ee787", delay: 500 },
              ]} />
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-12 rounded-full blur-3xl" style={{ background: `${ACCENT_PURPLE}15` }} />
            </motion.div>
          </div>
        </motion.div>
      </section>

      <div className="lg:hidden relative" style={{ backgroundColor: DARK_BG }}>
        <div className="px-6 pb-10">
          <Terminal title="agent.py" lines={[
            { text: "from langchain.agents import AgentExecutor", color: "#79c0ff", delay: 300 },
            { text: 'result = agent.invoke("Analyze AI trends")', color: "#e6edf3", delay: 200 },
            { text: ">>> Step 1: Searching 5 sources...", color: "#f0883e", delay: 400 },
            { text: ">>> Step 2: Extracting insights...", color: "#f0883e", delay: 300 },
            { text: ">>> ✓ Report generated (1,847 tokens)", color: "#7ee787", delay: 500 },
          ]} />
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
          <StatCard value={300} suffix="+" label="Students Placed" icon={UserIcon} delay={0} accent={ACCENT_PURPLE} />
          <StatCard value={13} suffix="" label="Industry Tools" icon={LayersIcon} delay={0.08} accent={ACCENT_BLUE} />
          <StatCard value={6} suffix="" label="Month Program" icon={ClockIcon} delay={0.16} accent={ACCENT_CYAN} />
          <StatCard value={5} suffix="" label="Capstone Projects" icon={RocketIcon} delay={0.24} accent={ACCENT_PURPLE} />
        </div>
      </section>

      <WaveDivider from="#f9fafb" to="#ffffff" />

      {/* ═══════ WHO IS THIS FOR ═══════ */}
      <section className="relative py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal><SectionLabel>Built For</SectionLabel><h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy-900 leading-tight">Is This <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${ACCENT_PURPLE}, ${ACCENT_BLUE})` }}>You</span>?</h2><p className="mt-3 text-gray-500 text-base max-w-lg">For builders who want to create the next generation of AI applications.</p></ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
            {personas.map((p, i) => (<SlideIn key={i} direction={i % 2 === 0 ? "left" : "right"} delay={i * 0.06}><Card accent={p.color} className="h-full"><div className="flex items-start gap-4"><div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${p.color}10` }}><p.icon className="w-5 h-5" style={{ color: p.color }} /></div><div><h3 className="text-base font-bold text-navy-900 mb-1.5">{p.title}</h3><p className="text-sm text-gray-600 leading-relaxed">{p.desc}</p></div></div></Card></SlideIn>))}
          </div>
        </div>
      </section>

      <WaveDivider from="#ffffff" to="#f9fafb" />

      {/* ═══════ CURRICULUM ═══════ */}
      <section className="relative py-16 px-6 bg-gray-50 overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal><SectionLabel center>Curriculum</SectionLabel><h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy-900 leading-tight text-center">Your Learning{" "}<span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${ACCENT_PURPLE}, ${ACCENT_CYAN})` }}>Journey</span></h2><p className="mt-3 text-gray-500 text-base max-w-lg mx-auto text-center">24 weeks from prompt engineering basics to production agentic AI. Click each phase to explore.</p></ScrollReveal>
          <div className="relative mt-14">
            <div className="absolute left-7 top-0 bottom-0 w-px bg-gray-200 hidden md:block"><motion.div className="w-full bg-gradient-to-b from-purple-400 via-blue-400 to-cyan-400" initial={{ height: "0%" }} whileInView={{ height: "100%" }} viewport={{ once: true }} transition={{ duration: 1.5, delay: 0.3, ease }} /></div>
            <div className="space-y-6 md:pl-20 relative">
              {curriculum.map((mod, i) => (
                <div key={i} className="relative">
                  <div className="hidden md:flex absolute -left-20 top-8 items-center"><motion.div className="w-[14px] h-[14px] rounded-full border-[3px] border-white shadow-md z-10" style={{ backgroundColor: mod.color }} initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.15 + 0.3, type: "spring", stiffness: 300 }} /><div className="w-[30px] h-px" style={{ backgroundColor: `${mod.color}40` }} /></div>
                  <JourneyPhaseCard mod={mod} index={i} isOpen={activeTab === i} onToggle={() => setActiveTab(activeTab === i ? -1 : i)} codeLines={mod.code} />
                </div>
              ))}
            </div>
          </div>
          <motion.div className="mt-10 flex items-center justify-center gap-3" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.6 }}>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm">
              <div className="flex -space-x-1">{curriculum.map((mod, i) => (<motion.div key={i} className="w-3 h-3 rounded-full border-2 border-white" style={{ backgroundColor: mod.color }} initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.8 + i * 0.1, type: "spring" }} />))}</div>
              <span className="text-xs font-semibold text-gray-600">5 phases</span><span className="text-xs text-gray-400">·</span><span className="text-xs font-mono text-gray-400">24 weeks</span><span className="text-xs text-gray-400">·</span><span className="text-xs font-semibold" style={{ color: ACCENT_PURPLE }}>Agent ready</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════ TOOLS ═══════ */}
      <section className="relative py-16 px-6 bg-white">
        <Divider />
        <div className="max-w-6xl mx-auto pt-12">
          <ScrollReveal><SectionLabel center>Tech Stack</SectionLabel><h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy-900 leading-tight text-center">{tools.length} Tools You&apos;ll{" "}<span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${ACCENT_PURPLE}, ${ACCENT_BLUE})` }}>Master</span></h2></ScrollReveal>
          <div className="mt-10"><ToolMarquee tools={tools} /></div>
        </div>
        <div className="mt-12"><Divider /></div>
      </section>

      {/* ═══════ PROJECTS ═══════ */}
      <section className="relative py-20 px-6" style={{ backgroundColor: DARK_BG }}>
        <div className="max-w-6xl mx-auto">
          <ScrollReveal><SectionLabel light>Hands-On</SectionLabel><h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">Projects You&apos;ll{" "}<span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${ACCENT_CYAN}, ${ACCENT_PURPLE})` }}>Ship</span></h2><p className="mt-3 text-gray-500 text-base max-w-lg">Production-grade agentic AI projects that become your portfolio.</p></ScrollReveal>
          <div className="relative mt-14">
            <div className="absolute left-5 md:left-1/2 top-0 bottom-0 w-px bg-white/[0.08] -translate-x-1/2 hidden md:block" />
            {projects.map((project, i) => (
              <SlideIn key={i} direction={i % 2 === 0 ? "left" : "right"} delay={i * 0.1} className="mb-6 last:mb-0">
                <div className={cn("md:w-[calc(50%-2rem)] relative", i % 2 === 0 ? "md:mr-auto md:pr-8" : "md:ml-auto md:pl-8")}>
                  <div className={cn("hidden md:block absolute top-6 w-3 h-3 rounded-full border-2 border-white/20", i % 2 === 0 ? "-right-[7px]" : "-left-[7px]")} style={{ backgroundColor: project.color }} />
                  <div className="relative group rounded-2xl overflow-hidden border border-white/[0.08] bg-white/[0.03] p-6 hover:border-white/20 hover:bg-white/[0.05] transition-all duration-300">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${project.color}18` }}><span className="text-xs font-bold font-mono" style={{ color: project.color }}>{String(i + 1).padStart(2, "0")}</span></div><div className="h-px flex-1" style={{ background: `linear-gradient(90deg, ${project.color}30, transparent)` }} /></div>
                      <h4 className="text-base font-bold text-white">{project.title}</h4>
                      <p className="text-sm text-gray-400 leading-relaxed">{project.desc}</p>
                      <div className="flex flex-wrap gap-1.5 pt-1">{project.tags.map((tag) => (<span key={tag} className="px-2 py-0.5 rounded text-xs font-mono border" style={{ color: project.color, borderColor: `${project.color}30`, backgroundColor: `${project.color}0a` }}>{tag}</span>))}</div>
                    </div>
                  </div>
                </div>
              </SlideIn>
            ))}
          </div>
          <motion.div className="mt-16 relative max-w-3xl mx-auto" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <Terminal title="agent_demo.sh — bash" lines={[
              { text: "$ python run_agent.py --task 'research AI market trends'", color: "#e6edf3", delay: 400 },
              { text: "", delay: 100 },
              { text: "[Agent] Planning task decomposition...", color: "#a78bfa", delay: 300 },
              { text: "  → Subtask 1: Search recent AI reports", color: "#e6edf3", delay: 300 },
              { text: "  → Subtask 2: Extract market data", color: "#e6edf3", delay: 200 },
              { text: "  → Subtask 3: Synthesize findings", color: "#e6edf3", delay: 200 },
              { text: "", delay: 100 },
              { text: "[Tool: web_search] Querying 5 sources...", color: "#f0883e", delay: 400 },
              { text: "  ✓ Found 23 relevant articles", color: "#7ee787", delay: 400 },
              { text: "[Tool: document_reader] Extracting insights...", color: "#f0883e", delay: 300 },
              { text: "  ✓ Key metrics from 12 documents", color: "#7ee787", delay: 400 },
              { text: "[Agent] Generating comprehensive report...", color: "#a78bfa", delay: 300 },
              { text: "  ✓ Report: 1,847 tokens | 5 sections | 8 citations", color: "#7ee787", delay: 500 },
              { text: "", delay: 100 },
              { text: "Agent completed in 12.3s | Cost: $0.04", color: "#79c0ff", delay: 400 },
            ]} />
          </motion.div>
        </div>
      </section>

      {/* ═══════ CAREER OUTCOMES ═══════ */}
      <section className="relative py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal><SectionLabel>Outcomes</SectionLabel><h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy-900 leading-tight">Where You&apos;ll{" "}<span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${ACCENT_PURPLE}, ${ACCENT_BLUE})` }}>End Up</span></h2></ScrollReveal>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-12">
            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {roles.map((role, i) => (<SlideIn key={i} direction="up" delay={i * 0.05}><Card accent={ACCENT_PURPLE}><div className="flex items-center justify-between"><div><h4 className="text-sm font-semibold text-navy-900">{role.title}</h4><p className="text-xs text-gray-500 mt-0.5 font-mono">{role.range}</p></div><TargetIcon className="w-4 h-4 text-gray-300" /></div></Card></SlideIn>))}
            </div>
            <div className="lg:col-span-2 space-y-5 flex flex-col justify-center">
              <SlideIn direction="right"><div className="bg-gray-50 rounded-2xl border border-gray-100 p-6"><p className="text-xs font-mono text-gray-400 tracking-widest uppercase mb-2">Expected Salary Range</p><p className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${ACCENT_PURPLE}, ${ACCENT_BLUE})` }}>₹10–20 LPA</p></div></SlideIn>
              <SlideIn direction="right" delay={0.1}><div className="flex items-center gap-3 px-5 py-3.5 rounded-xl border border-gray-200 bg-gray-50"><ShieldIcon className="w-5 h-5 shrink-0" style={{ color: ACCENT_PURPLE }} /><div><p className="text-sm text-navy-900 font-semibold">Only 100% Placement</p><p className="text-xs text-gray-500">No guarantee or assistance</p></div></div></SlideIn>
              <SlideIn direction="right" delay={0.2}><div className="flex items-center gap-3 px-5 py-3.5 rounded-xl border border-gray-200 bg-gray-50"><SparklesIcon className="w-5 h-5 shrink-0" style={{ color: ACCENT_BLUE }} /><div><p className="text-sm text-navy-900 font-semibold">LangChain & OpenAI Certifications</p><p className="text-xs text-gray-500">Industry-recognized AI credentials</p></div></div></SlideIn>
            </div>
          </div>
          <motion.div className="mt-12" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}><DashboardMock /></motion.div>
        </div>
      </section>

      <WaveDivider from="#ffffff" to="#f9fafb" />

      {/* ═══════ FAQ ═══════ */}
      <section className="relative py-16 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal><SectionLabel center>FAQ</SectionLabel><h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy-900 leading-tight text-center">Common{" "}<span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${ACCENT_PURPLE}, ${ACCENT_BLUE})` }}>Questions</span></h2></ScrollReveal>
          <div className="mt-10 bg-white rounded-2xl border border-gray-100 px-6 md:px-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">{faqs.map((faq, i) => (<FAQItem key={i} question={faq.question} answer={faq.answer} isOpen={openFaq === i} onClick={() => setOpenFaq(openFaq === i ? -1 : i)} index={i} />))}</div>
        </div>
      </section>

      {/* ═══════ FINAL CTA ═══════ */}
      <section id="enroll" className="relative py-24 px-6 overflow-hidden" style={{ backgroundColor: DARK_BG }}>
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 50% 50% at 50% 50%, ${ACCENT_PURPLE}0c 0%, transparent 60%)` }} />
        <div className="noise-overlay absolute inset-0 pointer-events-none opacity-[0.02]" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <SectionLabel center light>Get Started</SectionLabel>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mt-4">Ready to{" "}<span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${ACCENT_PURPLE}, ${ACCENT_BLUE})` }}>Build</span>?</h2>
            <p className="mt-5 text-gray-400 text-base max-w-xl mx-auto leading-relaxed">The AI agent revolution is here. 300+ engineers have already upskilled through Linkway — your seat won&apos;t hold itself.</p>
          </motion.div>
          <motion.div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.15 }}>
            <Magnetic><motion.button onClick={openEnquiry} className="group relative px-8 py-4 rounded-xl font-bold text-base overflow-hidden cursor-pointer" style={{ backgroundColor: ACCENT_PURPLE }} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}><span className="relative z-10 flex items-center gap-2 text-white">Enroll Now <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span></motion.button></Magnetic>
            <Magnetic><motion.a href="/contact" className="px-8 py-4 rounded-xl font-semibold text-base border border-white/[0.12] text-white/80 hover:text-white hover:border-white/25 hover:bg-white/[0.04] transition-all duration-300 cursor-pointer" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>Talk to a Counselor</motion.a></Magnetic>
          </motion.div>
          <motion.p className="mt-8 text-xs text-gray-600 font-mono" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>No spam. No hidden fees. Just your future, accelerated.</motion.p>
        </div>
      </section>
    </div>
    </ThemeProvider>
  );
}
