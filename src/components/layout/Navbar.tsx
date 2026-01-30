"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: "/" },
  {
    label: "Courses",
    href: "/courses",
    children: [
      { label: "Data Analytics Accelerator", href: "/courses/data-analytics" },
      { label: "Data Science & AI Mastery", href: "/courses/data-science-ai" },
      {
        label: "Business Intelligence & Strategy",
        href: "/courses/business-intelligence",
      },
    ],
  },
  { label: "About", href: "/about" },
  { label: "Success Stories", href: "/success-stories" },
  { label: "Blog", href: "/blog" },
];

// --- Mobile nav animation variants ---
const overlayVariants = {
  closed: { opacity: 0 },
  open: { opacity: 1, transition: { duration: 0.3 } },
};

const mobileMenuVariants = {
  closed: { x: "100%" },
  open: {
    x: 0,
    transition: { type: "spring" as const, damping: 25, stiffness: 200 },
  },
};

const mobileItemVariants = {
  closed: { opacity: 0, x: 30 },
  open: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.1 + i * 0.06, duration: 0.35 },
  }),
};

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [coursesOpen, setCoursesOpen] = useState(false);
  const dropdownTimeout = useRef<NodeJS.Timeout | null>(null);

  // Scroll listener
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile nav open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isHome = pathname === "/";

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const handleDropdownEnter = () => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setCoursesOpen(true);
  };

  const handleDropdownLeave = () => {
    dropdownTimeout.current = setTimeout(() => setCoursesOpen(false), 150);
  };

  return (
    <>
      {/* Pill-shaped floating navbar */}
      <div
        className={cn(
          "fixed top-0 inset-x-0 z-50 flex justify-center transition-all duration-500",
          scrolled ? "pt-3 px-4 sm:px-6" : "pt-4 px-5 sm:px-8"
        )}
      >
        <nav
          className={cn(
            "w-full max-w-7xl rounded-2xl transition-all duration-500",
            "border py-3 px-8 sm:px-12",
            scrolled
              ? "border-gray-200/60 bg-white/80 backdrop-blur-[20px] backdrop-saturate-[1.8] shadow-[0_8px_32px_rgba(0,0,0,0.06),inset_0_0.5px_0_rgba(255,255,255,0.8)]"
              : isHome
                ? "border-white/[0.06] bg-white/[0.05] backdrop-blur-[12px] backdrop-saturate-150 shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
                : "border-gray-200/60 bg-white/75 backdrop-blur-[12px] backdrop-saturate-150 shadow-[0_4px_20px_rgba(0,0,0,0.05)]"
          )}
        >
          {/* Desktop layout */}
          <div className="hidden lg:flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="shrink-0">
              <Image
                src="/images/logo/linkway-learning.jpeg"
                alt="Linkway Learning"
                width={90}
                height={90}
                className="rounded-lg transition-all duration-300"
                priority
              />
            </Link>

            {/* Nav links - centered */}
            <ul className="flex-1 flex items-center justify-center gap-2">
              {navLinks.map((link) =>
                link.children ? (
                  <li
                    key={link.label}
                    className="relative"
                    onMouseEnter={handleDropdownEnter}
                    onMouseLeave={handleDropdownLeave}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        "group flex items-center h-12 px-5 transition-colors duration-300",
                        isActive(link.href)
                          ? "text-orange-500"
                          : scrolled ? "text-gray-900" : isHome ? "text-gray-300" : "text-gray-900"
                      )}
                    >
                      <span className={cn(
                        "transition-colors duration-300 text-lg font-medium",
                        scrolled ? "group-hover:text-navy-900" : isHome ? "group-hover:text-white" : "group-hover:text-navy-900"
                      )}>
                        {link.label}
                      </span>
                      <ChevronDown
                        className={cn(
                          "h-3.5 w-3.5 ml-1 transition-all duration-200",
                          coursesOpen
                            ? scrolled ? "rotate-180 text-navy-900" : isHome ? "rotate-180 text-white" : "rotate-180 text-navy-900"
                            : scrolled ? "text-gray-700 group-hover:text-gray-900" : isHome ? "text-gray-500 group-hover:text-gray-300" : "text-gray-700 group-hover:text-gray-900"
                        )}
                      />
                    </Link>

                    {/* Dropdown */}
                    <AnimatePresence>
                      {coursesOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.2 }}
                          className={cn(
                            "absolute top-full left-0 mt-3 w-72 rounded-2xl backdrop-blur-xl shadow-2xl overflow-hidden",
                            isHome
                              ? "bg-navy-800/95 border border-white/[0.08] shadow-black/50"
                              : "bg-white/95 border border-gray-200/80 shadow-black/10"
                          )}
                        >
                          {link.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={cn(
                                "block px-5 py-3.5 text-base transition-colors duration-200",
                                isActive(child.href)
                                  ? isHome ? "text-orange-500 bg-white/[0.04]" : "text-orange-500 bg-orange-50"
                                  : isHome ? "text-gray-300 hover:text-white hover:bg-white/[0.04]" : "text-gray-600 hover:text-navy-900 hover:bg-gray-50"
                              )}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                ) : (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className={cn(
                        "group flex items-center h-12 px-5 transition-colors duration-300",
                        isActive(link.href)
                          ? "text-orange-500"
                          : scrolled ? "text-gray-900" : isHome ? "text-gray-300" : "text-gray-900"
                      )}
                    >
                      <span className={cn(
                        "transition-colors duration-300 text-lg font-medium",
                        scrolled ? "group-hover:text-navy-900" : isHome ? "group-hover:text-white" : "group-hover:text-navy-900"
                      )}>
                        {link.label}
                      </span>
                    </Link>
                  </li>
                )
              )}
            </ul>

            {/* CTA - flush inside the pill */}
            <Link
              href="/enroll"
              className={cn(
                "shrink-0 flex items-center justify-center font-bold gap-2 px-7 py-3 rounded-xl transition-all duration-300 min-w-[140px] text-base ml-4",
                isHome
                  ? "bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40"
                  : "bg-navy-900 text-white hover:bg-navy-800 shadow-lg shadow-navy-900/25"
              )}
            >
              Enroll Now
            </Link>
          </div>

          {/* Mobile layout */}
          <div className="flex lg:hidden items-center justify-between gap-2">
            {/* Logo */}
            <Link href="/" className="shrink-0">
              <Image
                src="/images/logo/linkway-learning.jpeg"
                alt="Linkway Learning"
                width={48}
                height={48}
                className="rounded-full"
                priority
              />
            </Link>

            {/* CTA + Hamburger */}
            <div className="flex items-center gap-2">
              <Link
                href="/enroll"
                className={cn(
                  "hidden xs:flex items-center justify-center font-bold px-4 py-2 rounded-full transition-colors duration-300 text-sm",
                  isHome
                    ? "bg-orange-500 text-white hover:bg-orange-600"
                    : "bg-navy-900 text-white hover:bg-navy-800"
                )}
              >
                Enroll Now
              </Link>
              <button
                className={cn(
                  "p-2.5 mr-1 transition-colors duration-300",
                  isHome ? "text-gray-300 hover:text-white" : "text-gray-500 hover:text-navy-900"
                )}
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                {/* Two-line hamburger like reference */}
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M5.25 9.25L18.75 9.25" />
                  <path d="M5.25 14.75L18.75 14.75" />
                </svg>
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              variants={overlayVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />

            {/* Panel */}
            <motion.div
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-navy-900 border-l border-white/[0.06] flex flex-col lg:hidden"
            >
              {/* Close button */}
              <div className="flex items-center justify-between h-20 px-6">
                <Image
                  src="/images/logo/linkway-learning.jpeg"
                  alt="Linkway Learning"
                  width={52}
                  height={52}
                  className="rounded-full"
                />
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Links */}
              <nav className="flex-1 overflow-y-auto px-6 py-4">
                <ul className="space-y-1">
                  {navLinks.map((link, i) => (
                    <motion.li
                      key={link.label}
                      custom={i}
                      variants={mobileItemVariants}
                      initial="closed"
                      animate="open"
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "block px-4 py-3 rounded-lg text-base font-medium transition-colors",
                          isActive(link.href)
                            ? "text-orange-500 bg-orange-500/10"
                            : "text-gray-300 hover:text-white hover:bg-white/[0.04]"
                        )}
                      >
                        {link.label}
                      </Link>

                      {/* Sub-items for courses */}
                      {link.children && (
                        <ul className="ml-4 mt-1 space-y-1 border-l border-white/[0.06] pl-4">
                          {link.children.map((child, j) => (
                            <motion.li
                              key={child.href}
                              custom={i + j + 1}
                              variants={mobileItemVariants}
                              initial="closed"
                              animate="open"
                            >
                              <Link
                                href={child.href}
                                onClick={() => setMobileOpen(false)}
                                className={cn(
                                  "block px-4 py-2.5 rounded-lg text-sm transition-colors",
                                  isActive(child.href)
                                    ? "text-orange-500"
                                    : "text-gray-400 hover:text-white hover:bg-white/[0.04]"
                                )}
                              >
                                {child.label}
                              </Link>
                            </motion.li>
                          ))}
                        </ul>
                      )}
                    </motion.li>
                  ))}
                </ul>
              </nav>

              {/* CTA */}
              <motion.div
                custom={navLinks.length + 1}
                variants={mobileItemVariants}
                initial="closed"
                animate="open"
                className="px-6 py-6 border-t border-white/[0.06]"
              >
                <Link
                  href="/enroll"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center w-full font-bold px-5 py-3 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition-colors duration-300"
                >
                  Enroll Now
                </Link>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
