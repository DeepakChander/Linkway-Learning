"use client";

import { useRef, useCallback, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import KineticText from "@/components/animation/KineticText";
import ScrollReveal from "@/components/animation/ScrollReveal";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import SectionHeading from "@/components/ui/SectionHeading";
import ToolLogo from "@/components/ui/ToolLogo";
import { AccordionItem } from "@/components/ui/Accordion";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/lib/theme";
import { useEnquiryModal } from "@/components/forms/EnquiryModal";

gsap.registerPlugin(ScrollTrigger);

type AnimationVariant = "orano" | "activetheory" | "redbull";

interface CoursePageProps {
  name: string;
  duration: string;
  level: string;
  tagline: string;
  heroDescription: string;
  color: string;
  whoIsThisFor: { title: string; description: string }[];
  curriculum: { phase: string; title: string; duration: string; topics: string[] }[];
  tools: string[];
  projects: { title: string; description: string }[];
  caseStudies?: { company: string; title: string; description: string; focus: string[] }[];
  careerOutcomes: { roles: string[]; salaryRange: string };
  faqs: { question: string; answer: string }[];
  animationVariant?: AnimationVariant;
}

// ── Shared: Magnetic hover wrapper ──
function MagneticWrap({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const handleMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPos({ x: (e.clientX - rect.left - rect.width / 2) * 0.15, y: (e.clientY - rect.top - rect.height / 2) * 0.15 });
  }, []);
  return (
    <div ref={ref} className={className} onMouseMove={handleMove} onMouseLeave={() => setPos({ x: 0, y: 0 })}
      style={{ transform: `translate(${pos.x}px, ${pos.y}px)`, transition: pos.x === 0 ? "transform 0.4s cubic-bezier(.17,.4,.02,.99)" : "none" }}>
      {children}
    </div>
  );
}

// ── Active Theory: Terminal Cursor Text ──
function TerminalText({ children, className }: { children: string; className?: string }) {
  return <span className={cn("at-cursor", className)}>{children}</span>;
}

// ── Active Theory: Dot Flashing Indicator ──
function DotFlash({ className }: { className?: string }) {
  return <span className={cn("at-dot-flash inline-block", className)} />;
}

// ── Active Theory: Tools Ticker Strip ──
function ToolsTicker({ tools, color }: { tools: string[]; color: string }) {
  const doubled = [...tools, ...tools];
  return (
    <div className="overflow-hidden py-6 border-y border-white/5">
      <div className="at-ticker-strip gap-8">
        {doubled.map((tool, i) => (
          <span key={i} className="text-sm font-mono uppercase tracking-widest whitespace-nowrap px-4" style={{ color }}>
            {tool}
            <span className="text-white/20 ml-8">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Red Bull: SVG Scanline Decorative Path ──
function ScanlineSVG({ className }: { className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const isInView = useInView(svgRef, { once: true });
  return (
    <svg ref={svgRef} className={cn("pointer-events-none", className)} viewBox="0 0 800 40" fill="none">
      {[0, 10, 20, 30].map((y) => (
        <motion.path
          key={y}
          d={`M0 ${y + 5} L800 ${y + 5}`}
          stroke="rgba(255,255,255,0.04)"
          strokeWidth="0.5"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : {}}
          transition={{ duration: 1.5, delay: y * 0.05 }}
        />
      ))}
    </svg>
  );
}

export default function CoursePageTemplate({
  name, duration, level, tagline, heroDescription, color,
  whoIsThisFor, curriculum, tools, projects, caseStudies,
  careerOutcomes, faqs, animationVariant,
}: CoursePageProps) {
  const { openEnquiry } = useEnquiryModal();
  const heroRef = useRef<HTMLElement>(null);
  const v = animationVariant;

  const mainRef = useRef<HTMLDivElement>(null);

  // ── Red Bull: Scroll-pinned hero section ──
  useGSAP(() => {
    if (v !== "redbull" || !heroRef.current) return;
    ScrollTrigger.create({
      trigger: heroRef.current,
      start: "top top",
      end: "+=80%",
      pin: true,
      pinSpacing: true,
    });
    const content = heroRef.current.querySelector(".rb-hero-content");
    if (content) {
      gsap.to(content, {
        y: -80, opacity: 0, scale: 0.97,
        ease: "none",
        scrollTrigger: { trigger: heroRef.current, start: "+=20% top", end: "+=80%", scrub: 1 },
      });
    }
  }, { scope: heroRef });

  // ── Variant-specific easing curves ──
  const ease: [number, number, number, number] = v === "activetheory"
    ? [0.17, 0.4, 0.02, 0.99] // Snappy spring
    : v === "orano"
    ? [0.25, 0.1, 0.25, 1] // Fast linear feel
    : v === "redbull"
    ? [0.4, 0, 0.2, 1] // Smooth cinematic
    : [0.19, 1, 0.22, 1]; // Default

  const transitionDuration = v === "orano" ? 0.3 : v === "activetheory" ? 0.8 : 0.6;

  return (
    <ThemeProvider theme="light">
    <div ref={mainRef} className={cn(
      "min-h-screen bg-white text-navy-900",
      v === "orano" && "orano-scroll",
      v === "redbull" && "rb-scanlines",
    )}>
      {/* ==================== HERO ==================== */}
      <section
        ref={heroRef}
        className={cn(
          "relative min-h-[90vh] flex items-center justify-center overflow-hidden",
          v === "activetheory" && "at-blend-dodge-parent",
        )}
      >
        {/* Background */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 30% 20%, ${color}44 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, ${color}33 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, #0a0e27 0%, #0a0e27 100%)`,
          }}
        />

        {/* Orano: Brightness shimmer overlay */}
        {v === "orano" && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{ opacity: [0.02, 0.06, 0.02] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            style={{ background: `linear-gradient(180deg, ${color}11 0%, transparent 50%, ${color}08 100%)` }}
          />
        )}

        {/* Active Theory: Blend mode overlay */}
        {v === "activetheory" && (
          <div className="absolute inset-0 at-blend-dodge pointer-events-none" style={{
            background: "radial-gradient(circle at 50% 50%, rgba(0,255,255,0.03), transparent 70%)",
          }} />
        )}

        {/* Red Bull: Scanline grid overlay */}
        {v === "redbull" && <ScanlineSVG className="absolute bottom-0 left-0 w-full h-[40px] opacity-50" />}

        {/* Noise overlay for all */}
        <div className="noise-overlay absolute inset-0 pointer-events-none" />

        <div className={cn("relative z-10 max-w-5xl mx-auto px-6 text-center py-32", v === "redbull" && "rb-hero-content will-change-transform")}>
          <div className="flex items-center justify-center gap-3 mb-8">
            {/* Active Theory: Dot flash indicator next to badges */}
            {v === "activetheory" && <DotFlash className="mr-2" />}
            <Badge variant="glass">{duration}</Badge>
            <Badge variant="glass">{level}</Badge>
            {v === "activetheory" && <DotFlash className="ml-2" />}
          </div>

          {/* Red Bull: Fluid typography */}
          {v === "redbull" ? (
            <motion.h1
              className="rb-fluid-h1 font-bold text-white leading-tight"
              initial={{ opacity: 0, y: 60, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
            >
              {name}
            </motion.h1>
          ) : v === "activetheory" ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, ease }}
            >
              <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight font-mono">
                <TerminalText>{name}</TerminalText>
              </h1>
            </motion.div>
          ) : (
            <KineticText text={name} as="h1" className="text-5xl md:text-7xl font-bold text-white leading-tight" />
          )}

          <motion.p
            className={cn("mt-6 text-xl md:text-2xl font-medium", v === "activetheory" ? "text-cyan-400" : "text-orange-400")}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: transitionDuration, delay: 0.3, ease }}
          >
            {tagline}
          </motion.p>
          <motion.p
            className="mt-4 text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: transitionDuration, delay: 0.5, ease }}
          >
            {heroDescription}
          </motion.p>

          <motion.div
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: transitionDuration, delay: 0.7, ease }}
          >
            {/* Orano: Button with glow border focus */}
            <MagneticWrap>
              <Button variant="primary" size="lg" onClick={openEnquiry} className={cn(
                v === "orano" && "btn-border-glow orano-focus",
                v === "activetheory" && "at-spring-enter",
                "pulse-corners",
              )}>
                Enroll Now
              </Button>
            </MagneticWrap>
            <Button variant="outline" size="lg" onClick={openEnquiry} className={cn(
              v === "orano" && "orano-brightness",
              v === "activetheory" && "at-spring-enter",
              v === "redbull" && "btn-border-glow",
            )}>
              Download Syllabus
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ==================== WHO IS THIS FOR ==================== */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <SectionHeading label="Built For" title="Is This You?" />
          </ScrollReveal>

          {/* Red Bull: Scanline separator */}
          {v === "redbull" && <ScanlineSVG className="w-full h-[30px] my-4 opacity-30" />}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
            {whoIsThisFor.map((persona, i) => (
              <motion.div
                key={i}
                className={cn(v === "orano" && "orano-card", v === "redbull" && "rb-data-point")}
                initial={{ opacity: 0, y: v === "orano" ? 20 : 40, ...(v === "activetheory" ? { scale: 0.95 } : {}) }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: transitionDuration, delay: i * (v === "orano" ? 0.05 : 0.12), ease }}
              >
                <Card variant="glass" className={cn(
                  "p-8",
                  v === "orano" && "orano-brightness",
                  v === "activetheory" && "hover-blur-lift",
                  v === "redbull" && "btn-border-glow",
                )}>
                  <div className="flex items-center gap-3 mb-3">
                    {v === "activetheory" && <DotFlash />}
                    <h3 className={cn("text-xl font-bold text-navy-900", v === "activetheory" && "font-mono")}>{persona.title}</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{persona.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CURRICULUM TIMELINE ==================== */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <SectionHeading label="Curriculum" title="What You'll Actually Learn" />
          </ScrollReveal>

          <div className="relative mt-16">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5" style={{ backgroundColor: `${color}33` }} />

            {/* Active Theory: Ticker for module names */}
            {v === "activetheory" && (
              <div className="mb-8 overflow-hidden border-b border-white/5 pb-4">
                <div className="at-ticker-strip gap-12">
                  {[...curriculum, ...curriculum].map((mod, i) => (
                    <span key={i} className="text-xs font-mono uppercase tracking-widest text-cyan-500/50 whitespace-nowrap">
                      {mod.phase}: {mod.title} <span className="text-white/10 mx-4">|</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-8">
              {curriculum.map((mod, i) => (
                <motion.div
                  key={i}
                  className={cn("relative pl-16", v === "orano" && "orano-card", v === "redbull" && "rb-data-point")}
                  initial={{ opacity: 0, y: v === "orano" ? 15 : 40, x: v === "redbull" ? -30 : 0 }}
                  whileInView={{ opacity: 1, y: 0, x: 0 }}
                  viewport={{ once: true, margin: "-5% 0px" }}
                  transition={{
                    duration: transitionDuration,
                    delay: i * (v === "orano" ? 0.04 : 0.1),
                    ease,
                  }}
                >
                  {/* Node dot */}
                  <motion.div
                    className="absolute left-4 top-8 w-5 h-5 rounded-full border-4"
                    style={{ borderColor: color, backgroundColor: `${color}33` }}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 200, damping: 10, delay: i * 0.08 }}
                  />

                  <Card variant="glass" className={cn(
                    "p-8",
                    v === "orano" && "orano-panel",
                    v === "activetheory" && "hover-blur-lift",
                    v === "redbull" && "btn-border-glow",
                  )}>
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      {v === "activetheory" && <DotFlash />}
                      <span className={cn("text-xs font-bold uppercase tracking-widest", v === "activetheory" && "font-mono")} style={{ color }}>
                        {mod.phase}
                      </span>
                      <Badge variant="glass">{mod.duration}</Badge>
                    </div>
                    <h3 className={cn("text-xl font-bold text-navy-900 mb-4", v === "activetheory" && "font-mono")}>
                      {v === "activetheory" ? <TerminalText>{mod.title}</TerminalText> : mod.title}
                    </h3>
                    <ul className="space-y-2">
                      {mod.topics.map((topic, j) => (
                        <motion.li
                          key={j}
                          className="flex items-start gap-3 text-gray-600"
                          initial={{ opacity: 0, x: v === "redbull" ? -15 : 0 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.3, delay: j * 0.05 + i * 0.05, ease }}
                        >
                          <span className="mt-2 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                          {topic}
                        </motion.li>
                      ))}
                    </ul>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== TOOLS GRID ==================== */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <SectionHeading label="Tech Stack" title="The Tools You'll Know Cold" />
          </ScrollReveal>

          {/* Active Theory: Horizontal ticker for tools instead of grid */}
          {v === "activetheory" ? (
            <div className="mt-16">
              <ToolsTicker tools={tools} color={color} />
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
                {tools.map((tool, i) => (
                  <motion.div
                    key={tool}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: i * 0.03, ease: [0.17, 0.4, 0.02, 0.99] }}
                    className="at-spring-enter"
                  >
                    <ToolLogo name={tool} />
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-16">
              {tools.map((tool, i) => (
                <motion.div
                  key={tool}
                  className={cn(v === "orano" && "orano-card orano-brightness", v === "redbull" && "rb-data-point")}
                  initial={{ opacity: 0, y: v === "orano" ? 10 : 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: transitionDuration, delay: i * (v === "orano" ? 0.02 : 0.05), ease }}
                >
                  <ToolLogo name={tool} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ==================== PROJECTS SHOWCASE ==================== */}
      <section className={cn("py-24 px-6", v === "redbull" && "rb-scanlines")}>
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <SectionHeading label="Hands-On" title="Projects You'll Ship" />
          </ScrollReveal>

          {v === "redbull" && <ScanlineSVG className="w-full h-[30px] my-4 opacity-30" />}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
            {projects.map((project, i) => (
              <motion.div
                key={i}
                className={cn(v === "redbull" && "rb-data-point")}
                initial={{
                  opacity: 0,
                  y: v === "orano" ? 15 : 40,
                  x: v === "redbull" ? (i % 2 === 0 ? -30 : 30) : 0,
                  scale: v === "activetheory" ? 0.9 : 1,
                }}
                whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
                viewport={{ once: true, margin: "-5% 0px" }}
                transition={{ duration: transitionDuration, delay: i * 0.1, ease }}
              >
                <Card variant="glass" className={cn(
                  "p-8 relative overflow-hidden h-full",
                  v === "orano" && "orano-panel orano-brightness",
                  v === "activetheory" && "hover-blur-lift",
                  v === "redbull" && "btn-border-glow",
                )}>
                  <div className="absolute left-0 top-0 bottom-0 w-1 rounded-full" style={{ backgroundColor: color }} />
                  <div className="pl-4">
                    <div className="flex items-center gap-2 mb-3">
                      {v === "activetheory" && <DotFlash />}
                      <h3 className={cn("text-lg font-bold text-navy-900", v === "activetheory" && "font-mono")}>
                        {project.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{project.description}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CASE STUDIES ==================== */}
      {caseStudies && caseStudies.length > 0 && (
        <section className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <ScrollReveal>
              <SectionHeading label="Real-World" title="Problems You'll Solve" />
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
              {caseStudies.map((cs, i) => (
                <motion.div
                  key={i}
                  className={cn(v === "redbull" && "rb-data-point")}
                  initial={{
                    opacity: 0, y: 40,
                    rotateX: v === "redbull" ? 10 : 0,
                    scale: v === "activetheory" ? 0.85 : 1,
                  }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: transitionDuration, delay: i * 0.08, ease }}
                >
                  <Card variant="glass" className={cn(
                    "p-8 h-full",
                    v === "orano" && "orano-card orano-brightness",
                    v === "activetheory" && "hover-blur-lift",
                    v === "redbull" && "btn-border-glow",
                  )}>
                    <div className="flex items-center gap-2">
                      {v === "activetheory" && <DotFlash />}
                      <span className={cn("text-xs font-bold uppercase tracking-widest", v === "activetheory" && "font-mono")} style={{ color }}>
                        {cs.company}
                      </span>
                    </div>
                    <h3 className={cn("text-lg font-bold text-navy-900 mt-2 mb-3", v === "activetheory" && "font-mono")}>
                      {cs.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">{cs.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {cs.focus.map((tag) => (
                        <Badge key={tag} variant="glass">{tag}</Badge>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ==================== CAREER OUTCOMES ==================== */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <SectionHeading label="Outcomes" title="Where You'll End Up" />
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: transitionDuration, ease }}
            >
              <div className="flex flex-wrap gap-3">
                {careerOutcomes.roles.map((role, i) => (
                  <motion.div
                    key={role}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.06, ease }}
                  >
                    <Badge variant="orange" className={cn("text-sm px-5 py-2", v === "activetheory" && "font-mono")}>
                      {role}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: transitionDuration, delay: 0.2, ease }}
              className="space-y-6"
            >
              <div>
                <p className={cn("text-gray-500 text-sm uppercase tracking-widest mb-2", v === "activetheory" && "font-mono text-cyan-500/50")}>
                  Expected Salary Range
                </p>
                <p className={cn(
                  "text-4xl font-bold text-navy-900",
                  v === "redbull" && "rb-fluid-h2",
                  v === "activetheory" && "font-mono",
                )}>
                  {careerOutcomes.salaryRange}
                </p>
              </div>
              <div
                className={cn(
                  "inline-flex items-center gap-3 px-6 py-3 rounded-xl border",
                  v === "orano" && "orano-brightness",
                  v === "activetheory" && "at-spring-enter",
                  v === "redbull" && "btn-border-glow",
                )}
                style={{ borderColor: `${color}55`, backgroundColor: `${color}11` }}
              >
                {v === "activetheory" && <DotFlash />}
                <span className="text-2xl">✦</span>
                <span className={cn("text-navy-900 font-semibold", v === "activetheory" && "font-mono")}>Only 100% Placement. No guarantee or assistance</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==================== FAQ ==================== */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal>
            <SectionHeading label="FAQ" title="Common Questions" />
          </ScrollReveal>
          <div className="mt-16">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                className={cn(v === "orano" && "orano-card")}
                initial={{ opacity: 0, y: v === "orano" ? 10 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: transitionDuration, delay: i * 0.06, ease }}
              >
                <AccordionItem title={faq.question} defaultOpen={i === 0}>
                  {faq.answer}
                </AccordionItem>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== ENROLLMENT CTA ==================== */}
      <section id="enroll" className={cn("py-32 px-6 bg-gray-50", v === "redbull" && "rb-scanlines")}>
        <div className="max-w-4xl mx-auto text-center relative">
          <motion.h2
            className={cn(
              "text-4xl md:text-6xl font-bold text-navy-900 mb-6",
              v === "redbull" && "rb-fluid-h1",
              v === "activetheory" && "font-mono",
            )}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: transitionDuration, ease }}
          >
            {v === "activetheory" ? <TerminalText>Ready to Start?</TerminalText> : "Ready to Start?"}
          </motion.h2>
          <motion.p
            className="text-gray-600 text-lg max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: transitionDuration, delay: 0.15, ease }}
          >
            500+ people have already made the switch through Linkway.
            The next batch is filling up - and your seat won't hold itself.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: transitionDuration, delay: 0.3, ease }}
          >
            <MagneticWrap>
              <div className="pulse-corners text-orange-500">
                <Button variant="primary" size="lg" onClick={openEnquiry} className={cn(
                  v === "orano" && "btn-border-glow orano-focus",
                  v === "activetheory" && "at-spring-enter",
                )}>
                  Enroll Now
                </Button>
              </div>
            </MagneticWrap>
            <MagneticWrap>
              <Button variant="outline" size="lg" href="/contact" className={cn(
                v === "orano" && "orano-brightness",
                v === "activetheory" && "at-spring-enter",
                v === "redbull" && "btn-border-glow",
              )}>
                Talk to a Counselor
              </Button>
            </MagneticWrap>
          </motion.div>
        </div>
      </section>
    </div>
    </ThemeProvider>
  );
}
