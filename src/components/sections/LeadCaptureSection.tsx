"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ArrowRight, Star, StarHalf, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import Image from "next/image";
import ScrollReveal from "@/components/animation/ScrollReveal";

/* ─── Testimonial Data ─── */
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
];

/* ─── Colorful Brand Logos (inline JSX) ─── */
function GoogleLogo() {
  return (
    <span className="text-xl font-semibold tracking-tight" style={{ fontFamily: "Product Sans, Arial, sans-serif" }}>
      <span style={{ color: "#4285F4" }}>G</span>
      <span style={{ color: "#EA4335" }}>o</span>
      <span style={{ color: "#FBBC05" }}>o</span>
      <span style={{ color: "#4285F4" }}>g</span>
      <span style={{ color: "#34A853" }}>l</span>
      <span style={{ color: "#EA4335" }}>e</span>
    </span>
  );
}

function FlipkartLogo() {
  return (
    <span className="text-xl font-bold tracking-tight" style={{ color: "#F7D02C", fontFamily: "Arial, sans-serif" }}>
      Flipkart
    </span>
  );
}

function MicrosoftLogo() {
  return (
    <span className="flex items-center gap-1.5">
      <svg width="18" height="18" viewBox="0 0 18 18">
        <rect x="0" y="0" width="8.5" height="8.5" fill="#F25022" />
        <rect x="9.5" y="0" width="8.5" height="8.5" fill="#7FBA00" />
        <rect x="0" y="9.5" width="8.5" height="8.5" fill="#00A4EF" />
        <rect x="9.5" y="9.5" width="8.5" height="8.5" fill="#FFB900" />
      </svg>
      <span className="text-lg font-normal text-white/80" style={{ fontFamily: "Segoe UI, Arial, sans-serif" }}>Microsoft</span>
    </span>
  );
}

function DeloitteLogo() {
  return (
    <span className="flex items-center gap-0.5">
      <span className="text-xl font-bold text-white" style={{ fontFamily: "Arial, sans-serif" }}>Deloitte</span>
      <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: "#86BC25" }} />
    </span>
  );
}

function AccentureLogo() {
  return (
    <span className="text-xl font-semibold" style={{ color: "#A100FF", fontFamily: "Arial, sans-serif" }}>
      &gt; accenture
    </span>
  );
}

function InfosysLogo() {
  return (
    <span className="text-xl font-bold" style={{ color: "#007CC3", fontFamily: "Arial, sans-serif" }}>
      Infosys
    </span>
  );
}

const brandLogos = [
  { name: "Google", component: GoogleLogo },
  { name: "Flipkart", component: FlipkartLogo },
  { name: "Microsoft", component: MicrosoftLogo },
  { name: "Deloitte", component: DeloitteLogo },
  { name: "Accenture", component: AccentureLogo },
  { name: "Infosys", component: InfosysLogo },
];

/* ─── Rating Stars ─── */
function RatingStars({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.3;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(fullStars)].map((_, j) => (
        <Star key={`f-${j}`} className="w-3 h-3 fill-orange-400 text-orange-400" />
      ))}
      {hasHalf && <StarHalf className="w-3 h-3 fill-orange-400 text-orange-400" />}
      {[...Array(emptyStars)].map((_, j) => (
        <Star key={`e-${j}`} className="w-3 h-3 text-gray-500" />
      ))}
    </div>
  );
}

/* ─── Testimonial Card ─── */
function TestimonialCard({ t }: { t: (typeof testimonials)[number] }) {
  return (
    <div className="shrink-0 w-[280px]">
      <div className="h-full rounded-xl p-4 bg-white/10 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-gray-400 font-medium">{t.from}</span>
            <ArrowRight className="w-2.5 h-2.5 text-gray-500" />
            <span className="text-[10px] text-orange-400 font-semibold">{t.to}</span>
          </div>
          <RatingStars rating={t.rating} />
        </div>

        <p className="text-gray-300 leading-relaxed text-xs mb-4 line-clamp-3">
          &ldquo;{t.desc}&rdquo;
        </p>

        <div className="flex items-center gap-2.5 pt-3 border-t border-white/10">
          <div className="w-7 h-7 rounded-full bg-white/10 overflow-hidden shrink-0">
            <Image src={t.avatar} alt={t.name} width={28} height={28} className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0">
            <h4 className="font-medium text-white text-xs leading-tight truncate">{t.name}</h4>
            <span className="text-[10px] text-gray-400">{t.company}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Inline Lead Form ─── */
function InlineLeadForm() {
  const [formState, setFormState] = useState<"idle" | "loading" | "success">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    designation: "",
    experience: "",
    company: "",
    course: "",
  });

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Name is required";
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Valid email required";
    if (!formData.phone.trim() || !/^\+?\d{10,15}$/.test(formData.phone.replace(/\s/g, "")))
      newErrors.phone = "Valid phone number required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setFormState("loading");
    try {
      const res = await fetch("https://formspree.io/f/xpwdzgkl", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setFormState("success");
      } else {
        setFormState("idle");
        setErrors({ email: "Submission failed. Please try again." });
      }
    } catch {
      setFormState("idle");
      setErrors({ email: "Network error. Please try again." });
    }
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  if (formState === "success") {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-xl flex flex-col items-center justify-center text-center min-h-[480px]">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-5">
          <CheckCircle2 className="w-8 h-8 text-green-500" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">We&apos;ve Got Your Details!</h3>
        <p className="text-gray-500 text-sm">Our counselor will reach out within 24 hours to help you get started.</p>
      </div>
    );
  }

  const inputClass = (field: string) =>
    `w-full bg-white border rounded-lg px-4 py-3 text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none transition-colors ${
      errors[field] ? "border-red-400 focus:border-red-400" : "border-gray-200 focus:border-orange-500"
    }`;

  const selectClass =
    "w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-900 text-sm focus:outline-none focus:border-orange-500 transition-colors appearance-none cursor-pointer";

  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl">
      <h3 className="text-lg md:text-xl font-bold text-gray-900 text-center mb-6">
        Upgrade Your Skills to Achieve Your Dream Job
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Full Name</label>
          <input type="text" placeholder="John Doe" value={formData.fullName} onChange={(e) => handleChange("fullName", e.target.value)} className={inputClass("fullName")} />
          {errors.fullName && <p className="text-xs text-red-400 flex items-center gap-1 mt-1"><AlertCircle className="w-3 h-3" /> {errors.fullName}</p>}
        </div>

        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Email Address</label>
          <input type="email" placeholder="abc@gmail.com" value={formData.email} onChange={(e) => handleChange("email", e.target.value)} className={inputClass("email")} />
          {errors.email && <p className="text-xs text-red-400 flex items-center gap-1 mt-1"><AlertCircle className="w-3 h-3" /> {errors.email}</p>}
        </div>

        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Contact Number</label>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg px-3 py-3 text-sm text-gray-700 shrink-0">
              <span>🇮🇳</span><span>+91</span><span className="text-gray-300">·</span>
            </div>
            <input type="tel" placeholder="81234 56789" value={formData.phone} onChange={(e) => handleChange("phone", e.target.value)} className={inputClass("phone")} />
          </div>
          {errors.phone && <p className="text-xs text-red-400 flex items-center gap-1 mt-1"><AlertCircle className="w-3 h-3" /> {errors.phone}</p>}
        </div>

        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Designation</label>
          <input type="text" placeholder="e.g. Software Engineer" value={formData.designation} onChange={(e) => handleChange("designation", e.target.value)} className={inputClass("designation")} />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Years of Experience</label>
          <select value={formData.experience} onChange={(e) => handleChange("experience", e.target.value)} className={selectClass}>
            <option value="">Select</option>
            <option value="0-1">0 - 1 years</option>
            <option value="1-3">1 - 3 years</option>
            <option value="3-5">3 - 5 years</option>
            <option value="5-10">5 - 10 years</option>
            <option value="10+">10+ years</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Current Company/College Name</label>
          <input type="text" placeholder="e.g. TCS, IIT Delhi" value={formData.company} onChange={(e) => handleChange("company", e.target.value)} className={inputClass("company")} />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Program preference</label>
          <select value={formData.course} onChange={(e) => handleChange("course", e.target.value)} className={selectClass}>
            <option value="">Select</option>
            <option value="Data Analytics">Data Analytics</option>
            <option value="Business Analytics">Business Analytics</option>
            <option value="Data Science and AI">Data Science and AI</option>
            <option value="Agentic AI & Prompt Engineering">Agentic AI &amp; Prompt Engineering</option>
            <option value="Investment Banking">Investment Banking</option>
            <option value="Not Sure">Not Sure Yet</option>
          </select>
        </div>

        <button type="submit" disabled={formState === "loading"} className="w-full bg-[#0D1B2A] hover:bg-[#162d45] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
          {formState === "loading" ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit Now"}
        </button>
      </form>
    </div>
  );
}

/* ─── Main Section ─── */
export default function LeadCaptureSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    requestAnimationFrame(() => {
      const totalWidth = track.scrollWidth;
      const oneSetWidth = totalWidth / 2;

      tweenRef.current = gsap.fromTo(
        track,
        { x: 0 },
        { x: -oneSetWidth, duration: 40, ease: "none", repeat: -1 }
      );
    });

    return () => { tweenRef.current?.kill(); };
  }, []);

  const handleMouseEnter = () => tweenRef.current?.pause();
  const handleMouseLeave = () => tweenRef.current?.resume();

  return (
    <section className="relative overflow-hidden bg-[#0D1B2A]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2">

          {/* ── Left Side ── */}
          <div className="relative px-6 md:px-10 lg:px-12 pt-10 md:pt-14 pb-8 flex flex-col justify-center">
            <ScrollReveal>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-8 text-white">
                Join 8000+ professionals who{" "}
                <span className="text-orange-400">transformed their careers</span>
                {" "}and landed roles at{" "}
                <span className="text-orange-400">world-class companies.</span>
              </h2>
            </ScrollReveal>

            {/* Trusted By - Single row */}
            <ScrollReveal delay={0.1}>
              <div className="mb-0">
                <h3 className="text-white/60 font-semibold text-sm uppercase tracking-widest mb-5">Trusted by</h3>

                <div className="flex flex-wrap gap-3">
                  {brandLogos.map((logo) => (
                    <div key={logo.name} className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl px-5 py-3.5 flex items-center justify-center hover:bg-white/15 transition-colors">
                      <logo.component />
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* ── Right Side - Form ── */}
          <div className="px-6 md:px-10 lg:px-12 py-10 md:py-14 flex items-start lg:items-center justify-center bg-[#0D1B2A]">
            <div className="w-full max-w-md">
              <InlineLeadForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
