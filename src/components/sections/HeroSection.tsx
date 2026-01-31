"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useSpring,
  type MotionValue,
} from "framer-motion";
import ScrollOdometer from "@/components/animation/ScrollOdometer";
import BorderGlow from "@/components/animation/BorderGlow";
import Button from "@/components/ui/Button";
import { useEnquiryModal } from "@/components/forms/EnquiryModal";

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════════════════════════════
   ROTATING HEADLINES
   ═══════════════════════════════════════════════════════════════════════════ */
const headlines = [
  { accent: "Data Careers", main: "Built Different." },
  { accent: "Real Skills.", main: "Real Results." },
  { accent: "Zero to Hired.", main: "We Make It Happen." },
];

/* ═══════════════════════════════════════════════════════════════════════════
   PARTNER MARQUEE
   ═══════════════════════════════════════════════════════════════════════════ */
const partnerLogos = [
  "Google", "Amazon", "Microsoft", "Deloitte", "Accenture",
  "Capgemini", "Razorpay", "Flipkart", "Infosys", "TCS",
  "Wipro", "IBM", "Oracle", "Fractal", "Tiger Analytics",
];

/* ═══════════════════════════════════════════════════════════════════════════
   AURORA BACKGROUND - Flowing gradient mesh with depth
   ═══════════════════════════════════════════════════════════════════════════ */
function AuroraBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Primary aurora layers */}
      <div className="hero-aurora-1" />
      <div className="hero-aurora-2" />
      <div className="hero-aurora-3" />
      <div className="hero-aurora-4" />

      {/* Radial vignette for depth */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 40%, transparent 30%, rgba(13,27,42,0.7) 100%)",
        }}
      />

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 hero-grid-overlay opacity-[0.015]" />

      {/* Horizon glow line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[1px]"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(245,137,42,0.15), rgba(59,130,246,0.1), transparent)",
        }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   INTERACTIVE PARTICLE CONSTELLATION
   ═══════════════════════════════════════════════════════════════════════════ */
function ParticleConstellation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -999, y: -999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let particles: {
      x: number; y: number; vx: number; vy: number;
      size: number; opacity: number; hue: number; pulse: number; pulseSpeed: number;
    }[] = [];

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const init = () => {
      resize();
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      const count = Math.min(80, Math.floor((w * h) / 12000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        size: Math.random() * 2 + 0.3,
        opacity: Math.random() * 0.35 + 0.05,
        hue: Math.random() > 0.6 ? 28 : Math.random() > 0.5 ? 210 : 160,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.01 + Math.random() * 0.02,
      }));
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        /* Mouse repulsion */
        const dmx = p.x - mx;
        const dmy = p.y - my;
        const distMouse = Math.sqrt(dmx * dmx + dmy * dmy);
        if (distMouse < 150 && distMouse > 0) {
          const force = (150 - distMouse) / 150 * 0.4;
          p.vx += (dmx / distMouse) * force;
          p.vy += (dmy / distMouse) * force;
        }

        /* Friction */
        p.vx *= 0.98;
        p.vy *= 0.98;

        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        /* Pulsing opacity */
        p.pulse += p.pulseSpeed;
        const currentOpacity = p.opacity * (0.6 + 0.4 * Math.sin(p.pulse));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 75%, 60%, ${currentOpacity})`;
        ctx.fill();

        /* Glow effect for larger particles */
        if (p.size > 1.2) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${p.hue}, 80%, 50%, ${currentOpacity * 0.1})`;
          ctx.fill();
        }

        /* Connections */
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const lineOpacity = 0.06 * (1 - dist / 120);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `hsla(${p.hue}, 50%, 55%, ${lineOpacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };

    init();
    draw();
    window.addEventListener("resize", init);
    canvas.addEventListener("mousemove", handleMouseMove);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", init);
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto"
      style={{ opacity: 0.6 }}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SCRAMBLE TEXT
   ═══════════════════════════════════════════════════════════════════════════ */
function ScrambleText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [display, setDisplay] = useState(text);
  const [started, setStarted] = useState(false);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&";

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), delay * 1000);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    let frame = 0;
    const totalFrames = text.length * 3;
    let animId: number;

    const tick = () => {
      const resolved = Math.floor(frame / 3);
      let output = "";
      for (let i = 0; i < text.length; i++) {
        if (text[i] === " ") output += " ";
        else if (i < resolved) output += text[i];
        else output += chars[Math.floor(Math.random() * chars.length)];
      }
      setDisplay(output);
      frame++;
      if (frame <= totalFrames) animId = requestAnimationFrame(tick);
      else setDisplay(text);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, text]);

  return <span className="font-mono">{display}</span>;
}

/* ═══════════════════════════════════════════════════════════════════════════
   STATUS PILL
   ═══════════════════════════════════════════════════════════════════════════ */
function StatusPill() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.7, delay: 0.1 }}
      className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] mb-8 group hover:border-orange-500/20 transition-colors duration-500"
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
      </span>
      <span className="text-[13px] text-gray-300 font-medium tracking-wide">
        New Batch Starting{" "}
        <span className="text-orange-400 font-semibold">Feb 2026</span> — Limited Seats
      </span>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   DATA ORBIT VISUAL - Abstract visualization with floating elements
   ═══════════════════════════════════════════════════════════════════════════ */
function DataOrbitVisual({ mouseX, mouseY }: { mouseX: MotionValue<number>; mouseY: MotionValue<number> }) {
  const parallaxX = useTransform(mouseX, [0, 1], [-15, 15]);
  const parallaxY = useTransform(mouseY, [0, 1], [-10, 10]);
  const springPX = useSpring(parallaxX, { stiffness: 40, damping: 20 });
  const springPY = useSpring(parallaxY, { stiffness: 40, damping: 20 });

  return (
    <motion.div
      className="relative w-[520px] h-[520px]"
      style={{ x: springPX, y: springPY }}
    >
      {/* Outermost ring - dashed */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          border: "1px dashed rgba(255,255,255,0.04)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
      />

      {/* Outer ring with data points */}
      <motion.div
        className="absolute inset-[20px] rounded-full border border-white/[0.04]"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      >
        {[0, 72, 144, 216, 288].map((deg) => (
          <div
            key={deg}
            className="absolute"
            style={{
              top: "50%", left: "50%",
              transform: `rotate(${deg}deg) translateX(220px) translateY(-50%)`,
            }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-orange-500/50 shadow-[0_0_8px_rgba(245,137,42,0.3)]" />
          </div>
        ))}
      </motion.div>

      {/* Middle ring */}
      <motion.div
        className="absolute inset-[70px] rounded-full border border-white/[0.06]"
        animate={{ rotate: -360 }}
        transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
      >
        {[30, 120, 210, 300].map((deg) => (
          <div
            key={deg}
            className="absolute"
            style={{
              top: "50%", left: "50%",
              transform: `rotate(${deg}deg) translateX(170px) translateY(-50%)`,
            }}
          >
            <div className="w-2 h-2 rounded-full bg-blue-500/35 shadow-[0_0_10px_rgba(59,130,246,0.2)]" />
          </div>
        ))}
      </motion.div>

      {/* Inner ring */}
      <motion.div
        className="absolute inset-[130px] rounded-full border border-orange-500/[0.08]"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        {[0, 120, 240].map((deg) => (
          <div
            key={deg}
            className="absolute"
            style={{
              top: "50%", left: "50%",
              transform: `rotate(${deg}deg) translateX(110px) translateY(-50%)`,
            }}
          >
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{
                background: "radial-gradient(circle, rgba(245,137,42,0.7), rgba(245,137,42,0.15))",
                boxShadow: "0 0 12px rgba(245,137,42,0.3)",
              }}
            />
          </div>
        ))}
      </motion.div>

      {/* Center glass circle with gradient */}
      <div className="absolute inset-[120px] rounded-full overflow-hidden">
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: "linear-gradient(135deg, rgba(245,137,42,0.08) 0%, rgba(13,27,42,0.6) 40%, rgba(59,130,246,0.06) 100%)",
            border: "1px solid rgba(245,137,42,0.12)",
          }}
        />
      </div>

      {/* Center core - Student Image */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <motion.div
          className="w-[240px] h-[240px] rounded-full border border-orange-500/20 flex items-center justify-center overflow-hidden"
          style={{
            background: "radial-gradient(circle, rgba(245,137,42,0.06) 0%, rgba(13,27,42,0.8) 70%)",
            boxShadow: "0 0 60px rgba(245,137,42,0.08), inset 0 0 40px rgba(13,27,42,0.5)",
          }}
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <img
            src="/hero-students.png"
            alt="Linkway Learning Students"
            className="w-full h-full object-cover object-top scale-110"
          />
        </motion.div>
      </div>

      {/* Floating course labels with glass effect */}
      {[
        { label: "Data Science", icon: "chart", pos: "top-[12%] left-[-8%]", color: "text-emerald-400", dur: 5 },
        { label: "Business Intel", icon: "grid", pos: "bottom-[18%] left-[-3%]", color: "text-blue-400", dur: 6, delay: 1 },
        { label: "AI / ML", icon: "layers", pos: "top-[45%] right-[-10%]", color: "text-orange-400", dur: 4.5, delay: 2 },
      ].map((item) => (
        <motion.div
          key={item.label}
          className={`absolute ${item.pos} px-3.5 py-2 rounded-xl backdrop-blur-md bg-white/[0.03] border border-white/[0.06] text-[11px] text-gray-400 font-mono shadow-lg shadow-black/10`}
          animate={{ y: [0, item.label === "Business Intel" ? 8 : -6, 0] }}
          transition={{ duration: item.dur, repeat: Infinity, ease: "easeInOut", delay: item.delay || 0 }}
        >
          <span className={`inline-block w-2 h-2 rounded-full mr-2 ${item.color} opacity-60`}
            style={{ boxShadow: `0 0 6px currentColor` }}
          />
          {item.label}
        </motion.div>
      ))}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   FLOATING METRIC CARDS (right side)
   ═══════════════════════════════════════════════════════════════════════════ */
const metricCards = [
  {
    id: "salary",
    label: "Avg. Salary Hike",
    value: "85",
    suffix: "%",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>
    ),
    color: "emerald",
    position: "top-[3%] right-[2%] md:right-[6%]",
    delay: 0.8,
    floatDuration: 7,
  },
  {
    id: "placements",
    label: "Placement Rate",
    value: "96.8",
    suffix: "%",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
    ),
    color: "orange",
    position: "top-[33%] right-[-3%] md:right-[1%]",
    delay: 1.1,
    floatDuration: 8,
  },
  {
    id: "partners",
    label: "Hiring Partners",
    value: "400",
    suffix: "+",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
    ),
    color: "blue",
    position: "bottom-[20%] right-[-1%] md:right-[4%]",
    delay: 1.4,
    floatDuration: 6,
  },
];

function FloatingMetricCard({
  card,
  mouseX,
  mouseY,
}: {
  card: (typeof metricCards)[0];
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}) {
  const x = useTransform(mouseX, [0, 1], [-10, 10]);
  const y = useTransform(mouseY, [0, 1], [-8, 8]);
  const springX = useSpring(x, { stiffness: 40, damping: 20 });
  const springY = useSpring(y, { stiffness: 40, damping: 20 });

  const colorMap: Record<string, { text: string; bg: string; border: string; glow: string }> = {
    orange: { text: "text-orange-400", bg: "from-orange-500/15 to-orange-500/5", border: "border-orange-500/15", glow: "rgba(245,137,42,0.1)" },
    emerald: { text: "text-emerald-400", bg: "from-emerald-500/15 to-emerald-500/5", border: "border-emerald-500/15", glow: "rgba(16,185,129,0.1)" },
    blue: { text: "text-blue-400", bg: "from-blue-500/15 to-blue-500/5", border: "border-blue-500/15", glow: "rgba(59,130,246,0.1)" },
  };
  const c = colorMap[card.color] || colorMap.orange;

  return (
    <motion.div
      className={`absolute ${card.position} z-10 hidden md:block`}
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: card.delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{ x: springX, y: springY }}
    >
      <motion.div
        className={`relative backdrop-blur-xl bg-gradient-to-br ${c.bg} border ${c.border} rounded-2xl px-5 py-4 cursor-default select-none group`}
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: card.floatDuration, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{ scale: 1.05 }}
      >
        {/* Hover glow */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: `radial-gradient(circle at 50% 50%, ${c.glow}, transparent 70%)` }}
        />
        <div className="relative flex items-center gap-3">
          <div className={`${c.text} p-2 rounded-lg bg-white/5`}>{card.icon}</div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">{card.label}</p>
            <div className={`text-2xl font-bold ${c.text} font-mono tabular-nums`}>
              {card.value}<span className="text-lg">{card.suffix}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN HERO SECTION
   ═══════════════════════════════════════════════════════════════════════════ */
export default function HeroSection() {
  const { openEnquiry } = useEnquiryModal();
  const [headlineIndex, setHeadlineIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  /* ── Headline auto-rotation ── */
  useEffect(() => {
    const interval = setInterval(() => {
      setHeadlineIndex((prev) => (prev + 1) % headlines.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  /* ── Mouse tracking for parallax ── */
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      mouseX.set((e.clientX - rect.left) / rect.width);
      mouseY.set((e.clientY - rect.top) / rect.height);
    },
    [mouseX, mouseY]
  );

  /* ── GSAP scroll-driven fade (no pin) ── */
  useGSAP(
    () => {
      const section = sectionRef.current;
      const content = contentRef.current;
      if (!section || !content) return;

      gsap.to(content, {
        y: -40,
        opacity: 0,
        scale: 0.98,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    },
    { scope: sectionRef }
  );

  const { accent, main } = headlines[headlineIndex];

  return (
    <section
      ref={sectionRef}
      className="relative h-screen max-h-screen flex items-center overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* ── Background Layers ── */}
      <AuroraBackground />
      <ParticleConstellation />
      <div className="absolute inset-0 noise-overlay z-[1]" />

      {/* ── Content ── */}
      <div
        ref={contentRef}
        className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 pt-28 md:pt-32 pb-16"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[70vh]">
          {/* ── Left Column: Text ── */}
          <div className="lg:col-span-7 xl:col-span-6">
            <StatusPill />

            {/* Headline with character-level animation */}
            <div className="min-h-[140px] md:min-h-[180px] lg:min-h-[200px] mb-6">
              <AnimatePresence mode="wait">
                <motion.h1
                  key={headlineIndex}
                  className="text-[2.75rem] md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08]"
                  initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -20, filter: "blur(6px)" }}
                  transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <span className="hero-gradient-text block">{accent}</span>
                  <span className="text-white block mt-1">{main}</span>
                </motion.h1>
              </AnimatePresence>
            </div>

            {/* Subtitle */}
            <motion.p
              className="text-base md:text-lg text-gray-400 max-w-xl leading-relaxed mb-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              Stop watching tutorials that lead nowhere. Build real projects
              with mentors from{" "}
              <span className="text-white font-medium">Google, Amazon &amp; Microsoft</span>,
              and walk into interviews with a portfolio that gets you hired.
            </motion.p>

            <motion.p
              className="text-sm md:text-base text-orange-400/80 font-medium tracking-wide mb-10"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <ScrambleText text="8,200+ careers transformed. Yours is next." delay={1.2} />
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row items-start gap-4 mb-14"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7 }}
            >
              <BorderGlow glowColor="orange" glowIntensity="medium">
                <Button variant="primary" size="lg" href="/courses" className="group">
                  Explore Courses
                  <svg className="w-5 h-5 ml-1 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Button>
              </BorderGlow>
              <Button variant="outline" size="lg" onClick={openEnquiry}>
                Book Free Counselling
              </Button>
            </motion.div>

            {/* Trust Stats */}
            <motion.div
              className="flex items-center gap-6 md:gap-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.9 }}
            >
              {[
                { val: 8200, suffix: "+", label: "Careers Launched" },
                { val: 400, suffix: "+", label: "Hiring Partners" },
                { val: 96, suffix: "%", label: "Placement Rate", decimal: ".8" },
              ].map((stat, i) => (
                <div key={i} className="text-left group">
                  <div className="flex items-baseline text-2xl md:text-3xl font-bold text-orange-400 font-mono tabular-nums transition-all duration-300 group-hover:text-orange-300">
                    <ScrollOdometer value={stat.val} duration={2} suffix="" className="text-orange-400" />
                    {stat.decimal && <span className="text-orange-400">{stat.decimal}</span>}
                    <span className="text-orange-400 text-lg ml-0.5">{stat.suffix}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 tracking-wide uppercase">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── Right Column: Visual ── */}
          <div className="lg:col-span-5 xl:col-span-6 relative min-h-[400px] md:min-h-[500px] hidden lg:block">
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <DataOrbitVisual mouseX={mouseX} mouseY={mouseY} />
            </motion.div>

            {metricCards.map((card) => (
              <FloatingMetricCard key={card.id} card={card} mouseX={mouseX} mouseY={mouseY} />
            ))}
          </div>
        </div>

      </div>

    </section>
  );
}
