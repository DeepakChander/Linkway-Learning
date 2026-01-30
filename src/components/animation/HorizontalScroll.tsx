"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface HorizontalScrollProps {
  children: React.ReactNode;
  className?: string;
  /** Scroll distance multiplier - higher = more scroll needed */
  speed?: number;
}

/**
 * HorizontalScroll - Noomo-style horizontal scroll section.
 * Pins the container and translates children horizontally as user scrolls vertically.
 */
export default function HorizontalScroll({
  children,
  className = "",
  speed = 1,
}: HorizontalScrollProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return;

      const totalWidth = track.scrollWidth - window.innerWidth;

      gsap.to(track, {
        x: -totalWidth,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${totalWidth * speed}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <div ref={sectionRef} className={`overflow-hidden ${className}`}>
      <div
        ref={trackRef}
        className="flex items-stretch will-change-transform"
        style={{ width: "max-content" }}
      >
        {children}
      </div>
    </div>
  );
}
