"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ArcCarouselProps {
  children: React.ReactNode[];
  className?: string;
  cardWidth?: number;
  gap?: number;
  arcHeight?: number;
  speed?: number;
  /** CSS color for fade edges. Defaults to navy-900. Use "transparent" to disable. */
  fadeColor?: string;
}

/**
 * Infinite auto-scrolling carousel where cards travel along an elliptical arc.
 * Cards continuously move right-to-left. Hovering pauses, dragging overrides.
 * Cards are duplicated for seamless infinite looping.
 */
export default function ArcCarousel({
  children,
  className,
  cardWidth = 420,
  gap = 32,
  arcHeight = 70,
  speed = 0.6,
  fadeColor,
}: ArcCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const rafRef = useRef<number>(0);
  const isPausedRef = useRef(false);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragOffsetRef = useRef(0);
  const velocityRef = useRef(0);
  const lastDragXRef = useRef(0);
  const [, forceRender] = useState(0);

  const totalCards = children.length;
  const unitWidth = cardWidth + gap;
  // Total width of one full set
  const setWidth = totalCards * unitWidth;

  // We render 3 copies for seamless looping
  const allCards = [...children, ...children, ...children];

  // Auto-scroll animation loop
  const animate = useCallback(() => {
    if (!isDraggingRef.current) {
      if (!isPausedRef.current) {
        // Apply velocity decay from drag release
        if (Math.abs(velocityRef.current) > 0.1) {
          offsetRef.current -= velocityRef.current;
          velocityRef.current *= 0.95;
        } else {
          velocityRef.current = 0;
          // Normal auto-scroll
          offsetRef.current -= speed;
        }
      } else {
        // Still apply momentum when paused after drag
        if (Math.abs(velocityRef.current) > 0.1) {
          offsetRef.current -= velocityRef.current;
          velocityRef.current *= 0.95;
        }
      }
    }

    // Wrap offset for infinite loop
    if (offsetRef.current < -setWidth) {
      offsetRef.current += setWidth;
    } else if (offsetRef.current > 0) {
      offsetRef.current -= setWidth;
    }

    forceRender((n) => n + 1);
    rafRef.current = requestAnimationFrame(animate);
  }, [speed, setWidth]);

  useEffect(() => {
    // Start with offset in the middle set
    offsetRef.current = -setWidth;
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [animate, setWidth]);

  // Mouse handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    dragOffsetRef.current = offsetRef.current;
    lastDragXRef.current = e.clientX;
    velocityRef.current = 0;
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    e.preventDefault();
    const dx = e.clientX - dragStartXRef.current;
    offsetRef.current = dragOffsetRef.current + dx;
    velocityRef.current = -(e.clientX - lastDragXRef.current) * 0.3;
    lastDragXRef.current = e.clientX;
  }, []);

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  // Touch handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    isDraggingRef.current = true;
    isPausedRef.current = true;
    dragStartXRef.current = e.touches[0].clientX;
    dragOffsetRef.current = offsetRef.current;
    lastDragXRef.current = e.touches[0].clientX;
    velocityRef.current = 0;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.touches[0].clientX - dragStartXRef.current;
    offsetRef.current = dragOffsetRef.current + dx;
    velocityRef.current = -(e.touches[0].clientX - lastDragXRef.current) * 0.3;
    lastDragXRef.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(() => {
    isDraggingRef.current = false;
    // Resume auto-scroll after 2s
    setTimeout(() => {
      isPausedRef.current = false;
    }, 2000);
  }, []);

  // Calculate per-card arc transform
  const getCardStyle = (index: number) => {
    const container = containerRef.current;
    const containerWidth = container?.clientWidth || 1200;
    const centerX = containerWidth / 2;

    // Card position
    const cardX = index * unitWidth + offsetRef.current + unitWidth / 2;
    const normalized = (cardX - centerX) / (containerWidth * 0.6);
    const clamped = Math.max(-1.5, Math.min(1.5, normalized));

    // Arc: parabolic curve, center = 0, edges dip
    const y = arcHeight * (clamped * clamped);
    const scale = 1 - Math.abs(clamped) * 0.06;
    const opacity = Math.max(0.15, 1 - Math.abs(clamped) * 0.5);
    const rotate = clamped * -2.5;

    return {
      transform: `translate3d(${index * unitWidth + offsetRef.current}px, ${y}px, 0) scale(${scale}) rotate(${rotate}deg)`,
      opacity,
      willChange: "transform, opacity" as const,
    };
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden", className)}
      onMouseEnter={() => { isPausedRef.current = true; }}
      onMouseLeave={() => { isPausedRef.current = false; isDraggingRef.current = false; }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ cursor: isDraggingRef.current ? "grabbing" : "grab" }}
    >
      {/* Card track - absolutely positioned cards for free movement */}
      <div className="relative h-[420px] md:h-[440px] select-none">
        {allCards.map((child, i) => (
          <div
            key={i}
            className="absolute top-0 left-0"
            style={{
              width: `${cardWidth}px`,
              ...getCardStyle(i),
            }}
          >
            {child}
          </div>
        ))}
      </div>

      {/* Fade edges */}
      {fadeColor !== "transparent" && (
        <>
          <div
            className="absolute left-0 top-0 bottom-0 w-20 md:w-32 pointer-events-none z-20"
            style={{ background: `linear-gradient(to right, ${fadeColor || 'var(--color-navy-900)'}, transparent)` }}
          />
          <div
            className="absolute right-0 top-0 bottom-0 w-20 md:w-32 pointer-events-none z-20"
            style={{ background: `linear-gradient(to left, ${fadeColor || 'var(--color-navy-900)'}, transparent)` }}
          />
        </>
      )}
    </div>
  );
}
