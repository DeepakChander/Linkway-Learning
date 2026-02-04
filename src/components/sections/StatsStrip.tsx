"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollOdometer from "@/components/animation/ScrollOdometer";
import BorderGlow from "@/components/animation/BorderGlow";
import { TrendingUp, Users, Award, Briefcase } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { target: 8200, suffix: "+", label: "Careers Transformed", icon: Users, progress: 100 },
  { target: 400, suffix: "+", label: "Hiring Partners", icon: Briefcase, progress: 85 },
  { target: 85, suffix: "%", label: "Avg Salary Hike", icon: TrendingUp, progress: 85 },
  { target: 100, suffix: "%", label: "100% Placement", icon: Award, progress: 100 },
];

export default function StatsStrip() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  // Pin stats section and animate cards in with scroll scrub
  useGSAP(
    () => {
      const section = sectionRef.current;
      const cards = cardsRef.current;
      if (!section || !cards) return;

      // Pin section
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "+=80%",
        pin: true,
        pinSpacing: true,
        id: "stats-pin",
      });

      // Stagger cards entrance with scrub
      const cardEls = cards.querySelectorAll(".stat-card");
      gsap.from(cardEls, {
        y: 100,
        opacity: 0,
        scale: 0.9,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=60%",
          scrub: 1.5,
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="min-h-screen flex items-center py-24 px-6 relative overflow-hidden bg-gradient-to-r from-orange-600 to-orange-500 text-white"
    >
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.1]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolygon points='30,5 55,50 5,50' fill='none' stroke='white' stroke-width='1.5'/%3E%3C/svg%3E")`,
          backgroundSize: "60px 60px",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10" />

      <div className="max-w-7xl mx-auto relative z-10 w-full">
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((stat, i) => (
            <div key={i} className="stat-card">
              <BorderGlow glowColor="white" glowIntensity="strong">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                  {/* Glow border accent */}
                  <div
                    className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ boxShadow: "0 0 30px rgba(255,255,255,0.15) inset" }}
                  />

                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-white/20 rounded-2xl text-white">
                      <stat.icon className="w-6 h-6" />
                    </div>

                    {/* Circular Progress Ring */}
                    <div className="relative w-12 h-12">
                      <svg className="w-full h-full -rotate-90">
                        <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/20" />
                        <motion.circle
                          cx="24" cy="24" r="20"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="transparent"
                          className="text-white"
                          strokeLinecap="round"
                          strokeDasharray="125.6"
                          strokeDashoffset="125.6"
                          whileInView={{ strokeDashoffset: 125.6 - (125.6 * stat.progress) / 100 }}
                          viewport={{ once: true }}
                          transition={{ duration: 2, delay: 0.5 + i * 0.15, ease: "easeOut" }}
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">
                        {stat.progress}%
                      </span>
                    </div>
                  </div>

                  {/* ScrollOdometer */}
                  <div className="text-4xl lg:text-5xl font-bold text-white mb-2 drop-shadow-sm data-display">
                    <ScrollOdometer
                      value={stat.target}
                      suffix={stat.suffix}
                      duration={2}
                      delay={0.3 + i * 0.15}
                      animateSuffix
                    />
                  </div>
                  <p className="text-orange-50 font-medium text-sm tracking-wide uppercase opacity-90">
                    {stat.label}
                  </p>
                </div>
              </BorderGlow>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
