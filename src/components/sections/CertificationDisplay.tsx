"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useInView, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

/* ─── Animated Counter ─── */
function AnimatedCounter({ target, suffix = "", prefix = "" }: { target: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const startTime = performance.now();

    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      start = Math.floor(eased * target);
      setCount(start);
      if (progress < 1) requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }, [isInView, target]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

/* ─── 3D Tilt Card with Mouse-Following Glow ─── */
function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [8, -8]), { stiffness: 200, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-8, 8]), { stiffness: 200, damping: 30 });

  const handleMouse = useCallback((e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  }, [mouseX, mouseY]);

  const handleLeave = useCallback(() => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: "1200px",
      }}
      className={className}
    >
      {/* Mouse-following glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0"
        style={{
          background: useTransform(
            [mouseX, mouseY],
            ([x, y]) => `radial-gradient(600px circle at ${(x as number) * 100}% ${(y as number) * 100}%, rgba(245, 130, 32, 0.12), transparent 50%)`
          ),
        }}
      />
      {children}
    </motion.div>
  );
}

/* ─── Floating Particles ─── */
function FloatingParticles() {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 8 + 6,
    delay: Math.random() * 4,
    opacity: Math.random() * 0.3 + 0.1,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.id % 3 === 0
              ? "rgba(245, 130, 32, 0.4)"
              : p.id % 3 === 1
                ? "rgba(148, 179, 215, 0.3)"
                : "rgba(255, 255, 255, 0.2)",
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, p.id % 2 === 0 ? 15 : -15, 0],
            opacity: [p.opacity, p.opacity * 1.5, p.opacity],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ─── SVG Icons ─── */
const CertificateIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16v12H4z" />
    <path d="M12 12a3 3 0 1 0 0-4 3 3 0 0 0 0 4z" />
    <path d="M8 16l-2 6 4-2 4 2-2-6" />
    <path d="M16 16l-2 6 4-2" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l7 4v5c0 5.25-3.5 9.74-7 11-3.5-1.26-7-5.75-7-11V6l7-4z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

const StarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const GlobeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const BriefcaseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
  </svg>
);

const TrendingUpIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const VerifiedIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

/* ─── Certificate Card ─── */
function CertificateCard({
  imageSrc,
  imageAlt,
  title,
  subtitle,
  description,
  features,
  accentColor,
  delay,
}: {
  imageSrc: string;
  imageAlt: string;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  accentColor: "orange" | "blue";
  delay: number;
}) {
  const isOrange = accentColor === "orange";
  const glowColor = isOrange ? "rgba(245, 130, 32, 0.15)" : "rgba(59, 130, 246, 0.15)";
  const borderColor = isOrange ? "rgba(245, 130, 32, 0.25)" : "rgba(59, 130, 246, 0.25)";
  const badgeBg = isOrange
    ? "linear-gradient(135deg, #F58220, #E07420)"
    : "linear-gradient(135deg, #3b82f6, #2563eb)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay, ease: [0.23, 1, 0.32, 1] }}
      className="group"
    >
      <TiltCard className="relative">
        <div
          className="relative rounded-2xl overflow-hidden transition-all duration-500"
          style={{
            background: "rgba(13, 27, 42, 0.7)",
            backdropFilter: "blur(20px)",
            border: `1px solid ${borderColor}`,
            boxShadow: `0 0 40px ${glowColor}, 0 20px 60px rgba(0,0,0,0.3)`,
          }}
        >
          {/* Animated top border line */}
          <motion.div
            className="absolute top-0 left-0 h-[2px] z-10"
            style={{
              background: isOrange
                ? "linear-gradient(90deg, transparent, #F58220, #FCBA6A, #F58220, transparent)"
                : "linear-gradient(90deg, transparent, #3b82f6, #93c5fd, #3b82f6, transparent)",
            }}
            initial={{ width: "0%" }}
            whileInView={{ width: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: delay + 0.3, ease: "easeOut" }}
          />

          {/* Certificate Image Area */}
          <div className="relative p-8 pb-4">
            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden" style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.08) 100%)",
            }}>
              {/* Subtle grid pattern behind certificate */}
              <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)
                  `,
                  backgroundSize: "20px 20px",
                }}
              />

              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                className="object-contain p-4 relative z-10 transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 560px"
              />

              {/* Corner accents */}
              <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 rounded-tl-sm opacity-30 transition-opacity duration-300 group-hover:opacity-60"
                style={{ borderColor: isOrange ? "#F58220" : "#3b82f6" }} />
              <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 rounded-tr-sm opacity-30 transition-opacity duration-300 group-hover:opacity-60"
                style={{ borderColor: isOrange ? "#F58220" : "#3b82f6" }} />
              <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 rounded-bl-sm opacity-30 transition-opacity duration-300 group-hover:opacity-60"
                style={{ borderColor: isOrange ? "#F58220" : "#3b82f6" }} />
              <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 rounded-br-sm opacity-30 transition-opacity duration-300 group-hover:opacity-60"
                style={{ borderColor: isOrange ? "#F58220" : "#3b82f6" }} />
            </div>
          </div>

          {/* Content Area */}
          <div className="px-8 pb-8 pt-2">
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-semibold mb-4"
              style={{ background: badgeBg, boxShadow: `0 4px 20px ${glowColor}` }}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: delay + 0.5, duration: 0.5, type: "spring" }}
            >
              {isOrange ? <CertificateIcon /> : <ShieldIcon />}
              <span>{subtitle}</span>
            </motion.div>

            {/* Title */}
            <h3 className="text-xl md:text-2xl font-bold text-white mb-3 leading-tight">
              {title}
            </h3>

            {/* Description */}
            <p className="text-white/50 text-sm leading-relaxed mb-5">
              {description}
            </p>

            {/* Features */}
            <div className="space-y-2.5">
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-3 text-sm"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: delay + 0.6 + i * 0.1, duration: 0.4 }}
                >
                  <span
                    className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{
                      background: isOrange ? "rgba(245,130,32,0.15)" : "rgba(59,130,246,0.15)",
                      color: isOrange ? "#F99B3D" : "#60a5fa",
                    }}
                  >
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  <span className="text-white/70">{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
}

/* ─── Main Component ─── */
export default function CertificationDisplay() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  const stats = [
    { value: 5000, suffix: "+", label: "Certificates Issued", icon: <CertificateIcon /> },
    { value: 92, suffix: "%", label: "Career Advancement", icon: <TrendingUpIcon /> },
    { value: 150, suffix: "+", label: "Hiring Partners", icon: <BriefcaseIcon /> },
    { value: 25, suffix: "+", label: "Countries", icon: <GlobeIcon /> },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ backgroundColor: "#0D1B2A" }}
    >
      {/* ─── Animated Background ─── */}
      <motion.div className="absolute inset-0" style={{ y: backgroundY }}>
        {/* Gradient orbs */}
        <div
          className="absolute top-[-20%] left-[-10%] w-[700px] h-[700px] rounded-full opacity-40"
          style={{
            background: "radial-gradient(circle, rgba(245, 130, 32, 0.08) 0%, transparent 70%)",
            filter: "blur(80px)",
            animation: "hero-orb-float-1 14s ease-in-out infinite",
          }}
        />
        <div
          className="absolute bottom-[-15%] right-[-5%] w-[600px] h-[600px] rounded-full opacity-40"
          style={{
            background: "radial-gradient(circle, rgba(59, 130, 246, 0.06) 0%, transparent 70%)",
            filter: "blur(80px)",
            animation: "hero-orb-float-2 18s ease-in-out infinite",
          }}
        />
        <div
          className="absolute top-[30%] left-[60%] w-[400px] h-[400px] rounded-full opacity-30"
          style={{
            background: "radial-gradient(circle, rgba(245, 130, 32, 0.05) 0%, transparent 70%)",
            filter: "blur(60px)",
            animation: "hero-orb-float-3 12s ease-in-out infinite",
          }}
        />

        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </motion.div>

      {/* Floating particles */}
      <FloatingParticles />

      {/* Noise overlay */}
      <div className="noise-overlay absolute inset-0 pointer-events-none z-[1]" />

      {/* ─── Content ─── */}
      <div className="relative z-10 py-28 md:py-36 lg:py-44 px-6">
        <div className="max-w-7xl mx-auto">

          {/* ─── Section Header ─── */}
          <div className="text-center mb-20 md:mb-28">
            {/* Eyebrow */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8"
              style={{
                background: "rgba(245, 130, 32, 0.08)",
                border: "1px solid rgba(245, 130, 32, 0.15)",
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-orange-400 flex items-center gap-1.5">
                <VerifiedIcon />
              </span>
              <span className="text-orange-300/80 text-xs font-semibold uppercase tracking-[0.15em]">
                Industry-Recognized Credentials
              </span>
            </motion.div>

            {/* Main heading */}
            <motion.h2
              className="text-4xl md:text-5xl lg:text-6xl xl:text-[4rem] font-bold leading-[1.1] mb-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
            >
              <span className="text-white">Earn Certificates That</span>
              <br />
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: "linear-gradient(135deg, #F99B3D 0%, #F58220 40%, #FCBA6A 70%, #F58220 100%)",
                  backgroundSize: "200% 200%",
                  animation: "hero-gradient-shift 6s ease-in-out infinite",
                }}
              >
                Open Real Doors
              </span>
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              className="text-white/40 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.25 }}
            >
              Not just a piece of paper. Our certifications are recognized by top employers
              and validate the skills that actually matter in the industry.
            </motion.p>
          </div>

          {/* ─── Certificate Cards ─── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-24 md:mb-32">
            <CertificateCard
              imageSrc="/images/certificates/linkway-certificate.png"
              imageAlt="Linkway Learning Certificate of Completion"
              title="Linkway Learning Certificate of Completion"
              subtitle="Completion Certificate"
              description="Employer-trusted proof that you completed the full curriculum, hands-on projects, and rigorous assessments."
              features={[
                "Verified digital credential with unique ID",
                "Shareable on LinkedIn and job portals",
                "Includes project portfolio verification",
                "QR code for instant employer verification",
              ]}
              accentColor="orange"
              delay={0.1}
            />

            <CertificateCard
              imageSrc="/images/certificates/azure-certificate.png"
              imageAlt="Microsoft Azure AI Fundamentals Certificate"
              title="Microsoft Certified: Azure AI Fundamentals"
              subtitle="Microsoft Certification"
              description="Globally recognized Microsoft certification that carries weight from startups to Fortune 500 companies."
              features={[
                "Official Microsoft certification (AI-900)",
                "Recognized in 140+ countries worldwide",
                "Lifetime validity with digital badge",
                "Backed by Microsoft's global ecosystem",
              ]}
              accentColor="blue"
              delay={0.25}
            />
          </div>

          {/* ─── Stats Section ─── */}
          <motion.div
            className="relative rounded-2xl overflow-hidden"
            style={{
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              backdropFilter: "blur(12px)",
            }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            {/* Top gradient line */}
            <div className="absolute top-0 left-[10%] right-[10%] h-px"
              style={{ background: "linear-gradient(90deg, transparent, rgba(245,130,32,0.3), transparent)" }} />

            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/5">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  className="relative px-6 py-10 md:py-14 text-center group/stat"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }}
                >
                  {/* Hover glow */}
                  <div className="absolute inset-0 opacity-0 group-hover/stat:opacity-100 transition-opacity duration-500"
                    style={{ background: "radial-gradient(circle at center, rgba(245,130,32,0.04) 0%, transparent 70%)" }} />

                  <div className="relative z-10">
                    <div className="text-orange-400/60 mb-3 flex justify-center">
                      {stat.icon}
                    </div>
                    <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 stat-glow">
                      <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                    </div>
                    <div className="text-white/35 text-xs md:text-sm font-medium uppercase tracking-wider">
                      {stat.label}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ─── Trust Indicators ─── */}
          <motion.div
            className="mt-20 md:mt-24 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <p className="text-white/25 text-xs uppercase tracking-[0.2em] mb-8 font-medium">
              Trusted & verified by leading platforms
            </p>

            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
              {/* LinkedIn SVG */}
              <motion.div
                className="opacity-25 hover:opacity-60 transition-opacity duration-300 text-white"
                whileHover={{ scale: 1.05 }}
              >
                <svg width="100" height="28" viewBox="0 0 100 28" fill="currentColor">
                  <path d="M4.5 9.5H0V28h4.5V9.5zM2.25 0C.95 0 0 1 0 2.3s.95 2.3 2.25 2.3S4.5 3.6 4.5 2.3 3.55 0 2.25 0zM17.5 9.5c-2.5 0-4 1.3-4.5 2.5V9.5H8.5V28H13V18c0-2.5 1.5-3.5 3-3.5s2.5 1.5 2.5 3.5V28H23V17c0-4.5-2.5-7.5-5.5-7.5z" />
                  <text x="28" y="20" fontSize="13" fontWeight="600" fontFamily="Inter, sans-serif">LinkedIn</text>
                </svg>
              </motion.div>

              {/* Microsoft SVG */}
              <motion.div
                className="opacity-25 hover:opacity-60 transition-opacity duration-300 text-white"
                whileHover={{ scale: 1.05 }}
              >
                <svg width="110" height="24" viewBox="0 0 110 24" fill="currentColor">
                  <rect x="0" y="0" width="10" height="10" opacity="0.8" />
                  <rect x="12" y="0" width="10" height="10" opacity="0.8" />
                  <rect x="0" y="12" width="10" height="10" opacity="0.8" />
                  <rect x="12" y="12" width="10" height="10" opacity="0.8" />
                  <text x="28" y="17" fontSize="13" fontWeight="500" fontFamily="Inter, sans-serif">Microsoft</text>
                </svg>
              </motion.div>

              {/* Credly SVG */}
              <motion.div
                className="opacity-25 hover:opacity-60 transition-opacity duration-300 text-white"
                whileHover={{ scale: 1.05 }}
              >
                <svg width="85" height="24" viewBox="0 0 85 24" fill="currentColor">
                  <circle cx="10" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
                  <path d="M7 12l2 2 4-4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  <text x="24" y="17" fontSize="13" fontWeight="500" fontFamily="Inter, sans-serif">Credly</text>
                </svg>
              </motion.div>

              {/* Naukri SVG */}
              <motion.div
                className="opacity-25 hover:opacity-60 transition-opacity duration-300 text-white"
                whileHover={{ scale: 1.05 }}
              >
                <svg width="80" height="24" viewBox="0 0 80 24" fill="currentColor">
                  <text x="0" y="18" fontSize="14" fontWeight="600" fontFamily="Inter, sans-serif">naukri</text>
                </svg>
              </motion.div>

              {/* Indeed SVG */}
              <motion.div
                className="opacity-25 hover:opacity-60 transition-opacity duration-300 text-white"
                whileHover={{ scale: 1.05 }}
              >
                <svg width="80" height="24" viewBox="0 0 80 24" fill="currentColor">
                  <text x="0" y="18" fontSize="14" fontWeight="600" fontFamily="Inter, sans-serif">indeed</text>
                </svg>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
