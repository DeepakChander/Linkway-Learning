"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface CounterProps {
  target: number;
  suffix?: string;
  duration?: number;
  className?: string;
}

export default function Counter({ target, suffix = "", duration = 2, className = "" }: CounterProps) {
  const counterRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const el = counterRef.current;
    if (!el) return;

    const obj = { value: 0 };
    gsap.to(obj, {
      value: target,
      duration,
      ease: "power2.out",
      snap: { value: 1 },
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none none",
      },
      onUpdate: () => {
        el.textContent = Math.round(obj.value) + suffix;
      },
    });
  });

  return <span ref={counterRef} className={className}>0{suffix}</span>;
}
