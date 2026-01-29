'use client';

import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useInView } from 'framer-motion';

interface ScrollOdometerProps {
    value: number;
    className?: string;
    duration?: number;
    delay?: number;
    suffix?: string;
    prefix?: string;
    digitClassName?: string;
    once?: boolean;
    leadingZeros?: number;
    animateSuffix?: boolean;
}

/**
 * ScrollOdometer - Animated counter with rolling digit effect
 * Supports leading zeros and animated suffix reveal
 *
 * @example
 * <ScrollOdometer value={95} suffix="%" animateSuffix />
 * <ScrollOdometer value={7} leadingZeros={3} suffix="+" />
 */
export default function ScrollOdometer({
    value,
    className = '',
    duration = 1.5,
    delay = 0,
    suffix = '',
    prefix = '',
    digitClassName = '',
    once = true,
    leadingZeros = 0,
    animateSuffix = false,
}: ScrollOdometerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, {
        once,
        margin: '-10% 0px -10% 0px',
    });
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
        if (isInView && !hasAnimated) {
            setHasAnimated(true);
        }
    }, [isInView, hasAnimated]);

    // Convert value to padded string with optional leading zeros
    const valueString = leadingZeros > 0
        ? value.toString().padStart(leadingZeros, '0')
        : value.toString();
    const digits = valueString.split('');

    const digitStack = useMemo(() => ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'], []);

    return (
        <div
            ref={containerRef}
            className={`inline-flex items-baseline font-mono ${className}`}
            aria-label={`${prefix}${value}${suffix}`}
        >
            {prefix && (
                <span className="text-current opacity-70">{prefix}</span>
            )}

            <div className="inline-flex overflow-hidden">
                {digits.map((digit, index) => {
                    const targetDigit = parseInt(digit, 10);
                    const digitDelay = delay + (index * 0.1);

                    return (
                        <div
                            key={index}
                            className={`relative h-[1em] overflow-hidden ${digitClassName}`}
                            style={{ width: '0.65em' }}
                        >
                            <div
                                className="flex flex-col transition-transform"
                                style={{
                                    transform: hasAnimated
                                        ? `translateY(-${targetDigit * 10}%)`
                                        : 'translateY(0)',
                                    transitionDuration: `${duration}s`,
                                    transitionDelay: `${digitDelay}s`,
                                    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                                    willChange: 'transform',
                                }}
                            >
                                {digitStack.map((d) => (
                                    <span
                                        key={d}
                                        className="block h-[1em] leading-none text-center"
                                        aria-hidden="true"
                                    >
                                        {d}
                                    </span>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {suffix && (
                <span
                    className={`transition-all ${animateSuffix ? 'duration-700' : 'duration-500'}`}
                    style={{
                        opacity: hasAnimated ? 1 : 0,
                        transform: hasAnimated
                            ? 'translateY(0) scale(1)'
                            : animateSuffix
                                ? 'translateY(8px) scale(0.8)'
                                : 'translateY(0) scale(1)',
                        transitionDelay: `${delay + digits.length * 0.1 + 0.3}s`,
                    }}
                >
                    {suffix}
                </span>
            )}
        </div>
    );
}
