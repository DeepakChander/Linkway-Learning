"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Counter from "@/components/animation/Counter";
import { BorderGlow, Marquee, SpringReveal, StaggerLines } from "@/components/animation";
import SectionHeading from "@/components/ui/SectionHeading";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { ThemeProvider } from "@/lib/theme";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  { name: "Aditya Srivastava", from: "Full-Stack Developer", to: "Junior Data Scientist", company: "Globussoft", desc: "I could build apps, but I didn't know ML. Linkway filled that gap with real projects - computer vision, forecasting, the works. Now I'm doing data science full-time." },
  { name: "Arpit Jain", from: "Hospitality Professional", to: "Business Analyst", company: "EaseMyTrip", desc: "Hospitality was all I knew. I picked up SQL and analytics from scratch, and now I'm analyzing booking trends at EaseMyTrip. Completely different life." },
  { name: "Junaid Khan", from: "Operations & Banking", to: "Business Analyst", company: "Razorpay", desc: "Banking ops had no growth path for me. Six months of focused learning later, I'm a business analyst at Razorpay doing work that actually excites me." },
  { name: "Rajeev Chauhan", from: "Operations Executive", to: "Business Research Analyst", company: "EXL", desc: "I was stuck in operations. The program taught me how to think analytically and back decisions with data. Now I do exactly that at EXL." },
  { name: "Rehan Siddiqui", from: "Non-Tech Background", to: "Data Analyst", company: "Amazon", desc: "Zero tech background. Linkway taught me Tableau, Power BI, and how to actually think with data. Now I'm at Amazon solving real business problems." },
  { name: "Shivani Rawat", from: "Operations & Product", to: "Business Analyst", company: "Booking.com", desc: "Operations felt like a dead end. The program gave me the technical edge I needed, and now I'm doing requirement analysis at Booking.com." },
  { name: "Shalendra Gupta", from: "Sales Executive", to: "Business Analyst", company: "Vishal Mega Mart", desc: "Went from selling on the floor to analyzing what sells. Excel and Power BI changed how I see business - and my career." },
  { name: "Syed Nehal", from: "HR & Accounting", to: "Data Analyst", company: "Safegraph", desc: "HR and accounting weren't going anywhere for me. Project-based learning made the switch possible. Now I'm a data analyst working globally." },
  { name: "Vansh Pathak", from: "Accounting Intern", to: "Reporting Analyst", company: "Accenture", desc: "From crunching numbers in spreadsheets to building real SQL reports at Accenture. The jump felt huge, but the mentors made it doable." },
];

const stats = [
  { target: 500, suffix: "+", label: "Careers Launched" },
  { target: 40, suffix: "+", label: "Hiring Partners" },
  { target: 85, suffix: "%", label: "Avg Salary Jump" },
  { target: 100, suffix: "%", label: "Placement Rate" },
];

const partners = [
  "Amazon", "Google", "Razorpay", "Booking.com", "Accenture",
  "EXL", "EaseMyTrip", "Globussoft", "Safegraph", "Vishal Mega Mart",
  "TCS", "Tech Mahindra", "Saint-Gobain", "BNY Mellon", "Turing",
  "IDFC First Bank", "AXA", "Juniper Networks", "iOPEX", "Fractal",
  "Sony Pictures", "AT&T", "SpringWorks", "Uptime AI", "MUFG",
  "MiQ", "HUL", "Deloitte", "Genpact", "Sprinklr",
  "Bandhan Bank", "GlobalLogic", "Tiger Analytics", "Wipro", "Epsilon",
  "Fujitsu", "PlanSource", "Siemens", "Paytm", "Citi",
];

export default function SuccessStoriesPage() {
  const storiesRef = useRef<HTMLDivElement>(null);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  useGSAP(() => {
    const container = storiesRef.current;
    if (!container) return;
    const cards = container.querySelectorAll(".story-card");
    cards.forEach((card, i) => {
      ScrollTrigger.create({
        trigger: card,
        start: "top 70%",
        end: "bottom 30%",
        onEnter: () => setFocusedIndex(i),
        onEnterBack: () => setFocusedIndex(i),
      });
    });
  });

  const getCardClass = useCallback(
    (i: number) => {
      if (focusedIndex === null) return "";
      if (i === focusedIndex) return "is-focused";
      return "is-dimmed";
    },
    [focusedIndex]
  );

  useEffect(() => {
    const handleScroll = () => {
      const container = storiesRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) {
        setFocusedIndex(null);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <ThemeProvider theme="light">
      <main className="min-h-screen bg-white text-navy-900">
        {/* Hero - Keep dark overlay on hero image for contrast */}
        <section className="relative pt-32 pb-20 px-6 text-center max-w-full">
          <div className="absolute inset-0 z-0">
            <Image src="/images/sections/success-stories-hero.png" alt="" fill className="object-cover" priority />
            <div className="absolute inset-0 bg-navy-900/75" />
          </div>
          <div className="max-w-5xl mx-auto relative z-10">
            <SpringReveal distance={150} stiffness={100} damping={10} mass={1}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white">
                They Did It. So Can You.
              </h1>
            </SpringReveal>
            <div className="mt-8 max-w-3xl mx-auto">
              <StaggerLines baseDelay={0.5} staggerDelay={0.1} skewY={-5} distance={150}>
                {[
                  <p key="l1" className="text-gray-300 text-lg md:text-xl">
                    Every name on this page is a real person who was exactly
                  </p>,
                  <p key="l2" className="text-gray-300 text-lg md:text-xl">
                    where you are right now. Here's where they ended up.
                  </p>,
                ]}
              </StaggerLines>
            </div>
            <SpringReveal delay={0.9} distance={60} damping={15}>
              <div className="mt-8 mx-auto w-24 h-1 rounded-full bg-gradient-to-r from-orange-500 to-orange-400" />
            </SpringReveal>
          </div>
        </section>

        {/* Featured Stories */}
        <section className="py-16 px-6 max-w-6xl mx-auto">
          <SpringReveal skewY={-5} distance={150} damping={12}>
            <SectionHeading label="Success Stories" title="The Full List" />
          </SpringReveal>

          <div ref={storiesRef} className="mt-12 grid md:grid-cols-2 gap-8">
            {testimonials.map((t, i) => (
              <SpringReveal key={i} delay={i * 0.05} distance={120} skewY={-3} stiffness={80} damping={12}>
                <div className={`focus-on-scroll ${getCardClass(i)}`}>
                  <BorderGlow glowColor="orange" glowIntensity="subtle">
                    <Card className="h-full border-l-2 border-l-orange-500/40 hover-blur-lift">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-navy-900">{t.name}</h3>
                          <p className="text-orange-500 text-sm">{t.from} &rarr; {t.to}</p>
                        </div>
                        <Badge variant="orange">{t.company}</Badge>
                      </div>
                      <p className="text-gray-600 leading-relaxed text-sm">{t.desc}</p>
                    </Card>
                  </BorderGlow>
                </div>
              </SpringReveal>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section className="py-20 px-6 relative bg-gray-50">
          <div className="max-w-6xl mx-auto relative">
            <SpringReveal distance={100} stiffness={120} damping={14}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                {stats.map((stat, i) => (
                  <SpringReveal key={i} delay={i * 0.1} distance={80} stiffness={100} damping={12}>
                    <div className="text-center">
                      <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-navy-900 mb-2">
                        <Counter target={stat.target} suffix={stat.suffix} />
                      </div>
                      <p className="text-gray-500 text-sm md:text-base">{stat.label}</p>
                    </div>
                  </SpringReveal>
                ))}
              </div>
            </SpringReveal>
          </div>
        </section>

        {/* Hiring Partners */}
        <section className="py-20 px-6 max-w-6xl mx-auto">
          <SpringReveal skewY={-5} distance={150} damping={12}>
            <SectionHeading
              label="Hiring Partners"
              title="Companies That Hire From Us"
              description="40+ companies actively recruit Linkway graduates. Here's a snapshot."
            />
          </SpringReveal>
          <div className="mt-12 space-y-4">
            <Marquee speed={25} pauseOnHover direction="left" gap={6}>
              {partners.slice(0, 20).map((name) => (
                <span key={name} className="inline-block px-5 py-2.5 rounded-lg bg-gray-50 border border-gray-200 hover-blur-lift text-sm text-gray-600 hover:text-navy-900 whitespace-nowrap">
                  {name}
                </span>
              ))}
            </Marquee>
            <Marquee speed={25} pauseOnHover direction="right" gap={6}>
              {partners.slice(20).map((name) => (
                <span key={name} className="inline-block px-5 py-2.5 rounded-lg bg-gray-50 border border-gray-200 hover-blur-lift text-sm text-gray-600 hover:text-navy-900 whitespace-nowrap">
                  {name}
                </span>
              ))}
            </Marquee>
          </div>
        </section>
      </main>
    </ThemeProvider>
  );
}
