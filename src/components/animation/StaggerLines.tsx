"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StaggerLinesProps {
  children: React.ReactNode[];
  className?: string;
  baseDelay?: number;
  staggerDelay?: number;
  skewY?: number;
  distance?: number;
}

/**
 * StaggerLines - Waterfall entry animation for multiple lines/elements.
 * Each child is delayed relative to the previous one, creating a sequential reveal.
 * Combines skewY + translateY for the "thrown onto page" Vizcom effect.
 */
export default function StaggerLines({
  children,
  className = "",
  baseDelay = 0.5,
  staggerDelay = 0.1,
  skewY = -5,
  distance = 150,
}: StaggerLinesProps) {
  return (
    <div className={cn(className)}>
      {children.map((child, i) => (
        <motion.div
          key={i}
          initial={{
            opacity: 0.001,
            y: distance,
            skewY,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
            skewY: 0,
          }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 12,
            mass: 1,
            delay: baseDelay + i * staggerDelay,
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}
