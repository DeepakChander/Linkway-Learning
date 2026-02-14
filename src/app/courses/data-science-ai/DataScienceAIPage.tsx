"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Counter from "@/components/animation/Counter";
import ScrollReveal from "@/components/animation/ScrollReveal";
import ToolLogo from "@/components/ui/ToolLogo";
import { useEnquiryModal } from "@/components/forms/EnquiryModal";
import { usePurchaseModal } from "@/components/forms/PurchaseModal";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/lib/theme";
import FooterCTA from "@/components/sections/FooterCTA";

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════════
   COLOR SYSTEM - Linkway brand
   ═══════════════════════════════════════════════════════ */

const BRAND_ORANGE = "#F58220";
const BRAND_NAVY = "#0D1B2A";
const ACCENT_BLUE = "#3B82F6";
const ACCENT_CYAN = "#06B6D4";
const DARK_BG = "#0a0e18";

/* ─── Easing ─── */
const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

/* ═══════════════════════════════════════════════════════
   UTILITY COMPONENTS
   ═══════════════════════════════════════════════════════ */

/* Typing animation - inspired by Codecademy */
function TypeWriter({ words, className }: { words: string[]; className?: string }) {
  const [wordIdx, setWordIdx] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[wordIdx];
    const timeout = deleting ? 40 : 80;

    if (!deleting && text === word) {
      const pause = setTimeout(() => setDeleting(true), 2000);
      return () => clearTimeout(pause);
    }
    if (deleting && text === "") {
      setDeleting(false);
      setWordIdx((prev) => (prev + 1) % words.length);
      return;
    }

    const timer = setTimeout(() => {
      setText(deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1));
    }, timeout);
    return () => clearTimeout(timer);
  }, [text, deleting, wordIdx, words]);

  return (
    <span className={className}>
      {text}
      <span className="inline-block w-[3px] h-[1em] ml-1 align-middle animate-pulse" style={{ backgroundColor: BRAND_ORANGE }} />
    </span>
  );
}

/* Magnetic hover */
function Magnetic({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 20 });
  const springY = useSpring(y, { stiffness: 200, damping: 20 });

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: springX, y: springY }}
      onMouseMove={(e) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        x.set((e.clientX - rect.left - rect.width / 2) * 0.12);
        y.set((e.clientY - rect.top - rect.height / 2) * 0.12);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
    >
      {children}
    </motion.div>
  );
}

/* Slide-in from direction - Panorama-inspired */
function SlideIn({ children, direction = "up", delay = 0, className }: { children: React.ReactNode; direction?: "up" | "down" | "left" | "right"; delay?: number; className?: string }) {
  const offsets = { up: { y: 40 }, down: { y: -40 }, left: { x: -50 }, right: { x: 50 } };
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x: 0, y: 0, ...offsets[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.6, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

/* Card with subtle mouse-track glow */
function Card({ children, className, accent = ACCENT_BLUE }: { children: React.ReactNode; className?: string; accent?: string }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);
  const onMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
  }, []);

  return (
    <motion.div
      ref={ref}
      className={cn("relative group rounded-2xl overflow-hidden", className)}
      onMouseMove={onMove}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(350px circle at ${pos.x}px ${pos.y}px, ${accent}14, transparent 60%)` }}
      />
      <div className="absolute inset-0 rounded-2xl border border-gray-200 group-hover:border-gray-300 transition-colors duration-300 pointer-events-none" />
      <div className="relative bg-white rounded-2xl p-6 shadow-[0_1px_8px_rgba(0,0,0,0.04)] group-hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-shadow duration-300">
        {children}
      </div>
    </motion.div>
  );
}

/* Section label pill */
function SectionLabel({ children, center = false, light = false }: { children: React.ReactNode; center?: boolean; light?: boolean }) {
  return (
    <div className={cn("flex items-center gap-3 mb-4", center && "justify-center")}>
      <span className={cn(
        "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-[0.15em] uppercase",
        light ? "bg-white/10 text-white/70 border border-white/10" : "bg-orange-50 border border-orange-100"
      )} style={!light ? { color: BRAND_ORANGE } : undefined}>
        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: light ? "#fff" : BRAND_ORANGE, opacity: light ? 0.5 : 1 }} />
        {children}
      </span>
    </div>
  );
}

/* Stat card - Panorama-inspired */
function StatCard({ value, suffix, label, icon: Icon, delay = 0, accent = BRAND_ORANGE }: { value: number; suffix: string; label: string; icon: React.FC<{ className?: string; style?: React.CSSProperties }>; delay?: number; accent?: string }) {
  return (
    <SlideIn direction="up" delay={delay}>
      <div className="relative bg-white rounded-2xl border border-gray-100 p-6 text-center overflow-hidden group hover:border-gray-200 transition-colors duration-300">
        <div className="absolute top-3 right-3 opacity-[0.06] group-hover:opacity-[0.1] transition-opacity duration-500">
          <Icon className="w-14 h-14" style={{ color: accent }} />
        </div>
        <div className="text-4xl md:text-5xl font-bold mb-1.5" style={{ color: BRAND_NAVY }}>
          <Counter target={value} suffix={suffix} duration={2} />
        </div>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
      </div>
    </SlideIn>
  );
}

/* Horizontal divider line */
function Divider({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className={cn("relative h-px w-full overflow-hidden", className)}>
      <motion.div
        className="absolute inset-0"
        style={{ background: `linear-gradient(90deg, transparent, ${BRAND_ORANGE}30, ${ACCENT_BLUE}30, transparent)` }}
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.2, ease }}
      />
    </div>
  );
}

/* Program Offer Icons - for What Our Program Offers section */
function ProgramOfferIcon({ type }: { type: string }) {
  const iconClass = "w-5 h-5 text-orange-500";
  const icons: Record<string, React.ReactNode> = {
    mentorship: <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg>,
    video: <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" /></svg>,
    live: <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" /></svg>,
    path: <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" /></svg>,
    hackathon: <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.39 48.39 0 01-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 01-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 00-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 01-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 00.657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 005.427-.63 48.05 48.05 0 00.582-4.717.532.532 0 00-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.96.401v0a.656.656 0 00.658-.663 48.422 48.422 0 00-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 01-.61-.58v0z" /></svg>,
    assessment: <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" /></svg>,
    career: <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>,
    expert: <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" /></svg>,
    workshop: <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>,
    placement: <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" /></svg>,
    network: <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg>,
    interview: <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" /></svg>,
    material: <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>,
    support: <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" /></svg>,
    certificate: <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" /></svg>,
    flexible: <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    project: <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" /></svg>,
    platform: <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" /></svg>,
    progress: <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>,
    networking: <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" /></svg>,
  };
  return icons[type] || icons.mentorship;
}

/* ═══════════════════════════════════════════════════════
   TESTIMONIAL CAROUSEL - Premium 3D tilt glassmorphism
   ═══════════════════════════════════════════════════════ */
const learnerTestimonials = [
  { name: "Aditya Srivastava", from: "Full-Stack Dev", to: "Data Scientist", company: "Globussoft", exp: "3 yrs exp.", accentFrom: "#8b5cf6", accentTo: "#a78bfa", gradientBg: "linear-gradient(135deg, #f5f3ff, #ddd6fe 40%, #ffffff)", desc: "I could code, but I didn't know ML. Linkway filled that gap with real projects - computer vision, forecasting, the works." },
  { name: "Priya Mehta", from: "Graphic Designer", to: "Data Scientist", company: "Meesho", exp: "2 yrs exp.", accentFrom: "#f97316", accentTo: "#fb923c", gradientBg: "linear-gradient(135deg, #fff7ed, #fed7aa 40%, #ffffff)", desc: "From design to data, Linkway taught me how to think analytically. I learned Python, ML, and dashboarding. My fashion image classification project clicked with Meesho." },
  { name: "Sameer Joshi", from: "Mechanical Eng.", to: "ML Engineer", company: "TCS Research", exp: "2 yrs exp.", accentFrom: "#10b981", accentTo: "#34d399", gradientBg: "linear-gradient(135deg, #ecfdf5, #d1fae5 40%, #ffffff)", desc: "Engineering taught me problem-solving. Linkway taught me to solve problems with neural networks. Now I'm building predictive maintenance models at TCS." },
  { name: "Neha Gupta", from: "BCA Graduate", to: "AI Engineer", company: "Fractal Analytics", exp: "1.5 yrs exp.", accentFrom: "#0ea5e9", accentTo: "#38bdf8", gradientBg: "linear-gradient(135deg, #f0f9ff, #bae6fd 40%, #ffffff)", desc: "Fresh out of BCA, I had no idea what ML actually was. 12 months later, I'm deploying NLP models in production at Fractal. The projects made all the difference." },
  { name: "Vikram Rathore", from: "Pharmacist", to: "Data Scientist", company: "Novartis", exp: "2 yrs exp.", accentFrom: "#eab308", accentTo: "#facc15", gradientBg: "linear-gradient(135deg, #fefce8, #fef9c3 40%, #ffffff)", desc: "Pharmacy + data science is an unusual combo, but Linkway helped me see the connection. Now I'm doing drug discovery analytics at Novartis." },
  { name: "Riya Patel", from: "Stats Grad", to: "MLOps Engineer", company: "PhonePe", exp: "1 yr exp.", accentFrom: "#f43f5e", accentTo: "#fb7185", gradientBg: "linear-gradient(135deg, #fff1f2, #fecdd3 40%, #ffffff)", desc: "Statistics was my strength. Linkway taught me to deploy those stats as ML pipelines. PhonePe hired me for exactly that skill set." },
];

function TestimonialCard3D({ t, index }: { t: typeof learnerTestimonials[number]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const smoothX = useSpring(rotateX, { stiffness: 150, damping: 20 });
  const smoothY = useSpring(rotateY, { stiffness: 150, damping: 20 });
  const glowX = useMotionValue(50);
  const glowY = useMotionValue(50);

  const handleMouse = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    rotateX.set((py - 0.5) * -10);
    rotateY.set((px - 0.5) * 10);
    glowX.set(px * 100);
    glowY.set(py * 100);
  }, [rotateX, rotateY, glowX, glowY]);

  return (
    <motion.div
      ref={cardRef}
      className="shrink-0 w-[340px] md:w-[400px]"
      style={{ perspective: 1200 }}
      onMouseMove={handleMouse}
      onMouseLeave={() => { rotateX.set(0); rotateY.set(0); glowX.set(50); glowY.set(50); }}
    >
      <motion.div
        className="relative h-full rounded-3xl overflow-hidden border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:shadow-[0_24px_64px_rgba(0,0,0,0.15)] transition-shadow duration-700"
        style={{ rotateX: smoothX, rotateY: smoothY, transformStyle: "preserve-3d", background: t.gradientBg }}
      >
        <motion.div
          className="absolute -top-10 -right-10 w-36 h-36 rounded-full blur-3xl pointer-events-none"
          style={{ backgroundColor: t.accentFrom, opacity: 0.12 }}
          animate={{ scale: [1, 1.3, 1], x: [0, 8, 0], y: [0, -5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: index * 0.4 }}
        />
        <motion.div
          className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full blur-3xl pointer-events-none"
          style={{ backgroundColor: t.accentTo, opacity: 0.1 }}
          animate={{ scale: [1.2, 0.9, 1.2], x: [0, -6, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: index * 0.6 }}
        />

        <div className="relative p-7 pb-6" style={{ transform: "translateZ(40px)" }}>
          <svg className="absolute top-2 right-4 w-20 h-20 pointer-events-none" viewBox="0 0 64 64" fill="none">
            <path d="M20 34c0-6.627 5.373-12 12-12v-6c-9.941 0-18 8.059-18 18v12h18V34H20zm24 0c0-6.627 5.373-12 12-12v-6c-9.941 0-18 8.059-18 18v12h18V34H44z" fill={t.accentFrom} opacity="0.06" />
          </svg>

          <div className="flex items-center gap-3 mb-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase backdrop-blur-md" style={{ backgroundColor: `${t.accentFrom}10`, color: t.accentFrom, border: `1.5px solid ${t.accentFrom}20`, boxShadow: `0 0 12px ${t.accentFrom}08` }}>
              <motion.span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: t.accentFrom }} animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }} transition={{ duration: 2, repeat: Infinity }} />
              {t.exp}
            </span>
            <motion.div className="flex-1 h-[1.5px] rounded-full origin-left" style={{ background: `linear-gradient(90deg, ${t.accentFrom}35, ${t.accentTo}15, transparent)` }} initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.3 }} />
          </div>

          <p className="text-[14px] text-gray-700 leading-[1.8] mb-7 relative z-10 font-[450]">
            &ldquo;{t.desc}&rdquo;
          </p>

          <div className="h-[1.5px] mb-5 rounded-full" style={{ background: `linear-gradient(90deg, ${t.accentFrom}20, ${t.accentTo}12, transparent)` }} />

          <div className="flex items-center gap-3.5">
            <div className="relative">
              <motion.div className="absolute -inset-[2.5px] rounded-full" style={{ background: `conic-gradient(from 0deg, ${t.accentFrom}, ${t.accentTo}, transparent, ${t.accentFrom})` }} animate={{ rotate: 360 }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }} />
              <div className="relative w-11 h-11 rounded-full flex items-center justify-center text-[13px] font-bold text-white shadow-lg" style={{ background: `linear-gradient(135deg, ${t.accentFrom}, ${t.accentTo})` }}>
                {t.name.split(" ").map(n => n[0]).join("")}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-gray-900 text-[15px] leading-tight truncate">{t.name}</h4>
              <p className="text-[11.5px] text-gray-500 mt-0.5 font-medium">
                {t.from} <motion.span className="inline-block" style={{ color: t.accentFrom }} animate={{ x: [0, 3, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>&rarr;</motion.span> {t.to}, <span className="font-semibold text-gray-600">{t.company}</span>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function TestimonialCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    requestAnimationFrame(() => {
      const oneSetWidth = track.scrollWidth / 2;
      tweenRef.current = gsap.fromTo(track, { x: 0 }, { x: -oneSetWidth, duration: 50, ease: "none", repeat: -1 });
    });
    return () => { tweenRef.current?.kill(); };
  }, []);

  return (
    <div className="mt-16 relative" onMouseEnter={() => tweenRef.current?.pause()} onMouseLeave={() => tweenRef.current?.resume()}>
      <div className="absolute left-0 top-0 bottom-0 w-16 md:w-44 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, #f1f5f9, transparent)' }} />
      <div className="absolute right-0 top-0 bottom-0 w-16 md:w-44 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, #f1f5f9, transparent)' }} />

      <div className="overflow-hidden py-6">
        <div ref={trackRef} className="flex gap-7 w-max" style={{ willChange: "transform" }}>
          {[...learnerTestimonials, ...learnerTestimonials].map((t, i) => (
            <TestimonialCard3D key={`${t.name}-${i}`} t={t} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* SVG wave section divider - Clever-inspired */
function WaveDivider({ flip = false, from = "#f9fafb", to = "#ffffff" }: { flip?: boolean; from?: string; to?: string }) {
  return (
    <div className={cn("w-full overflow-hidden leading-[0]", flip && "rotate-180")} style={{ backgroundColor: from }}>
      <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-[40px] md:h-[60px]">
        <path d="M0,30 C360,60 720,0 1080,30 C1260,45 1380,35 1440,30 L1440,60 L0,60 Z" fill={to} />
      </svg>
    </div>
  );
}

/* Project Card - for infinite scroll carousel */
function ProjectCard({ project }: { project: { title: string; domain: string; tags: string[]; color: string; desc: string } }) {
  return (
    <div className="shrink-0 w-[300px] md:w-[340px]">
      <div className="h-full rounded-xl p-5 border border-[#e5e4e0] hover:border-[#d5d4d0] transition-all duration-300 group shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]" style={{ backgroundColor: "#F8F7F4" }}>
        {/* Domain badge */}
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-semibold tracking-wide uppercase" style={{ backgroundColor: `${project.color}15`, color: project.color }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: project.color }} />
            {project.domain}
          </span>
        </div>

        {/* Title */}
        <h4 className="text-[15px] font-bold text-gray-900 group-hover:text-gray-800 transition-colors duration-300 mb-2 leading-snug">
          {project.title}
        </h4>

        {/* Description */}
        <p className="text-xs text-gray-600 group-hover:text-gray-700 transition-colors duration-300 leading-relaxed mb-4">
          {project.desc}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span key={tag} className="px-2 py-0.5 rounded text-[10px] font-mono font-medium text-gray-500 bg-white/60 border border-[#e5e4e0]">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Project Carousel with infinite scroll */
function ProjectCarousel({ projects }: { projects: { title: string; domain: string; tags: string[]; color: string; desc: string }[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    requestAnimationFrame(() => {
      const oneSetWidth = track.scrollWidth / 2;
      tweenRef.current = gsap.fromTo(track, { x: 0 }, { x: -oneSetWidth, duration: 90, ease: "none", repeat: -1 });
    });
    return () => { tweenRef.current?.kill(); };
  }, []);

  return (
    <div className="mt-10 relative" onMouseEnter={() => tweenRef.current?.pause()} onMouseLeave={() => tweenRef.current?.resume()}>
      <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, #0a0e18, transparent)' }} />
      <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, #0a0e18, transparent)' }} />

      <div className="overflow-hidden py-2">
        <div ref={trackRef} className="flex gap-4 w-max" style={{ willChange: "transform" }}>
          {[...projects, ...projects].map((project, i) => (
            <ProjectCard key={`${project.title}-${i}`} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* FAQ Item */
function FAQItem({ question, answer, isOpen, onClick, index }: { question: string; answer: string; isOpen: boolean; onClick: () => void; index: number }) {
  return (
    <motion.div
      className="border-b border-gray-200 last:border-b-0"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
    >
      <button onClick={onClick} className="flex items-center justify-between w-full py-5 text-left group cursor-pointer">
        <span className="text-base md:text-lg font-medium text-navy-900 group-hover:text-orange-500 transition-colors pr-4">{question}</span>
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
          <ChevronIcon className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-gray-600 leading-relaxed text-[15px]">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Hero Image Carousel ─── */
const heroImages = [
  "/images/data-science-ai/hero-1.png",
  "/images/data-science-ai/hero-2.png",
  "/images/data-science-ai/hero-3.png",
  "/images/data-science-ai/hero-4.png",
];

function HeroImageCarousel({ className }: { className?: string }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const variants = {
    enter: (dir: number) => ({
      clipPath: dir > 0
        ? "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)"
        : "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
      scale: 1.1,
    }),
    center: {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      scale: 1,
    },
    exit: (dir: number) => ({
      clipPath: dir > 0
        ? "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)"
        : "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)",
      scale: 1.05,
    }),
  };

  return (
    <div className={cn("relative rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl aspect-[4/3] group", className)}>
      <motion.div
        className="absolute -inset-4 rounded-3xl opacity-40 blur-2xl -z-10"
        style={{ background: `radial-gradient(ellipse at center, ${BRAND_ORANGE}40, transparent 70%)` }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <AnimatePresence initial={false} custom={direction} mode="sync">
        <motion.div
          key={current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 1, ease: [0.77, 0, 0.175, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={heroImages[current]}
            alt="Data Science AI professional"
            fill
            className="object-cover"
            priority={current === 0}
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </motion.div>
      </AnimatePresence>
      <div className="absolute bottom-0 inset-x-0 h-[3px] bg-white/10 z-10">
        <motion.div
          key={current}
          className="h-full"
          style={{ background: `linear-gradient(90deg, ${BRAND_ORANGE}, ${ACCENT_CYAN})` }}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 4, ease: "linear" }}
        />
      </div>
      <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 rounded-tl-sm pointer-events-none" style={{ borderColor: `${BRAND_ORANGE}80` }} />
      <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 rounded-br-sm pointer-events-none" style={{ borderColor: `${BRAND_ORANGE}80` }} />
    </div>
  );
}

/* ─── SVG Icons ─── */

function ArrowRightIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>;
}
function UserIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M20 21a8 8 0 10-16 0" /></svg>;
}
function BriefcaseIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" /></svg>;
}
function GraduationIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10l-10-5L2 10l10 5 10-5z" /><path d="M6 12v5c0 2 3 3 6 3s6-1 6-3v-5" /><path d="M22 10v6" /></svg>;
}
function RocketIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z" /><path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" /></svg>;
}
function TargetIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>;
}
function CheckCircleIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="9 12 11 14 15 10" /></svg>;
}
function ShieldIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" /></svg>;
}
function CurrencyIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>;
}
function SparklesIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L13.09 8.26L18 6L14.74 10.91L21 12L14.74 13.09L18 18L13.09 15.74L12 22L10.91 15.74L6 18L9.26 13.09L3 12L9.26 10.91L6 6L10.91 8.26L12 2Z" /></svg>;
}
function ChevronIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>;
}
function LayersIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>;
}
function ClockIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
}
function HeadsetIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0118 0v6" /><path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z" /></svg>;
}
function MicrosoftLogo({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none">
      <rect x="1" y="1" width="10" height="10" fill="#F25022" />
      <rect x="13" y="1" width="10" height="10" fill="#7FBA00" />
      <rect x="1" y="13" width="10" height="10" fill="#00A4EF" />
      <rect x="13" y="13" width="10" height="10" fill="#FFB900" />
    </svg>
  );
}
function VideoIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 7l-7 5 7 5V7z" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg>;
}

/* ─── Interactive Dashboard Preview ─── */
function DashboardPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const [activeTab, setActiveTab] = useState(0);

  const kpis = [
    { label: "Model Accuracy", value: "96.3%", change: "+2.1%", up: true },
    { label: "F1 Score", value: "0.94", change: "+0.05", up: true },
    { label: "Training Loss", value: "0.003", change: "-0.012", up: false },
    { label: "Inference", value: "12ms", change: "-3ms", up: false },
  ];

  const tabs = ["Training", "Metrics", "Deploy"];

  const bars = [
    { label: "Jan", h: 40 }, { label: "Feb", h: 55 }, { label: "Mar", h: 45 },
    { label: "Apr", h: 70 }, { label: "May", h: 62 }, { label: "Jun", h: 85 },
    { label: "Jul", h: 78 }, { label: "Aug", h: 90 }, { label: "Sep", h: 72 },
    { label: "Oct", h: 95 }, { label: "Nov", h: 88 }, { label: "Dec", h: 100 },
  ];

  const donutData = [
    { label: "CNN", pct: 38, color: BRAND_ORANGE },
    { label: "Transformer", pct: 28, color: ACCENT_BLUE },
    { label: "RNN", pct: 20, color: ACCENT_CYAN },
    { label: "Other", pct: 14, color: "#7ee787" },
  ];

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  let cumulativeOffset = 0;

  return (
    <div ref={ref} className="rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl bg-[#0d1117]">
      <div className="flex items-center justify-between px-5 py-3 bg-[#1a1e2e] border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <span className="text-xs font-mono text-gray-500">ml_training_monitor.py</span>
        </div>
        <div className="flex gap-1">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`px-3 py-1 rounded-md text-[11px] font-medium transition-all duration-200 ${
                activeTab === i
                  ? "bg-white/[0.1] text-white"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5 space-y-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {kpis.map((kpi, i) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="rounded-xl bg-white/[0.04] border border-white/[0.06] p-3.5 hover:border-white/[0.12] transition-colors duration-300"
            >
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">{kpi.label}</p>
              <p className="text-xl font-bold text-white mt-1 font-mono">{kpi.value}</p>
              <span className={`text-[11px] font-mono font-medium ${kpi.up ? "text-[#7ee787]" : "text-[#7ee787]"}`}>
                {kpi.change}
              </span>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="md:col-span-2 rounded-xl bg-white/[0.03] border border-white/[0.06] p-4"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-medium text-gray-400">Training Progress</p>
              <span className="text-[10px] text-gray-600 font-mono">50 epochs</span>
            </div>
            <div className="flex items-end gap-[6px] h-32">
              {bars.map((bar, i) => (
                <div key={bar.label} className="flex-1 flex flex-col items-center h-full justify-end">
                  <motion.div
                    className="w-full rounded-t-sm min-h-[2px]"
                    style={{
                      background: i >= 9
                        ? `linear-gradient(180deg, ${BRAND_ORANGE}, ${BRAND_ORANGE}80)`
                        : `linear-gradient(180deg, ${ACCENT_BLUE}90, ${ACCENT_BLUE}40)`,
                      height: 0,
                    }}
                    initial={{ height: 0 }}
                    animate={inView ? { height: `${bar.h}%` } : { height: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 + i * 0.05, ease: "easeOut" }}
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-[6px] mt-1">
              {bars.map((bar) => (
                <span key={bar.label} className="flex-1 text-center text-[8px] text-gray-600">{bar.label}</span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4"
          >
            <p className="text-xs font-medium text-gray-400 mb-3">Model Architecture</p>
            <div className="flex justify-center">
              <svg viewBox="0 0 100 100" className="w-28 h-28">
                {donutData.map((seg) => {
                  const dashLength = (seg.pct / 100) * circumference;
                  const offset = cumulativeOffset;
                  cumulativeOffset += dashLength;
                  return (
                    <motion.circle
                      key={seg.label}
                      cx="50" cy="50" r={radius}
                      fill="none"
                      stroke={seg.color}
                      strokeWidth="10"
                      strokeDasharray={`${dashLength} ${circumference - dashLength}`}
                      strokeDashoffset={-offset}
                      strokeLinecap="round"
                      initial={{ opacity: 0 }}
                      animate={inView ? { opacity: 1 } : {}}
                      transition={{ duration: 0.5, delay: 0.8 }}
                      className="origin-center -rotate-90"
                      style={{ transformOrigin: "50px 50px" }}
                    />
                  );
                })}
              </svg>
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 mt-3">
              {donutData.map((seg) => (
                <div key={seg.label} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
                  <span className="text-[10px] text-gray-500">{seg.label}</span>
                  <span className="text-[10px] text-gray-400 font-mono ml-auto">{seg.pct}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-5 pt-2 border-t border-white/[0.04]">
          {[
            { label: "Models", value: "5", color: BRAND_ORANGE },
            { label: "Datasets", value: "10+", color: ACCENT_BLUE },
            { label: "Parameters", value: "1M+", color: ACCENT_CYAN },
            { label: "Deployed", value: "100%", color: "#7ee787" },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-1.5">
              <span className="text-sm font-bold font-mono" style={{ color: s.color }}>{s.value}</span>
              <span className="text-[10px] text-gray-600">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════ */

export default function DataScienceAIPage() {
  const { openEnquiry } = useEnquiryModal();
  const { openPurchase } = usePurchaseModal();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  const [openFaq, setOpenFaq] = useState(0);
  const [activeTab, setActiveTab] = useState(-1);

  /* ── Data ── */
  const personas = [
    { icon: RocketIcon, title: "Future Data Scientists", desc: "You know data is where the world is heading. This program takes you from the fundamentals all the way to building production AI systems.", color: BRAND_ORANGE },
    { icon: BriefcaseIcon, title: "Developers Who Want AI Skills", desc: "You can already code. Now add ML, deep learning, and MLOps to your toolkit and become the person companies fight to hire.", color: ACCENT_BLUE },
    { icon: UserIcon, title: "Career Changers", desc: "Doesn't matter what you did before. This 12-month program teaches everything from scratch - no prior ML experience needed.", color: ACCENT_CYAN },
    { icon: GraduationIcon, title: "AI Enthusiasts", desc: "If you're fascinated by neural networks, NLP, and generative AI, this is where you go from reading about it to actually building it.", color: BRAND_ORANGE },
  ];

  const curriculum = [
    {
      title: "Data Science Foundations",
      weeks: 6,
      projects: 5,
      description: "Every data scientist needs a toolkit they can trust before touching a model. This module lays that groundwork - starting with Excel for rapid business analysis, then moving into Python and R for programmatic data manipulation. You will also build core statistical thinking and learn to tell compelling stories through visualizations using industry-standard tools.",
      outcomes: [
        "Excel for analytics: advanced functions, pivot tables, interactive dashboards, and forecasting",
        "Python programming: loops, functions, OOP, and working with NumPy and Pandas",
        "R programming fundamentals: syntax, data structures, and exploratory analysis",
        "Statistics and probability: hypothesis testing, probability distributions, and confidence intervals",
        "Data visualization with Matplotlib, Seaborn, Tableau, and Power BI",
        "Building end-to-end analytical reports from raw datasets",
      ],
      tools: ["Excel", "Python", "R", "NumPy", "Pandas", "Matplotlib", "Seaborn", "Tableau", "Power BI"],
      iconPath: "M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
    },
    {
      title: "Data Wrangling & Exploratory Analysis",
      weeks: 5,
      projects: 4,
      description: "Real-world data is messy, incomplete, and full of surprises. This module teaches you to transform chaotic raw data into clean, analysis-ready datasets. You will master the art of detecting hidden patterns, engineering meaningful features, and conducting thorough exploratory analysis that sets the stage for powerful ML models.",
      outcomes: [
        "Data cleaning: handling missing values, detecting outliers, and removing duplicates",
        "Feature scaling and normalization for optimal model performance",
        "Categorical variable encoding: one-hot, label, target, and ordinal encoding",
        "Feature engineering: creating high-impact predictive features from raw data",
        "Exploratory Data Analysis (EDA): trend detection, correlation analysis, and anomaly identification",
        "Building reproducible data transformation pipelines with Pandas",
      ],
      tools: ["Python", "Pandas", "NumPy", "Seaborn", "Plotly", "Jupyter"],
      iconPath: "M3 3v18h18M7 16l4-4 4 4 6-6m0 0v4m0-4h-4",
    },
    {
      title: "Machine Learning & Predictive Modeling",
      weeks: 6,
      projects: 6,
      description: "This is where your data science skills start delivering real business value. You will go beyond calling fit and predict - learning why each algorithm works, when to choose one over another, and how to rigorously evaluate your results. From simple regressions to powerful ensemble methods, you will build models that actually perform in production.",
      outcomes: [
        "Supervised learning: Linear Regression, Logistic Regression, Decision Trees, and SVMs",
        "Ensemble methods: Random Forest, Gradient Boosting, XGBoost, and LightGBM",
        "Unsupervised learning: K-Means, DBSCAN clustering, and hierarchical methods",
        "Dimensionality reduction: PCA, LDA, and t-SNE for high-dimensional data",
        "Model evaluation: cross-validation, confusion matrix, ROC-AUC, F1 Score, and precision-recall",
        "Hyperparameter tuning and preventing overfitting with regularization techniques",
      ],
      tools: ["Scikit-learn", "XGBoost", "Python", "MLflow", "Jupyter"],
      iconPath: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
    },
    {
      title: "Deep Learning & NLP",
      weeks: 7,
      projects: 5,
      description: "Neural networks are the backbone of modern AI - from image recognition to conversational assistants. This module takes you deep into how neural networks learn, then applies that knowledge across computer vision with CNNs, sequence modeling with RNNs, and language understanding with Transformers. You will also explore the generative AI landscape with GANs and autoencoders.",
      outcomes: [
        "Neural network architecture: backpropagation, activation functions, and optimization",
        "CNNs for image recognition, object detection, and visual feature extraction",
        "RNNs and LSTMs for sequence modeling, time-series, and sentiment analysis",
        "NLP with Transformers: understanding BERT, GPT, and modern language models",
        "Generative AI fundamentals: GANs, variational autoencoders, and creative applications",
        "Transfer learning and fine-tuning pre-trained models for domain-specific tasks",
      ],
      tools: ["PyTorch", "TensorFlow", "Keras", "HuggingFace", "SpaCy", "Google Colab"],
      iconPath: "M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5",
    },
    {
      title: "Time Series, Recommenders & Big Data",
      weeks: 5,
      projects: 4,
      description: "Specialized data problems require specialized solutions. This module covers three critical domains that top companies rely on daily - forecasting future trends with time-series models, building personalized recommendation engines like Netflix and Amazon, and processing massive datasets at scale using distributed computing frameworks.",
      outcomes: [
        "Time-series forecasting with ARIMA, SARIMA, and Facebook Prophet",
        "Recommender systems: collaborative filtering, content-based, and hybrid approaches",
        "Advanced SQL: complex joins, CTEs, window functions, and stored procedures",
        "Big data processing with Apache Spark, SparkSQL, and PySpark",
        "Building scalable data pipelines for real-time and batch processing",
        "Handling streaming data and working with distributed storage systems",
      ],
      tools: ["Python", "Spark", "PySpark", "SQL", "PostgreSQL", "MongoDB", "Statsmodels"],
      iconPath: "M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z",
    },
    {
      title: "MLOps & Cloud Deployment",
      weeks: 5,
      projects: 4,
      description: "A model sitting in a Jupyter notebook delivers zero business value. This module teaches you to take models from experiment to production. You will containerize applications with Docker, build serving APIs with Flask, automate deployments with CI/CD pipelines, and set up monitoring to catch issues before they impact users - the exact workflow used at top tech companies.",
      outcomes: [
        "Cloud platform essentials: navigating AWS, GCP, and Azure for ML workloads",
        "Docker containerization for reproducible and portable ML environments",
        "Building and deploying ML model APIs with Flask and FastAPI",
        "CI/CD pipelines: automating model training, testing, and deployment workflows",
        "Model monitoring: tracking performance degradation, data drift, and retraining triggers",
        "End-to-end deployment: taking a trained model from notebook to scalable cloud service",
      ],
      tools: ["Docker", "Flask", "FastAPI", "AWS", "GCP", "Azure", "GitHub"],
      iconPath: "M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z",
    },
    {
      title: "Industry Specialization & Career Launchpad",
      weeks: 6,
      projects: 2,
      description: "Data science looks different in every industry. This final module lets you specialize in the domain that excites you most - whether it is Finance, E-Commerce, Healthcare, or HR Analytics. You will build end-to-end capstone projects that solve real business problems, then prepare for the job market with resume optimization, mock interviews, and direct recruiter connections.",
      outcomes: [
        "Domain specialization: apply data science to Finance, E-Commerce, Healthcare, or HR",
        "End-to-end capstone projects: problem scoping through deployment and presentation",
        "Portfolio development: professional GitHub repos, documentation, and demo videos",
        "Resume building: ATS-optimized profiles that stand out to hiring managers",
        "Mock interviews: technical rounds, case study walkthroughs, and HR preparation",
        "Career networking: recruiter access, industry mentorship, and placement support",
      ],
      tools: ["All Previous Tools", "GitHub", "Streamlit", "Notion"],
      iconPath: "M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.63 8.25m6 6.12l-3 3m0-12.75a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0z",
    },
  ]

  const tools = [
    // Row 1 - Core Python & ML Stack (12)
    "Python", "NumPy", "Pandas", "Scikit-learn", "XGBoost", "SciPy", "Matplotlib", "Seaborn", "Plotly", "Jupyter", "Google Colab", "Git",
    // Row 2 - Deep Learning, NLP & GenAI (12)
    "PyTorch", "TensorFlow", "Keras", "HuggingFace", "SpaCy", "FastAPI", "Docker", "AWS", "GCP", "Azure", "PostgreSQL", "MongoDB",
    // Row 3 - MLOps, Data & Complementary (12)
    "GitHub", "Spark", "Hadoop", "SQL", "Statsmodels", "Scrapy", "Flask", "Tableau", "Power BI", "Looker", "Google BigQuery", "R",
  ];

  const industryProjects = [
    // Machine Learning & Predictive Analytics
    { title: "Credit Risk Scoring Engine", domain: "Banking", tags: ["XGBoost", "SHAP", "FastAPI"], color: "#F97316", desc: "Ensemble ML model with explainable AI reducing loan defaults by 23%" },
    { title: "Real-time Fraud Detection", domain: "FinTech", tags: ["PyTorch", "Kafka", "Docker"], color: "#EF4444", desc: "Deep learning pipeline detecting fraudulent transactions in under 50ms" },
    { title: "Customer Churn Prediction", domain: "SaaS", tags: ["Scikit-learn", "XGBoost", "MLflow"], color: "#3B82F6", desc: "Proactive churn model saving $2.4M ARR with 94% precision" },
    { title: "Demand Forecasting System", domain: "Supply Chain", tags: ["Prophet", "PyTorch", "Airflow"], color: "#10B981", desc: "Time-series deep learning model with 96% MAPE accuracy" },
    // Deep Learning & Computer Vision
    { title: "Medical Image Classifier", domain: "Healthcare", tags: ["PyTorch", "ViT", "FastAPI"], color: "#EC4899", desc: "Vision Transformer detecting anomalies in X-rays at 98.2% accuracy" },
    { title: "Real-time Object Detection", domain: "Autonomous", tags: ["YOLOv8", "TensorFlow", "ONNX"], color: "#8B5CF6", desc: "Edge-deployed model processing 30 FPS on embedded hardware" },
    { title: "Quality Control Vision", domain: "Manufacturing", tags: ["PyTorch", "OpenCV", "Docker"], color: "#F59E0B", desc: "Computer vision detecting defects at 99.4% accuracy on production line" },
    { title: "Satellite Image Segmentation", domain: "GeoAI", tags: ["U-Net", "TensorFlow", "GCP"], color: "#06B6D4", desc: "Semantic segmentation for land-use classification from satellite data" },
    // NLP & Generative AI
    { title: "RAG-Powered Knowledge Base", domain: "GenAI", tags: ["LangChain", "Pinecone", "GPT-4"], color: "#A855F7", desc: "Enterprise RAG system answering questions from 100K+ documents" },
    { title: "Sentiment Analysis Pipeline", domain: "Brand", tags: ["BERT", "HuggingFace", "Flask"], color: "#06B6D4", desc: "NLP pipeline processing 500K+ social mentions daily with 93% accuracy" },
    { title: "AI Code Review Agent", domain: "DevTools", tags: ["LangChain", "FastAPI", "GitHub"], color: "#3B82F6", desc: "Multi-step AI agent reviewing PRs and suggesting improvements" },
    { title: "Multilingual Chatbot", domain: "Customer Support", tags: ["LLaMA", "LoRA", "Docker"], color: "#F97316", desc: "Fine-tuned LLM handling support queries in 8 languages" },
    // MLOps & Production Systems
    { title: "End-to-End MLOps Pipeline", domain: "MLOps", tags: ["Docker", "FastAPI", "GitHub Actions"], color: "#8B5CF6", desc: "Complete CI/CD pipeline with model registry and 12ms inference" },
    { title: "Model Monitoring Dashboard", domain: "MLOps", tags: ["MLflow", "Grafana", "AWS"], color: "#10B981", desc: "Real-time drift detection and performance monitoring for 15+ models" },
    { title: "Feature Store Platform", domain: "Data Infra", tags: ["PySpark", "Redis", "Airflow"], color: "#EF4444", desc: "Centralized feature store serving 50M+ feature vectors daily" },
    // Recommendation & Personalization
    { title: "Recommendation Engine", domain: "E-commerce", tags: ["PyTorch", "Redis", "FastAPI"], color: "#F59E0B", desc: "Hybrid collaborative filtering boosting engagement by 34%" },
    { title: "Content Personalization AI", domain: "Media", tags: ["TensorFlow", "BigQuery", "GCP"], color: "#EC4899", desc: "Deep learning personalization serving 10M+ users in real-time" },
    // Time Series & Financial
    { title: "Algorithmic Trading Bot", domain: "Finance", tags: ["PyTorch", "NumPy", "FastAPI"], color: "#3B82F6", desc: "LSTM-based trading signals with backtesting framework" },
    { title: "Energy Consumption Forecasting", domain: "Energy", tags: ["Prophet", "Scikit-learn", "Plotly"], color: "#10B981", desc: "Multi-variate forecasting reducing energy costs by 18%" },
    // Reinforcement Learning & Advanced AI
    { title: "Game AI with Deep RL", domain: "AI Research", tags: ["PyTorch", "Gymnasium", "Ray"], color: "#A855F7", desc: "Deep Q-Network agent mastering Atari games from pixels" },
    { title: "Autonomous Navigation Agent", domain: "Robotics", tags: ["PyTorch", "ROS", "Docker"], color: "#06B6D4", desc: "PPO-based agent navigating complex environments in simulation" },
    // Data Engineering & Analytics
    { title: "Real-time Analytics Pipeline", domain: "Data Infra", tags: ["PySpark", "Kafka", "BigQuery"], color: "#F97316", desc: "Stream processing pipeline handling 1M+ events per minute" },
    { title: "Customer 360 Platform", domain: "Analytics", tags: ["Python", "SQL", "Tableau"], color: "#8B5CF6", desc: "Unified customer view integrating data from 12+ sources" },
    { title: "Predictive Maintenance", domain: "IoT", tags: ["TensorFlow", "Azure", "Docker"], color: "#EF4444", desc: "Sensor-based ML reducing unplanned downtime by 45%" },
    { title: "Drug Discovery Pipeline", domain: "BioTech", tags: ["PyTorch", "RDKit", "FastAPI"], color: "#EC4899", desc: "Graph neural network predicting molecular properties for drug screening" },
  ];

  const faqs = [
    { question: "Who is this program designed for?", answer: "Aspiring data scientists, developers who want AI skills, career changers, and AI enthusiasts. No prior ML experience needed - we start from excel basics." },
    { question: "How is the program organized?", answer: "A blend of live mentor-led classes, recorded lessons, and hands-on projects across 7 modules over 12 months. Four structured phases take you from Excel to production AI." },
    { question: "Do I need a programming background to start a Data Science and AI course at Linkway Learning?", answer: "No prior programming experience is required. The course starts from basics and is beginner-friendly." },
    { question: "Which programming languages are essential for Data Science and AI at Linkway Learning?", answer: "Python is the primary language taught, along with R for data analysis tasks." },
    { question: "What career roles can I pursue after completion?", answer: "Data Scientist, ML Engineer, AI Engineer, NLP Engineer, MLOps Engineer, and Data Architect at top tech companies, startups, and research labs." },
    { question: "Who will be teaching the course?", answer: "Industry veterans from FAANG companies and AI research labs with 10+ years of hands-on data science and machine learning experience." },
    { question: "How does Linkway Learning help me get hired?", answer: "As a 100% placement program, we provide end-to-end career support including resume building, LinkedIn optimization, mock technical interviews, and direct introductions to 400+ hiring partners." },
    { question: "What are the prerequisites for enrolling in a Data Science and AI course at Linkway Learning?", answer: "No strict prerequisites are required. Basic math skills and a genuine curiosity for data and technology are all you need to get started - and even those are not mandatory. Our curriculum is built from the ground up, so we will equip you with every skill along the way." },
  ];

  const highlights = [
    { icon: ShieldIcon, label: "100% Placement", sub: "Personalized Path to Employment", color: BRAND_ORANGE },
    { icon: HeadsetIcon, label: "Unlimited 1:1 Doubt Clearing", sub: "Personal mentorship", color: ACCENT_BLUE },
    { icon: MicrosoftLogo, label: "Microsoft Certification", sub: "Exam prep included", color: ACCENT_CYAN },
    { icon: VideoIcon, label: "Live Interactive Classes", sub: "Learn from FAANG mentors", color: BRAND_ORANGE },
  ]

  return (
    <ThemeProvider theme="light">
    <div className="min-h-screen bg-white text-navy-900 selection:bg-orange-500/20 overflow-x-hidden">

      {/* ═══════ HERO - Dark section ═══════ */}
      <section ref={heroRef} className="relative min-h-[88vh] flex items-center overflow-hidden" style={{ backgroundColor: DARK_BG }}>
        {/* Decorative gradient orbs */}
        <div className="absolute inset-0" style={{
          background: `
            radial-gradient(ellipse 60% 45% at 20% 25%, ${BRAND_ORANGE}12 0%, transparent 55%),
            radial-gradient(ellipse 45% 35% at 80% 65%, ${ACCENT_BLUE}0c 0%, transparent 50%),
            linear-gradient(180deg, ${DARK_BG} 0%, #0c1220 50%, ${DARK_BG} 100%)
          `
        }} />
        <motion.div
          className="absolute w-[600px] h-[600px] -top-48 -right-48 rounded-full blur-[120px] pointer-events-none"
          animate={{ scale: [1, 1.12, 1], opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          style={{ background: `radial-gradient(circle, ${ACCENT_BLUE}20, transparent 70%)` }}
        />

        {/* Floating code fragments */}
        {[
          { text: "model.fit()", x: "8%", y: "15%", dur: 18, delay: 0 },
          { text: "import torch", x: "85%", y: "22%", dur: 22, delay: 2 },
          { text: "neural_net()", x: "72%", y: "75%", dur: 20, delay: 4 },
          { text: ".predict()", x: "15%", y: "70%", dur: 24, delay: 1 },
          { text: "loss: 0.003", x: "55%", y: "12%", dur: 19, delay: 3 },
          { text: "transformers", x: "90%", y: "55%", dur: 21, delay: 5 },
          { text: "epoch: 50/50", x: "30%", y: "85%", dur: 23, delay: 2 },
          { text: "accuracy: 96.3%", x: "45%", y: "90%", dur: 17, delay: 6 },
        ].map((frag, i) => (
          <motion.span
            key={i}
            className="absolute font-mono text-[11px] pointer-events-none select-none"
            style={{ left: frag.x, top: frag.y, color: `${ACCENT_BLUE}18` }}
            animate={{
              y: [0, -15, 0, 10, 0],
              x: [0, 8, -5, 3, 0],
              opacity: [0.15, 0.3, 0.15, 0.25, 0.15],
            }}
            transition={{ duration: frag.dur, repeat: Infinity, delay: frag.delay, ease: "easeInOut" }}
          >
            {frag.text}
          </motion.span>
        ))}

        {/* Animated grid dots */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <svg className="w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dotGrid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <circle cx="30" cy="30" r="1" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dotGrid)" />
          </svg>
        </div>

        {/* Animated data flow lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="flowGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={BRAND_ORANGE} stopOpacity="0" />
              <stop offset="50%" stopColor={BRAND_ORANGE} stopOpacity="0.12" />
              <stop offset="100%" stopColor={BRAND_ORANGE} stopOpacity="0" />
            </linearGradient>
            <linearGradient id="flowGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={ACCENT_BLUE} stopOpacity="0" />
              <stop offset="50%" stopColor={ACCENT_BLUE} stopOpacity="0.08" />
              <stop offset="100%" stopColor={ACCENT_BLUE} stopOpacity="0" />
            </linearGradient>
            <linearGradient id="flowGrad3" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={ACCENT_CYAN} stopOpacity="0" />
              <stop offset="50%" stopColor={ACCENT_CYAN} stopOpacity="0.06" />
              <stop offset="100%" stopColor={ACCENT_CYAN} stopOpacity="0" />
            </linearGradient>
          </defs>
          <motion.path d="M-100,200 C200,100 400,350 700,180 S1100,300 1500,150" fill="none" stroke="url(#flowGrad1)" strokeWidth="1.5" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 3, delay: 0.5, ease: "easeInOut" }} />
          <motion.path d="M-50,400 C250,300 500,500 800,350 S1200,450 1500,380" fill="none" stroke="url(#flowGrad2)" strokeWidth="1" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 3.5, delay: 1, ease: "easeInOut" }} />
          <motion.path d="M-80,550 C180,480 420,600 720,500 S1050,580 1500,520" fill="none" stroke="url(#flowGrad3)" strokeWidth="1" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 4, delay: 1.5, ease: "easeInOut" }} />
          <motion.circle r="3" fill={BRAND_ORANGE} opacity="0.4" animate={{ cx: [0, 350, 700, 1100, 1500], cy: [200, 150, 250, 200, 150] }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} />
          <motion.circle r="2.5" fill={ACCENT_BLUE} opacity="0.3" animate={{ cx: [0, 400, 800, 1200, 1500], cy: [400, 350, 450, 380, 380] }} transition={{ duration: 10, repeat: Infinity, ease: "linear", delay: 2 }} />
          <motion.circle r="2" fill={ACCENT_CYAN} opacity="0.25" animate={{ cx: [0, 300, 600, 1000, 1500], cy: [550, 500, 560, 520, 520] }} transition={{ duration: 12, repeat: Infinity, ease: "linear", delay: 3 }} />
        </svg>

        <div className="noise-overlay absolute inset-0 pointer-events-none opacity-[0.02]" />

        <motion.div className="relative z-10 max-w-6xl mx-auto px-6 w-full" style={{ opacity: heroOpacity, y: heroY }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-24 lg:py-0">
            {/* Left: Text */}
            <div>

              <motion.h1
                className="text-5xl sm:text-6xl lg:text-[4.5rem] font-bold leading-[1.05] tracking-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15, ease }}
              >
                <span className="text-white">Become a</span><br />
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${BRAND_ORANGE}, #f59e0b)` }}>
                  Data Scientist
                </span>
              </motion.h1>

              <motion.div
                className="mt-5 h-8 flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <span className="text-gray-500 text-base">Master</span>
                <TypeWriter
                  words={["Python & TensorFlow", "Deep Learning & NLP", "MLOps & Deployment", "Generative AI", "Computer Vision"]}
                  className="text-base font-mono font-semibold text-white"
                />
              </motion.div>

              <motion.p className="mt-5 text-base md:text-lg text-gray-400 leading-relaxed max-w-lg" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35 }}>
                From your first Python script to deploying ML in production. 12 months of intensive, hands-on AI training. 100% placement.
              </motion.p>

              <motion.div className="mt-8 flex flex-wrap items-center gap-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.55 }}>
                <Magnetic>
                  <motion.button onClick={() => openPurchase("Data Science and AI")} className="group relative px-7 py-3.5 rounded-xl font-semibold text-sm overflow-hidden cursor-pointer" style={{ backgroundColor: BRAND_ORANGE }} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <span className="relative z-10 flex items-center gap-2 text-white">Enroll Now <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
                  </motion.button>
                </Magnetic>
                <Magnetic>
                  <motion.button onClick={openEnquiry} className="px-7 py-3.5 rounded-xl font-semibold text-sm border border-white/[0.12] text-white/80 hover:text-white hover:border-white/25 hover:bg-white/[0.04] transition-all duration-300 cursor-pointer" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    Download Curriculum
                  </motion.button>
                </Magnetic>
              </motion.div>
            </div>

            {/* Right: Animated Image Carousel */}
            <motion.div className="relative hidden lg:block" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.4, ease }}>
              <HeroImageCarousel />
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-12 rounded-full blur-3xl" style={{ background: `${ACCENT_BLUE}15` }} />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Mobile image carousel */}
      <div className="lg:hidden relative" style={{ backgroundColor: DARK_BG }}>
        <div className="px-6 pb-10">
          <HeroImageCarousel />
        </div>
      </div>

      {/* ═══════ HIGHLIGHTS BAR ═══════ */}
      <section className="relative py-5 px-6" style={{ backgroundColor: BRAND_NAVY }}>
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {highlights.map((h, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-3 py-2"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <h.icon className="w-5 h-5 shrink-0" style={{ color: h.color }} />
              <div>
                <p className="text-sm font-semibold text-white">{h.label}</p>
                <p className="text-xs text-white/50">{h.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════ WHAT OUR PROGRAM OFFERS - Premium feature showcase ═══════ */}
      <section className="relative py-20 md:py-28 overflow-hidden bg-[#fafbfc]">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.03) 1px, transparent 0)`, backgroundSize: "32px 32px" }} />
        {/* Soft gradient overlays */}
        <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-white to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-white to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16 md:mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-600 text-xs font-semibold tracking-wider uppercase mb-6">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                Program Highlights
              </span>
            </motion.div>
            <motion.h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-5"
              style={{ color: BRAND_NAVY }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              What Our{" "}
              <span className="relative">
                <span className="relative z-10 bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 bg-clip-text text-transparent">Program</span>
                <motion.span
                  className="absolute -bottom-1 left-0 w-full h-[3px] rounded-full bg-gradient-to-r from-orange-500 to-amber-500"
                  initial={{ scaleX: 0, originX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                />
              </span>
              {" "}Offers?
            </motion.h2>
            <motion.p
              className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Our Data Science & AI program equips you with industry-ready skills through advanced tools and expert support.
            </motion.p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
            {[
              { icon: "mentorship", label: "1:1 Doubt Clearing", desc: "Unlimited personal sessions" },
              { icon: "video", label: "250+ Hours Content", desc: "Self-paced learning" },
              { icon: "live", label: "400+ Live Hours", desc: "Interactive classes" },
              { icon: "path", label: "Personalized Paths", desc: "Tailored to your goals" },
              { icon: "hackathon", label: "Live Hackathons", desc: "Real competition experience" },
              { icon: "assessment", label: "Regular Assessments", desc: "Track your progress" },
              { icon: "career", label: "Lifetime Career Support", desc: "We never stop helping" },
              { icon: "expert", label: "Industry Mentors", desc: "Learn from the best" },
              { icon: "workshop", label: "Webinars & Workshops", desc: "Extra learning sessions" },
              { icon: "placement", label: "360° Placement Help", desc: "End-to-end assistance" },
              { icon: "network", label: "Alumni Network", desc: "12,000+ strong community" },
              { icon: "interview", label: "Interview Prep", desc: "Mock interviews included" },
              { icon: "material", label: "Course Materials", desc: "Lifetime access" },
              { icon: "support", label: "24/7 Support", desc: "Always here for you" },
              { icon: "certificate", label: "Certifications", desc: "Industry-recognized" },
              { icon: "flexible", label: "Flexible Schedule", desc: "Learn at your pace" },
              { icon: "project", label: "Real Projects", desc: "Portfolio-ready work" },
              { icon: "platform", label: "Learning Platform", desc: "Interactive & modern" },
              { icon: "progress", label: "Progress Tracking", desc: "Visual dashboards" },
              { icon: "networking", label: "Networking Events", desc: "Connect with peers" },
            ].map((feature, i) => (
              <motion.div
                key={feature.label}
                className="group relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: Math.min(i * 0.03, 0.3) }}
              >
                <div className="relative h-full p-4 sm:p-5 rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden transition-all duration-300 hover:border-orange-300 hover:shadow-lg hover:shadow-orange-500/10 group-hover:-translate-y-1">
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative z-10 flex items-start gap-3">
                    {/* Icon */}
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-orange-100 to-orange-50 border border-orange-200 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:border-orange-300 transition-all duration-300">
                      <ProgramOfferIcon type={feature.icon} />
                    </div>

                    {/* Text */}
                    <div className="min-w-0">
                      <h3 className="font-semibold text-sm sm:text-base mb-0.5 transition-colors duration-300" style={{ color: BRAND_NAVY }}>{feature.label}</h3>
                      <p className="text-gray-500 text-xs sm:text-sm leading-relaxed group-hover:text-gray-600 transition-colors duration-300">{feature.desc}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ WHO IS THIS FOR - Interactive spotlight reveal ═══════ */}
      <section className="relative py-24 px-6 bg-[#0a0e18] overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />
        <motion.div className="absolute top-20 -left-32 w-[400px] h-[400px] rounded-full blur-[120px]" style={{ background: `radial-gradient(circle, ${BRAND_ORANGE}30, transparent 70%)` }} animate={{ x: [0, 40, 0], y: [0, -30, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div className="absolute bottom-10 -right-32 w-[350px] h-[350px] rounded-full blur-[120px]" style={{ background: `radial-gradient(circle, ${ACCENT_BLUE}25, transparent 70%)` }} animate={{ x: [0, -30, 0], y: [0, 25, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} />

        <div className="relative max-w-6xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <SectionLabel center light>Built For</SectionLabel>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Is This{" "}
                <motion.span className="relative inline-block" initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3, type: "spring", stiffness: 200 }}>
                  <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${BRAND_ORANGE}, #FF6B6B, ${ACCENT_BLUE})` }}>You</span>
                  <motion.span className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full" style={{ background: `linear-gradient(90deg, ${BRAND_ORANGE}, ${ACCENT_BLUE})` }} initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }} />
                </motion.span>
                ?
              </h2>
              <motion.p className="mt-4 text-gray-400 text-lg max-w-md mx-auto" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.4 }}>
                Designed for people who want real AI skills, not just another certificate.
              </motion.p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {personas.map((p, i) => (
              <motion.div key={i} className="group relative" initial={{ opacity: 0, y: 60, rotateX: 15 }} whileInView={{ opacity: 1, y: 0, rotateX: 0 }} viewport={{ once: true, margin: "-5%" }} transition={{ duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}>
                <div className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[1px]" style={{ background: `linear-gradient(135deg, ${p.color}60, transparent 50%, ${p.color}30)` }} />
                <div className="relative bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-7 group-hover:bg-white/[0.07] transition-all duration-500">
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: `radial-gradient(300px circle at 50% 50%, ${p.color}08, transparent 60%)` }} />
                  <div className="relative flex items-start gap-5">
                    <motion.div className="relative w-14 h-14 rounded-xl flex items-center justify-center shrink-0 overflow-hidden" style={{ backgroundColor: `${p.color}15` }} whileHover={{ scale: 1.1, rotate: 5 }} transition={{ type: "spring", stiffness: 400, damping: 15 }}>
                      <motion.div className="absolute inset-0" style={{ background: `linear-gradient(105deg, transparent 40%, ${p.color}20 50%, transparent 60%)` }} animate={{ x: ["-100%", "200%"] }} transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }} />
                      <p.icon className="relative w-6 h-6" style={{ color: p.color }} />
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-bold text-white">{p.title}</h3>
                        <motion.div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p.color }} animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }} />
                      </div>
                      <p className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">{p.desc}</p>
                    </div>
                    <motion.div className="shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300" animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7 4l6 6-6 6" stroke={p.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ WHY CHOOSE LINKWAY LEARNING ═══════ */}
      <section className="relative py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <SectionLabel center>Why Us</SectionLabel>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy-900 leading-tight text-center">
              Why Choose{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${BRAND_ORANGE}, ${ACCENT_BLUE})` }}>Linkway Learning</span>?
            </h2>
            <p className="mt-3 text-gray-500 text-base max-w-xl mx-auto text-center">
              Upskilling from Linkway gives you an unfair advantage by placing you ahead of the curve.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
            {[
              { icon: SparklesIcon, title: "AI-First Curriculum", desc: "Specially designed curriculum keeping AI in focus to boost efficiency, and inculcate deep subject understanding.", color: BRAND_ORANGE },
              { icon: UserIcon, title: "Real-World Interviews", desc: "On demand mock interviews with actual tech company hiring managers to prepare you for the toughest questions.", color: ACCENT_BLUE },
              { icon: LayersIcon, title: "Industry Vetted Curriculum", desc: "Targeted training for Data Science, Machine Learning, and AI at the standards expected by top tech giants.", color: ACCENT_CYAN },
              { icon: GraduationIcon, title: "Expert Mentors & Instructorship", desc: "Get trained by industry experts from top tech companies globally, tailored to your career goals.", color: BRAND_ORANGE },
              { icon: TargetIcon, title: "360° Career Support", desc: "From technical skills to salary negotiation - we guide you every step, with 400+ recruiter connections.", color: ACCENT_BLUE },
              { icon: ShieldIcon, title: "Small Batches, Better Learning", desc: "Learn in a limited batch size for focused preparation & understanding with personalised attention.", color: ACCENT_CYAN },
            ].map((item, i) => (
              <SlideIn key={i} direction="up" delay={i * 0.08}>
                <Card accent={item.color} className="h-full">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${item.color}12` }}>
                    <item.icon className="w-6 h-6" style={{ color: item.color }} />
                  </div>
                  <h3 className="text-lg font-bold text-navy-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                </Card>
              </SlideIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ CURRICULUM - Dark Premium Accordion ═══════ */}
      <section className="relative py-16 md:py-24 px-4 sm:px-6 overflow-hidden" style={{ backgroundColor: DARK_BG }}>
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 w-[600px] h-[600px] rounded-full -translate-x-1/2 -translate-y-1/2" style={{ background: `radial-gradient(circle, ${BRAND_ORANGE}08, transparent 70%)` }} />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full translate-x-1/4 translate-y-1/4" style={{ background: `radial-gradient(circle, ${ACCENT_BLUE}06, transparent 70%)` }} />
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Header */}
          <ScrollReveal>
            <div className="flex justify-center mb-4">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase" style={{ backgroundColor: `${BRAND_ORANGE}15`, color: BRAND_ORANGE }}>
                Curriculum
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight text-center">
              What You&apos;ll{" "}
              <span style={{ color: BRAND_ORANGE }}>Master</span>
            </h2>
            <p className="mt-4 text-gray-400 text-base md:text-lg max-w-2xl mx-auto text-center">
              Industry-aligned modules designed by senior data scientists to make you job-ready in 2026 and beyond.
            </p>
          </ScrollReveal>

          {/* Accordion Cards */}
          <div className="mt-10 md:mt-14 space-y-3">
            {curriculum.map((mod, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <div
                  className="rounded-2xl border overflow-hidden transition-all duration-300"
                  style={{
                    backgroundColor: activeTab === i ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.02)",
                    borderColor: activeTab === i ? `${BRAND_ORANGE}30` : "rgba(255,255,255,0.06)",
                  }}
                >
                  {/* Card Header */}
                  <div
                    className="p-5 md:p-6 cursor-pointer select-none group"
                    onClick={() => setActiveTab(activeTab === i ? -1 : i)}
                  >
                    <div className="flex items-center gap-4">
                      {/* Module Icon */}
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-300"
                        style={{
                          backgroundColor: activeTab === i ? `${BRAND_ORANGE}20` : "rgba(255,255,255,0.05)",
                          border: `1px solid ${activeTab === i ? `${BRAND_ORANGE}30` : "rgba(255,255,255,0.06)"}`,
                        }}
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke={activeTab === i ? BRAND_ORANGE : "rgba(255,255,255,0.4)"} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                          <path d={mod.iconPath} />
                        </svg>
                      </div>

                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-semibold uppercase tracking-widest mb-1 block" style={{ color: activeTab === i ? BRAND_ORANGE : "rgba(255,255,255,0.3)" }}>Module {i + 1}</span>
                        <h3 className="text-base md:text-lg font-bold text-white group-hover:text-orange-400 transition-colors">{mod.title}</h3>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-xs text-gray-500">{mod.weeks} weeks</span>
                          <span className="w-1 h-1 rounded-full bg-gray-600" />
                          <span className="text-xs" style={{ color: BRAND_ORANGE }}>{mod.projects} {mod.projects === 1 ? "project" : "projects"}</span>
                        </div>
                      </div>

                      <motion.div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-300"
                        style={{
                          backgroundColor: activeTab === i ? `${BRAND_ORANGE}15` : "rgba(255,255,255,0.04)",
                          border: `1px solid ${activeTab === i ? `${BRAND_ORANGE}25` : "rgba(255,255,255,0.06)"}`,
                        }}
                        animate={{ rotate: activeTab === i ? 45 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke={activeTab === i ? BRAND_ORANGE : "rgba(255,255,255,0.3)"} strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                      </motion.div>
                    </div>
                  </div>

                  {/* Expandable Content */}
                  <AnimatePresence>
                    {activeTab === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 md:px-6 pb-6 border-t border-white/[0.06]">
                          {/* Description */}
                          <p className="pt-5 text-gray-400 text-[15px] leading-relaxed">
                            {mod.description}
                          </p>

                          {/* Learning Outcomes */}
                          <div className="mt-6">
                            <h4 className="text-sm font-semibold text-white/80 mb-4">Learning Outcomes</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2.5">
                              {mod.outcomes.map((outcome, j) => (
                                <motion.div
                                  key={j}
                                  className="flex items-start gap-2.5"
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.2, delay: j * 0.03 }}
                                >
                                  <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke={BRAND_ORANGE} strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span className="text-sm text-gray-300">{outcome}</span>
                                </motion.div>
                              ))}
                            </div>
                          </div>

                          {/* Tools & Technologies */}
                          <div className="mt-6">
                            <h4 className="text-sm font-semibold text-white/80 mb-3">Tools & Technologies</h4>
                            <div className="flex flex-wrap gap-2">
                              {mod.tools.map((tool, j) => (
                                <motion.div
                                  key={j}
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ duration: 0.2, delay: 0.15 + j * 0.03 }}
                                >
                                  <ToolLogo name={tool} className="px-3 py-2 [&_img]:w-5 [&_img]:h-5 [&_span:last-child]:text-xs" />
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* ═══════ TOOLS - Two-row marquee ═══════ */}
      <section className="relative py-20 px-6 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <SectionLabel center>Tech Stack</SectionLabel>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy-900 leading-tight text-center">
              40+ Tools You&apos;ll{" "}
              <span style={{ color: BRAND_ORANGE }}>Master</span>
            </h2>
          </ScrollReveal>

          <div className="mt-14 space-y-4">
            {[tools.slice(0, 12), tools.slice(12, 24), tools.slice(24)].map((row, ri) => (
              <div key={ri} className="relative overflow-hidden" style={{ maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)", WebkitMaskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)" }}>
                <motion.div
                  className="flex gap-4 w-max"
                  animate={{ x: ri === 0 ? ["0%", "-50%"] : ["-50%", "0%"] }}
                  transition={{ duration: ri === 0 ? 35 : 40, repeat: Infinity, ease: "linear" }}
                >
                  {[...row, ...row].map((tool, i) => (
                    <div key={`${tool}-${i}`} className="shrink-0">
                      <ToolLogo name={tool} />
                    </div>
                  ))}
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ PROJECTS - Infinite scroll carousel ═══════ */}
      <section className="relative py-16 px-6 overflow-hidden" style={{ backgroundColor: DARK_BG }}>
        {/* Aurora silk ribbons */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <defs>
            <linearGradient id="ribbonA" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={BRAND_ORANGE} stopOpacity="0" />
              <stop offset="20%" stopColor={BRAND_ORANGE} stopOpacity="0.15" />
              <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.08" />
              <stop offset="80%" stopColor={ACCENT_CYAN} stopOpacity="0.12" />
              <stop offset="100%" stopColor={ACCENT_CYAN} stopOpacity="0" />
            </linearGradient>
            <linearGradient id="ribbonB" x1="100%" y1="0%" x2="0%" y2="0%">
              <stop offset="0%" stopColor={ACCENT_BLUE} stopOpacity="0" />
              <stop offset="30%" stopColor={ACCENT_BLUE} stopOpacity="0.1" />
              <stop offset="60%" stopColor="#8b5cf6" stopOpacity="0.07" />
              <stop offset="100%" stopColor={ACCENT_BLUE} stopOpacity="0" />
            </linearGradient>
            <linearGradient id="ribbonC" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={ACCENT_CYAN} stopOpacity="0" />
              <stop offset="40%" stopColor="#06b6d4" stopOpacity="0.08" />
              <stop offset="70%" stopColor={BRAND_ORANGE} stopOpacity="0.06" />
              <stop offset="100%" stopColor={BRAND_ORANGE} stopOpacity="0" />
            </linearGradient>
            <filter id="ribbonGlow"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          </defs>
          <motion.path d="M-100,120 C150,40 350,200 600,80 S950,180 1200,60 1500,140" fill="none" stroke="url(#ribbonA)" strokeWidth="2" filter="url(#ribbonGlow)" initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 2.5, ease: "easeInOut" }} />
          <motion.path d="M-50,320 C200,250 450,400 700,280 S1050,380 1300,300 1600,350" fill="none" stroke="url(#ribbonB)" strokeWidth="2" filter="url(#ribbonGlow)" initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 3, delay: 0.4, ease: "easeInOut" }} />
          <motion.path d="M-80,500 C180,440 400,550 680,460 S1000,530 1250,480 1600,520" fill="none" stroke="url(#ribbonC)" strokeWidth="1.5" filter="url(#ribbonGlow)" initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 3.5, delay: 0.8, ease: "easeInOut" }} />
          <motion.circle r="4" fill={BRAND_ORANGE} opacity="0.6" filter="url(#ribbonGlow)" animate={{ cx: [-100, 150, 600, 1200, 1500], cy: [120, 40, 80, 60, 140] }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} />
          <motion.circle r="3" fill={ACCENT_BLUE} opacity="0.5" filter="url(#ribbonGlow)" animate={{ cx: [-50, 200, 700, 1300, 1600], cy: [320, 250, 280, 300, 350] }} transition={{ duration: 10, repeat: Infinity, ease: "linear", delay: 2 }} />
        </svg>

        {/* Rising code particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[
            { char: "{ }", x: "8%", delay: 0, dur: 12, size: 11 },
            { char: "=>", x: "15%", delay: 2, dur: 14, size: 10 },
            { char: "0x", x: "22%", delay: 5, dur: 11, size: 9 },
            { char: "//", x: "32%", delay: 1, dur: 13, size: 10 },
            { char: "[]", x: "42%", delay: 4, dur: 15, size: 11 },
            { char: "()", x: "52%", delay: 3, dur: 12, size: 9 },
            { char: "&&", x: "68%", delay: 2, dur: 11, size: 10 },
            { char: ">>", x: "76%", delay: 5, dur: 13, size: 9 },
            { char: "f(x)", x: "48%", delay: 3, dur: 11, size: 10 },
            { char: "lambda", x: "38%", delay: 8, dur: 13, size: 10 },
            { char: "Sigma", x: "88%", delay: 2, dur: 12, size: 10 },
          ].map((p, i) => (
            <motion.span
              key={`ember-${i}`}
              className="absolute font-mono select-none"
              style={{
                left: p.x,
                bottom: "-5%",
                fontSize: p.size,
                color: i % 3 === 0 ? `${BRAND_ORANGE}` : i % 3 === 1 ? `${ACCENT_BLUE}` : `${ACCENT_CYAN}`,
              }}
              animate={{
                y: [0, -800],
                opacity: [0, 0.25, 0.15, 0],
                rotate: [0, i % 2 === 0 ? 45 : -30],
                x: [0, i % 2 === 0 ? 30 : -20],
              }}
              transition={{
                duration: p.dur,
                repeat: Infinity,
                delay: p.delay,
                ease: "linear",
              }}
            >
              {p.char}
            </motion.span>
          ))}
        </div>

        {/* Morphing gradient blobs */}
        <motion.div
          className="absolute w-[450px] h-[450px] pointer-events-none opacity-[0.07]"
          style={{
            top: "-10%", right: "-5%",
            background: `radial-gradient(ellipse at 30% 50%, ${BRAND_ORANGE}, ${ACCENT_BLUE} 50%, transparent 70%)`,
            borderRadius: "40% 60% 55% 45% / 55% 40% 60% 45%",
            filter: "blur(60px)",
          }}
          animate={{
            borderRadius: ["40% 60% 55% 45% / 55% 40% 60% 45%", "55% 45% 40% 60% / 45% 60% 40% 55%", "60% 40% 50% 50% / 50% 55% 45% 50%", "40% 60% 55% 45% / 55% 40% 60% 45%"],
            x: [0, 30, -20, 0], y: [0, -20, 15, 0], scale: [1, 1.08, 0.95, 1],
          }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-[400px] h-[400px] pointer-events-none opacity-[0.05]"
          style={{
            bottom: "-8%", left: "-5%",
            background: `radial-gradient(ellipse at 60% 40%, ${ACCENT_CYAN}, #8b5cf6 50%, transparent 70%)`,
            borderRadius: "55% 45% 40% 60% / 45% 60% 40% 55%",
            filter: "blur(50px)",
          }}
          animate={{
            borderRadius: ["55% 45% 40% 60% / 45% 60% 40% 55%", "40% 60% 55% 45% / 60% 40% 55% 45%", "50% 50% 45% 55% / 40% 55% 50% 50%", "55% 45% 40% 60% / 45% 60% 40% 55%"],
            x: [0, -25, 35, 0], y: [0, 25, -15, 0], scale: [1, 0.95, 1.1, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />

        <div className="max-w-6xl mx-auto relative z-10 px-6">
          <ScrollReveal>
            <SectionLabel light>Hands-On Experience</SectionLabel>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
              <span className="text-white">25+ Domain-Specific </span>
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${ACCENT_CYAN}, ${BRAND_ORANGE})` }}>Projects</span>
            </h2>
            <p className="mt-3 text-gray-400 text-base max-w-xl">
              Build a portfolio that hiring managers actually care about. Real datasets, real business problems, real impact.
            </p>
          </ScrollReveal>
        </div>

        {/* Infinite scroll project carousel */}
        <div className="relative z-10">
          <ProjectCarousel projects={industryProjects} />
        </div>

        {/* Interactive Dashboard Preview */}
        <div className="max-w-5xl mx-auto relative z-10 px-6">
          <motion.div className="mt-12 relative" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <DashboardPreview />
          </motion.div>
        </div>
      </section>


      {/* ═══════ TESTIMONIALS ═══════ */}
      <section className="relative py-24 px-6 overflow-hidden" style={{ background: 'linear-gradient(180deg, #f9fafb 0%, #f1f5f9 50%, #f9fafb 100%)' }}>
        <motion.div className="absolute top-20 left-[10%] w-72 h-72 rounded-full blur-[100px] pointer-events-none" style={{ backgroundColor: `${BRAND_ORANGE}08` }} animate={{ x: [0, 40, 0], y: [0, -20, 0] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div className="absolute bottom-20 right-[10%] w-80 h-80 rounded-full blur-[120px] pointer-events-none" style={{ backgroundColor: `${ACCENT_BLUE}06` }} animate={{ x: [0, -30, 0], y: [0, 25, 0] }} transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }} />

        <div className="max-w-6xl mx-auto relative z-10">
          <ScrollReveal>
            <SectionLabel center>Success Stories</SectionLabel>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy-900 leading-tight text-center">
              What Learners Say{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${BRAND_ORANGE}, ${ACCENT_BLUE})` }}>About Us</span>
            </h2>
            <p className="text-center text-gray-500 mt-4 max-w-xl mx-auto text-sm leading-relaxed">
              Join hundreds of professionals who&apos;ve transformed their careers with Linkway Learning.
            </p>
          </ScrollReveal>
        </div>

        <TestimonialCarousel />
      </section>

      {/* ═══════ CAREER GROWTH ROADMAP ═══════ */}
      <section className="relative py-24 px-6 bg-white overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] rounded-full pointer-events-none" style={{ background: `radial-gradient(ellipse, ${ACCENT_BLUE}05, transparent 70%)` }} />
        <div className="max-w-6xl mx-auto relative z-10">
          <ScrollReveal>
            <SectionLabel center>Your Journey</SectionLabel>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy-900 leading-tight text-center">
              Your Career Growth{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${BRAND_ORANGE}, ${ACCENT_BLUE})` }}>Roadmap</span>
            </h2>
            <p className="text-center text-gray-500 mt-4 max-w-xl mx-auto text-sm leading-relaxed">A proven 4-step path to take you from upskilling to your dream job</p>
          </ScrollReveal>

          <div className="mt-20 relative">
            <svg className="hidden lg:block absolute top-[56px] left-0 w-full h-[50px] pointer-events-none" viewBox="0 0 1152 50" fill="none" preserveAspectRatio="none">
              <motion.path d="M 100 25 C 220 25, 240 8, 330 8 C 420 8, 430 42, 520 42 C 610 42, 620 8, 710 8 C 800 8, 810 42, 900 42 C 940 42, 960 25, 1052 25" stroke="url(#rmGrad)" strokeWidth="2.5" strokeDasharray="10 7" strokeLinecap="round" fill="none" initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 2.5, ease: "easeOut" }} />
              <defs><linearGradient id="rmGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor={ACCENT_BLUE} stopOpacity={0.35} /><stop offset="50%" stopColor={BRAND_ORANGE} stopOpacity={0.4} /><stop offset="100%" stopColor={ACCENT_BLUE} stopOpacity={0.35} /></linearGradient></defs>
              <motion.circle r="5" fill={BRAND_ORANGE} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 2 }}><animateMotion dur="5s" repeatCount="indefinite" path="M 100 25 C 220 25, 240 8, 330 8 C 420 8, 430 42, 520 42 C 610 42, 620 8, 710 8 C 800 8, 810 42, 900 42 C 940 42, 960 25, 1052 25" /></motion.circle>
              <motion.circle r="12" fill={BRAND_ORANGE} opacity={0.15} initial={{ opacity: 0 }} whileInView={{ opacity: 0.15 }} viewport={{ once: true }} transition={{ delay: 2 }}><animateMotion dur="5s" repeatCount="indefinite" path="M 100 25 C 220 25, 240 8, 330 8 C 420 8, 430 42, 520 42 C 610 42, 620 8, 710 8 C 800 8, 810 42, 900 42 C 940 42, 960 25, 1052 25" /></motion.circle>
            </svg>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
              {([
                { title: "Profile Power-Up", desc: "Stand out with a sharp resume, optimized LinkedIn/GitHub, and a strong personal brand.", color: "#3B82F6", icon: (<svg viewBox="0 0 48 48" fill="none" className="w-full h-full"><circle cx="18" cy="16" r="5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M7 38c0-6.075 4.925-11 11-11s11 4.925 11 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><circle cx="35" cy="18" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M29 38c0-4.418 2.686-8 6-8s6 3.582 6 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><motion.path d="M32 10l2-2 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 1 }} /></svg>) },
                { title: "Interview Readiness", desc: "Ace every round with 1:1 mock interviews, role-specific training, and actionable feedback.", color: "#8B5CF6", icon: (<svg viewBox="0 0 48 48" fill="none" className="w-full h-full"><rect x="8" y="6" width="32" height="36" rx="4" stroke="currentColor" strokeWidth="2" /><circle cx="24" cy="18" r="5" stroke="currentColor" strokeWidth="2" /><path d="M16 34c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><motion.path d="M30 14l3 3 5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 1.2 }} /></svg>) },
                { title: "Hiring Rounds", desc: "Apply to 200+ hiring partners and clear technical interview rounds with confidence.", color: "#0EA5E9", icon: (<svg viewBox="0 0 48 48" fill="none" className="w-full h-full"><rect x="10" y="8" width="28" height="32" rx="3" stroke="currentColor" strokeWidth="2" /><path d="M16 16h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M16 22h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M16 28h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><motion.rect x="16" y="34" rx="1.5" height="3" fill="currentColor" opacity={0.6} animate={{ width: [8, 16, 8] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} /></svg>) },
                { title: "Offer Unlocked!", desc: "Land a high paying job offer from top product-based companies.", color: "#F97316", icon: (<svg viewBox="0 0 48 48" fill="none" className="w-full h-full"><motion.path d="M24 34V14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" animate={{ y: [0, -2, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} /><motion.path d="M17 21l7-7 7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" animate={{ y: [0, -2, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} /><path d="M10 40h28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><motion.circle cx="24" cy="8" r="2.5" fill="currentColor" animate={{ scale: [0.8, 1.3, 0.8], opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }} /></svg>) },
              ]).map((step, i) => (
                <motion.div key={step.title} className="flex flex-col items-center text-center group" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-5%" }} transition={{ duration: 0.6, delay: i * 0.18, ease }}>
                  <motion.div className="relative mb-7" whileHover={{ scale: 1.1, rotate: [0, -3, 3, 0] }} transition={{ duration: 0.4 }}>
                    <motion.div className="absolute inset-0 rounded-full scale-[1.6] blur-xl" style={{ backgroundColor: step.color }} animate={{ opacity: [0.05, 0.12, 0.05], scale: [1.4, 1.7, 1.4] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }} />
                    <motion.div className="absolute -inset-[3px] rounded-full" style={{ background: `conic-gradient(from ${i * 90}deg, ${step.color}50, transparent 25%, transparent 75%, ${step.color}50)` }} animate={{ rotate: 360 }} transition={{ duration: 10 + i * 2, repeat: Infinity, ease: "linear" }} />
                    <div className="relative w-[82px] h-[82px] rounded-full flex items-center justify-center bg-white shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-gray-100 p-[18px]" style={{ color: step.color }}>{step.icon}</div>
                    <motion.div className="absolute -top-1.5 -right-1.5 w-7 h-7 rounded-full text-[11px] font-bold flex items-center justify-center text-white shadow-lg" style={{ background: `linear-gradient(135deg, ${step.color}, ${step.color}bb)` }} animate={{ scale: [1, 1.12, 1] }} transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3 }}>{i + 1}</motion.div>
                  </motion.div>
                  <h4 className="text-lg font-bold text-navy-900 mb-2">{step.title}</h4>
                  <p className="text-[13px] text-gray-500 leading-relaxed max-w-[230px]">{step.desc}</p>
                  <motion.div className="h-[3px] rounded-full mt-5" style={{ backgroundColor: step.color }} initial={{ width: 0, opacity: 0 }} whileInView={{ width: 48, opacity: 0.5 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.6 + i * 0.15 }} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <WaveDivider from="#ffffff" to="#f9fafb" />

      {/* ═══════ FAQ ═══════ */}
      <section className="relative py-16 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal>
            <SectionLabel center>FAQ</SectionLabel>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy-900 leading-tight text-center">
              Common{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${BRAND_ORANGE}, ${ACCENT_BLUE})` }}>Questions</span>
            </h2>
          </ScrollReveal>

          <div className="mt-10 bg-white rounded-2xl border border-gray-100 px-6 md:px-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
            {faqs.map((faq, i) => (
              <FAQItem key={i} question={faq.question} answer={faq.answer} isOpen={openFaq === i} onClick={() => setOpenFaq(openFaq === i ? -1 : i)} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ FINAL CTA - Join 8000+ professionals ═══════ */}
      <FooterCTA />
    </div>
    </ThemeProvider>
  );
}
