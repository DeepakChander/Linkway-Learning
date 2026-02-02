"use client";

import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import {
  MonitorPlay,
  BookOpen,
  Award,
  Users,
  MessageCircle,
  CalendarCheck,
  FileText,
  Briefcase,
  ArrowRight,
  Shield,
  Clock,
  Download,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════════ */

const portalFeatures = [
  {
    icon: MonitorPlay,
    title: "Live Interactive Classes",
    description:
      "100% live sessions with small batches for personalized attention and real-time Q&A.",
    color: "#F58220",
  },
  {
    icon: BookOpen,
    title: "Recorded Sessions",
    description:
      "Every session recorded and available on-demand. Lifetime access, learn at your pace.",
    color: "#0077B5",
  },
  {
    icon: FileText,
    title: "Assignments & Projects",
    description:
      "Hands-on assignments and capstone projects built around real industry datasets.",
    color: "#10B981",
  },
  {
    icon: Award,
    title: "Certificates & Credentials",
    description:
      "Earn a Linkway Learning certificate and a Microsoft-recognized credential.",
    color: "#8B5CF6",
  },
  {
    icon: MessageCircle,
    title: "Doubt Resolution",
    description:
      "Dedicated doubt-solving sessions and mentor support. No question unanswered.",
    color: "#EC4899",
  },
  {
    icon: Briefcase,
    title: "Career Services",
    description:
      "Only 100% placement. No guarantee or assistance.",
    color: "#F59E0B",
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Enroll in a Program",
    description: "Choose from Data Analytics, Business Analytics, Data Science & AI, Agentic AI, or Investment Banking.",
    icon: CalendarCheck,
  },
  {
    step: "02",
    title: "Get Portal Access",
    description: "Receive your login credentials via email within 24 hours of enrollment confirmation.",
    icon: Shield,
  },
  {
    step: "03",
    title: "Start Learning",
    description: "Access live classes, recordings, study materials, and assignments — all in one place.",
    icon: MonitorPlay,
  },
  {
    step: "04",
    title: "Get Certified & Placed",
    description: "Earn your certificates and leverage our only 100% placement. No guarantee or assistance to land your dream role.",
    icon: Award,
  },
];

const portalTools = [
  { icon: MonitorPlay, label: "Live Classes" },
  { icon: Download, label: "Resources" },
  { icon: FileText, label: "Assignments" },
  { icon: Clock, label: "Recordings" },
  { icon: Users, label: "Community" },
  { icon: Award, label: "Certificates" },
  { icon: MessageCircle, label: "Mentoring" },
  { icon: Briefcase, label: "Job Board" },
];

/* ═══════════════════════════════════════════════════════════════
   COMPONENTS
   ═══════════════════════════════════════════════════════════════ */

function FeatureCard({
  icon: Icon,
  title,
  description,
  color,
  index,
}: {
  icon: typeof MonitorPlay;
  title: string;
  description: string;
  color: string;
  index: number;
}) {
  return (
    <motion.div
      className="group relative rounded-2xl p-5 md:p-6 transition-all duration-300 bg-white"
      style={{
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        border: "1px solid rgba(0,0,0,0.06)",
      }}
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.07 }}
      whileHover={{
        y: -3,
        boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
      }}
    >
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
        style={{
          background: `${color}12`,
        }}
      >
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <h3 className="text-base font-bold text-gray-900 mb-1.5">{title}</h3>
      <p className="text-sm leading-relaxed text-gray-500">{description}</p>
    </motion.div>
  );
}

function StepCard({
  step,
  title,
  description,
  icon: Icon,
  index,
}: {
  step: string;
  title: string;
  description: string;
  icon: typeof CalendarCheck;
  index: number;
}) {
  return (
    <motion.div
      className="relative flex flex-col items-center text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: 0.1 + index * 0.1 }}
    >
      <div className="relative mb-4">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #F58220, #E06A10)",
            boxShadow: "0 6px 20px rgba(245, 130, 32, 0.3)",
          }}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
        <span
          className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
          style={{
            background: "#0D1B2A",
            border: "2px solid #F58220",
            color: "#F58220",
          }}
        >
          {step}
        </span>
      </div>
      <h4 className="text-sm font-bold text-white mb-1">{title}</h4>
      <p className="text-xs text-white/45 max-w-[200px]">{description}</p>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════ */

export default function StudentPortalContent() {
  const heroRef = useRef<HTMLDivElement>(null);
  const heroInView = useInView(heroRef, { once: true });

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">

      {/* ════════════════════════════════════════════════
          HERO SECTION — Dark Navy
          ════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#0D1B2A] pt-28 pb-14 md:pt-36 md:pb-20">
        {/* Background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute w-[500px] h-[500px] rounded-full"
            style={{
              top: "-20%",
              right: "-8%",
              background: "radial-gradient(circle, rgba(245,130,32,0.08) 0%, transparent 60%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.02) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        <div ref={heroRef} className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.span
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] px-4 py-1.5 rounded-full mb-6"
            style={{
              border: "1px solid rgba(245, 130, 32, 0.4)",
              color: "#F58220",
              background: "rgba(245, 130, 32, 0.1)",
            }}
            initial={{ opacity: 0, y: 15 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F58220" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
              <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
            </svg>
            Student Portal
          </motion.span>

          <motion.h1
            className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-5 text-white"
            initial={{ opacity: 0, y: 25 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Your Learning Hub,{" "}
            <span style={{ color: "#F58220" }}>All in One Place</span>
          </motion.h1>

          <motion.p
            className="text-base md:text-lg text-white/50 max-w-xl mx-auto mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Access live classes, recorded sessions, assignments, certificates, and career support — accessible 24/7.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <a
              href="#"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-white font-bold text-sm"
              style={{
                background: "linear-gradient(135deg, #F58220, #E06A10)",
                boxShadow: "0 8px 30px rgba(245, 130, 32, 0.3)",
              }}
            >
              Login to Portal
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-white/70 font-semibold text-sm transition-colors hover:text-white"
              style={{
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.04)",
              }}
            >
              New Student? Sign Up
            </a>
          </motion.div>

          {/* Tools strip — inline below hero */}
          <motion.div
            className="grid grid-cols-4 lg:grid-cols-8 gap-3 mt-12 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 15 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.45 }}
          >
            {portalTools.map((tool, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <tool.icon className="w-4 h-4 text-orange-400" />
                <span className="text-[10px] font-medium text-white/40 text-center leading-tight">
                  {tool.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          FEATURES GRID — Light Cream
          ════════════════════════════════════════════════ */}
      <section className="py-14 md:py-20 bg-[#f2f1ee]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <motion.span
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] px-4 py-1.5 rounded-full mb-4"
              style={{
                background: "rgba(245, 130, 32, 0.1)",
                color: "#C45D10",
                border: "1px solid rgba(245, 130, 32, 0.2)",
              }}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#C45D10" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              Everything You Need
            </motion.span>
            <motion.h2
              className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              What&apos;s Inside{" "}
              <span style={{ color: "#F58220" }}>Your Portal</span>
            </motion.h2>
            <motion.p
              className="text-sm md:text-base text-gray-500 max-w-lg mx-auto"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              A single platform built to take you from enrollment to employment.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {portalFeatures.map((feature, i) => (
              <FeatureCard key={i} {...feature} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          HOW IT WORKS — Dark Navy
          ════════════════════════════════════════════════ */}
      <section className="py-14 md:py-20 bg-[#0D1B2A] relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-[400px] h-[400px] rounded-full" style={{ bottom: "-15%", right: "-5%", background: "radial-gradient(circle, rgba(245,130,32,0.06) 0%, transparent 60%)" }} />
        </div>
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="text-center mb-10">
            <motion.span
              className="inline-block text-xs font-bold uppercase tracking-[0.15em] px-4 py-1.5 rounded-full mb-4"
              style={{
                border: "1px solid rgba(245, 130, 32, 0.3)",
                color: "#F58220",
                background: "rgba(245, 130, 32, 0.08)",
              }}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Getting Started
            </motion.span>
            <motion.h2
              className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white mb-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              How It{" "}
              <span style={{ color: "#F58220" }}>Works</span>
            </motion.h2>
          </div>

          {/* Steps connector line - desktop */}
          <div className="relative">
            <div className="hidden md:block absolute top-7 left-[14%] right-[14%] h-[2px]" style={{ background: "linear-gradient(90deg, transparent, rgba(245,130,32,0.2) 20%, rgba(245,130,32,0.2) 80%, transparent)" }} />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
              {howItWorks.map((item, i) => (
                <StepCard key={i} {...item} index={i} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          SUPPORT — Light Cream
          ════════════════════════════════════════════════ */}
      <section className="py-10 md:py-14 bg-[#f2f1ee]">
        <div className="max-w-2xl mx-auto px-6">
          <motion.div
            className="rounded-2xl overflow-hidden bg-white"
            style={{
              boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
              border: "1px solid rgba(0,0,0,0.06)",
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {/* Top bar accent */}
            <div className="h-1" style={{ background: "linear-gradient(90deg, #F58220, #E06A10)" }} />

            <div className="p-6 md:p-8">
              <div className="flex items-start gap-4 mb-5">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: "rgba(245, 130, 32, 0.1)" }}
                >
                  <MessageCircle className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-0.5">
                    Need Help?{" "}
                    <span style={{ color: "#F58220" }}>We&apos;re Here</span>
                  </h3>
                  <p className="text-sm text-gray-400">
                    Mon - Sat, 11am - 9pm
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="tel:+919315647113"
                  className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl transition-colors hover:bg-gray-50"
                  style={{ border: "1px solid rgba(0,0,0,0.06)" }}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(245,130,32,0.08)" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F58220" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 11.07 11.07 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 11.07 11.07 0 002.81.7A2 2 0 0122 16.92z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Call Us</div>
                    <div className="text-sm font-semibold text-gray-900">+91-93156-47113</div>
                  </div>
                </a>
                <a
                  href="mailto:support@linkwaylearning.com"
                  className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl transition-colors hover:bg-gray-50"
                  style={{ border: "1px solid rgba(0,0,0,0.06)" }}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(245,130,32,0.08)" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F58220" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Email</div>
                    <div className="text-sm font-semibold text-gray-900">support@linkwaylearning.com</div>
                  </div>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
