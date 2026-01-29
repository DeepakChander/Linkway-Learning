"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useRef, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import LineMaskReveal from "@/components/animation/LineMaskReveal";
import ScrollOdometer from "@/components/animation/ScrollOdometer";
import BorderGlow from "@/components/animation/BorderGlow";
import ScrollReveal from "@/components/animation/ScrollReveal";
import Button from "@/components/ui/Button";
import { useEnquiryModal } from "@/components/forms/EnquiryModal";

gsap.registerPlugin(ScrollTrigger);

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
  loading: () => null,
});

const MobileFallback = dynamic(() => import("@/components/three/MobileFallback"), {
  ssr: false,
});

const headlines = [
  { first: "Your Data Career", last: "Starts Right Now." },
  { first: "Real Skills. Real Jobs.", last: "Real Results." },
  { first: "From Zero to Hired.", last: "We Make It Happen." },
];

/* Framer Motion variants for headline transitions */
const headlineVariants = {
  enter: {
    opacity: 0,
    y: 30,
    filter: "blur(8px)",
    scale: 0.97,
  },
  center: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  },
  exit: {
    opacity: 0,
    y: -25,
    filter: "blur(6px)",
    scale: 0.97,
    transition: {
      duration: 0.35,
      ease: [0.55, 0.06, 0.68, 0.19] as [number, number, number, number],
    },
  },
};

const accentVariants = {
  enter: {
    opacity: 0,
    y: 25,
    filter: "blur(6px)",
  },
  center: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.5,
      delay: 0.12,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    filter: "blur(6px)",
    transition: {
      duration: 0.3,
      ease: [0.55, 0.06, 0.68, 0.19] as [number, number, number, number],
    },
  },
};

export default function HeroSection() {
  const { openEnquiry } = useEnquiryModal();
  const [isMobile, setIsMobile] = useState(false);
  const [headlineIndex, setHeadlineIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const globeWrapperRef = useRef<HTMLDivElement>(null);
  const [magnetPos, setMagnetPos] = useState({ x: 0, y: 0 });
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const content = contentRef.current;
      if (!section || !content) return;

      const pinTrigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "+=100%",
        pin: true,
        pinSpacing: true,
        id: "hero-pin",
      });

      gsap.to(content, {
        y: -120,
        opacity: 0,
        scale: 0.95,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "+=20% top",
          end: "+=100%",
          scrub: 1,
        },
      });

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "+=100%",
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          if (p < 0.33) setHeadlineIndex(0);
          else if (p < 0.66) setHeadlineIndex(1);
          else setHeadlineIndex(2);
          setScrollProgress(p);
        },
      });

      if (globeWrapperRef.current) {
        gsap.to(globeWrapperRef.current, {
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=100%",
            scrub: 1,
          },
        });
      }

      return () => {
        pinTrigger.kill();
      };
    },
    { scope: sectionRef }
  );

  const handleCtaMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ctaRef.current) return;
    const rect = ctaRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    setMagnetPos({ x: (e.clientX - cx) * 0.15, y: (e.clientY - cy) * 0.15 });
  }, []);

  const handleCtaMouseLeave = useCallback(() => {
    setMagnetPos({ x: 0, y: 0 });
  }, []);

  const { first, last } = headlines[headlineIndex];

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* 3D Earth Globe Background */}
      <div ref={globeWrapperRef} className="absolute inset-0 z-0 will-change-transform">
        {isMobile ? <MobileFallback /> : <HeroScene scrollProgress={scrollProgress} />}
      </div>

      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 z-[1] noise-overlay" />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/50 to-black z-[2]" />

      {/* Content */}
      <div
        ref={contentRef}
        className="relative max-w-5xl mx-auto px-6 text-center pt-24 will-change-transform"
        style={{ zIndex: 3 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold tracking-wide uppercase"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
          </span>
          Batch Starting Soon - Only Few Seats Left
        </motion.div>

        {/* Animated headline with smooth crossfade */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-2 min-h-[120px] md:min-h-[160px] lg:min-h-[180px] flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.span
              key={`first-${headlineIndex}`}
              className="text-white block"
              variants={headlineVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              {first}
            </motion.span>
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.span
              key={`last-${headlineIndex}`}
              className="text-orange-400 block"
              variants={accentVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              {last}
            </motion.span>
          </AnimatePresence>
        </h1>

        {/* Subtitle */}
        <LineMaskReveal delay={1} className="mt-6">
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Stop watching tutorials that lead nowhere. At Linkway, you build
            real projects, learn from industry mentors at Google &amp; Amazon,
            and walk into interviews with a portfolio that gets you hired.
          </p>
          <p className="text-lg md:text-xl text-orange-400 font-semibold mt-3">
            8,200+ careers transformed. Yours is next.
          </p>
        </LineMaskReveal>

        {/* CTA Buttons with magnetic effect */}
        <ScrollReveal delay={1.4} className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <div
            ref={ctaRef}
            onMouseMove={handleCtaMouseMove}
            onMouseLeave={handleCtaMouseLeave}
            style={{
              transform: `translate(${magnetPos.x}px, ${magnetPos.y}px)`,
              transition: magnetPos.x === 0 ? "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)" : "none",
            }}
          >
            <BorderGlow glowColor="orange" glowIntensity="medium">
              <div className="pulse-corners text-orange-500">
                <Button variant="primary" size="lg" href="/courses">
                  Explore Courses
                  <svg className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Button>
              </div>
            </BorderGlow>
          </div>
          <Button variant="outline" size="lg" onClick={openEnquiry}>
            Enquire Now
          </Button>
        </ScrollReveal>

        {/* Trust strip */}
        <ScrollReveal delay={1.7} className="mt-16">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            <div className="text-center">
              <div className="flex items-baseline justify-center text-3xl md:text-4xl font-bold text-white">
                <ScrollOdometer value={8200} duration={2} suffix="+" animateSuffix className="text-orange-400" />
              </div>
              <p className="text-sm text-gray-400 mt-1">Careers Launched</p>
            </div>
            <div className="text-center">
              <div className="flex items-baseline justify-center text-3xl md:text-4xl font-bold text-white">
                <ScrollOdometer value={40} duration={1.5} suffix="+" animateSuffix className="text-orange-400" />
              </div>
              <p className="text-sm text-gray-400 mt-1">Hiring Partners</p>
            </div>
            <div className="text-center">
              <div className="flex items-baseline justify-center text-3xl md:text-4xl font-bold text-white">
                <span className="inline-flex items-baseline text-orange-400 font-mono">
                  <ScrollOdometer value={96} duration={2.5} className="text-orange-400" />
                  <span className="text-orange-400">.</span>
                  <ScrollOdometer value={8} duration={2.8} delay={0.3} suffix="%" animateSuffix className="text-orange-400" />
                </span>
              </div>
              <p className="text-sm text-gray-400 mt-1">Placement Rate</p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
