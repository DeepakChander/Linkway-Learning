"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import CanvasWave from "@/components/animation/CanvasWave";

import { cn } from "@/lib/utils";
import { Linkedin, Twitter, Instagram, Youtube, MapPin, Phone, Mail } from "lucide-react";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Success Stories", href: "/success-stories" },
  { label: "Blog", href: "/blog" },
];

const courseLinks = [
  { label: "Data Analytics Accelerator", href: "/courses/data-analytics" },
  { label: "Data Science & AI Mastery", href: "/courses/data-science-ai" },
  { label: "Business Intelligence", href: "/courses/business-intelligence" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Refund Policy", href: "/refund" },
];


function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="group relative inline-block overflow-hidden">
      <span className="relative z-10 block transition-transform duration-300 group-hover:-translate-y-full text-gray-300 group-hover:text-orange-400">
        {label}
      </span>
      <span className="absolute inset-0 block translate-y-full transition-transform duration-300 group-hover:translate-y-0 text-orange-400 font-medium" aria-hidden="true">
        {label}
      </span>
    </Link>
  );
}

export default function Footer() {
  return (
    <footer className="bg-black relative overflow-hidden pt-20 border-t border-white/5">
      {/* Canvas Wave Background */}
      <CanvasWave />

      {/* Content Container */}
      <div className="max-w-7xl mx-auto px-6 relative z-10 pb-12">

        {/* Brand Statement */}
        <div className="mb-10 border-b border-white/5 pb-8">
          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-tight select-none"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">

          {/* Brand Column */}
          <div className="lg:col-span-4">
            <Link href="/" className="block mb-6">
              <span className="text-2xl font-bold text-white tracking-tight">
                Linkway Learning<span className="text-orange-500">.</span>
              </span>
            </Link>
            <p className="text-gray-300 leading-relaxed mb-6 max-w-sm">
              Linkway Learning Private Limited. We exist because college alone doesn't prepare you for the industry. We fill that gap.
            </p>
            <div className="space-y-3 mb-8">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                <p className="text-gray-300 text-sm leading-relaxed">
                  D-23, Sector-59, Noida<br />
                  Gautam Buddha Nagar - 201301<br />
                  Uttar Pradesh, India
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-orange-500 shrink-0" />
                <a href="tel:+919315647113" className="text-gray-300 text-sm hover:text-orange-400 transition-colors">+91-93156-47113</a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-orange-500 shrink-0" />
                <a href="mailto:support@linkwaylearning.com" className="text-gray-300 text-sm hover:text-orange-400 transition-colors">support@linkwaylearning.com</a>
              </div>
            </div>
          </div>

          <div className="hidden lg:block lg:col-span-2" />

          {/* Links Column 1 */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-bold tracking-[0.2em] text-white uppercase mb-6">Pages</h4>
            <ul className="space-y-4 text-sm">
              {quickLinks.map((link) => (
                <li key={link.href}><FooterLink {...link} /></li>
              ))}
            </ul>
          </div>

          {/* Links Column 2 */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-bold tracking-[0.2em] text-white uppercase mb-6">Programs</h4>
            <ul className="space-y-4 text-sm">
              {courseLinks.map((link) => (
                <li key={link.href}><FooterLink {...link} /></li>
              ))}
            </ul>
          </div>

          {/* Links Column 3 */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-bold tracking-[0.2em] text-white uppercase mb-6">Legal</h4>
            <ul className="space-y-4 text-sm">
              {legalLinks.map((link) => (
                <li key={link.href}><FooterLink {...link} /></li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-white/5 text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Linkway Learning Private Limited.</p>
          {/* Social links - uncomment and add real URLs when ready
          <div className="flex gap-3">
            {[
              { icon: Linkedin, name: "LinkedIn", href: "https://linkedin.com/company/linkwaylearning" },
              { icon: Twitter, name: "Twitter", href: "https://twitter.com/linkwaylearning" },
              { icon: Instagram, name: "Instagram", href: "https://instagram.com/linkwaylearning" },
              { icon: Youtube, name: "YouTube", href: "https://youtube.com/@linkwaylearning" },
            ].map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:bg-white hover:text-black transition-all duration-300"
                aria-label={`Follow us on ${social.name}`}
              >
                <social.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
          */}
        </div>
      </div>
    </footer>
  );
}
