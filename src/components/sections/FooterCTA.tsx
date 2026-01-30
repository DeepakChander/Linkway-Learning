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
      className="py-14 md:py-20 px-6 relative overflow-hidden bg-[#ffc8b1]"
    >
      <div ref={ctaRef} className="relative z-10 max-w-3xl mx-auto text-center">
        <p className="text-navy-900/70 text-sm font-semibold uppercase tracking-widest mb-4">Only a few seats left</p>

        <h2 className="text-2xl md:text-4xl lg:text-[2.75rem] font-bold text-navy-900 leading-tight tracking-tight">
          While you&apos;re thinking about it,{" "}
          <span className="text-navy-700">someone else just enrolled.</span>
        </h2>

        <p className="text-navy-900/60 text-base md:text-lg mt-4 mb-8 max-w-xl mx-auto">
          Every week you wait is a week someone else is building the career you want. The current batch is almost full — no waitlist, no second chances.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <motion.div
            className="relative group"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <Button variant="primary" size="lg" href="/contact" className="relative z-10">
              <span className="flex items-center gap-2">
                Enroll Now
                <ArrowRight className="w-4 h-4" />
              </span>
            </Button>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <Button variant="outline" size="lg" onClick={openEnquiry} className="!border-navy-900 !text-navy-900 hover:!bg-navy-900/10">
              <span className="flex items-center gap-2">
                Talk to a Counselor
                <ArrowRight className="w-4 h-4" />
              </span>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
