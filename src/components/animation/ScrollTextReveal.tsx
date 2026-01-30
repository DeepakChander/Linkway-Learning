"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollTextRevealProps {
  children: string;
  className?: string;
  /** 'word' reveals word-by-word, 'line' reveals by child elements */
  mode?: "word" | "char";
  /** Scrub speed: true for 1:1, or a number for smoothing */
  scrub?: boolean | number;
  tag?: "h1" | "h2" | "h3" | "p" | "span";
}

/**
 * ScrollTextReveal - Noomo-style scroll-scrubbed text reveal.
 * Words start dimmed/blurred and come into focus as you scroll through.
 */
export default function ScrollTextReveal({
  children,
  className = "",
  mode = "word",
  scrub = 1,
  tag: Tag = "p",
}: ScrollTextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = containerRef.current;
      if (!el) return;

      const items = el.querySelectorAll(".scroll-text-unit");
      if (!items.length) return;

      gsap.set(items, { opacity: 0.15, filter: "blur(2px)" });

      gsap.to(items, {
        opacity: 1,
        filter: "blur(0px)",
        stagger: 0.05,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          end: "bottom 40%",
          scrub: scrub === true ? 1 : scrub || 1,
        },
      });
    },
    { scope: containerRef }
  );

  const units = mode === "word" ? children.split(" ") : children.split("");
  const separator = mode === "word" ? " " : "";

  return (
    <div ref={containerRef}>
      <Tag className={className}>
        {units.map((unit, i) => (
          <span
            key={i}
            className="scroll-text-unit inline-block will-change-[opacity,filter]"
            style={{ marginRight: separator ? "0.3em" : undefined }}
          >
            {unit}
          </span>
        ))}
      </Tag>
    </div>
  );
}
