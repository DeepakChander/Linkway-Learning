"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { X, ChevronDown, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePurchaseModal } from "@/components/forms/PurchaseModal";
import { trackEnrollClick, trackNavClick } from "@/lib/analytics";

const coursePathToName: Record<string, string> = {
  "/courses/data-analytics": "Data Analytics",
  "/courses/business-analytics": "Business Analytics",
  "/courses/data-science-ai": "Data Science and AI",
  "/courses/agentic-ai": "Agentic AI & Prompt Engineering",
  "/courses/investment-banking": "Investment Banking",
};

const navLinks = [
  { label: "Home", href: "/" },
  {
    label: "Courses",
    href: "/courses",
    children: [
      { label: "Data Analytics", href: "/courses/data-analytics", desc: "Master Excel, SQL, Power BI & Tableau" },
      { label: "Business Analytics", href: "/courses/business-analytics", desc: "Data-driven decision making" },
      { label: "Data Science and AI", href: "/courses/data-science-ai", desc: "Python, ML & Deep Learning" },
      { label: "Agentic AI & Prompt Engineering", href: "/courses/agentic-ai", desc: "Build autonomous AI agents" },
      { label: "Investment Banking", href: "/courses/investment-banking", desc: "Financial modeling & valuation" },
    ],
  },
  { label: "About Us", href: "/about" },
  { label: "Success Stories", href: "/success-stories" },
  {
    label: "Resources",
    href: "/blog",
    children: [
      { label: "Blog", href: "/blog", desc: "Industry insights & career guides" },
      { label: "Case Studies", href: "/case-studies", desc: "Real-world data science case studies" },
    ],
  },
];

/* ── Magnetic Link - follows cursor subtly ── */
function MagneticLink({
  children,
  className,
  href,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  href: string;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      x.set((e.clientX - cx) * 0.15);
      y.set((e.clientY - cy) * 0.15);
    },
    [x, y]
  );

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  const handleClick = () => {
    trackNavClick(typeof children === "string" ? children : href);
    onClick?.();
  };

  return (
    <motion.div style={{ x: springX, y: springY }} className="inline-flex">
      <Link
        ref={ref}
        href={href}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={className}
      >
        {children}
      </Link>
    </motion.div>
  );
}

/* ── Mobile nav animation variants ── */
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
  const { openPurchase } = usePurchaseModal();
  const normalizedPath = pathname.replace(/\/+$/, "");
  const courseName = coursePathToName[normalizedPath];

  const handleEnroll = useCallback(() => {
    trackEnrollClick("Navbar", courseName);
    openPurchase(courseName);
  }, [courseName, openPurchase]);

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownTimeouts = useRef<Record<string, NodeJS.Timeout>>({});
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const sy = window.scrollY;
      setScrolled(sy > 50);
      setScrollProgress(Math.min(sy / 300, 1));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const isHome = pathname === "/";

  const isActive = (href: string, children?: { href: string }[]) => {
    if (href === "/") return pathname === "/";
    if (pathname.startsWith(href)) return true;
    if (children) return children.some((child) => pathname.startsWith(child.href));
    return false;
  };

  const handleDropdownEnter = (label: string) => {
    if (dropdownTimeouts.current[label]) {
      clearTimeout(dropdownTimeouts.current[label]);
      delete dropdownTimeouts.current[label];
    }
    setOpenDropdown(label);
  };

  const handleDropdownLeave = (label: string) => {
    dropdownTimeouts.current[label] = setTimeout(() => {
      setOpenDropdown((current) => (current === label ? null : current));
    }, 180);
  };

  /* Animated border gradient opacity based on scroll */
  const borderOpacity = useMotionValue(0);
  const springBorder = useSpring(borderOpacity, { stiffness: 100, damping: 30 });
  const borderGradient = useTransform(springBorder, [0, 1], [0, 0.6]);

  useEffect(() => {
    borderOpacity.set(scrolled ? 1 : 0);
  }, [scrolled, borderOpacity]);

  return (
    <>
      {/* Navbar container */}
      <div
        className={cn(
          "fixed top-0 inset-x-0 z-50 flex justify-center transition-all duration-700 ease-out",
          scrolled ? "pt-3 px-4 sm:px-6" : "pt-5 px-5 sm:px-8"
        )}
      >
        <motion.nav
          className={cn(
            "relative w-full max-w-7xl rounded-2xl transition-all duration-700 ease-out",
            "py-2.5 px-5 sm:px-8"
          )}
          style={{
            background: scrolled
              ? `rgba(255, 255, 255, 0.72)`
              : isHome
                ? `rgba(255, 255, 255, ${0.03 + scrollProgress * 0.05})`
                : `rgba(255, 255, 255, 0.6)`,
            backdropFilter: `blur(${scrolled ? 40 : 20 + scrollProgress * 20}px) saturate(${scrolled ? 1.8 : 1.2 + scrollProgress * 0.6})`,
            WebkitBackdropFilter: `blur(${scrolled ? 40 : 20 + scrollProgress * 20}px) saturate(${scrolled ? 1.8 : 1.2 + scrollProgress * 0.6})`,
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: scrolled
              ? `rgba(255, 255, 255, 0.25)`
              : isHome
                ? `rgba(255, 255, 255, ${0.08 + scrollProgress * 0.12})`
                : `rgba(255, 255, 255, 0.2)`,
            boxShadow: scrolled
              ? "0 4px 30px rgba(0,0,0,0.08), 0 1px 0 rgba(255,255,255,0.9) inset, 0 -1px 0 rgba(0,0,0,0.03) inset"
              : `0 2px 20px rgba(0,0,0,${0.08 + scrollProgress * 0.07}), 0 0.5px 0 rgba(255,255,255,${isHome ? 0.1 : 0.8}) inset`,
          }}
        >
          {/* Animated gradient border overlay - appears on scroll */}
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden"
            style={{ opacity: borderGradient }}
          >
            <div className="absolute inset-[-1px] rounded-2xl nav-gradient-border" />
          </motion.div>

          {/* Desktop layout */}
          <div className="hidden lg:flex items-center justify-between gap-4 relative z-10">
            {/* Logo */}
            <Link href="/" className="shrink-0 group relative">
              <span className={cn(
                "text-[1.65rem] font-bold transition-all duration-500 tracking-tight",
                scrolled ? "text-navy-900" : isHome ? "text-white" : "text-navy-900"
              )}>
                Linkway
              </span>
              <span className={cn(
                "absolute -bottom-0.5 left-0 h-[2px] rounded-full transition-all duration-500",
                scrolled
                  ? "w-full bg-gradient-to-r from-orange-500 to-orange-400"
                  : "w-0 group-hover:w-full bg-gradient-to-r from-orange-500 to-orange-300"
              )} />
            </Link>

            {/* Nav links */}
            <ul className="flex-1 flex items-center justify-center gap-1">
              {navLinks.map((link) =>
                link.children ? (
                  <li
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => handleDropdownEnter(link.label)}
                    onMouseLeave={() => handleDropdownLeave(link.label)}
                  >
                    <MagneticLink
                      href={link.href}
                      className={cn(
                        "group relative flex items-center h-10 px-4 transition-colors duration-300 rounded-xl",
                        isActive(link.href, link.children)
                          ? "text-orange-500"
                          : scrolled ? "text-gray-700" : isHome ? "text-gray-300" : "text-gray-700"
                      )}
                    >
                      <span className={cn(
                        "transition-all duration-300 text-[15px] font-medium tracking-[-0.01em]",
                        scrolled ? "group-hover:text-navy-900" : isHome ? "group-hover:text-white" : "group-hover:text-navy-900"
                      )}>
                        {link.label}
                      </span>
                      <ChevronDown
                        className={cn(
                          "h-3.5 w-3.5 ml-1 transition-all duration-300",
                          openDropdown === link.label ? "rotate-180" : "",
                          scrolled ? "text-gray-500" : isHome ? "text-gray-500" : "text-gray-500"
                        )}
                      />
                      {/* Active indicator dot */}
                      {isActive(link.href, link.children) && (
                        <motion.span
                          layoutId="nav-active"
                          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-orange-500"
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}
                    </MagneticLink>

                    {/* Premium Dropdown */}
                    <AnimatePresence>
                      {openDropdown === link.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 12, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.98 }}
                          transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                          className={cn(
                            "absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[340px] rounded-2xl overflow-hidden z-50",
                            scrolled
                              ? "bg-white border border-gray-200/80 shadow-2xl shadow-black/8"
                              : isHome
                                ? "bg-[#0f1729] border border-white/[0.1] shadow-2xl shadow-black/50"
                                : "bg-white border border-gray-200/80 shadow-2xl shadow-black/8"
                          )}
                        >
                          {/* Top accent bar */}
                          <div className="h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
                          <div className="p-2">
                            {link.children.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                className={cn(
                                  "group/item flex flex-col px-4 py-3 rounded-xl transition-all duration-200",
                                  isActive(child.href)
                                    ? (!scrolled && isHome) ? "bg-orange-500/10" : "bg-orange-50"
                                    : (!scrolled && isHome) ? "hover:bg-white/[0.06]" : "hover:bg-gray-50"
                                )}
                              >
                                <span className={cn(
                                  "text-[14px] font-medium transition-colors duration-200 flex items-center gap-2",
                                  isActive(child.href)
                                    ? "text-orange-500"
                                    : (!scrolled && isHome) ? "text-gray-200 group-hover/item:text-white" : "text-gray-800 group-hover/item:text-navy-900"
                                )}>
                                  {child.label}
                                  <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-200" />
                                </span>
                                <span className={cn(
                                  "text-[12px] mt-0.5",
                                  (!scrolled && isHome) ? "text-gray-500" : "text-gray-400"
                                )}>
                                  {child.desc}
                                </span>
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                ) : (
                  <li key={link.label}>
                    <MagneticLink
                      href={link.href}
                      className={cn(
                        "group relative flex items-center h-10 px-4 transition-colors duration-300 rounded-xl",
                        isActive(link.href)
                          ? "text-orange-500"
                          : scrolled ? "text-gray-700" : isHome ? "text-gray-300" : "text-gray-700"
                      )}
                    >
                      <span className={cn(
                        "transition-all duration-300 text-[15px] font-medium tracking-[-0.01em]",
                        scrolled ? "group-hover:text-navy-900" : isHome ? "group-hover:text-white" : "group-hover:text-navy-900"
                      )}>
                        {link.label}
                      </span>
                      {/* Active indicator dot */}
                      {isActive(link.href) && (
                        <motion.span
                          layoutId="nav-active"
                          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-orange-500"
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}
                    </MagneticLink>
                  </li>
                )
              )}
            </ul>

            {/* CTA Button - Opens Payment Modal */}
            <button
              onClick={handleEnroll}
              className={cn(
                "group shrink-0 relative flex items-center justify-center font-bold gap-2 px-6 py-2.5 rounded-xl transition-all duration-500 text-[14px] overflow-hidden cursor-pointer",
                isHome
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:shadow-xl"
                  : "bg-navy-900 text-white hover:bg-navy-800 shadow-lg shadow-navy-900/25"
              )}
            >
              {/* Shimmer sweep on hover */}
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </span>
              <span className="relative z-10">Enroll Now</span>
              <ArrowRight className="relative z-10 w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>
          </div>

          {/* Mobile layout */}
          <div className="flex lg:hidden items-center justify-between gap-2 relative z-10">
            <Link href="/" className="shrink-0">
              <span className={cn(
                "text-xl font-bold transition-colors duration-300 tracking-tight",
                scrolled ? "text-navy-900" : isHome ? "text-white" : "text-navy-900"
              )}>
                Linkway
              </span>
            </Link>

            <div className="flex items-center gap-2">
              <button
                onClick={handleEnroll}
                className={cn(
                  "hidden xs:flex items-center justify-center font-bold px-4 py-2 rounded-xl transition-all duration-300 text-sm cursor-pointer",
                  isHome
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white"
                    : "bg-navy-900 text-white hover:bg-navy-800"
                )}
              >
                Enroll Now
              </button>
              <button
                className={cn(
                  "relative p-2.5 mr-1 transition-colors duration-300 rounded-lg",
                  scrolled ? "text-gray-700 hover:bg-gray-100" : isHome ? "text-gray-300 hover:text-white" : "text-gray-500 hover:text-navy-900"
                )}
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M4 8.5L20 8.5" />
                  <path d="M4 15.5L16 15.5" />
                </svg>
              </button>
            </div>
          </div>
        </motion.nav>
      </div>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              variants={overlayVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />

            <motion.div
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed inset-y-0 right-0 z-50 w-full max-w-sm flex flex-col lg:hidden overflow-hidden"
            >
              {/* Glass background */}
              <div className="absolute inset-0 bg-navy-900/95 backdrop-blur-2xl" />

              {/* Decorative gradient orb */}
              <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-orange-500/5 blur-[100px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-[200px] h-[200px] rounded-full bg-blue-500/5 blur-[80px] pointer-events-none" />

              {/* Close button */}
              <div className="relative flex items-center justify-between h-20 px-6">
                <span className="text-xl font-bold text-white tracking-tight">Linkway</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Separator */}
              <div className="relative mx-6 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              {/* Links */}
              <nav className="relative flex-1 overflow-y-auto px-6 py-6">
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
                          "flex items-center justify-between px-4 py-3.5 rounded-xl text-[15px] font-medium transition-all duration-200",
                          isActive(link.href, link.children)
                            ? "text-orange-500 bg-orange-500/8"
                            : "text-gray-300 hover:text-white hover:bg-white/[0.04]"
                        )}
                      >
                        {link.label}
                        {isActive(link.href, link.children) && (
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                        )}
                      </Link>

                      {link.children && (
                        <ul className="ml-4 mt-1 space-y-0.5 border-l border-white/[0.06] pl-4">
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
                                  "block px-4 py-2.5 rounded-lg text-sm transition-all duration-200",
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
                className="relative px-6 py-6 border-t border-white/[0.06]"
              >
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    handleEnroll();
                  }}
                  className="flex items-center justify-center gap-2 w-full font-bold px-5 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300 cursor-pointer"
                >
                  Enroll Now
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}