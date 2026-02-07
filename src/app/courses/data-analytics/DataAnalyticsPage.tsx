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

/* ═══════════════════════════════════════════════════════
   TESTIMONIAL CAROUSEL - Premium 3D tilt glassmorphism
   ═══════════════════════════════════════════════════════ */
const learnerTestimonials = [
  { name: "Rehan Siddiqui", from: "Non-Tech", to: "Data Analyst", company: "Amazon", exp: "1.5 yrs exp.", accentFrom: "#10b981", accentTo: "#34d399", gradientBg: "linear-gradient(135deg, #ecfdf5, #d1fae5 40%, #ffffff)", desc: "I had zero tech background. Linkway taught me Tableau, Power BI, and how to actually think with data. Now I'm at Amazon solving real business problems every day." },
  { name: "Junaid Khan", from: "Banking Ops", to: "Business Analyst", company: "Razorpay", exp: "2 yrs exp.", accentFrom: "#eab308", accentTo: "#facc15", gradientBg: "linear-gradient(135deg, #fefce8, #fef9c3 40%, #ffffff)", desc: "I was stuck in banking ops with no clear growth path. Six months later, I'm a business analyst at Razorpay working on things that actually excite me." },
  { name: "Shivani Rawat", from: "Operations", to: "Business Analyst", company: "Booking.com", exp: "2 yrs exp.", accentFrom: "#0ea5e9", accentTo: "#38bdf8", gradientBg: "linear-gradient(135deg, #f0f9ff, #bae6fd 40%, #ffffff)", desc: "Operations felt like a dead end. The program gave me the technical skills I was missing, and now I'm doing requirement analysis at Booking.com." },
  { name: "Vansh Pathak", from: "Accounting", to: "Reporting Analyst", company: "Accenture", exp: "1 yr exp.", accentFrom: "#f43f5e", accentTo: "#fb7185", gradientBg: "linear-gradient(135deg, #fff1f2, #fecdd3 40%, #ffffff)", desc: "Went from crunching numbers in spreadsheets to building actual reports with SQL at Accenture. The mentors made the jump doable." },
  { name: "Aditya Srivastava", from: "Full-Stack Dev", to: "Data Scientist", company: "Globussoft", exp: "3 yrs exp.", accentFrom: "#8b5cf6", accentTo: "#a78bfa", gradientBg: "linear-gradient(135deg, #f5f3ff, #ddd6fe 40%, #ffffff)", desc: "I could code, but I didn't know ML. Linkway filled that gap with real projects - computer vision, forecasting, the works." },
  { name: "Priya Mehta", from: "Graphic Designer", to: "Data Scientist", company: "Meesho", exp: "2 yrs exp.", accentFrom: "#f97316", accentTo: "#fb923c", gradientBg: "linear-gradient(135deg, #fff7ed, #fed7aa 40%, #ffffff)", desc: "From design to data, Linkway taught me how to think analytically. I learned Python, ML, and dashboarding. My fashion image classification project clicked with Meesho." },
  { name: "Priya Sharma", from: "HR Executive", to: "People Analytics", company: "Infosys", exp: "3 yrs exp.", accentFrom: "#ec4899", accentTo: "#f472b6", gradientBg: "linear-gradient(135deg, #fdf2f8, #fce7f3 40%, #ffffff)", desc: "HR felt repetitive after 3 years. Learned Python and started automating reports. Now I build dashboards that actually help hiring decisions at Infosys." },
  { name: "Rohit Verma", from: "Mech Engineer", to: "Data Engineer", company: "TCS", exp: "2.5 yrs exp.", accentFrom: "#14b8a6", accentTo: "#2dd4bf", gradientBg: "linear-gradient(135deg, #f0fdfa, #ccfbf1 40%, #ffffff)", desc: "Mechanical engineering wasn't for me. Picked up SQL, learned ETL pipelines here. Cracked TCS interview on my third attempt. Worth every rupee." },
  { name: "Sneha Patel", from: "School Teacher", to: "Data Analyst", company: "Deloitte", exp: "5 yrs exp.", accentFrom: "#6366f1", accentTo: "#818cf8", gradientBg: "linear-gradient(135deg, #eef2ff, #e0e7ff 40%, #ffffff)", desc: "Left teaching after 5 years. Everyone said I was crazy. But the structured learning here helped me land Deloitte. My students were my first cheerleaders." },
  { name: "Amit Kumar", from: "Sales Exec", to: "BI Analyst", company: "Wipro", exp: "4 yrs exp.", accentFrom: "#ef4444", accentTo: "#f87171", gradientBg: "linear-gradient(135deg, #fef2f2, #fecaca 40%, #ffffff)", desc: "Sales targets were killing me. Started learning Excel seriously, then Power BI. Now I make dashboards for sales teams instead of chasing targets myself." },
  { name: "Kavita Nair", from: "Support", to: "Analytics", company: "Fractal", exp: "2 yrs exp.", accentFrom: "#84cc16", accentTo: "#a3e635", gradientBg: "linear-gradient(135deg, #f7fee7, #ecfccb 40%, #ffffff)", desc: "Customer support to analytics sounds impossible, but the mentors here pushed me. SQL clicked after week 3. Got placed at Fractal within 2 months of finishing." },
  { name: "Arjun Menon", from: "BPO", to: "Data Analyst", company: "EXL", exp: "4 yrs exp.", accentFrom: "#06b6d4", accentTo: "#22d3ee", gradientBg: "linear-gradient(135deg, #ecfeff, #cffafe 40%, #ffffff)", desc: "Night shifts at BPO for 4 years. Completed this course while working. The placement team was persistent - helped me prep for 7 interviews before I cleared EXL." },
  { name: "Pooja Gupta", from: "Content Writer", to: "Marketing Analyst", company: "HUL", exp: "3 yrs exp.", accentFrom: "#a855f7", accentTo: "#c084fc", gradientBg: "linear-gradient(135deg, #faf5ff, #f3e8ff 40%, #ffffff)", desc: "Writing blogs wasn't paying enough. Learned Google Analytics, some SQL. Now I analyze campaign performance at HUL. Still write sometimes, but data pays better." },
  { name: "Neeraj Joshi", from: "CA Articleship", to: "Investment Banking", company: "MUFG Bank", exp: "1.5 yrs exp.", accentFrom: "#0284c7", accentTo: "#0ea5e9", gradientBg: "linear-gradient(135deg, #f0f9ff, #e0f2fe 40%, #ffffff)", desc: "CA was too slow for me. Learned financial modeling, valuation, and Excel shortcuts that actually matter. MUFG hired me straight out of the program." },
  { name: "Meghna Reddy", from: "Bank Clerk", to: "Credit Analyst", company: "IDFC First Bank", exp: "3 yrs exp.", accentFrom: "#d946ef", accentTo: "#e879f9", gradientBg: "linear-gradient(135deg, #fdf4ff, #fae8ff 40%, #ffffff)", desc: "Was a clerk at SBI for 3 years. The investment banking module opened my eyes to how finance actually works. Now doing credit analysis at IDFC First." },
  { name: "Saurabh Tiwari", from: "Commerce Grad", to: "Equity Research", company: "BNY Mellon", exp: "Fresh grad", accentFrom: "#4f46e5", accentTo: "#6366f1", gradientBg: "linear-gradient(135deg, #eef2ff, #e0e7ff 40%, #ffffff)", desc: "Fresh B.Com graduate with no clue what to do. The valuation and financial statement analysis modules were gold. Got into BNY Mellon's research team." },
];

function TestimonialCard3D({ t, index }: { t: typeof learnerTestimonials[number]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const smoothX = useSpring(rotateX, { stiffness: 150, damping: 20 });
  const smoothY = useSpring(rotateY, { stiffness: 150, damping: 20 });

  const handleMouse = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    rotateX.set((py - 0.5) * -8);
    rotateY.set((px - 0.5) * 8);
  }, [rotateX, rotateY]);

  return (
    <motion.div
      ref={cardRef}
      className="shrink-0 w-[320px] md:w-[380px]"
      style={{ perspective: 1200 }}
      onMouseMove={handleMouse}
      onMouseLeave={() => { rotateX.set(0); rotateY.set(0); }}
    >
      <motion.div
        className="relative h-full rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.12)] transition-all duration-500 border border-[#e5e4e0]"
        style={{ rotateX: smoothX, rotateY: smoothY, transformStyle: "preserve-3d", backgroundColor: "#F8F7F4" }}
      >
        {/* Colored top accent bar */}
        <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${t.accentFrom}, ${t.accentTo})` }} />

        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: `linear-gradient(135deg, ${t.accentFrom}08 0%, transparent 40%)` }} />

        <div className="relative p-6">
          {/* Company badge + rating row */}
          <div className="flex items-center justify-between mb-4">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-semibold" style={{ backgroundColor: `${t.accentFrom}10`, color: t.accentFrom }}>
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7h-9"/><path d="M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/></svg>
              {t.company}
            </span>
            <span className="text-[10px] font-medium text-gray-400 tracking-wide uppercase">{t.exp}</span>
          </div>

          {/* Quote icon */}
          <svg className="w-8 h-8 mb-3 opacity-20" viewBox="0 0 24 24" fill={t.accentFrom}>
            <path d="M11 7.05V5.95c0-.516-.368-.816-.882-.716-2.355.462-4.118 2.62-4.118 5.216 0 2.757 2.243 5 5 5 2.757 0 5-2.243 5-5 0-.354-.037-.7-.108-1.034-.082-.387-.45-.583-.823-.483-.341.091-.548.43-.483.78.039.19.06.388.06.587 0 1.654-1.346 3-3 3s-3-1.346-3-3c0-1.654 1.346-3 3-3h.5c.276 0 .5-.224.5-.5s-.224-.5-.5-.5H11zm8 0V5.95c0-.516-.368-.816-.882-.716-2.355.462-4.118 2.62-4.118 5.216 0 2.757 2.243 5 5 5 2.757 0 5-2.243 5-5 0-.354-.037-.7-.108-1.034-.082-.387-.45-.583-.823-.483-.341.091-.548.43-.483.78.039.19.06.388.06.587 0 1.654-1.346 3-3 3s-3-1.346-3-3c0-1.654 1.346-3 3-3h.5c.276 0 .5-.224.5-.5s-.224-.5-.5-.5H19z"/>
          </svg>

          {/* Testimonial text */}
          <p className="text-[13.5px] text-gray-600 leading-[1.75] mb-5 line-clamp-4">
            {t.desc}
          </p>

          {/* Author section */}
          <div className="flex items-center gap-3 pt-4 border-t border-[#e5e4e0]">
            <div className="relative">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-[12px] font-bold text-white" style={{ background: `linear-gradient(135deg, ${t.accentFrom}, ${t.accentTo})` }}>
                {t.name.split(" ").map(n => n[0]).join("")}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 text-sm leading-tight truncate">{t.name}</h4>
              <p className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-1">
                <span>{t.from}</span>
                <svg className="w-3 h-3" style={{ color: t.accentFrom }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                <span className="font-medium" style={{ color: t.accentFrom }}>{t.to}</span>
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
      tweenRef.current = gsap.fromTo(track, { x: 0 }, { x: -oneSetWidth, duration: 120, ease: "none", repeat: -1 });
    });
    return () => { tweenRef.current?.kill(); };
  }, []);

  return (
    <div className="mt-10 relative" onMouseEnter={() => tweenRef.current?.pause()} onMouseLeave={() => tweenRef.current?.resume()}>
      {/* Gradient fades matching parent bg */}
      <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, #f1f5f9, transparent)' }} />
      <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, #f1f5f9, transparent)' }} />

      <div className="overflow-hidden py-4">
        <div ref={trackRef} className="flex gap-5 w-max" style={{ willChange: "transform" }}>
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

/* Project Card for infinite carousel */
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

/* Journey Phase Card - interactive expandable card with code preview */
function JourneyPhaseCard({ mod, index, isOpen, onToggle, codeLines }: {
  mod: { phase: string; title: string; duration: string; color: string; topics: string[]; skills: string[] };
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  codeLines: { text: string; color: string }[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-5%" });

  return (
    <motion.div
      ref={ref}
      className="relative"
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* Main card */}
      <div
        className={cn(
          "relative rounded-2xl border overflow-hidden transition-all duration-500 cursor-pointer",
          isOpen
            ? "bg-white shadow-[0_12px_40px_rgba(0,0,0,0.08)] border-gray-200"
            : "bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] border-gray-100 hover:border-gray-200 hover:shadow-[0_6px_20px_rgba(0,0,0,0.06)]"
        )}
        onClick={onToggle}
      >
        {/* Top accent bar */}
        <motion.div
          className="h-1 w-full"
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8, delay: index * 0.15 + 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          style={{ transformOrigin: "left", backgroundColor: mod.color }}
        />

        {/* Header */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Animated phase number */}
            <div className="relative">
              <motion.div
                className="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg font-mono text-white"
                style={{ backgroundColor: mod.color }}
                whileHover={{ scale: 1.08, rotate: -3 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                {mod.phase}
              </motion.div>
              {/* Glow behind */}
              <div className="absolute inset-0 rounded-2xl blur-lg opacity-30" style={{ backgroundColor: mod.color }} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-navy-900">{mod.title}</h3>
              <p className="text-sm text-gray-400 font-mono mt-0.5">{mod.duration}</p>
            </div>
          </div>

          {/* Expand indicator */}
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center shrink-0"
          >
            <ChevronIcon className="w-4 h-4 text-gray-400" />
          </motion.div>
        </div>

        {/* Skill tags - always visible */}
        <div className="px-6 pb-4 flex flex-wrap gap-1.5">
          {mod.skills.map((skill, j) => (
            <motion.span
              key={skill}
              className="px-2.5 py-1 rounded-lg text-xs font-medium border"
              style={{ color: mod.color, borderColor: `${mod.color}25`, backgroundColor: `${mod.color}08` }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.3, delay: index * 0.15 + 0.4 + j * 0.05 }}
            >
              {skill}
            </motion.span>
          ))}
        </div>

        {/* Expandable content */}
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6">
                <div className="h-px bg-gray-100 mb-5" />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {/* Topics */}
                  <div className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">What you&apos;ll learn</p>
                    {mod.topics.map((topic, j) => (
                      <motion.div
                        key={j}
                        className="flex items-start gap-3 p-3.5 rounded-xl bg-gray-50 border border-gray-100"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: j * 0.08 }}
                      >
                        <CheckCircleIcon className="w-4 h-4 mt-0.5 shrink-0" style={{ color: mod.color }} />
                        <span className="text-sm text-gray-700 leading-relaxed">{topic}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Mini code preview */}
                  <motion.div
                    className="rounded-xl overflow-hidden border border-gray-200"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.15 }}
                  >
                    <div className="flex items-center gap-1.5 px-3 py-2 bg-[#1a1e2e] border-b border-white/[0.06]">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                      <span className="text-[10px] font-mono text-gray-500 ml-2">preview</span>
                    </div>
                    <div className="bg-[#0d1117] p-4 font-mono text-[12px] leading-[1.8]">
                      {codeLines.map((line, j) => (
                        <motion.div
                          key={j}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.2, delay: 0.2 + j * 0.06 }}
                          className="whitespace-pre"
                          style={{ color: line.color }}
                        >
                          {line.text}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
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

/* ─── Animated Terminal ─── */
function Terminal({ title, lines, className }: { title: string; lines: { text: string; color?: string; delay?: number }[]; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (visibleLines >= lines.length) return;
    const delay = lines[visibleLines]?.delay ?? 120;
    const timer = setTimeout(() => setVisibleLines((v) => v + 1), delay);
    return () => clearTimeout(timer);
  }, [inView, visibleLines, lines]);

  return (
    <div ref={ref} className={cn("rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl", className)}>
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-[#1a1e2e] border-b border-white/[0.06]">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <span className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>
        <span className="text-xs font-mono text-gray-500 ml-2">{title}</span>
      </div>
      {/* Code area */}
      <div className="bg-[#0d1117] p-5 font-mono text-[13px] leading-[1.7] min-h-[200px] overflow-hidden">
        {lines.slice(0, visibleLines).map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.15 }}
            className="whitespace-pre"
            style={{ color: line.color || "#e6edf3" }}
          >
            {line.text}
          </motion.div>
        ))}
        {visibleLines < lines.length && (
          <span className="inline-block w-2 h-4 bg-green-400 animate-pulse ml-0.5" />
        )}
      </div>
    </div>
  );
}

/* ─── Interactive Dashboard Preview ─── */
function DashboardPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const [activeTab, setActiveTab] = useState(0);

  const kpis = [
    { label: "Total Revenue", value: "$1.24M", change: "+12.4%", up: true },
    { label: "Avg Order Value", value: "$86.50", change: "+3.2%", up: true },
    { label: "Churn Rate", value: "4.1%", change: "-1.8%", up: false },
    { label: "Accuracy", value: "94.2%", change: "+2.6%", up: true },
  ];

  const tabs = ["Overview", "Sales", "Predictions"];

  // Bar chart data
  const bars = [
    { label: "Jan", h: 40 }, { label: "Feb", h: 55 }, { label: "Mar", h: 45 },
    { label: "Apr", h: 70 }, { label: "May", h: 62 }, { label: "Jun", h: 85 },
    { label: "Jul", h: 78 }, { label: "Aug", h: 90 }, { label: "Sep", h: 72 },
    { label: "Oct", h: 95 }, { label: "Nov", h: 88 }, { label: "Dec", h: 100 },
  ];

  // Donut segments
  const donutData = [
    { label: "Direct", pct: 38, color: BRAND_ORANGE },
    { label: "Organic", pct: 28, color: ACCENT_BLUE },
    { label: "Referral", pct: 20, color: ACCENT_CYAN },
    { label: "Social", pct: 14, color: "#7ee787" },
  ];

  // SVG donut
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  let cumulativeOffset = 0;

  return (
    <div ref={ref} className="rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl bg-[#0d1117]">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-3 bg-[#1a1e2e] border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <span className="text-xs font-mono text-gray-500">analytics_dashboard.py</span>
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

      {/* Dashboard body */}
      <div className="p-5 space-y-5">
        {/* KPI Cards Row */}
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
              <span className={`text-[11px] font-mono font-medium ${kpi.up ? "text-[#7ee787]" : "text-[#ff7b72]"}`}>
                {kpi.change}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Bar Chart - 2 cols */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="md:col-span-2 rounded-xl bg-white/[0.03] border border-white/[0.06] p-4"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-medium text-gray-400">Monthly Revenue</p>
              <span className="text-[10px] text-gray-600 font-mono">FY 2024-25</span>
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

          {/* Donut Chart */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4"
          >
            <p className="text-xs font-medium text-gray-400 mb-3">Traffic Sources</p>
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

        {/* Bottom stats strip */}
        <div className="flex flex-wrap items-center justify-center gap-5 pt-2 border-t border-white/[0.04]">
          {[
            { label: "Projects", value: "4", color: BRAND_ORANGE },
            { label: "Tools", value: "8+", color: ACCENT_BLUE },
            { label: "Code", value: "2K+", color: ACCENT_CYAN },
            { label: "Portfolio", value: "100%", color: "#7ee787" },
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

/* ─── Hero Image Carousel ─── */
const heroImages = [
  "/images/1.png",
  "/images/2.png",
  "/images/3.png",
  "/images/4.png",
  "/images/5.png",
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
      {/* Ambient glow behind image */}
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
            alt="Data Analytics professional"
            fill
            className="object-cover"
            priority={current === 0}
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </motion.div>
      </AnimatePresence>
      {/* Animated progress bar at bottom */}
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
      {/* Corner accent frame lines */}
      <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 rounded-tl-sm pointer-events-none" style={{ borderColor: `${BRAND_ORANGE}80` }} />
      <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 rounded-br-sm pointer-events-none" style={{ borderColor: `${BRAND_ORANGE}80` }} />
    </div>
  );
}


/* Infinite scrolling tool marquee - modern touch */
function ToolMarquee({ tools }: { tools: string[] }) {
  const doubled = [...tools, ...tools];
  return (
    <div className="relative overflow-hidden py-2">
      <div className="absolute left-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-r from-white to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-l from-white to-transparent pointer-events-none" />
      <motion.div
        className="flex gap-4 w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 30, ease: "linear", repeat: Infinity }}
      >
        {doubled.map((tool, i) => (
          <div key={`${tool}-${i}`} className="shrink-0">
            <ToolLogo name={tool} />
          </div>
        ))}
      </motion.div>
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

/* ═══════════════════════════════════════════════════════
   MODULES - Bento-Grid Glassmorphism (Light Theme)
   Inspired by: Apple bento, Stripe gradients, Duolingo
   path, Coursera clean layout, Aceternity hover effects
   ═══════════════════════════════════════════════════════ */

const MODULE_DATA = [
  {
    id: 1,
    title: "Excel for Data Analytics",
    subtitle: "Master the world's most-used analytics tool",
    gradient: "from-emerald-400 to-teal-500",
    bgGradient: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
    iconBg: "linear-gradient(135deg, #10b981, #059669)",
    color: "#059669",
    lightBg: "#ecfdf5",
    topics: [
      "Advanced formulas - VLOOKUP, INDEX-MATCH, array formulas",
      "PivotTables & PivotCharts for dynamic reporting",
      "Conditional formatting & data validation at scale",
      "Forecasting models, What-If analysis & Goal Seek",
      "Dashboard design - sparklines, slicers, KPI tiles",
      "Power Query for automated data transformation",
    ],
    icon: (<img src="/images/tools/excel.png" alt="Excel" className="w-7 h-7 object-contain drop-shadow-sm" />),
  },
  {
    id: 2,
    title: "Tableau",
    subtitle: "Turn raw data into visual stories",
    gradient: "from-blue-400 to-indigo-500",
    bgGradient: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
    iconBg: "linear-gradient(135deg, #3b82f6, #4f46e5)",
    color: "#3b82f6",
    lightBg: "#eff6ff",
    topics: [
      "Connecting to live & extract data sources",
      "Building interactive dashboards & storyboards",
      "Calculated fields, LOD expressions & table calcs",
      "Geospatial mapping & custom geocoding",
      "Publishing to Tableau Server / Tableau Public",
      "Best practices for visual design & storytelling",
    ],
    icon: (<img src="/images/tools/tableau.png" alt="Tableau" className="w-7 h-7 object-contain drop-shadow-sm" />),
  },
  {
    id: 3,
    title: "Power BI",
    subtitle: "Enterprise-grade business intelligence",
    gradient: "from-amber-400 to-orange-500",
    bgGradient: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
    iconBg: "linear-gradient(135deg, #f59e0b, #ea580c)",
    color: "#d97706",
    lightBg: "#fffbeb",
    topics: [
      "Power BI Desktop - data modeling & DAX formulas",
      "Building multi-page interactive reports",
      "Power Query M language for ETL pipelines",
      "Row-level security & workspace governance",
      "Dataflows, incremental refresh & performance tuning",
      "Publishing & sharing via Power BI Service",
    ],
    icon: (<img src="/images/tools/power-bi.png" alt="Power BI" className="w-7 h-7 object-contain drop-shadow-sm" />),
  },
  {
    id: 4,
    title: "Python & Data Science",
    subtitle: "From zero to analysis with Python",
    gradient: "from-violet-400 to-purple-600",
    bgGradient: "linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)",
    iconBg: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
    color: "#7c3aed",
    lightBg: "#f5f3ff",
    topics: [
      "Python fundamentals - variables, loops, functions, OOP",
      "NumPy arrays & vectorized operations",
      "Pandas DataFrames - cleaning, merging, grouping",
      "Matplotlib & Seaborn for publication-quality plots",
      "Statistics - descriptive, probability, hypothesis testing",
      "Data cleaning, preparation & feature engineering",
    ],
    icon: (<img src="/images/tools/python.png" alt="Python" className="w-7 h-7 object-contain drop-shadow-sm" />),
  },
  {
    id: 5,
    title: "Machine Learning",
    subtitle: "Predictive models that drive decisions",
    gradient: "from-pink-400 to-rose-500",
    bgGradient: "linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)",
    iconBg: "linear-gradient(135deg, #ec4899, #db2777)",
    color: "#db2777",
    lightBg: "#fdf2f8",
    topics: [
      "Supervised Learning - linear & logistic regression",
      "Decision Trees, Random Forests & Gradient Boosting",
      "Unsupervised Learning - K-Means, DBSCAN, PCA",
      "Model evaluation - cross-validation, ROC, confusion matrix",
      "Time Series forecasting - ARIMA, SARIMA, Prophet",
      "Recommender Systems - collaborative & content-based",
    ],
    icon: (<img src="/images/tools/scikit-learn.png" alt="Machine Learning" className="w-7 h-7 object-contain drop-shadow-sm" />),
  },
  {
    id: 6,
    title: "Big Data & SQL",
    subtitle: "Query, manage & scale data infra",
    gradient: "from-cyan-400 to-sky-500",
    bgGradient: "linear-gradient(135deg, #cffafe 0%, #a5f3fc 100%)",
    iconBg: "linear-gradient(135deg, #06b6d4, #0284c7)",
    color: "#0891b2",
    lightBg: "#ecfeff",
    topics: [
      "SQL fundamentals - SELECT, JOINs, subqueries, CTEs",
      "MySQL database design & normalization",
      "Window functions, stored procedures & optimization",
      "Integrating SQL queries in Python (SQLAlchemy)",
      "Introduction to Apache Spark & PySpark",
      "Big Data ecosystem - Hadoop, distributed computing",
    ],
    icon: (<img src="/images/tools/sql.png" alt="SQL" className="w-7 h-7 object-contain drop-shadow-sm" />),
  },
];

/* ── Module Card - Option 1: Refined Original ── */
function ModuleCard({ mod, index, onEnquiry }: { mod: typeof MODULE_DATA[0]; index: number; onEnquiry: () => void }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      className="group relative"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      {/* Card with glassmorphism */}
      <div
        className="relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border border-white/60 hover:shadow-xl hover:-translate-y-0.5"
        style={{
          background: "rgba(255,255,255,0.75)",
          backdropFilter: "blur(12px)",
          boxShadow: "0 4px 24px -8px rgba(0,0,0,0.1)",
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* Top accent bar */}
        <div className="h-1" style={{ background: mod.iconBg }} />

        <div className="p-5">
          {/* Header row */}
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div
              className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center border border-white/80"
              style={{ background: mod.lightBg, boxShadow: "0 2px 8px -2px rgba(0,0,0,0.1)" }}
            >
              {mod.icon}
            </div>

            <div className="flex-1 min-w-0">
              {/* Module badge + topics */}
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide"
                  style={{ color: mod.color, backgroundColor: mod.lightBg }}
                >
                  Module {mod.id}
                </span>
                <span className="text-[10px] text-gray-400">{mod.topics.length} topics</span>
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-gray-900 leading-tight">{mod.title}</h3>

              {/* Subtitle */}
              <p className="mt-0.5 text-sm text-gray-500">{mod.subtitle}</p>
            </div>

            {/* Expand toggle */}
            <motion.div
              className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.25 }}
            >
              <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </motion.div>
          </div>

          {/* Progress bar */}
          <div className="mt-4 flex items-center gap-3">
            <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: mod.iconBg }}
                initial={{ width: "0%" }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
              />
            </div>
            <span className="text-[11px] font-medium" style={{ color: mod.color }}>
              {mod.topics.length} lessons
            </span>
          </div>

          {/* Expandable topics */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="space-y-2">
                    {mod.topics.map((topic, tIdx) => {
                      const parts = topic.split(" - ");
                      return (
                        <motion.div
                          key={tIdx}
                          className="flex items-start gap-3 p-2.5 rounded-lg transition-colors hover:bg-white/60"
                          style={{ backgroundColor: `${mod.lightBg}80` }}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: tIdx * 0.03 }}
                        >
                          <div
                            className="shrink-0 w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold mt-0.5"
                            style={{ backgroundColor: mod.lightBg, color: mod.color }}
                          >
                            {tIdx + 1}
                          </div>
                          <div className="flex-1">
                            <p className="text-[13px] font-medium text-gray-800">{parts[0]}</p>
                            {parts[1] && <p className="text-[11px] text-gray-500 mt-0.5">{parts[1]}</p>}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  <motion.button
                    onClick={(e) => { e.stopPropagation(); onEnquiry(); }}
                    className="mt-4 w-full py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer transition-transform"
                    style={{ background: mod.iconBg }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Get Detailed Syllabus
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

function ModulesSection({ openEnquiry }: { openEnquiry: () => void }) {
  return (
    <section className="relative py-28 px-6 overflow-hidden" style={{
      background: `
        linear-gradient(135deg, #fefce8 0%, #fef9ef 20%, #fdf2f8 40%, #f0f9ff 60%, #ecfeff 80%, #f0fdf4 100%)
      `
    }}>
      {/* ── Morphing aurora blobs with conic gradients ── */}
      <motion.div className="absolute w-[600px] h-[600px] pointer-events-none" style={{ top: "-15%", left: "-10%", background: "conic-gradient(from 0deg, rgba(251,191,36,0.12), rgba(236,72,153,0.08), rgba(139,92,246,0.1), rgba(251,191,36,0.12))", borderRadius: "40% 60% 55% 45% / 55% 40% 60% 45%", filter: "blur(80px)" }}
        animate={{ borderRadius: ["40% 60% 55% 45% / 55% 40% 60% 45%", "55% 45% 40% 60% / 40% 55% 45% 60%", "45% 55% 60% 40% / 60% 45% 55% 40%", "40% 60% 55% 45% / 55% 40% 60% 45%"], rotate: [0, 120, 240, 360] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="absolute w-[500px] h-[500px] pointer-events-none" style={{ top: "30%", right: "-5%", background: "conic-gradient(from 180deg, rgba(6,182,212,0.1), rgba(59,130,246,0.08), rgba(139,92,246,0.1), rgba(6,182,212,0.1))", borderRadius: "60% 40% 45% 55% / 45% 60% 40% 55%", filter: "blur(80px)" }}
        animate={{ borderRadius: ["60% 40% 45% 55% / 45% 60% 40% 55%", "40% 60% 55% 45% / 60% 40% 55% 45%", "55% 45% 40% 60% / 40% 55% 45% 60%", "60% 40% 45% 55% / 45% 60% 40% 55%"], rotate: [0, -90, -180, -360] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="absolute w-[450px] h-[450px] pointer-events-none" style={{ bottom: "-10%", left: "20%", background: "conic-gradient(from 90deg, rgba(245,130,32,0.08), rgba(16,185,129,0.1), rgba(59,130,246,0.06), rgba(245,130,32,0.08))", borderRadius: "45% 55% 60% 40% / 55% 45% 55% 45%", filter: "blur(70px)" }}
        animate={{ borderRadius: ["45% 55% 60% 40% / 55% 45% 55% 45%", "55% 45% 45% 55% / 45% 55% 60% 40%", "40% 60% 55% 45% / 60% 40% 45% 55%", "45% 55% 60% 40% / 55% 45% 55% 45%"], rotate: [0, 60, 180, 360], scale: [1, 1.15, 0.95, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }} />

      {/* ── Floating constellation SVG ── */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="mod-lg1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#f59e0b" stopOpacity="0.15" /><stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.08" /></linearGradient>
          <linearGradient id="mod-lg2" x1="100%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#06b6d4" stopOpacity="0.12" /><stop offset="100%" stopColor="#ec4899" stopOpacity="0.06" /></linearGradient>
        </defs>
        {[
          { x1: "10%", y1: "15%", x2: "35%", y2: "25%", g: "url(#mod-lg1)", d: 0.5 },
          { x1: "35%", y1: "25%", x2: "25%", y2: "55%", g: "url(#mod-lg1)", d: 0.8 },
          { x1: "25%", y1: "55%", x2: "10%", y2: "75%", g: "url(#mod-lg2)", d: 1.1 },
          { x1: "65%", y1: "10%", x2: "80%", y2: "35%", g: "url(#mod-lg2)", d: 0.6 },
          { x1: "80%", y1: "35%", x2: "70%", y2: "60%", g: "url(#mod-lg1)", d: 0.9 },
          { x1: "70%", y1: "60%", x2: "90%", y2: "80%", g: "url(#mod-lg2)", d: 1.2 },
          { x1: "35%", y1: "25%", x2: "65%", y2: "10%", g: "url(#mod-lg2)", d: 1.0 },
          { x1: "25%", y1: "55%", x2: "70%", y2: "60%", g: "url(#mod-lg1)", d: 1.3 },
        ].map((l, i) => (
          <motion.line key={`cl${i}`} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke={l.g} strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }} transition={{ duration: 2, delay: l.d }} />
        ))}
        {[
          { cx: "10%", cy: "15%", c: "#f59e0b", r: 4, d: 0 },
          { cx: "35%", cy: "25%", c: "#8b5cf6", r: 5, d: 1 },
          { cx: "25%", cy: "55%", c: "#ec4899", r: 4, d: 2 },
          { cx: "10%", cy: "75%", c: "#10b981", r: 3.5, d: 3 },
          { cx: "65%", cy: "10%", c: "#06b6d4", r: 4, d: 0.5 },
          { cx: "80%", cy: "35%", c: "#3b82f6", r: 5, d: 1.5 },
          { cx: "70%", cy: "60%", c: "#d97706", r: 4, d: 2.5 },
          { cx: "90%", cy: "80%", c: "#7c3aed", r: 3.5, d: 3.5 },
        ].map((dot, i) => (
          <motion.circle key={`nd${i}`} cx={dot.cx} cy={dot.cy} r={dot.r} fill={dot.c} opacity={0.2}
            animate={{ r: [dot.r, dot.r + 2, dot.r], opacity: [0.15, 0.3, 0.15] }}
            transition={{ duration: 3, repeat: Infinity, delay: dot.d, ease: "easeInOut" }} />
        ))}
        {[0, 2.5, 5].map((d, i) => (
          <motion.circle key={`tp${i}`} r="1.5" fill={["#f59e0b", "#8b5cf6", "#06b6d4"][i]} opacity={0.2}
            animate={{ cx: ["10%", "35%", "25%", "70%", "90%", "65%", "10%"], cy: ["15%", "25%", "55%", "60%", "80%", "10%", "15%"] }}
            transition={{ duration: 9 + i, repeat: Infinity, delay: d, ease: "linear" }} />
        ))}
      </svg>

      {/* ── Floating geometric shapes ── */}
      {[
        { top: "8%", left: "5%", sz: 40, rot: 45, c: "rgba(245,130,32,0.06)", bc: "rgba(245,130,32,0.15)", dur: 15, br: "6px" },
        { top: "20%", right: "8%", sz: 55, rot: 0, c: "rgba(139,92,246,0.05)", bc: "rgba(139,92,246,0.12)", dur: 20, br: "25% 10%" },
        { top: "60%", left: "3%", sz: 35, rot: 30, c: "rgba(6,182,212,0.06)", bc: "rgba(6,182,212,0.15)", dur: 18, br: "0 50% 50%" },
        { top: "75%", right: "6%", sz: 45, rot: 0, c: "rgba(236,72,153,0.05)", bc: "rgba(236,72,153,0.12)", dur: 16, br: "50%" },
        { top: "45%", left: "50%", sz: 28, rot: 60, c: "rgba(16,185,129,0.05)", bc: "rgba(16,185,129,0.12)", dur: 22, br: "4px" },
      ].map((s, i) => (
        <motion.div key={`geo-${i}`} className="absolute pointer-events-none"
          style={{ top: s.top, ...("left" in s ? { left: s.left } : {}), ...("right" in s ? { right: (s as unknown as Record<string, string>).right } : {}), width: s.sz, height: s.sz, border: `1.5px solid ${s.bc}`, backgroundColor: s.c, borderRadius: s.br, transform: `rotate(${s.rot}deg)` }}
          animate={{ y: [0, -20, 10, -15, 0], rotate: [s.rot, s.rot + 90, s.rot + 180, s.rot + 270, s.rot + 360], scale: [1, 1.1, 0.95, 1.05, 1] }}
          transition={{ duration: s.dur, repeat: Infinity, ease: "easeInOut" }} />
      ))}

      {/* ── Animated light streaks ── */}
      <motion.div className="absolute top-[18%] left-0 w-full h-px pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent, rgba(245,130,32,0.08) 20%, rgba(139,92,246,0.06) 50%, rgba(6,182,212,0.08) 80%, transparent)" }}
        animate={{ opacity: [0, 0.6, 0], x: ["-10%", "5%", "-10%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="absolute top-[52%] left-0 w-full h-px pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent, rgba(6,182,212,0.06) 30%, rgba(236,72,153,0.08) 60%, transparent)" }}
        animate={{ opacity: [0, 0.5, 0], x: ["5%", "-8%", "5%"] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 3 }} />
      <motion.div className="absolute top-[82%] left-0 w-full h-px pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.08) 40%, rgba(245,130,32,0.06) 70%, transparent)" }}
        animate={{ opacity: [0, 0.4, 0], x: ["-5%", "8%", "-5%"] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 5 }} />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* ── Section Header ── */}
        <ScrollReveal>
          <div className="text-center mb-16">
            {/* Floating badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200/80 bg-white/70 backdrop-blur-sm shadow-sm mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="flex items-center gap-1.5">
                {MODULE_DATA.slice(0, 6).map((m, i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full"
                    style={{ background: m.iconBg }}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.06, type: "spring" }}
                  />
                ))}
              </span>
              <span className="text-xs font-semibold text-gray-600 tracking-wide">6 Modules · 36+ Topics · 24 Weeks</span>
            </motion.div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              What You&apos;ll{" "}
              <span className="relative inline-block">
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${BRAND_ORANGE}, #e11d48, #7c3aed, #0891b2)` }}>
                  Master
                </span>
                {/* Hand-drawn underline SVG */}
                <motion.svg
                  className="absolute -bottom-2 left-0 w-full h-3"
                  viewBox="0 0 200 12"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <motion.path
                    d="M2 8 C30 3, 60 11, 100 6 S160 2, 198 7"
                    stroke={BRAND_ORANGE}
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                  />
                </motion.svg>
              </span>
            </h2>
            <p className="mt-5 text-gray-500 text-lg max-w-xl mx-auto leading-relaxed">
              Each module builds on the last - from spreadsheets to machine learning. Click any module to explore what&apos;s inside.
            </p>
          </div>
        </ScrollReveal>

        {/* ── Bento Grid of Module Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {MODULE_DATA.map((mod, idx) => (
            <ModuleCard key={mod.id} mod={mod} index={idx} onEnquiry={openEnquiry} />
          ))}
        </div>

        {/* ── Bottom Stats Cards - Modern Dashboard Style ── */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
            {[
              {
                value: "6",
                label: "Modules",
                color: BRAND_ORANGE,
                gradient: "from-orange-500 to-amber-400",
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                    <rect x="3" y="3" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="2"/>
                    <rect x="14" y="3" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="2"/>
                    <rect x="3" y="14" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="2"/>
                    <rect x="14" y="14" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                )
              },
              {
                value: "36+",
                label: "Topics",
                color: "#7c3aed",
                gradient: "from-violet-500 to-purple-400",
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <rect x="9" y="3" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="2"/>
                    <path d="M9 12h6M9 16h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                )
              },
              {
                value: "24",
                label: "Weeks",
                color: "#0891b2",
                gradient: "from-cyan-500 to-teal-400",
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                    <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                    <path d="M3 10h18" stroke="currentColor" strokeWidth="2"/>
                    <path d="M8 2v4M16 2v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                )
              },
              {
                value: "30+",
                label: "Tools",
                color: "#059669",
                gradient: "from-emerald-500 to-green-400",
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                    <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )
              },
            ].map((stat, i) => (
              <motion.div
                key={i}
                className="group relative"
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + i * 0.1, type: "spring", stiffness: 200 }}
              >
                <div
                  className="relative overflow-hidden rounded-2xl p-5 md:p-6 bg-white/70 backdrop-blur-sm border border-white/80 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1"
                >
                  {/* Decorative gradient blob */}
                  <div
                    className={`absolute -top-8 -right-8 w-24 h-24 rounded-full bg-gradient-to-br ${stat.gradient} opacity-20 blur-2xl group-hover:opacity-30 transition-opacity`}
                  />

                  {/* Icon with colored background */}
                  <div
                    className="relative w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                    style={{ backgroundColor: `${stat.color}15` }}
                  >
                    <div style={{ color: stat.color }}>
                      {stat.icon}
                    </div>
                  </div>

                  {/* Value */}
                  <motion.p
                    className="relative text-3xl md:text-4xl font-bold"
                    style={{ color: stat.color }}
                    initial={{ scale: 0.5 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 + i * 0.1, type: "spring", stiffness: 200 }}
                  >
                    {stat.value}
                  </motion.p>

                  {/* Label */}
                  <p className="relative text-sm text-gray-600 font-medium mt-1 uppercase tracking-wide">{stat.label}</p>

                  {/* Bottom accent line */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: `linear-gradient(90deg, ${stat.color}, ${stat.color}80)` }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════ */

export default function DataAnalyticsPage() {
  const { openEnquiry } = useEnquiryModal();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  const [openFaq, setOpenFaq] = useState(-1);
  const [activeTab, setActiveTab] = useState(-1);

  /* ── Data ── */
  const personas = [
    { icon: UserIcon, title: "Career Switchers", desc: "Coming from a non-tech background? That's exactly who this was built for. We start from scratch.", color: BRAND_ORANGE },
    { icon: GraduationIcon, title: "Fresh Graduates", desc: "College didn't teach you what companies actually need. This will. No coding required.", color: ACCENT_BLUE },
    { icon: BriefcaseIcon, title: "Working Professionals", desc: "Learn without quitting your job. Weekend batches, flexible deadlines, all classes recorded.", color: ACCENT_CYAN },
    { icon: RocketIcon, title: "Entrepreneurs", desc: "Stop guessing and start knowing. Read your own numbers and make smarter business calls.", color: BRAND_ORANGE },
  ];

  const curriculum = [
    {
      title: "Python Programming Fundamentals",
      weeks: 5,
      projects: 6,
      description: "Start your data journey with Python - the most in-demand programming language for analytics. No prior coding experience needed. We begin from absolute basics and progressively build your confidence with hands-on exercises every single day.",
      outcomes: [
        "Python basics: variables, data types, operators, and control flow",
        "Functions, loops, and error handling with real-world examples",
        "Data structures: lists, dictionaries, sets - when to use each",
        "Introduction to Pandas & NumPy for data manipulation",
        "File handling: reading CSVs, Excel files, and JSON data",
        "Git basics: version control for tracking your analysis work",
      ],
      tools: ["Python", "Excel", "Jupyter Notebook", "VS Code", "Pandas", "NumPy", "Git"],
      // Terminal/code icon
      iconPath: "M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
    },
    {
      title: "SQL & Database Essentials",
      weeks: 4,
      projects: 5,
      description: "SQL is the language of data - every analyst uses it daily. Learn to query databases confidently, from simple SELECTs to complex analytical queries. By the end, you'll write queries that extract meaningful insights from millions of rows.",
      outcomes: [
        "SQL fundamentals: SELECT, WHERE, GROUP BY, ORDER BY, HAVING",
        "JOINs mastery: INNER, LEFT, RIGHT, FULL - when and why to use each",
        "Advanced SQL: subqueries, CTEs, and window functions",
        "Aggregate functions and data summarization techniques",
        "Database design basics: tables, keys, and relationships",
        "Working with cloud databases: BigQuery and PostgreSQL",
      ],
      tools: ["PostgreSQL", "Google BigQuery", "MySQL", "DBeaver"],
      // Database icon
      iconPath: "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4",
    },
    {
      title: "Data Visualization & Business Intelligence",
      weeks: 4,
      projects: 5,
      description: "Transform numbers into visual stories that drive decisions. Master the art of creating dashboards that executives actually use. Learn both Tableau and Power BI - the two most sought-after BI tools in the job market.",
      outcomes: [
        "Data visualization principles: choosing the right chart for your data",
        "Tableau: from basics to calculated fields and parameters",
        "Power BI: data modeling, DAX formulas, and report design",
        "Dashboard design: layout, color theory, and user experience",
        "Interactive filters, drill-downs, and dynamic visualizations",
        "Data storytelling: presenting insights that influence decisions",
      ],
      tools: ["Tableau", "Power BI", "Google Data Studio", "Excel Advanced"],
      // Bar chart icon
      iconPath: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    },
    {
      title: "Statistics & Exploratory Data Analysis",
      weeks: 3,
      projects: 4,
      description: "Build your statistical intuition - the secret weapon of great analysts. Learn to explore datasets systematically, spot patterns, identify anomalies, and make data-driven recommendations with confidence.",
      outcomes: [
        "Descriptive statistics: mean, median, mode, standard deviation",
        "Data distributions: normal, skewed, and when it matters",
        "Correlation analysis: finding relationships in your data",
        "Hypothesis testing and A/B testing fundamentals",
        "EDA techniques: systematic approach to understanding any dataset",
        "Identifying outliers, missing data, and data quality issues",
      ],
      tools: ["Python", "Pandas", "Matplotlib", "Seaborn", "SciPy"],
      // Trending up / analytics icon
      iconPath: "M3 3v18h18M7 16l4-4 4 4 6-6m0 0v4m0-4h-4",
    },
    {
      title: "Machine Learning for Analysts",
      weeks: 4,
      projects: 5,
      description: "Demystify machine learning and add predictive power to your analytics toolkit. Focus on practical ML applications that analysts use daily: forecasting sales, predicting churn, and segmenting customers. No PhD required - just curiosity.",
      outcomes: [
        "ML fundamentals: supervised vs unsupervised learning explained simply",
        "Linear & logistic regression: predicting numbers and categories",
        "Decision trees and random forests: interpretable predictions",
        "Customer segmentation using clustering techniques",
        "Model evaluation: accuracy, precision, recall - what matters when",
        "Feature engineering: creating predictive signals from raw data",
      ],
      tools: ["Scikit-learn", "XGBoost", "Python", "Jupyter", "Streamlit"],
      // Brain / neural network icon
      iconPath: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
    },
    {
      title: "GenAI & LLM Applications",
      weeks: 2,
      projects: 4,
      description: "The future of analytics is AI-augmented. Learn to leverage ChatGPT, Claude, and other LLMs to 10x your productivity. Build AI assistants that write SQL, generate reports, and answer data questions in plain English.",
      outcomes: [
        "Prompt engineering: getting reliable outputs from AI models",
        "Using ChatGPT & Claude for data analysis and code generation",
        "Text-to-SQL: querying databases with natural language",
        "Automated report generation and insight summarization",
        "Building simple RAG systems for domain-specific Q&A",
        "AI ethics and responsible use in business analytics",
      ],
      tools: ["ChatGPT", "Claude", "OpenAI API", "LangChain", "Streamlit"],
      // Sparkles / AI icon
      iconPath: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",
    },
    {
      title: "Capstone Project",
      weeks: 2,
      projects: 1,
      description: "Put everything together in a comprehensive real-world project. Work on an actual business problem, build an end-to-end analytics solution, and present to industry professionals. Graduate with a portfolio piece that impresses employers.",
      outcomes: [
        "Scope and plan a complete analytics project independently",
        "Build end-to-end pipeline: data collection to final dashboard",
        "Apply ML models to generate actionable business predictions",
        "Integrate GenAI to enhance your analytics solution",
        "Create professional documentation and presentation",
        "Present findings to industry panel and receive feedback",
      ],
      tools: ["All Previous Tools", "GitHub Portfolio", "Notion", "Loom"],
      // Rocket / launch icon
      iconPath: "M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.63 8.25m6 6.12l-3 3m0-12.75a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0z",
    },
  ];

  const tools = [
    // Row 1 - Core Data Tools
    "Excel", "MySQL", "Tableau", "Power BI", "Python", "R", "NumPy", "Pandas", "Matplotlib", "Seaborn", "Jupyter", "Google Colab", "Scikit-learn", "Git", "SQL",
    // Row 2 - Advanced Analytics & ML
    "PySpark", "Statsmodels", "SciPy", "TensorFlow", "Keras", "Apache Spark", "MongoDB", "PostgreSQL", "Looker", "dbt", "Airflow", "BigQuery", "Snowflake", "Hadoop", "Docker",
    // Row 3 - Additional Tools
    "Azure", "AWS", "GCP", "FastAPI", "Flask", "Plotly", "PyTorch", "HuggingFace", "SpaCy", "Scrapy", "Google Analytics", "AWS QuickSight", "Imbalanced-learn",
  ];

  // Industry-specific projects for infinite scroll carousel
  const industryProjects = [
    // E-commerce & Retail
    { title: "Real-time Inventory Optimization", domain: "E-commerce", tags: ["Python", "SQL", "Tableau"], color: "#F97316", desc: "AI-powered inventory management reducing stockouts by 34%" },
    { title: "Customer Lifetime Value Prediction", domain: "Retail", tags: ["Python", "Scikit-learn", "Power BI"], color: "#3B82F6", desc: "ML model predicting CLV with 91% accuracy for targeted marketing" },
    { title: "Dynamic Pricing Engine", domain: "E-commerce", tags: ["Python", "TensorFlow", "FastAPI"], color: "#8B5CF6", desc: "Real-time price optimization boosting revenue 18%" },
    { title: "Market Basket Analysis", domain: "Retail", tags: ["Python", "Pandas", "Plotly"], color: "#06B6D4", desc: "Association rules engine increasing cross-sell by 27%" },
    // Finance & Banking
    { title: "Credit Risk Scoring Model", domain: "Banking", tags: ["Python", "XGBoost", "Snowflake"], color: "#EF4444", desc: "Ensemble model reducing default rates by 23%" },
    { title: "Real-time Fraud Detection", domain: "FinTech", tags: ["PySpark", "Kafka", "MongoDB"], color: "#F59E0B", desc: "Stream processing detecting fraud in <100ms" },
    { title: "Portfolio Risk Analytics", domain: "Finance", tags: ["Python", "NumPy", "Tableau"], color: "#10B981", desc: "VaR & Monte Carlo simulation dashboard for fund managers" },
    { title: "Loan Default Prediction", domain: "Banking", tags: ["Python", "LightGBM", "AWS"], color: "#3B82F6", desc: "94.7% AUC model deployed on AWS SageMaker" },
    // Healthcare & Pharma
    { title: "Patient Readmission Prediction", domain: "Healthcare", tags: ["Python", "TensorFlow", "BigQuery"], color: "#EC4899", desc: "Deep learning reducing 30-day readmissions by 19%" },
    { title: "Clinical Trial Analytics", domain: "Pharma", tags: ["R", "Shiny", "PostgreSQL"], color: "#14B8A6", desc: "Interactive trial dashboard tracking 50K+ patients" },
    { title: "Healthcare Cost Optimization", domain: "Healthcare", tags: ["Python", "Tableau", "Snowflake"], color: "#6366F1", desc: "Cost analysis saving $2.1M annually" },
    // Supply Chain & Logistics
    { title: "Demand Forecasting Model", domain: "Supply Chain", tags: ["Python", "Prophet", "Airflow"], color: "#F97316", desc: "Time-series model with 94% MAPE accuracy" },
    { title: "Route Optimization Engine", domain: "Logistics", tags: ["Python", "OR-Tools", "GCP"], color: "#0EA5E9", desc: "Reducing delivery costs by 22% using graph algorithms" },
    { title: "Supplier Performance Dashboard", domain: "Procurement", tags: ["Power BI", "SQL", "dbt"], color: "#84CC16", desc: "Automated vendor scoring across 200+ suppliers" },
    // Marketing & AdTech
    { title: "Marketing Attribution Model", domain: "Marketing", tags: ["Python", "SQL", "Looker"], color: "#A855F7", desc: "Multi-touch attribution increasing ROAS 31%" },
    { title: "Customer Churn Prediction", domain: "SaaS", tags: ["Python", "XGBoost", "Mixpanel"], color: "#EF4444", desc: "Proactive churn model saving $1.8M ARR" },
    { title: "A/B Testing Platform", domain: "Product", tags: ["Python", "Bayesian Stats", "dbt"], color: "#3B82F6", desc: "Statistical engine running 100+ experiments/month" },
    { title: "Social Sentiment Analysis", domain: "Brand", tags: ["Python", "HuggingFace", "Streamlit"], color: "#06B6D4", desc: "NLP pipeline processing 500K+ mentions daily" },
    // HR & People Analytics
    { title: "Employee Attrition Model", domain: "HR Tech", tags: ["Python", "Scikit-learn", "Tableau"], color: "#F59E0B", desc: "Predicting turnover risk 6 months in advance" },
    { title: "Workforce Planning Dashboard", domain: "HR", tags: ["Power BI", "SQL", "Excel"], color: "#10B981", desc: "Capacity planning for 5,000+ employee org" },
    // Manufacturing & IoT
    { title: "Predictive Maintenance System", domain: "Manufacturing", tags: ["Python", "IoT", "Azure"], color: "#8B5CF6", desc: "Reducing unplanned downtime by 45%" },
    { title: "Quality Control Analytics", domain: "QA", tags: ["Python", "OpenCV", "TensorFlow"], color: "#EC4899", desc: "Computer vision detecting defects at 99.2% accuracy" },
    // Tech & SaaS
    { title: "Product Analytics Dashboard", domain: "SaaS", tags: ["SQL", "dbt", "Amplitude"], color: "#14B8A6", desc: "Self-serve analytics for 50+ product teams" },
    { title: "User Engagement Scoring", domain: "Product", tags: ["Python", "BigQuery", "Looker"], color: "#6366F1", desc: "Behavioral scoring driving 28% feature adoption" },
    { title: "Revenue Forecasting Model", domain: "Finance", tags: ["Python", "Prophet", "Snowflake"], color: "#F97316", desc: "Quarterly forecast within 3% variance" },
    { title: "GenAI Content Analytics", domain: "AI/ML", tags: ["Python", "LangChain", "Pinecone"], color: "#A855F7", desc: "RAG-powered analytics on 100K+ documents" },
  ];

  const faqs = [
    { question: "Who is this program designed for?", answer: "Designed for graduates, working professionals, and career changers interested in this booming field. Beginners are welcome." },
    { question: "How is the program organized?", answer: "A blend of recorded lessons, live mentor-led classes, and hands-on projects in small batches." },
    { question: "What skills and concepts will I learn?", answer: "Excel, Python, SQL, data visualization, machine learning, deep learning, big data, and MLOps through practical projects." },
    { question: "What career roles can I pursue after completion?", answer: "You can pursue fast-growing careers such as Data Analyst, BI Analyst, Machine Learning Engineer, and gain the skills needed to be job-ready for leading companies." },
    { question: "How long is the Data Analytics program at Linkway Learning?", answer: "It is a comprehensive 6-month program designed to take you from basics to advanced industry standards." },
    { question: "Who will be teaching the course?", answer: "You will learn directly from veteran industry experts with years of hands-on experience in the data analytics field." },
    { question: "Do I need a technical background to join?", answer: "Not at all. The course is beginner-friendly and starts with the absolute fundamentals, making it accessible to everyone." },
    { question: "How does Linkway Learning help me get hired?", answer: "As it is a 100% placement program, beyond technical skills, we provide end-to-end career support including resume building, LinkedIn optimization, and mock interviews to make you 100% job-ready." },
  ];

  const highlights = [
    { icon: ShieldIcon, label: "100% Placement", sub: "Personalized Path to Employment", color: BRAND_ORANGE },
    { icon: HeadsetIcon, label: "Unlimited 1:1 Doubt Clearing", sub: "Personal mentorship", color: ACCENT_BLUE },
    { icon: MicrosoftLogo, label: "Microsoft Certification", sub: "Exam prep included", color: ACCENT_CYAN },
    { icon: VideoIcon, label: "Live Interactive Classes", sub: "Learn from FAANG mentors", color: BRAND_ORANGE },
  ];

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

        {/* ── Animated background elements ── */}

        {/* Floating code fragments */}
        {[
          { text: "df.head()", x: "8%", y: "15%", dur: 18, delay: 0 },
          { text: "SELECT *", x: "85%", y: "22%", dur: 22, delay: 2 },
          { text: "import pandas", x: "72%", y: "75%", dur: 20, delay: 4 },
          { text: ".groupby()", x: "15%", y: "70%", dur: 24, delay: 1 },
          { text: "plt.show()", x: "55%", y: "12%", dur: 19, delay: 3 },
          { text: "model.fit()", x: "90%", y: "55%", dur: 21, delay: 5 },
          { text: "np.array()", x: "30%", y: "85%", dur: 23, delay: 2 },
          { text: "accuracy: 94%", x: "45%", y: "90%", dur: 17, delay: 6 },
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
          {/* Flowing curve 1 */}
          <motion.path
            d="M-100,200 C200,100 400,350 700,180 S1100,300 1500,150"
            fill="none"
            stroke="url(#flowGrad1)"
            strokeWidth="1.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 3, delay: 0.5, ease: "easeInOut" }}
          />
          {/* Flowing curve 2 */}
          <motion.path
            d="M-50,400 C250,300 500,500 800,350 S1200,450 1500,380"
            fill="none"
            stroke="url(#flowGrad2)"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 3.5, delay: 1, ease: "easeInOut" }}
          />
          {/* Flowing curve 3 */}
          <motion.path
            d="M-80,550 C180,480 420,600 720,500 S1050,580 1500,520"
            fill="none"
            stroke="url(#flowGrad3)"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 4, delay: 1.5, ease: "easeInOut" }}
          />
          {/* Animated pulse dots traveling along curves */}
          <motion.circle
            r="3"
            fill={BRAND_ORANGE}
            opacity="0.4"
            animate={{
              cx: [0, 350, 700, 1100, 1500],
              cy: [200, 150, 250, 200, 150],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
          <motion.circle
            r="2.5"
            fill={ACCENT_BLUE}
            opacity="0.3"
            animate={{
              cx: [0, 400, 800, 1200, 1500],
              cy: [400, 350, 450, 380, 380],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear", delay: 2 }}
          />
          <motion.circle
            r="2"
            fill={ACCENT_CYAN}
            opacity="0.25"
            animate={{
              cx: [0, 300, 600, 1000, 1500],
              cy: [550, 500, 560, 520, 520],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear", delay: 3 }}
          />
        </svg>

        <div className="noise-overlay absolute inset-0 pointer-events-none opacity-[0.02]" />

        <motion.div className="relative z-10 max-w-6xl mx-auto px-6 w-full" style={{ opacity: heroOpacity, y: heroY }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-24 lg:py-0">
            {/* Left: Text */}
            <div className="pt-8 lg:pt-0">
              <motion.h1
                className="text-5xl sm:text-6xl lg:text-[4.5rem] font-bold leading-[1.05] tracking-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15, ease }}
              >
                <span className="text-white">Become a</span><br />
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${BRAND_ORANGE}, #f59e0b)` }}>
                  Data Analyst
                </span>
              </motion.h1>

              {/* Typing animation - Codecademy-inspired */}
              <motion.div
                className="mt-5 h-8 flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <span className="text-gray-500 text-base">Master</span>
                <TypeWriter
                  words={["Excel & Power BI", "SQL & Python", "Tableau & Seaborn", "Machine Learning", "Data Storytelling"]}
                  className="text-base font-mono font-semibold text-white"
                />
              </motion.div>

              <motion.p className="mt-5 text-base md:text-lg text-gray-400 leading-relaxed max-w-lg" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35 }}>
                Go from spreadsheets to strategic thinking in 6 months. Real tools, real projects, 100% placement.
              </motion.p>

              <motion.div className="mt-8 flex flex-wrap items-center gap-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.55 }}>
                <Magnetic>
                  <motion.button onClick={openEnquiry} className="group relative px-7 py-3.5 rounded-xl font-semibold text-sm overflow-hidden cursor-pointer" style={{ backgroundColor: BRAND_ORANGE }} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <span className="relative z-10 flex items-center gap-2 text-white">Start Learning <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
                  </motion.button>
                </Magnetic>
                <Magnetic>
                  <motion.button onClick={openEnquiry} className="px-7 py-3.5 rounded-xl font-semibold text-sm border border-white/[0.12] text-white/80 hover:text-white hover:border-white/25 hover:bg-white/[0.04] transition-all duration-300 cursor-pointer" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    Download Syllabus
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

      {/* ═══════ HIGHLIGHTS BAR - Cambly-inspired alternating colored strip ═══════ */}
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
              Our Data Analytics program equips you with industry-ready skills through advanced tools and expert support.
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
        {/* Animated background grid */}
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />
        {/* Floating gradient orbs */}
        <motion.div
          className="absolute top-20 -left-32 w-[400px] h-[400px] rounded-full blur-[120px]"
          style={{ background: `radial-gradient(circle, ${BRAND_ORANGE}30, transparent 70%)` }}
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-10 -right-32 w-[350px] h-[350px] rounded-full blur-[120px]"
          style={{ background: `radial-gradient(circle, ${ACCENT_BLUE}25, transparent 70%)` }}
          animate={{ x: [0, -30, 0], y: [0, 25, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative max-w-6xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <SectionLabel center light>Built For</SectionLabel>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Is This{" "}
                <motion.span
                  className="relative inline-block"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3, type: "spring", stiffness: 200 }}
                >
                  <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${BRAND_ORANGE}, #FF6B6B, ${ACCENT_BLUE})` }}>You</span>
                  <motion.span
                    className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full"
                    style={{ background: `linear-gradient(90deg, ${BRAND_ORANGE}, ${ACCENT_BLUE})` }}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  />
                </motion.span>
                ?
              </h2>
              <motion.p
                className="mt-4 text-gray-400 text-lg max-w-md mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Designed for people who want real skills, not just another certificate.
              </motion.p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {personas.map((p, i) => (
              <motion.div
                key={i}
                className="group relative"
                initial={{ opacity: 0, y: 60, rotateX: 15 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: "-5%" }}
                transition={{ duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Glow border on hover */}
                <div
                  className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[1px]"
                  style={{ background: `linear-gradient(135deg, ${p.color}60, transparent 50%, ${p.color}30)` }}
                />
                <div className="relative bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-7 group-hover:bg-white/[0.07] transition-all duration-500">
                  {/* Spotlight follow effect */}
                  <div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: `radial-gradient(300px circle at 50% 50%, ${p.color}08, transparent 60%)` }}
                  />

                  <div className="relative flex items-start gap-5">
                    {/* Animated icon container */}
                    <motion.div
                      className="relative w-14 h-14 rounded-xl flex items-center justify-center shrink-0 overflow-hidden"
                      style={{ backgroundColor: `${p.color}15` }}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    >
                      {/* Shimmer effect */}
                      <motion.div
                        className="absolute inset-0"
                        style={{ background: `linear-gradient(105deg, transparent 40%, ${p.color}20 50%, transparent 60%)` }}
                        animate={{ x: ["-100%", "200%"] }}
                        transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
                      />
                      <p.icon className="relative w-6 h-6" style={{ color: p.color }} />
                    </motion.div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-bold text-white">{p.title}</h3>
                        <motion.div
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: p.color }}
                          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
                        />
                      </div>
                      <p className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">{p.desc}</p>
                    </div>

                    {/* Arrow indicator */}
                    <motion.div
                      className="shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M7 4l6 6-6 6" stroke={p.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
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
              { icon: LayersIcon, title: "Industry Vetted Curriculum", desc: "Targeted training for Data Analysis, Statistics, and AI models at the standards expected by top tech giants.", color: ACCENT_CYAN },
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
              Industry-aligned modules designed by FAANG experts to make you job-ready.
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

      {/* ═══════ TOOLS - Three-row marquee ═══════ */}
      <section className="relative py-20 px-6 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <SectionLabel center>Tech Stack</SectionLabel>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy-900 leading-tight text-center">
              40+ Tools You&apos;ll{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${ACCENT_BLUE}, ${BRAND_ORANGE})` }}>Master</span>
            </h2>
          </ScrollReveal>

          {/* Three-row scrolling marquee */}
          <div className="mt-14 space-y-5">
            {[tools.slice(0, 15), tools.slice(15, 30), tools.slice(30)].map((row, ri) => (
              <div key={ri} className="relative overflow-hidden" style={{ maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)", WebkitMaskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)" }}>
                <motion.div
                  className="flex gap-5 w-max"
                  animate={{ x: ri % 2 === 0 ? ["0%", "-50%"] : ["-50%", "0%"] }}
                  transition={{ duration: ri === 0 ? 35 : ri === 1 ? 40 : 32, repeat: Infinity, ease: "linear" }}
                >
                  {[...row, ...row].map((tool, i) => (
                    <div key={`${tool}-${i}`} className="shrink-0">
                      <ToolLogo name={tool} className="px-5 py-4 [&_img]:w-8 [&_img]:h-8 [&_span:last-child]:text-base" />
                    </div>
                  ))}
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ PROJECTS - Compact premium grid ═══════ */}
      <section className="relative py-16 px-6 overflow-hidden" style={{ backgroundColor: DARK_BG }}>
        {/* ── 1. AURORA SILK RIBBONS - flowing morphing gradient paths ── */}
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
            <filter id="ribbonGlow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          {/* Ribbon 1 - top flowing silk */}
          <motion.path
            d="M-100,120 C150,40 350,200 600,80 S950,180 1200,60 1500,140"
            fill="none" stroke="url(#ribbonA)" strokeWidth="2" filter="url(#ribbonGlow)"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
          />
          <motion.path
            d="M-100,125 C160,50 340,210 610,90 S940,190 1210,70 1500,150"
            fill="none" stroke="url(#ribbonA)" strokeWidth="1" opacity="0.5"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2.8, delay: 0.2, ease: "easeInOut" }}
          />
          {/* Ribbon 2 - middle flowing silk */}
          <motion.path
            d="M-50,320 C200,250 450,400 700,280 S1050,380 1300,300 1600,350"
            fill="none" stroke="url(#ribbonB)" strokeWidth="2" filter="url(#ribbonGlow)"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 3, delay: 0.4, ease: "easeInOut" }}
          />
          <motion.path
            d="M-50,326 C210,258 440,408 710,288 S1040,388 1310,308 1600,358"
            fill="none" stroke="url(#ribbonB)" strokeWidth="0.8" opacity="0.4"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 3.2, delay: 0.6, ease: "easeInOut" }}
          />
          {/* Ribbon 3 - bottom flowing silk */}
          <motion.path
            d="M-80,500 C180,440 400,550 680,460 S1000,530 1250,480 1600,520"
            fill="none" stroke="url(#ribbonC)" strokeWidth="1.5" filter="url(#ribbonGlow)"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 3.5, delay: 0.8, ease: "easeInOut" }}
          />

          {/* Glowing orbs traveling along ribbons */}
          <motion.circle r="4" fill={BRAND_ORANGE} opacity="0.6" filter="url(#ribbonGlow)"
            animate={{ cx: [-100, 150, 600, 1200, 1500], cy: [120, 40, 80, 60, 140] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
          <motion.circle r="3" fill={ACCENT_BLUE} opacity="0.5" filter="url(#ribbonGlow)"
            animate={{ cx: [-50, 200, 700, 1300, 1600], cy: [320, 250, 280, 300, 350] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear", delay: 2 }}
          />
          <motion.circle r="3.5" fill={ACCENT_CYAN} opacity="0.4" filter="url(#ribbonGlow)"
            animate={{ cx: [-80, 180, 680, 1250, 1600], cy: [500, 440, 460, 480, 520] }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear", delay: 4 }}
          />
        </svg>

        {/* ── 2. RISING DATA PARTICLES - code symbols floating up like embers ── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[
            { char: "{ }", x: "8%", delay: 0, dur: 12, size: 11 },
            { char: "=>", x: "15%", delay: 2, dur: 14, size: 10 },
            { char: "0x", x: "22%", delay: 5, dur: 11, size: 9 },
            { char: "//", x: "32%", delay: 1, dur: 13, size: 10 },
            { char: "[]", x: "42%", delay: 4, dur: 15, size: 11 },
            { char: "()", x: "52%", delay: 3, dur: 12, size: 9 },
            { char: "</>", x: "60%", delay: 6, dur: 14, size: 10 },
            { char: "&&", x: "68%", delay: 2, dur: 11, size: 10 },
            { char: ">>", x: "76%", delay: 5, dur: 13, size: 9 },
            { char: "$$", x: "84%", delay: 1, dur: 15, size: 11 },
            { char: "::", x: "91%", delay: 4, dur: 12, size: 10 },
            { char: "01", x: "18%", delay: 7, dur: 16, size: 9 },
            { char: "f(x)", x: "48%", delay: 3, dur: 11, size: 10 },
            { char: "+=", x: "72%", delay: 6, dur: 14, size: 9 },
            { char: "λ", x: "38%", delay: 8, dur: 13, size: 12 },
            { char: "Σ", x: "88%", delay: 2, dur: 12, size: 12 },
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

        {/* ── 3. WIREFRAME GEOMETRIC SHAPES - 3D-perspective rotating ── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Rotating diamond/rhombus - top right */}
          <motion.div
            className="absolute"
            style={{ top: "8%", right: "12%", width: 60, height: 60 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          >
            <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <motion.path
                d="M30 5 L55 30 L30 55 L5 30Z"
                stroke={BRAND_ORANGE}
                strokeWidth="0.8"
                strokeOpacity="0.15"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 2 }}
              />
              <motion.path
                d="M30 12 L48 30 L30 48 L12 30Z"
                stroke={BRAND_ORANGE}
                strokeWidth="0.5"
                strokeOpacity="0.08"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 2, delay: 0.3 }}
              />
            </svg>
          </motion.div>

          {/* Rotating hexagon - bottom left */}
          <motion.div
            className="absolute"
            style={{ bottom: "12%", left: "8%", width: 80, height: 80 }}
            animate={{ rotate: -360 }}
            transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
          >
            <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <motion.path
                d="M40 5 L70 20 L70 50 L40 65 L10 50 L10 20Z"
                stroke={ACCENT_CYAN}
                strokeWidth="0.8"
                strokeOpacity="0.12"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 2.5, delay: 0.5 }}
              />
              {/* Inner hexagon */}
              <motion.path
                d="M40 15 L60 25 L60 45 L40 55 L20 45 L20 25Z"
                stroke={ACCENT_CYAN}
                strokeWidth="0.5"
                strokeOpacity="0.07"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 2, delay: 0.8 }}
              />
              {/* Center dot */}
              <circle cx="40" cy="35" r="2" fill={ACCENT_CYAN} opacity="0.15" />
            </svg>
          </motion.div>

          {/* Rotating cube wireframe - center right */}
          <motion.div
            className="absolute"
            style={{ top: "40%", right: "5%", width: 50, height: 50 }}
            animate={{ rotate: 360, scale: [1, 1.05, 1] }}
            transition={{ rotate: { duration: 30, repeat: Infinity, ease: "linear" }, scale: { duration: 6, repeat: Infinity, ease: "easeInOut" } }}
          >
            <svg viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              {/* Front face */}
              <path d="M12 15 L38 15 L38 40 L12 40Z" stroke={ACCENT_BLUE} strokeWidth="0.6" strokeOpacity="0.12" />
              {/* Back face (offset) */}
              <path d="M18 10 L44 10 L44 35 L18 35Z" stroke={ACCENT_BLUE} strokeWidth="0.4" strokeOpacity="0.06" />
              {/* Connecting edges */}
              <line x1="12" y1="15" x2="18" y2="10" stroke={ACCENT_BLUE} strokeWidth="0.4" strokeOpacity="0.08" />
              <line x1="38" y1="15" x2="44" y2="10" stroke={ACCENT_BLUE} strokeWidth="0.4" strokeOpacity="0.08" />
              <line x1="38" y1="40" x2="44" y2="35" stroke={ACCENT_BLUE} strokeWidth="0.4" strokeOpacity="0.08" />
            </svg>
          </motion.div>

          {/* Small rotating triangle - top left */}
          <motion.div
            className="absolute"
            style={{ top: "18%", left: "5%", width: 40, height: 40 }}
            animate={{ rotate: -360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <motion.path
                d="M20 5 L35 32 L5 32Z"
                stroke={ACCENT_BLUE}
                strokeWidth="0.7"
                strokeOpacity="0.1"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: 1 }}
              />
            </svg>
          </motion.div>

          {/* Pulsing concentric circles - bottom right */}
          <div className="absolute" style={{ bottom: "20%", right: "18%", width: 70, height: 70 }}>
            <svg viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              {[28, 22, 16, 10].map((r, i) => (
                <motion.circle
                  key={`conc-${i}`}
                  cx="35" cy="35" r={r}
                  stroke={i % 2 === 0 ? BRAND_ORANGE : ACCENT_CYAN}
                  strokeWidth="0.5"
                  strokeOpacity="0.08"
                  fill="none"
                  animate={{ scale: [1, 1.15, 1], opacity: [0.06, 0.12, 0.06] }}
                  transition={{ duration: 4, delay: i * 0.6, repeat: Infinity, ease: "easeInOut" }}
                />
              ))}
            </svg>
          </div>
        </div>

        {/* ── 4. MORPHING GRADIENT BLOBS - organic breathing shapes ── */}
        <motion.div
          className="absolute w-[450px] h-[450px] pointer-events-none opacity-[0.07]"
          style={{
            top: "-10%", right: "-5%",
            background: `radial-gradient(ellipse at 30% 50%, ${BRAND_ORANGE}, ${ACCENT_BLUE} 50%, transparent 70%)`,
            borderRadius: "40% 60% 55% 45% / 55% 40% 60% 45%",
            filter: "blur(60px)",
          }}
          animate={{
            borderRadius: [
              "40% 60% 55% 45% / 55% 40% 60% 45%",
              "55% 45% 40% 60% / 45% 60% 40% 55%",
              "60% 40% 50% 50% / 50% 55% 45% 50%",
              "40% 60% 55% 45% / 55% 40% 60% 45%",
            ],
            x: [0, 30, -20, 0],
            y: [0, -20, 15, 0],
            scale: [1, 1.08, 0.95, 1],
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
            borderRadius: [
              "55% 45% 40% 60% / 45% 60% 40% 55%",
              "40% 60% 55% 45% / 60% 40% 55% 45%",
              "50% 50% 45% 55% / 40% 55% 50% 50%",
              "55% 45% 40% 60% / 45% 60% 40% 55%",
            ],
            x: [0, -25, 35, 0],
            y: [0, 25, -15, 0],
            scale: [1, 0.95, 1.1, 1],
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

      
      {/* ═══════ TESTIMONIALS - Premium carousel with floating orbs ═══════ */}
      <section className="relative py-14 px-6 overflow-hidden" style={{ background: 'linear-gradient(180deg, #f9fafb 0%, #f1f5f9 50%, #f9fafb 100%)' }}>
        {/* Animated floating orbs */}
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

            {/* ═══════ CAREER GROWTH ROADMAP - Animated SVG path ═══════ */}
      <section className="relative py-24 px-6 bg-white overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] rounded-full pointer-events-none" style={{ background: `radial-gradient(ellipse, ${ACCENT_BLUE}05, transparent 70%)` }} />
        <div className="max-w-6xl mx-auto relative z-10">
          <ScrollReveal>
            <SectionLabel center>Your Journey</SectionLabel>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy-900 leading-tight text-center">
              Your Career Growth{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${BRAND_ORANGE}, ${ACCENT_BLUE})` }}>Roadmap</span>
            </h2>
            <p className="text-center text-gray-500 mt-4 max-w-xl mx-auto text-sm leading-relaxed">
              A proven 4-step path to take you from upskilling to your dream job
            </p>
          </ScrollReveal>

          <div className="mt-20 relative">
            {/* SVG curved dashed path with traveling dot */}
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
                { title: "Hiring Rounds", desc: "Apply to 400+ hiring partners and clear technical interview rounds with confidence.", color: "#0EA5E9", icon: (<svg viewBox="0 0 48 48" fill="none" className="w-full h-full"><rect x="10" y="8" width="28" height="32" rx="3" stroke="currentColor" strokeWidth="2" /><path d="M16 16h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M16 22h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M16 28h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><motion.rect x="16" y="34" rx="1.5" height="3" fill="currentColor" opacity={0.6} animate={{ width: [8, 16, 8] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} /></svg>) },
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
