'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useInView } from 'framer-motion';

interface LineMaskRevealProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    staggerDelay?: number;
    direction?: 'up' | 'down';
    once?: boolean;
}

/**
 * LineMaskReveal - Reveals content line by line with a sliding mask effect
 * Inspired by Terminal.co paragraph reveals
 * 
 * @example
 * <LineMaskReveal>
 *   <p>First paragraph reveals first</p>
 *   <p>Second paragraph reveals after</p>
 * </LineMaskReveal>
 */
export default function LineMaskReveal({
    children,
    className = '',
    delay = 0,
    staggerDelay = 0.15,
    direction = 'up',
    once = true,
}: LineMaskRevealProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, {
        once,
        margin: '-5% 0px -5% 0px',
    });
    const [hasRevealed, setHasRevealed] = useState(false);

    useEffect(() => {
        if (isInView && !hasRevealed) {
            setHasRevealed(true);
        }
    }, [isInView, hasRevealed]);

    // Convert children to array
    const childArray = React.Children.toArray(children);

    const translateStart = direction === 'up' ? 'translateY(40px)' : 'translateY(-40px)';

    return (
        <div ref={containerRef} className={`overflow-hidden ${className}`}>
            {childArray.map((child, index) => (
                <div
                    key={index}
                    className="overflow-hidden"
                    style={{
                        opacity: hasRevealed ? 1 : 0,
                        transform: hasRevealed ? 'translateY(0)' : translateStart,
                        transition: `all 0.7s cubic-bezier(0.4, 0, 0.2, 1)`,
                        transitionDelay: `${delay + index * staggerDelay}s`,
                    }}
                >
                    {child}
                </div>
            ))}
        </div>
    );
}
