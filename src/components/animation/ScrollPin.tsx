"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollPinProps {
  children: React.ReactNode;
  className?: string;
  /** How long the pin lasts in viewport heights (e.g., 2 = 200vh of scroll) */
  pinDuration?: number;
  /** ID for the ScrollTrigger (must be unique) */
  id?: string;
}

/**
 * ScrollPin - Pins content while the user scrolls through a defined range.
 * Uses GSAP ScrollTrigger pin. Content stays fixed while scroll continues.
 *
 * @example
 * <ScrollPin pinDuration={2}>
 *   <div className="h-screen">Pinned content</div>
 * </ScrollPin>
 */
export default function ScrollPin({
  children,
  className = "",
  pinDuration = 1,
  id,
}: ScrollPinProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = containerRef.current;
      if (!el) return;

      ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: `+=${window.innerHeight * pinDuration}`,
        pin: true,
        pinSpacing: true,
        id,
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
