'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useInView } from 'framer-motion';

type CrossPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

interface CrossFlickerProps {
    position: CrossPosition;
    className?: string;
    color?: 'navy' | 'orange' | 'blue' | 'white';
    size?: 'sm' | 'md' | 'lg';
    delay?: number;
    once?: boolean;
}

/**
 * CrossFlicker - Decorative cross element with flicker animation
 * Inspired by Griflan grid decorators
 * 
 * @example
 * <div className="relative">
 *   <CrossFlicker position="top-left" color="orange" />
 *   <CrossFlicker position="bottom-right" color="blue" />
 *   <YourContent />
 * </div>
 */
export default function CrossFlicker({
    position,
    className = '',
    color = 'navy',
    size = 'md',
    delay = 0,
    once = true,
}: CrossFlickerProps) {
    const crossRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(crossRef, {
        once,
        margin: '0px',
    });
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
        if (isInView && !hasAnimated) {
            setHasAnimated(true);
        }
    }, [isInView, hasAnimated]);

    // Position classes
    const positionClasses: Record<CrossPosition, string> = {
        'top-left': 'top-0 left-0',
        'top-right': 'top-0 right-0',
        'bottom-left': 'bottom-0 left-0',
        'bottom-right': 'bottom-0 right-0',
    };

    // Size classes
    const sizeMap: Record<string, { width: string; thickness: string }> = {
        sm: { width: '8px', thickness: '1px' },
        md: { width: '12px', thickness: '1px' },
        lg: { width: '16px', thickness: '2px' },
    };

    // Color classes
    const colorClasses: Record<string, string> = {
        navy: 'bg-navy-400',
        orange: 'bg-orange-400',
        blue: 'bg-accent-blue',
        white: 'bg-white/50',
    };

    const { width, thickness } = sizeMap[size];
    const colorClass = colorClasses[color];

    return (
        <div
            ref={crossRef}
            className={`absolute ${positionClasses[position]} ${className}`}
            style={{
                width,
                height: width,
                opacity: hasAnimated ? 0.6 : 0,
                transform: hasAnimated ? 'scale(1)' : 'scale(0)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                transitionDelay: `${delay}s`,
            }}
            aria-hidden="true"
        >
            {/* Horizontal bar */}
            <div
                className={`absolute top-1/2 left-0 w-full -translate-y-1/2 ${colorClass}`}
                style={{ height: thickness }}
            />
            {/* Vertical bar */}
            <div
                className={`absolute left-1/2 top-0 h-full -translate-x-1/2 ${colorClass}`}
                style={{ width: thickness }}
            />
        </div>
    );
}
