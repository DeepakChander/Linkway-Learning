'use client';

import React, { useRef, useState, useCallback } from 'react';

interface BorderGlowProps {
    children: React.ReactNode;
    className?: string;
    glowColor?: 'orange' | 'blue' | 'white';
    customGlowColor?: string;
    glowIntensity?: 'subtle' | 'medium' | 'strong';
    glowRadius?: number;
    borderRadius?: string;
    disabled?: boolean;
}

/**
 * BorderGlow - Mouse-tracking gradient border effect
 * Supports custom glow color, configurable radius, and smooth enter/leave transitions
 *
 * @example
 * <BorderGlow glowColor="orange" glowRadius={800} glowIntensity="medium">
 *   <div className="p-6 bg-navy-800">Card content here</div>
 * </BorderGlow>
 */
export default function BorderGlow({
    children,
    className = '',
    glowColor = 'orange',
    customGlowColor,
    glowIntensity = 'medium',
    glowRadius = 600,
    borderRadius = '1rem',
    disabled = false,
}: BorderGlowProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
    const [isHovered, setIsHovered] = useState(false);

    const colorMap: Record<string, string> = {
        orange: 'rgba(245, 137, 42, VAR)',
        blue: 'rgba(59, 130, 246, VAR)',
        white: 'rgba(255, 255, 255, VAR)',
    };

    const intensityMap: Record<string, number> = {
        subtle: 0.3,
        medium: 0.5,
        strong: 0.8,
    };

    const glowOpacity = intensityMap[glowIntensity];

    const getGlowColors = () => {
        if (customGlowColor) {
            return {
                rgba: customGlowColor,
                faded: customGlowColor.replace(/[\d.]+\)$/, '0)'),
            };
        }
        return {
            rgba: colorMap[glowColor].replace('VAR', glowOpacity.toString()),
            faded: colorMap[glowColor].replace('VAR', '0'),
        };
    };

    const { rgba: glowRgba, faded: glowRgbaFaded } = getGlowColors();

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (disabled || !containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        setMousePosition({ x, y });
    }, [disabled]);

    const handleMouseEnter = useCallback(() => {
        if (!disabled) setIsHovered(true);
    }, [disabled]);

    const handleMouseLeave = useCallback(() => {
        setIsHovered(false);
    }, []);

    return (
        <div
            ref={containerRef}
            className={`relative ${className}`}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ borderRadius }}
        >
            {/* Glow border overlay */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    borderRadius,
                    opacity: isHovered ? 1 : 0,
                    transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    background: `radial-gradient(
            ${glowRadius}px circle at ${mousePosition.x}% ${mousePosition.y}%,
            ${glowRgba},
            ${glowRgbaFaded} 40%
          )`,
                    padding: '1px',
                }}
            >
                <div
                    className="absolute inset-[1px] bg-navy-800"
                    style={{ borderRadius: `calc(${borderRadius} - 1px)` }}
                />
            </div>

            {/* Static border */}
            <div
                className="absolute inset-0 pointer-events-none border border-white/10"
                style={{
                    borderRadius,
                    borderColor: isHovered ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                    transition: 'border-color 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
            />

            {/* Content */}
            <div className="relative z-10" style={{ borderRadius }}>
                {children}
            </div>
        </div>
    );
}
