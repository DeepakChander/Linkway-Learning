"use client";

import { cn } from "@/lib/utils";
import { usePageTheme } from "@/lib/theme";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "orange" | "navy" | "glass";
  className?: string;
}

export default function Badge({ children, variant = "default", className }: BadgeProps) {
  const theme = usePageTheme();
  const light = theme === "light";

  const variants = {
    default: light
      ? "bg-gray-100 text-gray-700 border border-gray-200"
      : "bg-white/10 text-white/80 border border-white/10",
    orange: light
      ? "bg-orange-50 text-orange-600 border border-orange-200"
      : "bg-orange-500/15 text-orange-400 border border-orange-500/20",
    navy: light
      ? "bg-navy-100 text-navy-700 border border-navy-200"
      : "bg-navy-700 text-navy-100 border border-navy-500/30",
    glass: light
      ? "bg-gray-50 text-gray-600 border border-gray-200"
      : "backdrop-blur-md bg-white/5 text-white/90 border border-white/10",
  };

  return (
    <span className={cn("inline-flex items-center px-3 py-1 rounded-full text-xs font-medium tracking-wide", variants[variant], className)}>
      {children}
    </span>
  );
}
