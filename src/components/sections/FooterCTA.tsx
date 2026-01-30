"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import { useEnquiryModal } from "@/components/forms/EnquiryModal";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function FooterCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const { openEnquiry } = useEnquiryModal();

  useGSAP(
    () => {
      const cta = ctaRef.current;
      if (!cta) return;

      gsap.from(cta, {
        y: 40,
        opacity: 0,
        ease: "power3.out",
        scrollTrigger: {
          trigger: cta,
          start: "top 85%",
          end: "top 60%",
          scrub: 1,
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="py-10 md:py-14 px-6 relative overflow-hidden bg-[#ffc8b1]"
    >
      <div ref={ctaRef} className="relative z-10 max-w-2xl mx-auto text-center">
        <p className="text-navy-900/60 text-xs font-semibold uppercase tracking-widest mb-3">Only a few seats left</p>

        <h2 className="text-xl md:text-3xl lg:text-4xl font-bold text-navy-900 leading-tight tracking-tight">
          While you&apos;re thinking about it,{" "}
          <span className="text-navy-700">someone else just enrolled.</span>
        </h2>

        <p className="text-navy-900/50 text-sm md:text-base mt-3 mb-6 max-w-lg mx-auto">
          The current batch is almost full — no waitlist, no second chances.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button variant="primary" size="lg" href="/contact" className="min-w-[200px] justify-center hover:opacity-80 transition-opacity duration-200">
            <span className="flex items-center gap-2">
              Enroll Now
              <ArrowRight className="w-4 h-4" />
            </span>
          </Button>
          <Button variant="outline" size="lg" onClick={openEnquiry} className="!border-navy-900 !text-navy-900 hover:!bg-navy-900 hover:!text-white transition-colors duration-200 min-w-[200px] justify-center">
            <span className="flex items-center gap-2">
              Talk to a Counselor
              <ArrowRight className="w-4 h-4" />
            </span>
          </Button>
        </div>
      </div>
    </section>
  );
}
