'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

interface CharacterSplitProps {
    children: string;
    className?: string;
    delay?: number;
    staggerDelay?: number;
    highlightColor?: 'orange' | 'navy' | 'white';
    customHighlightColor?: string;
    animateOnScroll?: boolean;
    once?: boolean;
    effect?: 'slide' | 'blur';
}

/**
 * CharacterSplit - Animates text character by character
 * Supports slide-up (default) and blur-to-focus reveal effects
 *
 * @example
 * <CharacterSplit highlightColor="orange">Your Link to Mastery</CharacterSplit>
 * <CharacterSplit effect="blur" customHighlightColor="#ff6b6b">Premium</CharacterSplit>
 */
export default function CharacterSplit({
    children,
    className = '',
    delay = 0,
    staggerDelay = 0.03,
    highlightColor,
    customHighlightColor,
    animateOnScroll = true,
    once = true,
    effect = 'slide',
}: CharacterSplitProps) {
    const containerRef = useRef<HTMLSpanElement>(null);
    const isInView = useInView(containerRef, {
        once,
        margin: '-10% 0px -10% 0px'
    });
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
        if (isInView && !hasAnimated) {
            setHasAnimated(true);
        }
    }, [isInView, hasAnimated]);

    const shouldAnimate = animateOnScroll ? hasAnimated : true;

    const getHighlightClass = () => {
        if (customHighlightColor) return '';
        switch (highlightColor) {
            case 'orange':
                return 'text-orange-400';
            case 'navy':
                return 'text-navy-400';
            case 'white':
                return 'text-white';
            default:
                return '';
        }
    };

    const characters = children.split('');

    const getCharStyle = (index: number): React.CSSProperties => {
        const base: React.CSSProperties = {
            transitionDelay: `${delay + index * staggerDelay}s`,
        };

        if (customHighlightColor) {
            base.color = customHighlightColor;
        }

        if (effect === 'blur') {
            return {
                ...base,
                opacity: shouldAnimate ? 1 : 0,
                filter: shouldAnimate ? 'blur(0px)' : 'blur(8px)',
                transform: shouldAnimate ? 'scale(1)' : 'scale(0.8)',
            };
        }

        // Default slide effect
        return {
            ...base,
            opacity: shouldAnimate ? 1 : 0,
            transform: shouldAnimate ? 'translateY(0)' : 'translateY(20px)',
        };
    };

    return (
        <span
            ref={containerRef}
            className={`inline-block ${className}`}
            aria-label={children}
        >
            {characters.map((char, index) => (
                <span
                    key={index}
                    className={`inline-block transition-all duration-500 ${getHighlightClass()}`}
                    style={getCharStyle(index)}
                    aria-hidden="true"
                >
                    {char === ' ' ? '\u00A0' : char}
                </span>
            ))}
            <span className="sr-only">{children}</span>
        </span>
    );
}
