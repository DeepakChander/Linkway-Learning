"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollOdometer from "@/components/animation/ScrollOdometer";

gsap.registerPlugin(ScrollTrigger);

const companyLogos: Record<string, string> = {
  Google: "/images/companies/google.svg",
  Amazon: "/images/companies/amazon.svg",
  Microsoft: "/images/companies/microsoft.svg",
  Deloitte: "/images/companies/deloitte.svg",
  TCS: "/images/companies/tcs.svg",
  "Tech Mahindra": "/images/companies/tech-mahindra.svg",
  "Saint-Gobain": "/images/companies/saint-gobain.svg",
  "BNY Mellon": "/images/companies/bny-mellon.svg",
  Turing: "/images/companies/turing.svg",
  "IDFC First Bank": "/images/companies/idfc-first-bank.svg",
  AXA: "/images/companies/axa.svg",
  Juniper: "/images/companies/juniper.svg",
  iOPEX: "/images/companies/iopex.svg",
  Fractal: "/images/companies/fractal.svg",
  "Sony Pictures": "/images/companies/sony.svg",
  "AT&T": "/images/companies/att.svg",
  SpringWorks: "/images/companies/springworks.svg",
  "Uptime AI": "/images/companies/uptime-ai.svg",
  MUFG: "/images/companies/mufg.svg",
  MiQ: "/images/companies/miq.svg",
  HUL: "/images/companies/hul.svg",
  Genpact: "/images/companies/genpact.svg",
  Sprinklr: "/images/companies/sprinklr.svg",
  "Bandhan Bank": "/images/companies/bandhan-bank.svg",
  GlobalLogic: "/images/companies/globallogic.svg",
  Infosys: "/images/companies/infosys.svg",
  Wipro: "/images/companies/wipro.svg",
  IBM: "/images/companies/ibm.svg",
};

const monoLogos = new Set([
  "Amazon", "Microsoft", "IBM", "Wipro",
]);

const companyRoles: Record<string, string> = {
  Google: "AI / ML Engineer",
  Amazon: "Cloud Architect",
  Microsoft: "Data Scientist",
  Deloitte: "Analytics Consultant",
  TCS: "Full-Stack Developer",
  "Tech Mahindra": "DevOps Engineer",
  "Saint-Gobain": "Data Analyst",
  "BNY Mellon": "Quant Developer",
  Turing: "Remote AI Engineer",
  "IDFC First Bank": "Risk Analyst",
  AXA: "ML Operations",
  Juniper: "Network Automation",
  iOPEX: "Data Engineer",
  Fractal: "Decision Scientist",
  "Sony Pictures": "Media Tech Lead",
  "AT&T": "Platform Engineer",
  SpringWorks: "Product Engineer",
  "Uptime AI": "Applied ML",
  MUFG: "Quantitative Analyst",
  MiQ: "Programmatic Data",
  HUL: "Supply Chain AI",
  Genpact: "Process Automation",
  Sprinklr: "NLP Engineer",
  "Bandhan Bank": "Credit Risk ML",
  GlobalLogic: "Solutions Architect",
  Infosys: "Software Engineer",
  Wipro: "Cloud Engineer",
  IBM: "AI Research",
};

const row1 = [
  "Google", "Amazon", "Microsoft", "Deloitte", "TCS",
  "Tech Mahindra", "Saint-Gobain", "BNY Mellon", "Infosys",
];

const row2 = [
  "Turing", "IDFC First Bank", "AXA", "Juniper",
  "iOPEX", "Fractal", "Sony Pictures", "AT&T", "SpringWorks",
];

const row3 = [
  "Uptime AI", "MUFG", "MiQ", "HUL",
  "Genpact", "Sprinklr", "Bandhan Bank", "GlobalLogic", "Wipro",
];

function CompanyCard({ name }: { name: string }) {
  const role = companyRoles[name];
  return (
    <div className="group relative flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3 sm:py-4 w-52 sm:w-60 md:w-64 rounded-xl border border-white/[0.08] bg-white/[0.03] shrink-0 overflow-hidden hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-300">
      <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-white/[0.06] flex items-center justify-center shrink-0 aspect-square">
        <img
          src={companyLogos[name]}
          alt={name}
          width={28}
          height={28}
          className={`w-5 h-5 sm:w-7 sm:h-7 object-contain ${monoLogos.has(name) ? "brightness-0 invert" : ""}`}
        />
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-xs sm:text-sm font-medium text-white/80 truncate">
          {name}
        </span>
        <span className="text-[10px] sm:text-xs text-gray-600 truncate">
          {role}
        </span>
      </div>
    </div>
  );
}

interface InfiniteRowProps {
  items: string[];
  direction?: "left" | "right";
  speed?: number;
  className?: string;
}

function InfiniteRow({ items, direction = "left", speed = 60, className = "" }: InfiniteRowProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useGSAP(() => {
    const track = trackRef.current;
    if (!track) return;

    requestAnimationFrame(() => {
      const oneSetWidth = track.scrollWidth / 2;

      tweenRef.current = gsap.fromTo(
        track,
        { x: direction === "left" ? 0 : -oneSetWidth },
        {
          x: direction === "left" ? -oneSetWidth : 0,
          duration: speed,
          ease: "none",
          repeat: -1,
        }
      );
    });

    return () => {
      tweenRef.current?.kill();
    };
  }, { scope: trackRef });

  return (
    <div className={`overflow-hidden ${className}`}>
      <div
        ref={trackRef}
        className="flex gap-4 w-max"
        style={{ willChange: "transform" }}
      >
        {[...items, ...items].map((name, i) => (
          <CompanyCard key={`${name}-${i}`} name={name} />
        ))}
      </div>
    </div>
  );
}

export default function HiringPartners() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const headline = headlineRef.current;
      if (!section || !headline) return;

      const words = headline.querySelectorAll(".hw");
      gsap.set(words, { opacity: 0, y: 50, rotateX: -40, filter: "blur(6px)" });
      gsap.to(words, {
        opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)",
        duration: 0.8, ease: "power3.out", stagger: 0.08,
        scrollTrigger: { trigger: section, start: "top 80%", toggleActions: "play none none none" },
      });

      const badge = section.querySelector(".hp-badge");
      if (badge) {
        gsap.set(badge, { opacity: 0, y: 20 });
        gsap.to(badge, {
          opacity: 1, y: 0, duration: 0.6, ease: "power2.out",
          scrollTrigger: { trigger: section, start: "top 85%", toggleActions: "play none none none" },
        });
      }

      const subtitle = section.querySelector(".hp-subtitle");
      if (subtitle) {
        gsap.set(subtitle, { opacity: 0, y: 20 });
        gsap.to(subtitle, {
          opacity: 1, y: 0, duration: 0.6, delay: 0.4, ease: "power2.out",
          scrollTrigger: { trigger: section, start: "top 80%", toggleActions: "play none none none" },
        });
      }

      const rows = section.querySelectorAll(".marquee-row");
      rows.forEach((row, i) => {
        gsap.set(row, { opacity: 0, y: 30 });
        gsap.to(row, {
          opacity: 1, y: 0, duration: 0.7, delay: 0.5 + i * 0.15, ease: "power2.out",
          scrollTrigger: { trigger: section, start: "top 70%", toggleActions: "play none none none" },
        });
      });
    },
    { scope: sectionRef }
  );

  const headlineWords = ["These", "Teams", "Are", "Already", "Hiring"];

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-black">
      <div className="flex flex-col items-center justify-center px-4 sm:px-6 py-10 md:py-16 relative">
        <div className="max-w-4xl mx-auto w-full mb-10 sm:mb-12 md:mb-16 text-center">
          <span className="hp-badge inline-block py-1 sm:py-1.5 px-3 sm:px-4 rounded-full bg-orange-500/10 text-orange-400 font-semibold text-[10px] sm:text-xs mb-4 sm:mb-6 tracking-widest uppercase">
            Where You Could Work Next
          </span>

          <h2
            ref={headlineRef}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight mb-4 sm:mb-5 text-white"
            style={{ perspective: "800px" }}
          >
            {headlineWords.map((word, i) => (
              <span
                key={i}
                className={`hw inline-block will-change-[opacity,filter,transform] mr-[0.2em] sm:mr-[0.3em] last:mr-0 ${word === "Already" || word === "Hiring" ? "text-orange-400" : ""}`}
                style={{ transformStyle: "preserve-3d" }}
              >
                {word}
              </span>
            ))}
          </h2>

          <p className="hp-subtitle text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto px-2">
            Real roles. Real companies. These are the teams our graduates walk into.
          </p>
        </div>

        {/* Three auto-scrolling rows */}
        <div className="w-full space-y-2 sm:space-y-3 md:space-y-4 relative">
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 md:w-32 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 md:w-32 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

          <InfiniteRow items={row1} direction="left" speed={70} className="marquee-row" />
          <InfiniteRow items={row2} direction="right" speed={60} className="marquee-row" />
          <InfiniteRow items={row3} direction="left" speed={65} className="marquee-row" />
        </div>

        <div className="mt-6 sm:mt-8 text-center px-4">
          <div className="text-gray-300 text-xs sm:text-sm">
            <ScrollOdometer value={400} duration={2} suffix="+" animateSuffix className="text-orange-400 font-bold" /> hiring partners. New roles added every quarter across <span className="text-white font-medium">AI, data, cloud, and engineering.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
