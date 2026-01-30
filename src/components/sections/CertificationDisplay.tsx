"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
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
}: {
  target: number;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const duration = 2200;
    const startTime = performance.now();
    function tick(now: number) {
      const p = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      setCount(Math.floor(eased * target));
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [isInView, target]);

  return (
    <span ref={ref} className="tabular-nums font-mono">
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function CertificationDisplay() {
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
    { value: 5000, suffix: "+", label: "Certificates Issued" },
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

      <div className="relative z-10 py-24 md:py-32 lg:py-40 px-6">
        <div className="max-w-7xl mx-auto">
          {/* ════════════════════════════════════════════════
              TOP: Split layout — Text left, Certificates right
              ════════════════════════════════════════════════ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center mb-28 md:mb-36">
            {/* ── LEFT: Copy ── */}
            <div>
              {/* Eyebrow */}
              <motion.div
                className="inline-flex items-center gap-2.5 mb-7"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span
                  className="w-8 h-[2px] rounded-full"
                  style={{ background: "#F58220" }}
                />
                <span
                  className="text-xs font-bold uppercase tracking-[0.18em]"
                  style={{ color: "#C45D10" }}
                >
                  Industry-Recognized Credentials
                </span>
              </motion.div>

              {/* Heading */}
              <motion.h2
                className="text-4xl md:text-5xl lg:text-[3.4rem] font-extrabold leading-[1.08] mb-6"
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
                className="text-lg md:text-xl leading-relaxed mb-10 max-w-lg"
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
                className="flex flex-wrap gap-3 mb-10"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.35 }}
              >
                {[
                  { icon: "M9 12l2 2 4-4", text: "Verified Digital Credential" },
                  { icon: "M9 12l2 2 4-4", text: "LinkedIn Ready" },
                  { icon: "M9 12l2 2 4-4", text: "QR Verification" },
                  { icon: "M9 12l2 2 4-4", text: "Globally Accepted" },
                ].map((pill, i) => (
                  <motion.span
                    key={i}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
                    style={{
                      background: "rgba(245, 130, 32, 0.07)",
                      color: "#92400e",
                      border: "1px solid rgba(245, 130, 32, 0.12)",
                    }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.08, duration: 0.4 }}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#C45D10"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d={pill.icon} />
                    </svg>
                    {pill.text}
                  </motion.span>
                ))}
              </motion.div>

              {/* Stats row */}
              <motion.div
                className="grid grid-cols-4 gap-0 rounded-2xl overflow-hidden"
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
                    className="relative px-3 py-5 md:px-5 md:py-7 text-center"
                    style={{
                      borderRight:
                        i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none",
                    }}
                  >
                    <div className="text-xl md:text-2xl lg:text-3xl font-bold text-orange-400 mb-1">
                      <AnimatedCounter
                        target={stat.value}
                        suffix={stat.suffix}
                      />
                    </div>
                    <div className="text-[10px] md:text-xs text-white/40 uppercase tracking-wider font-medium">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* ── RIGHT: Certificate Showcase ── */}
            <motion.div
              ref={showcaseRef}
              className="relative flex items-center justify-center min-h-[500px] md:min-h-[600px] lg:min-h-[650px]"
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

              {/* ── Linkway Certificate (back, tilted left) ── */}
              <motion.div
                className="absolute w-[280px] md:w-[340px] lg:w-[380px]"
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
                      src="/images/certificates/linkway-certificate.png"
                      alt="Linkway Learning Certificate of Completion"
                      fill
                      className="object-contain p-2"
                      sizes="400px"
                    />
                  </div>
                  {/* Label strip */}
                  <div
                    className="px-4 py-3 flex items-center gap-2.5"
                    style={{ background: "#F58220" }}
                  >
                    <svg
                      width="18"
                      height="18"
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
                    <span className="text-white text-sm font-bold">
                      Linkway Learning
                    </span>
                    <span className="text-white/60 text-xs ml-auto">
                      Completion Certificate
                    </span>
                  </div>
                </motion.div>
              </motion.div>

              {/* ── Microsoft Certificate (front, tilted right) ── */}
              <motion.div
                className="absolute w-[280px] md:w-[340px] lg:w-[380px]"
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
                      src="/images/certificates/azure-certificate.png"
                      alt="Microsoft Azure AI Fundamentals Certificate"
                      fill
                      className="object-contain p-2"
                      sizes="400px"
                    />
                  </div>
                  {/* Label strip */}
                  <div
                    className="px-4 py-3 flex items-center gap-2.5"
                    style={{ background: "#2563eb" }}
                  >
                    {/* Microsoft logo squares */}
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
                      <rect x="0" y="0" width="7" height="7" />
                      <rect x="9" y="0" width="7" height="7" />
                      <rect x="0" y="9" width="7" height="7" />
                      <rect x="9" y="9" width="7" height="7" />
                    </svg>
                    <span className="text-white text-sm font-bold">
                      Microsoft Certified
                    </span>
                    <span className="text-white/60 text-xs ml-auto">
                      Azure AI (AI-900)
                    </span>
                  </div>
                </motion.div>
              </motion.div>

              {/* ── Floating badge: "Verified" ── */}
              <motion.div
                className="absolute z-10"
                style={{ right: "0%", top: "12%" }}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
              <motion.div
                className="flex items-center gap-2 px-4 py-2.5 rounded-full"
                style={{
                  background: "white",
                  boxShadow:
                    "0 8px 30px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)",
                }}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: 1,
                  type: "spring",
                  stiffness: 200,
                }}
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ background: "#10B981" }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                </div>
                <span
                  className="text-sm font-bold"
                  style={{ color: "#0D1B2A" }}
                >
                  Verified
                </span>
              </motion.div>
              </motion.div>

              {/* ── Floating badge: "LinkedIn Ready" ── */}
              <motion.div
                className="absolute z-10"
                style={{ left: "0%", bottom: "8%" }}
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
              <motion.div
                className="flex items-center gap-2 px-4 py-2.5 rounded-full"
                style={{
                  background: "white",
                  boxShadow:
                    "0 8px 30px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)",
                }}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: 1.2,
                  type: "spring",
                  stiffness: 200,
                }}
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ background: "#0077B5" }}
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="white"
                  >
                    <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                  </svg>
                </div>
                <span
                  className="text-sm font-bold"
                  style={{ color: "#0D1B2A" }}
                >
                  LinkedIn Ready
                </span>
              </motion.div>
              </motion.div>
            </motion.div>
          </div>

          {/* ════════════════════════════════════════════════
              BOTTOM: Two detailed info cards
              ════════════════════════════════════════════════ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Linkway Card */}
            <motion.div
              className="relative rounded-2xl overflow-hidden group"
              style={{
                background: "white",
                border: "1px solid rgba(245, 130, 32, 0.1)",
                boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
              }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
              whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(245,130,32,0.1)" }}
            >
              {/* Top accent */}
              <div
                className="h-1 w-full"
                style={{
                  background:
                    "linear-gradient(90deg, #F58220, #FCBA6A, #F58220)",
                }}
              />

              <div className="p-7 md:p-9">
                {/* Icon + Badge */}
                <div className="flex items-center justify-between mb-6">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(245,130,32,0.1), rgba(245,130,32,0.05))",
                    }}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#E07420"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="8" r="6" />
                      <path d="M9 14l-2 8 5-3 5 3-2-8" />
                    </svg>
                  </div>
                  <span
                    className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full"
                    style={{
                      background: "rgba(245, 130, 32, 0.08)",
                      color: "#C45D10",
                    }}
                  >
                    Completion
                  </span>
                </div>

                <h3
                  className="text-xl md:text-2xl font-bold mb-3"
                  style={{ color: "#0D1B2A" }}
                >
                  Linkway Learning Certificate
                </h3>
                <p className="text-sm leading-relaxed mb-6" style={{ color: "#6B7280" }}>
                  Employer-trusted proof that you completed the full curriculum,
                  hands-on projects, and rigorous assessments.
                </p>

                {/* Feature list */}
                <div className="space-y-3">
                  {[
                    "Verified digital credential with unique ID",
                    "Shareable on LinkedIn & job portals",
                    "Includes project portfolio verification",
                    "QR code for instant employer verification",
                  ].map((f, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div
                        className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5"
                        style={{ background: "rgba(245,130,32,0.1)" }}
                      >
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 12 12"
                          fill="none"
                        >
                          <path
                            d="M2 6l3 3 5-5"
                            stroke="#E07420"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <span
                        className="text-sm"
                        style={{ color: "#4A5568" }}
                      >
                        {f}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Microsoft Azure Card */}
            <motion.div
              className="relative rounded-2xl overflow-hidden group"
              style={{
                background: "white",
                border: "1px solid rgba(59, 130, 246, 0.1)",
                boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
              }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
              whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(59,130,246,0.1)" }}
            >
              {/* Top accent */}
              <div
                className="h-1 w-full"
                style={{
                  background:
                    "linear-gradient(90deg, #3b82f6, #93c5fd, #3b82f6)",
                }}
              />

              <div className="p-7 md:p-9">
                {/* Icon + Badge */}
                <div className="flex items-center justify-between mb-6">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(59,130,246,0.1), rgba(59,130,246,0.05))",
                    }}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 2l7 4v5c0 5.25-3.5 9.74-7 11-3.5-1.26-7-5.75-7-11V6l7-4z" />
                      <path d="M9 12l2 2 4-4" />
                    </svg>
                  </div>
                  <span
                    className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full"
                    style={{
                      background: "rgba(59, 130, 246, 0.08)",
                      color: "#1d4ed8",
                    }}
                  >
                    Microsoft
                  </span>
                </div>

                <h3
                  className="text-xl md:text-2xl font-bold mb-3"
                  style={{ color: "#0D1B2A" }}
                >
                  Microsoft Azure AI Fundamentals
                </h3>
                <p className="text-sm leading-relaxed mb-6" style={{ color: "#6B7280" }}>
                  Globally recognized Microsoft certification that carries weight from
                  startups to Fortune 500 companies.
                </p>

                {/* Feature list */}
                <div className="space-y-3">
                  {[
                    "Official Microsoft certification (AI-900)",
                    "Recognized in 140+ countries worldwide",
                    "Lifetime validity with digital badge",
                    "Backed by Microsoft's global ecosystem",
                  ].map((f, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div
                        className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5"
                        style={{ background: "rgba(59,130,246,0.1)" }}
                      >
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 12 12"
                          fill="none"
                        >
                          <path
                            d="M2 6l3 3 5-5"
                            stroke="#2563eb"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <span
                        className="text-sm"
                        style={{ color: "#4A5568" }}
                      >
                        {f}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* ── Trust bar ── */}
          <motion.div
            className="mt-16 md:mt-20 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p
              className="text-xs uppercase tracking-[0.2em] mb-7 font-medium"
              style={{ color: "#9CA3AF" }}
            >
              Credentials recognized on
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
              {[
                "LinkedIn",
                "Microsoft",
                "Credly",
                "Naukri",
                "Indeed",
              ].map((name, i) => (
                <motion.span
                  key={i}
                  className="text-sm font-semibold tracking-wide"
                  style={{ color: "#CBD5E1" }}
                  whileHover={{ color: "#64748B", scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  {name}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
