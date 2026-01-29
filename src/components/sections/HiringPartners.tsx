"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
    <div className="group relative flex items-center gap-4 px-5 py-4 w-64 md:w-72 rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm shrink-0 overflow-hidden">
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-orange-500/10 via-transparent to-orange-500/5 pointer-events-none" />
      <div className="w-11 h-11 rounded-xl bg-white/[0.05] flex items-center justify-center shrink-0">
        <img
          src={companyLogos[name]}
          alt={name}
          width={28}
          height={28}
          className={`w-7 h-7 object-contain transition-transform duration-300 group-hover:scale-110 ${monoLogos.has(name) ? "brightness-0 invert" : ""}`}
        />
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-sm font-semibold text-white/90 group-hover:text-white transition-colors duration-300 truncate">
          {name}
        </span>
        <span className="text-xs text-gray-500 group-hover:text-orange-400/80 transition-colors duration-300 truncate">
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
    <section ref={sectionRef} className="relative border-t border-white/5 overflow-hidden" style={{ backgroundColor: "#060E1A" }}>
      <div className="flex flex-col items-center justify-center px-6 py-16 md:py-20 relative">
        <div className="max-w-4xl mx-auto w-full mb-14 text-center">
          <span className="hp-badge inline-block py-1.5 px-4 rounded-full bg-orange-500/10 text-orange-400 font-semibold text-sm mb-6 tracking-wide">
            Where You Could Work Next
          </span>

          <h2
            ref={headlineRef}
            className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-5 text-white"
            style={{ perspective: "800px" }}
          >
            {headlineWords.map((word, i) => (
              <span
                key={i}
                className="hw inline-block will-change-[opacity,filter,transform] mr-[0.3em] last:mr-0"
                style={{ transformStyle: "preserve-3d" }}
              >
                {word}
              </span>
            ))}
          </h2>

          <p className="hp-subtitle text-lg md:text-xl text-gray-400">
            Real roles. Real companies. These are the teams our graduates walk into - not internships, not promises.
          </p>
        </div>

        {/* Three auto-scrolling rows - GSAP driven */}
        <div className="w-full space-y-4 md:space-y-5 relative">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#060E1A] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#060E1A] to-transparent z-10 pointer-events-none" />

          <InfiniteRow items={row1} direction="left" speed={70} className="marquee-row" />
          <InfiniteRow items={row2} direction="right" speed={60} className="marquee-row" />
          <InfiniteRow items={row3} direction="left" speed={65} className="marquee-row" />
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            <span className="text-white font-semibold">400+</span> companies. Open roles across AI, data, cloud, and engineering - updated every quarter.
          </p>
        </div>
      </div>
    </section>
  );
}
