"use client";

import { useEffect, useRef } from "react";

export default function CanvasWave() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const scrollRef = useRef(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let t = 0;

        const handleScroll = () => {
            scrollRef.current = window.scrollY;
        };

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = 300;
        };

        const draw = () => {
            if (!ctx || !canvas) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Scroll-influenced amplitude
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            const scrollProgress = maxScroll > 0 ? scrollRef.current / maxScroll : 0;
            const amplitudeBoost = 1 + scrollProgress * 0.8;

            // Gradient color shift over time
            const hueShift = (t * 5) % 30;
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
            gradient.addColorStop(0, `rgba(245, ${130 + hueShift}, 32, 0.12)`);
            gradient.addColorStop(0.5, "rgba(13, 27, 42, 0.0)");
            gradient.addColorStop(1, `rgba(245, ${130 - hueShift}, 32, 0.12)`);

            ctx.fillStyle = gradient;

            // Wave 1 - scroll-influenced amplitude
            ctx.beginPath();
            ctx.moveTo(0, canvas.height);
            for (let i = 0; i <= canvas.width; i += 10) {
                const y = Math.sin(i * 0.003 + t) * 20 * amplitudeBoost
                    + Math.sin(i * 0.01 + t * 2) * 10 * amplitudeBoost
                    + (canvas.height - 50);
                ctx.lineTo(i, y);
            }
            ctx.lineTo(canvas.width, canvas.height);
            ctx.fill();

            // Wave 2
            ctx.fillStyle = `rgba(255, 255, 255, ${0.03 + scrollProgress * 0.02})`;
            ctx.beginPath();
            ctx.moveTo(0, canvas.height);
            for (let i = 0; i <= canvas.width; i += 15) {
                const y = Math.sin(i * 0.002 + t * 0.5) * 30 * amplitudeBoost
                    + Math.cos(i * 0.005 + t) * 15 * amplitudeBoost
                    + (canvas.height - 30);
                ctx.lineTo(i, y);
            }
            ctx.lineTo(canvas.width, canvas.height);
            ctx.fill();

            t += 0.02;
            animationFrameId = requestAnimationFrame(draw);
        };

        window.addEventListener("resize", resize);
        window.addEventListener("scroll", handleScroll, { passive: true });
        resize();
        draw();

        return () => {
            window.removeEventListener("resize", resize);
            window.removeEventListener("scroll", handleScroll);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute bottom-0 left-0 w-full h-[300px] pointer-events-none z-0 opacity-50"
            aria-hidden="true"
        />
    );
}
