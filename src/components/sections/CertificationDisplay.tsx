"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useEnquiryModal } from "@/components/forms/EnquiryModal";
import { trackCtaClick } from "@/lib/analytics";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useMotionValue,
  useSpring,
  type MotionValue,
} from "framer-motion";

/* ═══════════════════════════════════════════════════════════════
   ANIMATED COUNTER
   ═══════════════════════════════════════════════════════════════ */
function AnimatedCounter({
  target,
  suffix = "",
  decimals = 0,
}: {
  target: number;
  suffix?: string;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!isInView) return;
    const duration = 2200;
    const startTime = performance.now();
    function tick(now: number) {
      const p = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      const val = eased * target;
      if (decimals > 0) {
        setDisplay(val.toFixed(decimals));
      } else {
        setDisplay(Math.floor(val).toLocaleString());
      }
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [isInView, target, decimals]);

  return (
    <span ref={ref} className="tabular-nums font-mono">
      {display}
      {suffix}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FEATURE STEPS WITH DASHED CONNECTOR
   ═══════════════════════════════════════════════════════════════ */
const featureSteps = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    title: "Flexible Learning",
    desc: "Learn while working",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
      </svg>
    ),
    title: "Expert Mentors",
    desc: "FAANG professionals",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <path d="M9 15l2 2 4-4" />
      </svg>
    ),
    title: "Certified Program",
    desc: "Microsoft accredited",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    title: "100% Placement",
    desc: "Personalized Path to Employment",
  },
];

function FeatureSteps() {
  const containerRef = useRef<HTMLDivElement>(null);
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [pathD, setPathD] = useState("");

  useEffect(() => {
    const update = () => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const centers = iconRefs.current.map((el) => {
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return {
          x: r.left + r.width / 2 - rect.left,
          y: r.top + r.height / 2 - rect.top,
        };
      }).filter(Boolean) as { x: number; y: number }[];

      if (centers.length < 4) return;

      // Build smooth cubic bezier through all icon centers
      let d = `M ${centers[0].x} ${centers[0].y}`;
      for (let i = 0; i < centers.length - 1; i++) {
        const curr = centers[i];
        const next = centers[i + 1];
        const cpX = (curr.x + next.x) / 2;
        d += ` C ${cpX} ${curr.y}, ${cpX} ${next.y}, ${next.x} ${next.y}`;
      }
      setPathD(d);
    };

    // Delay to let layout settle
    const timer = setTimeout(update, 100);
    window.addEventListener("resize", update);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <motion.div
      ref={containerRef}
      className="relative max-w-3xl mx-auto mb-12 px-4"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: 0.3 }}
    >
      {/* Dashed connector SVG - desktop only */}
      {pathD && (
        <svg className="absolute inset-0 w-full h-full hidden md:block pointer-events-none z-0">
          <path
            d={pathD}
            stroke="#F58220"
            strokeWidth="2.5"
            strokeDasharray="10 8"
            strokeLinecap="round"
            fill="none"
            opacity="0.45"
          />
        </svg>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 relative z-10">
        {featureSteps.map((feature, i) => (
          <motion.div
            key={i}
            className={`flex flex-col items-center text-center ${i % 2 === 1 ? "md:mt-8" : ""}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35 + i * 0.1, duration: 0.5 }}
          >
            <div
              ref={(el) => { iconRefs.current[i] = el; }}
              className="w-14 h-14 rounded-full flex items-center justify-center mb-3 shrink-0"
              style={{
                background: "linear-gradient(135deg, #F58220, #E06A10)",
                boxShadow: "0 8px 24px rgba(245, 130, 32, 0.35)",
                border: "3px solid rgba(245, 130, 32, 0.3)",
              }}
            >
              {feature.icon}
            </div>
            <h4 className="text-sm font-bold text-white mb-0.5">{feature.title}</h4>
            <p className="text-xs text-white/45">{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */
interface CertificationDisplayProps {
  /** Back/left certificate (default: Microsoft) */
  cert1Image?: string;
  cert1Alt?: string;
  cert1Label?: string;
  cert1Sub?: string;
  /** Front/right certificate (default: Simple-Demo) */
  cert2Image?: string;
  cert2Alt?: string;
  cert2Label?: string;
  cert2Sub?: string;
}

export default function CertificationDisplay({
  cert1Image = "/images/certificates/Microsoft.jpeg",
  cert1Alt = "Microsoft Certificate",
  cert1Label = "Microsoft Certified",
  cert1Sub = "Azure AI (AI-900)",
  cert2Image = "/images/certificates/Simple-Demo.jpeg",
  cert2Alt = "Linkway Learning Certificate of Completion",
  cert2Label = "Linkway Learning",
  cert2Sub = "Completion Certificate",
}: CertificationDisplayProps = {}) {
  const { openEnquiry } = useEnquiryModal();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  /* Parallax offsets for floating certificates */
  const cert1Y = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const cert2Y = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const cert1Rotate = useTransform(scrollYProgress, [0, 1], [-6, -2]);
  const cert2Rotate = useTransform(scrollYProgress, [0, 1], [4, 8]);

  /* ── Mouse tilt for the certificate showcase ── */
  const showcaseRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotX = useSpring(useTransform(my, [0, 1], [5, -5]), {
    stiffness: 150,
    damping: 25,
  });
  const rotY = useSpring(useTransform(mx, [0, 1], [-5, 5]), {
    stiffness: 150,
    damping: 25,
  });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const r = showcaseRef.current?.getBoundingClientRect();
      if (!r) return;
      mx.set((e.clientX - r.left) / r.width);
      my.set((e.clientY - r.top) / r.height);
    },
    [mx, my]
  );
  const handleMouseLeave = useCallback(() => {
    mx.set(0.5);
    my.set(0.5);
  }, [mx, my]);

  const stats = [
    { value: 12000, suffix: "+", label: "Certificates Issued" },
    { value: 92, suffix: "%", label: "Career Growth" },
    { value: 400, suffix: "+", label: "Hiring Partners" },
    { value: 25, suffix: "+", label: "Countries" },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #FDF8F3 0%, #FFFFFF 35%, #FDF8F3 70%, #F8F4EF 100%)",
      }}
    >
      {/* ── Decorative background elements ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft gradient orbs */}
        <div
          className="absolute w-[800px] h-[800px] rounded-full"
          style={{
            top: "-15%",
            right: "-10%",
            background:
              "radial-gradient(circle, rgba(245,130,32,0.06) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute w-[600px] h-[600px] rounded-full"
          style={{
            bottom: "-10%",
            left: "-5%",
            background:
              "radial-gradient(circle, rgba(59,130,246,0.04) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />

        {/* Subtle dot grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(13,27,42,0.04) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Decorative lines */}
        <svg
          className="absolute top-0 left-0 w-full h-full opacity-[0.03]"
          preserveAspectRatio="none"
        >
          <line
            x1="20%"
            y1="0"
            x2="20%"
            y2="100%"
            stroke="#0D1B2A"
            strokeWidth="1"
          />
          <line
            x1="80%"
            y1="0"
            x2="80%"
            y2="100%"
            stroke="#0D1B2A"
            strokeWidth="1"
          />
          <line
            x1="0"
            y1="50%"
            x2="100%"
            y2="50%"
            stroke="#0D1B2A"
            strokeWidth="1"
          />
        </svg>
      </div>

      <div className="relative z-10 py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* ════════════════════════════════════════════════
              TOP: Split layout - Text left, Certificates right
              ════════════════════════════════════════════════ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-20 items-center mb-16 sm:mb-20 md:mb-28 lg:mb-36">
            {/* ── LEFT: Copy ── */}
            <div>
              {/* Eyebrow */}
              <motion.div
                className="inline-flex items-center gap-2 sm:gap-2.5 mb-4 sm:mb-7"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span
                  className="w-6 sm:w-8 h-[2px] rounded-full"
                  style={{ background: "#F58220" }}
                />
                <span
                  className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] sm:tracking-[0.18em]"
                  style={{ color: "#C45D10" }}
                >
                  Industry-Recognized Credentials
                </span>
              </motion.div>

              {/* Heading */}
              <motion.h2
                className="text-2xl sm:text-3xl md:text-5xl lg:text-[3.4rem] font-extrabold leading-[1.08] mb-4 sm:mb-6"
                style={{ color: "#0D1B2A" }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.8,
                  delay: 0.1,
                  ease: [0.23, 1, 0.32, 1],
                }}
              >
                Earn Certificates
                <br />
                That{" "}
                <span
                  className="relative inline-block"
                  style={{ color: "#E07420" }}
                >
                  Actually Matter
                  {/* Underline decoration */}
                  <motion.svg
                    className="absolute -bottom-2 left-0 w-full"
                    viewBox="0 0 200 12"
                    fill="none"
                    preserveAspectRatio="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.6 }}
                  >
                    <motion.path
                      d="M2 8 C50 2, 150 2, 198 8"
                      stroke="#F58220"
                      strokeWidth="3"
                      strokeLinecap="round"
                      fill="none"
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.6 }}
                    />
                  </motion.svg>
                </span>
              </motion.h2>

              {/* Description */}
              <motion.p
                className="text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed mb-6 sm:mb-8 md:mb-10 max-w-lg"
                style={{ color: "#4A5568" }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.25 }}
              >
                Not just paper credentials. Our certifications are recognized by{" "}
                <strong style={{ color: "#0D1B2A" }}>400+ hiring partners</strong>{" "}
                and validate the skills that top employers are actively searching for.
              </motion.p>

              {/* Feature pills */}
              <motion.div
                className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8 md:mb-10"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.35 }}
              >
                {[
                  {
                    text: "Verified Digital Credential",
                    svg: (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C45D10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        <path d="M9 12l2 2 4-4" />
                      </svg>
                    ),
                  },
                  {
                    text: "LinkedIn Ready",
                    svg: (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C45D10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
                        <rect x="2" y="9" width="4" height="12" />
                        <circle cx="4" cy="4" r="2" />
                      </svg>
                    ),
                  },
                  {
                    text: "QR Verification",
                    svg: (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C45D10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="7" height="7" />
                        <rect x="14" y="3" width="7" height="7" />
                        <rect x="3" y="14" width="7" height="7" />
                        <rect x="14" y="14" width="3" height="3" />
                        <line x1="21" y1="14" x2="21" y2="14.01" />
                        <line x1="21" y1="21" x2="21" y2="21.01" />
                        <line x1="17" y1="21" x2="17" y2="21.01" />
                      </svg>
                    ),
                  },
                  {
                    text: "Globally Accepted",
                    svg: (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C45D10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="2" y1="12" x2="22" y2="12" />
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                      </svg>
                    ),
                  },
                ].map((pill, i) => (
                  <motion.span
                    key={i}
                    className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full text-sm font-semibold shadow-sm"
                    style={{
                      background: "rgba(245, 130, 32, 0.08)",
                      color: "#92400e",
                      border: "1px solid rgba(245, 130, 32, 0.15)",
                    }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.08, duration: 0.4 }}
                    whileHover={{ scale: 1.04, background: "rgba(245, 130, 32, 0.13)" }}
                  >
                    {pill.svg}
                    {pill.text}
                  </motion.span>
                ))}
              </motion.div>

              {/* Stats row */}
              <motion.div
                className="grid grid-cols-2 sm:grid-cols-4 gap-0 rounded-xl sm:rounded-2xl overflow-hidden"
                style={{
                  background: "#0D1B2A",
                  boxShadow: "0 20px 60px rgba(13, 27, 42, 0.15)",
                }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.4 }}
              >
                {stats.map((stat, i) => (
                  <div
                    key={i}
                    className="relative px-2 sm:px-3 py-4 sm:py-5 md:px-5 md:py-7 text-center"
                    style={{
                      borderRight:
                        i === 0 || i === 2 ? "1px solid rgba(255,255,255,0.06)" : i === 1 ? "none" : "1px solid rgba(255,255,255,0.06)",
                      borderBottom:
                        i < 2 ? "1px solid rgba(255,255,255,0.06)" : "none",
                    }}
                  >
                    <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-orange-400 mb-0.5 sm:mb-1">
                      <AnimatedCounter
                        target={stat.value}
                        suffix={stat.suffix}
                      />
                    </div>
                    <div className="text-[9px] sm:text-[10px] md:text-xs text-white/40 uppercase tracking-wider font-medium">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* ── RIGHT: Certificate Showcase ── */}
            <motion.div
              ref={showcaseRef}
              className="relative flex items-center justify-center min-h-[350px] sm:min-h-[450px] md:min-h-[600px] lg:min-h-[650px]"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                perspective: "1200px",
              }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              {/* Ambient glow behind certificates */}
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <div
                  className="w-[400px] h-[400px] rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(245,130,32,0.1) 0%, rgba(245,130,32,0.03) 40%, transparent 70%)",
                    filter: "blur(40px)",
                  }}
                />
              </div>

              {/* Decorative ring */}
              <motion.div
                className="absolute w-[380px] h-[380px] md:w-[440px] md:h-[440px] rounded-full pointer-events-none"
                style={{
                  border: "1px dashed rgba(245, 130, 32, 0.12)",
                  left: "50%",
                  top: "50%",
                  x: "-50%",
                  y: "-50%",
                }}
                animate={{ rotate: 360 }}
                transition={{
                  duration: 60,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />

              {/* ── Certificate 1 (back, tilted left) ── */}
              <motion.div
                className="absolute w-[200px] sm:w-[240px] md:w-[340px] lg:w-[380px]"
                style={{
                  y: cert1Y,
                  rotate: cert1Rotate,
                  rotateX: rotX,
                  rotateY: rotY,
                  transformStyle: "preserve-3d",
                  left: "5%",
                  top: "15%",
                  zIndex: 1,
                }}
              >
                <motion.div
                  className="relative rounded-xl overflow-hidden"
                  style={{
                    boxShadow:
                      "0 25px 60px rgba(0,0,0,0.12), 0 8px 20px rgba(0,0,0,0.08)",
                  }}
                  initial={{ opacity: 0, x: -80, rotate: -12 }}
                  whileInView={{ opacity: 1, x: 0, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 1,
                    delay: 0.4,
                    ease: [0.23, 1, 0.32, 1],
                  }}
                  whileHover={{ scale: 1.04, zIndex: 10 }}
                >
                  <div className="relative aspect-[4/3] bg-white">
                    <Image
                      src={cert1Image}
                      alt={cert1Alt}
                      fill
                      className="object-contain p-2"
                      sizes="400px"
                    />
                  </div>
                  {/* Label strip */}
                  <div
                    className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 flex items-center gap-1.5 sm:gap-2.5"
                    style={{ background: "#2563eb" }}
                  >
                    {/* Microsoft logo squares */}
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" viewBox="0 0 16 16" fill="white">
                      <rect x="0" y="0" width="7" height="7" />
                      <rect x="9" y="0" width="7" height="7" />
                      <rect x="0" y="9" width="7" height="7" />
                      <rect x="9" y="9" width="7" height="7" />
                    </svg>
                    <span className="text-white text-[10px] sm:text-xs md:text-sm font-bold">
                      {cert1Label}
                    </span>
                    <span className="text-white/60 text-[8px] sm:text-[10px] md:text-xs ml-auto hidden sm:inline">
                      {cert1Sub}
                    </span>
                  </div>
                </motion.div>
              </motion.div>

              {/* ── Certificate 2 (front, tilted right) ── */}
              <motion.div
                className="absolute w-[200px] sm:w-[240px] md:w-[340px] lg:w-[380px]"
                style={{
                  y: cert2Y,
                  rotate: cert2Rotate,
                  rotateX: rotX,
                  rotateY: rotY,
                  transformStyle: "preserve-3d",
                  right: "5%",
                  bottom: "10%",
                  zIndex: 2,
                }}
              >
                <motion.div
                  className="relative rounded-xl overflow-hidden"
                  style={{
                    boxShadow:
                      "0 30px 80px rgba(0,0,0,0.15), 0 10px 25px rgba(0,0,0,0.1)",
                  }}
                  initial={{ opacity: 0, x: 80, rotate: 12 }}
                  whileInView={{ opacity: 1, x: 0, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 1,
                    delay: 0.6,
                    ease: [0.23, 1, 0.32, 1],
                  }}
                  whileHover={{ scale: 1.04, zIndex: 10 }}
                >
                  <div className="relative aspect-[4/3] bg-white">
                    <Image
                      src={cert2Image}
                      alt={cert2Alt}
                      fill
                      className="object-contain p-2"
                      sizes="400px"
                    />
                  </div>
                  {/* Label strip */}
                  <div
                    className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 flex items-center gap-1.5 sm:gap-2.5"
                    style={{ background: "#F58220" }}
                  >
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4 md:w-[18px] md:h-[18px]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="8" r="6" />
                      <path d="M9 14l-2 8 5-3 5 3-2-8" />
                    </svg>
                    <span className="text-white text-[10px] sm:text-xs md:text-sm font-bold">
                      {cert2Label}
                    </span>
                    <span className="text-white/60 text-[8px] sm:text-[10px] md:text-xs ml-auto hidden sm:inline">
                      {cert2Sub}
                    </span>
                  </div>
                </motion.div>
              </motion.div>

              {/* ── Floating badge: "Verified Credential" ── */}
              <motion.div
                className="absolute z-10 hidden sm:block"
                style={{ right: "-2%", top: "10%" }}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <motion.div
                  className="flex items-center gap-2 sm:gap-2.5 px-3 sm:px-5 py-2 sm:py-3 rounded-xl sm:rounded-2xl backdrop-blur-md"
                  style={{
                    background: "rgba(255,255,255,0.92)",
                    boxShadow:
                      "0 12px 40px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.8)",
                    border: "1px solid rgba(245,130,32,0.12)",
                  }}
                  initial={{ opacity: 0, scale: 0.5, x: 30 }}
                  whileInView={{ opacity: 1, scale: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6,
                    delay: 1,
                    type: "spring",
                    stiffness: 200,
                  }}
                >
                  <div
                    className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, #10B981, #059669)" }}
                  >
                    <svg className="w-3.5 h-3.5 sm:w-[18px] sm:h-[18px]" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      <path d="M9 12l2 2 4-4" />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] sm:text-xs font-bold" style={{ color: "#0D1B2A" }}>Verified Credential</span>
                    <span className="text-[8px] sm:text-[10px] font-medium" style={{ color: "#10B981" }}>Digitally Secured</span>
                  </div>
                </motion.div>
              </motion.div>

              {/* ── Floating badge: "LinkedIn Ready" ── */}
              <motion.div
                className="absolute z-10"
                style={{ left: "-2%", bottom: "6%" }}
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                <motion.div
                  className="flex items-center gap-2.5 px-5 py-3 rounded-2xl backdrop-blur-md"
                  style={{
                    background: "rgba(255,255,255,0.92)",
                    boxShadow:
                      "0 12px 40px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.8)",
                    border: "1px solid rgba(0,119,181,0.12)",
                  }}
                  initial={{ opacity: 0, scale: 0.5, x: -30 }}
                  whileInView={{ opacity: 1, scale: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6,
                    delay: 1.2,
                    type: "spring",
                    stiffness: 200,
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, #0077B5, #005a8c)" }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect x="2" y="9" width="4" height="12" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold" style={{ color: "#0D1B2A" }}>LinkedIn Ready</span>
                    <span className="text-[10px] font-medium" style={{ color: "#0077B5" }}>Share Instantly</span>
                  </div>
                </motion.div>
              </motion.div>

              {/* ── Floating badge: "Industry Recognized" ── */}
              <motion.div
                className="absolute z-10 hidden md:block"
                style={{ right: "8%", bottom: "2%" }}
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              >
                <motion.div
                  className="flex items-center gap-2.5 px-5 py-3 rounded-2xl backdrop-blur-md"
                  style={{
                    background: "rgba(255,255,255,0.92)",
                    boxShadow:
                      "0 12px 40px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.8)",
                    border: "1px solid rgba(245,130,32,0.12)",
                  }}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6,
                    delay: 1.4,
                    type: "spring",
                    stiffness: 200,
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, #F58220, #C45D10)" }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="8" r="6" />
                      <path d="M9 14l-2 8 5-3 5 3-2-8" />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold" style={{ color: "#0D1B2A" }}>Industry Recognized</span>
                    <span className="text-[10px] font-medium" style={{ color: "#F58220" }}>400+ Partners</span>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>

          {/* ════════════════════════════════════════════════
              BOTTOM: Transform Your Career Section
              ════════════════════════════════════════════════ */}
          <motion.div
            className="relative rounded-[2rem] overflow-hidden"
            style={{
              background: "#0D1B2A",
              boxShadow: "0 20px 60px rgba(13, 27, 42, 0.25)",
            }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          >
            {/* Background decorative elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute w-[500px] h-[500px] rounded-full" style={{ top: "-20%", right: "-10%", background: "radial-gradient(circle, rgba(245,130,32,0.12) 0%, transparent 60%)" }} />
              <div className="absolute w-[300px] h-[300px] rounded-full" style={{ bottom: "-10%", left: "10%", background: "radial-gradient(circle, rgba(245,130,32,0.08) 0%, transparent 60%)" }} />
              <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
            </div>

            <div className="relative z-10 px-8 py-12 md:px-14 md:py-16">
              {/* Top: Heading + Subtitle */}
              <div className="text-center mb-12">
                <motion.span
                  className="inline-block text-xs font-bold uppercase tracking-[0.15em] px-5 py-2 rounded-full mb-6"
                  style={{
                    border: "1px solid rgba(245, 130, 32, 0.4)",
                    color: "#F58220",
                    background: "rgba(245, 130, 32, 0.1)",
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  Transform Your Career Today
                </motion.span>

                <motion.h2
                  className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-4 text-white"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  Ready to Level Up{" "}
                  <span style={{ color: "#F58220" }}>Your Career?</span>
                </motion.h2>

                <motion.p
                  className="text-base md:text-lg max-w-2xl mx-auto text-white/50"
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  Join professionals who&apos;ve launched their careers with Linkway Learning.
                  Gain job-ready skills and step into high-demand roles today.
                </motion.p>
              </div>

              {/* Feature icons with dashed connector */}
              <FeatureSteps />

              {/* Certificate Includes + CTA */}
              <motion.div
                className="max-w-3xl mx-auto rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-10"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <div className="flex-1">
                  <h3 className="text-base md:text-lg font-bold mb-4 text-left text-white">
                    Certificate Includes
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                    {[
                      {
                        text: "Free career counseling session",
                        svg: <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 11.07 11.07 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 11.07 11.07 0 002.81.7A2 2 0 0122 16.92z" /></svg>,
                      },
                      {
                        text: "Lifetime access to learning materials",
                        svg: <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" /><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" /></svg>,
                      },
                      {
                        text: "20% scholarship for early birds",
                        svg: <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>,
                      },
                      {
                        text: "Alumni network access",
                        svg: <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>,
                      },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2.5">
                        <div className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background: "#F58220" }}>
                          {item.svg}
                        </div>
                        <span className="text-sm font-medium text-white/70">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <motion.button
                  onClick={() => { trackCtaClick("Get Certified", "Certification Section"); openEnquiry(); }}
                  className="px-8 py-3.5 rounded-full text-white font-bold text-sm whitespace-nowrap cursor-pointer"
                  style={{
                    background: "linear-gradient(135deg, #F58220, #E06A10)",
                    boxShadow: "0 8px 24px rgba(245, 130, 32, 0.3)",
                  }}
                  whileHover={{
                    scale: 1.04,
                    boxShadow: "0 12px 32px rgba(245, 130, 32, 0.4)",
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  Get in Touch
                </motion.button>
              </motion.div>
            </div>

            {/* Bottom stats bar */}
            <div
              className="grid grid-cols-2 md:grid-cols-4"
              style={{
                borderTop: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(0,0,0,0.15)",
              }}
            >
              {[
                { value: 4.74, suffix: "", label: "Average Rating", decimals: 2 },
                { value: 12000, suffix: "+", label: "Happy Students", decimals: 0 },
                { value: 400, suffix: "+", label: "Hiring Partners", decimals: 0 },
                { value: 82.7, suffix: "%", label: "Avg Salary Hike", decimals: 1 },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="relative px-4 py-5 md:py-7 text-center"
                  style={{
                    borderRight: i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none",
                  }}
                >
                  <div className="text-xl md:text-2xl lg:text-3xl font-extrabold mb-0.5 text-orange-400">
                    <AnimatedCounter
                      target={stat.value}
                      suffix={stat.suffix}
                      decimals={stat.decimals}
                    />
                  </div>
                  <div className="text-[10px] md:text-xs text-white/35 uppercase tracking-wider font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
