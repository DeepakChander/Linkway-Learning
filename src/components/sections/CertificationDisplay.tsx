"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import ScrollReveal from "@/components/animation/ScrollReveal";

export default function CertificationDisplay() {
  return (
    <section className="py-24 md:py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <SectionHeading
            label="Certification"
            title="Walk Out With Proof That Opens Doors"
            description="You'll earn two certifications - one from Linkway, one from Microsoft. Both are recognized by employers and ready to go on your LinkedIn."
          />
        </ScrollReveal>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Linkway Certificate */}
          <ScrollReveal delay={0.1}>
            <motion.div
              className="relative rounded-2xl p-8 backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] text-center group hover:border-orange-500/30 transition-all duration-500"
              whileHover={{ rotateY: -5, rotateX: 3 }}
              style={{ transformPerspective: 1200 }}
            >
              <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden mb-6 border border-white/[0.06]">
                <Image
                  src="/images/certificates/linkway-certificate.png"
                  alt="Linkway Learning Certificate"
                  fill
                  className="object-cover scale-110"
                />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Linkway Learning Certificate</h3>
              <p className="text-gray-400 leading-relaxed">
                This says you finished the whole thing - curriculum, projects, assessments, all of it. Our 40+ hiring partners know exactly what it means.
              </p>
              <div className="mt-6 inline-flex items-center gap-2 text-orange-400 text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-orange-500" />
                Employer-Trusted
              </div>
            </motion.div>
          </ScrollReveal>

          {/* Microsoft Certificate */}
          <ScrollReveal delay={0.2}>
            <motion.div
              className="relative rounded-2xl p-8 backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] text-center group hover:border-blue-500/30 transition-all duration-500"
              whileHover={{ rotateY: 5, rotateX: 3 }}
              style={{ transformPerspective: 1200 }}
            >
              <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden mb-6 border border-white/[0.06]">
                <Image
                  src="/images/certificates/azure-certificate.png"
                  alt="Microsoft Azure AI Fundamentals Certificate"
                  fill
                  className="object-cover scale-110"
                />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Microsoft Azure AI Fundamentals</h3>
              <p className="text-gray-400 leading-relaxed">
                A Microsoft certification that carries weight everywhere - from startups to Fortune 500s. It proves you understand AI and ML at a foundational level.
              </p>
              <div className="mt-6 inline-flex items-center gap-2 text-blue-400 text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                Globally Recognized
              </div>
            </motion.div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
