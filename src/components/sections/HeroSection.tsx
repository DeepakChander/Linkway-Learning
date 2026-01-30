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
   FLOATING BENTO CARDS DATA
   ═══════════════════════════════════════════════════════════════════════════ */
const bentoCards = [
  {
    id: "salary",
    label: "Avg. Salary Hike",
    value: "85",
    suffix: "%",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>
    ),
    gradient: "from-emerald-500/20 to-emerald-500/5",
    borderColor: "border-emerald-500/20",
    textColor: "text-emerald-400",
    glowRgba: "rgba(16,185,129,0.15)",
    position: "top-[5%] right-[4%] md:right-[8%]",
    delay: 0.3,
    floatDuration: 7,
  },
  {
    id: "placements",
    label: "Placement Rate",
    value: "96.8",
    suffix: "%",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
    ),
    gradient: "from-orange-500/20 to-orange-500/5",
    borderColor: "border-orange-500/20",
    textColor: "text-orange-400",
    glowRgba: "rgba(245,137,42,0.15)",
    position: "top-[35%] right-[-2%] md:right-[2%]",
    delay: 0.6,
    floatDuration: 8,
  },
  {
    id: "partners",
    label: "Hiring Partners",
    value: "400",
    suffix: "+",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
    ),
    gradient: "from-blue-500/20 to-blue-500/5",
    borderColor: "border-blue-500/20",
    textColor: "text-blue-400",
    glowRgba: "rgba(59,130,246,0.15)",
    position: "bottom-[22%] right-[0%] md:right-[6%]",
    delay: 0.9,
    floatDuration: 6,
  },
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
   PARTICLE FIELD - Ambient floating data particles with connections
   ═══════════════════════════════════════════════════════════════════════════ */
function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let particles: {
      x: number; y: number; vx: number; vy: number;
      size: number; opacity: number; hue: number;
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
      const count = Math.min(70, Math.floor((w * h) / 14000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        size: Math.random() * 1.8 + 0.4,
        opacity: Math.random() * 0.4 + 0.08,
        hue: Math.random() > 0.65 ? 28 : 210,
      }));
    };

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 60%, ${p.opacity})`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `hsla(${p.hue}, 60%, 50%, ${0.05 * (1 - dist / 110)})`;
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
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", init);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.55 }}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   GRADIENT MESH BACKGROUND - Animated gradient orbs
   ═══════════════════════════════════════════════════════════════════════════ */
function GradientMesh() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="hero-orb hero-orb-1" />
      <div className="hero-orb hero-orb-2" />
      <div className="hero-orb hero-orb-3" />
      <div className="absolute inset-0 hero-grid-overlay opacity-[0.025]" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   FLOATING BENTO CARD - Glass card with stats, parallax on mouse
   ═══════════════════════════════════════════════════════════════════════════ */
function BentoCard({
  card,
  mouseX,
  mouseY,
}: {
  card: (typeof bentoCards)[0];
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const x = useTransform(mouseX, [0, 1], [-8, 8]);
  const y = useTransform(mouseY, [0, 1], [-6, 6]);
  const springX = useSpring(x, { stiffness: 50, damping: 20 });
  const springY = useSpring(y, { stiffness: 50, damping: 20 });

  return (
    <motion.div
      className={`absolute ${card.position} z-10 hidden md:block`}
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.8,
        delay: card.delay + 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      style={{ x: springX, y: springY }}
    >
      <motion.div
        className={`relative backdrop-blur-xl bg-gradient-to-br ${card.gradient} border ${card.borderColor} rounded-2xl px-5 py-4 cursor-default select-none`}
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: card.floatDuration, repeat: Infinity, ease: "easeInOut" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.05 }}
      >
        {/* Hover glow */}
        <div
          className={`absolute inset-0 rounded-2xl transition-opacity duration-500 ${isHovered ? "opacity-100" : "opacity-0"}`}
          style={{ background: `radial-gradient(circle at 50% 50%, ${card.glowRgba}, transparent 70%)` }}
        />
        <div className="relative flex items-center gap-3">
          <div className={`${card.textColor} p-2 rounded-lg bg-white/5`}>{card.icon}</div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">{card.label}</p>
            <div className={`text-2xl font-bold ${card.textColor} font-mono tabular-nums`}>
              {card.value}<span className="text-lg">{card.suffix}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SCRAMBLE TEXT - Cipher-decode inline effect
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
   STATUS PILL - Animated batch notification badge
   ═══════════════════════════════════════════════════════════════════════════ */
function StatusPill() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.7, delay: 0.1 }}
      className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] mb-8"
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
   HERO VISUAL - Abstract orbital data constellation with course labels
   ═══════════════════════════════════════════════════════════════════════════ */
function HeroVisual() {
  return (
    <div className="relative w-[480px] h-[480px]">
      {/* Outer ring */}
      <motion.div
        className="absolute inset-0 rounded-full border border-white/[0.04]"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      >
        {[0, 90, 180, 270].map((deg) => (
          <div
            key={deg}
            className="absolute w-1.5 h-1.5 rounded-full bg-orange-500/40"
            style={{
              top: "50%", left: "50%",
              transform: `rotate(${deg}deg) translateX(210px) translateY(-50%)`,
            }}
          />
        ))}
      </motion.div>

      {/* Middle ring */}
      <motion.div
        className="absolute inset-[50px] rounded-full border border-white/[0.06]"
        animate={{ rotate: -360 }}
        transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
      >
        {[45, 135, 225, 315].map((deg) => (
          <div
            key={deg}
            className="absolute w-2 h-2 rounded-full bg-blue-500/30"
            style={{
              top: "50%", left: "50%",
              transform: `rotate(${deg}deg) translateX(160px) translateY(-50%)`,
            }}
          />
        ))}
      </motion.div>

      {/* Inner ring */}
      <motion.div
        className="absolute inset-[110px] rounded-full border border-orange-500/[0.08]"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        {[0, 120, 240].map((deg) => (
          <div
            key={deg}
            className="absolute w-2.5 h-2.5 rounded-full"
            style={{
              top: "50%", left: "50%",
              transform: `rotate(${deg}deg) translateX(100px) translateY(-50%)`,
              background: "radial-gradient(circle, rgba(245,137,42,0.6), rgba(245,137,42,0.1))",
            }}
          />
        ))}
      </motion.div>

      {/* Center background circle */}
      <div className="absolute inset-[100px] rounded-full bg-gradient-to-br from-orange-500/10 via-slate-800/50 to-blue-500/10 border border-orange-500/15" />

      {/* Center core - Student Image */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <motion.div
          className="w-[280px] h-[280px] rounded-full border-2 border-orange-500/30 flex items-center justify-center overflow-hidden"
          style={{ background: "radial-gradient(circle, rgba(245,137,42,0.08) 0%, rgba(15,23,42,0.6) 70%)" }}
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <img
            src="/hero-students.png"
            alt="Linkway Learning Students"
            className="w-full h-full object-cover object-top scale-110"
          />
        </motion.div>
      </div>

      {/* Floating course labels */}
      <motion.div
        className="absolute top-[15%] left-[-10%] px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[11px] text-gray-400 font-mono"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg className="inline w-3 h-3 mr-1.5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /></svg>
        Data Science
      </motion.div>

      <motion.div
        className="absolute bottom-[20%] left-[-5%] px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[11px] text-gray-400 font-mono"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <svg className="inline w-3 h-3 mr-1.5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 9h6v6H9z" /></svg>
        Business Intel
      </motion.div>

      <motion.div
        className="absolute top-[50%] right-[-12%] px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[11px] text-gray-400 font-mono"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      >
        <svg className="inline w-3 h-3 mr-1.5 text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>
        AI / ML
      </motion.div>
    </div>
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

  /* ── GSAP scroll-driven pin + fade ── */
  useGSAP(
    () => {
      const section = sectionRef.current;
      const content = contentRef.current;
      if (!section || !content) return;

      const pinTrigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "+=80%",
        pin: true,
        pinSpacing: true,
        id: "hero-pin",
      });

      gsap.to(content, {
        y: -80,
        opacity: 0,
        scale: 0.97,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "+=10% top",
          end: "+=80%",
          scrub: 1,
        },
      });

      return () => { pinTrigger.kill(); };
    },
    { scope: sectionRef }
  );

  const { accent, main } = headlines[headlineIndex];

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* ── Background Layers ── */}
      <GradientMesh />
      <ParticleField />
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

            {/* Headline */}
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
                <div key={i} className="text-left">
                  <div className="flex items-baseline text-2xl md:text-3xl font-bold text-orange-400 font-mono tabular-nums">
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
              <HeroVisual />
            </motion.div>

            {bentoCards.map((card) => (
              <BentoCard key={card.id} card={card} mouseX={mouseX} mouseY={mouseY} />
            ))}
          </div>
        </div>

        {/* ── Bottom: Partner Marquee ── */}
        <motion.div
          className="mt-8 md:mt-12 border-t border-white/[0.06] pt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          <p className="text-[11px] uppercase tracking-[0.2em] text-gray-500 mb-4 text-center">
            Our alumni work at
          </p>
          <div className="relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-navy-900 to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-navy-900 to-transparent z-10" />
            <div className="flex animate-marquee whitespace-nowrap">
              {[...partnerLogos, ...partnerLogos].map((name, i) => (
                <span
                  key={i}
                  className="mx-8 text-sm text-gray-500/60 font-medium tracking-wide hover:text-gray-300 transition-colors duration-300 cursor-default select-none"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Scroll Indicator ── */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500">Scroll</span>
        <motion.div
          className="w-[1px] h-8 bg-gradient-to-b from-orange-500/60 to-transparent"
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "top" }}
        />
      </motion.div>
    </section>
  );
}
