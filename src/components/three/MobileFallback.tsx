"use client";

import { useMemo } from "react";

export default function MobileFallback() {
  const globeDots = useMemo(() => {
    const dots: { x: number; y: number; size: number; opacity: number; isLand: boolean; isIndia: boolean }[] = [];

    for (let i = 0; i < 250; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 35;
      const x = 50 + Math.cos(angle) * radius;
      const y = 50 + Math.sin(angle) * radius;

      const distFromCenter = Math.sqrt((x - 50) ** 2 + (y - 50) ** 2);
      if (distFromCenter < 35) {
        const isIndia = x > 57 && x < 68 && y > 55 && y < 72;
        const isLand =
          isIndia ||
          (x > 55 && x < 78 && y > 30 && y < 55) || // Asia
          (x > 28 && x < 50 && y > 38 && y < 62) || // Africa
          (x > 18 && x < 38 && y > 28 && y < 48) || // Europe
          (x > 62 && x < 78 && y > 65 && y < 82) || // Australia
          (x > 58 && x < 75 && y > 55 && y < 75);   // SE Asia

        dots.push({
          x,
          y,
          size: isIndia ? 2 + Math.random() * 0.8 : isLand ? 1.5 + Math.random() * 1 : 0.8 + Math.random() * 0.5,
          opacity: isIndia ? 0.8 + Math.random() * 0.2 : isLand ? 0.6 + Math.random() * 0.3 : 0.15 + Math.random() * 0.15,
          isLand,
          isIndia,
        });
      }
    }

    return dots;
  }, []);

  const connections = useMemo(() => [
    { x1: 62, y1: 62, x2: 57, y2: 48, label: "" },
    { x1: 57, y1: 48, x2: 35, y2: 50, label: "" },
    { x1: 35, y1: 50, x2: 28, y2: 40, label: "" },
    { x1: 62, y1: 62, x2: 70, y2: 45, label: "" },
    { x1: 28, y1: 40, x2: 22, y2: 38, label: "" },
  ], []);

  const particles = useMemo(() => {
    return Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 0.8 + Math.random() * 1.5,
      delay: Math.random() * 5,
      duration: 8 + Math.random() * 7,
      isOrange: Math.random() > 0.6,
    }));
  }, []);

  const locationMarkers = useMemo(() => [
    { x: 62, y: 62, name: "Delhi", size: 1.2 },
    { x: 58, y: 65, name: "Mumbai", size: 1 },
    { x: 65, y: 68, name: "Bangalore", size: 1.1 },
    { x: 63, y: 64, name: "Hyderabad", size: 0.9 },
    { x: 28, y: 40, name: "London", size: 0.8 },
    { x: 22, y: 38, name: "SF", size: 0.8 },
  ], []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <svg
        className="w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <radialGradient id="globeGradient" cx="40%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#1a3a4a" stopOpacity="0.4" />
            <stop offset="70%" stopColor="#0d1f2d" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#060d1a" stopOpacity="1" />
          </radialGradient>

          <radialGradient id="atmosphereGradient" cx="50%" cy="50%" r="50%">
            <stop offset="80%" stopColor="#4A8CB8" stopOpacity="0" />
            <stop offset="92%" stopColor="#5AAAD0" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#4A8CB8" stopOpacity="0.2" />
          </radialGradient>

          <radialGradient id="indiaGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F5892A" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#F5892A" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Globe background */}
        <circle cx="50" cy="50" r="35" fill="url(#globeGradient)" />

        {/* Atmosphere glow */}
        <circle cx="50" cy="50" r="39" fill="url(#atmosphereGradient)" />

        {/* India highlight glow */}
        <circle cx="63" cy="63" r="10" fill="url(#indiaGlow)" />

        {/* Grid lines */}
        {[30, 40, 50, 60, 70].map((y) => (
          <ellipse
            key={`lat-${y}`}
            cx="50"
            cy={y}
            rx={Math.sqrt(35 ** 2 - (y - 50) ** 2) || 0}
            ry="2"
            fill="none"
            stroke="#2A5A6A"
            strokeWidth="0.15"
            opacity="0.4"
          />
        ))}

        {/* Connection lines with animated dash */}
        {connections.map((conn, i) => (
          <path
            key={`conn-${i}`}
            d={`M ${conn.x1} ${conn.y1} Q ${(conn.x1 + conn.x2) / 2} ${Math.min(conn.y1, conn.y2) - 6} ${conn.x2} ${conn.y2}`}
            fill="none"
            stroke="#F5892A"
            strokeWidth="0.35"
            opacity="0.5"
            filter="url(#glow)"
            strokeDasharray="2 1"
            className="animate-pulse"
            style={{ animationDelay: `${i * 0.4}s`, animationDuration: "2.5s" }}
          />
        ))}

        {/* Globe dots */}
        {globeDots.map((dot, i) => (
          <circle
            key={`dot-${i}`}
            cx={dot.x}
            cy={dot.y}
            r={dot.size * 0.3}
            fill={dot.isIndia ? "#F5892A" : dot.isLand ? "#5AAFCC" : "#2A4A5A"}
            opacity={dot.opacity}
            filter={dot.isIndia ? "url(#softGlow)" : undefined}
          />
        ))}

        {/* Location markers */}
        {locationMarkers.map((loc, i) => (
          <g key={loc.name}>
            {/* Glow base */}
            <circle
              cx={loc.x}
              cy={loc.y}
              r={loc.size * 2.5}
              fill="#F5892A"
              opacity="0.08"
            />
            {/* Core dot */}
            <circle
              cx={loc.x}
              cy={loc.y}
              r={loc.size}
              fill="#F5892A"
              filter="url(#glow)"
            />
            {/* Ping ring */}
            <circle
              cx={loc.x}
              cy={loc.y}
              r={loc.size * 2}
              fill="none"
              stroke="#F5892A"
              strokeWidth="0.25"
              opacity="0.6"
              className="animate-ping"
              style={{ animationDelay: `${i * 0.3}s`, animationDuration: "2s" }}
            />
          </g>
        ))}

        {/* Floating particles */}
        {particles.map((p) => (
          <circle
            key={`particle-${p.id}`}
            cx={p.x}
            cy={p.y}
            r={p.size * 0.12}
            fill={p.isOrange ? "#F5892A" : "#5AAAD0"}
            opacity={p.isOrange ? 0.4 : 0.25}
            className="animate-float"
            style={{
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}
      </svg>

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-navy-900/30 to-navy-900" />
    </div>
  );
}
