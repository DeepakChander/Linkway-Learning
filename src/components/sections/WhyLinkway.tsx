"use client";

import { motion } from "framer-motion";
import BorderGlow from "@/components/animation/BorderGlow";
import CrossFlicker from "@/components/animation/CrossFlicker";
import Marquee from "@/components/animation/Marquee";
import { Award, Briefcase, GraduationCap, Code2, Disc } from "lucide-react";

const values = [
  {
    icon: Code2,
    title: "Built by Practitioners",
    description: "Our curriculum comes straight from people working at Google, Amazon, and Deloitte - not textbook authors.",
  },
  {
    icon: Briefcase,
    title: "Your Career Starts Here",
    description: "From day one, you're connected to a network of 400+ companies actively hiring our graduates - with dedicated career support until you land the role you deserve.",
  },
  {
    icon: GraduationCap,
    title: "Two Credentials, One Program",
    description: "Walk out with a Linkway certificate and a Microsoft Azure AI certification - both recognized industry-wide.",
  },
  {
    icon: Award,
    title: "Projects Over Theory",
    description: "You'll build things every single week. By the end, your GitHub speaks louder than any degree.",
  },
];

const revealLines = [
  "Our alumni now work at companies",
  "most people only dream about.",
];

const partnerNames = [
  "Google", "Amazon", "Deloitte", "Microsoft", "Accenture",
  "TCS", "Infosys", "Wipro", "IBM", "Capgemini",
];

const partnerLogos: Record<string, string> = {
  Google: "/images/companies/google.svg",
  Amazon: "/images/companies/amazon.svg",
  Microsoft: "/images/companies/microsoft.svg",
  Accenture: "/images/companies/accenture.svg",
  TCS: "/images/companies/tcs.svg",
  IBM: "/images/companies/ibm.svg",
  Infosys: "/images/companies/infosys.svg",
  Wipro: "/images/companies/wipro.svg",
  Deloitte: "/images/companies/deloitte.svg",
  Capgemini: "/images/companies/capgemini.svg",
};

export default function WhyLinkway() {
  return (
    <section className="relative text-navy-900 overflow-hidden" style={{ backgroundColor: "#f2f1ee" }}>
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-24 relative">
        <CrossFlicker position="top-left" color="navy" size="lg" delay={0.2} />
        <CrossFlicker position="top-right" color="orange" size="md" delay={0.4} />

        <div className="max-w-7xl mx-auto w-full relative">
          {/* Headline */}
          <div className="mb-16 text-center max-w-5xl mx-auto relative z-10">
            <span className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-orange-100 text-orange-600 font-bold text-sm mb-6">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              Why Linkway?
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy-900 tracking-tight leading-tight">
              {revealLines.map((line, li) => (
                <span key={li} className="block">
                  {line}
                </span>
              ))}
            </h2>
          </div>

          {/* Radial Layout with cards */}
          <div className="relative mt-4 md:mt-12 min-h-[500px] flex items-center justify-center">
            {/* SVG Connector Lines */}
            <div className="absolute inset-0 hidden md:block pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 1000 600" preserveAspectRatio="none">
                {[
                  { d: "M500,300 L250,150" },
                  { d: "M500,300 L750,150" },
                  { d: "M500,300 L250,450" },
                  { d: "M500,300 L750,450" },
                ].map((line, i) => (
                  <path
                    key={i}
                    d={line.d}
                    className="connector-path"
                    stroke="url(#connectorGradient)"
                    strokeWidth="2"
                    fill="none"
                  />
                ))}
                <defs>
                  <linearGradient id="connectorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F5892A" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#E5E7EB" stopOpacity="0.6" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Center Hub - Animated */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden md:block">
              <div className="relative w-36 h-36 flex items-center justify-center">
                {/* Pulse ripple rings */}
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={`ripple-${i}`}
                    className="absolute inset-0 rounded-full border border-orange-400/30"
                    initial={{ scale: 0.6, opacity: 0.6 }}
                    animate={{ scale: [0.6, 1.4], opacity: [0.5, 0] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 1,
                      ease: "easeOut",
                    }}
                  />
                ))}

                {/* Outer ring - slow rotate */}
                <motion.div
                  className="absolute inset-0 rounded-full bg-orange-400/15"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Dashed ring - spinning */}
                <motion.div
                  className="absolute inset-0 border-2 border-dashed border-orange-300/60 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                />

                {/* Inner ring */}
                <motion.div
                  className="absolute inset-4 border border-orange-200/40 rounded-full"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                />

                {/* Orbiting dot */}
                <motion.div
                  className="absolute inset-0"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-orange-500 shadow-lg shadow-orange-500/50" />
                </motion.div>

                {/* Center icon - breathing glow */}
                <motion.div
                  className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center z-10"
                  animate={{
                    boxShadow: [
                      "0 0 15px 2px rgba(245,137,42,0.2)",
                      "0 0 30px 8px rgba(245,137,42,0.35)",
                      "0 0 15px 2px rgba(245,137,42,0.2)",
                    ],
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Disc className="w-8 h-8 text-orange-600" />
                </motion.div>
              </div>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-x-48 md:gap-y-32 w-full max-w-5xl relative z-10">
              {values.map((v, i) => (
                <div key={i} className="h-full">
                  <BorderGlow glowColor="orange" glowIntensity="subtle">
                    <div className="h-full bg-white p-8 rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300 hover:-translate-y-1 group">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center group-hover:bg-orange-500 group-hover:scale-110 transition-all duration-300">
                          <v.icon className="w-6 h-6 text-orange-600 group-hover:text-white transition-colors duration-300" />
                        </div>
                        <h3 className="text-xl font-bold text-navy-900 leading-tight group-hover:text-orange-600 transition-colors duration-300">
                          {v.title}
                        </h3>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {v.description}
                      </p>
                    </div>
                  </BorderGlow>
                </div>
              ))}
            </div>
          </div>

          {/* Partner names - auto-scrolling marquee */}
          <div className="mt-16 relative z-10">
            <p className="text-base text-orange-500 uppercase tracking-widest mb-5 font-bold text-center">Trusted by teams at</p>
            <div className="border-y border-gray-200 py-5">
              <Marquee speed={30} gap={12} pauseOnHover>
                {partnerNames.map((name) => (
                  <span
                    key={name}
                    className="inline-flex items-center gap-2 text-lg md:text-xl font-bold text-navy-900 whitespace-nowrap"
                  >
                    {partnerLogos[name] && (
                      <img src={partnerLogos[name]} alt={name} width={22} height={22} className="w-[22px] h-[22px] object-contain" />
                    )}
                    {name}
                    <span className="text-orange-400 mx-4">·</span>
                  </span>
                ))}
              </Marquee>
            </div>
          </div>
        </div>

        <CrossFlicker position="bottom-left" color="navy" size="md" delay={0.8} />
        <CrossFlicker position="bottom-right" color="orange" size="lg" delay={1} />
      </div>
    </section>
  );
}
