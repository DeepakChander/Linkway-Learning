"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import CanvasWave from "@/components/animation/CanvasWave";

import { cn } from "@/lib/utils";
import { Facebook, Linkedin, Instagram, MapPin, Phone, Mail } from "lucide-react";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Success Stories", href: "/success-stories" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
  { label: "Student Portal", href: "/student-portal" },
];

const courseLinks = [
  { label: "Data Analytics", href: "/courses/data-analytics" },
  { label: "Business Analytics", href: "/courses/business-analytics" },
  { label: "Data Science and AI", href: "/courses/data-science-ai" },
  { label: "Agentic AI & Prompt Engineering", href: "/courses/agentic-ai" },
  { label: "Investment Banking", href: "/courses/investment-banking" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Refund Policy", href: "/refund" },
];


function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="text-gray-300 hover:text-orange-400 transition-colors duration-300">
      {label}
    </Link>
  );
}

export default function Footer() {
  return (
    <footer className="bg-black relative overflow-hidden pt-10 border-t border-white/5">
      {/* Canvas Wave Background */}
      <CanvasWave />

      {/* Content Container */}
      <div className="max-w-7xl mx-auto px-6 relative z-10 pb-12">

        {/* Brand Statement */}
        <div className="mb-8 sm:mb-10 border-b border-white/5 pb-6 sm:pb-8">
          <motion.h2
            className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-tight select-none"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          >
            <span className="text-white">Stop Waiting.</span><br />
            <span className="text-orange-500">Start Building Your Future.</span>
          </motion.h2>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-8 mb-8">

          {/* Brand Column */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-4">
            <Link href="/" className="block mb-4 sm:mb-6">
              <span className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Linkway Learning<span className="text-orange-500">.</span>
              </span>
            </Link>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4 sm:mb-6 max-w-sm">
              Linkway Learning Private Limited. We exist because college alone doesn't prepare you for the industry. We fill that gap.
            </p>
            <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
              <div className="flex items-start gap-2 sm:gap-3">
                <MapPin className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                  D-23, Sector-59, Noida<br />
                  Gautam Buddha Nagar - 201301<br />
                  Uttar Pradesh, India
                </p>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <Phone className="w-4 h-4 text-orange-500 shrink-0" />
                <a href="tel:+919315647113" className="text-gray-300 text-xs sm:text-sm hover:text-orange-400 transition-colors">+91-93156-47113</a>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <Mail className="w-4 h-4 text-orange-500 shrink-0" />
                <a href="mailto:support@linkwaylearning.com" className="text-gray-300 text-xs sm:text-sm hover:text-orange-400 transition-colors break-all">support@linkwaylearning.com</a>
              </div>
            </div>
          </div>

          <div className="hidden lg:block lg:col-span-2" />

          {/* Links Column 1 */}
          <div className="col-span-1 lg:col-span-2">
            <h4 className="text-xs sm:text-sm font-bold tracking-[0.15em] sm:tracking-[0.2em] text-white uppercase mb-4 sm:mb-6">Pages</h4>
            <ul className="space-y-2 sm:space-y-4 text-xs sm:text-sm">
              {quickLinks.map((link) => (
                <li key={link.href}><FooterLink {...link} /></li>
              ))}
            </ul>
          </div>

          {/* Links Column 2 */}
          <div className="col-span-1 lg:col-span-2">
            <h4 className="text-xs sm:text-sm font-bold tracking-[0.15em] sm:tracking-[0.2em] text-white uppercase mb-4 sm:mb-6">Programs</h4>
            <ul className="space-y-2 sm:space-y-4 text-xs sm:text-sm">
              {courseLinks.map((link) => (
                <li key={link.href}><FooterLink {...link} /></li>
              ))}
            </ul>
          </div>

          {/* Links Column 3 */}
          <div className="col-span-2 sm:col-span-1 lg:col-span-2">
            <h4 className="text-xs sm:text-sm font-bold tracking-[0.15em] sm:tracking-[0.2em] text-white uppercase mb-4 sm:mb-6">Legal</h4>
            <ul className="space-y-2 sm:space-y-4 text-xs sm:text-sm flex flex-row sm:flex-col gap-4 sm:gap-0">
              {legalLinks.map((link) => (
                <li key={link.href}><FooterLink {...link} /></li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4 border-t border-white/5 text-xs sm:text-sm text-gray-400">
          <p className="text-center md:text-left">&copy; {new Date().getFullYear()} Linkway Learning Pvt. Ltd.</p>
          <div className="flex gap-3">
            {[
              { icon: Facebook, name: "Facebook", href: "https://www.facebook.com/share/1AxrBp9iYo/" },
              { icon: Linkedin, name: "LinkedIn", href: "https://www.linkedin.com/company/linkway-learning/" },
              { icon: Instagram, name: "Instagram", href: "https://www.instagram.com/linkway_learning" },
            ].map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:bg-white hover:text-black transition-all duration-300"
                aria-label={`Follow us on ${social.name}`}
              >
                <social.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
