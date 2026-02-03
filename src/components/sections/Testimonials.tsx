"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import ScrollReveal from "@/components/animation/ScrollReveal";
import Image from "next/image";
import { Star, StarHalf, ArrowRight } from "lucide-react";

const testimonials = [
  {
    name: "Rehan Siddiqui",
    from: "Non-Tech",
    to: "Data Analyst",
    company: "Amazon",
    rating: 5,
    avatar: "/images/avatars/avatar-1.svg",
    desc: "I had zero tech background. Linkway taught me Tableau, Power BI, and how to actually think with data. Now I'm at Amazon solving real business problems every day.",
  },
  {
    name: "Junaid Khan",
    from: "Banking Ops",
    to: "Business Analyst",
    company: "Razorpay",
    rating: 4.5,
    avatar: "/images/avatars/avatar-2.svg",
    desc: "I was stuck in banking ops with no clear growth path. Six months later, I'm a business analyst at Razorpay working on things that actually excite me.",
  },
  {
    name: "Shivani Rawat",
    from: "Operations",
    to: "Business Analyst",
    company: "Booking.com",
    rating: 4.8,
    avatar: "/images/avatars/avatar-3.svg",
    desc: "Operations felt like a dead end. The program gave me the technical skills I was missing, and now I'm doing requirement analysis at Booking.com.",
  },
  {
    name: "Vansh Pathak",
    from: "Accounting",
    to: "Reporting Analyst",
    company: "Accenture",
    rating: 4.3,
    avatar: "/images/avatars/avatar-4.svg",
    desc: "Went from crunching numbers in spreadsheets to building actual reports with SQL at Accenture. The mentors made the jump doable.",
  },
  {
    name: "Aditya Srivastava",
    from: "Full-Stack Dev",
    to: "Data Scientist",
    company: "Globussoft",
    rating: 4.6,
    avatar: "/images/avatars/avatar-5.svg",
    desc: "I could code, but I didn't know ML. Linkway filled that gap with real projects - computer vision, forecasting, the works.",
  },
  {
    name: "Priya Sharma",
    from: "HR Executive",
    to: "People Analytics",
    company: "Infosys",
    rating: 4.7,
    avatar: "/images/avatars/avatar-1.svg",
    desc: "HR felt repetitive after 3 years. Learned Python and started automating reports. Now I build dashboards that actually help hiring decisions at Infosys.",
  },
  {
    name: "Rohit Verma",
    from: "Mech Engineer",
    to: "Data Engineer",
    company: "TCS",
    rating: 4.4,
    avatar: "/images/avatars/avatar-2.svg",
    desc: "Mechanical engineering wasn't for me. Picked up SQL, learned ETL pipelines here. Cracked TCS interview on my third attempt. Worth every rupee.",
  },
  {
    name: "Sneha Patel",
    from: "School Teacher",
    to: "Data Analyst",
    company: "Deloitte",
    rating: 4.9,
    avatar: "/images/avatars/avatar-3.svg",
    desc: "Left teaching after 5 years. Everyone said I was crazy. But the structured learning here helped me land Deloitte. My students were my first cheerleaders.",
  },
  {
    name: "Amit Kumar",
    from: "Sales Exec",
    to: "BI Analyst",
    company: "Wipro",
    rating: 4.2,
    avatar: "/images/avatars/avatar-4.svg",
    desc: "Sales targets were killing me. Started learning Excel seriously, then Power BI. Now I make dashboards for sales teams instead of chasing targets myself.",
  },
  {
    name: "Kavita Nair",
    from: "Support",
    to: "Analytics",
    company: "Fractal",
    rating: 4.6,
    avatar: "/images/avatars/avatar-5.svg",
    desc: "Customer support to analytics sounds impossible, but the mentors here pushed me. SQL clicked after week 3. Got placed at Fractal within 2 months of finishing.",
  },
  {
    name: "Arjun Menon",
    from: "BPO",
    to: "Data Analyst",
    company: "EXL",
    rating: 4.5,
    avatar: "/images/avatars/avatar-1.svg",
    desc: "Night shifts at BPO for 4 years. Completed this course while working. The placement team was persistent - helped me prep for 7 interviews before I cleared EXL.",
  },
  {
    name: "Pooja Gupta",
    from: "Content Writer",
    to: "Marketing Analyst",
    company: "HUL",
    rating: 4.8,
    avatar: "/images/avatars/avatar-2.svg",
    desc: "Writing blogs wasn't paying enough. Learned Google Analytics, some SQL. Now I analyze campaign performance at HUL. Still write sometimes, but data pays better.",
  },
  {
    name: "Vikram Singh",
    from: "Retail Staff",
    to: "Supply Chain Analyst",
    company: "Vishal Mega Mart",
    rating: 4.3,
    avatar: "/images/avatars/avatar-3.svg",
    desc: "Worked at a store for 6 years. Knew retail inside out but no technical skills. Excel + SQL training here changed everything. Same industry, much better role.",
  },
  {
    name: "Neeraj Joshi",
    from: "CA Articleship",
    to: "Investment Banking",
    company: "MUFG Bank",
    rating: 4.7,
    avatar: "/images/avatars/avatar-4.svg",
    desc: "CA was too slow for me. Learned financial modeling, valuation, and Excel shortcuts that actually matter. MUFG hired me straight out of the program. IB hours are brutal but the work is exciting.",
  },
  {
    name: "Meghna Reddy",
    from: "Bank Clerk",
    to: "Credit Analyst",
    company: "IDFC First Bank",
    rating: 4.5,
    avatar: "/images/avatars/avatar-5.svg",
    desc: "Was a clerk at SBI for 3 years. The investment banking module opened my eyes to how finance actually works. Now doing credit analysis at IDFC First. Salary almost doubled.",
  },
  {
    name: "Saurabh Tiwari",
    from: "Commerce Grad",
    to: "Equity Research",
    company: "BNY Mellon",
    rating: 4.8,
    avatar: "/images/avatars/avatar-1.svg",
    desc: "Fresh B.Com graduate with no clue what to do. The valuation and financial statement analysis modules were gold. Got into BNY Mellon's research team. Family still can't believe it.",
  },
  {
    name: "Ankita Deshmukh",
    from: "Back Office",
    to: "Risk Analyst",
    company: "Bandhan Bank",
    rating: 4.4,
    avatar: "/images/avatars/avatar-2.svg",
    desc: "Back office work was mind-numbing. Learned risk modeling and some VBA here. Moved to risk analytics at Bandhan. Finally using my brain at work.",
  },
  {
    name: "Ravi Shankar",
    from: "Insurance Agent",
    to: "Financial Analyst",
    company: "AXA",
    rating: 4.6,
    avatar: "/images/avatars/avatar-3.svg",
    desc: "Selling policies for 5 years taught me client handling but nothing technical. Excel modeling and DCF here changed my career. Now I'm on the analytics side at AXA.",
  },
];

function RatingStars({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.3;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(fullStars)].map((_, j) => (
        <Star key={`f-${j}`} className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
      ))}
      {hasHalf && <StarHalf className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />}
      {[...Array(emptyStars)].map((_, j) => (
        <Star key={`e-${j}`} className="w-3.5 h-3.5 text-gray-300" />
      ))}
      <span className="text-[11px] text-gray-400 ml-1.5 font-medium">{rating}</span>
    </div>
  );
}

function TestimonialCard({ t }: { t: (typeof testimonials)[number] }) {
  return (
    <div className="shrink-0 w-[320px] md:w-[350px]">
      <div className="h-full rounded-2xl p-6 bg-[#F2F1EE] border border-[#e5e4e0] hover:border-[#d5d4d0] transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-gray-500 font-medium">{t.from}</span>
            <ArrowRight className="w-3 h-3 text-gray-400" />
            <span className="text-[11px] text-orange-600 font-semibold">{t.to}</span>
          </div>
          <RatingStars rating={t.rating} />
        </div>

        <p className="text-gray-600 leading-relaxed text-[13px] mb-6">
          &ldquo;{t.desc}&rdquo;
        </p>

        <div className="flex items-center gap-3 pt-4 border-t border-black/[0.06]">
          <div className="w-9 h-9 rounded-full bg-black/[0.08] overflow-hidden shrink-0">
            <Image src={t.avatar} alt={t.name} width={36} height={36} className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0">
            <h4 className="font-medium text-gray-900 text-sm leading-tight truncate">{t.name}</h4>
            <span className="text-[11px] text-gray-500">{t.company}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Wait a frame so the DOM is laid out and scrollWidth is accurate
    requestAnimationFrame(() => {
      const totalWidth = track.scrollWidth;
      const oneSetWidth = totalWidth / 2; // items are duplicated

      // Start from 0, move left by exactly one set width, then repeat
      tweenRef.current = gsap.fromTo(
        track,
        { x: 0 },
        {
          x: -oneSetWidth,
          duration: 60,
          ease: "none",
          repeat: -1,
        }
      );
    });

    return () => {
      tweenRef.current?.kill();
    };
  }, []);

  const handleMouseEnter = () => tweenRef.current?.pause();
  const handleMouseLeave = () => tweenRef.current?.resume();

  return (
    <section className="pt-6 md:pt-8 pb-8 md:pb-10 text-white overflow-hidden relative bg-black">
      <div className="max-w-7xl mx-auto px-6 mb-12 relative z-10">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-block py-1.5 px-4 rounded-full bg-orange-500/10 text-orange-400 font-semibold text-xs mb-6 tracking-widest uppercase">
              Success Stories
            </span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
              <span className="text-white">They Were Where </span>
              <span className="text-orange-400">You Are</span>
              <span className="text-white"> Right Now.</span>
            </h2>
          </div>
        </ScrollReveal>
      </div>

      <div
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

        <div className="overflow-hidden">
          <div
            ref={trackRef}
            className="flex gap-5 w-max"
            style={{ willChange: "transform" }}
          >
            {[...testimonials, ...testimonials].map((t, i) => (
              <TestimonialCard key={`${t.name}-${i}`} t={t} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
