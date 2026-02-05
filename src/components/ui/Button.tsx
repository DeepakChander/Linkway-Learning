"use client";

import { cn } from "@/lib/utils";
import { motion, type HTMLMotionProps } from "framer-motion";
import Link from "next/link";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  href?: string;
}

export default function Button({ variant = "primary", size = "md", className, children, href, ...props }: ButtonProps) {
  const base = "relative inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 overflow-hidden group cursor-pointer";

  const variants = {
    primary: "bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40",
    secondary: "bg-navy-700 text-white hover:bg-navy-600 border border-navy-500/30",
    outline: "border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white",
    ghost: "text-gray-300 hover:text-white hover:bg-white/5",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const buttonContent = (
    <>
      {/* Orange fill wipe effect for outline variant */}
      {variant === "outline" && (
        <span className="absolute inset-0 bg-orange-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
      )}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cn(base, variants[variant], sizes[size], className)}>
        {buttonContent}
      </Link>
    );
  }

  return (
    <motion.button
      className={cn(base, variants[variant], sizes[size], className)}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      {...props}
    >
      {buttonContent}
    </motion.button>
  );
}
