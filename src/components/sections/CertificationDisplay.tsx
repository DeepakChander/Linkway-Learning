"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Award, ShieldCheck } from "lucide-react";

export default function CertificationDisplay() {
  return (
    <section className="relative overflow-hidden" style={{
      backgroundColor: "#f4f2ed",
      backgroundImage: `
        radial-gradient(ellipse 80% 50% at 50% -20%, rgba(251,146,60,0.08) 0%, transparent 70%),
        radial-gradient(ellipse 60% 40% at 80% 110%, rgba(59,130,246,0.06) 0%, transparent 60%),
        repeating-linear-gradient(
          135deg,
          transparent 0px,
          transparent 40px,
          rgba(0,0,0,0.015) 40px,
          rgba(0,0,0,0.015) 41px
        ),
        repeating-linear-gradient(
          45deg,
          transparent 0px,
          transparent 40px,
          rgba(0,0,0,0.015) 40px,
          rgba(0,0,0,0.015) 41px
        )
      `,
    }}>
      {/* Top separator */}
      <div className="w-full h-px bg-gray-300/50" />

      <div className="py-24 md:py-32 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">

          {/* Heading */}
          <div className="text-center mb-16 md:mb-20">
            <motion.h2
              className="text-3xl md:text-4xl lg:text-[2.8rem] font-bold text-gray-900 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
            >
              Will I get a certificate?
              <br />
              Of course! It&apos;ll look great on your
              <br />
              resume and LinkedIn :-)
            </motion.h2>
          </div>

          {/* Two certificates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">

            {/* Linkway Certificate */}
            <motion.div
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
            >
              <motion.div
                className="relative w-full max-w-xl aspect-[4/3]"
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src="/images/certificates/linkway-certificate.png"
                  alt="Linkway Learning Certificate of Completion"
                  fill
                  className="object-contain mix-blend-multiply"
                  sizes="(max-width: 768px) 100vw, 560px"
                />
              </motion.div>

              <div className="text-center mt-8">
                <motion.div
                  className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-orange-500 text-white mb-3 shadow-lg shadow-orange-500/20"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  <Award className="w-4 h-4" />
                  <span className="text-sm font-bold">Linkway Learning Certificate</span>
                </motion.div>
                <motion.p
                  className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                >
                  Employer-trusted proof that you completed the full curriculum, projects, and assessments.
                </motion.p>
              </div>
            </motion.div>

            {/* Microsoft Azure Certificate */}
            <motion.div
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
            >
              <motion.div
                className="relative w-full max-w-xl aspect-[4/3]"
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src="/images/certificates/azure-certificate.png"
                  alt="Microsoft Azure AI Fundamentals Certificate"
                  fill
                  className="object-contain mix-blend-multiply"
                  sizes="(max-width: 768px) 100vw, 560px"
                />
              </motion.div>

              <div className="text-center mt-8">
                <motion.div
                  className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-blue-600 text-white mb-3 shadow-lg shadow-blue-600/20"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-sm font-bold">Microsoft Azure AI Fundamentals</span>
                </motion.div>
                <motion.p
                  className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                >
                  Globally recognized Microsoft certification that carries weight from startups to Fortune 500s.
                </motion.p>
              </div>
            </motion.div>

          </div>

        </div>
      </div>

      {/* Bottom separator */}
      <div className="w-full h-px bg-gray-300/50" />
    </section>
  );
}
