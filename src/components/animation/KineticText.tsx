"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";

interface KineticTextProps {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  splitBy?: "words" | "chars";
  delay?: number;
  stagger?: number;
  animation?: "fadeUp" | "flipUp" | "slideUp" | "scaleUp";
}

export default function KineticText({
  text,
  as: Tag = "h1",
  className = "",
  splitBy = "words",
  delay = 0,
  stagger = 0.12,
  animation = "flipUp",
}: KineticTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const parts = splitBy === "words" ? text.split(" ") : text.split("");

  const animationMap = {
    fadeUp: { y: 60, opacity: 0, rotateX: 0 },
    flipUp: { y: 120, opacity: 0, rotateX: -90 },
    slideUp: { y: 100, opacity: 0, rotateX: 0 },
    scaleUp: { scale: 0.5, opacity: 0, rotateX: 0 },
  };

  useGSAP(
    () => {
      const el = containerRef.current;
      if (!el) return;
      const spans = el.querySelectorAll(".kinetic-part");
      gsap.from(spans, {
        ...animationMap[animation],
        duration: 1.2,
        stagger,
        delay,
        ease: "power3.out",
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="overflow-hidden">
      <Tag className={className}>
        {parts.map((part, i) => (
          <span
            key={i}
            className="kinetic-part inline-block"
            style={{ display: "inline-block" }}
          >
            {part}
            {splitBy === "words" && i < parts.length - 1 ? "\u00A0" : ""}
          </span>
        ))}
      </Tag>
    </div>
  );
}
