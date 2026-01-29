"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useInView } from "framer-motion";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*!?<>{}[]";

interface TextScrambleProps {
  children: string;
  className?: string;
  delay?: number;
  /** ms per character resolve - lower = faster */
  speed?: number;
  /** How many random cycles before each char locks in */
  iterations?: number;
  once?: boolean;
  highlightColor?: "orange" | "white";
}

/**
 * TextScramble - Cipher-decode effect with smooth wave reveal.
 * Characters cycle through random glyphs before resolving left-to-right
 * with a wave-like stagger and opacity/blur transition.
 */
export default function TextScramble({
  children,
  className = "",
  delay = 0,
  speed = 30,
  iterations = 3,
  once = false,
  highlightColor,
}: TextScrambleProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" });
  const [display, setDisplay] = useState(children);
  const [resolvedCount, setResolvedCount] = useState(children.length);
  const [isScrambling, setIsScrambling] = useState(false);
  const animRef = useRef<number | null>(null);
  const prevChildren = useRef(children);

  const scramble = useCallback(() => {
    const target = children;
    let frame = 0;
    const totalFrames = target.length * iterations;
    setIsScrambling(true);
    setResolvedCount(0);

    // Cancel any ongoing animation
    if (animRef.current) cancelAnimationFrame(animRef.current);

    let lastTime = 0;

    const tick = (timestamp: number) => {
      if (!lastTime) lastTime = timestamp;
      const elapsed = timestamp - lastTime;

      // Throttle based on speed prop
      if (elapsed < speed) {
        animRef.current = requestAnimationFrame(tick);
        return;
      }
      lastTime = timestamp;

      const resolved = Math.floor(frame / iterations);
      setResolvedCount(resolved);
      let output = "";

      for (let i = 0; i < target.length; i++) {
        if (target[i] === " ") {
          output += " ";
        } else if (i < resolved) {
          output += target[i];
        } else {
          output += CHARS[Math.floor(Math.random() * CHARS.length)];
        }
      }

      setDisplay(output);
      frame++;

      if (frame <= totalFrames) {
        animRef.current = requestAnimationFrame(tick);
      } else {
        setDisplay(target);
        setResolvedCount(target.length);
        setIsScrambling(false);
      }
    };

    setTimeout(() => {
      animRef.current = requestAnimationFrame(tick);
    }, delay * 1000);
  }, [children, delay, iterations, speed]);

  // Run on mount when in view
  useEffect(() => {
    if (isInView && prevChildren.current === children) {
      const randomStart = children
        .split("")
        .map((c) => (c === " " ? " " : CHARS[Math.floor(Math.random() * CHARS.length)]))
        .join("");
      setDisplay(randomStart);
      setResolvedCount(0);
      scramble();
    }
  }, [isInView, scramble, children]);

  // Re-run when children change (headline rotation)
  useEffect(() => {
    if (prevChildren.current !== children) {
      prevChildren.current = children;
      const randomStart = children
        .split("")
        .map((c) => (c === " " ? " " : CHARS[Math.floor(Math.random() * CHARS.length)]))
        .join("");
      setDisplay(randomStart);
      setResolvedCount(0);
      scramble();
    }
  }, [children, scramble]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  const colorClass =
    highlightColor === "orange"
      ? "text-orange-400"
      : highlightColor === "white"
        ? "text-white"
        : "";

  return (
    <span ref={ref} className={`inline-block ${colorClass} ${className}`} aria-label={children}>
      <span aria-hidden="true" className="font-mono tracking-tight">
        {display.split("").map((char, i) => {
          const isResolved = !isScrambling || i < resolvedCount || char === children[i];
          // Wave-like transition: chars near the resolve frontier get partial opacity
          const distFromFrontier = i - resolvedCount;
          const isNearFrontier = isScrambling && distFromFrontier >= 0 && distFromFrontier < 3;

          return (
            <span
              key={i}
              className="inline-block transition-all duration-200 ease-out"
              style={{
                opacity: isResolved ? 1 : isNearFrontier ? 0.7 : 0.35,
                filter: isResolved ? "blur(0px)" : isNearFrontier ? "blur(0.5px)" : "blur(1px)",
                transform: isResolved ? "translateY(0px)" : `translateY(${isNearFrontier ? 1 : 2}px)`,
                fontFamily: isResolved ? "inherit" : "monospace",
                color: !isResolved && isNearFrontier ? undefined : undefined,
              }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          );
        })}
      </span>
      <span className="sr-only">{children}</span>
    </span>
  );
}
