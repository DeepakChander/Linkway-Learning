"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SpringRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  distance?: number;
  skewY?: number;
  stiffness?: number;
  damping?: number;
  mass?: number;
}

/**
 * SpringReveal - Physics-based spring entry animation
 * Uses spring physics for organic, bouncy motion instead of linear easing.
 * Optionally applies skewY for a "thrown onto page" feel.
 */
export default function SpringReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
  distance = 150,
  skewY = 0,
  stiffness = 100,
  damping = 10,
  mass = 1,
}: SpringRevealProps) {
  const directionMap = {
    up: { y: distance, x: 0 },
    down: { y: -distance, x: 0 },
    left: { x: distance, y: 0 },
    right: { x: -distance, y: 0 },
  };

  return (
    <motion.div
      className={cn(className)}
      initial={{
        opacity: 0.001,
        ...directionMap[direction],
        skewY,
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        skewY: 0,
      }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{
        type: "spring",
        stiffness,
        damping,
        mass,
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}
