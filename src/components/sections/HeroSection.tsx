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
  { accent: "Learn Today.", main: "Lead Tomorrow." },
  { accent: "Dream Big.", main: "Start Here." },
  { accent: "Your Career.", main: "Our Mission." },
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
      className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] mb-6 group hover:border-orange-500/20 transition-colors duration-500"
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
      </span>
      <span className="text-[13px] text-gray-300 font-medium tracking-wide">
        Enrollments Open — <span className="text-orange-400 font-semibold">Limited Seats Left</span>
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
      className="relative w-[580px] h-[580px]"
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

      {/* Outer ring with tech logos */}
      <motion.div
        className="absolute inset-[20px] rounded-full border border-white/[0.04]"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      >
        {[
          { deg: 0, label: "Python", icon: (
            <svg viewBox="0 0 256 255" className="w-5 h-5"><path d="M126.916.072c-64.832 0-60.784 28.115-60.784 28.115l.072 29.128h61.868v8.745H41.631S.145 61.355.145 126.77c0 65.417 36.21 63.097 36.21 63.097h21.61v-30.356s-1.165-36.21 35.632-36.21h61.362s34.475.557 34.475-33.319V33.97S194.67.072 126.916.072zM92.802 19.66a11.12 11.12 0 0 1 11.13 11.13 11.12 11.12 0 0 1-11.13 11.13 11.12 11.12 0 0 1-11.13-11.13 11.12 11.12 0 0 1 11.13-11.13z" fill="#366A96"/><path d="M128.757 254.126c64.832 0 60.784-28.115 60.784-28.115l-.072-29.127H127.6v-8.745h86.441s41.486 4.705 41.486-60.712c0-65.416-36.21-63.096-36.21-63.096h-21.61v30.355s1.165 36.21-35.632 36.21h-61.362s-34.475-.557-34.475 33.32v56.013s-5.235 33.897 62.519 33.897zm34.114-19.586a11.12 11.12 0 0 1-11.13-11.13 11.12 11.12 0 0 1 11.13-11.131 11.12 11.12 0 0 1 11.13 11.13 11.12 11.12 0 0 1-11.13 11.13z" fill="#FFC331"/></svg>
          )},
          { deg: 72, label: "SQL", icon: (
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="#00BCF2" strokeWidth="1.5"><ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v6c0 1.657 3.582 3 8 3s8-1.343 8-3V6"/><path d="M4 12v6c0 1.657 3.582 3 8 3s8-1.343 8-3v-6"/></svg>
          )},
          { deg: 144, label: "Tableau", icon: (
            <svg viewBox="0 0 24 24" className="w-5 h-5"><path d="M11.654 0v2.311h-1.15v1.26h1.15V5.88h1.26V3.57h1.15V2.311h-1.15V0h-1.26zm-4.15 3.45v2.842H5.19v1.26h2.313v2.842h1.26V7.552H11.077V6.292H8.764V3.45h-1.26zm8.462 0v2.842h-2.313v1.26h2.313v2.842h1.26V7.552h2.313V6.292H17.226V3.45h-1.26zM11.654 6.932v2.842h-1.15v1.26h1.15v2.842h1.26v-2.842h1.15v-1.26h-1.15V6.932h-1.26zM3.49 10.383v2.842H1.178v1.26H3.49v2.842h1.26v-2.842h2.313v-1.26H4.75v-2.842h-1.26zm16.583 0v2.842h-2.313v1.26h2.313v2.842h1.26v-2.842H23.646v-1.26h-2.313v-2.842h-1.26zm-8.42 3.45v2.842h-1.15v1.26h1.15v2.842h1.26v-2.842h1.15v-1.26h-1.15v-2.842h-1.26zm-4.15 3.45v2.842H5.19v1.26h2.313V24h1.26v-2.614h2.313v-1.26H8.764v-2.842h-1.26zm8.462 0v2.842h-2.313v1.26h2.313V24h1.26v-2.614h2.313v-1.26H17.226v-2.842h-1.26z" fill="#E97627"/></svg>
          )},
          { deg: 216, label: "Excel", icon: (
            <svg viewBox="0 0 24 24" className="w-4 h-4"><path d="M23 1.5H8.5v5H0L14.5 22.5 23 1.5z" fill="none"/><path d="M14.22 1H1v22h22V1H14.22zM7.532 17.56L5.25 13.74l-2.282 3.82H1.16l3.182-5.06L1.342 7.56h1.808l2.1 3.54 2.1-3.54h1.808l-3 4.94 3.182 5.06H7.532zM22 21H10V15h12v6zm0-8H10V7h12v6z" fill="#1D6F42"/></svg>
          )},
          { deg: 288, label: "Power BI", icon: (
            <svg viewBox="0 0 24 24" className="w-4 h-4"><path d="M13 4h2v16h-2V4zm-4 4h2v12H9V8zm8-2h2v14h-2V6zM5 12h2v8H5v-8z" fill="#F2C811"/></svg>
          )},
        ].map((item) => (
          <div
            key={item.deg}
            className="absolute"
            style={{
              top: "50%", left: "50%",
              transform: `rotate(${item.deg}deg) translateX(250px) translateY(-50%)`,
            }}
          >
            <div
              className="w-9 h-9 rounded-full bg-[#0D1B2A]/80 backdrop-blur-sm border border-white/[0.1] flex items-center justify-center shadow-[0_0_12px_rgba(245,137,42,0.15)]"
              style={{ transform: `rotate(-${item.deg}deg)` }}
            >
              {item.icon}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Middle ring with tech logos */}
      <motion.div
        className="absolute inset-[80px] rounded-full border border-white/[0.06]"
        animate={{ rotate: -360 }}
        transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
      >
        {[
          { deg: 30, label: "TensorFlow", icon: (
            <svg viewBox="0 0 256 274" className="w-4 h-4"><path d="M145.726 42.065v42.07l36.419 21.03V63.094l-36.42-21.03zM109.292 63.094v42.07l36.434 21.03V84.124l-36.434-21.03zm36.434 63.1l-36.434-21.03v126.19l36.434 21.03v-84.12l36.42 21.03v-42.07l-36.42-21.03z" fill="#FF6F00"/><path d="M145.726 0L36.42 63.094v126.19l36.436 21.03v-84.12l72.87 42.06V42.065L182.146 63.1v126.19l36.434-21.03V42.065L145.726 0z" fill="#FF9800"/></svg>
          )},
          { deg: 120, label: "Spark", icon: (
            <svg viewBox="0 0 24 24" className="w-4 h-4"><path d="M12 2L1 21h22L12 2zm0 4l7.53 13H4.47L12 6z" fill="#E25A1C"/><path d="M12 6l7.53 13H4.47L12 6z" fill="#E25A1C" opacity="0.6"/></svg>
          )},
          { deg: 210, label: "R", icon: (
            <svg viewBox="0 0 724 561" className="w-4 h-4"><path d="M361.453 485.937C162.329 485.937.906 377.828.906 244.469.906 111.109 162.329 3 361.453 3 560.578 3 722 111.109 722 244.469c0 133.359-161.422 241.468-360.547 241.468z" fill="#2266B8"/><path d="M361.453 460.937C175.39 460.937 25.906 364.065 25.906 244.469 25.906 124.872 175.39 28 361.453 28 547.516 28 697 124.872 697 244.469 697 364.065 547.516 460.937 361.453 460.937z" fill="#A4A4A4" opacity="0.4"/><path d="M350 175h100c50 0 80 25 80 65s-30 65-80 65h-60v80h-40V175zm40 100h55c25 0 42-12 42-35s-17-35-42-35h-55v70z" fill="white"/></svg>
          )},
          { deg: 300, label: "AWS", icon: (
            <svg viewBox="0 0 24 24" className="w-4 h-4"><path d="M6.763 10.036a4.589 4.589 0 0 0 .084.87c.06.27.141.554.252.83a.37.37 0 0 1 .06.18c0 .08-.048.16-.152.24l-.504.336a.384.384 0 0 1-.204.072c-.08 0-.16-.04-.24-.112a2.474 2.474 0 0 1-.288-.376 6.076 6.076 0 0 1-.248-.472c-.624.736-1.408 1.104-2.352 1.104-.672 0-1.208-.192-1.6-.576-.392-.384-.592-.896-.592-1.536 0-.68.24-1.232.728-1.648.488-.416 1.136-.624 1.96-.624.272 0 .552.024.84.064.288.04.584.104.896.176v-.584c0-.608-.128-1.032-.384-1.28-.264-.248-.712-.368-1.352-.368-.288 0-.584.032-.888.104-.304.072-.6.16-.888.264a2.4 2.4 0 0 1-.272.104.474.474 0 0 1-.12.016c-.168 0-.252-.12-.252-.368v-.392c0-.192.024-.336.08-.424a.83.83 0 0 1 .328-.24 6.759 6.759 0 0 1 1.032-.368A4.505 4.505 0 0 1 5.28 5.2c.856 0 1.48.192 1.888.584.4.392.608.984.608 1.784v2.468h-.013z" fill="#F90"/><path d="M18.636 12.593c-.168 0-.28-.016-.344-.056-.064-.032-.12-.112-.168-.248l-1.872-6.16a1.525 1.525 0 0 1-.072-.36c0-.144.072-.224.216-.224h.784c.176 0 .296.016.352.056.064.032.112.112.16.248l1.336 5.264 1.24-5.264c.04-.144.088-.216.152-.248a.675.675 0 0 1 .36-.056h.64c.176 0 .296.016.36.056.064.032.12.112.152.248l1.256 5.328 1.376-5.328c.048-.144.104-.216.16-.248a.617.617 0 0 1 .352-.056h.744c.144 0 .224.072.224.224 0 .04-.008.08-.016.128a1.236 1.236 0 0 1-.056.24l-1.92 6.16c-.048.144-.104.216-.168.248a.64.64 0 0 1-.344.056h-.688c-.176 0-.296-.016-.36-.056-.064-.04-.12-.112-.152-.256l-1.232-5.12-1.224 5.112c-.04.144-.088.216-.152.256-.064.04-.192.056-.36.056h-.688z" fill="#F90"/><path d="M12.14 12.768c-.416 0-.832-.048-1.232-.144-.4-.096-.712-.2-.928-.312-.136-.072-.232-.152-.264-.224a.567.567 0 0 1-.048-.224v-.408c0-.248.096-.368.28-.368.072 0 .144.016.216.04.072.024.184.08.312.136.424.192.884.288 1.376.288.496 0 .888-.088 1.168-.264.28-.176.424-.432.424-.76a.822.822 0 0 0-.232-.6c-.16-.168-.456-.312-.888-.448l-1.272-.4c-.648-.2-1.128-.504-1.424-.904-.296-.392-.448-.832-.448-1.304 0-.376.08-.712.248-1 .168-.288.392-.536.672-.736.28-.2.6-.352.968-.456.368-.104.76-.152 1.168-.152.2 0 .416.008.624.032.216.024.416.064.608.104.184.048.36.096.52.152.16.056.288.112.376.168a.84.84 0 0 1 .264.224.477.477 0 0 1 .072.272v.376c0 .248-.096.376-.28.376-.096 0-.256-.048-.472-.144-.72-.328-1.528-.328-2.016-.248-.36.064-.648.2-.848.4a.892.892 0 0 0-.296.672c0 .264.088.48.272.648.184.168.52.336.992.48l1.24.4c.64.2 1.104.488 1.376.856.272.368.4.784.4 1.24 0 .384-.08.736-.232 1.04-.16.304-.376.568-.656.784-.28.216-.616.384-1.008.496-.408.12-.832.176-1.288.176z" fill="#F90"/></svg>
          )},
        ].map((item) => (
          <div
            key={item.deg}
            className="absolute"
            style={{
              top: "50%", left: "50%",
              transform: `rotate(${item.deg}deg) translateX(190px) translateY(-50%)`,
            }}
          >
            <div
              className="w-8 h-8 rounded-full bg-[#0D1B2A]/80 backdrop-blur-sm border border-white/[0.08] flex items-center justify-center shadow-[0_0_10px_rgba(59,130,246,0.15)]"
              style={{ transform: `rotate(${item.deg}deg)` }}
            >
              {item.icon}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Inner ring with tech logos */}
      <motion.div
        className="absolute inset-[150px] rounded-full border border-orange-500/[0.08]"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        {[
          { deg: 0, label: "Pandas", icon: (
            <svg viewBox="0 0 24 24" className="w-4 h-4"><path d="M16.922 0h2.166v5.063h-2.166V0zm0 7.078h2.166v5.07h-2.166v-5.07zM4.912 7.078h2.166v5.07H4.912v-5.07zm0 7.085h2.166v5.063H4.912v-5.063zM4.912 0h2.166v5.063H4.912V0zm5.993 3.538h2.166v5.07h-2.166v-5.07zm0 7.085h2.166v2.532h-2.166v-2.532zm0 4.548h2.166v5.07h-2.166v-5.07zm5.993 1.54h2.166v5.063h-2.166v-5.063z" fill="#150458"/><path d="M16.922 0h2.166v5.063h-2.166V0zm0 7.078h2.166v5.07h-2.166v-5.07zM4.912 7.078h2.166v5.07H4.912v-5.07zm0 7.085h2.166v5.063H4.912v-5.063zM4.912 0h2.166v5.063H4.912V0zm5.993 3.538h2.166v5.07h-2.166v-5.07zm0 7.085h2.166v2.532h-2.166v-2.532zm0 4.548h2.166v5.07h-2.166v-5.07zm5.993 1.54h2.166v5.063h-2.166v-5.063z" fill="white" opacity="0.8"/></svg>
          )},
          { deg: 120, label: "Scikit", icon: (
            <svg viewBox="0 0 24 24" className="w-4 h-4"><circle cx="12" cy="12" r="10" fill="none" stroke="#F89939" strokeWidth="1.5"/><circle cx="8" cy="10" r="2.5" fill="#3499CD"/><circle cx="16" cy="10" r="2.5" fill="#F89939"/><circle cx="12" cy="16" r="2.5" fill="#3499CD"/></svg>
          )},
          { deg: 240, label: "NumPy", icon: (
            <svg viewBox="0 0 24 24" className="w-4 h-4"><path d="M12.001 2L4 6.5v11l8.001 4.5L20 17.5v-11L12.001 2z" fill="none" stroke="#4DABCF" strokeWidth="1.2"/><path d="M12 2l8 4.5-8 4.5-8-4.5L12 2z" fill="#4DABCF" opacity="0.7"/><path d="M12 11v11l8-4.5V6.5L12 11z" fill="#137DC5" opacity="0.8"/><path d="M12 11v11l-8-4.5V6.5L12 11z" fill="#4DABCF" opacity="0.5"/></svg>
          )},
        ].map((item) => (
          <div
            key={item.deg}
            className="absolute"
            style={{
              top: "50%", left: "50%",
              transform: `rotate(${item.deg}deg) translateX(125px) translateY(-50%)`,
            }}
          >
            <div
              className="w-7 h-7 rounded-full bg-[#0D1B2A]/80 backdrop-blur-sm border border-orange-500/[0.15] flex items-center justify-center shadow-[0_0_10px_rgba(245,137,42,0.2)]"
              style={{ transform: `rotate(-${item.deg}deg)` }}
            >
              {item.icon}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Center glass circle with gradient */}
      <div className="absolute inset-[140px] rounded-full overflow-hidden">
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
          className="w-[360px] h-[360px] rounded-full border border-orange-500/20 flex items-center justify-center overflow-hidden"
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
        { label: "Industry Ready", icon: "grid", pos: "bottom-[18%] left-[-3%]", color: "text-blue-400", dur: 6, delay: 1 },
        { label: "AI / ML", icon: "layers", pos: "top-[55%] left-[-10%]", color: "text-orange-400", dur: 4.5, delay: 2 },
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
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>
    ),
    color: "emerald",
    position: "top-[3%] right-[2%] md:right-[6%]",
    delay: 0.8,
    floatDuration: 7,
  },
  {
    id: "placements",
    label: "Only 100% Placement",
    value: "96.8",
    suffix: "%",
    icon: (
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
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
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
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
        className={`relative backdrop-blur-xl bg-gradient-to-br ${c.bg} border ${c.border} rounded-lg px-2 py-1.5 cursor-default select-none group`}
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: card.floatDuration, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{ scale: 1.05 }}
      >
        {/* Hover glow */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: `radial-gradient(circle at 50% 50%, ${c.glow}, transparent 70%)` }}
        />
        <div className="relative flex items-center gap-1.5">
          <div className={`${c.text} p-1 rounded-md bg-white/5`}>{card.icon}</div>
          <div>
            <p className="text-[7px] uppercase tracking-wider text-gray-400 font-medium">{card.label}</p>
            <div className={`text-sm font-bold ${c.text} font-mono tabular-nums`}>
              {card.value}<span className="text-[10px]">{card.suffix}</span>
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
      className="relative min-h-screen flex items-center overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* ── Background Layers ── */}
      <AuroraBackground />
      <ParticleConstellation />
      <div className="absolute inset-0 noise-overlay z-[1]" />

      {/* ── Content ── */}
      <div
        ref={contentRef}
        className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 pt-40 md:pt-44 pb-16 md:pb-24"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* ── Left Column: Text ── */}
          <div className="lg:col-span-7 xl:col-span-6">
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
                  <span className="text-white block whitespace-nowrap">{accent}</span>
                  <span className="hero-gradient-text block mt-1 whitespace-nowrap">{main}</span>
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
              className="text-sm md:text-base text-orange-400/80 font-medium tracking-wide mb-10 font-[family-name:var(--font-poppins)]"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {"8,200+ careers transformed. Yours is next.".split(" ").map((word, i) => (
                <motion.span
                  key={i}
                  className="inline-block mr-[0.3em]"
                  initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{
                    duration: 0.5,
                    delay: 1.2 + i * 0.12,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                >
                  {word}
                </motion.span>
              ))}
            </motion.p>

            <StatusPill />

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row items-start gap-4 mb-8"
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
                { val: 100, suffix: "%", label: "Only 100% Placement" },
              ].map((stat, i) => (
                <div key={i} className="text-left group">
                  <div className="flex items-baseline text-2xl md:text-3xl font-bold text-orange-400 font-[family-name:var(--font-poppins)] tabular-nums transition-all duration-300 group-hover:text-orange-300">
                    <ScrollOdometer value={stat.val} duration={2} suffix="" className="text-orange-400" />
                    <span className="text-orange-400 text-lg ml-0.5">{stat.suffix}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 tracking-wide uppercase font-[family-name:var(--font-poppins)]">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── Right Column: Visual ── */}
          <div className="lg:col-span-5 xl:col-span-6 relative hidden lg:flex items-center justify-center">
            <motion.div
              className="relative flex items-center justify-center"
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
