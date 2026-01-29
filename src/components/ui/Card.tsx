"use client";

import { cn } from "@/lib/utils";
import { usePageTheme } from "@/lib/theme";
import { motion } from "framer-motion";

interface CardProps {
  children: React.ReactNode;
  variant?: "glass" | "solid" | "accent";
  hover?: boolean;
  className?: string;
  onClick?: () => void;
}

export default function Card({ children, variant = "glass", hover = true, className, onClick }: CardProps) {
  const theme = usePageTheme();
  const light = theme === "light";

  const variants = {
    glass: light
      ? "bg-white border border-gray-200 shadow-[0_2px_16px_rgba(0,0,0,0.06)]"
      : "backdrop-blur-xl bg-white/[0.04] border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.3)]",
    solid: light
      ? "bg-gray-50 border border-gray-200 shadow-sm"
      : "bg-navy-800 border border-navy-600/30 shadow-lg",
    accent: light
      ? "bg-orange-50 border border-orange-200/60"
      : "backdrop-blur-xl bg-orange-500/[0.06] border border-orange-500/[0.15]",
  };

  const hoverStyle = light
    ? "hover:border-gray-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)]"
    : "hover:border-white/[0.15] hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)]";

  return (
    <motion.div
      className={cn("rounded-2xl p-6 transition-all duration-300", variants[variant], hover && hoverStyle, className)}
      whileHover={hover ? { y: -4, rotateY: 2 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      onClick={onClick}
      style={{ transformPerspective: 1000 }}
    >
      {children}
    </motion.div>
  );
}
