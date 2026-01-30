"use client";

import { useRef, useCallback, useState, useEffect } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CrossFlicker, SpringReveal, LineMaskReveal, KineticText, CharacterSplit } from "@/components/animation";
import CanvasWave from "@/components/animation/CanvasWave";
import ScrollOdometer from "@/components/animation/ScrollOdometer";
import SectionHeading from "@/components/ui/SectionHeading";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { ThemeProvider } from "@/lib/theme";
import { motion, AnimatePresence } from "framer-motion";
import Marquee from "@/components/animation/Marquee";

gsap.registerPlugin(ScrollTrigger);

const values = [
  {
    title: "Careers First, Always",
    desc: "We don't count certificates - we count people who actually got hired and stayed hired.",
  },
  {
    title: "Learn by Shipping",
    desc: "You won't just watch lectures. You'll build real things, break them, fix them, and ship them.",
  },
  {
    title: "Mentors, Not Teachers",
    desc: "Everyone who teaches here works in the industry. They know what hiring managers actually care about.",
  },
  {
    title: "No Hidden Agendas",
    desc: "Our pricing is upfront, our placement numbers are real, and our student stories are verifiable.",
  },
];

const instructors = [
  {
    name: "Akshat Khandelwal",
    experience: "5+ years",
    title: "Senior Finance BI Developer at Autodesk",
    bio: "Akshat has spent 5+ years turning messy financial data into dashboards that executives actually use. He's worked at Allen Digital and now leads BI at Autodesk - and he teaches the way he works: practical, no fluff, straight to the point.",
    tags: ["Power BI", "Python", "SQL", "Finance BI"],
    image: "/images/instructors/akshat-khandelwal.jpeg",
  },
  {
    name: "Prabhat Sinha",
    experience: "9+ years",
    title: "Data Scientist at Cognizant",
    bio: "Nine years at Cognizant taught Prabhat how to take chaotic datasets and turn them into something a business can actually act on. He specializes in Python and EDA, and he's particularly good at making complex analytics feel approachable.",
    tags: ["Python", "EDA", "Advanced Analytics"],
    image: "/images/instructors/prabhat-sinha.jpeg",
  },
  {
    name: "Heena Arora",
    experience: "3+ years",
    title: "Associate Data Scientist at PwC (ex-Amazon)",
    bio: "Heena went from handling international ops at Amazon to building image analytics pipelines at PwC. She knows what it takes to switch lanes in your career - because she did it herself.",
    tags: ["Data Science", "Image Analytics", "Python"],
    image: "/images/instructors/heena-arora.jpeg",
  },
  {
    name: "Anand Tripathi",
    experience: "1+ year",
    title: "Data Analyst at Google",
    bio: "Anand works at Google, where he analyzes data that shapes real product decisions. He brings that same structured thinking to Linkway - helping students learn how to ask the right questions before jumping into the data.",
    tags: ["Data Analytics", "Big Data", "Google"],
    image: "/images/instructors/anand-tripathi.jpeg",
  },
];

const stats = [
  { target: 8200, suffix: "+", label: "Careers Launched" },
  { target: 40, suffix: "+", label: "Hiring Partners" },
  { target: 85, suffix: "%", label: "Avg Salary Jump" },
  { target: 100, suffix: "%", label: "Placement Rate" },
];

/* Latency pulse mouse tracker for cards */
function LatencyPulseCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  }, []);

  return (
    <div ref={ref} onMouseMove={handleMouseMove} className={`latency-pulse-card ${className}`}>
      {children}
    </div>
  );
}

/* Scroll-to-top button */
function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-24 right-6 z-40 w-12 h-12 rounded-full bg-orange-500 text-white shadow-lg hover:bg-orange-600 transition-colors duration-300 flex items-center justify-center lg:bottom-8 lg:right-8"
          aria-label="Scroll to top"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 16V4M4 10l6-6 6 6" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

export default function AboutPage() {
  return (
    <ThemeProvider theme="light">
      <div className="min-h-screen bg-white text-navy-900">
        {/* Ambient light flow */}
        <div className="light-flow-bg" aria-hidden="true" />

        {/* ─── HERO ─── */}
        <section className="relative pt-32 pb-20 px-6 overflow-hidden bg-gradient-to-b from-gray-50 via-white to-white">
          {/* Background textures */}
          <div className="absolute inset-0 about-dot-pattern opacity-[0.04]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-orange-500/[0.04] blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-navy-600/[0.03] blur-[100px] pointer-events-none" />

          <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Text */}
            <div>
              <SpringReveal distance={30} damping={15}>
                <p className="text-orange-500 text-sm font-semibold tracking-widest uppercase mb-6">About Linkway Learning</p>
              </SpringReveal>
              <SpringReveal distance={60} damping={12} delay={0.1}>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-navy-900 leading-tight">
                  We Build Data Careers. Not Just Courses.
                </h1>
              </SpringReveal>
              <SpringReveal distance={40} damping={15} delay={0.3}>
                <p className="mt-6 text-lg md:text-xl text-gray-500 leading-relaxed max-w-xl">
                  Linkway Learning bridges the gap between ambition and industry — giving you the skills, projects, mentorship, and placement support to launch a real career in data.
                </p>
              </SpringReveal>
              <SpringReveal delay={0.5} distance={30} damping={15}>
                <div className="mt-8 flex gap-4 flex-wrap">
                  <Badge variant="orange">8,200+ Careers Launched</Badge>
                  <Badge variant="orange">100% Placement Rate*</Badge>
                </div>
              </SpringReveal>
            </div>

            {/* Right: Overlapping stacked collage */}
            <div className="relative h-[500px] md:h-[550px] lg:h-[600px]">
              {/* Main large image */}
              <SpringReveal delay={0.2} distance={60} damping={14}>
                <div className="absolute top-0 right-0 w-[75%] h-[65%] rounded-2xl overflow-hidden shadow-2xl border border-gray-200 hover-blur-lift z-10">
                  <Image
                    src="/images/about/about-hero-1.png"
                    alt="Students collaborating with data dashboards"
                    fill
                    className="object-cover object-top"
                  />
                </div>
              </SpringReveal>
              {/* Overlapping left image */}
              <SpringReveal delay={0.4} distance={80} damping={12}>
                <div className="absolute top-[15%] left-0 w-[45%] h-[50%] rounded-2xl overflow-hidden shadow-2xl border-2 border-white hover-blur-lift z-20">
                  <Image
                    src="/images/about/about-hero-3.png"
                    alt="One-on-one mentoring session"
                    fill
                    className="object-cover object-top"
                  />
                </div>
              </SpringReveal>
              {/* Bottom-right overlapping */}
              <SpringReveal delay={0.5} distance={80} damping={12}>
                <div className="absolute bottom-0 right-[5%] w-[55%] h-[45%] rounded-2xl overflow-hidden shadow-2xl border-2 border-white hover-blur-lift z-30">
                  <Image
                    src="/images/about/about-hero-4.png"
                    alt="Birds-eye view of data workspace"
                    fill
                    className="object-cover object-center"
                  />
                </div>
              </SpringReveal>
              {/* Small accent image */}
              <SpringReveal delay={0.6} distance={60} damping={14}>
                <div className="absolute bottom-[10%] left-[5%] w-[35%] h-[35%] rounded-xl overflow-hidden shadow-xl border-2 border-white hover-blur-lift z-30">
                  <Image
                    src="/images/about/about-hero-2.png"
                    alt="Students presenting data analytics"
                    fill
                    className="object-cover object-top"
                  />
                </div>
              </SpringReveal>
              {/* Decorative glow */}
              <div className="absolute inset-0 bg-orange-500/[0.04] rounded-3xl blur-3xl -z-10 pointer-events-none" />
            </div>
          </div>
        </section>

        {/* ─── OUR STORY ─── */}
        <section className="py-20 px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center w-full max-w-6xl mx-auto">
            <div>
              <SpringReveal skewY={-5} distance={150} damping={12}>
                <SectionHeading label="Our Story" title="How This Started" />
              </SpringReveal>
              <LineMaskReveal delay={0.2} staggerDelay={0.2} className="mt-8">
                <p className="text-navy-800 text-xl md:text-2xl leading-relaxed font-medium">
                  We kept seeing the same thing: smart people finishing college, picking up a degree, and then sitting at home wondering why nobody would hire them for a data role. It wasn&apos;t a knowledge problem — it was a <span className="text-orange-500 font-semibold">gap between what colleges teach</span> and what companies need.
                </p>
                <p className="text-navy-800 text-xl md:text-2xl leading-relaxed font-medium mt-6">
                  So we built Linkway to close that gap. Live classes from industry professionals, projects that mirror real business problems, and a placement team that doesn&apos;t stop until you&apos;re hired. <span className="text-orange-500 font-semibold">Over 500 people</span> have made the switch through us so far.
                </p>
              </LineMaskReveal>
            </div>
            <SpringReveal delay={0.3} distance={120} damping={12}>
              <div className="depth-hover">
                <div className="depth-hover-inner rounded-2xl overflow-hidden border border-gray-200 shadow-xl aspect-[3/2] relative">
                  <Image
                    src="/images/sections/team-working.png"
                    alt="Linkway Learning team working together"
                    fill
                    className="object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent" />
                </div>
              </div>
            </SpringReveal>
          </div>
        </section>

        {/* ─── MISSION & VISION ─── */}
        <section className="py-20 px-6 max-w-6xl mx-auto relative z-10">
          <SpringReveal skewY={-5} distance={150} damping={12}>
            <SectionHeading label="Purpose" title="Mission & Vision" />
          </SpringReveal>
          <div className="mt-12 grid md:grid-cols-2 gap-8">
            <SpringReveal delay={0.1} distance={120} skewY={-3} stiffness={80} damping={12}>
              <LatencyPulseCard>
                <div className="relative">
                  <CrossFlicker position="top-left" color="orange" size="sm" />
                  <Card variant="accent" className="h-full hover-blur-lift relative z-10">
                    <h3 className="text-orange-500 text-sm font-semibold tracking-widest uppercase mb-4">
                      Our Mission
                    </h3>
                    <p className="text-gray-600 text-xl leading-relaxed">
                      Give people real skills that actually get them hired — regardless of where they went to college or what they studied before.
                    </p>
                  </Card>
                </div>
              </LatencyPulseCard>
            </SpringReveal>
            <SpringReveal delay={0.2} distance={120} skewY={-3} stiffness={80} damping={12}>
              <LatencyPulseCard>
                <div className="relative">
                  <CrossFlicker position="top-right" color="orange" size="sm" delay={0.3} />
                  <Card variant="accent" className="h-full hover-blur-lift relative z-10">
                    <h3 className="text-orange-500 text-sm font-semibold tracking-widest uppercase mb-4">
                      Our Vision
                    </h3>
                    <p className="text-gray-600 text-xl leading-relaxed">
                      If you&apos;re curious enough and willing to put in the work, your background shouldn&apos;t decide your future. We want to make that true for data and AI careers.
                    </p>
                  </Card>
                </div>
              </LatencyPulseCard>
            </SpringReveal>
          </div>
        </section>

        {/* ─── OUR VALUES ─── */}
        <section className="py-20 px-6 max-w-4xl mx-auto relative z-10">
          <SpringReveal skewY={-5} distance={150} damping={12}>
            <SectionHeading label="What We Stand For" title="Our Values" />
          </SpringReveal>
          <div className="mt-12 space-y-10">
            {values.map((v, i) => (
              <LineMaskReveal key={i} delay={0.1 * i}>
                <div className={`max-w-lg ${i % 2 === 0 ? "mr-auto" : "ml-auto"}`}>
                  <LatencyPulseCard>
                    <div className="relative">
                      <span className="absolute -top-6 -left-4 text-8xl font-bold text-orange-500/[0.06] select-none pointer-events-none">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <CrossFlicker
                        position={i % 2 === 0 ? "top-left" : "top-right"}
                        color="orange"
                        size="sm"
                        delay={i * 0.15}
                      />
                      <Card className="h-full hover-blur-lift relative z-10">
                        <h3 className="text-xl font-bold text-navy-900 mb-3">{v.title}</h3>
                        <p className="text-gray-600 text-lg leading-relaxed">{v.desc}</p>
                      </Card>
                    </div>
                  </LatencyPulseCard>
                </div>
              </LineMaskReveal>
            ))}
          </div>
        </section>

        {/* ─── CAMPUS IMAGES MARQUEE ─── */}
        <section className="py-12 relative z-10">
          <Marquee speed={40} pauseOnHover direction="left" gap={6}>
            <div className="w-[400px] h-[250px] rounded-2xl overflow-hidden shrink-0 relative">
              <Image src="/images/sections/classroom-workshop.png" alt="Live workshop session" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4">
                <Badge variant="orange">Live Workshops</Badge>
              </div>
            </div>
            <div className="w-[400px] h-[250px] rounded-2xl overflow-hidden shrink-0 relative">
              <Image src="/images/sections/campus-office.png" alt="Linkway campus" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4">
                <Badge variant="orange">Our Campus</Badge>
              </div>
            </div>
            <div className="w-[400px] h-[250px] rounded-2xl overflow-hidden shrink-0 relative">
              <Image src="/images/sections/team-working.png" alt="Team collaboration" fill className="object-cover object-top" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4">
                <Badge variant="orange">Team Work</Badge>
              </div>
            </div>
          </Marquee>
        </section>

        {/* ─── MEET THE INSTRUCTORS ─── */}
        <section className="py-20 relative z-10 bg-gray-50">
          <div className="absolute inset-0 about-dot-pattern opacity-[0.03]" />
          <div className="px-6 max-w-6xl mx-auto relative">
            <SpringReveal skewY={-5} distance={150} damping={12}>
              <SectionHeading
                label="Mentors"
                title="The People Who Teach Here"
                description="They're not full-time teachers. They work at Google, PwC, Cognizant, and Autodesk during the day — and teach at Linkway because they genuinely care about helping people break in."
              />
            </SpringReveal>
            <div className="mt-12 grid md:grid-cols-2 gap-8">
              {instructors.map((inst, i) => (
                <SpringReveal key={i} delay={0.1 + i * 0.1} distance={100} skewY={-3} damping={12}>
                  <LatencyPulseCard>
                    <div className="rounded-2xl p-6 bg-white border border-gray-200 shadow-sm h-full hover:shadow-lg hover:border-orange-200 transition-all duration-300">
                      <div className="flex items-center gap-4 mb-5">
                        <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-gray-200 shadow-md shrink-0">
                          <Image
                            src={inst.image}
                            alt={inst.name}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-navy-900">{inst.name}</h3>
                          <p className="text-orange-500 text-sm mt-0.5">{inst.title}</p>
                          <p className="text-gray-500 text-xs mt-0.5">{inst.experience} experience</p>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed mb-4">{inst.bio}</p>
                      <div className="flex flex-wrap gap-2">
                        {inst.tags.map((tag) => (
                          <Badge key={tag} variant="orange">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  </LatencyPulseCard>
                </SpringReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ─── STATS ─── */}
        <section className="py-20 px-6 relative z-10">
          <div className="max-w-5xl mx-auto glass-progressive-light rounded-3xl p-12 relative">
            <CrossFlicker position="top-left" color="orange" size="sm" />
            <CrossFlicker position="top-right" color="orange" size="sm" delay={0.3} />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              {stats.map((stat, i) => (
                <SpringReveal key={i} delay={i * 0.1} distance={60} stiffness={100} damping={12}>
                  <div className="text-center">
                    <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-navy-900 stat-glow">
                      <ScrollOdometer value={stat.target} suffix={stat.suffix} animateSuffix duration={2} delay={0.2 + i * 0.15} />
                    </div>
                    <p className="text-gray-500 text-sm md:text-base mt-2">{stat.label}</p>
                  </div>
                </SpringReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Scroll to Top */}
        <ScrollToTop />
      </div>
    </ThemeProvider>
  );
}
