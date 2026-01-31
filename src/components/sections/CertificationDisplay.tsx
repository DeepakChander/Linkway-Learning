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
              BOTTOM: Transform Your Career Section
              ════════════════════════════════════════════════ */}
          <motion.div
            className="relative rounded-[2rem] overflow-hidden"
            style={{
              background: "white",
              border: "1px solid #e5e7eb",
              boxShadow: "0 4px 30px rgba(0,0,0,0.04)",
            }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="px-8 py-14 md:px-16 md:py-20 text-center">
              {/* Eyebrow pill */}
              <motion.span
                className="inline-block text-xs font-semibold tracking-[0.08em] px-5 py-2 rounded-full mb-8"
                style={{
                  border: "1.5px solid #F58220",
                  color: "#C45D10",
                  background: "white",
                }}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                Transform Your Career Today
              </motion.span>

              {/* Heading */}
              <motion.h2
                className="text-3xl md:text-4xl lg:text-[2.75rem] font-extrabold leading-tight mb-5"
                style={{ color: "#1a1a2e" }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Ready to Level Up Your Career?
              </motion.h2>

              {/* Subtitle */}
              <motion.p
                className="text-base md:text-lg max-w-2xl mx-auto mb-16"
                style={{ color: "#6B7280" }}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Join professionals who&apos;ve launched their careers with Linkway Learning.
                Gain job-ready skills and step into high-demand roles today!
              </motion.p>

              {/* Four features with connecting dashed line */}
              <motion.div
                className="relative flex flex-wrap justify-center gap-y-10 gap-x-6 md:gap-x-0 mb-16 max-w-4xl mx-auto"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                {/* Curved dashed connecting line (visible on md+) */}
                <svg
                  className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
                  width="70%"
                  height="60"
                  viewBox="0 0 700 60"
                  preserveAspectRatio="none"
                  style={{ overflow: "visible", top: "4px" }}
                >
                  <path
                    d="M0,30 C80,30 100,5 175,5 C250,5 270,55 350,55 C430,55 450,5 525,5 C600,5 620,30 700,30"
                    fill="none"
                    stroke="#F58220"
                    strokeWidth="2.5"
                    strokeDasharray="10 8"
                    strokeLinecap="round"
                  />
                </svg>

                {[
                  {
                    icon: (
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" />
                        <path d="M21 21l-4.35-4.35" />
                      </svg>
                    ),
                    title: "Flexible Learning",
                    desc: "Learn while working",
                  },
                  {
                    icon: (
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
                      </svg>
                    ),
                    title: "Expert Mentors",
                    desc: "FAANG professionals",
                  },
                  {
                    icon: (
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10 9 9 9 8 9" />
                      </svg>
                    ),
                    title: "Certified Program",
                    desc: "Microsoft accredited",
                  },
                  {
                    icon: (
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                    ),
                    title: "100% Placement",
                    desc: "Guaranteed assistance",
                  },
                ].map((feature, i) => (
                  <motion.div
                    key={i}
                    className="relative flex flex-col items-center w-36 md:w-1/4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.35 + i * 0.1, duration: 0.5 }}
                  >
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center mb-4 relative z-10"
                      style={{
                        background: "#F58220",
                        boxShadow: "0 4px 14px rgba(245, 130, 32, 0.25)",
                      }}
                    >
                      {feature.icon}
                    </div>
                    <h4
                      className="text-sm md:text-base font-bold mb-1"
                      style={{ color: "#1a1a2e" }}
                    >
                      {feature.title}
                    </h4>
                    <p className="text-xs" style={{ color: "#9CA3AF" }}>
                      {feature.desc}
                    </p>
                  </motion.div>
                ))}
              </motion.div>

              {/* Certificate Includes card */}
              <motion.div
                className="max-w-2xl mx-auto rounded-2xl p-8 md:p-10 mb-12"
                style={{
                  background: "#F8FAFC",
                  border: "1px solid #e5e7eb",
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <h3
                  className="text-lg md:text-xl font-bold mb-6 text-left"
                  style={{ color: "#1a1a2e" }}
                >
                  Certificate Includes
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                  {[
                    "Free career counseling session",
                    "Lifetime access to learning materials",
                    "20% scholarship for early birds",
                    "Alumni network access",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div
                        className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center"
                        style={{ background: "#F58220" }}
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="none"
                        >
                          <path
                            d="M2 6l3 3 5-5"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <span
                        className="text-sm font-medium text-left"
                        style={{ color: "#374151" }}
                      >
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* CTA Button */}
              <motion.a
                href="/contact"
                className="inline-block px-10 py-4 rounded-full text-white font-bold text-base"
                style={{
                  background: "#1a1a2e",
                  boxShadow: "0 8px 24px rgba(26, 26, 46, 0.2)",
                }}
                whileHover={{
                  scale: 1.04,
                  boxShadow: "0 12px 32px rgba(26, 26, 46, 0.3)",
                }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                Get in Touch
              </motion.a>
            </div>

            {/* Bottom stats bar */}
            <div
              className="grid grid-cols-2 md:grid-cols-4"
              style={{
                background: "#F8FAFC",
                borderTop: "1px solid #e5e7eb",
              }}
            >
              {[
                { value: "4.8", suffix: "+", label: "Average Rating" },
                { value: "18000", suffix: "+", label: "Happy Students" },
                { value: "400", suffix: "+", label: "Hiring Partners" },
                { value: "100", suffix: "%", label: "Salary Hike" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="relative px-4 py-7 md:py-9 text-center"
                  style={{
                    borderRight:
                      i < 3 ? "1px solid #e5e7eb" : "none",
                  }}
                >
                  <div
                    className="text-2xl md:text-3xl lg:text-4xl font-extrabold mb-1"
                    style={{ color: "#1a1a2e" }}
                  >
                    <AnimatedCounter
                      target={Number(stat.value)}
                      suffix={stat.suffix}
                    />
                  </div>
                  <div className="text-[10px] md:text-xs text-gray-400 uppercase tracking-wider font-medium">
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
