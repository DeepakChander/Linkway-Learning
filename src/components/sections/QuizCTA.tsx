"use client";

import Link from "next/link";
import ScrollReveal from "@/components/animation/ScrollReveal";
import Button from "@/components/ui/Button";
import { Sparkles } from "lucide-react";

export default function QuizCTA() {
  return (
    <section className="py-24 md:py-32 px-6 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy-800 via-navy-900 to-navy-800" />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: "radial-gradient(ellipse at 30% 50%, rgba(245,137,42,0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 50%, rgba(90,126,176,0.1) 0%, transparent 50%)",
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <ScrollReveal>
          <div className="inline-flex items-center gap-2 text-orange-400 mb-6">
            <Sparkles className="w-5 h-5" />
            <span className="text-sm font-semibold tracking-wide uppercase">Personalized Recommendation</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Can't Decide? That's Normal.
          </h2>

          <p className="text-gray-400 text-lg mb-10 leading-relaxed">
            Put all three programs next to each other - curriculum, tools, career outcomes, pricing.
            See which one clicks. Or just talk to us and we'll figure it out together.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="primary" size="lg" href="/compare">
              Compare All Courses
              <svg className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Button>
            <Button variant="ghost" size="lg" href="/contact">
              Talk to a Counselor
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
