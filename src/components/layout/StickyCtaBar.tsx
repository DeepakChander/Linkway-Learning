"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import CountdownTimer from "@/components/ui/CountdownTimer";
import { X } from "lucide-react";

export default function StickyCtaBar() {
  const [visible, setVisible] = useState(false);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 800);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (closed) return null;

  return (
    <div
      className={cn(
        "fixed z-50 transition-all duration-500",
        "bottom-0 left-0 right-0 lg:bottom-6 lg:left-1/2 lg:right-auto lg:-translate-x-1/2 lg:w-auto",
        "bg-navy-900/95 backdrop-blur-xl border-t lg:border border-white/10 lg:rounded-2xl lg:shadow-2xl",
        "px-3 sm:px-4 py-2.5 sm:py-3 lg:px-6 lg:py-3",
        visible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"
      )}
      role="complementary"
      aria-label="Application deadline banner"
    >
      <div className="flex items-center justify-between gap-2 sm:gap-4 md:gap-8">

        {/* Urgency & Text */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden md:flex flex-col">
            <p className="text-white text-sm font-bold">Applications closing soon!</p>
            <p className="text-orange-400 text-xs font-medium">Limited scholarships available</p>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-0.5 sm:gap-1 md:gap-3">
            <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-gray-400 font-semibold md:hidden">Expires:</span>
            <CountdownTimer size="sm" />
          </div>
        </div>

        {/* Actions - multiple CTA options */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Link
            href="/courses"
            className="hidden md:inline-flex shrink-0 border border-white/10 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all hover:bg-white/5"
          >
            View Courses
          </Link>
          <Link
            href="/contact"
            className="shrink-0 bg-orange-600 hover:bg-orange-500 text-white px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all shadow-lg hover:shadow-orange-500/25"
          >
            Apply Now
          </Link>

          <button
            onClick={() => setClosed(true)}
            className="p-0.5 sm:p-1 hover:bg-white/10 rounded-full transition-colors text-gray-400"
            aria-label="Close sticky bar"
          >
            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
