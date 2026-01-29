"use client";

import { useRef, useCallback, useState, useEffect } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Counter from "@/components/animation/Counter";
import { CrossFlicker, SpringReveal, StaggerLines, ScrollTextReveal } from "@/components/animation";
import SectionHeading from "@/components/ui/SectionHeading";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import ArcCarousel from "@/components/ui/ArcCarousel";
import { ThemeProvider } from "@/lib/theme";
import { motion, useInView, AnimatePresence } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const values = [
  {
    title: "Careers First, Always",
    desc: "We don't count certificates - we count people who actually got hired and stayed hired.",
    icon: "🎯",
  },
  {
    title: "Learn by Shipping",
    desc: "You won't just watch lectures. You'll build real things, break them, fix them, and ship them.",
    icon: "🚀",
  },
  {
    title: "Mentors, Not Teachers",
    desc: "Everyone who teaches here works in the industry. They know what hiring managers actually care about.",
    icon: "🧭",
  },
  {
    title: "No Hidden Agendas",
    desc: "Our pricing is upfront, our placement numbers are real, and our student stories are verifiable.",
    icon: "🔍",
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
  { target: 500, suffix: "+", label: "Careers Launched" },
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

/* Clip-path wipe reveal - each word unmasks from bottom with stagger */
function WipeRevealHeading({ text }: { text: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-5%" });
  const words = text.split(" ");

  return (
    <div ref={ref}>
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
        {words.map((word, i) => (
          <span key={i} className="inline-block overflow-hidden mr-[0.3em]">
            <motion.span
              className="inline-block"
              initial={{ y: "110%", rotateZ: 4, opacity: 0 }}
              animate={inView ? { y: "0%", rotateZ: 0, opacity: 1 } : undefined}
              transition={{
                duration: 0.9,
                delay: i * 0.07,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {word}
            </motion.span>
          </span>
        ))}
      </h1>
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
          className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-orange-500 text-white shadow-lg hover:bg-orange-600 transition-colors duration-300 flex items-center justify-center"
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
  const storyImageRef = useRef<HTMLDivElement>(null);
  const campusGridRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = storyImageRef.current;
    if (!el) return;
    const img = el.querySelector("img");
    if (!img) return;

    gsap.fromTo(el, { y: 100 }, {
      y: 0, ease: "none",
      scrollTrigger: { trigger: el, start: "top 90%", end: "top 30%", scrub: 1 },
    });
    gsap.fromTo(img, { scale: 1.2 }, {
      scale: 1, ease: "none",
      scrollTrigger: { trigger: el, start: "top 90%", end: "top 30%", scrub: 1 },
    });
  });

  useGSAP(() => {
    const el = campusGridRef.current;
    if (!el) return;
    const images = el.querySelectorAll(".campus-img");
    images.forEach((img, i) => {
      const inner = img.querySelector("img");
      if (!inner) return;
      gsap.fromTo(img, { y: 80 + i * 30 }, {
        y: 0, ease: "none",
        scrollTrigger: { trigger: img, start: "top 95%", end: "top 40%", scrub: 1 },
      });
      gsap.fromTo(inner, { scale: 1.15 }, {
        scale: 1, ease: "none",
        scrollTrigger: { trigger: img, start: "top 95%", end: "top 40%", scrub: 1 },
      });
    });
  });

  return (
    <ThemeProvider theme="light">
      <main className="min-h-screen bg-white text-navy-900">
        {/* Hero */}
        <section className="pt-32 pb-10 px-6 text-center max-w-5xl mx-auto relative">
          <WipeRevealHeading text="We Build Data Careers. Not Just Courses." />

          <motion.p
            className="mt-6 max-w-3xl mx-auto text-gray-500 text-lg md:text-xl leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            Linkway Learning bridges the gap between ambition and industry — giving you the skills, projects, mentorship, and placement support to launch a real career in data.
          </motion.p>
          <SpringReveal delay={1} distance={60} damping={15}>
            <div className="mt-8 mx-auto w-24 h-1 rounded-full bg-gradient-to-r from-orange-500 to-orange-400" />
          </SpringReveal>
        </section>

        {/* Our Story */}
        <section className="pt-12 pb-20 px-6 max-w-6xl mx-auto">
          <SpringReveal skewY={-5} distance={150} damping={12}>
            <SectionHeading label="Our Story" title="How This Started" />
          </SpringReveal>
          <div className="mt-10 grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <StaggerLines baseDelay={0.3} staggerDelay={0.15} skewY={-3} distance={100}>
                {[
                  <p key="s1" className="text-navy-800 text-xl md:text-2xl leading-relaxed font-medium">
                    We kept seeing the same thing: smart people finishing college, picking up a degree, and then sitting at home wondering why nobody would hire them for a data role. It wasn&apos;t a knowledge problem — it was a <span className="text-orange-500 font-semibold">gap between what colleges teach</span> and what companies need.
                  </p>,
                  <p key="s2" className="text-navy-800 text-xl md:text-2xl leading-relaxed font-medium">
                    So we built Linkway to close that gap. Live classes from industry professionals, projects that mirror real business problems, and a placement team that doesn&apos;t stop until you&apos;re hired. <span className="text-orange-500 font-semibold">Over 500 people</span> have made the switch through us so far.
                  </p>,
                ]}
              </StaggerLines>
            </div>

            <div
              ref={storyImageRef}
              className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-xl will-change-transform"
            >
              <Image
                src="/images/sections/team-working.png"
                alt="Linkway Learning team working together"
                width={600}
                height={400}
                className="w-full h-auto object-cover will-change-transform"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent" />
            </div>
          </div>
        </section>

        {/* Scroll Text Reveal - Big Statement */}
        <section className="py-24 px-6 relative bg-gray-50">
          <div className="absolute inset-0 about-dot-pattern opacity-[0.03]" />
          <div className="max-w-5xl mx-auto relative">
            <ScrollTextReveal
              className="text-3xl md:text-4xl lg:text-5xl font-bold leading-snug text-navy-900 text-center"
              mode="word"
              tag="h2"
              scrub={1.5}
            >
              We don&apos;t just teach data - we build the people behind it. Every lesson, every project, every placement is proof that your background doesn&apos;t decide your future.
            </ScrollTextReveal>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20 px-6 max-w-6xl mx-auto">
          <SpringReveal skewY={-5} distance={150} damping={12}>
            <SectionHeading label="Purpose" title="Mission & Vision" />
          </SpringReveal>
          <div className="mt-12 grid md:grid-cols-2 gap-8">
            <SpringReveal delay={0.1} distance={120} skewY={-3} stiffness={80} damping={12}>
              <LatencyPulseCard>
                <Card variant="accent" className="h-full hover-blur-lift relative z-10">
                  <h3 className="text-orange-500 text-sm font-semibold tracking-widest uppercase mb-4">
                    Our Mission
                  </h3>
                  <p className="text-gray-600 text-xl leading-relaxed">
                    Give people real skills that actually get them hired - regardless of where they went to college or what they studied before.
                  </p>
                </Card>
              </LatencyPulseCard>
            </SpringReveal>
            <SpringReveal delay={0.2} distance={120} skewY={-3} stiffness={80} damping={12}>
              <LatencyPulseCard>
                <Card variant="accent" className="h-full hover-blur-lift relative z-10">
                  <h3 className="text-orange-500 text-sm font-semibold tracking-widest uppercase mb-4">
                    Our Vision
                  </h3>
                  <p className="text-gray-600 text-xl leading-relaxed">
                    If you&apos;re curious enough and willing to put in the work, your background shouldn&apos;t decide your future. We want to make that true for data and AI careers.
                  </p>
                </Card>
              </LatencyPulseCard>
            </SpringReveal>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-20 px-6 max-w-6xl mx-auto">
          <SpringReveal skewY={-5} distance={150} damping={12}>
            <SectionHeading label="What We Stand For" title="Our Values" />
          </SpringReveal>
          <div className="mt-12 grid sm:grid-cols-2 gap-8">
            {values.map((v, i) => (
              <SpringReveal key={i} delay={0.1 + i * 0.1} distance={120} skewY={-3} stiffness={80} damping={12}>
                <LatencyPulseCard>
                  <div className="relative">
                    <CrossFlicker
                      position={i % 2 === 0 ? "top-left" : "top-right"}
                      color="orange"
                      size="sm"
                      delay={i * 0.15}
                    />
                    <Card className="h-full hover-blur-lift relative z-10">
                      <h3 className="text-xl font-bold text-navy-900 mb-3">
                        {v.title}
                      </h3>
                      <p className="text-gray-600 text-lg leading-relaxed">{v.desc}</p>
                    </Card>
                  </div>
                </LatencyPulseCard>
              </SpringReveal>
            ))}
          </div>
        </section>

        {/* Campus Images */}
        <section className="py-16 px-6 max-w-6xl mx-auto">
          <div ref={campusGridRef} className="grid md:grid-cols-2 gap-6">
            <div className="campus-img relative rounded-2xl overflow-hidden border border-gray-200 aspect-[16/10] will-change-transform shadow-lg">
              <Image
                src="/images/sections/classroom-workshop.png"
                alt="Linkway Learning classroom workshop session"
                fill
                className="object-cover will-change-transform"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4">
                <Badge variant="orange">Live Workshops</Badge>
              </div>
            </div>
            <div className="campus-img relative rounded-2xl overflow-hidden border border-gray-200 aspect-[16/10] will-change-transform shadow-lg">
              <Image
                src="/images/sections/campus-office.png"
                alt="Linkway Learning campus"
                fill
                className="object-cover will-change-transform"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4">
                <Badge variant="orange">Our Campus</Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Meet the Instructors */}
        <section className="py-20 overflow-hidden bg-gray-50 relative">
          <div className="absolute inset-0 about-dot-pattern opacity-[0.03]" />
          <div className="px-6 max-w-6xl mx-auto relative">
            <SpringReveal skewY={-5} distance={150} damping={12}>
              <SectionHeading
                label="Mentors"
                title="The People Who Teach Here"
                description="They're not full-time teachers. They work at Google, PwC, Cognizant, and Autodesk during the day - and teach at Linkway because they genuinely care about helping people break in."
              />
            </SpringReveal>
          </div>

          <div className="relative mt-8">
            <svg
              className="absolute top-0 left-0 w-full pointer-events-none z-0"
              viewBox="0 0 1200 120"
              fill="none"
              preserveAspectRatio="none"
              style={{ height: "120px" }}
            >
              <path d="M-50 110 Q600 -10 1250 110" className="stroke-orange-500/[0.15]" strokeWidth="1" vectorEffect="non-scaling-stroke" />
              <path d="M-50 115 Q600 -5 1250 115" className="stroke-gray-300/[0.3]" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            </svg>
          </div>

          <div className="mt-4 relative">
            <ArcCarousel cardWidth={380} gap={32} arcHeight={60} fadeColor="var(--color-gray-50)">
              {instructors.map((inst, i) => (
                <div
                  key={i}
                  className="rounded-2xl p-6 bg-white border border-gray-200 shadow-sm h-full select-none hover:shadow-lg hover:border-orange-200 transition-all duration-300"
                >
                  <div className="flex flex-col items-center text-center mb-5">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 shadow-md mb-4">
                      <Image
                        src={inst.image}
                        alt={inst.name}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                        draggable={false}
                      />
                    </div>
                    <h3 className="text-lg font-bold text-navy-900">{inst.name}</h3>
                    <p className="text-orange-500 text-sm mt-1">{inst.title}</p>
                    <p className="text-gray-500 text-xs mt-0.5">
                      {inst.experience} experience
                    </p>
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-4">
                    {inst.bio}
                  </p>

                  <div className="flex flex-wrap gap-2 justify-center">
                    {inst.tags.map((tag) => (
                      <Badge key={tag} variant="orange">{tag}</Badge>
                    ))}
                  </div>
                </div>
              ))}
            </ArcCarousel>
          </div>
        </section>

        {/* Stats Strip */}
        <section className="py-20 px-6 relative bg-gray-50">
          <div className="absolute inset-0 about-dot-pattern opacity-[0.02]" />
          <div className="max-w-6xl mx-auto relative">
            <SpringReveal distance={100} stiffness={120} damping={14}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                {stats.map((stat, i) => (
                  <SpringReveal key={i} delay={i * 0.1} distance={80} stiffness={100} damping={12}>
                    <div className="text-center">
                      <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-navy-900 mb-2">
                        <Counter target={stat.target} suffix={stat.suffix} />
                      </div>
                      <p className="text-gray-500 text-sm md:text-base">
                        {stat.label}
                      </p>
                    </div>
                  </SpringReveal>
                ))}
              </div>
            </SpringReveal>
          </div>
        </section>

        {/* Scroll to Top */}
        <ScrollToTop />
      </main>
    </ThemeProvider>
  );
}
