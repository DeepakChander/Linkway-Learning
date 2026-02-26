"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ScrollReveal from "@/components/animation/ScrollReveal";
import { BorderGlow, CharacterSplit } from "@/components/animation";
import SpringReveal from "@/components/animation/SpringReveal";
import SectionHeading from "@/components/ui/SectionHeading";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { AccordionItem } from "@/components/ui/Accordion";
import { ThemeProvider } from "@/lib/theme";
import { MessageCircle, CheckCircle } from "lucide-react";
import { trackContactFormSubmit, trackContactFormSuccess, trackWhatsAppClick, trackCtaClick } from "@/lib/analytics";

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
    trackContactFormSubmit(form.course);
    try {
      const endpoint = process.env.NODE_ENV === "development"
        ? "/api/leads/submit"
        : "/api/submit-lead.php";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.name,
          email: form.email,
          phone: form.phone,
          course: form.course,
          webhookType: "default",
        }),
      });
      if (res.ok) {
        setSubmitted(true);
        trackContactFormSuccess(form.course);
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


  const faqs = [
    {
      q: "What exactly is Linkway Learning?",
      a: "Linkway Learning is an industry-driven learning organization that equips learners with in-demand data skills and supports them in securing relevant job opportunities.",
    },
    {
      q: "Why should I choose Linkway Learning?",
      a: "Linkway Learning offers small class sizes, practical hands-on attack simulations, Microsoft-recognized certification, and 100% placement.",
    },
    {
      q: "Are flexible payment or financial options available?",
      a: "Yes, no-cost EMI and financing options are available to make the program affordable for everyone.",
    },
    {
      q: "What kind of career support is provided?",
      a: "100% placement with dedicated career coaching, resume reviews, and interview preparation.",
    },
    {
      q: "Will I receive a certificate after completing the program?",
      a: "You'll receive a Linkway Learning certificate and a Microsoft-recognized certificate after completion.",
    },
    {
      q: "What is the mode of instruction for the classes?",
      a: "All classes are 100% live and highly interactive, led by experienced instructors. Batch sizes are intentionally kept small to ensure personalized attention and meaningful interaction. Each session is also recorded for future reference.",
    },
    {
      q: "Do I need prior technical or coding knowledge to enroll?",
      a: "No prior technical background is required. The program is designed to support beginners as well as professionals from non-technical backgrounds.",
    },
    {
      q: "Is there any support provided beyond the classroom sessions?",
      a: "Yes, learners receive continuous academic support, including doubt-solving sessions and mentorship throughout the course.",
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
                <span className="text-gray-400 font-normal ml-3">Together</span>
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
              Whether you have a question or you're ready to transform your career -
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
                value: "12,000+",
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
                value: "400+",
                label: "Hiring Partners",
                icon: (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                  </svg>
                )
              },
              {
                value: "4.9/5",
                label: "Student Rating",
                icon: (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
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
              onClick={() => trackCtaClick("Get Started Today", "Contact Hero")}
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
              onClick={() => trackWhatsAppClick("Contact Hero")}
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
                        onClick={() => trackWhatsAppClick("Contact Form Section")}
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
          FAQ - Light Theme
          ═══════════════════════════════════════════════════════════ */}
      <ThemeProvider theme="light">
        <section className="py-20 px-6" style={{ background: "#f2f1ee" }}>
          <div className="max-w-3xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-12">
                <span className="inline-block text-orange-500 text-xs font-bold tracking-[0.2em] uppercase mb-4 border border-orange-200 bg-orange-50 px-3 py-1.5 rounded-full">
                  Got Questions?
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-navy-900">
                  Frequently Asked Questions
                </h2>
                <p className="mt-4 text-gray-500">
                  Straight answers. No corporate fluff.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
                {faqs.map((faq, i) => (
                  <AccordionItem key={i} title={faq.q} defaultOpen={false}>
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
