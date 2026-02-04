"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ScrollReveal from "@/components/animation/ScrollReveal";
import { BorderGlow, CharacterSplit, CrossFlicker } from "@/components/animation";
import SpringReveal from "@/components/animation/SpringReveal";
import ScrollOdometer from "@/components/animation/ScrollOdometer";
import SectionHeading from "@/components/ui/SectionHeading";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { AccordionItem } from "@/components/ui/Accordion";
import { ThemeProvider } from "@/lib/theme";
import { Mail, Phone, MapPin, MessageCircle, Clock, Users, Briefcase, CheckCircle, Building2, Calendar } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    course: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("https://formspree.io/f/xpwdzgkl", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        setError("Something went wrong. Please try again or contact us via WhatsApp.");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const steps = [
    {
      step: "01",
      title: "Drop Us a Message",
      desc: "Fill out the form or ping us on WhatsApp - whatever's easier.",
    },
    {
      step: "02",
      title: "We'll Call You Back",
      desc: "A counselor will help you figure out which program and batch fits best.",
    },
    {
      step: "03",
      title: "You're In",
      desc: "Pick a payment plan, get onboarded, and start building your data career.",
    },
  ];

  const stats = [
    { value: 8200, suffix: "+", label: "Careers Launched", icon: Users },
    { value: 100, suffix: "%", label: "Placement Rate", icon: CheckCircle },
    { value: 400, suffix: "+", label: "Hiring Partners", icon: Briefcase },
    { value: 24, suffix: "hr", label: "Response Time", icon: Clock },
  ];

  const contactFaqs = [
    {
      q: "How do I enroll in a program?",
      a: "Simply fill out the contact form above or reach out via WhatsApp. Our counselor will guide you through the enrollment process, help you choose the right program, and explain the payment options available.",
    },
    {
      q: "Is placement really guaranteed?",
      a: "Yes, we offer 100% placement assistance. Our dedicated placement team works with 400+ hiring partners and provides personalized support including resume reviews, mock interviews, and direct referrals until you land your desired role.",
    },
    {
      q: "What are the payment options?",
      a: "We offer flexible payment options including no-cost EMI, part payments, and financing options to make the program affordable for everyone. Our counselor will explain all available options during your consultation.",
    },
    {
      q: "How long do the programs take?",
      a: "Our programs range from 3 to 6 months depending on the track you choose. Data Analytics and Business Analytics are typically 3-4 months, while Data Science and AI programs run for 5-6 months.",
    },
    {
      q: "Can I attend classes while working?",
      a: "Absolutely! All our classes are scheduled on weekends and evenings to accommodate working professionals. Plus, every session is recorded so you never miss anything important.",
    },
    {
      q: "What happens after I submit this form?",
      a: "You'll receive an email confirmation immediately. Within 24 hours, one of our counselors will call you to understand your goals, answer questions, and recommend the best program for your career transition.",
    },
  ];

  const inputClass =
    "w-full bg-white/[0.04] border border-white/[0.1] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 transition-colors";

  return (
    <div className="min-h-screen bg-navy-900 text-white">
      {/* ═══════════════════════════════════════════════════════════
          HERO SECTION - Premium Modern Design with Advanced Animations
          ═══════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-6 pt-32 pb-16 text-center overflow-hidden bg-navy-900">
        {/* Animated Mesh Gradient Background */}
        <div className="contact-hero-mesh" />

        {/* Floating Glass Orbs */}
        <div className="contact-hero-orb contact-hero-orb-1" />
        <div className="contact-hero-orb contact-hero-orb-2" />
        <div className="contact-hero-orb contact-hero-orb-3" />

        {/* Morphing Blob */}
        <div className="contact-hero-blob top-[20%] left-[10%]" />
        <div className="contact-hero-blob bottom-[10%] right-[5%]" style={{ animationDelay: '-6s' }} />

        {/* Animated Grid */}
        <div className="contact-hero-grid" />

        {/* Pulsing Rings */}
        <div className="contact-hero-ring contact-hero-ring-1" />
        <div className="contact-hero-ring contact-hero-ring-2" />
        <div className="contact-hero-ring contact-hero-ring-3" />

        {/* Particle System */}
        <div className="contact-hero-particles">
          <div className="contact-particle" style={{ left: '5%' }} />
          <div className="contact-particle" />
          <div className="contact-particle" />
          <div className="contact-particle" />
          <div className="contact-particle" />
          <div className="contact-particle" />
        </div>

        {/* Scan Line */}
        <div className="contact-hero-scanline" />

        {/* Noise Texture */}
        <div className="contact-hero-noise" />

        {/* Floating Geometric Elements */}
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 50, repeat: Infinity, ease: "linear" },
            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute top-[15%] right-[12%] w-20 h-20 border border-orange-500/20 rounded-2xl backdrop-blur-sm bg-orange-500/[0.02] pointer-events-none"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[18%] left-[10%] w-14 h-14 border border-blue-400/15 rounded-xl backdrop-blur-sm bg-blue-400/[0.02] pointer-events-none"
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute top-[45%] left-[5%] w-8 h-8 border border-purple-400/15 rotate-45 pointer-events-none"
        />

        {/* Animated Dots */}
        <motion.div
          animate={{
            y: [-30, 30, -30],
            x: [-15, 15, -15],
            opacity: [0.3, 0.8, 0.3]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[30%] right-[18%] w-3 h-3 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 shadow-lg shadow-orange-500/30 pointer-events-none"
        />
        <motion.div
          animate={{
            y: [20, -20, 20],
            opacity: [0.2, 0.6, 0.2]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[25%] left-[20%] w-2 h-2 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg shadow-blue-500/20 pointer-events-none"
        />
        <motion.div
          animate={{
            y: [-15, 25, -15],
            x: [10, -10, 10],
            scale: [1, 1.3, 1]
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[60%] right-[8%] w-2.5 h-2.5 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 shadow-lg shadow-purple-500/20 pointer-events-none"
        />

        {/* Glowing Lines */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute top-[20%] left-0 w-[30%] h-[1px] bg-gradient-to-r from-transparent via-orange-500/30 to-transparent origin-left"
        />
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="absolute bottom-[25%] right-0 w-[25%] h-[1px] bg-gradient-to-l from-transparent via-blue-500/20 to-transparent origin-right"
        />

        {/* Corner Decorations */}
        <motion.div
          animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute top-16 left-16 pointer-events-none select-none"
        >
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="text-orange-500/30">
            <path d="M20 0v40M0 20h40" stroke="currentColor" strokeWidth="1"/>
            <circle cx="20" cy="20" r="4" fill="currentColor" opacity="0.5"/>
          </svg>
        </motion.div>
        <motion.div
          animate={{ opacity: [0.15, 0.4, 0.15], rotate: 45 }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute bottom-16 right-16 pointer-events-none select-none"
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="text-blue-400/25">
            <rect x="4" y="4" width="24" height="24" stroke="currentColor" strokeWidth="1"/>
            <rect x="10" y="10" width="12" height="12" stroke="currentColor" strokeWidth="1"/>
          </svg>
        </motion.div>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto relative z-10">
          {/* Animated Badge */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="contact-hero-badge"
          >
            <div className="inline-flex items-center gap-3 px-5 py-2 mb-8 rounded-full border border-orange-500/30 bg-gradient-to-r from-orange-500/[0.08] to-orange-500/[0.02] backdrop-blur-md shadow-lg shadow-orange-500/10">
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="relative"
              >
                <span className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-orange-500/50 animate-ping" />
                <span className="relative w-2.5 h-2.5 rounded-full bg-orange-500 block" />
              </motion.div>
              <span className="text-orange-400 text-sm font-semibold tracking-[0.2em] uppercase">
                Start Your Journey
              </span>
              <motion.svg
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-orange-400"
              >
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </motion.svg>
            </div>
          </motion.div>

          {/* Main Heading with Staggered Animation */}
          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight"
            >
              <span className="block text-white mb-2">Let's Build</span>
              <span className="block">
                <span className="contact-hero-title-gradient">Your Future</span>
                <motion.span
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                  className="inline-block ml-2"
                >
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="inline-block -mt-2">
                    <motion.path
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.5, delay: 1.4, ease: "easeInOut" }}
                      d="M24 4L28 14L38 18L28 22L24 32L20 22L10 18L20 14L24 4Z"
                      stroke="#F58220"
                      strokeWidth="2"
                      fill="rgba(245, 130, 32, 0.2)"
                    />
                  </svg>
                </motion.span>
              </span>
              <span className="block text-white mt-2">
                <span className="text-gray-400 font-normal">Together</span>
              </span>
            </motion.h1>
          </div>

          {/* Subtitle with Fade Up */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 max-w-2xl mx-auto"
          >
            <p className="text-gray-400 text-lg md:text-xl leading-relaxed">
              Whether you have a question or you're ready to transform your career —
              <span className="text-white font-medium"> we're here to help</span>.
              No pressure, just{" "}
              <span className="relative inline-block">
                <span className="text-orange-400">honest guidance</span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6, delay: 1.4 }}
                  className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-orange-500 to-orange-300 origin-left"
                />
              </span>
              .
            </p>
          </motion.div>

          {/* Animated Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-12 flex flex-wrap justify-center gap-8 md:gap-12"
          >
            {[
              {
                value: "8,200+",
                label: "Students Placed",
                icon: (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                )
              },
              {
                value: "100%",
                label: "Placement Rate",
                icon: (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                )
              },
              {
                value: "24hr",
                label: "Response Time",
                icon: (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                )
              },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.2 + i * 0.15 }}
                className="text-center group"
              >
                <div className="flex items-center justify-center gap-2 text-2xl md:text-3xl font-bold text-white group-hover:text-orange-400 transition-colors duration-300">
                  <span className="text-orange-400 group-hover:text-orange-300 transition-colors">{stat.icon}</span>
                  {stat.value}
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.3, ease: [0.22, 1, 0.36, 1] }}
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.a
              href="#contact-form"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="group relative inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10">Get Started Today</span>
              <motion.svg
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-5 h-5 relative z-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </motion.svg>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.a>

            <motion.a
              href="https://wa.me/919315647113"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="group inline-flex items-center gap-2 px-8 py-4 border border-white/20 text-white font-semibold rounded-xl backdrop-blur-sm bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/30 transition-all duration-300"
            >
              <svg className="w-5 h-5 text-green-400 group-hover:text-green-300 transition-colors" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <span>Chat on WhatsApp</span>
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          TRUST INDICATORS STRIP
          ═══════════════════════════════════════════════════════════ */}
      <section className="relative py-12 px-6 bg-navy-900 border-y border-white/[0.05]">
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "radial-gradient(circle, rgba(245,130,32,0.03) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }} />

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, i) => (
              <SpringReveal key={i} delay={0.1 * i} distance={30} damping={14}>
                <div className="group relative rounded-xl p-5 bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] hover:border-orange-500/20 transition-all duration-500 text-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />

                  <div className="relative z-10">
                    <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                      <stat.icon className="w-5 h-5 text-orange-400" />
                    </div>
                    <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                      <ScrollOdometer value={stat.value} suffix={stat.suffix} duration={1.5} delay={0.3 + i * 0.15} />
                    </div>
                    <p className="text-gray-500 text-xs tracking-wider uppercase">{stat.label}</p>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-orange-500 to-orange-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-b-xl" />
                </div>
              </SpringReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          CONTACT FORM SECTION - Split Layout
          ═══════════════════════════════════════════════════════════ */}
      <section id="contact-form" className="py-20 px-6 bg-navy-900 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left Side - Content */}
            <div className="lg:pr-8">
              <SpringReveal distance={40} damping={14}>
                <div className="flex items-center gap-3 mb-4">
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="h-[2px] w-12 bg-gradient-to-r from-orange-500 to-orange-300 origin-left"
                  />
                  <span className="text-orange-400 text-xs font-bold tracking-[0.2em] uppercase">Ready to Start?</span>
                </div>
              </SpringReveal>

              <SpringReveal distance={50} damping={12} delay={0.1}>
                <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
                  Your Career Upgrade{" "}
                  <span className="relative">
                    <span className="text-orange-400">Starts Here</span>
                    <svg className="absolute -bottom-1 left-0 w-full" height="6" viewBox="0 0 200 6" fill="none">
                      <path d="M1 4C30 1.5 60 0.5 100 2.5C140 4.5 170 3.5 199 1.5" stroke="#F58220" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                  </span>
                </h2>
              </SpringReveal>

              <SpringReveal distance={30} damping={14} delay={0.2}>
                <p className="text-gray-400 text-base leading-relaxed mb-8">
                  Fill out the form and our team will reach out within 24 hours. We'll help you choose the right program, understand the curriculum, and answer any questions you have.
                </p>
              </SpringReveal>

              <SpringReveal distance={30} damping={14} delay={0.3}>
                <div className="space-y-4 mb-8">
                  {[
                    { icon: CheckCircle, text: "Free career counseling session" },
                    { icon: CheckCircle, text: "No obligation to enroll" },
                    { icon: CheckCircle, text: "Personalized program recommendation" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-gray-300">
                      <item.icon className="w-5 h-5 text-orange-400 shrink-0" />
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </SpringReveal>

              {/* Decorative element */}
              <SpringReveal distance={20} damping={14} delay={0.4}>
                <div className="hidden lg:block relative mt-12 p-6 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0">
                      <MessageCircle className="w-6 h-6 text-orange-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium mb-1">Prefer WhatsApp?</p>
                      <p className="text-gray-400 text-sm mb-3">Get instant replies on WhatsApp</p>
                      <a
                        href="https://wa.me/919315647113"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors text-sm font-medium"
                      >
                        Message us now
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </SpringReveal>
            </div>

            {/* Right Side - Form */}
            <div>
              <ScrollReveal>
                {submitted ? (
                  <Card variant="accent" className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/10 flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-green-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Inquiry Sent!
                    </h3>
                    <p className="text-gray-400">
                      Thank you, {form.name}. Our team will get back to you within 24 hours.
                    </p>
                  </Card>
                ) : (
                  <BorderGlow glowColor="orange" glowIntensity="subtle">
                    <Card className="p-6 md:p-8">
                      <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                          <label htmlFor="contact-name" className="block text-sm font-medium text-gray-300 mb-2">
                            Full Name
                          </label>
                          <input
                            id="contact-name"
                            type="text"
                            name="name"
                            required
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Your full name"
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label htmlFor="contact-email" className="block text-sm font-medium text-gray-300 mb-2">
                            Email
                          </label>
                          <input
                            id="contact-email"
                            type="email"
                            name="email"
                            required
                            value={form.email}
                            onChange={handleChange}
                            placeholder="you@email.com"
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label htmlFor="contact-phone" className="block text-sm font-medium text-gray-300 mb-2">
                            Phone
                          </label>
                          <input
                            id="contact-phone"
                            type="tel"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="+91 XXXXX XXXXX"
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label htmlFor="contact-course" className="block text-sm font-medium text-gray-300 mb-2">
                            Course Interested In
                          </label>
                          <select
                            id="contact-course"
                            name="course"
                            value={form.course}
                            onChange={handleChange}
                            className={inputClass}
                          >
                            <option value="" className="bg-navy-900 text-white">
                              Select a course
                            </option>
                            <option value="data-analytics" className="bg-navy-900 text-white">
                              Data Analytics
                            </option>
                            <option value="business-analytics" className="bg-navy-900 text-white">
                              Business Analytics
                            </option>
                            <option value="data-science-ai" className="bg-navy-900 text-white">
                              Data Science and AI
                            </option>
                            <option value="agentic-ai" className="bg-navy-900 text-white">
                              Agentic AI & Prompt Engineering
                            </option>
                            <option value="investment-banking" className="bg-navy-900 text-white">
                              Investment Banking
                            </option>
                            <option value="not-sure" className="bg-navy-900 text-white">
                              Not Sure Yet
                            </option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="contact-message" className="block text-sm font-medium text-gray-300 mb-2">
                            Message
                          </label>
                          <textarea
                            id="contact-message"
                            name="message"
                            rows={4}
                            value={form.message}
                            onChange={handleChange}
                            placeholder="Tell us about your goals..."
                            className={inputClass + " resize-none"}
                          />
                        </div>
                        {error && (
                          <p className="text-red-400 text-sm text-center">{error}</p>
                        )}
                        <Button
                          type="submit"
                          variant="primary"
                          size="lg"
                          className="w-full"
                          disabled={submitting}
                        >
                          {submitting ? "Sending..." : "Send Inquiry"}
                        </Button>
                      </form>
                    </Card>
                  </BorderGlow>
                )}
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          HOW IT WORKS - Light Theme
          ═══════════════════════════════════════════════════════════ */}
      <ThemeProvider theme="light">
        <section className="py-20 px-6" style={{ background: "#f2f1ee" }}>
          <div className="max-w-6xl mx-auto">
            <ScrollReveal>
              <SectionHeading
                label="How It Works"
                title="Three Steps. That's It."
                align="center"
              />
            </ScrollReveal>
            <div className="mt-12 grid md:grid-cols-3 gap-8">
              {steps.map((s, i) => (
                <ScrollReveal key={i} delay={i * 0.15}>
                  <div className="relative h-full rounded-2xl p-6 bg-white border border-gray-100 shadow-xl shadow-gray-200/50 text-center hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
                    <div className="text-5xl font-bold text-orange-500/20 mb-4">
                      <CharacterSplit
                        delay={0.3 + i * 0.2}
                        staggerDelay={0.05}
                        highlightColor="orange"
                      >
                        {s.step}
                      </CharacterSplit>
                    </div>
                    <h3 className="text-xl font-bold text-navy-900 mb-3">
                      {s.title}
                    </h3>
                    <p className="text-gray-500">{s.desc}</p>

                    {/* Connecting line for desktop */}
                    {i < steps.length - 1 && (
                      <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-[2px] bg-gradient-to-r from-orange-300 to-orange-100" />
                    )}
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      </ThemeProvider>

      {/* ═══════════════════════════════════════════════════════════
          DIRECT CONTACT - Enhanced Cards
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 px-6 bg-navy-900">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <SectionHeading label="Reach Out" title="Direct Contact" align="center" />
          </ScrollReveal>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Mail,
                title: "Email",
                value: "hello@linkwaylearning.com",
                href: "mailto:hello@linkwaylearning.com",
                color: "from-blue-500/20 to-blue-600/10",
              },
              {
                icon: Phone,
                title: "Phone",
                value: "+91-93156-47113",
                href: "tel:+919315647113",
                color: "from-green-500/20 to-green-600/10",
              },
              {
                icon: MessageCircle,
                title: "WhatsApp",
                value: "Message us",
                href: "https://wa.me/919315647113",
                external: true,
                color: "from-emerald-500/20 to-emerald-600/10",
              },
              {
                icon: MapPin,
                title: "Office",
                value: "D-23, Sector-59, Noida",
                color: "from-orange-500/20 to-orange-600/10",
              },
            ].map((contact, i) => (
              <ScrollReveal key={i} delay={0.1 * i}>
                <div className="relative group">
                  <CrossFlicker
                    position="top-right"
                    color="orange"
                    size="sm"
                    delay={0.2 * i}
                  />
                  <div className="h-full rounded-xl p-6 bg-white/[0.03] border border-white/[0.08] hover:border-orange-500/30 backdrop-blur-sm transition-all duration-500 text-center overflow-hidden">
                    {/* Gradient hover effect */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${contact.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                    <div className="relative z-10">
                      <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500/20 group-hover:scale-110 transition-all duration-300">
                        <contact.icon className="w-6 h-6 text-orange-400" />
                      </div>
                      <h4 className="text-white font-semibold mb-2">{contact.title}</h4>
                      {contact.href ? (
                        <a
                          href={contact.href}
                          target={contact.external ? "_blank" : undefined}
                          rel={contact.external ? "noopener noreferrer" : undefined}
                          className="text-gray-400 hover:text-orange-400 transition-colors text-sm"
                        >
                          {contact.value}
                        </a>
                      ) : (
                        <p className="text-gray-400 text-sm">{contact.value}</p>
                      )}
                    </div>

                    {/* Bottom accent */}
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-orange-500 to-orange-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          OFFICE LOCATION - Light Theme
          ═══════════════════════════════════════════════════════════ */}
      <ThemeProvider theme="light">
        <section className="py-20 px-6" style={{ background: "#f2f1ee" }}>
          <div className="max-w-4xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-12">
                <span className="inline-block text-orange-500 text-xs font-bold tracking-[0.2em] uppercase mb-4 border border-orange-200 bg-orange-50 px-3 py-1.5 rounded-full">
                  Visit Us
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-navy-900">
                  Our Office
                </h2>
              </div>
            </ScrollReveal>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Address Card */}
              <SpringReveal distance={40} damping={14}>
                <div className="h-full rounded-2xl p-8 bg-white border border-gray-100 shadow-xl shadow-gray-200/50">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-14 h-14 rounded-xl bg-orange-500 flex items-center justify-center shrink-0 shadow-lg shadow-orange-500/25">
                      <Building2 className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-navy-900 mb-1">Linkway Learning</h3>
                      <p className="text-gray-500 text-sm">Head Office</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-orange-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-navy-800 font-medium">D-23, Sector-59</p>
                        <p className="text-gray-500">Noida, Gautam Buddha Nagar</p>
                        <p className="text-gray-500">Uttar Pradesh - 201301</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-orange-500 shrink-0" />
                      <a href="tel:+919315647113" className="text-navy-800 hover:text-orange-500 transition-colors">
                        +91-93156-47113
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-orange-500 shrink-0" />
                      <a href="mailto:hello@linkwaylearning.com" className="text-navy-800 hover:text-orange-500 transition-colors">
                        hello@linkwaylearning.com
                      </a>
                    </div>
                  </div>
                </div>
              </SpringReveal>

              {/* Office Hours Card */}
              <SpringReveal distance={40} damping={14} delay={0.1}>
                <div className="h-full rounded-2xl p-8 bg-white border border-gray-100 shadow-xl shadow-gray-200/50">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-14 h-14 rounded-xl bg-navy-800 flex items-center justify-center shrink-0 shadow-lg shadow-navy-800/25">
                      <Calendar className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-navy-900 mb-1">Office Hours</h3>
                      <p className="text-gray-500 text-sm">When to reach us</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-navy-800 font-medium">Monday - Friday</span>
                      <span className="text-gray-500">10:00 AM - 7:00 PM</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-navy-800 font-medium">Saturday</span>
                      <span className="text-gray-500">10:00 AM - 5:00 PM</span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="text-navy-800 font-medium">Sunday</span>
                      <span className="text-orange-500 font-medium">Closed</span>
                    </div>
                  </div>

                  <div className="mt-6 p-4 rounded-xl bg-orange-50 border border-orange-100">
                    <p className="text-sm text-orange-800">
                      <span className="font-semibold">Note:</span> Classes run on weekends and evenings to accommodate working professionals.
                    </p>
                  </div>
                </div>
              </SpringReveal>
            </div>
          </div>
        </section>
      </ThemeProvider>

      {/* ═══════════════════════════════════════════════════════════
          CONTACT FAQ - Light Theme
          ═══════════════════════════════════════════════════════════ */}
      <ThemeProvider theme="light">
        <section className="py-20 px-6" style={{ background: "#f2f1ee" }}>
          <div className="max-w-3xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-12">
                <span className="inline-block text-orange-500 text-xs font-bold tracking-[0.2em] uppercase mb-4 border border-orange-200 bg-orange-50 px-3 py-1.5 rounded-full">
                  Common Questions
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-navy-900">
                  Frequently Asked Questions
                </h2>
                <p className="mt-4 text-gray-500">
                  Quick answers about enrollment and what to expect.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
                {contactFaqs.map((faq, i) => (
                  <AccordionItem key={i} title={faq.q} defaultOpen={i === 0}>
                    {faq.a}
                  </AccordionItem>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>
      </ThemeProvider>
    </div>
  );
}
