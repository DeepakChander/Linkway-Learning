"use client";

import { cn } from "@/lib/utils";

interface MarqueeProps {
  children: React.ReactNode;
  speed?: number;
  speedMultiplier?: number;
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  className?: string;
  gap?: number;
  fadeEdges?: boolean;
  duplicateCount?: number;
}

/**
 * Enhanced Marquee - Infinite scrolling content strip
 * Supports SVG children, configurable speed multiplier, and smooth pause-on-hover
 *
 * @example
 * <Marquee speed={25} speedMultiplier={1.5} fadeEdges gap={12}>
 *   <Logo1 />
 *   <Logo2 />
 * </Marquee>
 */
export default function Marquee({
  children,
  speed = 30,
  speedMultiplier = 1,
  direction = "left",
  pauseOnHover = true,
  className = "",
  gap = 8,
  fadeEdges = false,
  duplicateCount = 3,
}: MarqueeProps) {
  const animDirection = direction === "left" ? "normal" : "reverse";
  const effectiveSpeed = speed / speedMultiplier;

  const duplicates = Array.from({ length: duplicateCount }, (_, i) => i);

  return (
    <div
      className={cn(
        "group relative flex overflow-hidden",
        className
      )}
      role="marquee"
      aria-label="Scrolling content"
    >
      {/* Left fade edge */}
      {fadeEdges && (
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-navy-900 to-transparent z-10 pointer-events-none" />
      )}

      {duplicates.map((i) => (
        <div
          key={i}
          className={cn(
            "flex shrink-0 items-center",
            pauseOnHover && "group-hover:[animation-play-state:paused]"
          )}
          style={{
            animation: `marquee ${effectiveSpeed}s linear infinite ${animDirection}`,
            gap: `${gap * 4}px`,
            paddingRight: `${gap * 4}px`,
            willChange: 'transform',
          }}
        >
          {children}
        </div>
      ))}

      {/* Right fade edge */}
      {fadeEdges && (
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-navy-900 to-transparent z-10 pointer-events-none" />
      )}
    </div>
  );
}
